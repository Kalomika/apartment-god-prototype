import { PLAY_H, PLAY_W } from './config.js';
import { floors, objects } from './world.js';
import { roundRect } from './renderHelpers.js';
import { drawVehicleSprite } from './vehicleSpriteRenderer.js';
import { drawBikeMountOverlay, isBikeLikeVehicle } from './bikeMountRenderer.js';

export const FRONT_YARD_FLOOR = 6;
export const DRIVEWAY_FLOOR = 7;

const DRIVEWAY_CENTER = 460;
const DRIVEWAY_WIDTH = 336;
const GATE_Y = 414;
const ROAD_Y = 532;
const COURT = { x: 52, y: 164, w: 352, h: 224 };

const MAIN_FRONT_YARD_ROOMS = [
  { id: 'front_porch', name: 'Front Porch', x: 310, y: 42, w: 340, h: 104 },
  { id: 'front_garden', name: 'Front Garden', x: 32, y: 66, w: 896, h: 330 },
  { id: 'front_walk', name: 'Front Walk', x: 430, y: 132, w: 108, h: 302 },
  { id: 'front_curb', name: 'Front Curb', x: 24, y: 398, w: 912, h: 62 },
  { id: 'front_road_view', name: 'Neighborhood Road View', x: 24, y: 460, w: 912, h: 226 }
];

const WEST_DRIVEWAY_ROOMS = [
  { id: 'driveway_garage_mouth', name: 'Garage Mouth', x: DRIVEWAY_CENTER - DRIVEWAY_WIDTH / 2, y: 36, w: DRIVEWAY_WIDTH, h: 112 },
  { id: 'west_driveway', name: 'West Driveway', x: DRIVEWAY_CENTER - DRIVEWAY_WIDTH / 2, y: 92, w: DRIVEWAY_WIDTH, h: 382 },
  { id: 'driveway_yard_edge', name: 'Front Yard Edge', x: 650, y: 86, w: 250, h: 302 },
  { id: 'driveway_road', name: 'Neighborhood Road', x: 24, y: 388, w: 912, h: 298 }
];

const FRONT_OBJECTS = [
  { id: 'main_front_yard_exit', label: 'Front Yard', kind: 'stairs', styleAs: 'door', floor: 0, room: 'front_entry', x: 420, y: 676, w: 128, h: 28, solid: false, toFloor: FRONT_YARD_FLOOR, exitId: 'front_yard_house_entry' },
  { id: 'front_yard_house_entry', label: 'Main House Front Door', kind: 'stairs', styleAs: 'door', floor: FRONT_YARD_FLOOR, room: 'front_porch', x: 436, y: 54, w: 96, h: 28, solid: false, toFloor: 0, exitId: 'main_front_yard_exit' },
  { id: 'front_yard_driveway_edge', label: 'West Driveway', kind: 'stairs', styleAs: 'door', floor: FRONT_YARD_FLOOR, room: 'front_garden', x: 24, y: 254, w: 34, h: 98, solid: false, toFloor: DRIVEWAY_FLOOR, exitId: 'driveway_yard_edge_entry' },
  { id: 'driveway_yard_edge_entry', label: 'Front Yard', kind: 'stairs', styleAs: 'door', floor: DRIVEWAY_FLOOR, room: 'driveway_yard_edge', x: 868, y: 252, w: 34, h: 98, solid: false, toFloor: FRONT_YARD_FLOOR, exitId: 'front_yard_driveway_edge' },
  { id: 'garage_driveway_exit', label: 'Driveway Exit', kind: 'stairs', styleAs: 'door', floor: 3, room: 'garage', x: 392, y: 636, w: 136, h: 28, solid: false, toFloor: DRIVEWAY_FLOOR, exitId: 'front_driveway_garage_mouth' },
  { id: 'front_driveway_garage_mouth', label: 'Garage Door / Driveway', kind: 'stairs', styleAs: 'door', floor: DRIVEWAY_FLOOR, room: 'driveway_garage_mouth', x: 392, y: 64, w: 136, h: 42, solid: false, toFloor: 3, exitId: 'garage_driveway_exit' },
  { id: 'basketball_court', label: 'One on One Basketball Court', kind: 'basketball_court', styleAs: 'door', floor: FRONT_YARD_FLOOR, room: 'front_garden', ...COURT, solid: false, enterable: true }
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
  if (existing) { existing.name = name; existing.rooms = rooms.map(room => ({ ...room })); return; }
  floors.push({ id, name, rooms: rooms.map(room => ({ ...room })) });
}

