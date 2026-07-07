import { addGarbageFromAction } from './garbage.js';
import { byId, changeNeed, log, say } from './state.js';
import { getObject } from './world.js';

function chosenCar() {
  return getObject('car_1') || getObject('car_2') || { id: 'car_1', x: 126, y: 138, w: 116, h: 230 };
}

function driveVector(car, leaving = true) {
  const vertical = car.h >= car.w;
  if (vertical) return { x: 0, y: leaving ? -1 : 1 };
  return { x: leaving ? 1 : -1, y: 0 };
}

export function beginVehicleDeparture(state, actionId, partyIds = []) {
  const car = chosenCar();
  const dir = driveVector(car, true);
  state.objectState.vehicleInUse = car.id;
  state.vehicleDeparture = {
    actionId,
    partyIds,
    vehicleId: car.id,
    t: 0,
    phase: 'opening',
    floor: 3,
    x: car.x,
    y: car.y,
    w: car.w,
    h: car.h,
    dir,
    open: false
  };
  state.objectState.garageDoorOpen = true;
  state.floor = 3;
  state.viewHoldT = 5;
  log(state, `Garage door opening for ${actionId.replaceAll('_', ' ')}.`);
}

export function beginVehicleReturn(state, actionId, partyIds = [], vehicleId = state.objectState.vehicleInUse || 'car_1') {
  const car = getObject(vehicleId) || chosenCar();
  const vertical = car.h >= car.w;
  state.objectState.vehicleInUse = car.id;
  state.vehicleReturn = {
    actionId,
    partyIds,
    vehicleId: car.id,
    t: 0,
    phase: 'arriving',
    floor: 3,
    x: vertical ? car.x : -car.w - 40,
    y: vertical ? -car.h - 40 : car.y,
    parkX: car.x,
    parkY: car.y,
    w: car.w,
    h: car.h,
    dir: driveVector(car, false),
    open: true
  };
  state.objectState.garageDoorOpen = true;
  state.floor = 3;
  state.viewHoldT = 7;
  log(state, `Garage door opening. Returning from ${actionId.replaceAll('_', ' ')}.`);
}

export function updateVehicleDeparture(state, dt) {
  updateVehicleLeaving(state, dt);
  updateVehicleReturning(state, dt);
}

function updateVehicleLeaving(state, dt) {
  const v = state.vehicleDeparture;
  if (!v) return;
  v.t += dt;
  if (v.t > 0.8) { v.phase = 'leaving'; v.open = true; }
  if (v.phase === 'leaving') {
    v.x += v.dir.x * dt * 135;
    v.y += v.dir.y * dt * 135;
  }
  const gone = v.y + v.h < -30 || v.y > 760 || v.x + v.w < -30 || v.x > 990;
  if (gone || v.t > 5) {
    state.objectState.garageDoorOpen = false;
    state.vehicleDeparture = null;
  }
}

function updateVehicleReturning(state, dt) {
  const v = state.vehicleReturn;
  if (!v) return;
  v.t += dt;
  if (v.phase === 'arriving') {
    v.x = approach(v.x, v.parkX, dt * 135);
    v.y = approach(v.y, v.parkY, dt * 135);
    if (Math.abs(v.x - v.parkX) < 1 && Math.abs(v.y - v.parkY) < 1) {
      v.x = v.parkX;
      v.y = v.parkY;
      v.phase = 'parking';
      v.t = 0;
      log(state, 'The car parked in the garage.');
    }
    return;
  }
  if (v.phase === 'parking' && v.t > 0.8) {
    v.phase = 'walking_in';
    v.t = 0;
    for (const id of v.partyIds || []) {
      const e = byId(state, id);
      if (!e) continue;
      e.hidden = false;
      e.floor = 3;
      e.x = 660;
      e.y = 540;
      e.path = [{ x: 660, y: 512 }];
      e.target = null;
      e.pending = null;
      e.action = 'Walking in from garage';
      e.pose = 'walk';
      say(e, 'BACK');
    }
    log(state, 'The returning party is walking back inside.');
    return;
  }
  if (v.phase === 'walking_in' && v.t > 2.2) {
    finishVehicleReturn(state, v);
  }
}

function approach(value, target, step) {
  if (value < target) return Math.min(target, value + step);
  if (value > target) return Math.max(target, value - step);
  return value;
}

function finishVehicleReturn(state, v) {
  const action = v.actionId;
  for (const id of v.partyIds || []) {
    const e = byId(state, id);
    if (!e) continue;
    e.hidden = false;
    e.floor = 0;
    e.x = 650;
    e.y = 532;
    e.path = [];
    e.target = null;
    e.pending = null;
    e.action = 'Returned';
    e.pose = 'stand';
    changeNeed(e, 'fun', action === 'work' ? -5 : 22);
    changeNeed(e, 'hunger', -12);
    changeNeed(e, 'energy', -12);
    changeNeed(e, 'freshness', -3);
    if (action === 'movies') addGarbageFromAction(state, 'popcorn', e);
  }
  state.objectState.garageDoorOpen = false;
  state.objectState.vehicleInUse = null;
  state.vehicleReturn = null;
  log(state, `Returned from ${action.replaceAll('_', ' ')}.`);
}
