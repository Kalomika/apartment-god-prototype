import { ARENA_H, ARENA_W } from './config.js';
import { clamp, pointInRect } from './utils.js';

export function createArena() {
  const blocks = [
    r('north_block', 112, 84, 110, 86, null, { cover: true, climbable: true, climbHeight: 1.45, material: 'metal', topLabel: 'north container' }),
    r('long_mid_block', 338, 86, 86, 178, null, { cover: true, climbable: true, climbHeight: 1.8, material: 'stone', topLabel: 'mid ruin wall' }),
    r('upper_right_block', 612, 112, 164, 136, null, { cover: true, climbable: true, climbHeight: 1.55, material: 'concrete', topLabel: 'warehouse shell' }),
    r('east_block', 810, 352, 96, 130, null, { cover: true, climbable: true, climbHeight: 1.25, material: 'metal', topLabel: 'generator bank' }),
    r('lower_left_block', 86, 514, 118, 122, null, { cover: true, climbable: true, climbHeight: 1.15, material: 'wood', topLabel: 'scrap stack' }),
    r('lower_mid_block', 394, 516, 108, 82, null, { cover: true, climbable: true, climbHeight: 1.2, material: 'metal', topLabel: 'water tank skid' }),
    r('lower_right_block', 604, 558, 190, 64, null, { cover: true, climbable: true, climbHeight: 1.45, material: 'metal', topLabel: 'lower container pair' }),
    r('boulder_north_west', 47, 126, 48, 52, null, { cover: true, boulder: true, climbable: true, climbHeight: 0.7, material: 'stone', topLabel: 'boulder' }),
    r('boulder_north_mid', 240, 86, 52, 46, null, { cover: true, boulder: true, climbable: true, climbHeight: 0.55, material: 'stone', topLabel: 'boulder' }),
    r('boulder_center', 494, 306, 58, 62, null, { cover: true, boulder: true, climbable: true, climbHeight: 0.55, material: 'stone', topLabel: 'boulder' }),
    r('boulder_lower_mid', 276, 628, 58, 48, null, { cover: true, boulder: true, climbable: true, climbHeight: 0.55, material: 'stone', topLabel: 'boulder' }),
    r('boulder_east_high', 862, 142, 56, 50, null, { cover: true, boulder: true, climbable: true, climbHeight: 0.65, material: 'stone', topLabel: 'boulder' }),
    r('boulder_east_low', 846, 590, 64, 56, null, { cover: true, boulder: true, climbable: true, climbHeight: 0.65, material: 'stone', topLabel: 'boulder' })
  ];
  const elevations = [
    r('raised_catwalk_deck', 604, 382, 214, 82, null, { elevation: 1.55, climbable: true, platform: true, material: 'metal', topLabel: 'raised catwalk' }),
    r('catwalk_stair_access', 550, 414, 58, 112, null, { elevation: 1.55, climbable: true, stairs: true, access: true, material: 'metal', topLabel: 'stairs' })
  ];
  return {
    name: 'Diagnostic Terrain Layout', w: ARENA_W, h: ARENA_H,
    spawnA: { x: 205, y: 618, facing: -0.55, dropY: 840, dropX: 142 },
    spawnB: { x: 784, y: 116, facing: 2.55, dropY: -230, dropX: 860 },
    walls: blocks,
    elevations,
    shadows: [
      r('shade_north', 92, 62, 150, 126),
      r('shade_mid', 318, 72, 128, 216),
      r('shade_right', 590, 98, 208, 182),
      r('shade_lower_left', 68, 494, 160, 166),
      r('shade_lower_right', 574, 336, 200, 204)
    ],
    breakables: [r('small_crates_a', 450, 310, 54, 38, 35, { cover: true, climbable: true, climbHeight: 0.75, material: 'wood', topLabel: 'small crate stack' })],
    weaponSpawns: [],
    debris: []
  };
}

