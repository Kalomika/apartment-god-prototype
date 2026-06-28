import { blocked, nearCover, slide, solids } from './arena.js';
import { angleTo, clamp, dist, normalizeAngle, pointInRect } from './utils.js';
import { stageFor } from './state.js';

export function canSee(arena, watcher, target) {
  if (target.extracted || target.incapacitated) return false;
  const distance = dist(watcher, target);
  if (distance > watcher.stats.sight * 5.2) return false;
  const delta = Math.abs(normalizeAngle(angleTo(watcher, target) - watcher.facing));
  const cone = watcher.prone ? 0.7 : 1.35;
  if (delta > cone && distance > 95) return false;
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
  if (f.hp < 45 || f.dodge < 20 || f.block < 20) {
    const cover = nearCover(state.arena, f);
    if (cover) return { x: cover.x + cover.w / 2 + (f.x < enemy.x ? -52 : 52), y: cover.y + cover.h / 2 };
  }
  if (f.archetypeId === 'ninja' && d > 95) return flankPoint(f, enemy, 80);
  if (f.archetypeId === 'martial_artist') return flankPoint(f, enemy, 48);
  if (f.archetypeId === 'archer' && d < 260) return awayPoint(f, enemy, 170);
  if (f.archetypeId === 'marine' && d < 180) return awayPoint(f, enemy, 130);
  return flankPoint(f, enemy, f.weapon === 'rifle' || f.weapon === 'bow' ? 250 : 70);
}

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

export function moveFighter(state, f, dest, dt) {
  if (!dest || f.incapacitated || f.extracted || f.extracting) return;
  const a = angleTo(f, dest);
  f.facing = a;
  const stage = stageFor(f);
  const stealthMod = f.crouch || f.prone ? 0.55 : 1;
  const urgency = f.memory.command?.urgent ? 1.38 : 1;
  const speed = f.stats.speed * stage.speed * stealthMod * urgency * (f.stamina < 20 ? 0.68 : 1);
  const step = Math.min(dist(f, dest), speed * dt);
  const next = { x: f.x + Math.cos(a) * step, y: f.y + Math.sin(a) * step };
  const moved = slide(state.arena, f, next);
  f.x = moved.x; f.y = moved.y;
  f.pose = step > 1 ? (f.prone ? 'crawl' : f.crouch ? 'crouchWalk' : f.memory.command?.urgent ? 'rush' : 'walk') : 'idle';
  f.stamina = clamp(f.stamina - step * (f.memory.command?.urgent ? 0.018 : 0.006), 0, 100);
  f.noise = f.prone ? 8 : f.crouch ? 14 : f.archetypeId === 'ninja' ? 18 : f.memory.command?.urgent ? 55 : 34;
  f.hidden = f.prone || f.crouch || blocked(state.arena, f, 2);
}
