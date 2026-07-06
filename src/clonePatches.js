import { doorways } from './blueprint.js';
import { ACTIONS, ACTION_TIMES } from './config.js';
import { floors, objects } from './world.js';

let applied = false;

export function applyCurrentGameClonePatches() {
  if (applied) return;
  applied = true;

  patchDoorway('entry', 'front_porch', 0, { x: 240, y: 554, w: 96, h: 18 }, 0);
  patchDoorway('entry', 'front_porch', 0, { x: 354, y: 554, w: 46, h: 18 }, 1);
  patchDoorway('entry', 'stairs', 0, { x: 642, y: 500, w: 72, h: 54 }, 1);
  patchDoorway('basement_game', 'basement_gym', 2, { x: 224, y: 490, w: 120, h: 18 });
  removeDoorway('basement_game', 'basement_media', 2);
  removeDoorway('basement_media', 'basement_stairs', 2);
  patchDoorway('basement_game', 'basement_stairs', 2, { x: 802, y: 490, w: 58, h: 18 });

  patchRoom(0, 'entry', { h: 210 });
  patchRoom(0, 'front_porch', { x: 136, y: 570, w: 360, h: 114 });
  patchRoom(2, 'basement_game', { x: 24, y: 36, w: 912, h: 456 });
  patchRoom(2, 'basement_gym', { x: 24, y: 508, w: 500, h: 176 });
  removeRoom(2, 'basement_media');
  patchRoom(2, 'basement_stairs', { x: 720, y: 508, w: 216, h: 176 });

  patchObject('door', { x: 240, y: 544, w: 96, h: 34 });
  patchObject('pet_flap_front', { x: 354, y: 548, w: 46, h: 24 });
  patchObject('garage_door', { x: 640, y: 500, w: 72, h: 54 });
  patchObject('arcade_machine', { x: 420, y: 74, w: 54, h: 78, room: 'basement_game' });
  patchObject('game_console', { x: 620, y: 96, w: 172, h: 58, room: 'basement_game' });
  patchObject('basement_couch', { x: 614, y: 176, w: 168, h: 62, room: 'basement_game' });
  patchObject('treadmill', { x: 74, y: 552, w: 118, h: 58, room: 'basement_gym' });
  patchObject('weight_bench', { x: 238, y: 562, w: 122, h: 54, room: 'basement_gym' });
  patchObject('heavy_bag', { x: 430, y: 544, w: 42, h: 84, room: 'basement_gym' });
  patchObject('car_1', { x: 126, y: 138, w: 116, h: 230 });
  patchObject('car_2', { x: 426, y: 138, w: 116, h: 230 });

  ACTIONS.car = [['work', 'Drive to Work'], ['errand', 'Drive Errand'], ['mall', 'Drive to Mall'], ['movies', 'Drive to Movies'], ['date', 'Drive Date Night'], ['drive', 'Cruise Around'], ['maintain_vehicle', 'Maintain Vehicle']];
  ACTION_TIMES.pool_solo = 14;
  ACTION_TIMES.pool_together = 18;
}

function patchDoorway(a, b, floor, props, matchIndex = 0) {
  const matches = doorways.filter(d => d.floor === floor && ((d.a === a && d.b === b) || (d.a === b && d.b === a)));
  const target = matches[matchIndex] || matches[0];
  if (target) Object.assign(target, props);
  else doorways.push({ floor, a, b, ...props });
}

function removeDoorway(a, b, floor) {
  const index = doorways.findIndex(d => d.floor === floor && ((d.a === a && d.b === b) || (d.a === b && d.b === a)));
  if (index >= 0) doorways.splice(index, 1);
}

function patchRoom(floorId, roomId, props) {
  const room = floors.find(f => f.id === floorId)?.rooms.find(r => r.id === roomId);
  if (room) Object.assign(room, props);
}

function removeRoom(floorId, roomId) {
  const floor = floors.find(f => f.id === floorId);
  if (!floor) return;
  const index = floor.rooms.findIndex(r => r.id === roomId);
  if (index >= 0) floor.rooms.splice(index, 1);
}

function patchObject(id, props) {
  const object = objects.find(o => o.id === id);
  if (object) Object.assign(object, props);
}
