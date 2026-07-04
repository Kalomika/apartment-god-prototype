import { clearMoveAllowance, commandMove } from './movement.js';
import { objects, approachPoint } from './world.js';
import { changeNeed, log, say } from './state.js';
import { pay } from './economy.js';

const FIXED = new Set(['shower', 'toilet', 'sink', 'stove']);
const MOVABLE = new Set(['couch', 'fridge', 'bed', 'desk', 'dog_bowl', 'bookshelf', 'workout']);
const WEIGHT = { dog_bowl: 1, workout: 2, bookshelf: 3, desk: 4, couch: 5, bed: 5, fridge: 7 };

export function beginMoveObject(state, actor, obj) {
  if (FIXED.has(obj.kind)) {
    state.movePick = { objectId: obj.id, renovation: true };
    actor.action = `Planning ${obj.label} renovation`;
    say(actor, 'RENOVATE');
    log(state, `${obj.label} needs renovation. Tap a valid destination.`);
    return true;
  }
  if (!MOVABLE.has(obj.kind)) {
    actor.action = 'Cannot move that';
    say(actor, 'NO');
    log(state, `${obj.label} is not movable yet.`);
    return false;
  }
  state.movePick = { objectId: obj.id, renovation: false };
  actor.action = `Planning move for ${obj.label}`;
  say(actor, 'WHERE?');
  log(state, `Tap where ${obj.label} should move.`);
  return true;
}

export function placeMoveObject(state, actor, x, y) {
  if (!state.movePick) return false;
  const wasRenovation = state.movePick.renovation;
  const obj = objects.find(o => o.id === state.movePick.objectId);
  state.movePick = null;
  if (!obj) return false;
  const nx = Math.round(x - obj.w / 2);
  const ny = Math.round(y - obj.h / 2);
  const check = validatePlacement(obj, nx, ny);
  if (!check.ok) {
    actor.action = `Cannot move ${obj.label}`;
    log(state, check.reason);
    say(actor, 'NO');
    return true;
  }
  if (wasRenovation || FIXED.has(obj.kind)) {
    if (!pay(state, 420, `${obj.label} renovation`)) {
      actor.action = 'Not enough money';
      say(actor, 'NO');
      return true;
    }
    state.appointments.push({ type: 'renovation', objectId: obj.id, t: 12, x: nx, y: ny });
    actor.action = `${obj.label} renovation scheduled`;
    say(actor, 'BOOKED');
    log(state, `Contractors scheduled to move ${obj.label}.`);
    return true;
  }
  const strength = actor.skills?.strength ?? 1;
  const weight = WEIGHT[obj.kind] ?? 2;
  const helper = state.entities.find(e => e.id !== actor.id && e.type === 'person' && !e.hidden && e.floor === actor.floor && (e.skills?.strength ?? 1) + strength >= weight);
  if (strength < weight - 1 && !helper) {
    actor.action = `Needs help moving ${obj.label}`;
    log(state, `${actor.name} needs help to move ${obj.label}.`);
    say(actor, 'HELP');
    return true;
  }
  if (helper && strength < weight) {
    const hp = approachPoint(obj, 'move');
    commandMove(helper, hp.x + 30, hp.y, false, obj.id);
    helper.action = `Helping move ${obj.label}`;
    say(helper, 'HELP');
    log(state, `${helper.name} is coming to help move ${obj.label}.`);
  }
  state.moveJob = { actorId: actor.id, helperId: helper?.id || null, objectId: obj.id, x: nx, y: ny, phase: 'toObject', weight };
  const p = approachPoint(obj, 'move');
  commandMove(actor, p.x, p.y, false, obj.id);
  actor.action = `Going to move ${obj.label}`;
  say(actor, 'MOVE');
  log(state, `${actor.name} is going to move ${obj.label}.`);
  return true;
}

export function updateMoveJob(state) {
  const job = state.moveJob;
  if (!job) return;
  const actor = state.entities.find(e => e.id === job.actorId);
  const helper = state.entities.find(e => e.id === job.helperId);
  const obj = objects.find(o => o.id === job.objectId);
  if (!actor || !obj) return;
  if (job.phase === 'toObject' && !actor.path.length && (!helper || !helper.path.length)) {
    job.phase = 'toDest';
    commandMove(actor, job.x + obj.w / 2, job.y + obj.h / 2, false, obj.id);
    actor.action = `Carrying ${obj.label}`;
    if (helper) {
      commandMove(helper, job.x + obj.w / 2 + 28, job.y + obj.h / 2, false, obj.id);
      helper.action = `Helping carry ${obj.label}`;
      say(helper, 'LIFT');
    }
    say(actor, 'LIFT');
    log(state, `${actor.name}${helper ? ` and ${helper.name}` : ''} started carrying ${obj.label}.`);
  }
  if (job.phase === 'toDest') {
    obj.x = Math.round(actor.x - obj.w / 2);
    obj.y = Math.round(actor.y - obj.h / 2);
    if (!actor.path.length && (!helper || !helper.path.length)) {
      obj.x = job.x;
      obj.y = job.y;
      changeNeed(actor, 'stamina', -job.weight * 4);
      changeNeed(actor, 'energy', -job.weight * 2);
      clearMoveAllowance(actor);
      if (helper) {
        changeNeed(helper, 'stamina', -job.weight * 3);
        clearMoveAllowance(helper);
        helper.action = 'Idle';
      }
      actor.action = 'Idle';
      say(actor, 'DONE');
      if (helper) say(helper, 'DONE');
      log(state, `${actor.name}${helper ? ` and ${helper.name}` : ''} moved ${obj.label}.`);
      state.moveJob = null;
    }
  }
}

function validatePlacement(obj, x, y) {
  if (x < 28 || y < 34 || x + obj.w > 936 || y + obj.h > 660) return { ok: false, reason: 'That placement is outside the usable apartment.' };
  const rect = { x, y, w: obj.w, h: obj.h };
  if (overlap(rect, { x: 34, y: 360, w: 110, h: 150 })) return { ok: false, reason: 'Cannot block the front door path.' };
  if (overlap(rect, { x: 730, y: 520, w: 190, h: 140 })) return { ok: false, reason: 'Cannot block the stairs path.' };
  for (const other of objects) {
    if (other.id === obj.id || other.floor !== obj.floor || !other.solid) continue;
    if (overlap(rect, other)) return { ok: false, reason: `Cannot overlap ${other.label}.` };
  }
  return { ok: true };
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
