import './fit.js';
import { PLAY_H, PLAY_W, COLORS } from './config.js';
import { drawWorld } from './renderWorld.js';
import { drawFrontYardDriveway } from './frontYardDriveway.js';
import { drawAnimeEnvironmentUnderlay } from './animeVisualLayer.js';
import { drawObjects } from './renderObjects.js';
import { drawBookWorld } from './bookRender.js';
import { drawObjectCorrectiveOverlays } from './objectCorrectiveOverlays.js';
import { drawVisualReplacementClears } from './visualReplacementClears.js';
import { drawRequestedAfterEntityVisualCorrections, drawRequestedVisualCorrections } from './requestedVisualCorrections.js';
import { applyRealismRuntimeCorrections, drawRealismAfterEntityCorrections, drawRealismCorrections } from './realismCorrectionPass.js';
import { applyMainFloorLayoutPolish, drawMainFloorLayoutPolish } from './mainFloorLayoutPolish.js?v=20260716-layer-source-fix';
import { drawVehicleOccupantOverlay } from './vehicleOccupantOverlay.js?v=20260714-visible-occupants';
import { drawBathBedAfterEntityOverlays, drawBathBedStateOverlays } from './bathBedStateOverlays.js';
import { drawVisualRegressionFixes } from './visualRegressionFixes.js';
import { drawVehicleSpriteOverlays } from './vehicleSpriteOverlays.js';
import { drawCarriedItems, drawDynamicProps } from './renderDynamic.js';
import { drawEntities } from './renderEntities.js?v=20260714-human-renderer-framework';
import { drawDogSpriteOverlay } from './dogSpriteOverlay.js?v=20260716-dog-anatomy';
import { drawTvStateCorrectiveOverlays } from './tvStateCorrectiveOverlays.js';
import { drawAfterEntityOverlays } from './afterEntityOverlays.js';
import { drawAnimeTimeLighting } from './animeTimeLighting.js';
import { drawSoccer } from './soccerSystem.js';
import { drawArcadeSystem } from './arcadeSystem.js';
import { drawBasketballSystem } from './basketballSystem.js';
import { drawOffsiteProgressOverlay } from './offsiteOverlay.js';
import { drawPanicRoomDoorCorrection } from './panicRoomCorrection.js';
import { drawGarageDoorAlignmentOverlay } from './garageDoorAlignmentOverlay.js';
import { syncPhoneUi } from './phoneUI.js';
import { drawCameraTransition, syncCameraNavigationUi } from './cameraNavigation.js';
import { formatTime } from './renderHelpers.js';

export { formatTime };

let phoneUiFailed = false;
let cameraUiFailed = false;

export function draw(ctx, state) {
  prepareRender(ctx, state);
  if (state.cameraTransition?.t > 0) drawTransitioningScene(ctx, state, true, true);
  else drawScene(ctx, state, true, true);
  drawHudLayers(ctx, state);
}

export function drawPhaserEnvironment(ctx, state) {
  prepareRender(ctx, state);
  if (state.cameraTransition?.t > 0) drawTransitioningScene(ctx, state, false, false);
  else drawScene(ctx, state, false, false);
}

export function drawPhaserForeground(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawForegroundLayers(ctx, state);
  drawHudLayers(ctx, state);
}

function prepareRender(ctx, state) {
  applyRealismRuntimeCorrections(state);
  applyMainFloorLayoutPolish(state);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  syncSafePhoneUi(state);
  syncSafeCameraUi(state);
}

function syncSafePhoneUi(state) {
  if (phoneUiFailed) return;
  try { syncPhoneUi(state); }
  catch (error) { phoneUiFailed = true; console.error('[Apartment God] Phone UI disabled after render error.', error); }
}

function syncSafeCameraUi(state) {
  if (cameraUiFailed) return;
  try { syncCameraNavigationUi(state); }
  catch (error) { cameraUiFailed = true; console.error('[Apartment God] Camera navigation UI disabled after render error.', error); }
}

function drawScene(ctx, state, includeActors, includeForeground) {
  drawEnvironmentLayers(ctx, state);
  if (includeActors) {
    drawEntities(ctx, state);
    drawDogSpriteOverlay(ctx, state);
  }
  if (includeForeground) drawForegroundLayers(ctx, state);
}

function drawEnvironmentLayers(ctx, state) {
  drawWorld(ctx, state);
  drawFrontYardDriveway(ctx, state);
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
  drawBathBedStateOverlays(ctx, state);
  drawTvStateCorrectiveOverlays(ctx, state);
  drawVehicleSpriteOverlays(ctx, state);
  drawDynamicProps(ctx, state);
  drawVehicleOccupantOverlay(ctx, state);
  drawGarageDoorAlignmentOverlay(ctx, state);
  drawFetchBall(ctx, state);
}

