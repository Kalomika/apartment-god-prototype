import { getObject } from './world.js';

const INSTALL_TIMEOUT_MS = 12000;
const INSTALL_POLL_MS = 40;

export function installPhaserRenderConflictCorrections(game) {
  if (!game) return;
  const timer = window.setInterval(() => {
    const scene = game.scene?.getScene?.('ApartmentGodParityScene');
    if (!scene?.state || !scene.environmentContext || !scene.apartmentGodActorVisuals) return;
    window.clearInterval(timer);
    attach(scene);
  }, INSTALL_POLL_MS);
  window.setTimeout(() => window.clearInterval(timer), INSTALL_TIMEOUT_MS);
}

function attach(scene) {
  if (scene.__apartmentGodRenderConflictCorrectionsInstalled) return;
  scene.__apartmentGodRenderConflictCorrectionsInstalled = true;
  const postUpdate = () => {
    eraseLegacyKitchenSink(scene.environmentContext, scene.state);
    drawPreferredKitchenSink(scene.environmentContext, scene.state);
    correctStationaryObjectFacing(scene);
    scene.environmentTexture?.refresh?.();
  };
  scene.events.on('postupdate', postUpdate);
  scene.events.once('shutdown', () => {
    scene.events.off('postupdate', postUpdate);
    scene.__apartmentGodRenderConflictCorrectionsInstalled = false;
  });
}

function eraseLegacyKitchenSink(ctx, state) {
  if (state.floor !== 0) return;
  const sink = getObject('sink');
  if (!sink || sink.floor !== state.floor) return;
  ctx.save();
  ctx.fillStyle = '#d8c4a4';
  ctx.fillRect(sink.x - 15, sink.y - 15, sink.w + 30, sink.h + 30);
  ctx.strokeStyle = 'rgba(124,103,75,.15)';
  ctx.lineWidth = 1;
  for (let y = sink.y - 8; y < sink.y + sink.h + 12; y += 14) {
    ctx.beginPath();
    ctx.moveTo(sink.x - 12, y);
    ctx.lineTo(sink.x + sink.w + 12, y + 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPreferredKitchenSink(ctx, state) {
  if (state.floor !== 0) return;
  const sink = getObject('sink');
  if (!sink || sink.floor !== state.floor) return;
  ctx.save();
  const cx = sink.x + sink.w / 2;
  const cy = sink.y + sink.h / 2;
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  rounded(ctx, -32, -25, 64, 50, 10, '#70523c');
  rounded(ctx, -27, -20, 54, 40, 9, '#d8c7ad');
  rounded(ctx, -20, -14, 40, 28, 10, '#eef4f2');
  rounded(ctx, -14, -9, 28, 18, 8, '#a8d3db');
  circle(ctx, 0, -11, 3, '#4e5964');
  line(ctx, 14, -15, 25, -23, '#cfd9dc', 2.2);
  ctx.restore();
}

function correctStationaryObjectFacing(scene) {
  for (const entity of scene.state.entities || []) {
    if (!entity || entity.hidden || entity.floor !== scene.state.floor || !(entity.actionT > 0)) continue;
    const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
    if (key.includes('sleep') || key.includes('nap') || key.includes('bed together') || key.includes('swim') || key.includes('lift weight') || key.includes('dog rest')) continue;
    const objectId = entity.pending?.objectId || entity.target?.objectId;
    const object = objectId ? getObject(objectId) : null;
    const record = scene.apartmentGodActorVisuals.get(entity.id);
    if (!object || !record?.sprite) continue;
    const dx = object.x + object.w / 2 - entity.x;
    const dy = object.y + object.h / 2 - entity.y;
    const direction = directionFromDelta(dx, dy, record.direction || 'south');
    record.direction = direction;
    entity.spriteDirection = direction;
    record.sprite.setRotation(0);
    if (!record.sprite.anims?.isPlaying) record.sprite.setFrame(`${direction}-1`);
  }
}

function directionFromDelta(dx, dy, fallback) {
  if (Math.hypot(dx, dy) < 2) return fallback;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'west' : 'east';
  return dy < 0 ? 'north' : 'south';
}

function rounded(ctx, x, y, w, h, radius, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
}

function circle(ctx, x, y, radius, fill) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
