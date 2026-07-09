import { climbableNear, coverPoint, nearCover, topPoint } from './arena.js';
import { angleTo, clamp, dist } from './utils.js';
import { stealthSearchPlan } from './stealth.js';

export function updateBrain(state, f, enemy, visible, audible) {
  if (!f.brain) f.brain = { intent: 'scan', dest: null, until: 0, lastHp: f.hp };
  const forced = f.memory.command;
  const underFire = f.suppressedUntil && f.suppressedUntil > state.clock;
  const shock = Math.abs((f.brain.lastHp ?? f.hp) - f.hp) > 5 || f.bleed?.rate > 0 || underFire;
  f.brain.lastHp = f.hp;
  if (forced) {
    f.intent = `coach_${forced.type}`;
    f.brain.until = Math.max(f.brain.until, state.clock + 0.4);
    return;
  }
  if (!shock && f.brain.until > state.clock && f.brain.dest && dist(f, f.brain.dest) > 18) {
    f.intent = f.brain.intent;
    return;
  }
  const plan = choosePlan(state, f, enemy, visible, audible);
  f.brain.intent = plan.intent;
  f.brain.dest = plan.dest;
  f.brain.until = state.clock + plan.hold;
  f.intent = plan.intent;
}

export function brainDestination(f) {
  return f.brain?.dest || null;
}

function choosePlan(state, f, enemy, visible, audible) {
  const d = dist(f, enemy);
  const underFire = f.suppressedUntil && f.suppressedUntil > state.clock;
  if (underFire) return coverSurvivalPlan(state, f, enemy, 'break_contact_cover');
  if (f.bleed?.rate > 0 || f.hp < 48 || f.stamina < 20 || f.dodge < 18 || f.block < 18) return coverSurvivalPlan(state, f, enemy, 'preserve_life');

  if (isStealthArchetype(f)) {
    if (f.resources?.smoke > 0 && visible && d > 90) return coverSurvivalPlan(state, f, enemy, 'smoke_or_shadow');
    const stealthPlan = stealthSearchPlan(state, f, enemy, visible, audible);
    if (stealthPlan) return stealthPlan;
    if (!visible) return { intent: 'stealth_stalk', dest: shadowOrFlank(state, f, enemy), hold: 1.4 };
    if (d > 95) return { intent: 'stealth_flank', dest: shadowOrFlank(state, f, enemy), hold: 1.15 };
    return { intent: 'blade_ambush', dest: enemyPoint(enemy), hold: 0.65 };
  }

  const stealthPlan = stealthSearchPlan(state, f, enemy, visible, audible);
  if (stealthPlan && !visible) return stealthPlan;

  if (!visible && f.memory.lastSeen) return { intent: 'investigate', dest: { x: f.memory.lastSeen.x, y: f.memory.lastSeen.y }, hold: 1.25 };
  if (!visible && audible) return { intent: 'listen_push', dest: cautiousPoint(f, enemy, 120), hold: 1.0 };
  if (!visible) return { intent: state.stealth?.phase === 'recovery' ? 'recover_patrol' : 'scan', dest: patrolPoint(state, f), hold: 1.4 };

  if (hasRangedWeapon(f)) {
    if (!f.coverPinned || d < 120 || d > 460) return coverSurvivalPlan(state, f, enemy, 'take_cover_before_fire');
    return { intent: 'cover_peek_fire', dest: { x: f.x, y: f.y }, hold: 0.75 };
  }

  if (f.archetypeId === 'martial_artist') {
    if (d > 58) return { intent: 'close_cqc', dest: orbitPoint(f, enemy, 42), hold: 0.75 };
    return { intent: 'exchange_cqc', dest: enemyPoint(enemy), hold: 0.55 };
  }
  return { intent: 'pressure', dest: orbitPoint(f, enemy, 82), hold: 0.9 };
}

function coverSurvivalPlan(state, f, enemy, intent) {
  const cover = nearCover(state.arena, f);
  if (cover) return { intent, dest: coverPoint(state.arena, cover, f, enemy, 30) || center(cover), hold: 1.15 };
  const climbable = climbableNear(state.arena, f, 180);
  if (climbable && isStealthArchetype(f)) return { intent: 'vertical_escape', dest: topPoint(climbable, f), hold: 1.2 };
  const shadow = state.arena.shadows?.slice().sort((a, b) => dist(f, center(a)) - dist(f, center(b)))[0];
  if (shadow && !f.hideCooldown) return { intent: 'recover_shadow', dest: center(shadow), hold: 1.25 };
  return { intent: 'break_contact', dest: awayPoint(f, enemy, 210), hold: 1.0 };
}

function shadowOrFlank(state, f, enemy) {
  const shadow = state.arena.shadows?.slice().sort((a, b) => dist(f, center(a)) - dist(f, center(b)))[0];
  if (shadow && dist(f, center(shadow)) < 380) return center(shadow);
  const climbable = climbableNear(state.arena, f, 220);
  if (climbable) return topPoint(climbable, f);
  return orbitPoint(f, enemy, 92);
}

function hasRangedWeapon(f) { return ['archer', 'marine', 'suit_operative', 'survival_commando', 'field_agent'].includes(f.archetypeId); }
function isStealthArchetype(f) { return ['ninja', 'shadow_ninja', 'archer'].includes(f.archetypeId); }
function center(r) { return { x: r.x + r.w / 2, y: r.y + r.h / 2 }; }
function enemyPoint(enemy) { return { x: enemy.x, y: enemy.y }; }
function awayPoint(f, enemy, amount) { const a = angleTo(enemy, f); return clampPoint({ x: f.x + Math.cos(a) * amount, y: f.y + Math.sin(a) * amount }); }
function cautiousPoint(f, enemy, range) { const a = angleTo(f, enemy); return clampPoint({ x: enemy.x - Math.cos(a) * range, y: enemy.y - Math.sin(a) * range }); }
function orbitPoint(f, enemy, range) { if (!f.brainSide) f.brainSide = Math.random() < 0.5 ? 1 : -1; const a = angleTo(f, enemy) + f.brainSide * 1.1; return clampPoint({ x: enemy.x - Math.cos(a) * range, y: enemy.y - Math.sin(a) * range }); }
function patrolPoint(state, f) { const t = Math.floor(state.clock / 2 + (f.team === 'A' ? 0 : 2)) % 4; const pts = [{ x: 180, y: 160 }, { x: 780, y: 160 }, { x: 780, y: 560 }, { x: 180, y: 560 }]; return pts[t]; }
function clampPoint(p) { return { x: clamp(p.x, 78, 882), y: clamp(p.y, 78, 642) }; }