function drawForegroundLayers(ctx, state) {
  drawArcadeSystem(ctx, state);
  drawBasketballSystem(ctx, state);
  drawPanicRoomDoorCorrection(ctx, state);
  drawBathBedAfterEntityOverlays(ctx, state);
  drawRequestedAfterEntityVisualCorrections(ctx, state);
  drawRealismAfterEntityCorrections(ctx, state);
  drawAfterEntityOverlays(ctx, state);
  drawPoolFx(ctx, state);
  drawCarriedItems(ctx, state);
  drawAnimeTimeLighting(ctx, state);
}

function drawHudLayers(ctx, state) {
  drawStatus(ctx, state);
  drawOffsiteProgressOverlay(ctx, state);
  drawCameraTransition(ctx, state, PLAY_W, PLAY_H);
}

function drawTransitioningScene(ctx, state, includeActors, includeForeground) {
  const transition = state.cameraTransition;
  if (!Number.isInteger(transition.from) || !Number.isInteger(transition.to)) return drawScene(ctx, state, includeActors, includeForeground);
  if (transition.type === 'slide') return drawSlidingScene(ctx, state, transition, includeActors, includeForeground);
  return drawVerticalScene(ctx, state, transition, includeActors, includeForeground);
}

function drawSlidingScene(ctx, state, transition, includeActors, includeForeground) {
  const progress = 1 - Math.max(0, Math.min(1, transition.t / transition.total));
  const directionX = transition.direction?.x || 0;
  const directionY = transition.direction?.y || 0;
  const fromX = -directionX * PLAY_W * progress;
  const fromY = -directionY * PLAY_H * progress;
  const targetX = directionX * PLAY_W * (1 - progress);
  const targetY = directionY * PLAY_H * (1 - progress);
  ctx.save();
  clipPlay(ctx);
  drawSceneForFloor(ctx, state, transition.to, targetX, targetY, includeActors, includeForeground);
  drawSceneForFloor(ctx, state, transition.from, fromX, fromY, includeActors, includeForeground);
  ctx.restore();
}

function drawVerticalScene(ctx, state, transition, includeActors, includeForeground) {
  const progress = 1 - Math.max(0, Math.min(1, transition.t / transition.total));
  const goingUp = transition.direction === 'up';
  const targetScale = goingUp ? 1.12 - progress * .12 : .92 + progress * .08;
  const targetY = goingUp ? (1 - progress) * 26 : -(1 - progress) * 26;
  ctx.save();
  clipPlay(ctx);
  drawSceneForFloor(ctx, state, transition.from, 0, 0, includeActors, includeForeground);
  ctx.globalAlpha = Math.max(.12, progress);
  ctx.translate(PLAY_W / 2, PLAY_H / 2 + targetY);
  ctx.scale(targetScale, targetScale);
  ctx.translate(-PLAY_W / 2, -PLAY_H / 2);
  drawSceneForFloor(ctx, state, transition.to, 0, 0, includeActors, includeForeground);
  ctx.restore();
}

function drawSceneForFloor(ctx, state, floor, x, y, includeActors, includeForeground) {
  const currentFloor = state.floor;
  state.floor = floor;
  ctx.save();
  ctx.translate(x, y);
  drawScene(ctx, state, includeActors, includeForeground);
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

function drawStatus(ctx, state) {
  ctx.fillStyle = 'rgba(10,12,18,.72)';
  ctx.fillRect(12, 10, 300, 34);
  ctx.fillStyle = COLORS.text;
  ctx.font = '900 16px system-ui';
  const trash = state.garbage ? ` trash ${Math.round(state.garbage.kitchen || 0)}%` : '';
  ctx.fillText(`$${Math.round(state.money ?? 0)}   ${state.autonomyMode || 'guided'}${trash}`, 24, 32);
}

function drawPoolFx(ctx, state) {
  if (!state.poolGame || state.poolGame.floor !== state.floor) return;
  const game = state.poolGame;
  ctx.save();
  if (game.cueLine?.t > 0) {
    ctx.globalAlpha = Math.min(1, game.cueLine.t);
    ctx.strokeStyle = '#f1c66a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(game.cueLine.x1, game.cueLine.y1);
    ctx.lineTo(game.cueLine.x2, game.cueLine.y2);
    ctx.stroke();
  }
  if (game.cueThrust?.t > 0) {
    ctx.globalAlpha = Math.min(1, game.cueThrust.t * 2);
    ctx.strokeStyle = '#c99d62';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(game.cueThrust.x1, game.cueThrust.y1);
    ctx.lineTo(game.cueThrust.x2, game.cueThrust.y2);
    ctx.stroke();
  }
  if (game.messageT > 0 && game.message) {
    ctx.globalAlpha = Math.min(1, game.messageT / 1.2);
    ctx.fillStyle = 'rgba(8,10,15,.78)';
    ctx.fillRect(330, 48, 300, 34);
    ctx.fillStyle = '#f1c66a';
    ctx.font = '900 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(game.message, 480, 70);
    ctx.textAlign = 'left';
  }
  ctx.restore();
}
