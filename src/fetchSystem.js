import { commandMove } from './movement.js';
import { byId, changeNeed, log, say, setMood } from './state.js';

const FETCH_FLIGHT_SECONDS = 0.35;
const FETCH_REACH_DISTANCE = 46;
const FETCH_RETURN_DISTANCE = 58;

export function startFetchThrow(state, actor, dog, x, y) {
  actor.carrying = null;
  actor.action = 'Throwing ball';
  actor.actionT = 0.6;
  actor.actionTotal = 0.6;
  actor.pose = 'throw';
  state.fetch = {
    phase: 'thrown',
    actorId: actor.id,
    dogId: dog.id,
    ball: { x: actor.x + 18, y: actor.y - 8, floor: actor.floor },
    target: { x, y, floor: actor.floor },
    t: FETCH_FLIGHT_SECONDS
  };
  say(actor, 'THROW');
  log(state, 'Ball thrown. The dog will chase it.');
  return true;
}

export function updateFetch(state, dt = 1 / 60) {
  if (!state.fetch || !state.fetch.phase) return;
  const dog = byId(state, state.fetch.dogId);
  const actor = byId(state, state.fetch.actorId);
  if (!dog || !actor) {
    state.fetch = null;
    return;
  }

  const elapsed = Number.isFinite(dt) && dt > 0 ? Math.min(dt, 0.25) : 1 / 60;

  if (state.fetch.phase === 'thrown') {
    state.fetch.t -= elapsed;
    const startX = actor.x + 18;
    const startY = actor.y - 8;
    const pct = Math.max(0, Math.min(1, 1 - state.fetch.t / FETCH_FLIGHT_SECONDS));
    state.fetch.ball.x = startX + (state.fetch.target.x - startX) * pct;
    state.fetch.ball.y = startY + (state.fetch.target.y - startY) * pct;
    if (state.fetch.t <= 0) {
      state.fetch.ball.x = state.fetch.target.x;
      state.fetch.ball.y = state.fetch.target.y;
      state.fetch.phase = 'toBall';
      commandMove(dog, state.fetch.target.x, state.fetch.target.y);
      dog.action = 'Fetching ball';
      dog.pose = dog.path.length ? 'walk' : 'stand';
      say(dog, 'BALL');
      if (!dog.path.length && distanceTo(dog, state.fetch.target) > FETCH_REACH_DISTANCE) cancelFetch(state, actor, dog, 'The dog could not reach the ball.');
    }
    return;
  }

  if (state.fetch.phase === 'toBall' && !dog.path.length) {
    if (distanceTo(dog, state.fetch.target) > FETCH_REACH_DISTANCE) {
      cancelFetch(state, actor, dog, 'The dog lost the route to the ball.');
      return;
    }
    state.fetch.phase = 'returning';
    state.fetch.ball = { x: dog.x + 18, y: dog.y - 8, floor: dog.floor };
    dog.carrying = 'ball';
    commandMove(dog, actor.x + 42, actor.y + 10);
    dog.action = 'Returning ball';
    dog.pose = dog.path.length ? 'walk' : 'stand';
    say(dog, 'GOT');
    if (!dog.path.length && distanceTo(dog, actor) > FETCH_RETURN_DISTANCE) cancelFetch(state, actor, dog, 'The dog could not find a route back.');
    return;
  }

  if (state.fetch.phase === 'returning') state.fetch.ball = { x: dog.x + 18, y: dog.y - 8, floor: dog.floor };

  if (state.fetch.phase === 'returning' && !dog.path.length) {
    if (distanceTo(dog, actor) > FETCH_RETURN_DISTANCE) {
      cancelFetch(state, actor, dog, 'The dog stopped before bringing the ball back.');
      return;
    }
    changeNeed(dog, 'fun', 18);
    changeNeed(actor, 'fun', 8);
    setMood(dog, 'dog');
    dog.carrying = null;
    dog.action = 'Idle';
    dog.pose = 'stand';
    say(dog, 'WOOF');
    say(actor, 'GOOD');
    log(state, 'The dog brought the ball back.');
    state.fetch = null;
  }
}

function distanceTo(a, b) {
  return Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.y ?? 0) - (b?.y ?? 0));
}

function cancelFetch(state, actor, dog, reason) {
  dog.path = [];
  dog.target = null;
  dog.pending = null;
  dog.carrying = null;
  dog.action = 'Idle';
  dog.pose = 'stand';
  say(dog, '?');
  say(actor, 'NO');
  log(state, reason);
  state.fetch = null;
}
