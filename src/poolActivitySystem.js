import { getObject } from './world.js';

const SHOT_COOLDOWN = 2.4;
const TABLE_MARGIN_X = 58;
const TABLE_MARGIN_Y = 48;
const BALL_RADIUS = 7;
const SETTLE_SPEED = 5;
const POOL_WALK_SPEED = 84;
const ARRIVAL_RADIUS = 6;

export function updatePoolActivity(state, dt) {
  const table = getObject('pool_table');
  if (!table) return;
  const actors = activePoolActors(state, table.floor);
  updatePoolBallPhysics(state, dt, table);
  if (!actors.length) {
    if (state.poolGame?.tableId === table.id) state.poolGame.activeActorIds = [];
    return;
  }

  const game = ensurePoolGame(state, table);
  game.activeActorIds = actors.map(actor => actor.id);
  game.turnIndex = Math.max(0, Math.min(game.turnIndex || 0, actors.length - 1));
  const ballsMoving = game.balls.some(ball => !ball.pocketed && Math.hypot(ball.vx || 0, ball.vy || 0) > SETTLE_SPEED);
  actors.forEach((actor, index) => updatePoolActor(state, actor, table, dt, index, actors.length, ballsMoving));
}

export function poolShotStanceForTest(table, cue, target) {
  return shotStance(table, cue, target);
}

export function poolPerimeterPathForTest(from, to, table) {
  return pathAroundTable(from, to, table);
}

export function stepPoolRouteForTest(actor, route, dt, speed = POOL_WALK_SPEED) {
  actor.poolRoute = { points: route.map(point => ({ ...point })), key: 'test' };
  return stepPoolRoute(actor, dt, speed);
}

function activePoolActors(state, floor) {
  return (state.entities || []).filter(entity => {
    if (!entity || entity.hidden || entity.type !== 'person' || entity.floor !== floor) return false;
    if (!(Number(entity.actionT || 0) > 0)) return false;
    const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
    return key.includes('pool_solo') || key.includes('pool_together') || key.includes('pool practice') || key.includes('pool match') || key.includes('pool:');
  }).sort((a, b) => a.id.localeCompare(b.id));
}

function ensurePoolGame(state, table) {
  if (state.poolGame?.tableId === table.id && Array.isArray(state.poolGame.balls)) return state.poolGame;
  const centerY = table.y + table.h / 2;
  state.poolGame = {
    tableId: table.id,
    floor: table.floor,
    shotNumber: 0,
    turnIndex: 0,
    turnSerial: 1,
    turnStance: null,
    cueLine: null,
    cueThrust: null,
    message: 'Break ready',
    messageT: 1.5,
    pockets: pocketsFor(table),
    balls: [
      { id: 'cue', x: table.x + 72, y: centerY, vx: 0, vy: 0, fill: '#f8fbff' },
      { id: 'one', value: 1, x: table.x + table.w - 78, y: centerY, vx: 0, vy: 0, fill: '#f1c66a' },
      { id: 'two', value: 2, x: table.x + table.w - 55, y: centerY - 14, vx: 0, vy: 0, fill: '#74e6ff' },
      { id: 'three', value: 3, x: table.x + table.w - 55, y: centerY + 14, vx: 0, vy: 0, fill: '#ff75df' },
      { id: 'four', value: 4, x: table.x + table.w - 32, y: centerY, vx: 0, vy: 0, fill: '#b66d55' }
    ]
  };
  return state.poolGame;
}

