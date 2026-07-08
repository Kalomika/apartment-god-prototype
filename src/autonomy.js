import { startObjectAction, startSocialAction, startOffsite } from './actions.js';
import { byId, say, setMood } from './state.js';
import { getObject, roomAt } from './world.js';
import { commandMove } from './movement.js';

const HUMAN_IDLE_MIN = 3.5;
const DOG_IDLE_MIN = 3.2;
const RECENT_LIMIT = 7;

export function updateAutonomy(state, dt) {
  for (const e of state.entities) {
    if (e.hidden) continue;
    ensureBrain(e);
    if (e.stopped || e.path.length || e.target || e.pending || e.actionT > 0) continue;
    e.idleT += dt;
    drainNeeds(e, dt);
  }

  if (state.autonomyMode === 'manual') return;

  const resident = byId(state, 'resident');
  const girlfriend = byId(state, 'girlfriend');
  const dog = byId(state, 'dog');

  if (resident && readyForDecision(resident, HUMAN_IDLE_MIN)) driveHuman(state, resident, girlfriend);
  if (girlfriend && readyForDecision(girlfriend, HUMAN_IDLE_MIN + .6)) driveHuman(state, girlfriend, resident);
  if (dog && readyForDecision(dog, DOG_IDLE_MIN)) driveDog(state, dog);
}

function ensureBrain(e) {
  e.brain ??= {};
  e.brain.recentActions = Array.isArray(e.brain.recentActions) ? e.brain.recentActions.slice(-RECENT_LIMIT) : [];
  e.brain.recentObjects = Array.isArray(e.brain.recentObjects) ? e.brain.recentObjects.slice(-RECENT_LIMIT) : [];
  e.brain.lastDecisionAt = Number.isFinite(e.brain.lastDecisionAt) ? e.brain.lastDecisionAt : 0;
}

function readyForDecision(e, threshold) {
  return !e.hidden && !e.stopped && !e.path.length && !e.target && !e.pending && e.actionT <= 0 && e.idleT >= threshold;
}

function drainNeeds(e, dt) {
  if (!e.needs) return;
  const awakeDrain = String(e.pose || '') === 'sleep' ? .35 : 1;
  e.needs.hunger = Math.max(0, e.needs.hunger - dt * .32 * awakeDrain);
  e.needs.bladder = Math.max(0, e.needs.bladder - dt * .26 * awakeDrain);
  e.needs.energy = Math.max(0, e.needs.energy - dt * .16 * awakeDrain);
  e.needs.fun = Math.max(0, e.needs.fun - dt * .12 * awakeDrain);
  e.needs.social = Math.max(0, e.needs.social - dt * .08 * awakeDrain);
  e.needs.freshness = Math.max(0, e.needs.freshness - dt * .1 * awakeDrain);
  e.needs.stamina = Math.max(0, e.needs.stamina - dt * .12 * awakeDrain);
  if (e.needs.hunger < 25) setMood(e, 'hungry');
  if (e.needs.freshness < 25) setMood(e, 'stinky');
  if (e.needs.energy < 20) setMood(e, 'tired');
}

function driveHuman(state, actor, partner) {
  actor.idleT = 0;
  ensureBrain(actor);

  const hour = gameHour(state);
  const urgent = urgentNeed(actor);
  if (urgent && satisfyNeed(state, actor, urgent, partner)) return;

  if (shouldSleep(state, actor, partner, hour) && trySleepRoutine(state, actor, partner)) return;

  if (hour >= 6 && hour <= 10) {
    if ((actor.needs.bladder ?? 100) < 72 && satisfyNeed(state, actor, 'bladder', partner)) return;
    if ((actor.needs.freshness ?? 100) < 66 && satisfyNeed(state, actor, 'freshness', partner)) return;
    if ((actor.needs.hunger ?? 100) < 58 && satisfyNeed(state, actor, 'hunger', partner)) return;
  }

  if ((actor.needs.social ?? 100) < 52 && trySocial(state, actor, partner)) return;
  if ((actor.needs.fun ?? 100) < 72 && tryFunActivity(state, actor, partner)) return;
  if ((actor.needs.stamina ?? 100) < 45 && tryExerciseOrRest(state, actor)) return;

  if (tryTraitWeightedActivity(state, actor, partner)) return;
  if (tryUsefulIdle(state, actor, partner)) return;
  smartWander(actor);
}

