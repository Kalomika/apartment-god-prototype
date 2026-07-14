import { startObjectAction, startSocialAction, startOffsite } from './actions.js';
import { shouldAutoStartWork } from './careerSystem.js';
import { shouldAvoidActivityForNow } from './lifeQualitySystem.js';
import { byId, say, setMood } from './state.js';
import { getObject, objectsByKind, roomAt } from './world.js';
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

  if (shouldAutoStartWork(state, actor) && tryAutoWork(state, actor)) return;
  if (shouldSleep(state, actor, partner, hour) && trySleepRoutine(state, actor, partner)) return;

  if (hour >= 6 && hour <= 10) {
    if ((actor.needs.bladder ?? 100) < 72 && satisfyNeed(state, actor, 'bladder', partner)) return;
    if ((actor.needs.freshness ?? 100) < 66 && satisfyNeed(state, actor, 'freshness', partner)) return;
    if ((actor.needs.hunger ?? 100) < 58 && satisfyNeed(state, actor, 'hunger', partner)) return;
  }

  if ((actor.needs.social ?? 100) < 52 && trySocial(state, actor, partner)) return;
  if ((actor.needs.fun ?? 100) < 72 && tryFunActivity(state, actor, partner)) return;
  if ((actor.needs.stamina ?? 100) < 55 && tryRestForStamina(state, actor)) return;

  if (tryTraitWeightedActivity(state, actor, partner)) return;
  if (tryUsefulIdle(state, actor, partner)) return;
  smartWander(actor);
}

function tryAutoWork(state, actor) {
  const ok = startOffsite(state, actor, 'work', [], 'auto');
  if (!ok) return false;
  rememberSuccess(actor, 'career', 'work');
  return true;
}

function urgentNeed(actor) {
  const needs = actor.needs || {};
  const priorities = [
    ['bladder', needs.bladder ?? 100, 42],
    ['hunger', needs.hunger ?? 100, 44],
    ['freshness', needs.freshness ?? 100, 38],
    ['energy', needs.energy ?? 100, 34],
    ['stamina', needs.stamina ?? 100, 34],
    ['social', needs.social ?? 100, 26],
    ['fun', needs.fun ?? 100, 28]
  ];
  const urgent = priorities.filter(([, value, limit]) => value < limit).sort((a, b) => a[1] - b[1]);
  return urgent[0]?.[0] || '';
}

function satisfyNeed(state, actor, need, partner) {
  if (need === 'bladder') return tryAnyObject(state, actor, nearestToiletChoices(actor));
  if (need === 'hunger') return tryAnyObject(state, actor, [
    ['fridge', actor.needs?.hunger < 26 ? 'meal' : 'snack'],
    ['stove', 'meal'],
    ['dining_table', 'eat_meal']
  ]);
  if (need === 'freshness') return tryAnyObject(state, actor, nearestFreshnessChoices(actor));
  if (need === 'energy') return tryAnyObject(state, actor, orderedByFloor(actor, [
    ['bed', 'sleep'],
    ['couch', 'nap'],
    ['basement_couch', 'nap']
  ]));
  if (need === 'stamina') return tryRestForStamina(state, actor);
  if (need === 'social') return trySocial(state, actor, partner);
  if (need === 'fun') return tryFunActivity(state, actor, partner);
  return false;
}

function nearestToiletChoices(actor) {
  const actionId = actor.id === 'resident' && (actor.needs?.bladder ?? 100) >= 30 ? 'pee_stand' : 'toilet';
  return preferredBathroomObjects(actor, ['toilet']).map(obj => [obj.id, actionId]);
}

function nearestFreshnessChoices(actor) {
  return [
    ...preferredBathroomObjects(actor, ['shower', 'bathtub']).map(obj => [obj.id, 'shower']),
    ...preferredBathroomObjects(actor, ['sink']).map(obj => [obj.id, 'groom'])
  ];
}

function preferredBathroomObjects(actor, kinds) {
  const list = kinds.flatMap(kind => objectsByKind(kind));
  return list.sort((a, b) => objectRank(actor, a) - objectRank(actor, b));
}

function nearestObjects(actor, kinds) {
  const list = kinds.flatMap(kind => objectsByKind(kind));
  return list.sort((a, b) => objectRank(actor, a) - objectRank(actor, b));
}

function objectRank(actor, obj) {
  const floorPenalty = obj.floor === actor.floor ? 0 : 100000;
  const privateBathBonus = privateBathroomBonus(actor, obj);
  return floorPenalty + privateBathBonus + Math.hypot(actor.x - (obj.x + obj.w / 2), actor.y - (obj.y + obj.h / 2));
}

