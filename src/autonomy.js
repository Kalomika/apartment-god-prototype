import { startObjectAction, startSocialAction, startOffsite } from './actions.js';
import { byId, say, setMood } from './state.js';
import { getObject } from './world.js';
import { commandMove } from './movement.js';

export function updateAutonomy(state, dt) {
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
  if (girlfriend && girlfriend.idleT > 6) drivePerson(state, girlfriend, resident);
  if (dog && dog.idleT > 5) driveDog(state, dog);
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
  if (e.needs.bladder < 28) return startObjectAction(state, e, getObject(e.floor === 1 ? 'toilet2' : 'toilet'), 'toilet');
  if (e.needs.hunger < 35) return startObjectAction(state, e, getObject('fridge'), 'snack');
  if (e.needs.freshness < 32) return startObjectAction(state, e, getObject(e.floor === 1 ? 'shower2' : 'shower'), 'shower');
  if (e.needs.energy < 28) return startObjectAction(state, e, getObject(e.floor === 1 ? 'bed' : 'couch'), e.floor === 1 ? 'sleep' : 'nap');
  if (e.needs.fun < 40) return startObjectAction(state, e, getObject('tv'), 'watch_tv');
  wander(e);
}

function drivePerson(state, g, resident) {
  g.idleT = 0;
  if (resident && resident.needs.freshness < 24 && g.floor === resident.floor && Math.random() < .35) { say(g, 'SHOWER'); return; }
  if (g.needs.bladder < 30) return startObjectAction(state, g, getObject(g.floor === 1 ? 'toilet2' : 'toilet'), 'toilet');
  if (g.needs.hunger < 34) return startObjectAction(state, g, getObject('fridge'), Math.random() < .55 ? 'snack' : 'meal');
  if (g.needs.freshness < 34) return startObjectAction(state, g, getObject(g.floor === 1 ? 'shower2' : 'shower'), 'shower');
  if (g.needs.energy < 28) return startObjectAction(state, g, getObject('bed'), 'sleep');
  if (g.needs.social < 46 && resident && g.floor === resident.floor && Math.random() < .65) return startSocialAction(state, g, resident, 'talk');

  const hour = Math.floor((state.time || 0) / 60) % 24;
  if (hour >= 8 && hour <= 18 && Math.random() < .035) return startOffsite(state, g, 'work', []);

  const options = [
    () => startObjectAction(state, g, getObject('tv'), Math.random() < .35 ? 'comedy' : 'watch_tv'),
    () => startObjectAction(state, g, getObject('desk'), Math.random() < .5 ? 'desk_work' : 'phone'),
    () => startObjectAction(state, g, getObject('couch'), Math.random() < .5 ? 'relax' : 'nap'),
    () => startObjectAction(state, g, getObject('pool_table'), Math.random() < .5 ? 'pool_solo' : 'pool_together'),
    () => startObjectAction(state, g, getObject('arcade_machine'), 'arcade'),
    () => startObjectAction(state, g, getObject('game_console'), 'console_game'),
    () => startObjectAction(state, g, getObject('treadmill'), 'treadmill'),
    () => startObjectAction(state, g, getObject('weight_bench'), 'lift_weights'),
    () => startObjectAction(state, g, getObject('swim_pool'), 'swim'),
    () => startObjectAction(state, g, getObject('kennel'), 'call_dog_yard'),
    () => startOffsite(state, g, Math.random() < .5 ? 'errand' : 'mall', [])
  ];
  const pick = options[Math.floor(Math.random() * options.length)];
  pick();
}

function driveDog(state, dog) {
  dog.idleT = 0;
  if (dog.needs.hunger < 38) return startObjectAction(state, dog, getObject('dog_bowl'), 'feed_dog');
  if (dog.needs.energy < 35 && Math.random() < .45) return startObjectAction(state, dog, getObject('kennel'), 'dog_rest');
  if (Math.random() < .34) return startObjectAction(state, dog, getObject(dog.floor === 4 ? 'pet_flap_yard' : 'pet_flap_front'), 'use_stairs');
  if (Math.random() < .25) return startObjectAction(state, dog, getObject('kennel'), 'dog_rest');
  if (Math.random() < .5) { say(dog, 'wo'); setMood(dog, 'dog'); }
  wander(dog);
}

function wander(e) {
  const x = 90 + Math.random() * 760;
  const y = 80 + Math.random() * 540;
  commandMove(e, x, y, false);
}
