import { canStepThroughRooms, routeThroughDoors } from './blueprint.js';
import { approachPoint, clampToPlay, expandedRect, getObject, getStairExit, getTravelStair, pointInRect, segmentHitsRect, solidObjects } from './world.js';

const ROUTE_BLOCK_PAD = 16;
const ROUTE_CLEAR_PAD = 12;
const ROUTE_CORNER_PAD = 28;
const PERSON_COLLISION_PAD = 10;
const DOG_COLLISION_PAD = 8;

function directBlocked(a, b, floor, allowId = '', pad = ROUTE_CLEAR_PAD) {
  return solidObjects(floor, allowId).some(o => segmentHitsRect(a, b, expandedRect(o, pad)));
}

function legClear(a, b, floor, allowId = '') {
  return canStepThroughRooms(a, b, floor) && !directBlocked(a, b, floor, allowId);
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
  const blockers = solidObjects(floor, allowId).filter(o => segmentHitsRect(a, b, expandedRect(o, ROUTE_BLOCK_PAD)));
  if (!blockers.length) return [b];

  const o = blockers[0];
  const r = expandedRect(o, ROUTE_CORNER_PAD);
  const candidates = uniquePoints([
    clampToPlay(r.x - 20, r.y - 20),
    clampToPlay(r.x + r.w + 20, r.y - 20),
    clampToPlay(r.x - 20, r.y + r.h + 20),
    clampToPlay(r.x + r.w + 20, r.y + r.h + 20),
    clampToPlay(r.x - 20, r.y + r.h / 2),
    clampToPlay(r.x + r.w + 20, r.y + r.h / 2),
    clampToPlay(r.x + r.w / 2, r.y - 24),
    clampToPlay(r.x + r.w / 2, r.y + r.h + 24),
    clampToPlay(o.x - 18, o.y - 18),
    clampToPlay(o.x + o.w + 18, o.y - 18),
    clampToPlay(o.x - 18, o.y + o.h + 18),
    clampToPlay(o.x + o.w + 18, o.y + o.h + 18)
  ]);

  candidates.sort((p, q) => {
    const dp = Math.hypot(p.x - a.x, p.y - a.y) + Math.hypot(b.x - p.x, b.y - p.y);
    const dq = Math.hypot(q.x - a.x, q.y - a.y) + Math.hypot(b.x - q.x, b.y - q.y);
    return dp - dq;
  });

  for (const p of candidates) {
    if (legClear(a, p, floor, allowId) && legClear(p, b, floor, allowId)) return [p, b];
  }

  for (const p of candidates) {
    if (legClear(a, p, floor, allowId)) return [p, b];
  }

  return [b];
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

function travelStairFor(entity, targetFloor) {
  if (entity.type === 'dog') {
    if (entity.floor === 0 && targetFloor === 4) return getObject('pet_flap_front') || getTravelStair(entity.floor, targetFloor);
    if (entity.floor === 4 && targetFloor === 0) return getObject('pet_flap_yard') || getTravelStair(entity.floor, targetFloor);
  }
  return getTravelStair(entity.floor, targetFloor);
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
    const stairs = travelStairFor(entity, obj.floor);
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

function blockedStep(entity, from, to) {
  if (!canStepThroughRooms(from, to, entity.floor)) return true;
  const pad = entity.type === 'dog' ? DOG_COLLISION_PAD : PERSON_COLLISION_PAD;
  return solidObjects(entity.floor, entity.moveAllowId || '').some(o => pointInRect(to.x, to.y, expandedRect(o, pad)));
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

function recoverBlocked(entity, _next, dt) {
  entity.blockedT = (entity.blockedT || 0) + dt;
  if (entity.blockedT < 0.35) return;
  entity.blockedT = 0;
  entity.recoveryCount = (entity.recoveryCount || 0) + 1;
  if (entity.path.length > 1) {
    entity.path.shift();
    return;
  }
  const final = entity.path[0];
  if (final && entity.recoveryCount <= 3) {
    const reroute = routeAround({ x: entity.x, y: entity.y }, final, entity.floor, entity.moveAllowId || '');
    if (reroute.length) {
      entity.path = reroute;
      return;
    }
  }
  entity.path = [];
  entity.target = null;
  clearMoveAllowance(entity);
  entity.action = 'Blocked';
  entity.pose = 'stand';
}

function closeEnoughToFinish(entity, next, dist) {
  if (entity.target && dist < 34) return true;
  if (entity.pending && dist < 38) return true;
  const remaining = entity.path?.length || 0;
  if (remaining <= 1 && Math.hypot(next.x - entity.x, next.y - entity.y) < 26) return true;
  return false;
}

function acceptWaypoint(state, entity, next) {
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
  return false;
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
    if (!blockedStep(entity, from, next) || closeEnoughToFinish(entity, next, dist)) return acceptWaypoint(state, entity, next);
    recoverBlocked(entity, next, dt);
    return false;
  }

  const from = { x: entity.x, y: entity.y };
  const to = { x: entity.x + (dx / dist) * step, y: entity.y + (dy / dist) * step };
  if (!blockedStep(entity, from, to)) {
    entity.blockedT = 0;
    entity.recoveryCount = 0;
    entity.x = to.x;
    entity.y = to.y;
  } else if (closeEnoughToFinish(entity, next, dist)) {
    return acceptWaypoint(state, entity, next);
  } else {
    recoverBlocked(entity, next, dt);
  }
  return false;
}
