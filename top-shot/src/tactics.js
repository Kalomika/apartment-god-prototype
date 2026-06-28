import { EFFECT_TTL } from './config.js';
import { blocked, nearCover, slide } from './arena.js';
import { angleTo, clamp, dist } from './utils.js';
import { clearLine } from './perception.js';

export function updateTacticalPosture(state, f, enemy, visible, dt) {
  f.duckT = Math.max(0, (f.duckT || 0) - dt);
  f.strafeT = Math.max(0, (f.strafeT || 0) - dt);
  f.braceT = Math.max(0, (f.braceT || 0) - dt);
  f.rollT = Math.max(0, (f.rollT || 0) - dt);
  f.rollCd = Math.max(0, (f.rollCd || 0) - dt);
  if (f.incapacitated || f.defeated || f.extracted || f.bleed?.bandaging) return;

  const underThreat = visible && clearLine(state.arena, enemy, f) && dist(f, enemy) > 80;
  if ((f.stuckT || 0) > 0.7 && f.rollCd <= 0 && f.stamina > 22) return tacticalRoll(state, f, enemy, 'unstick');
  if (underThreat && f.dodge > 48 && f.stamina > 45 && f.hp < 82 && f.rollCd <= 0) return tacticalRoll(state, f, enemy, 'evade');
  if (underThreat && f.wallLean && f.stamina < 55) return braceOnWall(state, f);
  if (underThreat && (f.block < 35 || f.dodge < 30 || f.hp < 62)) return duck(state, f);
  if (visible && f.wallLean && dist(f, enemy) < 260) return strafeWall(state, f, enemy);
}

function duck(state, f) {
  if (f.duckT > 0) return;
  f.duckT = 0.55;
  f.crouch = true;
  f.dodge = clamp(f.dodge + 8, 0, 100);
  f.pose = 'duck';
  state.effects.push({ type: 'dodge', x: f.x, y: f.y, ttl: EFFECT_TTL.dodge || 0.22 });
}

function strafeWall(state, f, enemy) {
  if (f.strafeT > 0) return;
  f.strafeT = 0.75;
  f.block = clamp(f.block + 6, 0, 100);
  f.pose = 'wall_strafe';
  const side = f.y < enemy.y ? -1 : 1;
  f.memory.command = { type: 'strafe', x: f.x, y: f.y + side * 54, urgent: false, until: state.clock + 0.8 };
  state.effects.push({ type: 'wallLean', x: f.x, y: f.y, ttl: EFFECT_TTL.wallLean || 0.35 });
}

function braceOnWall(state, f) {
  if (f.braceT > 0) return;
  f.braceT = 0.85;
  f.stamina = clamp(f.stamina + 8, 0, 100);
  f.block = clamp(f.block + 10, 0, 100);
  f.pose = 'wall_brace';
  state.effects.push({ type: 'wallLean', x: f.x, y: f.y, ttl: EFFECT_TTL.wallLean || 0.35 });
}

function tacticalRoll(state, f, enemy, reason) {
  const away = angleTo(enemy, f);
  const side = Math.random() < 0.5 ? 1 : -1;
  const angles = [away + side * 0.95, away - side * 0.95, away, away + Math.PI];
  for (const a of angles) {
    const target = { x: f.x + Math.cos(a) * 62, y: f.y + Math.sin(a) * 62 };
    if (blocked(state.arena, target, 14)) continue;
    const moved = slide(state.arena, f, target);
    if (dist(f, moved) < 18) continue;
    f.x = moved.x;
    f.y = moved.y;
    f.facing = a;
    f.rollT = 0.48;
    f.rollCd = reason === 'unstick' ? 1.4 : 2.6;
    f.dodge = clamp(f.dodge - 28, 0, 100);
    f.stamina = clamp(f.stamina - (reason === 'unstick' ? 16 : 24), 0, 100);
    f.pose = f.archetypeId === 'ninja' ? 'roll' : 'combat_roll';
    const cover = nearCover(state.arena, f);
    if (cover && reason !== 'unstick') f.memory.command = { type: 'roll_cover', x: cover.x + cover.w / 2, y: cover.y + cover.h / 2, urgent: false, until: state.clock + 1.25 };
    state.effects.push({ type: 'dive', x: f.x, y: f.y, ttl: EFFECT_TTL.dive || 0.42 });
    return;
  }
}
