import './fit.js';
import { PLAY_H, PLAY_W, COLORS } from './config.js';
import { drawWorld } from './renderWorld.js';
import { drawObjects } from './renderObjects.js';
import { drawCarriedItems, drawDynamicProps } from './renderDynamic.js';
import { drawEntities } from './renderEntities.js';
import { drawOffsiteScene } from './offsiteScenes.js';
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
  ctx.fillRect(12, 10, 390, 34);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 16px system-ui';
  const trash = state.garbage ? ` trash ${Math.round(state.garbage.kitchen || 0)}%` : '';
  const invested = state.investments?.lifetime ? ` inv $${Math.round(state.investments.lifetime)}` : '';
  ctx.fillText(`${formatTime(state.time)}   $${Math.round(state.money ?? 0)}   ${state.autonomyMode || 'guided'}${trash}${invested}`, 24, 32);
}

function drawOverlay(ctx, state) {
  if (!state.offsite) return;
  const allPeopleAway = state.entities.filter(e => e.type === 'person').every(e => e.hidden);
  const label = state.offsite.label || state.offsite.actionId.replaceAll('_', ' ');
  if (allPeopleAway) {
    drawOffsiteScene(ctx, state);
    ctx.fillStyle = COLORS.text;
    ctx.font = '700 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`Clock ${formatTime(state.time)}`, PLAY_W / 2, PLAY_H - 42);
    ctx.textAlign = 'left';
    return;
  }
  ctx.save();
  const x = PLAY_W - 278;
  const y = 12;
  ctx.fillStyle = 'rgba(8,10,15,.82)';
  ctx.fillRect(x, y, 266, 58);
  ctx.strokeStyle = 'rgba(241,198,106,.7)';
  ctx.strokeRect(x, y, 266, 58);
  ctx.fillStyle = '#f1c66a';
  ctx.beginPath();
  ctx.arc(x + 28, y + 28, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 13px system-ui';
  ctx.fillText(`Off site: ${label}`, x + 54, y + 24);
  ctx.font = '700 11px system-ui';
  ctx.fillText(`${state.offsite.stage === 'plane' ? 'Plane travel' : 'Activity'} • ${Math.ceil((state.offsite.stage === 'plane' ? state.offsite.planeT : state.offsite.t) || 0)}s left`, x + 54, y + 44);
  ctx.restore();
}
