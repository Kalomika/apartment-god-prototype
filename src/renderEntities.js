import { COLORS, MOODS } from './config.js';
import { drawProductionEntity } from './productionAssets.js';
import { roundRect } from './renderHelpers.js';

export function drawEntities(ctx, state) {
  for (const e of state.entities.filter(e => !e.hidden && e.floor === state.floor)) drawEntity(ctx, e, state.selectedId === e.id, state);
}

function drawEntity(ctx, e, selected, state) {
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.shadowColor = COLORS.shadow;
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  if (selected) { ctx.strokeStyle = COLORS.active; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 4, 28, 0, Math.PI * 2); ctx.stroke(); }
  if (!drawProductionEntity(ctx, e, state)) {
    if (e.type === 'dog') drawDog(ctx, e); else drawPerson(ctx, e);
  }
  if (e.actionT > 0) drawActionBar(ctx, e);
  if (e.bubble && e.bubbleT > 0) drawBubble(ctx, e.bubble);
  ctx.restore();
}

function drawPerson(ctx, e) {
  const action = String(e.action || '').toLowerCase();
  const moving = e.path?.length || e.pose === 'walk' || action.includes('walking') || action.includes('running');
  const t = performance.now() / 180;
  const s = Math.sin(t) * (moving ? 1 : .25);
  const social = socialPose(action);
  ctx.strokeStyle = e.color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';

  if (e.pose === 'sleep' || action.includes('sleep') || action.includes('nap')) return drawLyingPerson(ctx, e);
  if (e.pose === 'sit' || action.includes('tv') || action.includes('desk') || action.includes('phone') || action.includes('game') || action.includes('ordering')) return drawSittingPerson(ctx, e, s);
  if (social) return drawSocialPerson(ctx, e, social, s);
  if (action.includes('dance') || action.includes('music')) return drawDancingPerson(ctx, e, s);

  ctx.beginPath();
  ctx.moveTo(-7, 2); ctx.lineTo(-18, 24 + s * 5);
  ctx.moveTo(7, 2); ctx.lineTo(18, 24 - s * 5);
  ctx.moveTo(-11, -3); ctx.lineTo(-24, 9 - s * 6);
  ctx.moveTo(11, -3); ctx.lineTo(24, 9 + s * 6);
  ctx.stroke();
  roundRect(ctx, -14, -6, 28, 40, 12, e.color);
  drawHead(ctx, e, 0, -22);
}

function drawSittingPerson(ctx, e, s) {
  ctx.strokeStyle = e.color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-9, 12); ctx.lineTo(-20, 26);
  ctx.moveTo(9, 12); ctx.lineTo(20, 26);
  ctx.moveTo(-10, -1); ctx.lineTo(-24, 10 + s * 2);
  ctx.moveTo(10, -1); ctx.lineTo(24, 10 - s * 2);
  ctx.stroke();
  roundRect(ctx, -16, -5, 32, 30, 12, e.color);
  drawHead(ctx, e, 0, -22);
}

function drawLyingPerson(ctx, e) {
  ctx.save();
  ctx.rotate(-0.08);
  roundRect(ctx, -34, -10, 68, 24, 12, e.color);
  ctx.strokeStyle = e.color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-18, 8); ctx.lineTo(-34, 20);
  ctx.moveTo(10, 8); ctx.lineTo(28, 20);
  ctx.stroke();
  drawHead(ctx, e, -30, -6);
  ctx.restore();
}

function drawSocialPerson(ctx, e, pose, s) {
  ctx.strokeStyle = e.color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  const reach = pose === 'tickle' ? 30 + Math.abs(s) * 8 : pose === 'cuddle' || pose === 'kiss' || pose === 'hands' ? 26 : 20;
  ctx.beginPath();
  ctx.moveTo(-7, 2); ctx.lineTo(-15, 25);
  ctx.moveTo(7, 2); ctx.lineTo(15, 25);
  ctx.moveTo(-10, -2); ctx.lineTo(-reach, 2 + s * 3);
  ctx.moveTo(10, -2); ctx.lineTo(reach, 2 - s * 3);
  ctx.stroke();
  roundRect(ctx, -14, -6, 28, 40, 12, e.color);
  drawHead(ctx, e, pose === 'kiss' ? 4 : 0, -22);
  if (pose === 'tickle') {
    ctx.fillStyle = '#f8fbff';
    ctx.font = '900 11px system-ui';
    ctx.fillText('ha', 18, -34 + s * 2);
  }
}

function drawDancingPerson(ctx, e, s) {
  ctx.strokeStyle = e.color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, 4); ctx.lineTo(-20, 24 - s * 4);
  ctx.moveTo(8, 4); ctx.lineTo(20, 24 + s * 4);
  ctx.moveTo(-10, -3); ctx.lineTo(-25, -16 + s * 8);
  ctx.moveTo(10, -3); ctx.lineTo(25, -14 - s * 8);
  ctx.stroke();
  roundRect(ctx, -14, -6, 28, 40, 12, e.color);
  drawHead(ctx, e, s * 2, -22);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 14px system-ui';
  ctx.fillText('♪', 22, -28);
}

function drawHead(ctx, e, x, y) {
  ctx.fillStyle = e.color;
  ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#11151c';
  ctx.font = '800 12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(MOODS[e.mood] || ':)', x, y + 4);
  ctx.textAlign = 'left';
}

function drawDog(ctx, e) {
  const moving = e.path?.length || String(e.action || '').toLowerCase().includes('fetch');
  const s = Math.sin(performance.now() / 150) * (moving ? 1 : .2);
  ctx.fillStyle = e.color;
  ctx.beginPath(); ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(20, -8, 13, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = e.color; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-12, 8); ctx.lineTo(-18, 18 + s * 3);
  ctx.moveTo(8, 8); ctx.lineTo(15, 18 - s * 3);
  ctx.moveTo(-24, -2); ctx.lineTo(-34, -8 - s * 6);
  ctx.stroke();
  ctx.fillStyle = '#11151c'; ctx.font = '800 10px system-ui'; ctx.textAlign = 'center'; ctx.fillText('wo', 20, -5); ctx.textAlign = 'left';
}

function socialPose(action) {
  if (action.includes('kiss')) return 'kiss';
  if (action.includes('cuddle')) return 'cuddle';
  if (action.includes('tickle')) return 'tickle';
  if (action.includes('hands')) return 'hands';
  if (action.includes('pet') || action.includes('train')) return 'pet';
  return '';
}

function drawActionBar(ctx, e) {
  if (!e.actionTotal || e.actionTotal < e.actionT) e.actionTotal = e.actionT;
  const pct = Math.max(0, Math.min(1, 1 - e.actionT / Math.max(1, e.actionTotal)));
  roundRect(ctx, -34, 38, 68, 9, 5, 'rgba(10,12,18,.75)');
  roundRect(ctx, -32, 40, 64 * pct, 5, 4, '#f1c66a');
  ctx.fillStyle = '#f8fbff';
  ctx.font = '800 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(String(e.action || 'Working').slice(0, 14), 0, 58);
  ctx.textAlign = 'left';
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
