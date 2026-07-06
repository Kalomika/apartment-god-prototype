import { canStepThroughRooms, routeThroughDoors } from './blueprint.js';
import { approachPoint, clampToPlay, expandedRect, getObject, getStairExit, getTravelStair, pointInRect, segmentHitsRect, solidObjects } from './world.js';

function directBlocked(a, b, floor, allowId = '') {
  return solidObjects(floor, allowId).some(o => segmentHitsRect(a, b, expandedRect(o, 20)));
}

function routeAround(a, b, floor, allowId = '') {
  const viaDoors = routeThroughDoors(a, b, floor);
  const goals = [...viaDoors, b];
  const path = [];
  let current = a;
  for (const goal of goals) {
    const leg = routeLeg(current, goal, floor, allowId);
    path.push(...leg);
    current = goal;
  }
  return path;
}

function routeLeg(a, b, floor, allowId = '') {
  const blockers = solidObjects(floor, allowId).filter(o => segmentHitsRect(a, b, expandedRect(o, 24)));
  if (!blockers.length) return [b];

  const o = blockers[0];
  const r = expandedRect(o, 38);
  const candidates = [
    clampToPlay(r.x - 20, r.y - 20),
    clampToPlay(r.x + r.w + 20, r.y - 20),
    clampToPlay(r.x - 20, r.y + r.h + 20),
    clampToPlay(r.x + r.w + 20, r.y + r.h + 20),
    clampToPlay(r.x - 20, r.y + r.h / 2),
    clampToPlay(r.x + r.w + 20, r.y + r.h / 2),
    clampToPlay(r.x + r.w / 2, r.y - 24),
    clampToPlay(r.x + r.w / 2, r.y + r.h + 24)
  ];

  candidates.sort((p, q) => {
    const dp = Math.hypot(p.x - a.x, p.y - a.y) + Math.hypot(b.x - p.x, b.y - p.y);
    const dq = Math.hypot(q.x - a.x, q.y - a.y) + Math.hypot(b.x - q.x, b.y - q.y);
    return dp - dq;
  });

  for (const p of candidates) {
    if (!directBlocked(a, p, floor, allowId) && !directBlocked(p, b, floor, allowId)) return [p, b];
  }
  return [candidates[0], b];
}

export function commandMove(entity, x, y, run = false, allowId = '') {
  const to = clampToPlay(x, y);
  entity.moveAllowId = allowId || '';
  entity.path = routeAround({ x: entity.x, y: entity.y }, to, entity.floor, entity.moveAllowId);
  entity.target = null;
  entity.pending = null;
  entity.blockedT = 0;
  entity.recoveryCount = 0;
  entity.action = run ? 'Running' : 'Walking';
  entity.speed = (entity.type === 'dog' ? 125 : 92) * (run ? 1.6 : 1);
  entity.pose = 'walk';
  entity.stopped = false;
}

export function clearMoveAllowance(entity) {
  entity.moveAllowId = '';
}

export function commandObject(entity, obj, actionId) {
  const target = approachPoint(obj, actionId);
  entity.target = { type: 'object', objectId: obj.id, actionId };
  entity.pending = null;
  entity.blockedT = 0;
  entity.recoveryCount = 0;
  entity.moveAllowId = obj.id;
  entity.action = `Going to ${obj.label}`;
  entity.pose = 'walk';
  entity.stopped = false;

  if (entity.floor !== obj.floor) {
    const stairs = getTravelStair(entity.floor, obj.floor);
    if (stairs && stairs.floor === entity.floor) {
      entity.pending = { type: 'floorTravel', targetFloor: obj.floor, objectId: obj.id, actionId, stairId: stairs.id };
      entity.path = routeAround({ x: entity.x, y: entity.y }, approachPoint(stairs), entity.floor, stairs.id);
      entity.moveAllowId = stairs.id;
      return;
    }
  }

  entity.path = routeAround({ x: entity.x, y: entity.y }, target, obj.floor, obj.id);
}

export function commandSocial(actor, target, socialId) {
  const near = clampToPlay(target.x + (actor.x < target.x ? -38 : 38), target.y + 6);
  actor.path = routeAround({ x: actor.x, y: actor.y }, near, target.floor);
  actor.target = { type: 'social', targetId: target.id, socialId };
  actor.blockedT = 0;
  actor.recoveryCount = 0;
  actor.moveAllowId = '';
  actor.action = `Going to ${target.name}`;
  actor.pose = 'walk';
  actor.stopped = false;
}