function updatePoolActor(state, actor, table, dt, actorIndex, actorCount, ballsMoving) {
  const game = ensurePoolGame(state, table);
  actor.carrying = 'cue_stick';
  actor.poolShotCooldown = Math.max(0, Number(actor.poolShotCooldown || 0) - dt);
  actor.path = [];
  actor.target = null;
  actor.pending = null;
  actor.moveAllowId = '';
  const shooter = actorIndex === game.turnIndex;

  if (!shooter) {
    const wait = waitingStation(table, actorIndex, actorCount, game.turnIndex);
    const arrived = moveActorToStableStation(actor, wait, table, 'Pool: moving to waiting position', dt);
    if (arrived) {
      actor.pose = 'stand';
      actor.action = 'Pool: watching opponent';
      actor.vx = 0;
      actor.vy = 0;
      facePoint(actor, tableCenter(table));
    }
    return;
  }

  if (ballsMoving) {
    actor.poolRoute = null;
    actor.pose = 'pool';
    actor.action = 'Pool: watching balls';
    actor.vx = 0;
    actor.vy = 0;
    return;
  }

  const cue = cueBall(game, table);
  const target = chooseTargetBall(game, table);
  if (!target) {
    resetRack(game, table);
    game.turnStance = null;
    actor.poolRoute = null;
    return;
  }

  if (!game.turnStance || game.turnStance.serial !== game.turnSerial || game.turnStance.actorId !== actor.id) {
    game.turnStance = {
      ...shotStance(table, cue, target, actorIndex, actorCount),
      serial: game.turnSerial,
      actorId: actor.id,
      cueId: cue.id,
      targetId: target.id
    };
  }

  const stance = game.turnStance;
  const arrived = moveActorToStableStation(actor, stance, table, 'Pool: circling table', dt);
  if (!arrived) return;

  actor.x = stance.x;
  actor.y = stance.y;
  actor.vx = 0;
  actor.vy = 0;
  actor.pose = 'pool';
  actor.action = 'Pool: lining up shot';
  facePoint(actor, cue);
  if (actor.poolShotCooldown > 0) return;

  takePoolShot(game, table, actor, cue, target);
  actor.poolShotCooldown = SHOT_COOLDOWN;
  game.message = `${actor.name} shoots`;
  game.messageT = 1.2;
  game.turnIndex = actorCount > 1 ? (game.turnIndex + 1) % actorCount : 0;
  game.turnSerial = (game.turnSerial || 0) + 1;
  game.turnStance = null;
  actor.poolRoute = null;
}

function moveActorToStableStation(actor, station, table, label, dt) {
  const distance = Math.hypot(actor.x - station.x, actor.y - station.y);
  if (distance <= ARRIVAL_RADIUS) {
    actor.poolRoute = null;
    actor.x = station.x;
    actor.y = station.y;
    actor.vx = 0;
    actor.vy = 0;
    return true;
  }

  const routeKey = `${Math.round(station.x)}:${Math.round(station.y)}`;
  if (!actor.poolRoute || actor.poolRoute.key !== routeKey || !actor.poolRoute.points?.length) {
    actor.poolRoute = { key: routeKey, points: pathAroundTable({ x: actor.x, y: actor.y }, station, table) };
  }

  const arrived = stepPoolRoute(actor, dt, POOL_WALK_SPEED);
  actor.action = label;
  actor.pose = arrived ? 'stand' : 'walk';
  actor.speed = POOL_WALK_SPEED;
  return arrived;
}

function stepPoolRoute(actor, dt, speed) {
  const route = actor.poolRoute;
  if (!route?.points?.length) {
    actor.poolRoute = null;
    actor.vx = 0;
    actor.vy = 0;
    return true;
  }

  let remaining = Math.max(0, speed * dt);
  let moved = false;
  while (remaining > 0 && route.points.length) {
    const point = route.points[0];
    const deltaX = point.x - actor.x;
    const deltaY = point.y - actor.y;
    const distance = Math.hypot(deltaX, deltaY);
    if (distance <= Math.max(.01, remaining)) {
      actor.x = point.x;
      actor.y = point.y;
      route.points.shift();
      remaining -= distance;
      moved = moved || distance > .01;
      if (distance > .01) setPoolMotion(actor, deltaX / distance, deltaY / distance, speed);
      continue;
    }
    const normalX = deltaX / distance;
    const normalY = deltaY / distance;
    actor.x += normalX * remaining;
    actor.y += normalY * remaining;
    setPoolMotion(actor, normalX, normalY, speed);
    remaining = 0;
    moved = true;
  }

  if (!route.points.length) {
    actor.poolRoute = null;
    actor.vx = 0;
    actor.vy = 0;
    return true;
  }
  if (!moved) {
    actor.vx = 0;
    actor.vy = 0;
  }
  return false;
}

