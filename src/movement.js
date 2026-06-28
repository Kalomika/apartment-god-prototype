import { canStepThroughRooms, routeThroughDoors } from './blueprint.js';
import { approachPoint, clampToPlay, expandedRect, getObject, pointInRect, segmentHitsRect, solidObjects } from './world.js';

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
    clampToPlay(r.x + r.w + 20, r.y + r.h / 2)
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

export function commandMove(entity, x, y, run = false) {
  const to = clampToPlay(x, y);
  entity.path = routeAround({ x: entity.x, y: entity.y }, to, entity.floor);
  entity.target = null;
  entity.pending = null;
  entity.action = run ? 'Running' : 'Walking';
  entity.speed = (entity.type === 'dog' ? 125 : 92) * (run ? 1.6 : 1);
  entity.pose = 'walk';
  entity.stopped = false;
}

export function commandObject(entity, obj, actionId) {
  const target = approachPoint(obj, actionId);
  entity.target = { type: 'object', objectId: obj.id, actionId };
  entity.pending = null;
  entity.action = `Going to ${obj.label}`;
  entity.pose = 'walk';
  entity.stopped = false;

  if (entity.floor !== obj.floor) {
    const stairs = obj.floor === 1 ? getObject('stairs_down') : getObject('stairs_up');
    if (stairs && stairs.floor === entity.floor) {
      entity.pending = { type: 'floorTravel', toFloor: obj.floor, target, objectId: obj.id, actionId };
      entity.path = routeAround({ x: entity.x, y: entity.y }, approachPoint(stairs), entity.floor, stairs.id);
      return;
    }
  }

  entity.path = routeAround({ x: entity.x, y: entity.y }, target, obj.floor, obj.id);
}

export function commandSocial(actor, target, socialId) {
  const near = clampToPlay(target.x + (actor.x < target.x ? -38 : 38), target.y + 6);
  actor.path = routeAround({ x: actor.x, y: actor.y }, near, target.floor);
  actor.target = { type: 'social', targetId: target.id, socialId };
  actor.action = `Going to ${target.name}`;
  actor.pose = 'walk';
  actor.stopped = false;
}

function blockedStep(entity, from, to) {
  if (!canStepThroughRooms(from, to, entity.floor)) return true;
  return solidObjects(entity.floor).some(o => pointInRect(to.x, to.y, expandedRect(o, entity.type === 'dog' ? 12 : 16)));
}

function finishFloorTravel(state, entity) {
  const pending = entity.pending;
  if (!pending || pending.type !== 'floorTravel') return false;
  const oldFloor = entity.floor;
  entity.floor = pending.toFloor;
  const exit = getObject(pending.toFloor === 1 ? 'stairs_up' : 'stairs_down');
  if (exit) {
    entity.x = exit.x + exit.w / 2;
    entity.y = exit.y + exit.h + 34;
  }
  const obj = getObject(pending.objectId);
  if (obj) {
    const target = approachPoint(obj, pending.actionId);
    entity.path = routeAround({ x: entity.x, y: entity.y }, target, entity.floor, obj.id);
    entity.target = { type: 'object', objectId: obj.id, actionId: pending.actionId };
  }
  entity.pending = null;
  if (entity.id === 'resident' && state.viewHoldT <= 0) state.floor = entity.floor;
  entity.action = oldFloor !== entity.floor ? 'Using stairs' : entity.action;
  return true;
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
      entity.x = next.x;
      entity.y = next.y;
      entity.path.shift();
      if (!entity.path.length) {
        if (finishFloorTravel(state, entity)) return false;
        return true;
      }
    } else {
      entity.path = routeAround(from, next, entity.floor);
    }
    return false;
  }

  const from = { x: entity.x, y: entity.y };
  const to = { x: entity.x + (dx / dist) * step, y: entity.y + (dy / dist) * step };
  if (!blockedStep(entity, from, to)) {
    entity.x = to.x;
    entity.y = to.y;
  } else {
    entity.path = routeAround(from, next, entity.floor);
  }
  return false;
}
