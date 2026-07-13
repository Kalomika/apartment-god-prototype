import { objects } from './world.js';

// Focused visual regression fixes that must draw after realismCorrectionPass.js.
// This layer corrects the main floor couch and dining geometry without touching garage work.

const CYAN = '#74e6ff';
const GOLD = '#f1c66a';
const WOOD = '#8b5f3b';
const FLOOR_MAIN = '#d8c4a4';

export function drawVisualRegressionFixes(ctx, state) {
  applyMainFloorRuntimeGeometry();
  if (state.floor !== 0) return;
  drawCoffeeTable(ctx);
  drawDiningTableClearanceFix(ctx);
  drawTvSideChaiseSectional(ctx);
}

function applyMainFloorRuntimeGeometry() {
  const couch = object('couch');
  if (couch) Object.assign(couch, { x: 56, y: 212, w: 258, h: 112, facing: 'up', enterable: true });

  const dining = object('dining_table');
  if (dining) Object.assign(dining, { x: 456, y: 272, w: 174, h: 58 });
}

function drawCoffeeTable(ctx) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, 146, 138, 130, 46, 14, 'rgba(35,40,47,.18)');
  round(ctx, 154, 136, 114, 38, 12, '#6b4a34');
  round(ctx, 164, 143, 94, 24, 8, '#9b7652');
  circle(ctx, 186, 155, 6, '#efe7dc');
  circle(ctx, 232, 155, 5, CYAN);
  round(ctx, 242, 145, 10, 14, 5, GOLD);
  ctx.restore();
}

function drawTvSideChaiseSectional(ctx) {
  const couch = object('couch');
  if (!couch) return;
  const x = couch.x;
  const y = couch.y;
  const w = couch.w;
  ctx.save();
  ctx.shadowColor = 'transparent';

  // Clear the wrong realism couch and any old south-facing chaise leftovers.
  clearFloor(ctx, x - 26, y - 78, w + 54, 208);

  // Main body stays against the living-room wall and faces the TV on the north wall.
  round(ctx, x - 5, y + 47, w + 10, 78, 24, 'rgba(0,0,0,.22)');
  round(ctx, x, y + 42, w, 68, 22, '#263f48');

  // Chaise/L now projects toward the TV side, not toward the porch side.
  round(ctx, x + w - 92, y, 92, 106, 23, '#263f48');
  round(ctx, x + w - 80, y + 12, 58, 76, 17, '#628793');

  // Seat cushions across the main couch.
  round(ctx, x + 14, y + 52, 62, 40, 15, '#5f828c');
  round(ctx, x + 82, y + 52, 62, 40, 15, '#6a8d96');
  round(ctx, x + 150, y + 52, 58, 40, 15, '#587b86');

  // Back and arms read as a couch facing up toward the TV.
  round(ctx, x + 5, y + 94, w - 10, 20, 11, '#172934');
  round(ctx, x + 5, y + 45, 20, 62, 11, '#172934');
  round(ctx, x + w - 26, y + 6, 24, 104, 12, '#172934');

  line(ctx, x + 78, y + 55, x + 78, y + 91, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + 146, y + 55, x + 146, y + 91, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + w - 75, y + 35, x + w - 26, y + 35, 'rgba(255,255,255,.18)', 1.5);
  line(ctx, x + 18, y + 98, x + w - 40, y + 98, 'rgba(7,16,24,.35)', 5);
  ctx.restore();
}

function drawDiningTableClearanceFix(ctx) {
  const table = object('dining_table');
  if (!table) return;
  ctx.save();
  ctx.shadowColor = 'transparent';

  // Clear the previous wider table and the side chairs that blocked the stair/service opening.
  clearFloor(ctx, table.x - 58, table.y - 42, table.w + 128, table.h + 86);

  const seats = [
    [table.x + 40, table.y - 25, 0],
    [table.x + table.w - 40, table.y - 25, 0],
    [table.x + 40, table.y + table.h + 25, Math.PI],
    [table.x + table.w - 40, table.y + table.h + 25, Math.PI]
  ];
  for (const seat of seats) drawDiningChair(ctx, ...seat);

  round(ctx, table.x - 5, table.y - 4, table.w + 10, table.h + 8, 13, '#4d3326');
  round(ctx, table.x + 6, table.y + 6, table.w - 12, table.h - 12, 10, WOOD);
  line(ctx, table.x + 16, table.y + 18, table.x + table.w - 16, table.y + 14, 'rgba(255,255,255,.15)', 1.4);
  drawPlaceSetting(ctx, table.x + 36, table.y + table.h / 2);
  drawPlaceSetting(ctx, table.x + table.w - 36, table.y + table.h / 2);
  drawPlaceSetting(ctx, table.x + table.w / 2, table.y + 18);
  drawPlaceSetting(ctx, table.x + table.w / 2, table.y + table.h - 18);
  ctx.restore();
}

function drawDiningChair(ctx, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  round(ctx, -18, -14, 36, 28, 9, '#26313b');
  round(ctx, -13, -10, 26, 19, 7, '#78848e');
  round(ctx, -16, -20, 32, 9, 4, '#46545f');
  ctx.restore();
}

function drawPlaceSetting(ctx, x, y) {
  circle(ctx, x, y, 8, '#efe7dc');
  line(ctx, x - 13, y + 10, x + 13, y + 10, 'rgba(7,16,24,.23)', 1);
}

function clearFloor(ctx, x, y, w, h) {
  round(ctx, x, y, w, h, 0, FLOOR_MAIN);
  ctx.strokeStyle = 'rgba(124,103,75,.14)';
  ctx.lineWidth = 1;
  for (let lineY = Math.ceil(y / 14) * 14; lineY < y + h; lineY += 14) {
    line(ctx, x + 6, lineY, x + w - 6, lineY, 'rgba(124,103,75,.14)', 1);
  }
}

function object(id) {
  return objects.find(o => o.id === id) || null;
}

function round(ctx, x, y, w, h, r, color) {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fill();
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
