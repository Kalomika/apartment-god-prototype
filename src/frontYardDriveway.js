import { PLAY_W } from './config.js';
import { floors, objects } from './world.js';
import { roundRect } from './renderHelpers.js';
import { drawVehicleSprite } from './vehicleSpriteRenderer.js';

export const FRONT_YARD_FLOOR = 6;

const FRONT_ROOMS = [
  { id: 'front_lawn', name: 'Front Lawn', x: 24, y: 36, w: 912, h: 310 },
  { id: 'front_driveway', name: 'Driveway', x: 236, y: 64, w: 238, h: 470 },
  { id: 'front_gate', name: 'Front Gate Edge', x: 24, y: 340, w: 912, h: 96 },
  { id: 'front_road', name: 'Neighborhood Road', x: 24, y: 436, w: 912, h: 248 }
];

const FRONT_OBJECTS = [
  { id: 'garage_driveway_exit', label: 'Driveway Exit', kind: 'stairs', styleAs: 'door', floor: 3, room: 'garage', x: 390, y: 636, w: 136, h: 28, solid: false, toFloor: FRONT_YARD_FLOOR, exitId: 'front_driveway_garage_mouth' },
  { id: 'front_driveway_garage_mouth', label: 'Garage Door / Driveway', kind: 'stairs', styleAs: 'door', floor: FRONT_YARD_FLOOR, room: 'front_driveway', x: 320, y: 76, w: 92, h: 36, solid: false, toFloor: 3, exitId: 'garage_driveway_exit' }
];

let installed = false;

export function installFrontYardWorld() {
  if (installed) return;
  installed = true;
  if (!floors.some(floor => floor.id === FRONT_YARD_FLOOR)) {
    floors.push({ id: FRONT_YARD_FLOOR, name: 'Front Yard South', rooms: FRONT_ROOMS.map(room => ({ ...room })) });
  }
  for (const obj of FRONT_OBJECTS) {
    if (!objects.some(existing => existing.id === obj.id)) objects.push({ ...obj });
  }
}

export function frontVehicleGarageMouth(v) {
  return { x: 356 - (v.w || 112) / 2, y: 82 };
}

export function frontVehicleDrivewayMid(v) {
  return { x: 356 - (v.w || 112) / 2, y: 276 };
}

export function frontVehicleRoadMerge(v) {
  return { x: 356 - (v.w || 112) / 2, y: 468 };
}

export function frontVehicleRoadExit(v) {
  return { x: PLAY_W + 80, y: 520 };
}

export function frontVehicleRoadEntry(v) {
  return { x: -(v.w || 112) - 90, y: 520 };
}

export function beginFrontYardVehicleDeparture(state, v) {
  if (!v || v.frontYardComplete) return false;
  const start = frontVehicleGarageMouth(v);
  v.frontYardComplete = true;
  v.floor = FRONT_YARD_FLOOR;
  v.phase = 'front_driveway_entering';
  v.t = 0;
  v.x = start.x;
  v.y = -Math.max(80, v.h || 180);
  v.facing = 'down';
  v.open = false;
  v.trunkOpen = false;
  v.remoteFlashT = 0;
  v.remoteLabel = '';
  state.objectState.garageDoorOpen = false;
  state.floor = FRONT_YARD_FLOOR;
  state.viewHoldT = 8;
  state.followSelected = false;
  return true;
}

