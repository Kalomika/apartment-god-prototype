import './fit.js';
import { PLAY_H, PLAY_W, COLORS } from './config.js';
import { drawWorld } from './renderWorld.js';
import { drawObjects } from './renderObjects.js';
import { drawCarriedItems, drawDynamicProps } from './renderDynamic.js';
import { drawEntities } from './renderEntities.js';
import { syncPhoneUi } from './phoneUI.js';
import { formatTime } from './renderHelpers.js';

export { formatTime };

export function draw(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  syncPhoneUi(state);
  drawWorld(ctx, state);
  drawObjects(ctx, state);
  drawDynamicProps(ctx, state);
  drawFetchBall(ctx, state);
  drawEntities(ctx, state);
  drawActivityCloneFx(ctx, state);
  drawCarriedItems(ctx, state);
  drawStatus(ctx, state);
  drawOverlay(ctx, state);
}

function drawFetchBall(ctx, state) {
  const ball = state.fetch?.ball;
  if (!ball || ball.floor !== state.floor) return;
  ctx.save();
  ctx.fillStyle = '#f1c66a';
  ctx.strokeStyle = '#11151c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#11151c';
  ctx.font = '900 9px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('o', ball.x, ball.y + 4);
  ctx.restore();
}

function drawActivityCloneFx(ctx, state) {
  if (!state.poolGame?.balls || state.floor !== 2) return;
  ctx.save();
  for (const ball of state.poolGame.balls) {
    if (ball.pocketed) continue;
    ctx.fillStyle = ball.fill || '#f8fbff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.id === 'cue' ? 6 : 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#11151c';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
}

function drawStatus(ctx, state) {
  ctx.fillStyle = 'rgba(10,12,18,.72)';
  ctx.fillRect(12, 10, 360, 34);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 16px system-ui';
  const trash = state.garbage ? ` trash ${Math.round(state.garbage.kitchen || 0)}%` : '';
  ctx.fillText(`${formatTime(state.time)}   $${Math.round(state.money ?? 0)}   ${state.autonomyMode || 'guided'}${trash}`, 24, 32);
}

function drawOverlay(ctx, state) {
  if (!state.offsite) return;
  const allPeopleAway = state.entities.filter(e => e.type === 'person').every(e => e.hidden);
  const label = state.offsite.actionId.replaceAll('_', ' ');
  if (allPeopleAway) {
    ctx.fillStyle = 'rgba(8,10,15,.72)';
    ctx.fillRect(0, 0, PLAY_W, PLAY_H);
    ctx.fillStyle = COLORS.text;
    ctx.font = '900 36px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`Time: ${label}`, PLAY_W / 2, 320);
    ctx.font = '700 20px system-ui';
    ctx.fillText(`Clock ${formatTime(state.time)}`, PLAY_W / 2, 358);
    ctx.textAlign = 'left';
    return;
  }
  ctx.save();
  const x = PLAY_W - 254;
  const y = 12;
  ctx.fillStyle = 'rgba(8,10,15,.82)';
  ctx.fillRect(x, y, 242, 54);
  ctx.strokeStyle = 'rgba(241,198,106,.7)';
  ctx.strokeRect(x, y, 242, 54);
  ctx.fillStyle = '#f1c66a';
  ctx.beginPath();
  ctx.arc(x + 28, y + 27, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 13px system-ui';
  ctx.fillText(`Off site: ${label}`, x + 54, y + 23);
  ctx.font = '700 11px system-ui';
  ctx.fillText(`${Math.ceil(state.offsite.t || 0)}s left`, x + 54, y + 42);
  ctx.restore();
}
