import { blocked, inShadow, nearCover, nearWall, slide, solids } from './arena.js';
import { angleTo, clamp, dist, normalizeAngle, pointInRect } from './utils.js';
import { stageFor } from './state.js';

export function canSee(arena, watcher, target) {
  if (target.extracted || target.incapacitated) return false;
  const distance = dist(watcher, target);
  if (distance > watcher.stats.sight * 5.2) return false;
  const delta = Math.abs(normalizeAngle(angleTo(watcher, target) - watcher.facing));
  const cone = watcher.prone ? 0.7 : 1.35;
  if (delta > cone && distance > 95) return false;
  if (target.shadowHidden && distance > 88) return false;
  if (target.prone && distance > 170) return false;
  return clearLine(arena, watcher, target);
}

export function canHear(listener, target) {
  return target.noise > 0 && dist(listener, target) < listener.stats.hearing * target.noise * 0.18;
}

export function clearLine(arena, a, b) {
  const steps = Math.ceil(dist(a, b) / 14);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    if (solids(arena).some(box => pointInRect(p, box, 2))) return false;
  }
  return true;
}

export function chooseDestination(state, f, enemy) {
  const d = dist(f, enemy);
  if (f.bleed?.rate > 0 || f.hp < 45 || f.dodge < 20 || f.block < 20) {
    const shadow = state.arena.shadows?.sort((a, b) => dist(f, center(a)) - dist(f, center(b)))[0];
    if (shadow && !f.hideCooldown && (f.bleed?.rate > 0 || f.hp < 36)) return center(shadow);
    const cover = nearCover(state.arena, f);
    if (cover) return safeDest(state.arena, f, { x: cover.x + cover.w / 2 + (f.x < enemy.x ? -52 : 52), y: cover.y + cover.h / 2 });
  }
  if (f.wallLean && d < 210 && f.hp < 55) return { x: f.x, y: f.y };
  if (f.archetypeId === 'ninja' && d > 95) return safeDest(state.arena, f, flankPoint(f, enemy, 80));
  if (f.archetypeId === 'martial_artist') return safeDest(state.arena, f, flankPoint(f, enemy, 48));
  if (f.archetypeId === 'archer' && d < 260) return safeDest(state.arena, f, awayPoint(f, enemy, 170));
  if (f.archetypeId === 'marine' && d < 180) return safeDest(state.arena, f, awayPoint(f, enemy, 130));
  return safeDest(state.arena, f, flankPoint(f, enemy, f.weapon === 'rifle' || f.weapon === 'bow' ? 250 : 70));
}

function center(rect) { return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 }; }
function awayPoint(f, enemy, amount) {
  const a = angleTo(enemy, f);
  return { x: f.x + Math.cos(a) * amount, y: f.y + Math.sin(a) * amount };
}
function flankPoint(f, enemy, range) {
  const base = angleTo(f, enemy);
  const side = Math.random() < 0.5 ? 1 : -1;
  const a = base + side * 1.25;
  return { x: enemy.x - Math.cos(a) * range, y: enemy.y - Math.sin(a) * range };
}

function safeDest(arena, f, target) {
  if (!blocked(arena, target, 16)) return target;
  const base = angleTo(f, target);
  const options = [0.65, -0.65, 1.25, -1.25, Math.PI].map(offset => ({ x: f.x + Math.cos(base + offset) * 130, y: f.y + Math.sin(base + offset) * 130 }));
  return options.find(p => !blocked(arena, p, 16)) || { x: f.x, y: f.y };
}

export function moveFighter(state, f, dest, dt) {
  if (!dest || f.incapacitated || f.extracted || f.extracting) return;
  let a = angleTo(f, dest);
  f.facing = a;
  const stage = stageFor(f);
  const stealthMod = f.crouch || f.prone || f.shadowHidden ? 0.55 : 1;
  const urgency = f.memory.command?.urgent ? 1.38 : 1;
  const limpMod = stage.id === 'purple' ? 0.72 : stage.id === 'red' ? 0.84 : 1;
  const speed = f.stats.speed * stage.speed * stealthMod * urgency * limpMod * (f.stamina < 20 ? 0.68 : 1);
  const step = Math.min(dist(f, dest), speed * dt);
  const moved = steer(state.arena, f, a, step);
  f.x = moved.x; f.y = moved.y; a = moved.a;
  f.facing = a;
  f.shadowHidden = !f.hideCooldown && inShadow(state.arena, f) && (f.crouch || f.prone || f.stamina < 45 || f.bleed?.rate > 0);
  f.wallLean = Boolean(nearWall(state.arena, f, 17) && (f.hp < 52 || f.bleed?.rate > 0 || f.stamina < 22));
  f.pose = step > 1 ? movementPose(f, stage) : f.wallLean ? 'wall_lean' : f.shadowHidden ? 'hide_shadow' : 'idle';
  f.stamina = clamp(f.stamina - step * (f.memory.command?.urgent ? 0.018 : 0.006), 0, 100);
  f.noise = f.prone ? 8 : f.crouch || f.shadowHidden ? 10 : f.archetypeId === 'ninja' ? 18 : f.memory.command?.urgent ? 55 : 34;
  f.hidden = f.shadowHidden || f.prone || f.crouch;
}

function steer(arena, f, a, step) {
  if (step <= 0.1) return { x: f.x, y: f.y, a };
  const angles = [a, a + 0.65, a - 0.65, a + 1.2, a - 1.2, a + Math.PI];
  for (const test of angles) {
    const next = { x: f.x + Math.cos(test) * step, y: f.y + Math.sin(test) * step };
    const moved = slide(arena, f, next);
    if (dist(f, moved) > 0.35) return { ...moved, a: test };
  }
  return { x: f.x, y: f.y, a };
}

function movementPose(f, stage) {
  if (f.prone) return 'crawl';
  if (f.crouch) return 'crouchWalk';
  if (stage.id === 'purple') return 'stagger_limp';
  if (stage.id === 'red') return 'limp_run';
  if (f.memory.command?.urgent) return 'rush';
  return 'walk';
}
