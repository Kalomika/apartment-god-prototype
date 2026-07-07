import { addGarbageFromAction } from './garbage.js';
import { byId, log, say } from './state.js';
import { getObject, approachPoint } from './world.js';
import { commandObject } from './movement.js';
import { createOffsiteJob } from './travelLocations.js';

const GARAGE_FLOOR = 3;
const GARAGE_EXIT_Y = -40;

function parkedVehicle(vehicleId = 'auto', actorId = '', partyIds = []) {
  const forced = vehicleId && vehicleId !== 'auto' ? getObject(vehicleId) : null;
  if (forced) return forced;
  if (partyIds.length === 1 && actorId === 'resident') return getObject('car_2') || getObject('car_1');
  return getObject('car_1') || getObject('car_2') || { id: 'car_1', kind: 'car', x: 126, y: 138, w: 116, h: 230 };
}

function driveVector(vehicle, leaving = true) {
  const vertical = vehicle.h >= vehicle.w;
  if (vertical) return { x: 0, y: leaving ? -1 : 1 };
  return { x: leaving ? 1 : -1, y: 0 };
}

function doorPoint(vehicle, side = 1) {
  const vertical = vehicle.h >= vehicle.w;
  if (vertical) return { x: vehicle.x + vehicle.w + 24 * side, y: vehicle.y + vehicle.h * 0.62 };
  return { x: vehicle.x + vehicle.w * 0.55, y: vehicle.y + vehicle.h + 26 };
}

function allAtVehicle(state, v) {
  return (v.partyIds || []).every(id => {
    const e = byId(state, id);
    if (!e || e.hidden) return true;
    return e.floor === GARAGE_FLOOR && Math.hypot(e.x - (v.x + v.w / 2), e.y - (v.y + v.h * 0.7)) < 130;
  });
}

function selectVisiblePerson(state) {
  const current = byId(state, state.selectedId);
  if (current && !current.hidden) return;
  const next = state.entities.find(e => e.type === 'person' && !e.hidden) || state.entities.find(e => !e.hidden);
  if (next) state.selectedId = next.id;
}

export function beginVehicleDeparture(state, actionId, partyIds = [], vehicleId = 'auto', actorId = '') {
  const vehicle = parkedVehicle(vehicleId, actorId, partyIds);
  if (!vehicle) { log(state, 'No usable parked vehicle was found.'); return false; }
  const dir = driveVector(vehicle, true);
  state.objectState.vehicleInUse = vehicle.id;
  state.vehicleDeparture = {
    actionId,
    partyIds,
    vehicleId: vehicle.id,
    vehicleKind: vehicle.kind || 'car',
    t: 0,
    phase: 'walking_to_vehicle',
    floor: GARAGE_FLOOR,
    x: vehicle.x,
    y: vehicle.y,
    parkX: vehicle.x,
    parkY: vehicle.y,
    w: vehicle.w,
    h: vehicle.h,
    dir,
    open: false
  };
  state.objectState.garageDoorOpen = false;
  state.floor = GARAGE_FLOOR;
  state.viewHoldT = 8;
  for (const id of partyIds || []) {
    const e = byId(state, id);
    if (!e) continue;
    e.hidden = false;
    e.queuedTask = null;
    e.vehicleTrip = { actionId, vehicleId: vehicle.id };
    commandObject(e, vehicle, `enter_${vehicle.kind || 'vehicle'}`);
    say(e, 'CAR');
  }
  log(state, `Travel queued. Party is walking to the parked ${vehicle.label || vehicle.id}.`);
  return true;
}

export function beginVehicleReturn(state, actionId, partyIds = [], vehicleId = state.offsite?.vehicleId || state.objectState.vehicleInUse || 'car_1') {
  const vehicle = parkedVehicle(vehicleId, '', partyIds);
  if (!vehicle) { log(state, 'No return vehicle was found.'); return false; }
  const vertical = vehicle.h >= vehicle.w;
  state.objectState.vehicleInUse = vehicle.id;
  state.vehicleReturn = {
    actionId,
    partyIds,
    vehicleId: vehicle.id,
    vehicleKind: vehicle.kind || 'car',
    t: 0,
    phase: 'arriving',
    floor: GARAGE_FLOOR,
    x: vertical ? vehicle.x : -vehicle.w - 40,
    y: vertical ? GARAGE_EXIT_Y - vehicle.h : vehicle.y,
    parkX: vehicle.x,
    parkY: vehicle.y,
    w: vehicle.w,
    h: vehicle.h,
    dir: driveVector(vehicle, false),
    open: false
  };
  state.objectState.garageDoorOpen = true;
  state.floor = GARAGE_FLOOR;
  state.viewHoldT = 8;
  log(state, `${vehicle.label || 'Vehicle'} returning from ${actionId.replaceAll('_', ' ')}.`);
  return true;
}

export function updateVehicleDeparture(state, dt) {
  updateVehicleLeaving(state, dt);
  updateVehicleReturning(state, dt);
}

