import { commandMove } from './movement.js';
import { byId, changeNeed, log, say, setMood } from './state.js';

export function startFetchThrow(state, actor, dog, x, y) {
  state.fetch = { phase: 'toBall', actorId: actor.id, dogId: dog.id, ball: { x, y, floor: actor.floor } };
  commandMove(dog, x, y);
  dog.action = 'Fetching ball';
  dog.pose = 'walk';
  say(dog, 'BALL');
  log(state, 'Ball thrown. The dog is fetching it.');
  return true;
}

export function updateFetch(state) {
  if (!state.fetch || !state.fetch.phase) return;
  const dog = byId(state, state.fetch.dogId);
  const actor = byId(state, state.fetch.actorId);
  if (!dog || !actor) return;

  if (state.fetch.phase === 'toBall' && !dog.path.length) {
    state.fetch.phase = 'returning';
    commandMove(dog, actor.x + 42, actor.y + 10);
    dog.action = 'Returning ball';
    dog.pose = 'walk';
    say(dog, 'GOT');
    return;
  }

  if (state.fetch.phase === 'returning' && !dog.path.length) {
    changeNeed(dog, 'fun', 18);
    changeNeed(actor, 'fun', 8);
    setMood(dog, 'dog');
    say(dog, 'WOOF');
    say(actor, 'GOOD');
    log(state, 'The dog brought the ball back.');
    state.fetch = null;
  }
}
