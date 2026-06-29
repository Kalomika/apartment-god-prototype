import { coverPoint, nearCover } from './arena.js';
import { angleTo, clamp, dist } from './utils.js';

export function updateBrain(state, f, enemy, visible, audible) {
  if (!f.brain) f.brain = { intent: 'scan', dest: null, until: 0, lastHp: f.hp };
  const forced = f.memory.command;
  const shock = Math.abs((f.brain.lastHp ?? f.hp) - f.hp) > 9 || f.bleed?.rate > 0;
  f.brain.lastHp = f.hp;
  if (forced) {
    f.intent = `coach_${forced.type}`;
    f.brain.until = Math.max(f.brain.until, state.clock + 0.4);
    return;
  }
  if (!shock && f.brain.until > state.clock && f.brain.dest && dist(f, f.brain.dest) > 24) {
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
  if (f.bleed?.rate > 0 || f.hp < 34) return survivalPlan(state, f, enemy);
  if (!visible && f.memory.lastSeen) return { intent: 'investigate', dest: { x: f.memory.lastSeen.x, y: f.memory.lastSeen.y }, hold: 1.25 };
  if (!visible && audible) return { intent: 'listen_push', dest: cautiousPoint(f, enemy, 120), hold: 1.0 };
  if (!visible) return { intent: 'scan', dest: patrolPoint(state, f), hold: 1.4 };
  if (['archer', 'marine', 'suit_operative', 'survival_commando'].includes(f.archetypeId)) {
    const desired = f.archetypeId === 'archer' ? 190 : f.archetypeId === 'suit_operative' ? 112 : 150;
    const orbit = f.archetypeId === 'archer' ? 280 : f.archetypeId === 'suit_operative' ? 175 : 230;
    if (d < 165) return { intent: 'evade_to_range', dest: awayPoint(f, enemy, desired), hold: 1.05 };
    if (d > 430) return { intent: 'close_to_range', dest: cautiousPoint(f, enemy, 260), hold: 1.0 };
    return { intent: f.archetypeId === 'suit_operative' ? 'pistol_angle' : 'hold_angle', dest: orbitPoint(f, enemy, orbit), hold: 1.2 };
  }
  if (f.archetypeId === 'ninja') {
    if (d > 110) return { intent: 'stalk_flank', dest: orbitPoint(f, enemy, 78), hold: 0.95 };
    return { intent: 'blade_pressure', dest: enemyPoint(enemy), hold: 0.65 };
  }
  if (f.archetypeId === 'martial_artist') {
    if (d > 58) return { intent: 'close_cqc', dest: orbitPoint(f, enemy, 42), hold: 0.75 };
    return { intent: 'exchange_cqc', dest: enemyPoint(enemy), hold: 0.55 };
  }
  return { intent: 'pressure', dest: orbitPoint(f, enemy, 82), hold: 0.9 };
}

function survivalPlan(state, f, enemy) {
  const cover = nearCover(state.arena, f);
  if (cover) return { intent: 'recover_cover', dest: coverPoint(state.arena, cover, f, enemy) || center(cover), hold: 1.25 };
  const shadow = state.arena.shadows?.slice().sort((a, b) => dist(f, center(a)) - dist(f, center(b)))[0];
  if (shadow && !f.hideCooldown) return { intent: 'recover_shadow', dest: center(shadow), hold: 1.25 };
  return { intent: 'break_contact', dest: awayPoint(f, enemy, 190), hold: 1.0 };
}

function center(r) { return { x: r.x + r.w / 2, y: r.y + r.h / 2 }; }
function enemyPoint(enemy) { return { x: enemy.x, y: enemy.y }; }
function awayPoint(f, enemy, amount) { const a = angleTo(enemy, f); return clampPoint({ x: f.x + Math.cos(a) * amount, y: f.y + Math.sin(a) * amount }); }
function cautiousPoint(f, enemy, range) { const a = angleTo(f, enemy); return clampPoint({ x: enemy.x - Math.cos(a) * range, y: enemy.y - Math.sin(a) * range }); }
function orbitPoint(f, enemy, range) { if (!f.brainSide) f.brainSide = Math.random() < 0.5 ? 1 : -1; const a = angleTo(f, enemy) + f.brainSide * 1.1; return clampPoint({ x: enemy.x - Math.cos(a) * range, y: enemy.y - Math.sin(a) * range }); }
function patrolPoint(state, f) { const t = Math.floor(state.clock / 2 + (f.team === 'A' ? 0 : 2)) % 4; const pts = [{ x: 180, y: 160 }, { x: 780, y: 160 }, { x: 780, y: 560 }, { x: 180, y: 560 }]; return pts[t]; }
function clampPoint(p) { return { x: clamp(p.x, 78, 882), y: clamp(p.y, 78, 642) }; }
