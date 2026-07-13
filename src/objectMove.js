import { clearMoveAllowance, commandMove } from './movement.js';
import { objects, approachPoint } from './world.js';
import { changeNeed, log, say } from './state.js';
import { pay } from './economy.js';

const FIXED = new Set(['shower', 'toilet', 'sink', 'stove']);
const MOVABLE = new Set(['couch', 'fridge', 'bed', 'desk', 'dog_bowl', 'bookshelf', 'workout']);
const WEIGHT = { dog_bowl: 1, workout: 2, bookshelf: 3, desk: 4, couch: 5, bed: 5, fridge: 7 };
const LIFT_SECONDS = 0.65;

export function beginMoveObject(state, actor, obj) {
  if (!actor || !obj) return false;
  if (actor.floor !== obj.floor) {
    state.movePick = null;
    actor.action = `Go to ${obj.label} first`;
    say(actor, 'GO');
    log(state, `${actor.name} must be on the same floor as ${obj.label} before moving it.`);
    return false;
  }
  if (FIXED.has(obj.kind)) {
    state.movePick = { objectId: obj.id, renovation: true, floor: obj.floor };
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
  state.movePick = { objectId: obj.id, renovation: false, floor: obj.floor };
  actor.action = `Planning move for ${obj.label}`;
  say(actor, 'WHERE?');
  log(state, `Tap where ${obj.label} should move.`);
  return true;
}

export function placeMoveObject(state, actor, x, y) {
  if (!state.movePick) return false;
  const pick = state.movePick;
  const wasRenovation = pick.renovation;
  const obj = objects.find(o => o.id === pick.objectId);
  state.movePick = null;
  if (!obj || !actor) return false;
  if (actor.floor !== obj.floor || pick.floor !== obj.floor || state.floor !== obj.floor) {
    actor.action = `Cannot move ${obj.label}`;
    say(actor, 'NO');
    log(state, `${obj.label} cannot be moved remotely. Put ${actor.name} on the same floor and move it from there.`);
    return true;
  }
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
    state.appointments.push({ type: 'renovation', objectId: obj.id, t: 12, x: nx, y: ny, floor: obj.floor });
    actor.action = `${obj.label} renovation scheduled`;
    say(actor, 'BOOKED');
    log(state, `Contractors scheduled to move ${obj.label}.`);
    return true;
  }
  const strength = actor.skills?.strength ?? 1;
  const weight = WEIGHT[obj.kind] ?? 2;
  const helper = state.entities.find(e => e.id !== actor.id && e.type === 'person' && !e.hidden && e.floor === obj.floor && (e.skills?.strength ?? 1) + strength >= weight);
  if (strength < weight - 1 && !helper) {
    actor.action = `Needs help moving ${obj.label}`;
    log(state, `${actor.name} needs help to move ${obj.label}.`);
    say(actor, 'HELP');
    return true;
  }
  if (helper && strength < weight) {
    const hp = approachPoint(obj, 'move');
    commandMove(helper, hp.x + 30, hp.y, false, obj.id);
    helper.action = `Going to help move ${obj.label}`;
    helper.carrying = null;
    say(helper, 'HELP');
    log(state, `${helper.name} is coming to help move ${obj.label}.`);
  }
  state.moveJob = {
    actorId: actor.id,
    helperId: helper?.id || null,
    objectId: obj.id,
    floor: obj.floor,
    x: nx,
    y: ny,
    phase: 'toObject',
    liftT: LIFT_SECONDS,
    weight,
    source: { x: obj.x, y: obj.y }
  };
  const p = approachPoint(obj, 'move');
  commandMove(actor, p.x, p.y, false, obj.id);
  actor.action = `Going to move ${obj.label}`;
  actor.carrying = null;
  say(actor, 'MOVE');
  log(state, `${actor.name} is going to move ${obj.label}.`);
  return true;
}

