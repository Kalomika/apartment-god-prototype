import { objects } from './world.js';

export function drawObjectCorrectiveOverlays(ctx, state) {
  if (state.floor !== 1) return;
  const bed = objects.find(o => o.id === 'bed');
  const tv = objects.find(o => o.id === 'bedroom_tv');
  if (bed) drawWestHeadboardBed(ctx, state, bed);
  if (tv) drawBedroomWallTv(ctx, state, tv);
}

function drawWestHeadboardBed(ctx, state, bed) {
  const making = hasAction(state, ['make bed'], bed.floor);
  ctx.save();
  ctx.shadowColor = 'transparent';
  roundRect(ctx, bed.x - 4, bed.y - 4, bed.w + 8, bed.h + 8, 18, '#6f5947');
  roundRect(ctx, bed.x + 2, bed.y + 8, 34, bed.h - 16, 12, '#7f654f');
  roundRect(ctx, bed.x + 28, bed.y + 12, bed.w - 40, bed.h - 24, 16, '#c8b7a1');
  roundRect(ctx, bed.x + 40, bed.y + 20, 58, 44, 13, '#fffaf2');
  roundRect(ctx, bed.x + 40, bed.y + bed.h - 64, 58, 44, 13, '#fffaf2');
  roundRect(ctx, bed.x + 108, bed.y + 18, bed.w - 126, bed.h / 2 - 28, 14, '#60718f');
  roundRect(ctx, bed.x + 108, bed.y + bed.h / 2 + 10, bed.w - 126, bed.h / 2 - 28, 14, '#9f6b8e');
  line(ctx, bed.x + 104, bed.y + bed.h / 2, bed.x + bed.w - 16, bed.y + bed.h / 2, 'rgba(92,75,61,.25)', 2);
  line(ctx, bed.x + 108, bed.y + 28, bed.x + bed.w - 22, bed.y + 44, 'rgba(255,255,255,.18)', 2);
  line(ctx, bed.x + 108, bed.y + bed.h - 42, bed.x + bed.w - 26, bed.y + bed.h - 56, 'rgba(255,255,255,.18)', 2);
  if (state.objectState?.bedMade === false) drawWestMessyCovers(ctx, bed);
  if (making) drawMakeBedGesture(ctx, bed);
  ctx.restore();
}

function drawWestMessyCovers(ctx, bed) {
  ctx.fillStyle = 'rgba(96,113,143,.90)';
  ctx.beginPath();
  ctx.moveTo(bed.x + 98, bed.y + 20);
  ctx.quadraticCurveTo(bed.x + 178, bed.y + 6, bed.x + 234, bed.y + 36);
  ctx.quadraticCurveTo(bed.x + 220, bed.y + 72, bed.x + 112, bed.y + 62);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(159,107,142,.90)';
  ctx.beginPath();
  ctx.moveTo(bed.x + 100, bed.y + bed.h - 24);
  ctx.quadraticCurveTo(bed.x + 184, bed.y + bed.h - 2, bed.x + 260, bed.y + bed.h - 38);
  ctx.quadraticCurveTo(bed.x + 206, bed.y + bed.h - 76, bed.x + 116, bed.y + bed.h - 62);
  ctx.closePath();
  ctx.fill();
  line(ctx, bed.x + 130, bed.y + 44, bed.x + 226, bed.y + 36, 'rgba(255,255,255,.22)', 2);
  line(ctx, bed.x + 130, bed.y + bed.h - 46, bed.x + 236, bed.y + bed.h - 52, 'rgba(255,255,255,.22)', 2);
}

function drawMakeBedGesture(ctx, bed) {
  const t = performance.now() / 240;
  const sweep = (Math.sin(t) + 1) / 2;
  const x = bed.x + 96 + sweep * (bed.w - 136);
  ctx.save();
  ctx.globalAlpha = .95;
  line(ctx, bed.x + 92, bed.y + 18, x, bed.y + 18, '#f1c66a', 4);
  line(ctx, bed.x + 92, bed.y + bed.h - 18, x, bed.y + bed.h - 18, '#f1c66a', 4);
  roundRect(ctx, x - 8, bed.y + 24, 18, bed.h - 48, 8, 'rgba(248,251,255,.72)');
  ctx.fillStyle = '#071018';
  ctx.font = '900 9px system-ui';
  ctx.fillText('TIDYING BED', bed.x + 116, bed.y - 8);
  ctx.restore();
}

function drawBedroomWallTv(ctx, state, tv) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  roundRect(ctx, tv.x, tv.y, tv.w, tv.h, 7, '#111820');
  roundRect(ctx, tv.x + 5, tv.y + 8, tv.w - 10, tv.h - 16, 5, '#222c38');
  if (state.tv?.on || hasAction(state, ['watch', 'tv'], tv.floor)) {
    ctx.globalAlpha = .25 + Math.abs(Math.sin((state.time || 0) * .22)) * .20;
    ctx.fillStyle = '#74e6ff';
    ctx.beginPath();
    ctx.moveTo(tv.x - 4, tv.y + 4);
    ctx.lineTo(tv.x - 4, tv.y + tv.h - 4);
    ctx.lineTo(tv.x - 200, tv.y + tv.h + 32);
    ctx.lineTo(tv.x - 200, tv.y - 32);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function hasAction(state, terms, floor = null) {
  const list = Array.isArray(terms) ? terms : [terms];
  return (state.entities || []).some(e => {
    if (e.hidden) return false;
    if (floor !== null && e.floor !== floor) return false;
    const action = String(e.action || '').toLowerCase();
    return list.some(term => action.includes(term));
  });
}

function roundRect(ctx, x, y, w, h, r, fill = '', stroke = false) {
  if (fill) ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function line(ctx, x1, y1, x2, y2, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
