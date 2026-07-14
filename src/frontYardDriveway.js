import { PLAY_H, PLAY_W } from './config.js';
import { floors, objects } from './world.js';
import { roundRect } from './renderHelpers.js';
import { drawVehicleSprite } from './vehicleSpriteRenderer.js';

export const FRONT_YARD_FLOOR = 6;
export const DRIVEWAY_FLOOR = 7;

const MAIN_FRONT_YARD_ROOMS = [
  { id: 'front_porch', name: 'Front Porch', x: 310, y: 42, w: 340, h: 104 },
  { id: 'front_garden', name: 'Front Garden', x: 54, y: 66, w: 852, h: 274 },
  { id: 'front_walk', name: 'Front Walk', x: 430, y: 132, w: 108, h: 302 },
  { id: 'front_play_corner', name: 'Kids Hoop Corner', x: 62, y: 206, w: 220, h: 154 },
  { id: 'front_curb', name: 'Front Curb', x: 24, y: 398, w: 912, h: 62 },
  { id: 'front_road_view', name: 'Neighborhood Road View', x: 24, y: 460, w: 912, h: 226 }
];

const WEST_DRIVEWAY_ROOMS = [
  { id: 'driveway_garage_mouth', name: 'Garage Mouth', x: 250, y: 36, w: 276, h: 96 },
  { id: 'west_driveway', name: 'West Driveway', x: 222, y: 92, w: 304, h: 420 },
  { id: 'driveway_yard_edge', name: 'Front Yard Edge', x: 548, y: 86, w: 330, h: 302 },
  { id: 'driveway_gate', name: 'Driveway Gate Edge', x: 24, y: 388, w: 912, h: 70 },
  { id: 'driveway_road', name: 'Neighborhood Road', x: 24, y: 458, w: 912, h: 226 }
];

const FRONT_OBJECTS = [
  { id: 'main_front_yard_exit', label: 'Front Yard', kind: 'stairs', styleAs: 'door', floor: 0, room: 'front_entry', x: 462, y: 676, w: 128, h: 28, solid: false, toFloor: FRONT_YARD_FLOOR, exitId: 'front_yard_house_entry' },
  { id: 'front_yard_house_entry', label: 'Main House Front Door', kind: 'stairs', styleAs: 'door', floor: FRONT_YARD_FLOOR, room: 'front_porch', x: 436, y: 54, w: 96, h: 28, solid: false, toFloor: 0, exitId: 'main_front_yard_exit' },
  { id: 'front_yard_driveway_edge', label: 'West Driveway', kind: 'stairs', styleAs: 'door', floor: FRONT_YARD_FLOOR, room: 'front_garden', x: 24, y: 254, w: 34, h: 98, solid: false, toFloor: DRIVEWAY_FLOOR, exitId: 'driveway_yard_edge_entry' },
  { id: 'driveway_yard_edge_entry', label: 'Front Yard', kind: 'stairs', styleAs: 'door', floor: DRIVEWAY_FLOOR, room: 'driveway_yard_edge', x: 868, y: 252, w: 34, h: 98, solid: false, toFloor: FRONT_YARD_FLOOR, exitId: 'front_yard_driveway_edge' },
  { id: 'garage_driveway_exit', label: 'Driveway Exit', kind: 'stairs', styleAs: 'door', floor: 3, room: 'garage', x: 390, y: 636, w: 136, h: 28, solid: false, toFloor: DRIVEWAY_FLOOR, exitId: 'front_driveway_garage_mouth' },
  { id: 'front_driveway_garage_mouth', label: 'Garage Door / Driveway', kind: 'stairs', styleAs: 'door', floor: DRIVEWAY_FLOOR, room: 'driveway_garage_mouth', x: 316, y: 70, w: 116, h: 36, solid: false, toFloor: 3, exitId: 'garage_driveway_exit' }
];

let installed = false;

export function installFrontYardWorld() {
  if (installed) return;
  installed = true;
  installFloor(FRONT_YARD_FLOOR, 'Front Yard South', MAIN_FRONT_YARD_ROOMS);
  installFloor(DRIVEWAY_FLOOR, 'Driveway West', WEST_DRIVEWAY_ROOMS);
  for (const obj of FRONT_OBJECTS) {
    const existing = objects.find(item => item.id === obj.id);
    if (existing) Object.assign(existing, obj);
    else objects.push({ ...obj });
  }
}

function installFloor(id, name, rooms) {
  const existing = floors.find(floor => floor.id === id);
  if (existing) {
    existing.name = name;
    existing.rooms = rooms.map(room => ({ ...room }));
    return;
  }
  floors.push({ id, name, rooms: rooms.map(room => ({ ...room })) });
}

export function frontVehicleGarageMouth(v) {
  return { x: 374 - (v.w || 112) / 2, y: 86 };
}

export function frontVehicleDrivewayMid(v) {
  return { x: 374 - (v.w || 112) / 2, y: 278 };
}

