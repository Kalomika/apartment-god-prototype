import { startObjectAction, startSocialAction } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { byId, say, setMood } from './state.js';
import { getObject } from './world.js';
import { commandMove } from './movement.js';

export function updateAutonomy(state, dt) {
  updateAutoHooks(state, dt);
  for (const e of state.entities) {
    if (e.hidden || e.stopped || e.path.length || e.target || e.actionT > 0) continue;
    e.idleT += dt;
    drainNeeds(e, dt);
  }

  if (state.autonomyMode === 'manual') return;

  const resident = byId(state, 'resident');
  const girlfriend = byId(state, 'girlfriend');
  const dog = byId(state, 'dog');

  if (resident && resident.idleT > 5) driveResident(state, resident);
  if (girlfriend && girlfriend.idleT > 7) driveGirlfriend(state, girlfriend, resident);
  if (dog && dog.idleT > 6) driveDog(state, dog);
}

function drainNeeds(e, dt) {
  if (!e.needs) return;
  e.needs.hunger = Math.max(0, e.needs.hunger - dt * .32);
  e.needs.bladder = Math.max(0, e.needs.bladder - dt * .26);
  e.needs.energy = Math.max(0, e.needs.energy - dt * .16);
  e.needs.fun = Math.max(0, e.needs.fun - dt * .12);
  e.needs.social = Math.max(0, e.needs.social - dt * .08);
  e.needs.freshness = Math.max(0, e.needs.freshness - dt * .1);
  e.needs.stamina = Math.max(0, e.needs.stamina - dt * .12);
  if (e.needs.hunger < 25) setMood(e, 'hungry');
  if (e.needs.freshness < 25) setMood(e, 'stinky');
  if (e.needs.energy < 20) setMood(e, 'tired');
}

function driveResident(state, e) {
  e.idleT = 0;
  if (e.needs.bladder < 28) return startObjectAction(state, e, getObject('toilet'), 'toilet');
  if (e.needs.hunger < 35) return startObjectAction(state, e, getObject('fridge'), 'snack');
  if (e.needs.freshness < 32) return startObjectAction(state, e, getObject('shower'), 'shower');
  if (e.needs.energy < 28) return startObjectAction(state, e, getObject(e.floor === 1 ? 'bed' : 'couch'), e.floor === 1 ? 'sleep' : 'nap');
  if (e.needs.fun < 40) return startObjectAction(state, e, getObject('tv'), 'watch_tv');
  wander(e);
}

function driveGirlfriend(state, g, resident) {
  g.idleT = 0;
  if (resident && resident.needs.freshness < 28 && g.floor === resident.floor) { say(g, 'SHOWER'); return; }
  if (g.needs.hunger < 34) return startObjectAction(state, g, getObject('fridge'), 'snack');
  if (resident && g.needs.social < 45 && g.floor === resident.floor) return startSocialAction(state, g, resident, 'talk');
  if (Math.random() < .35 && resident && g.floor === resident.floor) { say(g, 'MOVIE?'); return startObjectAction(state, g, getObject('tv'), 'comedy'); }
  wander(g);
}

function driveDog(state, dog) {
  dog.idleT = 0;
  if (dog.needs.hunger < 38) return startObjectAction(state, dog, getObject('dog_bowl'), 'feed_dog');
  if (Math.random() < .5) { say(dog, 'wo'); setMood(dog, 'dog'); }
  wander(dog);
}

function wander(e) {
  const x = 90 + Math.random() * 760;
  const y = 80 + Math.random() * 540;
  commandMove(e, x, y, false);
}
