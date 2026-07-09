import { blocked, climbableAt, climbableNear, climbAccessPoint, elevationAt, inShadow, nearCover, nearWall, slide, solids, topPoint } from './arena.js';
import { angleTo, clamp, dist, normalizeAngle, pointInRect } from './utils.js';
import { stageFor } from './state.js';
import { nearestOpen, nextWaypoint } from './navmesh.js';
import { soundDetectionScore, visualDetectionScore } from './stealth.js';

const HUMAN_PACE_SCALE = 0.78;
const EVASIVE_PACE_SCALE = 1.08;

export function canSee(arena, watcher, target) {
  if (target.extracted || target.incapacitated) return false;
  const score = visualDetectionScore(arena, watcher, target);
  const aware = watcher.awareness?.suspicion || 0;
  const threshold = aware > 70 ? 38 : aware > 35 ? 48 : 58;
  return score >= threshold;
}

export function canHear(listener, target) {
  const ambient = listener.awareness?.ambientNoise ?? 18;
  return soundDetectionScore(listener, target, ambient) > 34;
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

function clearBodyLine(arena, a, b, pad = 17) {
  const steps = Math.max(2, Math.ceil(dist(a, b) / 10));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    if (blocked(arena, p, pad) && !canTraverseTop(arena, a, p)) return false;
  }
  return true;
}

export function chooseDestination(state, f, enemy) {
  const d = dist(f, enemy);
  if (isUnderFire(state, f)) return evasiveDestination(state, f, enemy);
  if (f.bleed?.rate > 0 || f.hp < 45 || f.dodge < 20 || f.block < 20) {
    const shadow = state.arena.shadows?.slice().sort((a, b) => dist(f, center(a)) - dist(f, center(b)))[0];
    if (shadow && !f.hideCooldown && (f.bleed?.rate > 0 || f.hp < 36)) return center(shadow);
    const cover = nearCover(state.arena, f);
    if (cover) return safeDest(state.arena, f, coverPointOrTop(state.arena, cover, f, enemy));
  }
  if (f.awareness?.phase === 'suspicious' && f.awareness.currentSearchPoint) return safeDest(state.arena, f, f.awareness.currentSearchPoint);
  if (f.wallLean && d < 210 && f.hp < 55) return { x: f.x, y: f.y };
  if (['ninja', 'shadow_ninja'].includes(f.archetypeId) && d > 95) return safeDest(state.arena, f, flankPoint(f, enemy, 80));
  if (f.archetypeId === 'martial_artist') return safeDest(state.arena, f, flankPoint(f, enemy, 48));
  if (f.archetypeId === 'archer' && d < 260) return safeDest(state.arena, f, awayPoint(f, enemy, 170));
  if (['marine', 'survival_commando'].includes(f.archetypeId) && d < 180) return safeDest(state.arena, f, awayPoint(f, enemy, 130));
  if (['suit_operative', 'field_agent'].includes(f.archetypeId) && d < 118) return safeDest(state.arena, f, awayPoint(f, enemy, f.archetypeId === 'field_agent' ? 122 : 96));
  return safeDest(state.arena, f, flankPoint(f, enemy, f.weapon === 'rifle' || f.weapon === 'bow' ? 250 : 70));
}

function evasiveDestination(state, f, enemy) {
  const arena = state.arena;
  const cover = nearCover(arena, f);
  if (cover) return safeDest(arena, f, coverPointOrTop(arena, cover, f, enemy, 38));
  const climbable = climbableNear(arena, f, 96);
  if (climbable) {
    const access = f.onObject === climbable.id ? topPoint(climbable, awayPoint(f, enemy, 55)) : climbAccessPoint(arena, climbable, f, 24);
    if (access) return access;
  }
  return safeDest(arena, f, awayPoint(f, enemy, 190));
}

function coverPointOrTop(arena, cover, f, enemy, gap = 56) {
  const access = climbableNear(arena, f, 42) === cover || pointInRect(f, cover, 42) ? topPoint(cover, f) : null;
  if (cover?.climbable && isUnderFire({ clock: f.suppressedUntil || 0 }, f) && access) return access;
  return coverPoint(arena, cover, f, enemy, gap) || access || center(cover);
}

function center(rect) { return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 }; }
function awayPoint(f, enemy, amount) { const a = angleTo(enemy, f); return { x: f.x + Math.cos(a) * amount, y: f.y + Math.sin(a) * amount }; }
function flankPoint(f, enemy, range) { if (!f.memory.flankSide) f.memory.flankSide = Math.random() < 0.5 ? 1 : -1; const base = angleTo(f, enemy); const a = base + f.memory.flankSide * 1.25; return { x: enemy.x - Math.cos(a) * range, y: enemy.y - Math.sin(a) * range }; }

