import { addGarbageFromAction } from './garbage.js';
import { byId, changeNeed, log, say } from './state.js';

export function beginVehicleDeparture(state, actionId, partyIds = []) {
  state.vehicleDeparture = {
    actionId,
    partyIds,
    t: 0,
    phase: 'opening',
    floor: 3,
    x: 188,
    y: 166,
    open: false
  };
  state.objectState.garageDoorOpen = true;
  state.floor = 3;
  state.viewHoldT = 5;
  log(state, `Garage door opening for ${actionId.replaceAll('_', ' ')}.`);
}

export function beginVehicleReturn(state, actionId, partyIds = []) {
  state.vehicleReturn = {
    actionId,
    partyIds,
    t: 0,
    phase: 'arriving',
    floor: 3,
    x: 126,
    y: -190,
    parkY: 138,
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
  if (v.phase === 'leaving') v.y -= dt * 110;
  if (v.t > 4) {
    state.objectState.garageDoorOpen = false;
    state.vehicleDeparture = null;
  }
}

function updateVehicleReturning(state, dt) {
  const v = state.vehicleReturn;
  if (!v) return;
  v.t += dt;
  if (v.phase === 'arriving') {
    v.y = Math.min(v.parkY, v.y + dt * 135);
    if (v.y >= v.parkY) {
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
  state.vehicleReturn = null;
  log(state, `Returned from ${action.replaceAll('_', ' ')}.`);
}