function urgentNeed(actor) {
  const needs = actor.needs || {};
  const priorities = [
    ['bladder', needs.bladder ?? 100, 42],
    ['hunger', needs.hunger ?? 100, 44],
    ['freshness', needs.freshness ?? 100, 38],
    ['energy', needs.energy ?? 100, 34],
    ['social', needs.social ?? 100, 26],
    ['fun', needs.fun ?? 100, 28],
    ['stamina', needs.stamina ?? 100, 28]
  ];
  const urgent = priorities.filter(([, value, limit]) => value < limit).sort((a, b) => a[1] - b[1]);
  return urgent[0]?.[0] || '';
}

function satisfyNeed(state, actor, need, partner) {
  if (need === 'bladder') return tryAnyObject(state, actor, orderedByFloor(actor, [
    ['toilet', 'toilet'],
    ['toilet2', 'toilet']
  ]));
  if (need === 'hunger') return tryAnyObject(state, actor, [
    ['fridge', actor.needs?.hunger < 26 ? 'meal' : 'snack'],
    ['stove', 'meal']
  ]);
  if (need === 'freshness') return tryAnyObject(state, actor, orderedByFloor(actor, [
    ['shower', 'shower'],
    ['shower2', 'shower'],
    ['sink', 'groom']
  ]));
  if (need === 'energy') return tryAnyObject(state, actor, orderedByFloor(actor, [
    ['bed', 'sleep'],
    ['couch', 'nap'],
    ['basement_couch', 'nap']
  ]));
  if (need === 'social') return trySocial(state, actor, partner);
  if (need === 'fun') return tryFunActivity(state, actor, partner);
  if (need === 'stamina') return tryExerciseOrRest(state, actor);
  return false;
}

function shouldSleep(state, actor, partner, hour) {
  const energy = actor.needs?.energy ?? 100;
  const stamina = actor.needs?.stamina ?? 100;
  const bedtime = hour >= 22 || hour <= 5;
  const partnerSleepy = partner && !partner.hidden && (partner.needs?.energy ?? 100) < 55;
  return bedtime && (energy < 78 || stamina < 62 || partnerSleepy);
}

function trySleepRoutine(state, actor, partner) {
  if (partner && !partner.hidden && partner.floor === actor.floor && (partner.needs?.energy ?? 100) < 72 && !isBusy(partner)) {
    if (actor.id === 'girlfriend') say(actor, 'sleep?');
    if (tryAnyObject(state, actor, [['bed', 'bed_together']])) return true;
  }
  return tryAnyObject(state, actor, [['bed', 'sleep'], ['couch', 'nap'], ['basement_couch', 'nap']]);
}

function trySocial(state, actor, partner) {
  if (!partner || partner.hidden || partner.type !== 'person' || isBusy(partner)) return false;
  if (actor.floor !== partner.floor) {
    if ((actor.needs.social ?? 100) < 30 && Math.random() < .45) return moveNearPerson(actor, partner);
    return false;
  }
  const actions = rotateChoices(actor, [
    ['talk', 1], ['hands', .85], ['kiss', .75], ['cuddle', .7], ['tickle', .35]
  ]);
  for (const [socialId] of actions) {
    if (trySocialAction(state, actor, partner, socialId)) return true;
  }
  return false;
}