function r(id, x, y, w, h, hp = null, extra = {}) { return { id, x, y, w, h, hp, broken: false, material: 'concrete', ...extra }; }
export function solids(arena) { return [...arena.walls, ...arena.breakables.filter(b => !b.broken)]; }
export function climbables(arena) { return solids(arena).filter(box => box.climbable && !box.broken); }
export function elevations(arena) { return arena.elevations || []; }
export function clampArena(p, radius = 14) { return { x: clamp(p.x, 50 + radius, ARENA_W - 50 - radius), y: clamp(p.y, 50 + radius, ARENA_H - 50 - radius) }; }
export function solidAt(arena, p, pad = 2) { return solids(arena).find(box => pointInRect(p, box, pad)) || null; }
export function blocked(arena, p, pad = 12) { return Boolean(solidAt(arena, p, pad)); }
export function inShadow(arena, p) { return arena.shadows?.some(zone => pointInRect(p, zone, 0)) || false; }
export function nearWall(arena, p, distance = 18) { return solids(arena).find(box => pointInRect(p, box, distance) && !pointInRect(p, box, -2)) || null; }
export function climbableAt(arena, p, pad = 0) { return [...climbables(arena), ...elevations(arena)].find(box => pointInRect(p, box, pad)) || null; }
export function climbableNear(arena, p, distance = 34) { return [...climbables(arena), ...elevations(arena)].find(box => pointInRect(p, box, distance)) || null; }
export function elevationAt(arena, p) {
  const elevated = elevations(arena).find(box => pointInRect(p, box, 0));
  if (elevated) return elevated.elevation || 0;
  const top = climbableAt(arena, p, -4);
  return top ? top.climbHeight || top.elevation || 0 : 0;
}
export function climbAccessPoint(arena, box, from, gap = 22) {
  if (!box) return null;
  const c = center(box);
  const away = Math.atan2(from.y - c.y, from.x - c.x);
  const options = [
    { x: box.x - gap, y: c.y }, { x: box.x + box.w + gap, y: c.y },
    { x: c.x, y: box.y - gap }, { x: c.x, y: box.y + box.h + gap },
    { x: c.x + Math.cos(away) * (Math.max(box.w, box.h) / 2 + gap), y: c.y + Math.sin(away) * (Math.max(box.w, box.h) / 2 + gap) }
  ].map(p => clampArena(p, 16)).filter(p => !blocked(arena, p, 17));
  return options.sort((a, b) => Math.hypot(a.x - from.x, a.y - from.y) - Math.hypot(b.x - from.x, b.y - from.y))[0] || null;
}
export function topPoint(box, from = null) {
  const c = center(box);
  if (!from) return c;
  const dx = clamp(from.x, box.x + Math.min(18, box.w * 0.28), box.x + box.w - Math.min(18, box.w * 0.28));
  const dy = clamp(from.y, box.y + Math.min(18, box.h * 0.28), box.y + box.h - Math.min(18, box.h * 0.28));
  return { x: dx || c.x, y: dy || c.y };
}
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
    .filter(box => Math.hypot(f.x - (box.x + box.w / 2), f.y - (box.y + box.h / 2)) < 360)
    .sort((a, b) => coverScore(f, a) - coverScore(f, b))[0] || null;
}

export function coverPoint(arena, cover, f, enemy = null, gap = 32) {
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

function coverCandidates(arena) { return solids(arena).filter(box => !box.id.startsWith('boundary_')); }
function coverScore(f, cover) { const c = center(cover); const distance = Math.hypot(f.x - c.x, f.y - c.y); const sizePenalty = Math.max(0, cover.w * cover.h - 14000) / 900; const boulderBonus = cover.boulder ? -48 : 0; return distance + sizePenalty + boulderBonus; }
function coverPointScore(arena, f, enemy, p) { const travel = Math.hypot(f.x - p.x, f.y - p.y); const exposed = enemy && segmentOpen(arena, p, enemy, 3) ? 140 : 0; const cramped = nearWall(arena, p, 24) ? -24 : 0; return travel + exposed + cramped; }
function center(rect) { return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 }; }
function segmentOpen(arena, a, b, pad = 2) { const steps = Math.max(2, Math.ceil(Math.hypot(a.x - b.x, a.y - b.y) / 12)); for (let i = 1; i < steps; i++) { const t = i / steps; const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; if (solids(arena).some(box => pointInRect(p, box, pad))) return false; } return true; }
