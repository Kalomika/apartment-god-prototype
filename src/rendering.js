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
  const game = state.poolGame;
  if (!game?.balls || state.floor !== 2) return;
  ctx.save();
  if (game.cueLine?.t > 0) {
    game.cueLine.t -= 0.03;
    ctx.strokeStyle = 'rgba(241,198,106,.75)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(game.cueLine.x1, game.cueLine.y1);
    ctx.lineTo(game.cueLine.x2, game.cueLine.y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  for (const ball of game.balls) {
    if (ball.pocketed) continue;
    ctx.fillStyle = ball.fill || '#f8fbff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.id === 'cue' ? 6 : 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#11151c';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (ball.value) {
      ctx.fillStyle = '#11151c';
      ctx.font = '900 7px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(ball.value, ball.x, ball.y + 3);
      ctx.textAlign = 'left';
    }
  }
  drawPoolScoreboard(ctx, game);
  ctx.restore();
}

function drawPoolScoreboard(ctx, game) {
  const x = 86;
  const y = 238;
  ctx.fillStyle = 'rgba(8,10,15,.78)';
  ctx.fillRect(x, y, 310, 74);
  ctx.strokeStyle = 'rgba(116,230,255,.7)';
  ctx.strokeRect(x, y, 310, 74);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 13px system-ui';
  const names = game.names || game.playerIds || [];
  const rows = names.map((name, index) => {
    const id = game.playerIds?.[index] || name;
    return `${index === game.turn % Math.max(1, names.length) && !game.winner ? '▶ ' : ''}${name}: ${game.score?.[id] || 0}`;
  }).join('   ');
  ctx.fillText(rows || 'Pool mini game', x + 12, y + 24);
  ctx.font = '800 12px system-ui';
  ctx.fillStyle = '#f1c66a';
  ctx.fillText(game.winner ? `Winner: ${game.winner}` : game.message || 'Taking shots', x + 12, y + 48);
  ctx.fillStyle = '#b6c1d2';
  ctx.fillText(`Shots ${Object.values(game.shots || {}).reduce((sum, n) => sum + n, 0)}`, x + 12, y + 66);
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
