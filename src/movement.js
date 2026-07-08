import { canStepThroughRooms, routeThroughDoors } from './blueprint.js';
import { approachPoint, clampToPlay, expandedRect, getObject, getStairExit, getTravelStair, pointInRect, roomAt, segmentHitsRect, solidObjects } from './world.js';

const ROUTE_BLOCK_PAD = 8;
const ROUTE_CLEAR_PAD = 5;
const ROUTE_CORNER_PAD = 22;
const PERSON_COLLISION_PAD = 4;
const DOG_COLLISION_PAD = 3;
const ROUTE_EPSILON = 6;

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
    if (!leg.length) return [];
    path.push(...leg);
    current = leg[leg.length - 1];
  }
  return path;
}

function routeLeg(a, b, floor, allowId = '') {
  if (samePoint(a, b) || legClear(a, b, floor, allowId)) return [b];
  const candidates = routeCandidates(a, b, floor, allowId);
  return findClearPath([a, ...candidates, b], floor, allowId);
}

function routeCandidates(a, b, floor, allowId = '') {
  const blockers = solidObjects(floor, allowId).filter(o => segmentHitsRect(a, b, expandedRect(o, ROUTE_BLOCK_PAD + 44)));
  const allSolids = solidObjects(floor, allowId);
  const points = [];
  for (const o of blockers) {
    const r = expandedRect(o, ROUTE_CORNER_PAD);
    points.push(
      clampToPlay(r.x - 30, r.y - 30),
      clampToPlay(r.x + r.w + 30, r.y - 30),
      clampToPlay(r.x - 30, r.y + r.h + 30),
      clampToPlay(r.x + r.w + 30, r.y + r.h + 30),
      clampToPlay(r.x - 28, r.y + r.h / 2),
      clampToPlay(r.x + r.w + 28, r.y + r.h / 2),
      clampToPlay(r.x + r.w / 2, r.y - 30),
      clampToPlay(r.x + r.w / 2, r.y + r.h + 30),
      clampToPlay(r.x - 42, r.y - 8),
      clampToPlay(r.x + r.w + 42, r.y - 8),
      clampToPlay(r.x - 42, r.y + r.h + 8),
      clampToPlay(r.x + r.w + 42, r.y + r.h + 8)
    );
  }
  return uniquePoints(points).filter(p => {
    if (!roomAt(p.x, p.y, floor)) return false;
    if (allSolids.some(o => pointInRect(p.x, p.y, expandedRect(o, ROUTE_CLEAR_PAD + 2)))) return false;
    return true;
  });
}

function findClearPath(points, floor, allowId = '') {
  const start = 0;
  const end = points.length - 1;
  const cost = new Array(points.length).fill(Infinity);
  const prev = new Array(points.length).fill(-1);
  const open = new Set(points.map((_, i) => i));
  cost[start] = 0;

  while (open.size) {
    let best = -1;
    for (const i of open) if (best < 0 || cost[i] < cost[best]) best = i;
    if (best < 0 || !Number.isFinite(cost[best])) break;
    open.delete(best);
    if (best === end) break;

    for (const i of open) {
      if (!legClear(points[best], points[i], floor, allowId)) continue;
      const nextCost = cost[best] + distance(points[best], points[i]) + distance(points[i], points[end]) * 0.002;
      if (nextCost < cost[i]) {
        cost[i] = nextCost;
        prev[i] = best;
      }
    }
  }

  if (prev[end] < 0) return [];
  const reversed = [];
  for (let i = end; i !== start && i >= 0; i = prev[i]) reversed.push(points[i]);
  return reversed.reverse();
}

function samePoint(a, b) {
  return distance(a, b) <= ROUTE_EPSILON;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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

function finishPlainMove(entity) {
  clearMoveAllowance(entity);
  if (!entity.target && !entity.pending) {
    entity.action = 'Idle';
    entity.pose = 'stand';
    entity.idleT = 0;
    return false;
  }
  return true;
}

export function commandMove(entity, x, y, run = false, allowId = '') {
  const to = clampToPlay(x, y);
  entity.moveAllowId = allowId || '';
  entity.path = routeAround({ x: entity.x, y: entity.y }, to, entity.floor, entity.moveAllowId);
  if (!entity.path.length && legClear({ x: entity.x, y: entity.y }, to, entity.floor, entity.moveAllowId)) entity.path = [to];
  entity.target = null;
  entity.pending = null;
  entity.blockedT = 0;
  entity.recoveryCount = 0;
  entity.action = entity.path.length ? (run ? 'Running' : 'Walking') : 'No route';
  entity.speed = (entity.type === 'dog' ? 125 : 92) * (run ? 1.6 : 1);
  entity.pose = entity.path.length ? 'walk' : 'stand';
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
      if (!entity.path.length) markUnreachable(entity, obj.label);
      return;
    }
  }
  entity.path = routeAround({ x: entity.x, y: entity.y }, target, obj.floor, obj.id);
  if (!entity.path.length && legClear({ x: entity.x, y: entity.y }, target, obj.floor, obj.id)) entity.path = [target];
  if (!entity.path.length) markUnreachable(entity, obj.label);
}

