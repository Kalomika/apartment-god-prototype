import { pay } from './economy.js';
import { log, say, setMood } from './state.js';
import { objects, roomAt } from './world.js';

const BUILD_COSTS = { bookshelf: 140 };

export function handleBuildRequest(state, actor, text) {
  const request = String(text || '').toLowerCase();
  if (request.includes('bookshelf') || request.includes('book shelf') || request.includes('shelf')) return requestBookshelfPlacement(state, actor);
  if (request.includes('food') || request.includes('eat')) return false;
  log(state, `No build plan found for: ${text}`);
  say(actor, '?');
  return false;
}

function requestBookshelfPlacement(state, actor) {
  state.buildPick = { kind: 'bookshelf', label: 'Bookshelf', cost: BUILD_COSTS.bookshelf, w: 78, h: 118 };
  actor.action = 'Planning bookshelf';
  actor.actionT = 3;
  actor.actionTotal = 3;
  actor.pose = 'sit';
  setMood(actor, 'phone');
  say(actor, '📚');
  log(state, 'Choose a floor, then tap where the bookshelf should be delivered.');
  return true;
}

export function placeBuildRequest(state, actor, x, y) {
  const pick = state.buildPick;
  if (!pick) return false;
  const nx = Math.round(x - pick.w / 2);
  const ny = Math.round(y - pick.h / 2);
  const check = validateBuildPlacement(state, pick, nx, ny, state.floor);
  if (!check.ok) {
    log(state, check.reason);
    say(actor, '🚫');
    return true;
  }
  if (!pay(state, pick.cost, `${pick.label} delivery`)) return true;
  state.appointments.push({ type: pick.kind, t: 8, floor: state.floor, x: nx, y: ny, facing: pickFacing(pick, nx, ny, state.floor) });
  state.buildPick = null;
  say(actor, '✅');
  log(state, `${pick.label} delivery scheduled for Floor ${state.floor + 1}.`);
  return true;
}

function validateBuildPlacement(state, pick, x, y, floor) {
  if (x < 30 || y < 40 || x + pick.w > 930 || y + pick.h > 650) return { ok: false, reason: 'That spot is outside the usable apartment.' };
  const room = roomAt(x + pick.w / 2, y + pick.h / 2, floor);
  if (!room) return { ok: false, reason: 'Pick a valid room, not a wall gap.' };
  const rect = { x, y, w: pick.w, h: pick.h };
  if (overlap(rect, { x: 34, y: 360, w: 110, h: 150 })) return { ok: false, reason: 'Cannot block the front door path.' };
  if (overlap(rect, { x: 730, y: 520, w: 190, h: 140 })) return { ok: false, reason: 'Cannot block the stairs path.' };
  for (const other of objects) {
    if (other.floor !== floor || !other.solid) continue;
    if (overlap(rect, other)) return { ok: false, reason: `Cannot overlap ${other.label}.` };
  }
  return { ok: true };
}

function pickFacing(pick, x, y, floor) {
  const room = roomAt(x + pick.w / 2, y + pick.h / 2, floor);
  if (!room) return 'south';
  const spaces = {
    north: y - room.y,
    south: room.y + room.h - (y + pick.h),
    west: x - room.x,
    east: room.x + room.w - (x + pick.w)
  };
  return Object.entries(spaces).sort((a, b) => b[1] - a[1])[0][0];
}

export function updateAppointments(state, dt) {
  for (const appt of state.appointments) appt.t -= dt;
  const ready = state.appointments.filter(a => a.t <= 0);
  state.appointments = state.appointments.filter(a => a.t > 0);
  for (const appt of ready) {
    if (appt.type === 'bookshelf') installBookshelf(state, appt);
    if (appt.type === 'renovation') finishRenovation(state, appt);
  }
}

function installBookshelf(state, appt) {
  const count = objects.filter(o => o.kind === 'bookshelf').length + 1;
  const id = `bookshelf_${count}`;
  const room = roomAt(appt.x + 39, appt.y + 59, appt.floor);
  objects.push({ id, label: `Bookshelf ${count}`, kind: 'bookshelf', floor: appt.floor, room: room?.id || 'living', x: appt.x, y: appt.y, w: 78, h: 118, solid: true, facing: appt.facing || 'south' });
  state.objectState.bookshelf = true;
  log(state, `Delivery crew installed Bookshelf ${count}.`);
}

function finishRenovation(state, appt) {
  const obj = objects.find(o => o.id === appt.objectId);
  if (obj) {
    obj.x = appt.x;
    obj.y = appt.y;
    log(state, `Contractors moved ${obj.label}.`);
  }
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
