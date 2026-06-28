import { ARENA_H, ARENA_W } from './config.js';
import { clamp, pointInRect } from './utils.js';

export function createArena() {
  return {
    name: 'Security Floor', w: ARENA_W, h: ARENA_H,
    spawnA: { x: 118, y: 360, facing: 0 },
    spawnB: { x: 842, y: 360, facing: Math.PI },
    walls: [
      r('north', 20, 20, 920, 28), r('south', 20, 672, 920, 28), r('west', 20, 20, 28, 680), r('east', 912, 20, 28, 680),
      r('left_spawn_cover_top', 85, 190, 120, 34), r('left_spawn_cover_bottom', 85, 496, 120, 34),
      r('right_spawn_cover_top', 755, 190, 120, 34), r('right_spawn_cover_bottom', 755, 496, 120, 34),
      r('left_lane_wall_a', 245, 105, 44, 150), r('left_lane_wall_b', 245, 465, 44, 150),
      r('right_lane_wall_a', 671, 105, 44, 150), r('right_lane_wall_b', 671, 465, 44, 150),
      r('left_mid_cover_top', 215, 292, 160, 36), r('left_mid_cover_bottom', 215, 392, 160, 36),
      r('right_mid_cover_top', 585, 292, 160, 36), r('right_mid_cover_bottom', 585, 392, 160, 36),
      r('center_box_top', 448, 205, 64, 64), r('center_box_bottom', 448, 451, 64, 64),
      r('center_low_cover_left', 404, 342, 48, 36), r('center_low_cover_right', 508, 342, 48, 36),
      r('left_corner_block_top', 132, 106, 72, 72), r('left_corner_block_bottom', 132, 542, 72, 72),
      r('right_corner_block_top', 756, 106, 72, 72), r('right_corner_block_bottom', 756, 542, 72, 72)
    ],
    shadows: [
      r('left_shadow_top', 70, 75, 135, 95), r('left_shadow_bottom', 70, 550, 135, 95),
      r('right_shadow_top', 755, 75, 135, 95), r('right_shadow_bottom', 755, 550, 135, 95),
      r('center_shadow_left', 325, 330, 90, 64), r('center_shadow_right', 545, 330, 90, 64)
    ],
    breakables: [
      r('glass_left_mid', 384, 320, 34, 80, 18), r('glass_right_mid', 542, 320, 34, 80, 18),
      r('crate_top', 448, 128, 64, 42, 20), r('crate_bottom', 448, 550, 64, 42, 20)
    ],
    weaponSpawns: [
      { id: 'left_power', x: 326, y: 360, type: 'weapon' },
      { id: 'right_power', x: 634, y: 360, type: 'weapon' },
      { id: 'center_power', x: 480, y: 360, type: 'ammo' }
    ],
    debris: []
  };
}

function r(id, x, y, w, h, hp = null) { return { id, x, y, w, h, hp, broken: false }; }
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
  return solids(arena).filter(box => Math.hypot(f.x - (box.x + box.w / 2), f.y - (box.y + box.h / 2)) < 190).sort((a, b) => a.id.localeCompare(b.id))[0] || null;
}
