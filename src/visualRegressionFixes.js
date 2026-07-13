import { objects } from './world.js';

const CYAN = '#74e6ff';
const GOLD = '#f1c66a';
const GRASS = '#567155';
const PORCH = '#d8c4a4';

export function drawVisualRegressionFixes(ctx, state) {
  if (state.floor !== 0) return;
  drawPorchGroundAndTwoChairs(ctx);
  drawCoffeeTable(ctx);
  const couch = objects.find(o => o.id === 'couch');
  if (couch) drawRightChaiseSectional(ctx, couch);
}

function drawPorchGroundAndTwoChairs(ctx) {
  ctx.save();
  ctx.shadowColor = 'transparent';

  round(ctx, 24, 562, 112, 130, 0, GRASS);
  round(ctx, 496, 562, 440, 130, 0, GRASS);
  round(ctx, 136, 570, 360, 114, 8, PORCH);

  for (let y = 588; y < 676; y += 15) line(ctx, 146, y, 486, y, 'rgba(124,103,75,.18)', 1);
  round(ctx, 244, 552, 102, 24, 5, '#b7a384');
  round(ctx, 254, 562, 82, 13, 4, '#f1d59a');

  drawPorchChair(ctx, 200, 624);
  drawPorchChair(ctx, 434, 624);
  ctx.restore();
}

function drawPorchChair(ctx, x, y) {
  ctx.save();
  round(ctx, x - 28, y - 21, 56, 52, 13, '#2a3540');
  round(ctx, x - 21, y - 14, 42, 34, 11, '#5f7482');
  round(ctx, x - 22, y - 26, 44, 13, 7, '#6f8290');
  line(ctx, x - 22, y + 22, x - 31, y + 31, '#59442f', 4);
  line(ctx, x + 22, y + 22, x + 31, y + 31, '#59442f', 4);
  ctx.restore();
}

function drawCoffeeTable(ctx) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, 150, 148, 130, 46, 14, 'rgba(35,40,47,.18)');
  round(ctx, 158, 146, 114, 38, 12, '#6b4a34');
  round(ctx, 168, 153, 94, 24, 8, '#9b7652');
  circle(ctx, 190, 165, 6, '#efe7dc');
  circle(ctx, 236, 165, 5, '#74e6ff');
  ctx.restore();
}

function drawRightChaiseSectional(ctx, couch) {
  const x = couch.x - 10;
  const y = couch.y - 18;
  ctx.save();
  ctx.shadowColor = 'transparent';
  clearFloor(ctx, x - 12, y - 72, 270, 202);
  round(ctx, x - 3, y - 3, 252, 118, 23, 'rgba(35,40,47,.22)');
  round(ctx, x, y, 242, 72, 22, '#223846');
  round(ctx, x + 144, y + 54, 98, 58, 22, '#223846');
  round(ctx, x + 10, y + 10, 70, 44, 16, '#4f7180');
  round(ctx, x + 86, y + 10, 70, 44, 16, '#537784');
  round(ctx, x + 162, y + 10, 62, 44, 16, '#496a78');
  round(ctx, x + 160, y + 62, 66, 34, 16, '#567987');
  round(ctx, x + 4, y + 48, 232, 18, 11, '#172832');
  round(ctx, x + 4, y + 8, 18, 56, 12, '#172832');
  round(ctx, x + 213, y + 8, 22, 96, 12, '#172832');
  line(ctx, x + 82, y + 13, x + 82, y + 51, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + 158, y + 13, x + 158, y + 51, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + 150, y + 60, x + 218, y + 60, 'rgba(255,255,255,.16)', 1.4);
  round(ctx, x + 38, y + 37, 34, 16, 9, '#8395a1');
  round(ctx, x + 190, y + 72, 28, 15, 8, '#798f9d');
  screenFacingCue(ctx, x + 105, y - 82);
  ctx.restore();
}

function screenFacingCue(ctx, x, y) {
  ctx.save();
  ctx.globalAlpha = .14;
  ctx.fillStyle = CYAN;
  ctx.beginPath();
  ctx.moveTo(x - 62, y + 58);
  ctx.lineTo(x + 62, y + 58);
  ctx.lineTo(x + 44, y + 136);
  ctx.lineTo(x - 44, y + 136);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function clearFloor(ctx, x, y, w, h) {
  round(ctx, x, y, w, h, 22, PORCH);
  ctx.strokeStyle = 'rgba(124,103,75,.16)';
  ctx.lineWidth = 1;
  for (let lineY = Math.ceil(y / 14) * 14; lineY < y + h; lineY += 14) {
    line(ctx, x + 8, lineY, x + w - 8, lineY, 'rgba(124,103,75,.16)', 1);
  }
  round(ctx, x + w - 22, y + h - 22, 10, 10, 5, GOLD);
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
