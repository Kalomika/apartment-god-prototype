import { changeNeed, log, say } from './state.js';
import { floors, roomAt } from './world.js';

export const doorways = [
  { floor: 0, a: 'living', b: 'kitchen', x: 438, y: 42, w: 34, h: 286 },
  { floor: 0, a: 'living', b: 'entry', x: 34, y: 328, w: 406, h: 42 },
  { floor: 0, a: 'kitchen', b: 'entry', x: 456, y: 328, w: 258, h: 42 },
  { floor: 0, a: 'bath', b: 'stairs', x: 840, y: 336, w: 58, h: 18 },
  { floor: 0, a: 'entry', b: 'front_porch', x: 218, y: 556, w: 118, h: 24 },
  { floor: 0, a: 'entry', b: 'front_porch', x: 348, y: 556, w: 58, h: 24 },
  { floor: 0, a: 'entry', b: 'stairs', x: 704, y: 410, w: 18, h: 62 },
  { floor: 0, a: 'entry', b: 'stairs', x: 642, y: 538, w: 72, h: 54 },
  { floor: 0, a: 'kitchen', b: 'stairs', x: 770, y: 300, w: 68, h: 22 },
  { floor: 1, a: 'bedroom', b: 'walkin_closet', x: 72, y: 322, w: 92, h: 30 },
  { floor: 1, a: 'bedroom', b: 'suite_foyer', x: 252, y: 322, w: 96, h: 30 },
  { floor: 1, a: 'bedroom', b: 'hall', x: 392, y: 322, w: 72, h: 30 },
  { floor: 1, a: 'office', b: 'hall', x: 574, y: 322, w: 82, h: 30 },
  { floor: 1, a: 'walkin_closet', b: 'master_bath', x: 86, y: 508, w: 76, h: 30 },
  { floor: 1, a: 'suite_foyer', b: 'master_bath', x: 278, y: 508, w: 100, h: 30 },
  { floor: 1, a: 'hall', b: 'upstairs_landing', x: 574, y: 508, w: 92, h: 22 },
  { floor: 1, a: 'upstairs_landing', b: 'stairs2', x: 704, y: 580, w: 18, h: 58 },
  { floor: 1, a: 'hall', b: 'stairs2', x: 802, y: 508, w: 58, h: 22 },
  { floor: 4, a: 'yard', b: 'pool_area', x: 596, y: 150, w: 18, h: 100 },
  { floor: 4, a: 'yard', b: 'kennel_area', x: 596, y: 470, w: 18, h: 92 }
];

export const windows = [
  { id: 'win_living', label: 'Living Window', floor: 0, room: 'living', x: 116, y: 34, w: 86, h: 8 },
  { id: 'win_kitchen', label: 'Kitchen Window', floor: 0, room: 'kitchen', x: 618, y: 34, w: 82, h: 8 },
  { id: 'win_bedroom', label: 'Bedroom Window', floor: 1, room: 'bedroom', x: 142, y: 34, w: 96, h: 8 },
  { id: 'win_office', label: 'Office Window', floor: 1, room: 'office', x: 564, y: 34, w: 88, h: 8 },
  { id: 'win_office_east', label: 'Office Lounge Window', floor: 1, room: 'office', x: 802, y: 34, w: 88, h: 8 },
  { id: 'win_master_bath', label: 'Primary Bath Window', floor: 1, room: 'master_bath', x: 126, y: 522, w: 96, h: 8 },
  { id: 'win_garage', label: 'Garage Vent', floor: 3, room: 'garage', x: 420, y: 34, w: 110, h: 8 }
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
  const alongPad = 12;
  const crossPad = 22;
  if (d.w >= d.h) {
    const h = Math.max(46, d.h + crossPad * 2);
    return { x: d.x - alongPad, y: d.y + d.h / 2 - h / 2, w: d.w + alongPad * 2, h };
  }
  const w = Math.max(46, d.w + crossPad * 2);
  return { x: d.x + d.w / 2 - w / 2, y: d.y - alongPad, w, h: d.h + alongPad * 2 };
}

function doorwayAtPoint(point, floor) {
  return doorways.find(d => d.floor === floor && pointInRect(point, doorwayPassageRect(d))) || null;
}

function roomsConnectedByDoorway(roomA, roomB, doorway) {
  if (!roomA || !roomB || !doorway) return false;
  return (doorway.a === roomA.id && doorway.b === roomB.id) || (doorway.b === roomA.id && doorway.a === roomB.id);
}

function doorwayTouchesRoom(doorway, room) {
  if (!doorway || !room) return false;
  return doorway.a === room.id || doorway.b === room.id;
}

function boundaryCrossingAllowed(prevPoint, nextPoint, floor, prevRoom, nextRoom) {
  const candidates = [doorwayAtPoint(prevPoint, floor), doorwayAtPoint(nextPoint, floor)].filter(Boolean);
  const doorway = candidates.find(d => {
    if (prevRoom && nextRoom) return roomsConnectedByDoorway(prevRoom, nextRoom, d);
    const realRoom = prevRoom || nextRoom;
    return doorwayTouchesRoom(d, realRoom);
  });
  if (!doorway) return false;
  return segmentIntersectsRect(prevPoint, nextPoint, doorwayPassageRect(doorway));
}

function stepUsesDoorway(from, to, floor, roomA = null, roomB = null) {
  return doorways.some(d => {
    if (d.floor !== floor) return false;
    if (roomA && roomB && !roomsConnectedByDoorway(roomA, roomB, d)) return false;
    if (roomA && !roomB && !doorwayTouchesRoom(d, roomA)) return false;
    if (!roomA && roomB && !doorwayTouchesRoom(d, roomB)) return false;
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
      const nextPath = [...path, d];
      if (next === end.id) return doorwayPathPoints(nextPath, start.id);
      if (!seen.has(next)) { seen.add(next); queue.push([next, nextPath]); }
    }
  }
  return [];
}

function doorwayPathPoints(path, startRoomId) {
  const points = [];
  let roomId = startRoomId;
  for (const d of path) {
    const nextRoomId = d.a === roomId ? d.b : d.a;
    points.push(doorwaySidePoint(d, roomId));
    points.push(doorwayCenter(d));
    points.push(doorwaySidePoint(d, nextRoomId));
    roomId = nextRoomId;
  }
  return uniquePoints(points);
}

function doorwaySidePoint(d, roomId) {
  const room = floors[d.floor]?.rooms.find(r => r.id === roomId);
  const center = doorwayCenter(d);
  if (!room) return center;
  const roomCenter = { x: room.x + room.w / 2, y: room.y + room.h / 2 };
  const inset = 18;
  if (d.w >= d.h) {
    const y = roomCenter.y < center.y ? d.y - inset : d.y + d.h + inset;
    return { x: center.x, y };
  }
  const x = roomCenter.x < center.x ? d.x - inset : d.x + d.w + inset;
  return { x, y: center.y };
}

function uniquePoints(points) {
  const seen = new Set();
  return points.filter(p => {
    const key = `${Math.round(p.x)},${Math.round(p.y)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
  if ((a && !b) || (!a && b)) return stepUsesDoorway(from, to, floor, a, b);
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