function setPoolMotion(actor, normalX, normalY, speed) {
  actor.vx = normalX * speed;
  actor.vy = normalY * speed;
  actor.lastHeading = Math.atan2(normalY, normalX) + Math.PI / 2;
  actor.spriteDirection = Math.abs(normalX) >= Math.abs(normalY) ? (normalX < 0 ? 'west' : 'east') : (normalY < 0 ? 'north' : 'south');
}

function waitingStation(table, actorIndex, actorCount, turnIndex) {
  const side = (actorIndex + turnIndex + 2) % 4;
  const stations = [
    { x: table.x + table.w / 2, y: table.y - TABLE_MARGIN_Y - 18 },
    { x: table.x + table.w + TABLE_MARGIN_X + 18, y: table.y + table.h / 2 },
    { x: table.x + table.w / 2, y: table.y + table.h + TABLE_MARGIN_Y + 18 },
    { x: table.x - TABLE_MARGIN_X - 18, y: table.y + table.h / 2 }
  ];
  const offset = actorCount > 2 ? (actorIndex - (actorCount - 1) / 2) * 18 : 0;
  const point = { ...stations[side] };
  if (side % 2 === 0) point.x += offset;
  else point.y += offset;
  return point;
}

function cueBall(game, table) {
  let cue = game.balls.find(ball => ball.id === 'cue');
  if (!cue) {
    cue = { id: 'cue', x: table.x + 72, y: table.y + table.h / 2, vx: 0, vy: 0, fill: '#f8fbff' };
    game.balls.unshift(cue);
  }
  cue.pocketed = false;
  return cue;
}

function chooseTargetBall(game, table) {
  const cue = cueBall(game, table);
  const live = game.balls.filter(ball => ball.id !== 'cue' && !ball.pocketed);
  if (!live.length) return null;
  return live.map(ball => ({ ball, distance: Math.hypot(ball.x - cue.x, ball.y - cue.y) })).sort((a, b) => a.distance - b.distance)[0].ball;
}

function shotStance(table, cue, target, actorIndex = 0, actorCount = 1) {
  const aim = unit(target.x - cue.x, target.y - cue.y);
  const back = { x: -aim.x, y: -aim.y };
  const preferred = dominantSide(back);
  const offset = actorCount > 1 ? (actorIndex - (actorCount - 1) / 2) * 22 : 0;
  if (preferred === 'west') return clampToSide({ x: table.x - TABLE_MARGIN_X, y: cue.y + offset }, table, 'west');
  if (preferred === 'east') return clampToSide({ x: table.x + table.w + TABLE_MARGIN_X, y: cue.y + offset }, table, 'east');
  if (preferred === 'north') return clampToSide({ x: cue.x + offset, y: table.y - TABLE_MARGIN_Y }, table, 'north');
  return clampToSide({ x: cue.x + offset, y: table.y + table.h + TABLE_MARGIN_Y }, table, 'south');
}

function dominantSide(vector) {
  if (Math.abs(vector.x) >= Math.abs(vector.y)) return vector.x < 0 ? 'west' : 'east';
  return vector.y < 0 ? 'north' : 'south';
}

function sideOfPoint(point, table) {
  const distances = [
    ['west', Math.abs(point.x - (table.x - TABLE_MARGIN_X))],
    ['east', Math.abs(point.x - (table.x + table.w + TABLE_MARGIN_X))],
    ['north', Math.abs(point.y - (table.y - TABLE_MARGIN_Y))],
    ['south', Math.abs(point.y - (table.y + table.h + TABLE_MARGIN_Y))]
  ];
  return distances.sort((a, b) => a[1] - b[1])[0][0];
}

