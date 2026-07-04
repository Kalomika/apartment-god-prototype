import { log, say } from './state.js';

export function showCellPhone(state, actor, reason = 'manual', seconds = 8) {
  if (!actor || actor.type === 'dog' || actor.hidden) return;
  const priorT = state.phone?.actorId === actor.id ? state.phone.t || 0 : 0;
  state.phone = {
    actorId: actor.id,
    reason,
    open: reason === 'panel' || Boolean(state.phone?.open && state.phone.actorId === actor.id),
    t: Math.max(seconds, priorT)
  };
  actor.phoneT = Math.max(actor.phoneT || 0, seconds);
}

export function setPhonePanelOpen(state, actor, isOpen) {
  if (!actor || actor.type === 'dog') return;
  if (isOpen) {
    showCellPhone(state, actor, 'panel', 9999);
    state.phone.open = true;
    state.phone.t = 9999;
    return;
  }
  if (state.phone?.actorId === actor.id && state.phone.reason === 'panel') {
    state.phone.open = false;
    state.phone.reason = 'manual';
    state.phone.t = Math.min(state.phone.t || 0, 1.25);
  }
}

export function updateCellPhone(state, dt) {
  if (!state.phone) maybeAutonomousPhoneCheck(state);
  if (!state.phone) return;

  const actor = state.entities.find(e => e.id === state.phone.actorId);
  if (!actor || actor.hidden || actor.type === 'dog') {
    state.phone = null;
    return;
  }

  actor.phoneT = Math.max(actor.phoneT || 0, state.phone.open ? 1 : state.phone.t);
  if (state.phone.open) return;

  state.phone.t -= dt;
  actor.phoneT = Math.max(0, (actor.phoneT || 0) - dt);
  if (state.phone.t <= 0) state.phone = null;
}

export function phoneVisibleFor(state, actor) {
  return Boolean(actor && state.phone && state.phone.actorId === actor.id && actor.floor === state.floor);
}

export function markPhoneActivity(state, actor, label = 'phone', seconds = 6) {
  showCellPhone(state, actor, label, seconds);
}

function maybeAutonomousPhoneCheck(state) {
  if (!state.phoneNextT) state.phoneNextT = state.time + 38 + Math.random() * 52;
  if (state.time < state.phoneNextT) return;
  state.phoneNextT = state.time + 45 + Math.random() * 85;

  const actors = state.entities.filter(e => e.type === 'person' && !e.hidden && !e.stopped && !e.action && !e.pending && (e.needs?.fun ?? 50) < 78);
  if (!actors.length) return;

  const actor = actors[Math.floor(Math.random() * actors.length)];
  showCellPhone(state, actor, 'idle check', 3.5 + Math.random() * 3);
  if (Math.random() > 0.55) say(actor, Math.random() > 0.5 ? 'lol' : 'rn', 1.5);
  log(state, `${actor.name} checked their phone.`);
}