export function updateFrontYardVehicleDeparture(state, v, dt) {
  if (!v || v.floor !== FRONT_YARD_FLOOR || !String(v.phase || '').startsWith('front_')) return false;
  if (v.phase === 'front_driveway_entering') {
    v.facing = 'down';
    const target = frontVehicleDrivewayMid(v);
    if (moveVehicleToward(v, target, dt, 145)) {
      v.phase = 'front_driveway_turning';
      v.t = 0;
    }
    return true;
  }
  if (v.phase === 'front_driveway_turning') {
    const merge = frontVehicleRoadMerge(v);
    v.facing = v.t > 0.75 ? 'right' : 'down';
    v.x = approach(v.x, merge.x + 34, dt * 75);
    v.y = approach(v.y, merge.y, dt * 112);
    if (v.t > 1.15 || near(v, { x: merge.x + 34, y: merge.y }, 10)) {
      v.phase = 'front_road_exit';
      v.t = 0;
      v.facing = 'right';
    }
    return true;
  }
  if (v.phase === 'front_road_exit') {
    const exit = frontVehicleRoadExit(v);
    v.facing = 'right';
    v.x += dt * 190;
    v.y = approach(v.y, exit.y, dt * 70);
    if (v.x > PLAY_W + 30 || v.t > 6) return 'complete';
    return true;
  }
  return false;
}

export function beginFrontYardVehicleReturn(state, v) {
  if (!v) return false;
  const start = frontVehicleRoadEntry(v);
  v.floor = FRONT_YARD_FLOOR;
  v.phase = 'front_road_returning';
  v.t = 0;
  v.x = start.x;
  v.y = start.y;
  v.facing = 'right';
  v.open = false;
  v.trunkOpen = false;
  v.remoteFlashT = 0;
  v.remoteLabel = '';
  state.objectState.garageDoorOpen = false;
  state.floor = FRONT_YARD_FLOOR;
  state.viewHoldT = 9;
  state.followSelected = false;
  return true;
}

export function updateFrontYardVehicleReturn(state, v, dt) {
  if (!v || v.floor !== FRONT_YARD_FLOOR || !String(v.phase || '').startsWith('front_')) return false;
  if (v.phase === 'front_road_returning') {
    v.facing = 'right';
    const merge = frontVehicleRoadMerge(v);
    const target = { x: merge.x + 36, y: 520 };
    if (moveVehicleToward(v, target, dt, 185)) {
      v.phase = 'front_driveway_reversing';
      v.t = 0;
    }
    return true;
  }
  if (v.phase === 'front_driveway_reversing') {
    v.facing = v.t > 0.65 ? 'up' : 'left';
    const mouth = frontVehicleGarageMouth(v);
    const target = { x: mouth.x, y: mouth.y + 34 };
    if (moveVehicleToward(v, target, dt, 128)) return 'garage';
    return true;
  }
  return false;
}

function moveVehicleToward(v, target, dt, speed) {
  v.x = approach(v.x, target.x, dt * speed);
  v.y = approach(v.y, target.y, dt * speed);
  return near(v, target, 3);
}

function near(v, target, radius = 8) {
  return Math.hypot((v.x || 0) - target.x, (v.y || 0) - target.y) <= radius;
}

function approach(value, target, step) {
  if (value < target) return Math.min(target, value + step);
  if (value > target) return Math.max(target, value - step);
  return value;
}

export function drawFrontYardDriveway(ctx, state) {
  if (state.floor !== FRONT_YARD_FLOOR) return;
  ctx.save();
  ctx.fillStyle = '#768f6e';
  ctx.fillRect(0, 0, PLAY_W, 720);
  drawLawnTexture(ctx);
  drawDriveway(ctx);
  drawFrontGate(ctx);
  drawRoad(ctx);
  drawBushes(ctx);
  drawMailbox(ctx);
  drawGarageMouth(ctx, state);
  drawFrontYardVehicle(ctx, state.vehicleDeparture);
  drawFrontYardVehicle(ctx, state.vehicleReturn);
  ctx.restore();
}

function drawFrontYardVehicle(ctx, v) {
  if (!v || v.floor !== FRONT_YARD_FLOOR) return;
  ctx.save();
  const drawn = drawVehicleSprite(ctx, v, null, { open: false, trunkOpen: false, flash: false, rider: false });
  if (!drawn) roundRect(ctx, v.x || 0, v.y || 0, v.w || 80, v.h || 120, 14, '#789477');
  ctx.restore();
}

