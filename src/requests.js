import { log, say, setMood } from './state.js';

export function ensureRequests(state) {
  state.requests ??= [];
}

export function addRequest(state, actor, text, kind = 'want') {
  ensureRequests(state);
  const id = `req_${Date.now()}_${Math.floor(Math.random() * 999)}`;
  state.requests.unshift({ id, actorId: actor.id, actorName: actor.name, text, kind, done: false, time: state.time });
  state.requests = state.requests.slice(0, 12);
  say(actor, 'ASK');
  setMood(actor, 'playful');
  log(state, `${actor.name} requested: ${text}`);
}

export function completeRequest(state, id) {
  ensureRequests(state);
  const req = state.requests.find(r => r.id === id);
  if (req) req.done = true;
}

export function updateRequests(state) {
  ensureRequests(state);
  for (const actor of state.entities) {
    if (actor.type !== 'person' || actor.hidden) continue;
    const hasOpen = state.requests.some(r => !r.done && r.actorId === actor.id);
    if (hasOpen || Math.random() > 0.002) continue;
    if (actor.needs.fun < 34) addRequest(state, actor, 'I want something fun to do.', 'fun');
    else if (actor.needs.social < 32) addRequest(state, actor, 'Can we do something together?', 'social');
    else if (actor.needs.freshness < 30) addRequest(state, actor, 'This place needs fresh air or cleaning.', 'freshness');
    else if (actor.needs.hunger < 30) addRequest(state, actor, 'I could use food soon.', 'food');
  }
}