export function frontVehicleRoadMerge(v) {
  return { x: 374 - (v.w || 112) / 2, y: 486 };
}

export function frontVehicleRoadExit(v) {
  return { x: PLAY_W + 80, y: 532 };
}

export function frontVehicleRoadEntry(v) {
  return { x: -(v.w || 112) - 90, y: 532 };
}

export function beginFrontYardVehicleDeparture(state, v) {
  if (!v || v.frontYardComplete) return false;
  const start = frontVehicleGarageMouth(v);
  v.frontYardComplete = true;
  v.floor = DRIVEWAY_FLOOR;
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
  state.floor = DRIVEWAY_FLOOR;
  state.viewHoldT = 8;
  state.followSelected = false;
  return true;
}

export function updateFrontYardVehicleDeparture(state, v, dt) {
  if (!v || v.floor !== DRIVEWAY_FLOOR || !String(v.phase || '').startsWith('front_')) return false;
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
  v.floor = DRIVEWAY_FLOOR;
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
  state.floor = DRIVEWAY_FLOOR;
  state.viewHoldT = 9;
  state.followSelected = false;
  return true;
}

export function updateFrontYardVehicleReturn(state, v, dt) {
  if (!v || v.floor !== DRIVEWAY_FLOOR || !String(v.phase || '').startsWith('front_')) return false;
  if (v.phase === 'front_road_returning') {
    v.facing = 'right';
    const merge = frontVehicleRoadMerge(v);
    const target = { x: merge.x + 36, y: 532 };
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
  if (state.floor !== FRONT_YARD_FLOOR && state.floor !== DRIVEWAY_FLOOR) return;
  ctx.save();
  if (state.floor === FRONT_YARD_FLOOR) drawMainFrontYard(ctx, state);
  if (state.floor === DRIVEWAY_FLOOR) drawWestDriveway(ctx, state);
  ctx.restore();
}

function drawMainFrontYard(ctx) {
  ctx.fillStyle = '#738b68';
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  drawFrontYardLawnTexture(ctx);
  drawFrontPorch(ctx);
  drawGardenBeds(ctx);
  drawFrontWalk(ctx);
  drawKidsHoopCorner(ctx);
  drawFrontCurbAndRoad(ctx, false);
  drawFrontYardBushes(ctx);
  drawSmallTreeCanopies(ctx);
}

function drawWestDriveway(ctx, state) {
  ctx.fillStyle = '#6f8567';
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  drawDrivewayLawnEdge(ctx);
  drawGarageMouth(ctx, state);
  drawDriveway(ctx);
  drawDrivewayGate(ctx);
  drawFrontCurbAndRoad(ctx, true);
  drawDrivewayShrubs(ctx);
  drawFrontYardVehicle(ctx, state.vehicleDeparture);
  drawFrontYardVehicle(ctx, state.vehicleReturn);
}

function drawFrontYardLawnTexture(ctx) {
  ctx.save();
  ctx.globalAlpha = .14;
  ctx.strokeStyle = '#d9e1b8';
  ctx.lineWidth = 1;
  for (let y = 72; y < 390; y += 24) {
    ctx.beginPath();
    ctx.moveTo(38, y);
    ctx.quadraticCurveTo(270, y + 10, 520, y - 4);
    ctx.quadraticCurveTo(746, y - 16, 920, y + 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFrontPorch(ctx) {
  roundRect(ctx, 310, 38, 340, 110, 12, '#776a5a');
  roundRect(ctx, 340, 62, 280, 64, 8, '#b8a98e');
  ctx.fillStyle = '#3a3230';
  ctx.fillRect(438, 44, 84, 22);
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  ctx.fillRect(352, 74, 58, 8);
  ctx.fillRect(550, 74, 58, 8);
}

function drawGardenBeds(ctx) {
  const beds = [[78, 92, 186, 80], [696, 92, 186, 80], [646, 238, 218, 72]];
  for (const [x, y, w, h] of beds) {
    roundRect(ctx, x, y, w, h, 18, '#4f382e');
    ctx.fillStyle = '#47683e';
    for (let i = 0; i < 8; i += 1) circle(ctx, x + 24 + i * (w - 48) / 7, y + h / 2 + Math.sin(i) * 10, 10 + (i % 2) * 4);
    ctx.fillStyle = 'rgba(241,198,106,.38)';
    for (let i = 0; i < 5; i += 1) circle(ctx, x + 34 + i * (w - 68) / 4, y + h / 2 - 8, 3);
  }
}

function drawFrontWalk(ctx) {
  roundRect(ctx, 436, 126, 96, 316, 10, '#b7b0a4');
  ctx.strokeStyle = 'rgba(45,49,52,.28)';
  ctx.lineWidth = 2;
  for (let y = 164; y < 420; y += 44) {
    ctx.beginPath();
    ctx.moveTo(444, y);
    ctx.lineTo(524, y - 6);
    ctx.stroke();
  }
}

function drawKidsHoopCorner(ctx) {
  roundRect(ctx, 78, 226, 172, 112, 16, 'rgba(86,83,75,.38)');
  ctx.strokeStyle = '#d6c7aa';
  ctx.lineWidth = 3;
  ctx.strokeRect(100, 248, 122, 68);
  ctx.fillStyle = '#313744';
  ctx.fillRect(138, 210, 8, 40);
  ctx.strokeStyle = '#f1c66a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(142, 250, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#d88a35';
  circle(ctx, 206, 314, 10);
}

function drawSmallTreeCanopies(ctx) {
  const trees = [[126, 166], [820, 190], [742, 330]];
  for (const [x, y] of trees) {
    ctx.fillStyle = '#274b32';
    circle(ctx, x, y, 28);
    circle(ctx, x + 22, y + 8, 24);
    circle(ctx, x - 20, y + 12, 20);
    ctx.fillStyle = '#55402f';
    ctx.fillRect(x - 5, y + 20, 10, 22);
  }
}

function drawDrivewayLawnEdge(ctx) {
  drawFrontYardLawnTexture(ctx);
  roundRect(ctx, 560, 92, 280, 250, 22, '#6f8f62');
  roundRect(ctx, 604, 142, 208, 90, 18, '#4f382e');
  ctx.fillStyle = '#496b43';
  for (let x = 626; x < 790; x += 28) circle(ctx, x, 186 + Math.sin(x) * 8, 12);
}

function drawDriveway(ctx) {
  roundRect(ctx, 222, 82, 304, 460, 12, '#8f9697');
  roundRect(ctx, 248, 96, 104, 430, 7, '#a8aead');
  roundRect(ctx, 386, 96, 104, 430, 7, '#9ca3a2');
  ctx.strokeStyle = 'rgba(38,43,45,.34)';
  ctx.lineWidth = 2;
  for (let y = 148; y < 524; y += 72) {
    ctx.beginPath();
    ctx.moveTo(240, y);
    ctx.lineTo(504, y + 8);
    ctx.stroke();
  }
}

function drawDrivewayGate(ctx) {
  ctx.save();
  ctx.fillStyle = '#5a4b3f';
  ctx.fillRect(24, 402, 174, 16);
  ctx.fillRect(536, 402, 390, 16);
  for (let x = 44; x < 920; x += 42) ctx.fillRect(x, 376, 10, 48);
  ctx.fillStyle = '#d0c1ac';
  ctx.fillRect(206, 396, 142, 9);
  ctx.fillRect(360, 396, 142, 9);
  ctx.restore();
}

function drawFrontCurbAndRoad(ctx, drivewayOpen) {
  ctx.save();
  ctx.fillStyle = '#c7bda6';
  ctx.fillRect(0, 430, PLAY_W, 12);
  if (drivewayOpen) ctx.clearRect(224, 430, 292, 12);
  ctx.fillStyle = '#272d35';
  ctx.fillRect(0, 458, PLAY_W, 262);
  ctx.fillStyle = '#343b43';
  ctx.fillRect(0, 470, PLAY_W, 86);
  ctx.fillStyle = '#20262f';
  ctx.fillRect(0, 584, PLAY_W, 118);
  ctx.fillStyle = '#c7bda6';
  ctx.fillRect(0, 552, PLAY_W, 7);
  ctx.fillStyle = '#f1c66a';
  for (let x = 20; x < PLAY_W; x += 96) roundRect(ctx, x, 566, 48, 6, 3, '#f1c66a');
  ctx.restore();
}

function drawFrontYardBushes(ctx) {
  const clusters = [[72, 382], [158, 388], [734, 392], [844, 384]];
  drawShrubClusters(ctx, clusters);
}

function drawDrivewayShrubs(ctx) {
  const clusters = [[94, 142], [124, 326], [642, 346], [820, 334], [842, 132]];
  drawShrubClusters(ctx, clusters);
}

function drawShrubClusters(ctx, clusters) {
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

function drawFrontYardVehicle(ctx, v) {
  if (!v || v.floor !== DRIVEWAY_FLOOR) return;
  ctx.save();
  const drawn = drawVehicleSprite(ctx, v, null, { open: false, trunkOpen: false, flash: false, rider: false });
  if (!drawn) roundRect(ctx, v.x || 0, v.y || 0, v.w || 80, v.h || 120, 14, '#789477');
  ctx.restore();
}

function drawGarageMouth(ctx, state) {
  ctx.save();
  const open = state.vehicleDeparture?.floor === DRIVEWAY_FLOOR || state.vehicleReturn?.floor === DRIVEWAY_FLOOR;
  roundRect(ctx, 284, 38, 176, 54, 8, open ? '#1f2731' : '#39414b');
  ctx.strokeStyle = open ? '#74e6ff' : '#20252b';
  ctx.lineWidth = 3;
  ctx.strokeRect(290, 44, 164, 44);
  ctx.restore();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
