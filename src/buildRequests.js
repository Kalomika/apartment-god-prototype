import { pay } from './economy.js';
import { log, say, setMood } from './state.js';
import { objects } from './world.js';

export function handleBuildRequest(state, actor, text) {
  const request = String(text || '').toLowerCase();
  if (request.includes('bookshelf') || request.includes('book shelf') || request.includes('shelf')) return orderBookshelf(state, actor);
  if (request.includes('food') || request.includes('eat')) return false;
  log(state, `No build plan found for: ${text}`);
  say(actor, '?');
  return false;
}

export function orderBookshelf(state, actor) {
  if (state.objectState.bookshelf) return log(state, 'A bookshelf is already installed.');
  if (!pay(state, 140, 'bookshelf delivery')) return false;
  state.appointments.push({ type: 'bookshelf', t: 8, floor: 1, x: 330, y: 108 });
  actor.action = 'Ordering bookshelf';
  actor.actionT = 5;
  actor.pose = 'sit';
  setMood(actor, 'phone');
  say(actor, 'SHELF');
  log(state, 'Bookshelf delivery scheduled.');
  return true;
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
  if (!objects.some(o => o.id === 'bookshelf')) {
    objects.push({ id: 'bookshelf', label: 'Bookshelf', kind: 'bookshelf', floor: appt.floor, room: 'office', x: appt.x, y: appt.y, w: 78, h: 118, solid: true });
  }
  state.objectState.bookshelf = true;
  log(state, 'Delivery crew installed the bookshelf.');
}

function finishRenovation(state, appt) {
  const obj = objects.find(o => o.id === appt.objectId);
  if (obj) {
    obj.x = appt.x;
    obj.y = appt.y;
    log(state, `Contractors moved ${obj.label}.`);
  }
}