export function updateFrontYardEnvironment(state, dt) {
  state.frontGate ??= { open: 0, requested: false };
  const vehicle = state.vehicleDeparture?.floor === DRIVEWAY_FLOOR ? state.vehicleDeparture : state.vehicleReturn?.floor === DRIVEWAY_FLOOR ? state.vehicleReturn : null;
  const peopleNear = (state.entities || []).some(e => !e.hidden && e.floor === DRIVEWAY_FLOOR && e.y > GATE_Y - 90 && (e.path?.some(p => p.y > GATE_Y + 35) || e.target?.y > GATE_Y + 35));
  const vehicleNear = vehicle && vehicle.y + (vehicle.h || 100) > GATE_Y - 100;
  state.frontGate.requested = Boolean(peopleNear || vehicleNear || vehicle?.gateRequested);
  const target = state.frontGate.requested ? 1 : 0;
  state.frontGate.open = approach(state.frontGate.open || 0, target, dt * 1.8);
}

export function frontVehicleGarageMouth(v) { return { x: DRIVEWAY_CENTER - (v.w || 112) / 2, y: 76 }; }
export function frontVehicleDrivewayMid(v) { return { x: DRIVEWAY_CENTER - (v.w || 112) / 2, y: 268 }; }
export function frontVehicleRoadMerge(v) { return { x: DRIVEWAY_CENTER - (v.w || 112) / 2, y: 486 }; }
export function frontVehicleRoadExit(v) { return { x: PLAY_W + 100, y: ROAD_Y }; }
export function frontVehicleRoadEntry(v) { return { x: -(v.w || 112) - 100, y: ROAD_Y }; }

export function beginFrontYardVehicleDeparture(state, v) {
  if (!v || v.frontYardComplete) return false;
  const start = frontVehicleGarageMouth(v);
  v.frontYardComplete = true;
  v.floor = DRIVEWAY_FLOOR;
  v.phase = isBikeLikeVehicle(v) ? 'front_small_pushout' : 'front_car_reversing';
  v.t = 0;
  v.x = start.x;
  v.y = -Math.max(70, v.h || 180);
  v.renderAngle = isBikeLikeVehicle(v) ? Math.PI : 0;
  v.facing = 'up';
  v.open = false;
  v.trunkOpen = false;
  v.mounted = false;
  v.pusherVisible = isBikeLikeVehicle(v);
  v.gateRequested = false;
  state.objectState.garageDoorOpen = true;
  state.floor = DRIVEWAY_FLOOR;
  state.viewHoldT = 8;
  state.followSelected = false;
  return true;
}

