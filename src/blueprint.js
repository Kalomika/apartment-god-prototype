import { changeNeed, log, say } from './state.js';
import { roomAt } from './world.js';

export const doorways = [
  { floor: 0, a: 'living', b: 'kitchen', x: 448, y: 206, w: 20, h: 68 },
  { floor: 0, a: 'living', b: 'entry', x: 226, y: 336, w: 86, h: 18 },
  { floor: 0, a: 'kitchen', b: 'entry', x: 586, y: 336, w: 92, h: 18 },
  { floor: 0, a: 'bath', b: 'entry', x: 840, y: 336, w: 58, h: 18 },
  { floor: 0, a: 'entry', b: 'front_porch', x: 218, y: 632, w: 96, h: 16 },
  { floor: 0, a: 'entry', b: 'front_porch', x: 326, y: 632, w: 46, h: 16 },
  { floor: 0, a: 'entry', b: 'stairs', x: 704, y: 410, w: 18, h: 62 },
  { floor: 0, a: 'entry', b: 'stairs', x: 642, y: 538, w: 72, h: 54 },
  { floor: 0, a: 'kitchen', b: 'stairs', x: 770, y: 300, w: 68, h: 22 },
  { floor: 1, a: 'bedroom', b: 'hall', x: 226, y: 382, w: 88, h: 18 },
  { floor: 1, a: 'office', b: 'hall', x: 574, y: 382, w: 82, h: 18 },
  { floor: 1, a: 'bath2', b: 'hall', x: 826, y: 382, w: 64, h: 18 },
  { floor: 1, a: 'hall', b: 'stairs2', x: 802, y: 516, w: 58, h: 22 },
  { floor: 3, a: 'garage_bay', b: 'garage_storage', x: 180, y: 456, w: 100, h: 18 },
  { floor: 3, a: 'garage_bay', b: 'garage_entry', x: 640, y: 456, w: 110, h: 18 },
  { floor: 3, a: 'garage_storage', b: 'garage_entry', x: 486, y: 540, w: 18, h: 60 },
  { floor: 4, a: 'yard', b: 'pool_area', x: 596, y: 150, w: 18, h: 100 },
  { floor: 4, a: 'yard', b: 'kennel_area', x: 596, y: 470, w: 18, h: 92 }
];

export const windows = [
  { id: 'win_living', label: 'Living Window', floor: 0, room: 'living', x: 116, y: 34, w: 86, h: 8 },
  { id: 'win_kitchen', label: 'Kitchen Window', floor: 0, room: 'kitchen', x: 618, y: 34, w: 82, h: 8 },
  { id: 'win_bedroom', label: 'Bedroom Window', floor: 1, room: 'bedroom', x: 142, y: 34, w: 96, h: 8 },
  { id: 'win_office', label: 'Office Window', floor: 1, room: 'office', x: 564, y: 34, w: 88, h: 8 },
  { id: 'win_garage', label: 'Garage Vent', floor: 3, room: 'garage_bay', x: 420, y: 34, w: 110, h: 8 }
];

export function doorwayCenter(d) { return { x: d.x + d.w / 2, y: d.y + d.h / 2 }; }

function pointInRect(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
}

function segmentIntersectsRect(from, to, rect) {
  const steps = Math.max(3, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 4));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
    if (pointInRect(p, rect)) return true;
  }
  return false;
}

export function doorwayPassageRect(d) {
  const alongPad = 10;
  const crossPad = 16;
  if (d.w >= d.h) {
    const h = Math.max(34, d.h + crossPad * 2);
    return { x: d.x - alongPad, y: d.y + d.h / 2 - h / 2, w: d.w + alongPad * 2, h };
  }
  const w = Math.max(34, d.w + crossPad * 2);
  return { x: d.x + d.w / 2 - w / 2, y: d.y - alongPad, w, h: d.h + alongPad * 2 };
}

