import './fit.js';
import { PLAY_H, PLAY_W, COLORS } from './config.js';
import { drawWorld } from './renderWorld.js';
import { drawAnimeEnvironmentUnderlay } from './animeVisualLayer.js';
import { drawObjects } from './renderObjects.js';
import { drawBookWorld } from './bookRender.js';
import { drawObjectCorrectiveOverlays } from './objectCorrectiveOverlays.js';
import { drawVisualReplacementClears } from './visualReplacementClears.js';
import { drawRequestedAfterEntityVisualCorrections, drawRequestedVisualCorrections } from './requestedVisualCorrections.js';
import { applyRealismRuntimeCorrections, drawRealismAfterEntityCorrections, drawRealismCorrections } from './realismCorrectionPass.js';
import { applyMainFloorLayoutPolish, drawMainFloorLayoutPolish } from './mainFloorLayoutPolish.js';
import { drawVisualRegressionFixes } from './visualRegressionFixes.js';
import { drawVehicleSpriteOverlays } from './vehicleSpriteOverlays.js';
import { drawCarriedItems, drawDynamicProps } from './renderDynamic.js';
import { drawEntities } from './renderEntities.js';
import { drawAfterEntityOverlays } from './afterEntityOverlays.js';
import { drawAnimeTimeLighting } from './animeTimeLighting.js';
import { drawOffsiteScene } from './offsiteScenes.js';
import { drawSoccer } from './soccerSystem.js';
import { syncPhoneUi } from './phoneUI.js';
import { drawCameraTransition, syncCameraNavigationUi } from './cameraNavigation.js';
import { formatTime } from './renderHelpers.js';

export { formatTime };

let phoneUiFailed = false;
let cameraUiFailed = false;

export function draw(ctx, state) {
  applyRealismRuntimeCorrections(state);
  applyMainFloorLayoutPolish(state);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  syncSafePhoneUi(state);
  syncSafeCameraUi(state);

  if (state.cameraTransition?.t > 0) drawTransitioningScene(ctx, state);
  else drawScene(ctx, state);

  drawStatus(ctx, state);
  drawOverlay(ctx, state);
  drawCameraTransition(ctx, state, PLAY_W, PLAY_H);
}

function syncSafePhoneUi(state) {
  if (phoneUiFailed) return;
  try {
    syncPhoneUi(state);
  } catch (error) {
    phoneUiFailed = true;
    console.error('[Apartment God] Phone UI disabled after render error.', error);
  }
}

function syncSafeCameraUi(state) {
  if (cameraUiFailed) return;
  try {
    syncCameraNavigationUi(state);
  } catch (error) {
    cameraUiFailed = true;
    console.error('[Apartment God] Camera navigation UI disabled after render error.', error);
  }
}

function drawScene(ctx, state) {
  drawWorld(ctx, state);
  drawAnimeEnvironmentUnderlay(ctx, state);
  drawSoccer(ctx, state);
  drawObjects(ctx, state);
  drawBookWorld(ctx, state);
  drawObjectCorrectiveOverlays(ctx, state);
  drawVisualReplacementClears(ctx, state);
  drawRequestedVisualCorrections(ctx, state);
  drawRealismCorrections(ctx, state);
  drawVisualRegressionFixes(ctx, state);
  drawMainFloorLayoutPolish(ctx, state);
  drawVehicleSpriteOverlays(ctx, state);
  drawDynamicProps(ctx, state);
  drawFetchBall(ctx, state);
  drawEntities(ctx, state);
  drawRequestedAfterEntityVisualCorrections(ctx, state);
  drawRealismAfterEntityCorrections(ctx, state);
  drawAfterEntityOverlays(ctx, state);
  drawPoolFx(ctx, state);
  drawCarriedItems(ctx, state);
  drawAnimeTimeLighting(ctx, state);
}

function drawTransitioningScene(ctx, state) {
  const tr = state.cameraTransition;
  if (!Number.isInteger(tr.from) || !Number.isInteger(tr.to)) return drawScene(ctx, state);
  if (tr.type === 'slide') return drawSlidingScene(ctx, state, tr);
  return drawVerticalScene(ctx, state, tr);
}

