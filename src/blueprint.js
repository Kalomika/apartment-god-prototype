import { changeNeed, log, say } from './state.js';
import { roomAt } from './world.js';

export const doorways = [
  { floor: 0, a: 'living', b: 'kitchen', x: 448, y: 206, w: 20, h: 68 },
  { floor: 0, a: 'living', b: 'entry', x: 226, y: 336, w: 86, h: 18 },
  { floor: 0, a: 'kitchen', b: 'entry', x: 586, y: 336, w: 92, h: 18 },
  { floor: 0, a: 'bath', b: 'entry', x: 840, y: 336, w: 58, h: 18 },
  { floor: 0, a: 'entry', b: 'stairs', x: 802, y: 516, w: 58, h: 22 },
  { floor: 1, a: 'bedroom', b: 'hall', x: 226, y: 382, w: 88, h: 18 },
  { floor: 1, a: 'office', b: 'hall', x: 574, y: 382, w: 82, h: 18 },
  { floor: 1, a: 'bath2', b: 'hall', x: 826, y: 382, w: 64, h: 18 },
  { floor: 1, a: 'hall', b: 'stairs2', x: 802, y: 516, w: 58, h: 22 }
];

export const windows = [
  { id: 'win_living', label: 'Living Window', floor: 0, room: 'living', x: 116, y: 34, w: 86, h: 8 },
  { id: 'win_kitchen', label: 'Kitchen Window', floor: 0, room: 'kitchen', x: 618, y: 34, w: 82, h: 8 },
  { id: 'win_bedroom', label: 'Bedroom Window', floor: 1, room: 'bedroom', x: 142, y: 34, w: 96, h: 8 },
  { id: 'win_office', label: 'Office Window', floor: 1, room: 'office', x: 564, y: 34, w: 88, h: 8 }
];

export function doorwayCenter(d) {
  return { x: d.x + d.w / 2, y: d.y + d.h / 2 };
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
  const a = roomAt(from.x, from.y, floor);
  const b = roomAt(to.x, to.y, floor);
  if (!a || !b || a.id === b.id) return true;
  const door = doorways.find(d => d.floor === floor && ((d.a === a.id && d.b === b.id) || (d.b === a.id && d.a === b.id)));
  if (!door) return false;
  const pad = 18;
  return to.x >= door.x - pad && to.x <= door.x + door.w + pad && to.y >= door.y - pad && to.y <= door.y + door.h + pad;
}

export function windowAt(x, y, floor) {
  return windows.find(w => w.floor === floor && x >= w.x - 12 && x <= w.x + w.w + 12 && y >= w.y - 14 && y <= w.y + w.h + 22) || null;
}

export function toggleWindow(state, actor, win) {
  state.objectState.openWindows ??= {};
  state.objectState.openWindows[win.id] = !state.objectState.openWindows[win.id];
  const open = state.objectState.openWindows[win.id];
  if (open) {
    changeNeed(actor, 'freshness', 4);
    say(actor, '🌬️');
    log(state, `${actor.name} opened ${win.label} for fresh air.`);
  } else {
    say(actor, '🔒');
    log(state, `${actor.name} closed ${win.label}.`);
  }
}

export function updateFreshAir(state, dt) {
  const open = Object.values(state.objectState.openWindows || {}).some(Boolean);
  if (!open) return;
  for (const e of state.entities) if (!e.hidden) changeNeed(e, 'freshness', dt * .035);
}
