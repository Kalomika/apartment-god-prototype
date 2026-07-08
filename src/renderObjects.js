import { objects } from './world.js';
import { drawStyledObject } from './renderHouseStyle.js';

export function drawObjects(ctx, state) {
  for (const obj of objects.filter(o => o.floor === state.floor)) {
    if (obj.kind === 'car' && state.objectState.vehicleInUse === obj.id) continue;
    if (obj.kind === 'soccer_field') continue;
    const active = state.entities.some(e => e.target?.objectId === obj.id || String(e.action || '').toLowerCase().includes(obj.kind));
    ctx.save();
    ctx.shadowColor = active ? 'rgba(232,198,97,.55)' : 'transparent';
    ctx.shadowBlur = active ? 16 : 0;
    if (!drawStyledObject(ctx, obj, state)) drawFallbackObject(ctx, obj);
    if (obj.id?.startsWith('pet_flap')) drawPetFlap(ctx, obj);
    if (obj.kind === 'stove') drawStoveBackPanel(ctx, obj, state);
    if (obj.kind === 'swim_pool') drawPoolDepthDetail(ctx, obj);
    ctx.restore();
  }
}

function drawPetFlap(ctx, o) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#5a4032';
  rounded(ctx, o.x, o.y, o.w, o.h, 7, true, false);
  ctx.fillStyle = '#1f2933';
  rounded(ctx, o.x + 5, o.y + 5, o.w - 10, o.h - 7, 6, true, false);
  ctx.strokeStyle = '#d8c4a4';
  ctx.lineWidth = 2;
  rounded(ctx, o.x + 4, o.y + 4, o.w - 8, o.h - 6, 6, false, true);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('DOG', o.x + o.w / 2, o.y - 3);
  ctx.textAlign = 'left';
  ctx.restore();
}

function drawPoolDepthDetail(ctx, o) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  const inner = { x: o.x + 19, y: o.y + 19, w: o.w - 38, h: o.h - 38 };
  rounded(ctx, inner.x, inner.y, inner.w, inner.h, 22, true, false, '#70c7d4');
  const bands = [
    { inset: 13, color: 'rgba(52,151,179,.30)' },
    { inset: 33, color: 'rgba(32,117,158,.36)' },
    { inset: 56, color: 'rgba(14,73,132,.45)' }
  ];
  for (const band of bands) {
    rounded(ctx, inner.x + band.inset, inner.y + band.inset, inner.w - band.inset * 2, inner.h - band.inset * 2, 18, true, false, band.color);
  }
  ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.lineWidth = 2;
  for (let y = inner.y + 24; y < inner.y + inner.h - 12; y += 26) {
    ctx.beginPath();
    ctx.moveTo(inner.x + 14, y);
    ctx.quadraticCurveTo(inner.x + inner.w / 2, y - 13, inner.x + inner.w - 14, y);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(9,36,65,.40)';
  ctx.lineWidth = 3;
  rounded(ctx, inner.x, inner.y, inner.w, inner.h, 22, false, true);
  drawPoolSteps(ctx, inner.x + 16, inner.y + inner.h - 48);
  ctx.fillStyle = 'rgba(255,255,255,.78)';
  ctx.font = '900 9px system-ui';
  ctx.fillText('SHALLOW', inner.x + 18, inner.y + 21);
  ctx.fillText('DEEP', inner.x + inner.w - 48, inner.y + inner.h - 20);
  ctx.restore();
}

function drawPoolSteps(ctx, x, y) {
  ctx.strokeStyle = 'rgba(255,255,255,.62)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    rounded(ctx, x + i * 6, y + i * 8, 48 - i * 10, 6, 3, false, true);
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

function rounded(ctx, x, y, w, h, r, fill = true, stroke = false, color = '') {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