export function updateMoveJob(state, dt = 0) {
  const job = state.moveJob;
  if (!job) return;
  const actor = state.entities.find(e => e.id === job.actorId);
  const helper = state.entities.find(e => e.id === job.helperId);
  const obj = objects.find(o => o.id === job.objectId);
  if (!actor || !obj) return cancelMoveJob(state, actor, helper, obj, 'move canceled');
  if (actor.floor !== job.floor || obj.floor !== job.floor || actor.hidden || (helper && (helper.floor !== job.floor || helper.hidden))) {
    return cancelMoveJob(state, actor, helper, obj, `${obj.label} move canceled because movers left the floor.`);
  }

  if (job.phase === 'toObject') {
    if (actor.path.length || (helper && helper.path.length)) return;
    if (!isNearObject(actor, obj) || (helper && !isNearObject(helper, obj))) {
      return cancelMoveJob(state, actor, helper, obj, `${obj.label} move canceled because movers did not reach it.`);
    }
    job.phase = 'lifting';
    job.liftT = LIFT_SECONDS;
    actor.action = `Lifting ${obj.label}`;
    actor.pose = 'lift';
    actor.carrying = `moving ${obj.label}`;
    if (helper) {
      helper.action = `Lifting ${obj.label}`;
      helper.pose = 'lift';
      helper.carrying = `moving ${obj.label}`;
      say(helper, 'LIFT');
    }
    say(actor, 'LIFT');
    log(state, `${actor.name}${helper ? ` and ${helper.name}` : ''} reached ${obj.label} and started lifting.`);
    return;
  }

  if (job.phase === 'lifting') {
    job.liftT = Math.max(0, (job.liftT ?? LIFT_SECONDS) - dt);
    if (job.liftT > 0) return;
    job.phase = 'toDest';
    commandMove(actor, job.x + obj.w / 2, job.y + obj.h / 2, false, obj.id);
    actor.action = `Carrying ${obj.label}`;
    actor.pose = 'carry';
    actor.carrying = `moving ${obj.label}`;
    if (helper) {
      commandMove(helper, job.x + obj.w / 2 + 28, job.y + obj.h / 2, false, obj.id);
      helper.action = `Helping carry ${obj.label}`;
      helper.pose = 'carry';
      helper.carrying = `moving ${obj.label}`;
    }
    log(state, `${actor.name}${helper ? ` and ${helper.name}` : ''} is carrying ${obj.label} to the new spot.`);
    return;
  }

  if (job.phase === 'toDest') {
    obj.x = Math.round(actor.x - obj.w / 2);
    obj.y = Math.round(actor.y - obj.h / 2);
    if (actor.path.length || (helper && helper.path.length)) return;
    obj.x = job.x;
    obj.y = job.y;
    changeNeed(actor, 'stamina', -job.weight * 4);
    changeNeed(actor, 'energy', -job.weight * 2);
    clearMoveAllowance(actor);
    actor.action = 'Idle';
    actor.pose = 'stand';
    actor.carrying = null;
    if (helper) {
      changeNeed(helper, 'stamina', -job.weight * 3);
      clearMoveAllowance(helper);
      helper.action = 'Idle';
      helper.pose = 'stand';
      helper.carrying = null;
      say(helper, 'DONE');
    }
    say(actor, 'DONE');
    log(state, `${actor.name}${helper ? ` and ${helper.name}` : ''} moved ${obj.label}.`);
    state.moveJob = null;
  }
}

function cancelMoveJob(state, actor, helper, obj, reason) {
  if (actor) {
    clearMoveAllowance(actor);
    actor.path = [];
    actor.action = 'Move canceled';
    actor.pose = 'stand';
    actor.carrying = null;
    say(actor, 'NO');
  }
  if (helper) {
    clearMoveAllowance(helper);
    helper.path = [];
    helper.action = 'Idle';
    helper.pose = 'stand';
    helper.carrying = null;
  }
  if (obj && state.moveJob?.source) {
    obj.x = state.moveJob.source.x;
    obj.y = state.moveJob.source.y;
  }
  log(state, reason);
  state.moveJob = null;
  return true;
}

function isNearObject(actor, obj) {
  const p = approachPoint(obj, 'move');
  return Math.hypot(actor.x - p.x, actor.y - p.y) <= 78 || pointNearRect(actor.x, actor.y, obj, 34);
}

function pointNearRect(x, y, rect, pad = 0) {
  return x >= rect.x - pad && x <= rect.x + rect.w + pad && y >= rect.y - pad && y <= rect.y + rect.h + pad;
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
