import { commandMove } from './movement.js';
import { byId, changeNeed, log, say, setMood } from './state.js';

export function startFetchThrow(state, actor, dog, x, y) {
  actor.carrying = null;
  actor.action = 'Throwing ball';
  actor.actionT = 0.6;
  actor.actionTotal = 0.6;
  actor.pose = 'throw';
  state.fetch = { phase: 'thrown', actorId: actor.id, dogId: dog.id, ball: { x: actor.x + 18, y: actor.y - 8, floor: actor.floor }, target: { x, y }, t: 0.35 };
  say(actor, 'THROW');
  log(state, 'Ball thrown. The dog will chase it.');
  return true;
}

export function updateFetch(state) {
  if (!state.fetch || !state.fetch.phase) return;
  const dog = byId(state, state.fetch.dogId);
  const actor = byId(state, state.fetch.actorId);
  if (!dog || !actor) return;

  if (state.fetch.phase === 'thrown') {
    state.fetch.t -= 0.016;
    const startX = actor.x + 18;
    const startY = actor.y - 8;
    const pct = Math.max(0, Math.min(1, 1 - state.fetch.t / 0.35));
    state.fetch.ball.x = startX + (state.fetch.target.x - startX) * pct;
    state.fetch.ball.y = startY + (state.fetch.target.y - startY) * pct;
    if (state.fetch.t <= 0) {
      state.fetch.phase = 'toBall';
      commandMove(dog, state.fetch.target.x, state.fetch.target.y);
      dog.action = 'Fetching ball';
      dog.pose = 'walk';
      say(dog, 'BALL');
    }
    return;
  }

  if (state.fetch.phase === 'toBall' && !dog.path.length) {
    state.fetch.phase = 'returning';
    state.fetch.ball = { x: dog.x + 18, y: dog.y - 8, floor: dog.floor };
    dog.carrying = 'ball';
    commandMove(dog, actor.x + 42, actor.y + 10);
    dog.action = 'Returning ball';
    dog.pose = 'walk';
    say(dog, 'GOT');
    return;
  }

  if (state.fetch.phase === 'returning') state.fetch.ball = { x: dog.x + 18, y: dog.y - 8, floor: dog.floor };

  if (state.fetch.phase === 'returning' && !dog.path.length) {
    changeNeed(dog, 'fun', 18);
    changeNeed(actor, 'fun', 8);
    setMood(dog, 'dog');
    dog.carrying = null;
    say(dog, 'WOOF');
    say(actor, 'GOOD');
    log(state, 'The dog brought the ball back.');
    state.fetch = null;
  }
}