function clampToSide(point, table, side) {
  const minimumY = table.y - TABLE_MARGIN_Y;
  const maximumY = table.y + table.h + TABLE_MARGIN_Y;
  const minimumX = table.x - TABLE_MARGIN_X;
  const maximumX = table.x + table.w + TABLE_MARGIN_X;
  if (side === 'west') return { x: table.x - TABLE_MARGIN_X, y: clamp(point.y, minimumY, maximumY) };
  if (side === 'east') return { x: table.x + table.w + TABLE_MARGIN_X, y: clamp(point.y, minimumY, maximumY) };
  if (side === 'north') return { x: clamp(point.x, minimumX, maximumX), y: table.y - TABLE_MARGIN_Y };
  return { x: clamp(point.x, minimumX, maximumX), y: table.y + table.h + TABLE_MARGIN_Y };
}

function pathAroundTable(from, to, table) {
  const fromSide = sideOfPoint(from, table);
  const toSide = sideOfPoint(to, table);
  if (fromSide === toSide) return [to];
  const corners = [
    { id: 'nw', x: table.x - TABLE_MARGIN_X, y: table.y - TABLE_MARGIN_Y },
    { id: 'ne', x: table.x + table.w + TABLE_MARGIN_X, y: table.y - TABLE_MARGIN_Y },
    { id: 'se', x: table.x + table.w + TABLE_MARGIN_X, y: table.y + table.h + TABLE_MARGIN_Y },
    { id: 'sw', x: table.x - TABLE_MARGIN_X, y: table.y + table.h + TABLE_MARGIN_Y }
  ];
  const sideCorners = { north: [corners[0], corners[1]], east: [corners[1], corners[2]], south: [corners[2], corners[3]], west: [corners[3], corners[0]] };
  let best = [to];
  let bestLength = Infinity;
  for (const start of sideCorners[fromSide]) {
    for (const end of sideCorners[toSide]) {
      for (const direction of [-1, 1]) {
        const path = [...cornerRoute(corners, start, end, direction), to];
        const length = pathLength(from, path);
        if (length < bestLength) {
          best = path;
          bestLength = length;
        }
      }
    }
  }
  return dedupeRoute(best);
}

function cornerRoute(corners, start, end, direction) {
  const route = [];
  let index = corners.findIndex(corner => corner.id === start.id);
  const endIndex = corners.findIndex(corner => corner.id === end.id);
  route.push(corners[index]);
  while (index !== endIndex) {
    index = (index + direction + corners.length) % corners.length;
    route.push(corners[index]);
  }
  return route;
}

function dedupeRoute(route) {
  const output = [];
  for (const point of route) {
    const previous = output[output.length - 1];
    if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) > .5) output.push({ x: point.x, y: point.y });
  }
  return output;
}

function pathLength(from, path) {
  let total = 0;
  let previous = from;
  for (const point of path) {
    total += Math.hypot(point.x - previous.x, point.y - previous.y);
    previous = point;
  }
  return total;
}

function takePoolShot(game, table, actor, cue, target) {
  const pocket = bestPocketFor(game, target);
  const cueToTarget = unit(target.x - cue.x, target.y - cue.y);
  const targetToPocket = unit(pocket.x - target.x, pocket.y - target.y);
  game.shotNumber = (game.shotNumber || 0) + 1;
  game.cueLine = { x1: cue.x, y1: cue.y, x2: target.x, y2: target.y, t: 1.2 };
  game.cueThrust = { x1: actor.x, y1: actor.y, x2: cue.x, y2: cue.y, t: .45 };
  cue.vx = cueToTarget.x * 66;
  cue.vy = cueToTarget.y * 66;
  target.vx = targetToPocket.x * (92 + Math.min(35, game.shotNumber * 3));
  target.vy = targetToPocket.y * (92 + Math.min(35, game.shotNumber * 3));
  actor.action = 'Pool: taking shot';
  actor.pose = 'pool';
}

