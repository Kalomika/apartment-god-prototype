import { objects } from './world.js';
import { drawStyledObject } from './renderHouseStyle.js';

export function drawObjects(ctx, state) {
  for (const obj of objects.filter(o => o.floor === state.floor)) {
    if (obj.kind === 'car' && state.objectState.vehicleInUse === obj.id) continue;
    const active = state.entities.some(e => e.target?.objectId === obj.id || String(e.action || '').toLowerCase().includes(obj.kind));
    ctx.save();
    ctx.shadowColor = active ? 'rgba(232,198,97,.55)' : 'transparent';
    ctx.shadowBlur = active ? 16 : 0;
    if (!drawStyledObject(ctx, obj, state)) drawFallbackObject(ctx, obj);
    if (obj.kind === 'stove') drawStoveBackPanel(ctx, obj, state);
    ctx.restore();
  }
}

function drawStoveBackPanel(ctx, o, state) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#8f897f';
  rounded(ctx, o.x + 3, o.y - 13, o.w - 6, 20, 6, true, false);
  ctx.strokeStyle = '#514b46';
  ctx.lineWidth = 2;
  rounded(ctx, o.x + 3, o.y - 13, o.w - 6, 20, 6, false, true);
  ctx.fillStyle = '#393632';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(o.x + 15 + i * 14, o.y - 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (state.objectState.stovePan) {
    ctx.fillStyle = '#f1c66a';
    ctx.font = '900 8px system-ui';
    ctx.fillText('HEAT', o.x + o.w - 28, o.y - 1);
  }
  ctx.restore();
}

function drawFallbackObject(ctx, o) {
  ctx.fillStyle = '#9b8d7c';
  rounded(ctx, o.x, o.y, o.w, o.h, 8);
  ctx.strokeStyle = '#4a4138';
  ctx.lineWidth = 2;
  rounded(ctx, o.x, o.y, o.w, o.h, 8, false, true);
}

function rounded(ctx, x, y, w, h, r, fill = true, stroke = false) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
