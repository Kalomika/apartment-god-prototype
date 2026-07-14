import { visibleLooseBooks } from './bookSystem.js';

export function drawBookWorld(ctx, state) {
  drawModernLCouchOverlay(ctx, state);
  drawOutdoorReadingChairs(ctx, state);
  drawLooseBooks(ctx, state);
  drawTidinessCue(ctx, state);
}

function drawModernLCouchOverlay(ctx, state) {
  if (state.floor !== 0) return;
  ctx.save();
  ctx.shadowColor = 'transparent';
  const x = 124;
  const y = 178;
  const w = 224;
  const h = 105;
  round(ctx, x, y, w, 64, 22, '#527672');
  round(ctx, x + 133, y + 20, 91, h, 22, '#527672');
  round(ctx, x + 11, y + 12, 88, 38, 17, '#92bbb5');
  round(ctx, x + 105, y + 12, 82, 38, 17, '#92bbb5');
  round(ctx, x + 150, y + 50, 58, 49, 18, '#92bbb5');
  round(ctx, x + 6, y + 50, 180, 16, 9, '#3f5c58');
  round(ctx, x + 188, y + 30, 17, 82, 10, '#3f5c58');
  ctx.strokeStyle = '#263c3a';
  ctx.lineWidth = 2;
  round(ctx, x, y, w, 64, 22, '', true);
  round(ctx, x + 133, y + 20, 91, h, 22, '', true);
  ctx.restore();
}

function drawOutdoorReadingChairs(ctx, state) {
  if (state.floor !== 0) return;
  ctx.save();
  drawChair(ctx, 166, 604);
  drawChair(ctx, 256, 604);
  round(ctx, 220, 610, 24, 22, 7, '#9f704a');
  ctx.restore();
}

function drawChair(ctx, x, y) {
  round(ctx, x, y, 42, 44, 14, '#6f8f8a');
  round(ctx, x + 6, y + 7, 30, 24, 11, '#93b8b3');
  round(ctx, x + 2, y + 28, 38, 11, 6, '#4e6662');
  ctx.strokeStyle = '#263c3a';
  ctx.lineWidth = 2;
  round(ctx, x, y, 42, 44, 14, '', true);
}

function drawLooseBooks(ctx, state) {
  const books = visibleLooseBooks(state);
  for (const book of books) drawLooseBook(ctx, book);
}

function drawLooseBook(ctx, book) {
  ctx.save();
  ctx.translate(book.x, book.y);
  ctx.rotate(-0.18);
  ctx.fillStyle = 'rgba(7,16,24,.18)';
  ctx.beginPath();
  ctx.ellipse(2, 4, 17, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  round(ctx, -14, -9, 28, 18, 4, '#efe7dc');
  ctx.strokeStyle = '#7b5c38';
  ctx.lineWidth = 1.6;
  round(ctx, -14, -9, 28, 18, 4, '', true);
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(0, 9);
  ctx.stroke();
  ctx.fillStyle = '#b66d55';
  ctx.fillRect(-11, -6, 8, 12);
  ctx.fillStyle = 'rgba(7,16,24,.34)';
  ctx.fillRect(3, -5, 8, 2);
  ctx.fillRect(3, 0, 7, 2);
  ctx.restore();
}

function drawTidinessCue(ctx, state) {
  const rooms = state.tidiness?.rooms || {};
  const dirty = Object.entries(rooms).filter(([, value]) => value > 0);
  if (!dirty.length) return;
  const label = dirty.map(([room, value]) => `${room} ${Math.round(value)}%`).slice(0, 2).join('  ');
  ctx.save();
  ctx.fillStyle = 'rgba(8,10,15,.74)';
  round(ctx, 420, 12, 230, 26, 9, 'rgba(8,10,15,.74)');
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 10px system-ui';
  ctx.fillText(`Tidiness issue: ${label}`, 432, 29);
  ctx.restore();
}

function round(ctx, x, y, w, h, r, fill = '', stroke = false) {
  if (fill) ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