function updateVehicleLeaving(state, dt) {
  const v = state.vehicleDeparture;
  if (!v) return;
  v.t += dt;
  if (v.phase === 'walking_to_vehicle') {
    if (allAtVehicle(state, v)) {
      v.phase = 'door_opening';
      v.t = 0;
      v.open = true;
      for (const id of v.partyIds || []) {
        const e = byId(state, id);
        if (!e) continue;
        e.path = [];
        e.target = null;
        e.pending = null;
        e.action = 'Entering vehicle';
        e.pose = 'entering_vehicle';
        say(e, 'IN');
      }
      log(state, 'Vehicle door opening. Party is boarding.');
      return;
    }
    if (v.t > 6 && Math.floor(v.t) % 3 === 0) {
      const vehicle = getObject(v.vehicleId);
      for (const id of v.partyIds || []) {
        const e = byId(state, id);
        if (e && vehicle && !e.hidden && !e.path?.length) commandObject(e, vehicle, `enter_${vehicle.kind || 'vehicle'}`);
      }
    }
    return;
  }
  if (v.phase === 'door_opening' && v.t > 0.75) {
    v.phase = 'door_closing';
    v.t = 0;
    v.open = false;
    for (const id of v.partyIds || []) {
      const e = byId(state, id);
      if (!e) continue;
      e.hidden = true;
      e.action = v.actionId;
      e.path = [];
      e.target = null;
      e.pending = null;
    }
    selectVisiblePerson(state);
    log(state, 'Vehicle door closed.');
    return;
  }
  if (v.phase === 'door_closing' && v.t > 0.55) {
    v.phase = 'garage_opening';
    v.t = 0;
    state.objectState.garageDoorOpen = true;
    log(state, 'Garage door opening.');
    return;
  }
  if (v.phase === 'garage_opening' && v.t > 0.75) {
    v.phase = 'leaving';
    v.t = 0;
    log(state, 'Vehicle leaving upward through the garage exit.');
    return;
  }
  if (v.phase === 'leaving') {
    v.x += v.dir.x * dt * 150;
    v.y += v.dir.y * dt * 150;
  }
  const gone = v.y + v.h < -30 || v.y > 760 || v.x + v.w < -30 || v.x > 990;
  if (gone || (v.phase === 'leaving' && v.t > 6)) {
    state.objectState.garageDoorOpen = false;
    state.vehicleDeparture = null;
    state.offsite = createOffsiteJob(v.actionId, v.partyIds || [], v.vehicleId);
    log(state, `Offsite travel began: ${state.offsite.label}.`);
  }
}

function updateVehicleReturning(state, dt) {
  const v = state.vehicleReturn;
  if (!v) return;
  v.t += dt;
  if (v.phase === 'arriving') {
    v.x = approach(v.x, v.parkX, dt * 150);
    v.y = approach(v.y, v.parkY, dt * 150);
    if (Math.abs(v.x - v.parkX) < 1 && Math.abs(v.y - v.parkY) < 1) {
      v.x = v.parkX;
      v.y = v.parkY;
      v.phase = 'parking';
      v.t = 0;
      log(state, 'The same vehicle parked in the garage.');
    }
    return;
  }
  if (v.phase === 'parking' && v.t > 0.65) {
    v.phase = 'door_opening';
    v.t = 0;
    v.open = true;
    return;
  }
  if (v.phase === 'door_opening' && v.t > 0.75) {
    v.phase = 'walking_in';
    v.t = 0;
    v.open = false;
    const stairs = getObject('garage_entry_door');
    const exit = stairs ? approachPoint(stairs, 'use_stairs') : { x: 660, y: 568 };
    for (const [index, id] of (v.partyIds || []).entries()) {
      const e = byId(state, id);
      if (!e) continue;
      const p = doorPoint({ x: v.parkX, y: v.parkY, w: v.w, h: v.h }, index % 2 ? -1 : 1);
      e.hidden = false;
      e.floor = GARAGE_FLOOR;
      e.x = p.x;
      e.y = p.y;
      e.path = [exit];
      e.target = null;
      e.pending = stairs ? { type: 'floorTravel', targetFloor: 0, objectId: stairs.id, actionId: 'use_stairs', stairId: stairs.id } : null;
      e.moveAllowId = stairs?.id || '';
      e.action = 'Walking in from garage';
      e.pose = 'exiting_vehicle';
      e.vehicleTrip = null;
      say(e, 'BACK');
    }
    selectVisiblePerson(state);
    log(state, 'Party exited the vehicle and is walking through the garage entry.');
    return;
  }
  if (v.phase === 'walking_in') {
    const done = (v.partyIds || []).every(id => {
      const e = byId(state, id);
      return !e || (!e.hidden && e.floor === 0) || (!e.path?.length && v.t > 5);
    });
    if (done || v.t > 8) finishVehicleReturn(state, v);
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
    e.path = [];
    e.target = null;
    e.pending = null;
    e.moveAllowId = '';
    e.action = 'Returned';
    e.pose = 'stand';
    if (action === 'movies') addGarbageFromAction(state, 'popcorn', e);
  }
  state.objectState.garageDoorOpen = false;
  state.objectState.vehicleInUse = null;
  state.vehicleReturn = null;
  selectVisiblePerson(state);
  log(state, `Returned from ${action.replaceAll('_', ' ')}.`);
}