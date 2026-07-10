import { PLAY_W } from './config.js';
import { objects } from './world.js';
import { formatTime } from './renderHelpers.js';

export function drawAfterEntityOverlays(ctx, state) {
  drawShowerPrivacyOverlays(ctx, state);
  drawCalendarSkipRecap(ctx, state);
}

function drawShowerPrivacyOverlays(ctx, state) {
  const showering = (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && isShowering(e));
  for (const actor of showering) {
    const shower = nearestShower(actor, state.floor);
    const x = actor.x;
    const y = actor.y;
    ctx.save();
    drawVideoCensorMosaic(ctx, x, y);
    drawFloorClothesPile(ctx, shower ? shower.x + shower.w + 22 : x + 42, shower ? shower.y + shower.h - 18 : y + 38, actor.id === 'girlfriend');
    ctx.restore();
  }
}

function isShowering(entity) {
  const action = String(entity.action || '').toLowerCase();
  const pose = String(entity.pose || '').toLowerCase();
  return pose === 'shower' || action.includes('shower');
}

function nearestShower(actor, floor) {
  const showers = objects.filter(o => o.floor === floor && o.kind === 'shower');
  if (!showers.length) return null;
  return showers.sort((a, b) => distanceToObject(actor, a) - distanceToObject(actor, b))[0];
}

function distanceToObject(actor, obj) {
  return Math.hypot(actor.x - (obj.x + obj.w / 2), actor.y - (obj.y + obj.h / 2));
}

function drawVideoCensorMosaic(ctx, x, y) {
  ctx.save();
  ctx.globalAlpha = .96;
  const cols = 5;
  const rows = 4;
  const size = 14;
  const startX = x - cols * size / 2;
  const startY = y - rows * size / 2 - 4;
  const colors = ['#d9e6ef', '#b9cbd8', '#eef6fb', '#8aa2b4', '#f8fbff'];
  ctx.strokeStyle = 'rgba(8,14,20,.82)';
  ctx.lineWidth = 2;
  roundRect(ctx, startX - 4, startY - 4, cols * size + 8, rows * size + 8, 5, 'rgba(7,16,24,.35)');
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.fillStyle = colors[(row * 2 + col) % colors.length];
      ctx.fillRect(startX + col * size, startY + row * size, size, size);
    }
  }
  ctx.strokeRect(startX - 1, startY - 1, cols * size + 2, rows * size + 2);
  ctx.globalAlpha = .35;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(startX, startY, cols * size, 5);
  ctx.restore();
}

function drawFloorClothesPile(ctx, x, y, female) {
  ctx.save();
  ctx.globalAlpha = .98;
  blob(ctx, x, y, 18, 8, female ? '#17131b' : '#111820');
  blob(ctx, x + 16, y + 5, 13, 7, female ? '#ff75df' : '#74e6ff');
  blob(ctx, x - 10, y + 8, 9, 6, '#05070a');
  blob(ctx, x + 2, y - 9, 10, 5, '#d8c4a4');
  ctx.fillStyle = '#071018';
  ctx.font = '900 8px system-ui';
  ctx.fillText('clothes', x - 18, y + 22);
  ctx.restore();
}

function drawCalendarSkipRecap(ctx, state) {
  const recap = state.skipRecap;
  if (!recap || recap.visibleT <= 0) return;
  const x = PLAY_W - 382;
  const y = 92;
  const w = 360;
  const h = Math.min(230, 92 + (recap.days?.length || 0) * 24);
  ctx.save();
  ctx.fillStyle = 'rgba(8,10,15,.88)';
  roundRect(ctx, x, y, w, h, 14);
  ctx.strokeStyle = 'rgba(116,230,255,.68)';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 14, '', true);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 15px system-ui';
  ctx.fillText('Time Skip Recap', x + 16, y + 24);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '800 12px system-ui';
  ctx.fillText(`${recap.message || 'Skipped time'} • now ${formatTime(state.time)}`, x + 16, y + 44);
  const barX = x + 16;
  const barY = y + 58;
  const barW = w - 32;
  roundRect(ctx, barX, barY, barW, 10, 5, 'rgba(248,251,255,.18)');
  const pulse = .65 + Math.sin(performance.now() / 140) * .18;
  roundRect(ctx, barX, barY, barW * pulse, 10, 5, '#f1c66a');
  let yy = y + 88;
  for (const day of (recap.days || []).slice(0, 5)) {
    ctx.fillStyle = day.checked ? '#90d68c' : '#b6c1d2';
    ctx.font = '900 16px system-ui';
    ctx.fillText(day.checked ? '✓' : '•', x + 18, yy);
    ctx.fillStyle = '#f8fbff';
    ctx.font = '800 12px system-ui';
    ctx.fillText(day.label, x + 42, yy);
    if (day.events?.length) {
      ctx.fillStyle = '#f1c66a';
      ctx.font = '700 10px system-ui';
      ctx.fillText(day.events.slice(0, 2).join(', '), x + 42, yy + 14);
      yy += 10;
    }
    yy += 24;
  }
  ctx.restore();
}

function blob(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, Math.sin(x + y) * .2, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = '#071018';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r, fill = '', stroke = false) {
  if (fill) ctx.fillStyle = fill;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