function tryFunActivity(state, actor, partner) {
  const togetherOk = partner && !partner.hidden && partner.type === 'person' && partner.floor === actor.floor && !isBusy(partner);
  const choices = [
    ['tv', togetherOk ? 'watch_together' : randomTvAction(actor)],
    ['couch', togetherOk && Math.random() < .45 ? 'watch_together' : 'relax'],
    ['desk', deskAction(actor)],
    ['game_console', togetherOk ? 'console_together' : 'console_game'],
    ['arcade_machine', togetherOk ? 'arcade_together' : 'arcade'],
    ['pool_table', togetherOk ? 'pool_together' : 'pool_solo'],
    ['dartboard', togetherOk ? 'darts_together' : 'darts'],
    ['swim_pool', togetherOk ? 'swim_together' : 'swim'],
    ['soccer_field', 'soccer_practice'],
    ['treadmill', 'treadmill'],
    ['weight_bench', 'lift_weights'],
    ['heavy_bag', 'heavy_bag']
  ];
  return tryAnyObject(state, actor, rotateObjectChoices(actor, choices));
}

function tryExerciseOrRest(state, actor) {
  if ((actor.needs.energy ?? 100) < 34) return satisfyNeed(state, actor, 'energy');
  return tryAnyObject(state, actor, rotateObjectChoices(actor, [
    ['treadmill', 'treadmill'],
    ['weight_bench', 'lift_weights'],
    ['heavy_bag', 'heavy_bag'],
    ['swim_pool', 'swim'],
    ['soccer_field', 'soccer_practice'],
    ['couch', 'relax']
  ]));
}

function tryTraitWeightedActivity(state, actor, partner) {
  const traits = actor.traits || [];
  const choices = [];
  if (traits.includes('creative')) choices.push(['desk', 'desk_work'], ['tv', 'comedy']);
  if (traits.includes('active')) choices.push(['treadmill', 'treadmill'], ['weight_bench', 'lift_weights'], ['soccer_field', 'soccer_practice']);
  if (traits.includes('playful')) choices.push(['arcade_machine', 'arcade'], ['game_console', 'console_game'], ['dartboard', 'darts']);
  if (traits.includes('social') && partner) {
    if (trySocial(state, actor, partner)) return true;
  }
  if (!choices.length) return false;
  return tryAnyObject(state, actor, rotateObjectChoices(actor, choices));
}

function tryUsefulIdle(state, actor, partner) {
  if (trySocial(state, actor, partner)) return true;
  return tryAnyObject(state, actor, rotateObjectChoices(actor, [
    ['tv', randomTvAction(actor)],
    ['desk', deskAction(actor)],
    ['couch', 'relax'],
    ['game_console', 'console_game'],
    ['pool_table', 'pool_solo'],
    ['arcade_machine', 'arcade'],
    ['dartboard', 'darts']
  ]));
}

function driveDog(state, dog) {
  dog.idleT = 0;
  ensureBrain(dog);

  if (dog.needs.hunger < 52 && tryAnyObject(state, dog, [['dog_bowl', 'feed_dog']])) return;
  if (dog.needs.energy < 44 && tryAnyObject(state, dog, [['kennel', 'dog_rest']])) return;

  const resident = byId(state, 'resident');
  const girlfriend = byId(state, 'girlfriend');
  const people = [resident, girlfriend].filter(p => p && !p.hidden && p.floor === dog.floor && !isBusy(p));
  if (people.length && Math.random() < .46) {
    const person = people[Math.floor(Math.random() * people.length)];
    say(dog, 'wo');
    setMood(dog, 'dog');
    if (moveNearPerson(dog, person)) return;
  }

  const dogChoices = rotateObjectChoices(dog, [
    ['dog_bowl', 'feed_dog'],
    ['kennel', 'dog_rest'],
    ['soccer_field', 'soccer_practice'],
    [dog.floor === 4 ? 'pet_flap_yard' : 'pet_flap_front', 'use_stairs']
  ]);

  for (const [objectId, actionId] of dogChoices) {
    if (objectId?.startsWith('pet_flap') && Math.random() > .28) continue;
    if (tryAnyObject(state, dog, [[objectId, actionId]])) return;
  }

  smartWander(dog);
}

