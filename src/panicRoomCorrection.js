import { doorways } from './blueprint.js';
import { getObject } from './world.js';

const DOORWAY = { floor: 1, a: 'hall', b: 'panic_room', x: 540, y: 508, w: 84, h: 30 };

export function applyPanicRoomCorrection() {
  const door = getObject('panic_room_door');
  if (door) Object.assign(door, {
    label: 'Steel Panic Room Door',
    kind: 'door',
    actionSet: 'panic_room_door',
    styleAs: 'door',
    room: 'panic_room',
    x: 540,
    y: 508,
    w: 84,
    h: 26,
    facing: 'north',
    solid: false,
    enterable: false
  });
  if (!doorways.some(d => d.floor === 1 && d.a === 'hall' && d.b === 'panic_room')) doorways.push({ ...DOORWAY });
}

export function drawPanicRoomDoorCorrection(ctx, state) {
  if (state.floor !== 1) return;
  const door = getObject('panic_room_door');
  if (!door) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.20)';
  round(ctx, door.x - 5, door.y + 4, door.w + 10, door.h + 8, 5);
  ctx.fillStyle = '#48515c';
  round(ctx, door.x, door.y, door.w, door.h, 4);
  ctx.fillStyle = '#202833';
  round(ctx, door.x + 7, door.y + 5, door.w - 14, door.h - 10, 3);
  ctx.strokeStyle = '#74e6ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(door.x + 3, door.y + 3, door.w - 6, door.h - 6);
  ctx.fillStyle = '#f1c66a';
  ctx.beginPath();
  ctx.arc(door.x + door.w - 13, door.y + door.h / 2, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 8px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('PANIC ROOM', door.x + door.w / 2, door.y - 5);
  ctx.textAlign = 'left';
  ctx.restore();
}

function round(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  ctx.fill();
}

applyPanicRoomCorrection();
