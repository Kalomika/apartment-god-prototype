import { addGarbageFromAction } from './garbage.js';
import { byId, log, say } from './state.js';
import { getObject, approachPoint } from './world.js';
import { commandMove, commandObject } from './movement.js';
import { createOffsiteJob } from './travelLocations.js';

const GARAGE_FLOOR = 3;
const HOUSE_FLOOR = 0;
const PACK_FLOOR = 1;
const GARAGE_EXIT_Y = 760;

function parkedVehicle(vehicleId = 'auto', actorId = '', partyIds = []) {
  const forced = vehicleId && vehicleId !== 'auto' ? getObject(vehicleId) : null;
  if (forced) return forced;
  if (partyIds.length === 1 && actorId === 'resident') return getObject('car_2') || getObject('car_1');
  return getObject('car_1') || getObject('car_2') || { id: 'car_1', kind: 'car', x: 196, y: 268, w: 116, h: 230, facing: 'down' };
}

function driveVector(vehicle, leaving = true) { const vertical = vehicle.h >= vehicle.w; return vertical ? { x: 0, y: leaving ? 1 : -1 } : { x: leaving ? 1 : -1, y: 0 }; }
function isVacation(actionId) { return String(actionId || '').startsWith('vacation_'); }
function vacationBagCount(actionId) { return ['vacation_beach', 'vacation_camping', 'vacation_desert'].includes(actionId) ? 1 : 2; }
function luggageLabel(count) { return count > 1 ? 'large luggage' : 'luggage'; }
function clearTimedAction(entity) { entity.actionT = 0; entity.actionTotal = 0; }

function vehicleSeats(vehicle) {
  if (vehicle.kind === 'bike') return [{ id: 'rider', role: 'driver', dogOk: false }];
  if (vehicle.kind === 'motorbike' || vehicle.kind === 'atv') return [{ id: 'rider', role: 'driver', dogOk: false }, { id: 'rear', role: 'passenger', dogOk: false }];
  if (vehicle.id === 'car_1') return [
    { id: 'front_left', role: 'driver', dogOk: false }, { id: 'front_right', role: 'passenger', dogOk: false },
    { id: 'row2_left', role: 'passenger', dogOk: true }, { id: 'row2_middle', role: 'passenger', dogOk: true }, { id: 'row2_right', role: 'passenger', dogOk: true },
    { id: 'row3_left', role: 'passenger', dogOk: true }, { id: 'row3_right', role: 'passenger', dogOk: true }
  ];
  if (vehicle.id === 'car_2') return [{ id: 'front_left', role: 'driver', dogOk: false }, { id: 'front_right', role: 'passenger', dogOk: false }];
  return [{ id: 'front_left', role: 'driver', dogOk: false }, { id: 'front_right', role: 'passenger', dogOk: false }, { id: 'rear_left', role: 'passenger', dogOk: true }];
}

function assignSeats(state, vehicle, partyIds) {
  const seats = vehicleSeats(vehicle);
  const humans = partyIds.map(id => byId(state, id)).filter(e => e?.type === 'person');
  const dogs = partyIds.map(id => byId(state, id)).filter(e => e?.type === 'dog');
  const assignments = [];
  const openSeats = [...seats];
  for (const human of humans) { const seat = openSeats.shift(); if (!seat) return null; assignments.push({ entityId: human.id, seatId: seat.id, role: seat.role }); }
  for (const dog of dogs) { const seatIndex = openSeats.findIndex(seat => seat.dogOk); if (seatIndex < 0) return null; const [seat] = openSeats.splice(seatIndex, 1); assignments.push({ entityId: dog.id, seatId: seat.id, role: 'dog' }); }
  return assignments;
}

function seatPoint(vehicle, seatId) {
  const x = vehicle.x, y = vehicle.y, w = vehicle.w, h = vehicle.h;
  const side = seatId.includes('right') ? 1 : -1;
  if (seatId === 'front_left') return { x: x - 28, y: y + h * 0.64 };
  if (seatId === 'front_right') return { x: x + w + 28, y: y + h * 0.64 };
  if (seatId.includes('row2') || seatId.includes('rear')) return { x: x + (side > 0 ? w + 28 : -28), y: y + h * 0.42 };
  if (seatId.includes('row3')) return { x: x + (side > 0 ? w + 28 : -28), y: y + h * 0.25 };
  return { x: x + w + 28, y: y + h * 0.60 };
}

