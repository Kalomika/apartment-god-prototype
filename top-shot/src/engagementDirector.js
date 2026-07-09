import { climbableNear, coverPoint, nearCover, topPoint } from './arena.js';
import { angleTo, clamp, dist, rand } from './utils.js';
import { addLog } from './state.js';

const MIN_STALL_BEFORE_ESCALATION = 1.55;
const MAX_COVER_HOLD = 2.25;
const ATTACK_WINDOW = 0.62;

export function updateEngagementDirector(state, f, enemy, visible, audible, dt) {
  if (!f || !enemy || f.incapacitated || f.defeated || f.extracted || f.extracting) return;
  f.director ||= {
    state: 'opening',
    lastHp: f.hp,
    lastMeaningfulAt: state.clock,
    lastEscalationAt: -99,
    attackWindowUntil: 0,
    holdCoverUntil: 0,
    lastIntent: ''
  };

  const d = dist(f, enemy);
  const underFire = Boolean(f.suppressedUntil && f.suppressedUntil > state.clock);
  const injured = f.hp < 65 || (f.bleed?.rate || 0) > 0 || (f.woundT || 0) > 0.12;
  const enemyVulnerable = enemy.hp < f.hp - 12 || (enemy.bleed?.rate || 0) > 0 || (enemy.woundT || 0) > 0.1 || enemy.coverPinned && !enemy.peekT;
  const inContactCover = Boolean(f.coverPinned || f.wallLean);
  const hidden = Boolean(f.hidden || f.shadowHidden || f.prone || f.crouch || inContactCover);
  const didSomething = Boolean(f.currentMove || f.peekT > 0 || f.rangedCd > 0.75 || f.meleeCd > 0.25 || f.diveT > 0 || f.rollT > 0 || f.grapple?.active || f.bleed?.bandaging);
  if (didSomething) f.director.lastMeaningfulAt = state.clock;
  if (Math.abs((f.director.lastHp ?? f.hp) - f.hp) > 0.8) f.director.lastMeaningfulAt = state.clock;
  f.director.lastHp = f.hp;

  if (underFire && !inContactCover) {
    forceCoverMove(state, f, enemy, 'emergency_cover');
    f.director.state = 'preserve';
    f.director.holdCoverUntil = state.clock + 1.2;
    return;
  }

  if (injured && !hidden) {
    forceCoverMove(state, f, enemy, 'wounded_cover');
    f.director.state = 'preserve';
    f.director.holdCoverUntil = state.clock + 1.45;
    return;
  }

  if (inContactCover && injured && state.clock < f.director.holdCoverUntil) {
    f.director.state = 'recover_cover';
    f.intent = 'recover_cover';
    return;
  }

  const stalled = state.clock - f.director.lastMeaningfulAt > MIN_STALL_BEFORE_ESCALATION;
  const heldCoverTooLong = inContactCover && state.clock - (f.cover?.since || state.clock) > MAX_COVER_HOLD;
  const shouldEscalate = enemyVulnerable || stalled || heldCoverTooLong || state.clock - f.director.lastEscalationAt > 3.8;
  if (!shouldEscalate) {
    f.director.state = inContactCover ? 'hold_cover' : visible || audible ? 'stalk' : 'search';
    return;
  }

  escalate(state, f, enemy, visible, d, inContactCover, enemyVulnerable);
}

export function hasAttackWindow(state, f) {
  return Boolean(f?.director?.attackWindowUntil && f.director.attackWindowUntil > state.clock);
}

