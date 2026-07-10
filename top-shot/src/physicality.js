import { blocked, clampArena, nearWall } from './arena.js';
import { angleTo, clamp, dist, rand } from './utils.js';

const BODY_RADIUS = 30;
const MELEE_PERSONAL_SPACE = 46;
const DEBRIS_FRICTION = 0.88;

export function updatePhysicality(state, dt) {
  state.debris ||= [];
  separateFighters(state, dt);
  updateDebris(state, dt);
}

export function spawnImpactDebris(state, x, y, kind = 'rock', count = 3, source = null) {
  state.debris ||= [];
  const baseAngle = source ? angleTo(source, { x, y }) : rand(-Math.PI, Math.PI);
  const material = kind === 'ricochet' || kind === 'metal' ? 'metal' : kind === 'shot' ? 'rock' : 'concrete';
  for (let i = 0; i < count; i += 1) {
    const a = baseAngle + rand(-1.35, 1.35) + Math.PI;
    const speed = rand(36, material === 'metal' ? 150 : 105);
    const piece = clampArena({ x: x + rand(-5, 5), y: y + rand(-5, 5) }, 8);
    state.debris.push({
      id: `debris_${Math.round(state.clock * 1000)}_${Math.random().toString(36).slice(2)}`,
      type: material,
      x: piece.x,
      y: piece.y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      radius: rand(5, 10),
      throwable: true,
      rest: false,
      ttl: 999,
      spin: rand(-4, 4),
      hitT: 0.22
    });
  }
  state.effects.push({ type: 'debris_spray', x, y, ttl: 0.38, kind: material });
  trimDebris(state);
}

export function nearestThrowableDebris(state, fighter, range = 64) {
  state.debris ||= [];
  return state.debris
    .filter(piece => piece.throwable && !piece.held && !piece.inFlight && piece.rest !== false && dist(piece, fighter) <= range)
    .sort((a, b) => dist(a, fighter) - dist(b, fighter))[0] || null;
}

export function throwDebrisAt(state, fighter, target, piece) {
  if (!piece || !target) return false;
  piece.held = true;
  piece.throwable = false;
  state.debris = (state.debris || []).filter(item => item !== piece);
  const a = angleTo(fighter, target) + rand(-0.11, 0.11);
  const speed = piece.type === 'metal' ? 430 : 380;
  state.projectiles.push({
    type: 'debris_throw',
    team: fighter.team,
    owner: fighter.name,
    x: fighter.x + Math.cos(a) * 22,
    y: fighter.y + Math.sin(a) * 22,
    vx: Math.cos(a) * speed,
    vy: Math.sin(a) * speed,
    damage: piece.type === 'metal' ? 7 : 5,
    dizzy: piece.type === 'metal' ? 0.85 : 0.62,
    ttl: 1.6,
    stuck: false,
    debrisType: piece.type
  });
  fighter.pose = 'throw_item';
  fighter.cooldown = Math.max(fighter.cooldown || 0, 0.42);
  fighter.stamina = clamp(fighter.stamina - 4, 0, 100);
  state.effects.push({ type: 'debris_throw', x: fighter.x, y: fighter.y, x2: target.x, y2: target.y, ttl: 0.2 });
  return true;
}

function separateFighters(state, dt) {
  const fighters = state.fighters || [];
  if (fighters.length < 2) return;
  for (let i = 0; i < fighters.length; i += 1) {
    for (let j = i + 1; j < fighters.length; j += 1) {
      const a = fighters[i];
      const b = fighters[j];
      if (a.extracted || b.extracted || a.deploying || b.deploying) continue;
      const minDist = a.currentMove || b.currentMove ? MELEE_PERSONAL_SPACE : BODY_RADIUS * 1.8;
      const d = Math.max(0.001, dist(a, b));
      if (d >= minDist) continue;
      const push = (minDist - d) * 0.5;
      const nx = (a.x - b.x) / d;
      const ny = (a.y - b.y) / d;
      const pa = clampArena({ x: a.x + nx * push, y: a.y + ny * push }, 16);
      const pb = clampArena({ x: b.x - nx * push, y: b.y - ny * push }, 16);
      if (!blocked(state.arena, pa, 16)) { a.x = pa.x; a.y = pa.y; }
      if (!blocked(state.arena, pb, 16)) { b.x = pb.x; b.y = pb.y; }
      a.collisionT = b.collisionT = 0.18;
      if (!a.currentMove) a.pose = nearWall(state.arena, a, 20) ? 'wall_pin' : 'brace_contact';
      if (!b.currentMove) b.pose = nearWall(state.arena, b, 20) ? 'wall_pin' : 'brace_contact';
      a.stamina = clamp(a.stamina - dt * 2.5, 0, 100);
      b.stamina = clamp(b.stamina - dt * 2.5, 0, 100);
    }
  }
}

function updateDebris(state, dt) {
  for (const piece of state.debris) {
    piece.hitT = Math.max(0, (piece.hitT || 0) - dt);
    if (piece.rest) continue;
    const next = { x: piece.x + piece.vx * dt, y: piece.y + piece.vy * dt };
    if (blocked(state.arena, next, Math.max(4, piece.radius * 0.5))) {
      piece.vx *= -0.26;
      piece.vy *= -0.26;
    } else {
      piece.x = next.x;
      piece.y = next.y;
    }
    piece.vx *= Math.pow(DEBRIS_FRICTION, dt * 18);
    piece.vy *= Math.pow(DEBRIS_FRICTION, dt * 18);
    if (Math.hypot(piece.vx, piece.vy) < 8) {
      piece.vx = 0;
      piece.vy = 0;
      piece.rest = true;
    }
  }
  trimDebris(state);
}

function trimDebris(state) {
  if (!state.debris || state.debris.length <= 80) return;
  state.debris = state.debris.slice(state.debris.length - 80);
}