function privateBathroomBonus(actor, obj) {
  if (actor.floor === 1 && ['master_bath', 'suite_foyer'].includes(obj.room)) return -50000;
  if (actor.floor === 0 && obj.room === 'bath') return -5000;
  return 0;
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
  const stamina = actor.needs?.stamina ?? 100;
  const choices = [
    ['tv', togetherOk ? 'watch_together' : randomTvAction(actor)],
    ['couch', togetherOk && Math.random() < .45 ? 'watch_together' : 'relax'],
    ['desk', deskAction(actor)],
    ['bookshelf', Math.random() < .55 ? 'read' : 'study'],
    ['game_console', togetherOk ? 'console_together' : 'console_game'],
    ['arcade_machine', togetherOk ? 'arcade_together' : 'arcade'],
    ['pool_table', togetherOk ? 'pool_together' : 'pool_solo'],
    ['dartboard', togetherOk ? 'darts_together' : 'darts']
  ];
  if (stamina > 58) {
    choices.push(
      ['swim_pool', togetherOk ? 'swim_together' : 'swim'],
      ['soccer_field', 'soccer_practice'],
      ['treadmill', 'treadmill'],
      ['weight_bench', 'lift_weights'],
      ['heavy_bag', 'heavy_bag']
    );
  }
  return tryAnyObject(state, actor, rotateObjectChoices(actor, choices));
}

function tryRestForStamina(state, actor) {
  return tryAnyObject(state, actor, rotateObjectChoices(actor, orderedByFloor(actor, [
    ['couch', 'relax'],
    ['bed', 'nap'],
    ['basement_couch', 'relax'],
    ['dining_table', 'sit_table'],
    ['tv', 'watch_tv']
  ])));
}

function tryTraitWeightedActivity(state, actor, partner) {
  const choices = [];
  const stamina = actor.needs?.stamina ?? 100;
  if (hasTrait(actor, 'creative')) choices.push(['desk', 'desk_work'], ['bookshelf', 'study'], ['tv', 'comedy']);
  if (hasTrait(actor, 'active') && stamina > 60) choices.push(['treadmill', 'treadmill'], ['weight_bench', 'lift_weights'], ['heavy_bag', 'heavy_bag'], ['soccer_field', 'soccer_practice']);
  if (hasTrait(actor, 'playful')) choices.push(['arcade_machine', 'arcade'], ['game_console', 'console_game'], ['dartboard', 'darts']);
  if (hasTrait(actor, 'social') && partner) {
    if (trySocial(state, actor, partner)) return true;
  }
  if (!choices.length) return false;
  return tryAnyObject(state, actor, rotateObjectChoices(actor, choices));
}

function hasTrait(actor, trait) {
  const traits = actor?.traits;
  if (Array.isArray(traits)) return traits.includes(trait);
  if (traits && typeof traits === 'object') return Boolean(traits[trait]);
  return false;
}