function markUnreachable(entity, label) {
  entity.path = [];
  entity.pending = null;
  entity.target = null;
  clearMoveAllowance(entity);
  entity.action = `No route to ${label}`;
  entity.pose = 'stand';
}

export function commandSocial(actor, target, socialId) {
  const near = clampToPlay(target.x + (actor.x < target.x ? -38 : 38), target.y + 6);
  actor.path = routeAround({ x: actor.x, y: actor.y }, near, target.floor);
  if (!actor.path.length && legClear({ x: actor.x, y: actor.y }, near, target.floor)) actor.path = [near];
  actor.target = actor.path.length ? { type: 'social', targetId: target.id, socialId } : null;
  actor.blockedT = 0;
  actor.recoveryCount = 0;
  actor.moveAllowId = '';
  actor.action = actor.path.length ? `Going to ${target.name}` : `No route to ${target.name}`;
  actor.pose = actor.path.length ? 'walk' : 'stand';
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
    entity.y = exit.styleAs === 'door' ? exit.y + exit.h / 2 : exit.y + exit.h + 34;
  }
  const obj = getObject(pending.objectId);
  entity.pending = null;
  entity.blockedT = 0;
  entity.recoveryCount = 0;
  clearMoveAllowance(entity);
  if (obj) {
    if (entity.floor !== obj.floor) commandObject(entity, obj, pending.actionId);
    else {
      const target = approachPoint(obj, pending.actionId);
      entity.moveAllowId = obj.id;
      entity.path = routeAround({ x: entity.x, y: entity.y }, target, entity.floor, obj.id);
      if (!entity.path.length && legClear({ x: entity.x, y: entity.y }, target, entity.floor, obj.id)) entity.path = [target];
      entity.target = entity.path.length ? { type: 'object', objectId: obj.id, actionId: pending.actionId } : null;
      if (!entity.path.length) markUnreachable(entity, obj.label);
    }
  }
  if (entity.id === state.selectedId && state.viewHoldT <= 0) state.floor = entity.floor;
  entity.action = oldFloor !== entity.floor ? 'Using passage' : entity.action;
  return true;
}

function recoverBlocked(state, entity, _next, dt) {
  entity.blockedT = (entity.blockedT || 0) + dt;
  if (entity.blockedT < 0.25) return false;
  entity.blockedT = 0;
  entity.recoveryCount = (entity.recoveryCount || 0) + 1;

  const final = entity.path[entity.path.length - 1];
  if (final && entity.recoveryCount <= 8) {
    const reroute = routeAround({ x: entity.x, y: entity.y }, final, entity.floor, entity.moveAllowId || '');
    if (reroute.length) {
      entity.path = reroute;
      return false;
    }
  }

  if (final && entity.recoveryCount > 8) {
    entity.x = final.x;
    entity.y = final.y;
    entity.path = [];
    entity.blockedT = 0;
    entity.recoveryCount = 0;
    if (entity.pending && finishFloorTravel(state, entity)) return false;
    if (entity.target) {
      clearMoveAllowance(entity);
      return true;
    }
    return finishPlainMove(entity);
  }

  entity.path = [];
  entity.target = null;
  entity.pending = null;
  clearMoveAllowance(entity);
  entity.action = 'Blocked';
  entity.pose = 'stand';
  entity.stopped = false;
  return false;
}

function closeEnoughToFinish(entity, _next, dist) {
  if (entity.target && dist < 38) return true;
  if (entity.pending && dist < 42) return true;
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
    return finishPlainMove(entity);
  }
  return false;
}

export function updateMovement(state, entity, dt) {
  if (entity.hidden || entity.stopped) return false;
  if (!entity.path.length) return false;
  const next = entity.path[0];
  if (entity.floor !== state.floor && entity.id === state.selectedId && state.viewHoldT <= 0) state.floor = entity.floor;
  const dx = next.x - entity.x;
  const dy = next.y - entity.y;
  const dist = Math.hypot(dx, dy);
  const step = entity.speed * dt;
  if (dist <= step) {
    const from = { x: entity.x, y: entity.y };
    if (!blockedStep(entity, from, next) || closeEnoughToFinish(entity, next, dist)) return acceptWaypoint(state, entity, next);
    return recoverBlocked(state, entity, next, dt);
  }
  const to = { x: entity.x + dx / dist * step, y: entity.y + dy / dist * step };
  if (blockedStep(entity, { x: entity.x, y: entity.y }, to)) return recoverBlocked(state, entity, next, dt);
  entity.x = to.x;
  entity.y = to.y;
  entity.pose = 'walk';
  return false;
}
