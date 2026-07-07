import './fit.js';
import { PLAY_H, PLAY_W, COLORS } from './config.js';
import { drawWorld } from './renderWorld.js';
import { drawObjects } from './renderObjects.js';
import { drawVehicleCorrections } from './renderVehicleCorrections.js';
import { drawActivityOverlays as drawFx } from './renderActivityOverlays.js';
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
  drawVehicleCorrections(ctx, state);
  drawDynamicProps(ctx, state);
  drawFetchBall(ctx, state);
  drawEntities(ctx, state);
  drawFx(ctx, state);
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
  ctx.save();
  ctx.fillStyle = 'rgba(8,10,15,.88)';
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  if (state.offsite.stage === 'travel') drawTravelScene(ctx, state.offsite);
  else if (state.offsite.scene?.id === 'movie_theater') drawMovieTheater(ctx, state.offsite);
  else drawGenericOffsite(ctx, state.offsite);
  drawOffsiteProgress(ctx, state.offsite);
  ctx.restore();
}

function drawTravelScene(ctx, job) {
  ctx.fillStyle = '#151c29';
  ctx.fillRect(80, 80, 800, 560);
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 4;
  ctx.strokeRect(80, 80, 800, 560);
  ctx.fillStyle = '#2f3949';
  for (let i = 0; i < 8; i++) ctx.fillRect(130 + i * 92, 120, 42, 470);
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 32px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Traveling', PLAY_W / 2, 310);
  ctx.font = '700 18px system-ui';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(`Heading to ${job.scene?.title || job.actionId.replaceAll('_', ' ')}`, PLAY_W / 2, 344);
  ctx.fillStyle = '#7fb5ff';
  ctx.fillRect(382, 410, 196, 56);
  ctx.fillStyle = '#101522';
  ctx.fillRect(410, 425, 136, 20);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 14px system-ui';
  ctx.fillText('CAR', PLAY_W / 2, 442);
}

function drawMovieTheater(ctx, job) {
  ctx.fillStyle = '#111622';
  ctx.fillRect(78, 58, 804, 584);
  ctx.strokeStyle = 'rgba(241,198,106,.42)';
  ctx.lineWidth = 4;
  ctx.strokeRect(78, 58, 804, 584);
  ctx.fillStyle = '#e7edf8';
  ctx.fillRect(160, 92, 640, 74);
  ctx.fillStyle = '#111622';
  ctx.font = '900 24px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Generated Movie', PLAY_W / 2, 138);
  ctx.fillStyle = '#252c3a';
  for (let row = 0; row < 6; row++) {
    const y = 225 + row * 55;
    ctx.fillRect(170, y - 18, 620, 34);
    for (let seat = 0; seat < 12; seat++) {
      ctx.fillStyle = seat % 3 === 0 ? '#73506a' : '#314053';
      ctx.fillRect(190 + seat * 49, y - 10, 31, 22);
    }
  }
  const count = Math.max(1, job.actors?.length || 1);
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = i === 0 ? COLORS.resident : COLORS.girlfriend;
    ctx.beginPath();
    ctx.arc(425 + i * 48, 337, 13, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 28px system-ui';
  ctx.fillText('Movie Theater', PLAY_W / 2, 566);
  ctx.font = '700 16px system-ui';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText('Rows, seats, screen, and time passing while the movie plays.', PLAY_W / 2, 592);
}

function drawGenericOffsite(ctx, job) {
  ctx.fillStyle = '#151c29';
  ctx.fillRect(96, 90, 768, 540);
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 4;
  ctx.strokeRect(96, 90, 768, 540);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 34px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(job.scene?.title || job.actionId.replaceAll('_', ' '), PLAY_W / 2, 326);
  ctx.font = '700 18px system-ui';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(job.scene?.activity || 'activity in progress', PLAY_W / 2, 360);
}

function drawOffsiteProgress(ctx, job) {
  const label = job.stage === 'travel' ? 'Travel time' : (job.scene?.activity || 'Activity');
  const total = Math.max(1, job.stage === 'travel' ? job.travelTotal || 1 : job.activityTotal || 1);
  const remain = Math.max(0, job.stage === 'travel' ? job.travelT || 0 : job.activityT || 0);
  const pct = 1 - remain / total;
  ctx.fillStyle = 'rgba(0,0,0,.5)';
  ctx.fillRect(260, 662, 440, 22);
  ctx.fillStyle = '#f1c66a';
  ctx.fillRect(263, 665, Math.max(0, 434 * pct), 16);
  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.strokeRect(260, 662, 440, 22);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 15px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(`${label} ${Math.ceil(remain)}s`, PLAY_W / 2, 654);
}