function doorwayAtPoint(point, floor) {
  return doorways.find(d => d.floor === floor && pointInRect(point, doorwayPassageRect(d))) || null;
}

function roomsConnectedByDoorway(roomA, roomB, doorway) {
  if (!roomA || !roomB || !doorway) return false;
  return (doorway.a === roomA.id && doorway.b === roomB.id) || (doorway.b === roomA.id && doorway.a === roomB.id);
}

function boundaryCrossingAllowed(prevPoint, nextPoint, floor, prevRoom, nextRoom) {
  const prevDoor = doorwayAtPoint(prevPoint, floor);
  const nextDoor = doorwayAtPoint(nextPoint, floor);
  const doorway = prevDoor || nextDoor;
  if (!doorway) return false;
  if (prevRoom && nextRoom) return roomsConnectedByDoorway(prevRoom, nextRoom, doorway);
  return segmentIntersectsRect(prevPoint, nextPoint, doorwayPassageRect(doorway));
}

function stepUsesDoorway(from, to, floor, roomA = null, roomB = null) {
  return doorways.some(d => {
    if (d.floor !== floor) return false;
    if (roomA && roomB && !roomsConnectedByDoorway(roomA, roomB, d)) return false;
    return segmentIntersectsRect(from, to, doorwayPassageRect(d));
  });
}

export function routeThroughDoors(from, to, floor) {
  const start = roomAt(from.x, from.y, floor);
  const end = roomAt(to.x, to.y, floor);
  if (!start || !end || start.id === end.id) return [];
  const queue = [[start.id, []]];
  const seen = new Set([start.id]);
  while (queue.length) {
    const [room, path] = queue.shift();
    for (const d of doorways.filter(x => x.floor === floor && (x.a === room || x.b === room))) {
      const next = d.a === room ? d.b : d.a;
      const nextPath = [...path, doorwayCenter(d)];
      if (next === end.id) return nextPath;
      if (!seen.has(next)) { seen.add(next); queue.push([next, nextPath]); }
    }
  }
  return [];
}

export function canStepThroughRooms(from, to, floor) {
  const steps = Math.max(2, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 4));
  let prevPoint = from;
  let prevRoom = roomAt(prevPoint.x, prevPoint.y, floor);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const nextPoint = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
    const nextRoom = roomAt(nextPoint.x, nextPoint.y, floor);
    const sameRoom = prevRoom && nextRoom && prevRoom.id === nextRoom.id;
    const sameOutside = !prevRoom && !nextRoom;
    if (!sameRoom && !sameOutside && !boundaryCrossingAllowed(prevPoint, nextPoint, floor, prevRoom, nextRoom)) return false;
    prevPoint = nextPoint;
    prevRoom = nextRoom;
  }
  const a = roomAt(from.x, from.y, floor);
  const b = roomAt(to.x, to.y, floor);
  if (a && b && a.id !== b.id) return stepUsesDoorway(from, to, floor, a, b);
  return true;
}

export function windowAt(x, y, floor) { return windows.find(w => w.floor === floor && x >= w.x - 12 && x <= w.x + w.w + 12 && y >= w.y - 14 && y <= w.y + w.h + 22) || null; }

export function toggleWindow(state, actor, win) {
  state.objectState.openWindows ??= {};
  state.objectState.openWindows[win.id] = !state.objectState.openWindows[win.id];
  const open = state.objectState.openWindows[win.id];
  if (open) { changeNeed(actor, 'freshness', 4); say(actor, '🌬️'); log(state, `${actor.name} opened ${win.label} for fresh air.`); }
  else { say(actor, '🔒'); log(state, `${actor.name} closed ${win.label}.`); }
}

export function updateFreshAir(state, dt) {
  const open = Object.values(state.objectState.openWindows || {}).some(Boolean);
  if (!open) return;
  for (const e of state.entities) if (!e.hidden) changeNeed(e, 'freshness', dt * .035);
}