function tryAnyObject(state, actor, choices) {
  for (const [objectId, actionId] of choices) {
    const obj = getObject(objectId);
    if (!obj) continue;
    if (objectBusy(state, obj.id, actor.id) && !allowsSharedObject(actionId)) continue;
    if (actor.type === 'dog' && !['dog_bowl', 'kennel', 'stairs', 'soccer_field'].includes(obj.kind)) continue;
    if (tryObjectAction(state, actor, obj, actionId)) return true;
  }
  return false;
}

function tryObjectAction(state, actor, obj, actionId) {
  const snapshot = movementSnapshot(actor);
  const ok = startObjectAction(state, actor, obj, actionId);
  const routed = ok && !noRoute(actor) && (actor.path.length || actor.target || actor.pending || actor.actionT > 0 || obj.kind === 'stairs');
  if (!routed) {
    restoreMovement(actor, snapshot);
    rememberFailure(actor, obj.id, actionId);
    return false;
  }
  rememberSuccess(actor, obj.id, actionId);
  return true;
}

function trySocialAction(state, actor, partner, socialId) {
  const snapshot = movementSnapshot(actor);
  const ok = startSocialAction(state, actor, partner, socialId);
  const routed = ok && !noRoute(actor) && (actor.path.length || actor.target || actor.actionT > 0);
  if (!routed) {
    restoreMovement(actor, snapshot);
    rememberFailure(actor, partner.id, socialId);
    return false;
  }
  rememberSuccess(actor, partner.id, socialId);
  return true;
}

function moveNearPerson(actor, person) {
  const offset = actor.x < person.x ? -54 : 54;
  commandMove(actor, person.x + offset, person.y + 10, false);
  if (!actor.path.length || noRoute(actor)) return false;
  actor.action = `Going to ${person.name}`;
  rememberSuccess(actor, person.id, 'approach_person');
  return true;
}

function movementSnapshot(actor) {
  return {
    path: [...(actor.path || [])],
    target: actor.target ? { ...actor.target } : null,
    pending: actor.pending ? { ...actor.pending } : null,
    action: actor.action,
    pose: actor.pose,
    stopped: actor.stopped,
    moveAllowId: actor.moveAllowId || '',
    recoveryCount: actor.recoveryCount || 0,
    blockedT: actor.blockedT || 0
  };
}

function restoreMovement(actor, snapshot) {
  actor.path = snapshot.path;
  actor.target = snapshot.target;
  actor.pending = snapshot.pending;
  actor.action = snapshot.action;
  actor.pose = snapshot.pose;
  actor.stopped = snapshot.stopped;
  actor.moveAllowId = snapshot.moveAllowId;
  actor.recoveryCount = snapshot.recoveryCount;
  actor.blockedT = snapshot.blockedT;
}

function noRoute(actor) {
  return String(actor.action || '').toLowerCase().includes('no route') || String(actor.action || '').toLowerCase().includes('blocked');
}

function objectBusy(state, objectId, actorId) {
  const obj = getObject(objectId);
  const label = String(obj?.label || '').toLowerCase();
  return state.entities.some(e => {
    if (!e || e.id === actorId || e.hidden) return false;
    if (e.target?.objectId === objectId || e.pending?.objectId === objectId) return true;
    if (e.actionT > 0 && label && String(e.action || '').toLowerCase().includes(label)) return true;
    return false;
  });
}

function allowsSharedObject(actionId) {
  return String(actionId || '').includes('together') || ['pool_together', 'console_together', 'arcade_together', 'darts_together', 'swim_together', 'soccer_match'].includes(actionId);
}

function isBusy(actor) {
  if (!actor || actor.hidden) return true;
  return Boolean(actor.path?.length || actor.target || actor.pending || actor.actionT > 0 || String(actor.action || '').toLowerCase().includes('shower') || String(actor.action || '').toLowerCase().includes('toilet'));
}

