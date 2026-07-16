import { getObject } from './world.js';

const DOOR = { x: 292, y: 636, w: 336, h: 28 };

export function applyGarageDoorAlignment() {
  const door = getObject('garage_overhead_door');
  if (door) Object.assign(door, DOOR, { facing: 'down', solid: false });
  const exit = getObject('garage_driveway_exit');
  if (exit) Object.assign(exit, { x: 392, y: 636, w: 136, h: 28 });
}

export function drawGarageDoorAlignmentOverlay(ctx, state) {
  if (state.floor !== 3) return;
  const open = Boolean(state.objectState?.garageDoorOpen);
  ctx.save();
  ctx.fillStyle = '#9a9d97';
  ctx.fillRect(178, 626, 564, 48);
  ctx.fillStyle = open ? 'rgba(31,39,49,.92)' : '#343b46';
  ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  ctx.strokeStyle = open ? '#74e6ff' : '#151a20';
  ctx.lineWidth = 3;
  ctx.strokeRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
  if (!open) {
    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.lineWidth = 1;
    for (let x = DOOR.x + 28; x < DOOR.x + DOOR.w; x += 42) {
      ctx.beginPath(); ctx.moveTo(x, DOOR.y + 3); ctx.lineTo(x, DOOR.y + DOOR.h - 3); ctx.stroke();
    }
  }
  ctx.restore();
}

applyGarageDoorAlignment();