function safeDest(arena, f, target) {
  const top = climbableAt(arena, target, -2);
  if (top && (f.onObject === top.id || pointInRect(f, top, 38))) return topPoint(top, target);
  const open = nearestOpen(arena, target);
  if (open && !blocked(arena, open, 18)) return open;
  const base = angleTo(f, target);
  const options = [0.55, -0.55, 1.05, -1.05, 1.65, -1.65, Math.PI].map(offset => ({ x: f.x + Math.cos(base + offset) * 145, y: f.y + Math.sin(base + offset) * 145 }));
  return options.map(p => nearestOpen(arena, p)).filter(Boolean).find(p => !blocked(arena, p, 18)) || { x: f.x, y: f.y };
}

export function moveFighter(state, f, dest, dt) {
  if (!dest || f.incapacitated || f.extracted || f.extracting) return;
  updateMobilityTimers(f, dt);
  const route = cachedRoute(state, f, dest);
  const moveAngle = angleTo(f, route);
  const turn = normalizeAngle(moveAngle - f.facing);
  f.facing = normalizeAngle(f.facing + clamp(turn, -dt * 7.5, dt * 7.5));
  const stage = stageFor(f);
  const defensive = isUnderFire(state, f) || f.memory.command?.type === 'roll_cover' || ['alert', 'evasion'].includes(f.awareness?.phase);
  const stealthMod = f.crouch || f.prone || f.shadowHidden ? 0.55 : 1;
  const urgency = defensive ? EVASIVE_PACE_SCALE : f.memory.command?.urgent ? 1.02 : 1;
  const limpMod = stage.id === 'purple' ? 0.72 : stage.id === 'red' ? 0.84 : 1;
  const climbMod = f.onObject ? 0.78 : 1;
  const speed = f.stats.speed * HUMAN_PACE_SCALE * stage.speed * stealthMod * urgency * limpMod * climbMod * (f.stamina < 20 ? 0.68 : 1);
  const step = Math.min(dist(f, route), speed * dt);
  const moved = steer(state, f, moveAngle, step, route);
  const movedAmount = dist(f, moved);
  updateStuckMemory(f, movedAmount, route);
  updateClimbState(state, f, moved, defensive);
  f.x = moved.x; f.y = moved.y;
  const terrainHeight = elevationAt(state.arena, f);
  f.elevation = approachNumber(f.elevation || 0, terrainHeight, dt * (f.climbT > 0 ? 8 : 5));
  f.shadowHidden = !f.hideCooldown && inShadow(state.arena, f) && (f.crouch || f.prone || f.stamina < 45 || f.bleed?.rate > 0 || defensive) && (f.noise || 0) < 58;
  f.wallLean = Boolean(nearWall(state.arena, f, 17) && (f.hp < 70 || f.bleed?.rate > 0 || f.stamina < 35 || defensive));
  f.pose = movedAmount > 0.55 ? movementPose(f, stage, f.stuckT > 0.4) : f.stuckT > 0.4 ? 'reposition' : f.climbT > 0 ? f.pose : f.wallLean ? 'wall_lean' : f.shadowHidden ? 'hide_shadow' : defensive ? 'duck' : 'idle_guard';
  f.stamina = clamp(f.stamina - movedAmount * (defensive ? 0.011 : 0.006), 0, 100);
  f.noise = f.prone ? 8 : f.crouch || f.shadowHidden ? 10 : ['ninja', 'shadow_ninja'].includes(f.archetypeId) ? 18 : defensive ? 49 : 30;
  if (f.awareness?.phase === 'alert') f.noise = Math.max(f.noise, 40);
  f.hidden = f.shadowHidden || f.prone || f.crouch || f.wallLean;
}

function updateMobilityTimers(f, dt) { f.climbT = Math.max(0, (f.climbT || 0) - dt); f.jumpT = Math.max(0, (f.jumpT || 0) - dt); }
function updateClimbState(state, f, moved, defensive) {
  const feature = climbableAt(state.arena, moved, -2);
  if (feature) {
    if (f.onObject !== feature.id) { f.climbT = 0.38; f.pose = 'climb_up'; }
    f.onObject = feature.id;
    return;
  }
  if (f.onObject) { f.jumpT = defensive ? 0.32 : 0.24; f.pose = defensive ? 'jump_down_escape' : 'drop_down'; }
  f.onObject = null;
}
function canTraverseTop(arena, f, p) { const feature = climbableAt(arena, p, -2); return Boolean(feature && (f.onObject === feature.id || pointInRect(f, feature, 38))); }
function approachNumber(value, target, amount) { if (Math.abs(value - target) <= amount) return target; return value + Math.sign(target - value) * amount; }

