import { objects } from './world.js';

const FLOOR_BY_FLOOR = Object.freeze({
  0: { fill: '#d8c4a4', line: 'rgba(124,103,75,.16)' },
  1: { fill: '#d8c4a4', line: 'rgba(124,103,75,.16)' },
  2: { fill: '#d8c4a4', line: 'rgba(124,103,75,.13)' },
  3: { fill: '#d8c4a4', line: 'rgba(124,103,75,.13)' },
  4: { fill: '#5c7350', line: 'rgba(255,255,255,.08)' },
  5: { fill: '#d8c4a4', line: 'rgba(124,103,75,.13)' }
});

const CLEAR_RULES = Object.freeze([
  { floor: 0, id: 'couch', pad: [28, 32, 80, 80], radius: 28, note: 'new L sectional replaces old couch base' },
  { floor: 0, id: 'fridge', pad: [18, 16, 18, 46], radius: 12, note: 'clean fridge replaces double-door artifact' },
  { floor: 0, id: 'coffee_maker', pad: [20, 18, 22, 34], radius: 10, note: 'wall coffee maker replaces middle-kitchen artifact' },
  { floor: 0, id: 'dining_table', pad: [48, 34, 48, 38], radius: 16, note: 'full dining set replaces bare table overlay' },
  { floor: 0, id: 'bath_sink', pad: [10, 10, 12, 12], radius: 10, note: 'bath sink cue replaces placeholder' },
  { floor: 0, id: 'basement_door', pad: [12, 12, 12, 12], radius: 12, note: 'architectural stairs replace box asset' },
  { floor: 0, id: 'stairs_down', pad: [14, 14, 14, 14], radius: 14, note: 'integrated stair treatment replaces small box look' },
  { floor: 1, id: 'closet', pad: [22, 22, 22, 22], radius: 12, note: 'walk-in closet aisles replace empty closet placeholder' },
  { floor: 1, id: 'bath2_sink', pad: [10, 10, 12, 12], radius: 10, note: 'upstairs bath sink cue replaces placeholder' },
  { floor: 1, id: 'stairs_up', pad: [14, 14, 14, 14], radius: 14, note: 'integrated upstairs stairs replace small box look' },
  { floor: 2, id: 'basement_stairs_up', pad: [14, 14, 14, 14], radius: 14, note: 'basement stair patch clears old stair box before redraw' }
]);

export function drawVisualReplacementClears(ctx, state) {
  const floor = state?.floor;
  const rules = CLEAR_RULES.filter(rule => rule.floor === floor);
  if (!rules.length) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  for (const rule of rules) {
    const obj = objects.find(o => o.id === rule.id);
    if (!obj) continue;
    const [left, top, right, bottom] = rule.pad;
    clearPatch(ctx, obj.x - left, obj.y - top, obj.w + left + right, obj.h + top + bottom, rule.radius, floor);
  }
  ctx.restore();
}

function clearPatch(ctx, x, y, w, h, radius, floor) {
  const material = FLOOR_BY_FLOOR[floor] || FLOOR_BY_FLOOR[0];
  ctx.save();
  ctx.globalAlpha = 0.98;
  ctx.fillStyle = material.fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, radius));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fill();

  ctx.strokeStyle = material.line;
  ctx.lineWidth = 1;
  const start = Math.ceil(y / 14) * 14;
  for (let lineY = start; lineY < y + h; lineY += 14) {
    ctx.beginPath();
    ctx.moveTo(x + 6, lineY);
    ctx.lineTo(x + w - 6, lineY);
    ctx.stroke();
  }
  ctx.restore();
}