function updatePoolBallPhysics(state, dt, table) {
  const game = state.poolGame;
  if (!game?.balls) return;
  for (const key of ['cueLine', 'cueThrust']) if (game[key]?.t > 0) game[key].t = Math.max(0, game[key].t - dt);
  if (game.messageT > 0) game.messageT = Math.max(0, game.messageT - dt);
  const pockets = game.pockets || pocketsFor(table);
  game.pockets = pockets;
  for (const ball of game.balls) {
    if (ball.pocketed) continue;
    ball.x += Number(ball.vx || 0) * dt;
    ball.y += Number(ball.vy || 0) * dt;
    ball.vx = Number(ball.vx || 0) * Math.pow(.965, dt * 60);
    ball.vy = Number(ball.vy || 0) * Math.pow(.965, dt * 60);
    if (Math.abs(ball.vx) < .3) ball.vx = 0;
    if (Math.abs(ball.vy) < .3) ball.vy = 0;
    if (ball.id !== 'cue') {
      const pocket = pockets.find(candidate => Math.hypot(ball.x - candidate.x, ball.y - candidate.y) < 15);
      if (pocket) {
        ball.pocketed = true;
        ball.vx = 0;
        ball.vy = 0;
        continue;
      }
    }
    if (ball.x < table.x + BALL_RADIUS || ball.x > table.x + table.w - BALL_RADIUS) {
      ball.vx *= -.55;
      ball.x = clamp(ball.x, table.x + BALL_RADIUS, table.x + table.w - BALL_RADIUS);
    }
    if (ball.y < table.y + BALL_RADIUS || ball.y > table.y + table.h - BALL_RADIUS) {
      ball.vy *= -.55;
      ball.y = clamp(ball.y, table.y + BALL_RADIUS, table.y + table.h - BALL_RADIUS);
    }
  }
  if (!game.balls.some(ball => ball.id !== 'cue' && !ball.pocketed)) resetRack(game, table);
}

function resetRack(game, table) {
  const centerY = table.y + table.h / 2;
  const rack = [
    ['one', 1, table.x + table.w - 78, centerY, '#f1c66a'],
    ['two', 2, table.x + table.w - 55, centerY - 14, '#74e6ff'],
    ['three', 3, table.x + table.w - 55, centerY + 14, '#ff75df'],
    ['four', 4, table.x + table.w - 32, centerY, '#b66d55']
  ];
  for (const [id, value, x, y, fill] of rack) {
    let ball = game.balls.find(candidate => candidate.id === id);
    if (!ball) {
      ball = { id, value, fill };
      game.balls.push(ball);
    }
    Object.assign(ball, { x, y, vx: 0, vy: 0, pocketed: false, value, fill });
  }
  Object.assign(cueBall(game, table), { x: table.x + 72, y: centerY, vx: 0, vy: 0, pocketed: false });
  game.turnStance = null;
  game.turnSerial = (game.turnSerial || 0) + 1;
}

function bestPocketFor(game, target) {
  return (game.pockets || []).map(pocket => ({ pocket, distance: Math.hypot(pocket.x - target.x, pocket.y - target.y) })).sort((a, b) => a.distance - b.distance)[0]?.pocket || { x: target.x + 40, y: target.y };
}

function pocketsFor(table) {
  return [
    { x: table.x + 7, y: table.y + 7 }, { x: table.x + table.w / 2, y: table.y + 5 }, { x: table.x + table.w - 7, y: table.y + 7 },
    { x: table.x + 7, y: table.y + table.h - 7 }, { x: table.x + table.w / 2, y: table.y + table.h - 5 }, { x: table.x + table.w - 7, y: table.y + table.h - 7 }
  ];
}

function facePoint(actor, point) {
  actor.lastHeading = Math.atan2(point.y - actor.y, point.x - actor.x) + Math.PI / 2;
  const deltaX = point.x - actor.x;
  const deltaY = point.y - actor.y;
  actor.spriteDirection = Math.abs(deltaX) >= Math.abs(deltaY) ? (deltaX < 0 ? 'west' : 'east') : (deltaY < 0 ? 'north' : 'south');
}

function tableCenter(table) { return { x: table.x + table.w / 2, y: table.y + table.h / 2 }; }
function unit(x, y) { const magnitude = Math.max(.001, Math.hypot(x, y)); return { x: x / magnitude, y: y / magnitude }; }
function clamp(value, minimum, maximum) { return Math.max(minimum, Math.min(maximum, value)); }