function escalate(state, f, enemy, visible, d, inContactCover, enemyVulnerable) {
  f.director.lastEscalationAt = state.clock;
  f.director.lastMeaningfulAt = state.clock;

  if (inContactCover && visible && canShoot(f)) {
    f.peekT = Math.max(f.peekT || 0, 0.38);
    f.peekCooldown = 0;
    f.director.attackWindowUntil = state.clock + ATTACK_WINDOW;
    f.director.state = enemyVulnerable ? 'finish_peek' : 'cover_peek_pressure';
    f.intent = f.director.state;
    maybeLog(state, f, 'leans out for a controlled shot.');
    return;
  }

  if (isStealth(f)) {
    const high = climbableNear(state.arena, f, 260);
    if (high && d > 90 && !f.grapple?.active && (!f.grappleCd || f.grappleCd <= state.clock)) {
      f.director.state = 'vertical_reposition';
      f.memory.command = { type: 'grapple_hook', x: topPoint(high, f).x, y: topPoint(high, f).y, urgent: true, until: state.clock + 1.5 };
      f.intent = 'vertical_reposition';
      return;
    }
    f.memory.command = { type: d < 70 ? 'cqc' : 'strafe', ...flankPoint(f, enemy, d < 70 ? 38 : 120), urgent: true, until: state.clock + 1.5 };
    f.director.state = d < 70 ? 'ambush_cqc' : 'stealth_flank';
    f.intent = f.director.state;
    return;
  }

  if (canShoot(f)) {
    const cover = nearCover(state.arena, f);
    if (!inContactCover && cover) {
      const p = coverPoint(state.arena, cover, f, enemy, 28);
      if (p) {
        f.memory.command = { type: 'roll_cover', x: p.x, y: p.y, urgent: true, until: state.clock + 1.6 };
        f.diveT = Math.max(f.diveT || 0, 0.42);
        f.rollT = Math.max(f.rollT || 0, 0.52);
        f.director.state = 'bound_to_cover';
        f.intent = 'bound_to_cover';
        return;
      }
    }
    f.director.attackWindowUntil = state.clock + ATTACK_WINDOW;
    f.memory.command = { type: 'ranged', ...rangeBandPoint(f, enemy, 180), urgent: false, until: state.clock + 1.2 };
    f.director.state = 'force_pressure';
    f.intent = 'force_pressure';
    return;
  }

  if (d > 56) {
    f.memory.command = { type: 'cqc', x: enemy.x, y: enemy.y, urgent: true, until: state.clock + 1.4 };
    f.director.state = 'close_for_exchange';
    f.intent = 'close_for_exchange';
  } else {
    f.director.attackWindowUntil = state.clock + ATTACK_WINDOW;
    f.director.state = 'strike_now';
    f.intent = 'strike_now';
  }
}

function forceCoverMove(state, f, enemy, intent) {
  const cover = nearCover(state.arena, f);
  let p = cover ? coverPoint(state.arena, cover, f, enemy, 28) : null;
  if (!p && isStealth(f)) {
    const high = climbableNear(state.arena, f, 220);
    if (high) p = topPoint(high, f);
  }
  if (!p) p = rangeBandPoint(f, enemy, 210);
  f.memory.command = { type: 'roll_cover', x: p.x, y: p.y, urgent: true, until: state.clock + 1.8 };
  f.diveT = Math.max(f.diveT || 0, 0.54);
  f.rollT = Math.max(f.rollT || 0, 0.64);
  f.intent = intent;
  if (!f.director?.lastPreserveLog || f.director.lastPreserveLog < state.clock - 1.6) {
    maybeLog(state, f, intent === 'wounded_cover' ? 'clutches the wound and staggers for cover.' : 'dives for cover and breaks the firing line.');
    f.director.lastPreserveLog = state.clock;
  }
}

function maybeLog(state, f, text) {
  if (f.director?.lastDirectorLog && f.director.lastDirectorLog > state.clock - 1.1) return;
  addLog(state, `${f.name} ${text}`);
  f.director.lastDirectorLog = state.clock;
}

function canShoot(f) { return ['rifle', 'pistol', 'bow'].includes(f.weapon) || ['marine', 'suit_operative', 'survival_commando', 'field_agent', 'archer'].includes(f.archetypeId); }
function isStealth(f) { return ['ninja', 'shadow_ninja', 'archer'].includes(f.archetypeId); }
function flankPoint(f, enemy, range) { const side = f.brainSide || f.memory?.flankSide || (Math.random() < 0.5 ? 1 : -1); const a = angleTo(f, enemy) + side * rand(0.9, 1.35); return { x: clamp(enemy.x - Math.cos(a) * range, 76, 884), y: clamp(enemy.y - Math.sin(a) * range, 76, 644) }; }
function rangeBandPoint(f, enemy, range) { const a = angleTo(enemy, f); return { x: clamp(enemy.x + Math.cos(a) * range, 76, 884), y: clamp(enemy.y + Math.sin(a) * range, 76, 644) }; }