function allAtPoint(state, ids, floor, point, radius = 95) { return ids.every(id => { const e = byId(state, id); if (!e || e.hidden) return true; return e.floor === floor && Math.hypot(e.x - point.x, e.y - point.y) <= radius && !e.path?.length; }); }
function allAtVehicle(state, v) { return (v.partyIds || []).every(id => { const e = byId(state, id); if (!e || e.hidden) return true; const seat = v.seatAssignments?.find(s => s.entityId === id); const p = seat ? seatPoint({ x: v.parkX, y: v.parkY, w: v.w, h: v.h }, seat.seatId) : { x: v.x + v.w / 2, y: v.y + v.h * .7 }; return e.floor === GARAGE_FLOOR && Math.hypot(e.x - p.x, e.y - p.y) < 80 && !e.path?.length; }); }
function humansInParty(state, partyIds) { return partyIds.map(id => byId(state, id)).filter(e => e?.type === 'person'); }
function selectVisiblePerson(state) { const current = byId(state, state.selectedId); if (current && !current.hidden) return; const next = state.entities.find(e => e.type === 'person' && !e.hidden) || state.entities.find(e => !e.hidden); if (next) state.selectedId = next.id; }
function setPartyAction(state, v, action, pose = 'stand') { for (const id of v.partyIds || []) { const e = byId(state, id); if (!e || e.hidden) continue; clearTimedAction(e); e.action = action; e.pose = pose; } }
function setRemoteFlash(v, label = 'UNLOCK') { v.remoteFlashT = 0.9; v.remoteLabel = label; }
function makeLuggageManifest(state, partyIds, actionId) { const count = vacationBagCount(actionId); return humansInParty(state, partyIds).map(e => ({ entityId: e.id, count, loaded: false, unloaded: false })); }

function routeToVehicleSeat(entity, vehicle, point) {
  const final = entity.path?.[entity.path.length - 1];
  if (final && Math.hypot(final.x - point.x, final.y - point.y) <= 8) return;
  commandMove(entity, point.x, point.y, false, vehicle.id);
  entity.target = null;
  entity.pending = null;
  entity.moveAllowId = vehicle.id;
}

function routePartyToVehicle(state, v) {
  const vehicle = getObject(v.vehicleId);
  if (!vehicle) return;
  for (const id of v.partyIds || []) {
    const e = byId(state, id);
    if (!e || e.hidden) continue;
    clearTimedAction(e);
    const seat = v.seatAssignments?.find(s => s.entityId === id);
    const p = seat ? seatPoint(vehicle, seat.seatId) : approachPoint(vehicle, `enter_${vehicle.kind || 'vehicle'}`);
    if (e.floor !== GARAGE_FLOOR) commandObject(e, vehicle, `enter_${vehicle.kind || 'vehicle'}`);
    else if (Math.hypot(e.x - p.x, e.y - p.y) > 14) routeToVehicleSeat(e, vehicle, p);
    e.action = e.path?.length ? 'Walking to vehicle' : 'Waiting at vehicle';
    e.pose = e.path?.length ? 'walk' : 'stand';
  }
}
function routeHumansToPack(state, v) { const pack = getObject('bed'); if (!pack) return false; for (const e of humansInParty(state, v.partyIds)) { clearTimedAction(e); e.vehicleTrip = { actionId: v.actionId, vehicleId: v.vehicleId }; commandObject(e, pack, 'pack_luggage'); say(e, 'PACK'); } return true; }
function routeDogsToVehicle(state, v) { routePartyToVehicle(state, v); }

