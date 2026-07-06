import { log } from './state.js';
import { getObject } from './world.js';

export function beginVehicleDeparture(state, actionId, partyIds = []) {
  const car = getObject('car_1');
  state.vehicleDeparture = {
    actionId,
    partyIds,
    t: 0,
    phase: 'opening',
    floor: 3,
    x: car?.x ?? 126,
    y: car?.y ?? 138,
    w: car?.w ?? 116,
    h: car?.h ?? 230,
    open: false
  };
  state.objectState.garageDoorOpen = true;
  state.floor = 3;
  state.viewHoldT = 5;
  log(state, `Garage door opening for ${actionId.replaceAll('_', ' ')}.`);
}

export function updateVehicleDeparture(state, dt) {
  const v = state.vehicleDeparture;
  if (!v) return;
  v.t += dt;
  if (v.t > 0.8) { v.phase = 'leaving'; v.open = true; }
  if (v.phase === 'leaving') v.y -= dt * 130;
  if (v.t > 4) {
    state.objectState.garageDoorOpen = false;
    state.vehicleDeparture = null;
  }
}