export function updateFrontYardVehicleDeparture(state, v, dt) {
  if (!v || v.floor !== DRIVEWAY_FLOOR || !String(v.phase || '').startsWith('front_')) return false;
  const small = isBikeLikeVehicle(v);
  if (v.phase === 'front_car_reversing' || v.phase === 'front_small_pushout') {
    const mid = frontVehicleDrivewayMid(v);
    const target = { x: mid.x + (small ? 32 : 0), y: mid.y };
    v.renderAngle = small ? lerpAngle(v.renderAngle, Math.PI * .88, dt * 1.4) : 0;
    if (moveVehicleToward(v, target, dt, small ? 82 : 112)) {
      v.phase = small ? 'front_small_steering' : 'front_car_gate_wait';
      v.t = 0;
      v.gateRequested = true;
    }
    return true;
  }
  if (v.phase === 'front_small_steering') {
    v.pusherVisible = true;
    v.renderAngle = lerpAngle(v.renderAngle, Math.PI, dt * 1.8);
    v.x = approach(v.x, DRIVEWAY_CENTER - (v.w || 70) / 2, dt * 58);
    v.y = approach(v.y, 332, dt * 44);
    v.frontWheelTurn = Math.sin(Math.min(1, v.t / 1.2) * Math.PI) * .55;
    if (v.t > 1.35) { v.phase = 'front_small_mounting'; v.t = 0; }
    return true;
  }
  if (v.phase === 'front_small_mounting') {
    v.gateRequested = true;
    v.pusherVisible = v.t < .45;
    v.mounted = v.t >= .45;
    v.frontWheelTurn = approach(v.frontWheelTurn || 0, 0, dt * 1.8);
    if (v.t > .95 && (state.frontGate?.open || 0) > .72) { v.phase = 'front_small_riding_gate'; v.t = 0; }
    return true;
  }
  if (v.phase === 'front_car_gate_wait') {
    v.gateRequested = true;
    if ((state.frontGate?.open || 0) > .72) { v.phase = 'front_car_turning'; v.t = 0; }
    return true;
  }
  if (v.phase === 'front_small_riding_gate') {
    v.mounted = true;
    v.gateRequested = true;
    const merge = frontVehicleRoadMerge(v);
    const p = clamp(v.t / 1.45, 0, 1);
    v.x = lerp(v.x, merge.x + 24, dt * 1.45);
    v.y = approach(v.y, merge.y, dt * 122);
    v.renderAngle = lerpAngle(v.renderAngle, Math.PI / 2, dt * (1.0 + p));
    v.frontWheelTurn = -.38 * Math.sin(p * Math.PI);
    if (v.t > 1.5 || near(v, { x: merge.x + 24, y: merge.y }, 12)) { v.phase = 'front_road_exit'; v.t = 0; v.renderAngle = Math.PI / 2; v.frontWheelTurn = 0; }
    return true;
  }
  if (v.phase === 'front_car_turning') {
    const merge = frontVehicleRoadMerge(v);
    const p = clamp(v.t / 1.6, 0, 1);
    v.gateRequested = true;
    v.x = approach(v.x, merge.x + 42, dt * 78);
    v.y = approach(v.y, merge.y, dt * 118);
    v.renderAngle = lerpAngle(0, Math.PI / 2, ease(p));
    v.frontWheelTurn = -.42 * Math.sin(p * Math.PI);
    if (v.t > 1.65 || near(v, { x: merge.x + 42, y: merge.y }, 12)) { v.phase = 'front_road_exit'; v.t = 0; v.renderAngle = Math.PI / 2; v.frontWheelTurn = 0; }
    return true;
  }
  if (v.phase === 'front_road_exit') {
    v.mounted = small;
    v.gateRequested = v.x < 650;
    v.renderAngle = Math.PI / 2;
    v.x += dt * (small ? 205 : 190);
    v.y = approach(v.y, ROAD_Y, dt * 80);
    if (v.x > PLAY_W + 40 || v.t > 7) return 'complete';
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
  v.renderAngle = Math.PI / 2;
  v.facing = 'up';
  v.open = false;
  v.trunkOpen = false;
  v.mounted = isBikeLikeVehicle(v);
  v.gateRequested = false;
  state.objectState.garageDoorOpen = true;
  state.floor = DRIVEWAY_FLOOR;
  state.viewHoldT = 9;
  state.followSelected = false;
  return true;
}

export function updateFrontYardVehicleReturn(state, v, dt) {
  if (!v || v.floor !== DRIVEWAY_FLOOR || !String(v.phase || '').startsWith('front_')) return false;
  if (v.phase === 'front_road_returning') {
    v.renderAngle = Math.PI / 2;
    const merge = frontVehicleRoadMerge(v);
    if (moveVehicleToward(v, { x: merge.x + 46, y: ROAD_Y }, dt, 185)) { v.phase = 'front_return_turning'; v.t = 0; v.gateRequested = true; }
    return true;
  }
  if (v.phase === 'front_return_turning') {
    const mouth = frontVehicleGarageMouth(v);
    const p = clamp(v.t / 1.6, 0, 1);
    v.gateRequested = true;
    if ((state.frontGate?.open || 0) < .65) return true;
    v.x = approach(v.x, mouth.x, dt * 82);
    v.y = approach(v.y, mouth.y + 42, dt * 132);
    v.renderAngle = lerpAngle(Math.PI / 2, 0, ease(p));
    v.frontWheelTurn = .4 * Math.sin(p * Math.PI);
    if (v.t > 1.7 || near(v, { x: mouth.x, y: mouth.y + 42 }, 11)) { v.renderAngle = 0; v.frontWheelTurn = 0; return 'garage'; }
    return true;
  }
  return false;
}

function moveVehicleToward(v, target, dt, speed) {
  const dx = target.x - v.x;
  const dy = target.y - v.y;
  const dist = Math.hypot(dx, dy);
  if (dist <= 3) { v.x = target.x; v.y = target.y; return true; }
  const step = Math.min(dist, dt * speed);
  v.x += dx / dist * step;
  v.y += dy / dist * step;
  return dist <= step + 3;
}

function near(v, target, radius = 8) { return Math.hypot((v.x || 0) - target.x, (v.y || 0) - target.y) <= radius; }
function approach(value, target, step) { if (value < target) return Math.min(target, value + step); if (value > target) return Math.max(target, value - step); return value; }
function lerp(a, b, t) { return a + (b - a) * clamp(t, 0, 1); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function lerpAngle(a, b, t) { return a + shortestAngle(b - a) * clamp(t, 0, 1); }
function shortestAngle(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }

export function drawFrontYardDriveway(ctx, state) {
  if (state.floor !== FRONT_YARD_FLOOR && state.floor !== DRIVEWAY_FLOOR) return;
  ctx.save();
  if (state.floor === FRONT_YARD_FLOOR) drawMainFrontYard(ctx, state);
  else drawWestDriveway(ctx, state);
  ctx.restore();
}

function drawMainFrontYard(ctx, state) {
  ctx.fillStyle = '#738b68';
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  drawFrontYardLawnTexture(ctx);
  drawFrontPorch(ctx);
  drawGardenBeds(ctx);
  drawFrontWalk(ctx);
  drawBasketballCourt(ctx, state);
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
  drawDrivewayGate(ctx, state.frontGate?.open || 0);
  drawFrontCurbAndRoad(ctx, true);
  drawDrivewayShrubs(ctx);
  drawFrontYardVehicle(ctx, state, state.vehicleDeparture);
  drawFrontYardVehicle(ctx, state, state.vehicleReturn);
}

function drawFrontYardLawnTexture(ctx) {
  ctx.save(); ctx.globalAlpha = .14; ctx.strokeStyle = '#d9e1b8'; ctx.lineWidth = 1;
  for (let y = 72; y < 390; y += 24) { ctx.beginPath(); ctx.moveTo(38, y); ctx.quadraticCurveTo(270, y + 10, 520, y - 4); ctx.quadraticCurveTo(746, y - 16, 920, y + 8); ctx.stroke(); }
  ctx.restore();
}

function drawFrontPorch(ctx) {
  roundRect(ctx, 310, 38, 340, 110, 12, '#776a5a');
  roundRect(ctx, 340, 62, 280, 64, 8, '#b8a98e');
  ctx.fillStyle = '#3a3230'; ctx.fillRect(438, 44, 84, 22);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(352, 74, 58, 8); ctx.fillRect(550, 74, 58, 8);
}

function drawGardenBeds(ctx) {
  const beds = [[700, 92, 186, 80], [650, 238, 218, 72]];
  for (const [x, y, w, h] of beds) { roundRect(ctx, x, y, w, h, 18, '#4f382e'); ctx.fillStyle = '#47683e'; for (let i = 0; i < 8; i++) circle(ctx, x + 24 + i * (w - 48) / 7, y + h / 2 + Math.sin(i) * 10, 10 + (i % 2)); }
}

function drawFrontWalk(ctx) {
  roundRect(ctx, 436, 126, 96, 316, 10, '#b7b0a4');
  ctx.strokeStyle = 'rgba(45,49,52,.28)'; ctx.lineWidth = 2;
  for (let y = 164; y < 420; y += 44) { ctx.beginPath(); ctx.moveTo(444, y); ctx.lineTo(524, y - 6); ctx.stroke(); }
}

function drawBasketballCourt(ctx) {
  roundRect(ctx, COURT.x, COURT.y, COURT.w, COURT.h, 18, '#5d6264');
  roundRect(ctx, COURT.x + 10, COURT.y + 10, COURT.w - 20, COURT.h - 20, 13, '#6d7475');
  ctx.strokeStyle = '#eee5d1'; ctx.lineWidth = 3;
  ctx.strokeRect(COURT.x + 18, COURT.y + 18, COURT.w - 36, COURT.h - 36);
  ctx.beginPath(); ctx.arc(COURT.x + 54, COURT.y + COURT.h / 2, 82, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.strokeRect(COURT.x + 18, COURT.y + COURT.h / 2 - 50, 92, 100);
  ctx.beginPath(); ctx.arc(COURT.x + 110, COURT.y + COURT.h / 2, 40, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.fillStyle = '#313744'; ctx.fillRect(COURT.x + 28, COURT.y + COURT.h / 2 - 34, 8, 68);
  ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(COURT.x + 48, COURT.y + COURT.h / 2, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '900 11px system-ui'; ctx.fillText('ONE ON ONE COURT', COURT.x + 188, COURT.y + 32);
}

function drawSmallTreeCanopies(ctx) {
  const trees = [[820, 190], [742, 330]];
  for (const [x, y] of trees) { ctx.fillStyle = '#274b32'; circle(ctx, x, y, 28); circle(ctx, x + 22, y + 8, 24); circle(ctx, x - 20, y + 12, 20); ctx.fillStyle = '#55402f'; ctx.fillRect(x - 5, y + 20, 10, 22); }
}

function drawDrivewayLawnEdge(ctx) {
  drawFrontYardLawnTexture(ctx);
  roundRect(ctx, 660, 92, 220, 250, 22, '#6f8f62');
  roundRect(ctx, 694, 142, 160, 90, 18, '#4f382e');
  ctx.fillStyle = '#496b43'; for (let x = 714; x < 840; x += 28) circle(ctx, x, 186 + Math.sin(x) * 8, 12);
}

function drawDriveway(ctx) {
  const x = DRIVEWAY_CENTER - DRIVEWAY_WIDTH / 2;
  roundRect(ctx, x, 82, DRIVEWAY_WIDTH, 462, 12, '#8f9697');
  roundRect(ctx, x + 26, 96, 118, 430, 7, '#a8aead');
  roundRect(ctx, x + DRIVEWAY_WIDTH - 144, 96, 118, 430, 7, '#9ca3a2');
  ctx.strokeStyle = 'rgba(38,43,45,.34)'; ctx.lineWidth = 2;
  for (let y = 148; y < 524; y += 72) { ctx.beginPath(); ctx.moveTo(x + 18, y); ctx.lineTo(x + DRIVEWAY_WIDTH - 18, y + 8); ctx.stroke(); }
}

function drawDrivewayGate(ctx, openness) {
  const open = clamp(openness, 0, 1);
  const leftEdge = DRIVEWAY_CENTER - DRIVEWAY_WIDTH / 2;
  const rightEdge = DRIVEWAY_CENTER + DRIVEWAY_WIDTH / 2;
  const panelW = DRIVEWAY_WIDTH / 2 - 12;
  ctx.save();
  ctx.fillStyle = '#5a4b3f'; ctx.fillRect(24, GATE_Y - 12, leftEdge - 30, 16); ctx.fillRect(rightEdge + 6, GATE_Y - 12, PLAY_W - rightEdge - 30, 16);
  for (let x = 44; x < leftEdge - 12; x += 42) ctx.fillRect(x, GATE_Y - 38, 10, 48);
  for (let x = rightEdge + 18; x < 920; x += 42) ctx.fillRect(x, GATE_Y - 38, 10, 48);
  const slide = panelW * open;
  ctx.fillStyle = '#d0c1ac';
  ctx.fillRect(leftEdge - slide, GATE_Y - 18, panelW, 9);
  ctx.fillRect(DRIVEWAY_CENTER + 12 + slide, GATE_Y - 18, panelW, 9);
  ctx.fillStyle = '#74e6ff'; ctx.globalAlpha = open > .05 ? .35 + open * .45 : .12; circle(ctx, DRIVEWAY_CENTER, GATE_Y - 24, 5);
  ctx.restore();
}

function drawFrontCurbAndRoad(ctx, drivewayOpen) {
  ctx.save(); ctx.fillStyle = '#c7bda6'; ctx.fillRect(0, 430, PLAY_W, 12);
  if (drivewayOpen) ctx.clearRect(DRIVEWAY_CENTER - DRIVEWAY_WIDTH / 2, 430, DRIVEWAY_WIDTH, 12);
  ctx.fillStyle = '#272d35'; ctx.fillRect(0, 458, PLAY_W, 262);
  ctx.fillStyle = '#343b43'; ctx.fillRect(0, 470, PLAY_W, 86);
  ctx.fillStyle = '#20262f'; ctx.fillRect(0, 584, PLAY_W, 118);
  ctx.fillStyle = '#c7bda6'; ctx.fillRect(0, 552, PLAY_W, 7);
  for (let x = 20; x < PLAY_W; x += 96) roundRect(ctx, x, 566, 48, 6, 3, '#f1c66a');
  ctx.restore();
}

function drawFrontYardBushes(ctx) { drawShrubClusters(ctx, [[734, 392], [844, 384]]); }
function drawDrivewayShrubs(ctx) { drawShrubClusters(ctx, [[94, 142], [124, 326], [700, 346], [842, 132]]); }
function drawShrubClusters(ctx, clusters) { ctx.save(); for (const [x, y] of clusters) { ctx.fillStyle = '#314f38'; circle(ctx, x, y, 24); circle(ctx, x + 22, y + 8, 20); circle(ctx, x - 18, y + 12, 17); ctx.fillStyle = 'rgba(214,225,170,.22)'; circle(ctx, x + 8, y - 7, 8); } ctx.restore(); }

function drawFrontYardVehicle(ctx, state, v) {
  if (!v || v.floor !== DRIVEWAY_FLOOR) return;
  const w = v.w || 80;
  const h = v.h || 120;
  const cx = (v.x || 0) + w / 2;
  const cy = (v.y || 0) + h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Number(v.renderAngle || 0));
  ctx.translate(-cx, -cy);
  const drawable = { ...v, facing: 'up' };
  const drawn = drawVehicleSprite(ctx, drawable, null, { open: false, trunkOpen: false, flash: false, rider: false });
  if (!drawn) roundRect(ctx, v.x || 0, v.y || 0, w, h, 14, '#789477');
  if (isBikeLikeVehicle(v)) drawBikeMountOverlay(ctx, drawable, state, { rider: Boolean(v.mounted) });
  if (v.pusherVisible) drawVehiclePusher(ctx, v);
  drawSteeringCue(ctx, v);
  ctx.restore();
}

function drawVehiclePusher(ctx, v) {
  const x = v.x + (v.w || 50) / 2 + 24;
  const y = v.y + (v.h || 100) * .62;
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(x, y + 13, 15, 8, 0, 0, Math.PI * 2); ctx.fill();
  roundRect(ctx, x - 10, y - 6, 20, 30, 7, '#79b7ff');
  circleFill(ctx, x, y - 16, 9, '#3a241f');
  line(ctx, x - 7, y, v.x + (v.w || 50) * .72, v.y + (v.h || 100) * .44, '#3a241f', 4);
}

function drawSteeringCue(ctx, v) {
  if (!v.frontWheelTurn) return;
  const x = v.x + (v.w || 50) / 2;
  const y = v.y + 12;
  ctx.save(); ctx.translate(x, y); ctx.rotate(v.frontWheelTurn); ctx.strokeStyle = '#101820'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.stroke(); ctx.restore();
}

function drawGarageMouth(ctx, state) {
  const open = state.objectState.garageDoorOpen || state.vehicleDeparture?.floor === DRIVEWAY_FLOOR || state.vehicleReturn?.floor === DRIVEWAY_FLOOR;
  roundRect(ctx, DRIVEWAY_CENTER - 92, 34, 184, 62, 8, open ? '#1f2731' : '#39414b');
  ctx.strokeStyle = open ? '#74e6ff' : '#20252b'; ctx.lineWidth = 3; ctx.strokeRect(DRIVEWAY_CENTER - 86, 40, 172, 52);
}

function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function circleFill(ctx, x, y, r, fill) { ctx.fillStyle = fill; circle(ctx, x, y, r); }
function line(ctx, x1, y1, x2, y2, color, width) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