export function beginVehicleDeparture(state, actionId, partyIds = [], vehicleId = 'auto', actorId = '') {
  const vehicle = parkedVehicle(vehicleId, actorId, partyIds);
  if (!vehicle) { log(state, 'No usable parked vehicle was found.'); return false; }
  const seats = assignSeats(state, vehicle, partyIds);
  if (!seats) { log(state, `${vehicle.label || vehicle.id} does not have enough usable seats for this party.`); for (const id of partyIds) { const e = byId(state, id); if (e) say(e, 'NO SEAT'); } return false; }
  const vacation = isVacation(actionId), dir = driveVector(vehicle, true), luggage = vacation ? makeLuggageManifest(state, partyIds, actionId) : [];
  state.objectState.vehicleInUse = vehicle.id;
  state.vehicleDeparture = { actionId, partyIds, vehicleId: vehicle.id, vehicleKind: vehicle.kind || 'car', vacation, luggage, seatAssignments: seats, t: 0, rerouteT: 0, phase: vacation && humansInParty(state, partyIds).length ? 'walking_to_pack' : 'walking_to_vehicle', floor: GARAGE_FLOOR, x: vehicle.x, y: vehicle.y, parkX: vehicle.x, parkY: vehicle.y, w: vehicle.w, h: vehicle.h, dir, open: false, trunkOpen: false, luggageLoaded: false, remoteFlashT: 0, remoteLabel: '' };
  state.objectState.garageDoorOpen = false;
  state.floor = vacation ? PACK_FLOOR : GARAGE_FLOOR;
  state.viewHoldT = vacation ? 14 : 8;
  for (const id of partyIds || []) { const e = byId(state, id); if (!e) continue; e.hidden = false; e.queuedTask = null; clearTimedAction(e); e.vehicleTrip = { actionId, vehicleId: vehicle.id }; }
  if (vacation && humansInParty(state, partyIds).length) { routeHumansToPack(state, state.vehicleDeparture); routeDogsToVehicle(state, state.vehicleDeparture); log(state, `Vacation prep started. Travelers are going upstairs to pack before loading ${vehicle.label || vehicle.id}.`); }
  else { routePartyToVehicle(state, state.vehicleDeparture); log(state, `Travel queued. Party is walking to the parked ${vehicle.label || vehicle.id}.`); }
  return true;
}

export function beginVehicleReturn(state, actionId, partyIds = [], vehicleId = state.offsite?.vehicleId || state.objectState.vehicleInUse || 'car_1') {
  const vehicle = parkedVehicle(vehicleId, '', partyIds);
  if (!vehicle) { log(state, 'No return vehicle was found.'); return false; }
  const seats = assignSeats(state, vehicle, partyIds) || [], vacation = isVacation(actionId), vertical = vehicle.h >= vehicle.w;
  state.objectState.vehicleInUse = vehicle.id;
  state.vehicleReturn = { actionId, partyIds, vehicleId: vehicle.id, vehicleKind: vehicle.kind || 'car', vacation, luggage: vacation ? makeLuggageManifest(state, partyIds, actionId) : [], seatAssignments: seats, t: 0, phase: 'arriving', floor: GARAGE_FLOOR, x: vertical ? vehicle.x : -vehicle.w - 40, y: vertical ? GARAGE_EXIT_Y : vehicle.y, parkX: vehicle.x, parkY: vehicle.y, w: vehicle.w, h: vehicle.h, dir: driveVector(vehicle, false), open: false, trunkOpen: false, remoteFlashT: 0, remoteLabel: '' };
  state.objectState.garageDoorOpen = true; state.floor = GARAGE_FLOOR; state.viewHoldT = 10;
  log(state, `${vehicle.label || 'Vehicle'} returning from ${actionId.replaceAll('_', ' ')}.`);
  return true;
}

export function updateVehicleDeparture(state, dt) { updateVehicleLeaving(state, dt); updateVehicleReturning(state, dt); }

