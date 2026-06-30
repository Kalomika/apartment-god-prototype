import { ARENA_H, ARENA_W } from './config.js';
import { clamp, pointInRect } from './utils.js';

export function createArena() {
  const blocks = [
    r('north_block', 112, 84, 110, 86),
    r('long_mid_block', 338, 86, 86, 178),
    r('upper_right_block', 612, 112, 164, 136),
    r('east_block', 810, 352, 96, 130),
    r('lower_left_block', 86, 514, 118, 122),
    r('lower_mid_block', 394, 516, 108, 82),
    r('lower_right_block', 604, 558, 190, 64)
  ];
  return {
    name: 'Diagnostic Terrain Layout', w: ARENA_W, h: ARENA_H,
    spawnA: { x: 205, y: 618, facing: -0.55, dropY: -120 },
    spawnB: { x: 784, y: 116, facing: 2.55, dropY: -190 },
    walls: blocks,
    shadows: [
      r('shade_north', 92, 62, 150, 126),
      r('shade_mid', 318, 72, 128, 216),
      r('shade_right', 590, 98, 208, 182),
      r('shade_lower_left', 68, 494, 160, 166),
      r('shade_lower_right', 574, 336, 200, 204)
    ],
    breakables: [r('small_crates_a', 450, 310, 54, 38, 35)],
    weaponSpawns: [],
    debris: []
  };
}

function r(id, x, y, w, h, hp = null, extra = {}) { return { id, x, y, w, h, hp, broken: false, ...extra }; }
export function solids(arena) { return [...arena.walls, ...arena.breakables.filter(b => !b.broken)]; }
export function clampArena(p, radius = 14) { return { x: clamp(p.x, 50 + radius, ARENA_W - 50 - radius), y: clamp(p.y, 50 + radius, ARENA_H - 50 - radius) }; }
export function blocked(arena, p, pad = 12) { return solids(arena).some(box => pointInRect(p, box, pad)); }
export function inShadow(arena, p) { return arena.shadows?.some(zone => pointInRect(p, zone, 0)) || false; }
export function nearWall(arena, p, distance = 18) { return solids(arena).find(box => pointInRect(p, box, distance) && !pointInRect(p, box, -2)) || null; }
export function slide(arena, f, next) {
  const p = clampArena(next, 16);
  if (!blocked(arena, p, 13)) return p;
  const xOnly = clampArena({ x: p.x, y: f.y }, 16);
  if (!blocked(arena, xOnly, 13)) return xOnly;
  const yOnly = clampArena({ x: f.x, y: p.y }, 16);
  if (!blocked(arena, yOnly, 13)) return yOnly;
  return { x: f.x, y: f.y };
}
export function nearCover(arena, f) {
  return coverCandidates(arena)
    .filter(box => Math.hypot(f.x - (box.x + box.w / 2), f.y - (box.y + box.h / 2)) < 260)
    .sort((a, b) => coverScore(f, a) - coverScore(f, b))[0] || null;
}

export function coverPoint(arena, cover, f, enemy = null, gap = 56) {
  if (!cover) return null;
  const c = center(cover);
  const away = enemy ? Math.atan2(c.y - enemy.y, c.x - enemy.x) : Math.atan2(f.y - c.y, f.x - c.x);
  const options = [
    { x: c.x + Math.cos(away) * (Math.max(cover.w, cover.h) / 2 + gap), y: c.y + Math.sin(away) * (Math.max(cover.w, cover.h) / 2 + gap) },
    { x: cover.x - gap, y: c.y }, { x: cover.x + cover.w + gap, y: c.y },
    { x: c.x, y: cover.y - gap }, { x: c.x, y: cover.y + cover.h + gap },
    { x: cover.x - gap * 0.75, y: cover.y - gap * 0.75 },
    { x: cover.x + cover.w + gap * 0.75, y: cover.y - gap * 0.75 },
    { x: cover.x - gap * 0.75, y: cover.y + cover.h + gap * 0.75 },
    { x: cover.x + cover.w + gap * 0.75, y: cover.y + cover.h + gap * 0.75 }
  ].map(p => clampArena(p, 16)).filter(p => !blocked(arena, p, 17));
  if (!options.length) return null;
  return options.sort((a, b) => coverPointScore(arena, f, enemy, a) - coverPointScore(arena, f, enemy, b))[0];
}

function coverCandidates(arena) {
  return solids(arena).filter(box => !box.id.startsWith('boundary_'));
}

function coverScore(f, cover) {
  const c = center(cover);
  const distance = Math.hypot(f.x - c.x, f.y - c.y);
  const sizePenalty = Math.max(0, cover.w * cover.h - 14000) / 900;
  return distance + sizePenalty;
}

function coverPointScore(arena, f, enemy, p) {
  const travel = Math.hypot(f.x - p.x, f.y - p.y);
  const exposed = enemy && segmentOpen(arena, p, enemy, 3) ? 90 : 0;
  const cramped = nearWall(arena, p, 24) ? 35 : 0;
  return travel + exposed + cramped;
}

function center(rect) { return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 }; }

function segmentOpen(arena, a, b, pad = 2) {
  const steps = Math.max(2, Math.ceil(Math.hypot(a.x - b.x, a.y - b.y) / 12));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    if (solids(arena).some(box => pointInRect(p, box, pad))) return false;
  }
  return true;
}