function drawSlidingScene(ctx, state, tr) {
  const progress = 1 - Math.max(0, Math.min(1, tr.t / tr.total));
  const dirX = tr.direction?.x || 0;
  const dirY = tr.direction?.y || 0;
  const fromX = -dirX * PLAY_W * progress;
  const fromY = -dirY * PLAY_H * progress;
  const targetX = dirX * PLAY_W * (1 - progress);
  const targetY = dirY * PLAY_H * (1 - progress);

  ctx.save();
  clipPlay(ctx);
  drawSceneForFloor(ctx, state, tr.to, targetX, targetY);
  drawSceneForFloor(ctx, state, tr.from, fromX, fromY);
  ctx.restore();
}

function drawVerticalScene(ctx, state, tr) {
  const progress = 1 - Math.max(0, Math.min(1, tr.t / tr.total));
  const goingUp = tr.direction === 'up';
  const targetScale = goingUp ? 1.12 - progress * .12 : .92 + progress * .08;
  const targetY = goingUp ? (1 - progress) * 26 : -(1 - progress) * 26;

  ctx.save();
  clipPlay(ctx);
  drawSceneForFloor(ctx, state, tr.from, 0, 0);
  ctx.globalAlpha = Math.max(.12, progress);
  ctx.translate(PLAY_W / 2, PLAY_H / 2 + targetY);
  ctx.scale(targetScale, targetScale);
  ctx.translate(-PLAY_W / 2, -PLAY_H / 2);
  drawSceneForFloor(ctx, state, tr.to, 0, 0);
  ctx.restore();
}

function drawSceneForFloor(ctx, state, floor, x, y) {
  const currentFloor = state.floor;
  state.floor = floor;
  ctx.save();
  ctx.translate(x, y);
  drawScene(ctx, state);
  ctx.restore();
  state.floor = currentFloor;
}

function clipPlay(ctx) {
  ctx.beginPath();
  ctx.rect(0, 0, PLAY_W, PLAY_H);
  ctx.clip();
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

function drawPoolFx(ctx, state) {
  const game = state.poolGame;
  if (!game?.balls || state.floor !== 2) return;
  ctx.save();
  if (game.cueLine?.t > 0) {
    ctx.strokeStyle = 'rgba(241,198,106,.75)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(game.cueLine.x1, game.cueLine.y1);
    ctx.lineTo(game.cueLine.x2, game.cueLine.y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (game.cueThrust?.t > 0) {
    const pct = game.cueThrust.t / .45;
    const pull = 18 * Math.sin(pct * Math.PI);
    const dx = game.cueThrust.x2 - game.cueThrust.x1;
    const dy = game.cueThrust.y2 - game.cueThrust.y1;
    const mag = Math.max(1, Math.hypot(dx, dy));
    const ox = (dx / mag) * pull;
    const oy = (dy / mag) * pull;
    ctx.strokeStyle = '#d6b27a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(game.cueThrust.x1 - ox, game.cueThrust.y1 - oy);
    ctx.lineTo(game.cueThrust.x2 - ox, game.cueThrust.y2 - oy);
    ctx.stroke();
    ctx.strokeStyle = '#3b2a1d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(game.cueThrust.x2 - ox, game.cueThrust.y2 - oy);
    ctx.lineTo(game.cueThrust.x2 - ox + dx / mag * 10, game.cueThrust.y2 - oy + dy / mag * 10);
    ctx.stroke();
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
      ctx.fillText(String(ball.value), ball.x, ball.y + 2.5);
    }
  }
  ctx.restore();
}

function drawStatus(ctx, state) {
  ctx.save();
  ctx.fillStyle = 'rgba(7,10,16,.72)';
  ctx.fillRect(0, 0, 420, 31);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 14px system-ui';
  ctx.fillText(`${formatTime(state.time)}   $${Math.round(state.money ?? 0)}   ${state.autonomyMode}   trash ${Math.round(state.garbage?.kitchen || 0)}%`, 12, 20);
  ctx.fillStyle = 'rgba(116,230,255,.28)';
  ctx.fillRect(438, 12, 120, 12);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.fillRect(560, 12, 200, 12);
  ctx.restore();
}

function drawOverlay(ctx, state) {
  if (!state.paused) return;
  ctx.fillStyle = 'rgba(0,0,0,.35)';
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 42px system-ui';
  ctx.fillText('PAUSED', 390, 350);
}