function updateVehicleLeaving(state, dt) {
  const v = state.vehicleDeparture; if (!v) return; v.t += dt; v.rerouteT = Math.max(0, (v.rerouteT || 0) - dt); if (v.remoteFlashT > 0) v.remoteFlashT = Math.max(0, v.remoteFlashT - dt);
  if (v.phase === 'walking_to_pack') { const packPoint = getObject('bed') ? approachPoint(getObject('bed'), 'pack_luggage') : { x: 170, y: 240 }; const humanIds = humansInParty(state, v.partyIds).map(e => e.id); if (allAtPoint(state, humanIds, PACK_FLOOR, packPoint, 115) || v.t > 12) { v.phase = 'packing'; v.t = 0; for (const e of humansInParty(state, v.partyIds)) { e.path = []; e.target = null; clearTimedAction(e); e.action = 'Packing luggage'; e.pose = 'packing'; e.carrying = null; say(e, 'PACK'); } log(state, 'Travelers are packing upstairs.'); } return; }
  if (v.phase === 'packing' && v.t > 2.4) { for (const item of v.luggage || []) { const e = byId(state, item.entityId); if (e) { clearTimedAction(e); e.carrying = luggageLabel(item.count); e.action = 'Carrying luggage'; e.pose = 'carry'; } } v.phase = 'walking_to_vehicle'; v.t = 0; v.rerouteT = 0; routePartyToVehicle(state, v); log(state, 'Packed bags are being carried to the garage.'); return; }
  if (v.phase === 'walking_to_vehicle') { if (allAtVehicle(state, v)) { v.phase = 'remote_unlock'; v.t = 0; setRemoteFlash(v, 'UNLOCK'); setPartyAction(state, v, 'Unlocking vehicle', 'stand'); log(state, 'Remote unlock flashed the front and rear lights.'); return; } if (v.t > 6 && v.rerouteT <= 0) { routePartyToVehicle(state, v); v.rerouteT = 2.5; } return; }
  if (v.phase === 'remote_unlock' && v.t > 0.85) { v.phase = v.vacation && v.luggage?.length ? 'trunk_opening' : 'door_opening'; v.t = 0; if (v.phase === 'trunk_opening') { v.trunkOpen = true; log(state, 'Trunk opened for luggage.'); } else { v.open = true; log(state, 'Vehicle doors opening.'); } return; }
  if (v.phase === 'trunk_opening' && v.t > 0.75) { v.phase = 'loading_luggage'; v.t = 0; for (const item of v.luggage || []) { const e = byId(state, item.entityId); if (e) { clearTimedAction(e); e.action = 'Loading luggage'; e.pose = 'loading_trunk'; say(e, 'BAG'); } } return; }
  if (v.phase === 'loading_luggage' && v.t > 1.25) { for (const item of v.luggage || []) { item.loaded = true; const e = byId(state, item.entityId); if (e) e.carrying = null; } v.luggageLoaded = true; v.phase = 'trunk_closing'; v.t = 0; log(state, 'Luggage loaded into trunk.'); return; }
  if (v.phase === 'trunk_closing' && v.t > 0.65) { v.trunkOpen = false; v.phase = 'door_opening'; v.open = true; v.t = 0; log(state, 'Trunk closed. Vehicle doors opening.'); return; }
  if (v.phase === 'door_opening' && v.t > 0.75) { v.phase = 'boarding'; v.t = 0; for (const id of v.partyIds || []) { const e = byId(state, id); if (!e) continue; clearTimedAction(e); e.action = 'Entering assigned seat'; e.pose = 'entering_vehicle'; say(e, 'IN'); } log(state, 'Party is boarding assigned seats.'); return; }
  if (v.phase === 'boarding' && v.t > 0.85) { for (const id of v.partyIds || []) { const e = byId(state, id); if (!e) continue; e.hidden = true; e.action = v.actionId; clearTimedAction(e); e.path = []; e.target = null; e.pending = null; e.carrying = null; } selectVisiblePerson(state); v.phase = 'door_closing'; v.open = false; v.t = 0; log(state, 'All selected travelers are seated. Vehicle doors closed.'); return; }
  if (v.phase === 'door_closing' && v.t > 0.45) { v.phase = 'remote_lock'; v.t = 0; setRemoteFlash(v, 'LOCK'); log(state, 'Remote lock flashed the lights.'); return; }
  if (v.phase === 'remote_lock' && v.t > 0.8) { v.phase = 'garage_opening'; v.t = 0; state.objectState.garageDoorOpen = true; log(state, 'Garage door opening.'); return; }
  if (v.phase === 'garage_opening' && v.t > 0.75) { v.phase = 'leaving'; v.t = 0; log(state, 'Vehicle leaving downward through the garage exit.'); return; }
  if (v.phase === 'leaving') { v.x += v.dir.x * dt * 150; v.y += v.dir.y * dt * 150; }
  const gone = v.y + v.h < -30 || v.y > 780 || v.x + v.w < -30 || v.x > 990;
  if (gone || (v.phase === 'leaving' && v.t > 6)) { state.objectState.garageDoorOpen = false; state.vehicleDeparture = null; state.offsite = createOffsiteJob(v.actionId, v.partyIds || [], v.vehicleId); log(state, `Offsite travel began: ${state.offsite.label}.`); }
}

