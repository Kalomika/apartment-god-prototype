import { doorways } from './blueprint.js';
import { getObject } from './world.js';

const FRONT_YARD_DOORWAYS = [
  { floor: 6, a: 'front_porch', b: 'front_garden', x: 430, y: 126, w: 108, h: 30 },
  { floor: 6, a: 'front_garden', b: 'front_curb', x: 430, y: 388, w: 108, h: 28 },
  { floor: 6, a: 'front_curb', b: 'front_road_view', x: 430, y: 448, w: 108, h: 28 },
  { floor: 7, a: 'driveway_garage_mouth', b: 'west_driveway', x: 292, y: 136, w: 336, h: 28 },
  { floor: 7, a: 'west_driveway', b: 'driveway_road', x: 292, y: 382, w: 336, h: 34 },
  { floor: 7, a: 'west_driveway', b: 'driveway_yard_edge', x: 624, y: 240, w: 52, h: 108 }
];

export function applyFrontYardRoutingCorrection() {
  const mainExit = getObject('main_front_yard_exit');
  if (mainExit) Object.assign(mainExit, { x: 420, y: 650, w: 128, h: 28 });
  const houseEntry = getObject('front_yard_house_entry');
  if (houseEntry) Object.assign(houseEntry, { x: 436, y: 54, w: 96, h: 28 });
  for (const doorway of FRONT_YARD_DOORWAYS) {
    if (!doorways.some(existing => sameDoorway(existing, doorway))) doorways.push({ ...doorway });
  }
}

function sameDoorway(a, b) {
  if (a.floor !== b.floor) return false;
  const forward = a.a === b.a && a.b === b.b;
  const reverse = a.a === b.b && a.b === b.a;
  return forward || reverse;
}

applyFrontYardRoutingCorrection();