function drawLawnTexture(ctx) {
  ctx.save();
  ctx.globalAlpha = .15;
  ctx.strokeStyle = '#d9e1b8';
  ctx.lineWidth = 1;
  for (let y = 56; y < 396; y += 24) {
    ctx.beginPath();
    ctx.moveTo(38, y);
    ctx.quadraticCurveTo(260, y + 12, 502, y - 4);
    ctx.quadraticCurveTo(730, y - 18, 920, y + 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDriveway(ctx) {
  ctx.save();
  roundRect(ctx, 238, 64, 236, 480, 10, '#8f9697');
  roundRect(ctx, 258, 74, 86, 462, 6, '#a8aead');
  roundRect(ctx, 368, 74, 86, 462, 6, '#9ca3a2');
  ctx.strokeStyle = 'rgba(38,43,45,.34)';
  ctx.lineWidth = 2;
  for (let y = 124; y < 520; y += 72) {
    ctx.beginPath();
    ctx.moveTo(254, y);
    ctx.lineTo(458, y + 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFrontGate(ctx) {
  ctx.save();
  ctx.fillStyle = '#5a4b3f';
  ctx.fillRect(34, 398, 300, 16);
  ctx.fillRect(468, 398, 458, 16);
  for (let x = 46; x < 930; x += 42) ctx.fillRect(x, 372, 10, 48);
  ctx.fillStyle = '#d0c1ac';
  ctx.fillRect(336, 392, 60, 10);
  ctx.fillRect(404, 392, 60, 10);
  ctx.restore();
}

function drawRoad(ctx) {
  ctx.save();
  ctx.fillStyle = '#272d35';
  ctx.fillRect(0, 436, PLAY_W, 284);
  ctx.fillStyle = '#343b43';
  ctx.fillRect(0, 448, PLAY_W, 92);
  ctx.fillStyle = '#20262f';
  ctx.fillRect(0, 576, PLAY_W, 118);
  ctx.fillStyle = '#c7bda6';
  ctx.fillRect(0, 428, PLAY_W, 10);
  ctx.fillRect(0, 542, PLAY_W, 7);
  ctx.fillStyle = '#f1c66a';
  for (let x = 20; x < PLAY_W; x += 96) roundRect(ctx, x, 556, 48, 6, 3, '#f1c66a');
  ctx.restore();
}

function drawBushes(ctx) {
  const clusters = [[92, 118], [148, 292], [558, 118], [654, 196], [802, 134], [858, 302], [92, 360], [806, 366]];
  ctx.save();
  for (const [x, y] of clusters) {
    ctx.fillStyle = '#314f38';
    circle(ctx, x, y, 24);
    circle(ctx, x + 22, y + 8, 20);
    circle(ctx, x - 18, y + 12, 17);
    ctx.fillStyle = 'rgba(214,225,170,.22)';
    circle(ctx, x + 8, y - 7, 8);
  }
  ctx.restore();
}

function drawMailbox(ctx) {
  ctx.save();
  roundRect(ctx, 126, 404, 42, 28, 8, '#33445c');
  ctx.fillStyle = '#f1c66a';
  ctx.fillRect(160, 392, 7, 18);
  ctx.fillStyle = '#5a4b3f';
  ctx.fillRect(144, 432, 8, 42);
  ctx.restore();
}

function drawGarageMouth(ctx, state) {
  ctx.save();
  const open = state.vehicleDeparture?.floor === FRONT_YARD_FLOOR || state.vehicleReturn?.floor === FRONT_YARD_FLOOR;
  roundRect(ctx, 288, 42, 142, 48, 8, open ? '#1f2731' : '#39414b');
  ctx.strokeStyle = open ? '#74e6ff' : '#20252b';
  ctx.lineWidth = 3;
  ctx.strokeRect(292, 46, 134, 40);
  ctx.restore();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