function orderedByFloor(actor, choices) {
  return [...choices].sort((a, b) => {
    const oa = getObject(a[0]);
    const ob = getObject(b[0]);
    const aSame = oa?.floor === actor.floor ? 0 : 1;
    const bSame = ob?.floor === actor.floor ? 0 : 1;
    return aSame - bSame;
  });
}

function rotateObjectChoices(actor, choices) {
  ensureBrain(actor);
  return [...choices].sort((a, b) => recentPenalty(actor, a[0], a[1]) - recentPenalty(actor, b[0], b[1]) + Math.random() * .45 - .225);
}

function rotateChoices(actor, choices) {
  ensureBrain(actor);
  return [...choices].sort((a, b) => (recentPenalty(actor, '', a[0]) - recentPenalty(actor, '', b[0])) + ((b[1] || 1) - (a[1] || 1)) * .15 + Math.random() * .35 - .175);
}

function recentPenalty(actor, objectId, actionId) {
  const recentActions = actor.brain?.recentActions || [];
  const recentObjects = actor.brain?.recentObjects || [];
  let penalty = 0;
  recentActions.forEach((id, index) => { if (id === actionId) penalty += (index + 1) * .7; });
  recentObjects.forEach((id, index) => { if (id === objectId) penalty += (index + 1) * .45; });
  return penalty;
}

function rememberSuccess(actor, objectId, actionId) {
  ensureBrain(actor);
  actor.brain.recentActions.push(actionId);
  actor.brain.recentObjects.push(objectId);
  actor.brain.recentActions = actor.brain.recentActions.slice(-RECENT_LIMIT);
  actor.brain.recentObjects = actor.brain.recentObjects.slice(-RECENT_LIMIT);
}

function rememberFailure(actor, objectId, actionId) {
  ensureBrain(actor);
  actor.brain.failed ??= [];
  actor.brain.failed.push({ objectId, actionId, t: Date.now() });
  actor.brain.failed = actor.brain.failed.slice(-12);
}

function randomTvAction(actor) {
  return rotateByRecent(actor, ['watch_tv', 'comedy', 'horror', 'sports']);
}

function deskAction(actor) {
  return rotateByRecent(actor, ['desk_work', 'play_game', 'phone']);
}

function rotateByRecent(actor, values) {
  ensureBrain(actor);
  const sorted = [...values].sort((a, b) => recentPenalty(actor, '', a) - recentPenalty(actor, '', b) + Math.random() * .3 - .15);
  return sorted[0];
}

function gameHour(state) {
  return Math.floor(((state.time || 0) / 60) % 24);
}

function smartWander(actor) {
  const room = roomAt(actor.x, actor.y, actor.floor);
  const safeRooms = {
    0: ['living', 'kitchen', 'entry', 'stairs'],
    1: ['bedroom', 'office', 'hall', 'stairs2'],
    2: ['basement'],
    3: ['garage'],
    4: actor.type === 'dog' ? ['yard', 'kennel_area'] : ['yard', 'pool_area']
  }[actor.floor] || [];
  const currentAllowed = room && safeRooms.includes(room.id) && room.id !== 'front_porch';
  const targetRoomId = currentAllowed ? room.id : safeRooms[0];
  const targetRoom = room && currentAllowed ? room : null;
  const fallback = targetRoom || { x: 120, y: 120, w: 280, h: 180 };
  const x = fallback.x + fallback.w * (.25 + Math.random() * .5);
  const y = fallback.y + fallback.h * (.25 + Math.random() * .5);
  commandMove(actor, x, y, false);
  if (!actor.path.length) {
    actor.action = 'Thinking';
    actor.pose = 'stand';
  } else {
    actor.action = targetRoomId ? `Wandering ${targetRoomId}` : 'Wandering';
  }
}
