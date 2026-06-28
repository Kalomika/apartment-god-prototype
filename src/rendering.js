import './fit.js';
import { PLAY_H, PLAY_W, COLORS } from './config.js';
import { drawWorld } from './renderWorld.js';
import { drawObjects } from './renderObjects.js';
import { drawDynamicProps } from './renderDynamic.js';
import { drawEntities } from './renderEntities.js';
import { formatTime } from './renderHelpers.js';

export { formatTime };

export function draw(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawWorld(ctx, state);
  drawObjects(ctx, state);
  drawDynamicProps(ctx, state);
  drawFetchBall(ctx, state);
  drawEntities(ctx, state);
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

function drawStatus(ctx, state) {
  ctx.fillStyle = 'rgba(10,12,18,.72)';
  ctx.fillRect(12, 10, 260, 34);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 16px system-ui';
  ctx.fillText(`${formatTime(state.time)}   $${Math.round(state.money ?? 0)}   ${state.autonomyMode || 'guided'}`, 24, 32);
}

function drawOverlay(ctx, state) {
  if (!state.offsite) return;
  ctx.fillStyle = 'rgba(8,10,15,.72)';
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 36px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(`Time-lapse: ${state.offsite.actionId.replaceAll('_', ' ')}`, PLAY_W / 2, 320);
  ctx.font = '700 20px system-ui';
  ctx.fillText(`Clock ${formatTime(state.time)}`, PLAY_W / 2, 358);
  ctx.textAlign = 'left';
}
