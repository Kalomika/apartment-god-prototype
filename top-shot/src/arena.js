import { ARENA_H, ARENA_W } from './config.js';
import { clamp, pointInRect } from './utils.js';

export function createArena() {
  return {
    name: 'Lobby One', w: ARENA_W, h: ARENA_H,
    spawnA: { x: 145, y: 360, facing: 0 },
    spawnB: { x: 815, y: 360, facing: Math.PI },
    walls: [
      r('north', 20, 20, 920, 28), r('south', 20, 672, 920, 28), r('west', 20, 20, 28, 680), r('east', 912, 20, 28, 680),
      r('left_pillar', 260, 300, 64, 120), r('right_pillar', 636, 300, 64, 120),
      r('top_cover', 170, 185, 170, 34), r('bottom_cover', 620, 500, 170, 34),
      r('center_top', 420, 110, 120, 60), r('center_bottom', 420, 550, 120, 60)
    ],
    breakables: [r('glass_a', 375, 300, 70, 45, 18), r('glass_b', 520, 375, 70, 45, 18)],
    debris: []
  };
}

function r(id, x, y, w, h, hp = null) { return { id, x, y, w, h, hp, broken: false }; }
export function solids(arena) { return [...arena.walls, ...arena.breakables.filter(b => !b.broken)]; }
export function clampArena(p, radius = 14) { return { x: clamp(p.x, 50 + radius, ARENA_W - 50 - radius), y: clamp(p.y, 50 + radius, ARENA_H - 50 - radius) }; }
export function blocked(arena, p, pad = 12) { return solids(arena).some(box => pointInRect(p, box, pad)); }
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
  return solids(arena).filter(box => Math.hypot(f.x - (box.x + box.w / 2), f.y - (box.y + box.h / 2)) < 190).sort((a, b) => a.id.localeCompare(b.id))[0] || null;
}