function updateVehicleReturning(state, dt) {
  const v = state.vehicleReturn; if (!v) return; v.t += dt; if (v.remoteFlashT > 0) v.remoteFlashT = Math.max(0, v.remoteFlashT - dt);
  if (v.phase === 'arriving') { v.x = approach(v.x, v.parkX, dt * 150); v.y = approach(v.y, v.parkY, dt * 150); if (Math.abs(v.x - v.parkX) < 1 && Math.abs(v.y - v.parkY) < 1) { v.x = v.parkX; v.y = v.parkY; v.phase = 'parking'; v.t = 0; log(state, 'The same vehicle parked in the garage.'); } return; }
  if (v.phase === 'parking' && v.t > 0.65) { v.phase = 'remote_unlock'; v.t = 0; setRemoteFlash(v, 'UNLOCK'); log(state, 'Remote unlock flashed on return.'); return; }
  if (v.phase === 'remote_unlock' && v.t > 0.8) { v.phase = 'door_opening'; v.t = 0; v.open = true; log(state, 'Vehicle doors opening for unload.'); return; }
  if (v.phase === 'door_opening' && v.t > 0.7) { v.phase = v.vacation && v.luggage?.length ? 'trunk_opening' : 'walking_in'; v.t = 0; spawnPartyAtSeats(state, v); if (v.phase === 'trunk_opening') { v.trunkOpen = true; log(state, 'Trunk opened to unload luggage.'); } else log(state, 'Party exited the vehicle and is walking through the garage entry.'); return; }
  if (v.phase === 'trunk_opening' && v.t > 0.75) { v.phase = 'unloading_luggage'; v.t = 0; for (const item of v.luggage || []) { const e = byId(state, item.entityId); if (e) { clearTimedAction(e); e.action = 'Unloading luggage'; e.pose = 'loading_trunk'; e.carrying = luggageLabel(item.count); say(e, 'BAG'); } } return; }
  if (v.phase === 'unloading_luggage' && v.t > 1.2) { for (const item of v.luggage || []) item.unloaded = true; v.phase = 'trunk_closing'; v.t = 0; log(state, 'Luggage unloaded from trunk.'); return; }
  if (v.phase === 'trunk_closing' && v.t > 0.65) { v.trunkOpen = false; v.phase = 'walking_in'; v.t = 0; routePartyInsideFromGarage(state, v); log(state, 'Trunk closed. Party is walking back inside.'); return; }
  if (v.phase === 'walking_in') { const done = (v.partyIds || []).every(id => { const e = byId(state, id); return !e || (!e.hidden && e.floor === HOUSE_FLOOR); }); if (done || v.t > 12) { v.phase = 'remote_lock'; v.t = 0; setRemoteFlash(v, 'LOCK'); log(state, 'Remote lock flashed after return.'); } return; }
  if (v.phase === 'remote_lock' && v.t > 0.75) finishVehicleReturn(state, v);
}

function spawnPartyAtSeats(state, v) { const vehicle = { x: v.parkX, y: v.parkY, w: v.w, h: v.h }; for (const id of v.partyIds || []) { const e = byId(state, id); if (!e) continue; const seat = v.seatAssignments?.find(s => s.entityId === id); const p = seat ? seatPoint(vehicle, seat.seatId) : { x: v.parkX + v.w + 24, y: v.parkY + v.h * .62 }; clearTimedAction(e); e.hidden = false; e.floor = GARAGE_FLOOR; e.x = p.x; e.y = p.y; e.path = []; e.target = null; e.pending = null; e.action = 'Exiting vehicle'; e.pose = 'exiting_vehicle'; e.vehicleTrip = null; say(e, 'BACK'); } selectVisiblePerson(state); }
function routePartyInsideFromGarage(state, v) { const stairs = getObject('garage_entry_door'); const exit = stairs ? approachPoint(stairs, 'use_stairs') : { x: 872, y: 504 }; for (const id of v.partyIds || []) { const e = byId(state, id); if (!e) continue; clearTimedAction(e); if (stairs) commandObject(e, stairs, 'use_stairs'); else commandMove(e, exit.x, exit.y); e.action = 'Walking in from garage'; e.pose = 'walk'; } }
function approach(value, target, step) { if (value < target) return Math.min(target, value + step); if (value > target) return Math.max(target, value - step); return value; }
function finishVehicleReturn(state, v) { const action = v.actionId; for (const id of v.partyIds || []) { const e = byId(state, id); if (!e) continue; e.hidden = false; e.path = []; e.target = null; e.pending = null; e.moveAllowId = ''; e.action = 'Returned'; e.pose = 'stand'; clearTimedAction(e); if (e.carrying && String(e.carrying).includes('luggage')) e.carrying = null; if (action === 'movies') addGarbageFromAction(state, 'popcorn', e); } state.objectState.garageDoorOpen = false; state.objectState.vehicleInUse = null; state.vehicleReturn = null; selectVisiblePerson(state); log(state, `Returned from ${action.replaceAll('_', ' ')}.`); }