function cachedRoute(state, f, dest) {
  const cache = f.memory.route;
  const changed = !cache || dist(cache.dest, dest) > 42 || cache.until <= state.clock || dist(f, cache.route) < 18 || f.stuckT > 0.45 || !clearBodyLine(state.arena, f, cache.route, 17);
  if (!changed && (!blocked(state.arena, cache.route, 17) || canTraverseTop(state.arena, f, cache.route))) return cache.route;
  const route = canTraverseTop(state.arena, f, dest) ? dest : nextWaypoint(state.arena, f, dest);
  f.memory.route = { dest: { x: dest.x, y: dest.y }, route, until: state.clock + 0.55 };
  return route;
}

function updateStuckMemory(f, movedAmount, route) {
  if (movedAmount < 0.4 && dist(f, route) > 12) f.stuckT = (f.stuckT || 0) + 0.12;
  else f.stuckT = Math.max(0, (f.stuckT || 0) - 0.18);
  if (f.stuckT > 0.72) { f.memory.route = null; f.memory.flankSide *= -1; }
  if (f.stuckT > 1.2) { f.memory.command = null; f.memory.navTarget = null; f.memory.route = null; if (f.brain) { f.brain.dest = null; f.brain.until = 0; } f.stuckT = 0; }
}

function steer(state, f, a, step, route) {
  const arena = state.arena;
  if (step <= 0.1) return { x: f.x, y: f.y, a };
  const angles = [a, a + 0.28, a - 0.28, a + 0.58, a - 0.58, a + 0.95, a - 0.95, a + 1.45, a - 1.45, a + Math.PI];
  const candidates = [];
  for (const test of angles) {
    const next = { x: f.x + Math.cos(test) * step, y: f.y + Math.sin(test) * step };
    const top = climbableAt(arena, next, -2);
    const canClimb = top && (f.onObject === top.id || pointInRect(f, top, 34) || isUnderFire(state, f));
    if (blocked(arena, next, 16) && !canClimb) continue;
    const moved = canClimb ? next : slide(arena, f, next);
    if ((blocked(arena, moved, 16) && !canClimb) || dist(f, moved) <= 0.35) continue;
    candidates.push({ ...moved, a: test, score: dist(moved, route) + Math.abs(test - a) * 5 + (nearWall(arena, moved, 20) && !canClimb ? 18 : 0) });
  }
  if (candidates.length) return candidates.sort((a, b) => a.score - b.score)[0];
  return { x: f.x, y: f.y, a };
}

function movementPose(f, stage, stuck = false) {
  if (stuck) return 'reposition';
  if (f.climbT > 0) return f.pose || 'climb_up';
  if (f.jumpT > 0) return f.pose || 'jump_down_escape';
  if (f.prone) return 'crawl';
  if (f.crouch) return 'crouchWalk';
  if (f.memory.command?.type === 'roll_cover' || isUnderFire({ clock: f.memory.command?.until || 0 }, f)) return 'combat_dive';
  if (stage.id === 'purple') return 'stagger_limp';
  if (stage.id === 'red') return 'limp_run';
  if (f.memory.command?.urgent) return 'run';
  if (f.awareness?.phase === 'alert') return 'run';
  if (f.awareness?.phase === 'evasion') return 'careful_walk';
  return 'run';
}

function isUnderFire(state, f) { return Boolean(f.suppressedUntil && f.suppressedUntil > state.clock); }
function coverPoint(arena, cover, f, enemy, gap) { const c = center(cover); const away = enemy ? Math.atan2(c.y - enemy.y, c.x - enemy.x) : Math.atan2(f.y - c.y, f.x - c.x); const options = [{ x: c.x + Math.cos(away) * (Math.max(cover.w, cover.h) / 2 + gap), y: c.y + Math.sin(away) * (Math.max(cover.w, cover.h) / 2 + gap) }, { x: cover.x - gap, y: c.y }, { x: cover.x + cover.w + gap, y: c.y }, { x: c.x, y: cover.y - gap }, { x: c.x, y: cover.y + cover.h + gap }].filter(Boolean); return options.find(p => !blocked(arena, p, 17)); }
