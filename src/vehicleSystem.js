import { log } from './state.js';

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

export function updateVehicleDeparture(state, dt) {
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
