import { objects } from './world.js';

const CYAN = '#74e6ff';
const GOLD = '#f1c66a';

export function drawVisualRegressionFixes(ctx, state) {
  if (state.floor !== 0) return;
  const couch = objects.find(o => o.id === 'couch');
  if (couch) drawRightChaiseSectional(ctx, couch);
}

function drawRightChaiseSectional(ctx, couch) {
  const x = couch.x - 10;
  const y = couch.y - 18;
  ctx.save();
  ctx.shadowColor = 'transparent';
  clearFloor(ctx, x - 8, y - 8, 260, 142);
  round(ctx, x - 3, y - 3, 252, 126, 23, 'rgba(35,40,47,.22)');
  round(ctx, x, y, 242, 84, 22, '#223846');
  round(ctx, x + 138, y + 74, 104, 50, 22, '#223846');
  round(ctx, x + 10, y + 10, 70, 54, 16, '#4f7180');
  round(ctx, x + 86, y + 10, 70, 54, 16, '#537784');
  round(ctx, x + 162, y + 10, 62, 54, 16, '#496a78');
  round(ctx, x + 156, y + 82, 74, 30, 16, '#567987');
  round(ctx, x + 4, y + 58, 232, 20, 11, '#172832');
  round(ctx, x + 4, y + 8, 18, 66, 12, '#172832');
  round(ctx, x + 213, y + 8, 22, 102, 12, '#172832');
  line(ctx, x + 82, y + 13, x + 82, y + 63, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + 158, y + 13, x + 158, y + 63, 'rgba(255,255,255,.22)', 1.5);
  line(ctx, x + 148, y + 76, x + 218, y + 76, 'rgba(255,255,255,.16)', 1.4);
  round(ctx, x + 38, y + 47, 34, 18, 9, '#8395a1');
  round(ctx, x + 188, y + 91, 28, 16, 8, '#798f9d');
  screenFacingCue(ctx, x + 104, y - 18);
  ctx.restore();
}

function screenFacingCue(ctx, x, y) {
  ctx.save();
  ctx.globalAlpha = .18;
  ctx.fillStyle = CYAN;
  ctx.beginPath();
  ctx.moveTo(x - 64, y + 38);
  ctx.lineTo(x + 64, y + 38);
  ctx.lineTo(x + 32, y + 116);
  ctx.lineTo(x - 32, y + 116);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function clearFloor(ctx, x, y, w, h) {
  round(ctx, x, y, w, h, 26, '#d8c4a4');
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

function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