function tryUsefulIdle(state, actor, partner) {
  if (trySocial(state, actor, partner)) return true;
  return tryAnyObject(state, actor, rotateObjectChoices(actor, [
    ['tv', randomTvAction(actor)],
    ['desk', deskAction(actor)],
    ['bookshelf', 'read'],
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

function tryAnyObject(state, actor, choices) { for (const [objectId, actionId] of choices) { const obj = getObject(objectId); if (!obj) continue; if (objectBusy(state, obj.id, actor.id) && !allowsSharedObject(actionId)) continue; if (actor.type === 'dog' && !['dog_bowl', 'kennel', 'stairs', 'soccer_field'].includes(obj.kind)) continue; if (tryObjectAction(state, actor, obj, actionId)) return true; } return false; }
function tryObjectAction(state, actor, obj, actionId) { if (shouldAvoidActivityForNow(state, actor, actionId)) { rememberFailure(actor, obj.id, actionId); return false; } const snapshot = movementSnapshot(actor); const ok = startObjectAction(state, actor, obj, actionId); const routed = ok && !noRoute(actor) && (actor.path.length || actor.target || actor.pending || actor.actionT > 0 || obj.kind === 'stairs'); if (!routed) { restoreMovement(actor, snapshot); rememberFailure(actor, obj.id, actionId); return false; } rememberSuccess(actor, obj.id, actionId); return true; }
function trySocialAction(state, actor, partner, socialId) { const snapshot = movementSnapshot(actor); const ok = startSocialAction(state, actor, partner, socialId); const routed = ok && !noRoute(actor) && (actor.path.length || actor.target || actor.actionT > 0); if (!routed) { restoreMovement(actor, snapshot); rememberFailure(actor, partner.id, socialId); return false; } rememberSuccess(actor, partner.id, socialId); return true; }
function moveNearPerson(actor, person) { const offset = actor.x < person.x ? -54 : 54; commandMove(actor, person.x + offset, person.y + 10, false); if (!actor.path.length || noRoute(actor)) return false; actor.action = `Going to ${person.name}`; rememberSuccess(actor, person.id, 'approach_person'); return true; }
function movementSnapshot(actor) { return { path: [...(actor.path || [])], target: actor.target ? { ...actor.target } : null, pending: actor.pending ? { ...actor.pending } : null, action: actor.action, pose: actor.pose, stopped: actor.stopped, moveAllowId: actor.moveAllowId || '', recoveryCount: actor.recoveryCount || 0, blockedT: actor.blockedT || 0 }; }
function restoreMovement(actor, snapshot) { actor.path = snapshot.path; actor.target = snapshot.target; actor.pending = snapshot.pending; actor.action = snapshot.action; actor.pose = snapshot.pose; actor.stopped = snapshot.stopped; actor.moveAllowId = snapshot.moveAllowId; actor.recoveryCount = snapshot.recoveryCount; actor.blockedT = snapshot.blockedT; }
function noRoute(actor) { return String(actor.action || '').toLowerCase().includes('no route') || String(actor.action || '').toLowerCase().includes('blocked'); }
function objectBusy(state, objectId, actorId) { const obj = getObject(objectId); const label = String(obj?.label || '').toLowerCase(); return state.entities.some(e => { if (!e || e.id === actorId || e.hidden) return false; if (e.target?.objectId === objectId || e.pending?.objectId === objectId) return true; if (e.actionT > 0 && label && String(e.action || '').toLowerCase().includes(label)) return true; return false; }); }
function allowsSharedObject(actionId) { return String(actionId || '').includes('together') || ['pool_together', 'console_together', 'arcade_together', 'darts_together', 'swim_together', 'soccer_match'].includes(actionId); }
function isBusy(actor) { if (!actor || actor.hidden) return true; return Boolean(actor.path?.length || actor.target || actor.pending || actor.actionT > 0 || String(actor.action || '').toLowerCase().includes('shower') || String(actor.action || '').toLowerCase().includes('toilet')); }
function orderedByFloor(actor, choices) { return [...choices].sort((a, b) => { const oa = getObject(a[0]); const ob = getObject(b[0]); const aSame = oa?.floor === actor.floor ? 0 : 1; const bSame = ob?.floor === actor.floor ? 0 : 1; return aSame - bSame; }); }
function rotateObjectChoices(actor, choices) { ensureBrain(actor); return [...choices].sort((a, b) => recentPenalty(actor, a[0], a[1]) - recentPenalty(actor, b[0], b[1]) + Math.random() * .45 - .225); }
function rotateChoices(actor, choices) { ensureBrain(actor); return [...choices].sort((a, b) => (recentPenalty(actor, '', a[0]) - recentPenalty(actor, '', b[0])) + ((b[1] || 1) - (a[1] || 1)) * .15 + Math.random() * .35 - .175); }
function recentPenalty(actor, objectId, actionId) { const recentActions = actor.brain?.recentActions || []; const recentObjects = actor.brain?.recentObjects || []; let penalty = 0; recentActions.forEach((id, index) => { if (id === actionId) penalty += (index + 1) * .7; }); recentObjects.forEach((id, index) => { if (id === objectId) penalty += (index + 1) * .45; }); return penalty; }
function rememberSuccess(actor, objectId, actionId) { ensureBrain(actor); actor.brain.recentActions.push(actionId); actor.brain.recentObjects.push(objectId); actor.brain.recentActions = actor.brain.recentActions.slice(-RECENT_LIMIT); actor.brain.recentObjects = actor.brain.recentObjects.slice(-RECENT_LIMIT); }
function rememberFailure(actor, objectId, actionId) { ensureBrain(actor); actor.brain.failed ??= []; actor.brain.failed.push({ objectId, actionId, t: Date.now() }); actor.brain.failed = actor.brain.failed.slice(-12); }
function randomTvAction(actor) { const actions = ['watch_tv', 'comedy', 'horror', 'sports']; return actions[Math.floor(Math.random() * actions.length)]; }
function deskAction(actor) { return actor.id === 'girlfriend' ? 'desk_work' : Math.random() < .5 ? 'desk_work' : 'study'; }
function smartWander(actor) { const base = roomAt(actor.x, actor.y, actor.floor); const cx = base ? base.x + base.w / 2 : 480; const cy = base ? base.y + base.h / 2 : 360; const jitter = () => (Math.random() - .5) * 160; commandMove(actor, cx + jitter(), cy + jitter(), false); actor.action = actor.path.length ? 'Wandering' : 'Idle'; }
function gameHour(state) { return Math.floor((state.time % 1440) / 60); }