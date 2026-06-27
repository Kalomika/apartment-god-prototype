import { COLORS, MOODS } from './config.js';
import { roundRect } from './renderHelpers.js';

export function drawEntities(ctx, state) {
  for (const e of state.entities.filter(e => !e.hidden && e.floor === state.floor)) drawEntity(ctx, e, state.selectedId === e.id);
}

function drawEntity(ctx, e, selected) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.shadowColor = COLORS.shadow;
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  if (selected) { ctx.strokeStyle = COLORS.active; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 4, 28, 0, Math.PI * 2); ctx.stroke(); }
  if (e.type === 'dog') drawDog(ctx, e); else drawPerson(ctx, e);
  if (e.bubble && e.bubbleT > 0) drawBubble(ctx, e.bubble);
  ctx.restore();
}

function drawPerson(ctx, e) {
  ctx.fillStyle = e.color;
  if (e.pose === 'sleep') {
    roundRect(ctx, -28, -10, 56, 24, 12, e.color);
  } else {
    ctx.beginPath(); ctx.arc(0, -18, 16, 0, Math.PI * 2); ctx.fill();
    roundRect(ctx, -14, -4, 28, e.pose === 'sit' ? 28 : 42, 12, e.color);
  }
  ctx.fillStyle = '#11151c';
  ctx.font = '800 12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(MOODS[e.mood] || ':)', 0, -14);
  ctx.textAlign = 'left';
}

function drawDog(ctx, e) {
  ctx.fillStyle = e.color;
  ctx.beginPath(); ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(20, -8, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#11151c'; ctx.font = '800 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText('wo', 20, -5); ctx.textAlign = 'left';
}

function drawBubble(ctx, text) {
  const w = Math.max(72, text.length * 12 + 24);
  roundRect(ctx, -w / 2, -76, w, 34, 12, '#f8fbff');
  ctx.fillStyle = '#10141b';
  ctx.font = '900 16px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, -54);
  ctx.textAlign = 'left';
}