function pointBlocked(entity, p) {
  if (!canStepThroughRooms({ x: entity.x, y: entity.y }, p, entity.floor)) return true;
  return solidObjects(entity.floor, entity.moveAllowId || '').some(o => pointInRect(p.x, p.y, expandedRect(o, entity.type === 'dog' ? 12 : 16)));
}

function blockedStep(entity, from, to) {
  if (!canStepThroughRooms(from, to, entity.floor)) return true;
  return solidObjects(entity.floor, entity.moveAllowId || '').some(o => pointInRect(to.x, to.y, expandedRect(o, entity.type === 'dog' ? 12 : 16)));
}

function finishFloorTravel(state, entity) {
  const pending = entity.pending;
  if (!pending || pending.type !== 'floorTravel') return false;
  const stairs = getObject(pending.stairId);
  if (!stairs) { entity.pending = null; clearMoveAllowance(entity); return false; }
  const oldFloor = entity.floor;
  entity.floor = stairs.toFloor;
  const exit = getStairExit(stairs);
  if (exit) {
    entity.x = exit.x + exit.w / 2;
    entity.y = exit.y + exit.h + 34;
  }
  const obj = getObject(pending.objectId);
  entity.pending = null;
  entity.blockedT = 0;
  entity.recoveryCount = 0;
  clearMoveAllowance(entity);
  if (obj) {
    if (entity.floor !== obj.floor) {
      commandObject(entity, obj, pending.actionId);
    } else {
      const target = approachPoint(obj, pending.actionId);
      entity.moveAllowId = obj.id;
      entity.path = routeAround({ x: entity.x, y: entity.y }, target, entity.floor, obj.id);
      entity.target = { type: 'object', objectId: obj.id, actionId: pending.actionId };
    }
  }
  if (entity.id === 'resident' && state.viewHoldT <= 0) state.floor = entity.floor;
  entity.action = oldFloor !== entity.floor ? 'Using stairs' : entity.action;
  return true;
}

function recoverBlocked(entity, next, dt) {
  entity.blockedT = (entity.blockedT || 0) + dt;
  if (entity.blockedT < 0.35) return;
  entity.blockedT = 0;
  entity.recoveryCount = (entity.recoveryCount || 0) + 1;
  if (entity.path.length > 1) {
    entity.path.shift();
    return;
  }
  const sideSteps = [
    clampToPlay(entity.x + 34, entity.y),
    clampToPlay(entity.x - 34, entity.y),
    clampToPlay(entity.x, entity.y + 34),
    clampToPlay(entity.x, entity.y - 34),
    clampToPlay(entity.x + 28, entity.y + 28),
    clampToPlay(entity.x - 28, entity.y + 28),
    clampToPlay(entity.x + 28, entity.y - 28),
    clampToPlay(entity.x - 28, entity.y - 28)
  ].filter(p => !pointBlocked(entity, p));
  sideSteps.sort((a, b) => Math.hypot(a.x - next.x, a.y - next.y) - Math.hypot(b.x - next.x, b.y - next.y));
  if (sideSteps.length && entity.recoveryCount < 4) {
    entity.path = [sideSteps[0], next];
    return;
  }
  entity.path = [];
  entity.target = null;
  clearMoveAllowance(entity);
  entity.action = 'Blocked';
  entity.pose = 'stand';
}

export function updateMovement(state, entity, dt) {
  if (entity.hidden || entity.stopped) return false;
  if (!entity.path.length) return false;

  const next = entity.path[0];
  if (entity.floor !== state.floor && entity.id === 'resident' && state.viewHoldT <= 0) state.floor = entity.floor;

  const dx = next.x - entity.x;
  const dy = next.y - entity.y;
  const dist = Math.hypot(dx, dy);
  const step = entity.speed * dt;
  if (dist <= step) {
    const from = { x: entity.x, y: entity.y };
    if (!blockedStep(entity, from, next)) {
      entity.blockedT = 0;
      entity.recoveryCount = 0;
      entity.x = next.x;
      entity.y = next.y;
      entity.path.shift();
      if (!entity.path.length) {
        if (finishFloorTravel(state, entity)) return false;
        clearMoveAllowance(entity);
        return true;
      }
    } else {
      recoverBlocked(entity, next, dt);
    }
    return false;
  }

  const from = { x: entity.x, y: entity.y };
  const to = { x: entity.x + (dx / dist) * step, y: entity.y + (dy / dist) * step };
  if (!blockedStep(entity, from, to)) {
    entity.blockedT = 0;
    entity.recoveryCount = 0;
    entity.x = to.x;
    entity.y = to.y;
  } else {
    recoverBlocked(entity, next, dt);
  }
  return false;
}
