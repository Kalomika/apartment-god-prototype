import { objects } from './world.js';

const TV_SCREEN_OFF = '#262320';
const TV_SCREEN_ON = '#83bfc8';
const TV_FRAME = '#3a3531';

export function drawTvStateCorrectiveOverlays(ctx, state) {
  for (const tv of objects.filter(o => o.floor === state.floor && o.kind === 'tv')) {
    drawCorrectedTvScreen(ctx, tv, isTvActuallyWatched(state, tv));
  }
}

function drawCorrectedTvScreen(ctx, tv, active) {
  const inset = tv.wallMounted ? 5 : 7;
  const x = tv.x + inset;
  const y = tv.y + inset;
  const w = Math.max(4, tv.w - inset * 2);
  const h = Math.max(4, tv.h - inset * 2);
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, tv.x, tv.y, tv.w, tv.h, tv.wallMounted ? 3 : 5, TV_FRAME);
  round(ctx, x, y, w, h, 3, active ? TV_SCREEN_ON : TV_SCREEN_OFF);
  if (tv.wallMounted) {
    ctx.fillStyle = '#6b6258';
    if (tv.h > tv.w) ctx.fillRect(tv.x - 4, tv.y + tv.h * .15, 4, tv.h * .70);
    else ctx.fillRect(tv.x + tv.w * .15, tv.y - 4, tv.w * .70, 4);
  }
  ctx.restore();
}

function isTvActuallyWatched(state, tv) {
  return (state.entities || []).some(entity => {
    if (entity.hidden || entity.floor !== tv.floor || entity.type !== 'person') return false;
    const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
    if (key.includes('sleep') || key.includes('nap') || key.includes('waking')) return false;
    const watching = key.includes('tv') || key.includes('watch') || key.includes('movie') || key.includes('sports');
    if (!watching) return false;
    const cx = tv.x + tv.w / 2;
    const cy = tv.y + tv.h / 2;
    return Math.hypot(entity.x - cx, entity.y - cy) <= 260;
  });
}

function round(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fillStyle = fill;
  ctx.fill();
}
