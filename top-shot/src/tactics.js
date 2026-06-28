import { EFFECT_TTL } from './config.js';
import { clearLine } from './perception.js';
import { clamp, dist } from './utils.js';

export function updateTacticalPosture(state, f, enemy, visible, dt) {
  f.duckT = Math.max(0, (f.duckT || 0) - dt);
  f.strafeT = Math.max(0, (f.strafeT || 0) - dt);
  f.braceT = Math.max(0, (f.braceT || 0) - dt);
  if (f.incapacitated || f.defeated || f.extracted || f.bleed?.bandaging) return;

  const underThreat = visible && clearLine(state.arena, enemy, f) && dist(f, enemy) > 80;
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
