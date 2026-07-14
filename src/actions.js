import { ACTION_TIMES } from './config.js';
import { startFetchThrow } from './fetchSystem.js';
import { addGarbageFromAction, callDogToYard, continueTrashRun, startTakeTrashOut } from './garbage.js';
import { byId, changeNeed, log, say, setMood } from './state.js';
import { beginVehicleDeparture, beginVehicleReturn } from './vehicleSystem.js';
import { getObject, getStairExit, objectsByKind, roomAt } from './world.js';
import { commandObject, commandSocial } from './movement.js';
import { applyOffsiteRewards, canAffordTravel, destinationFor, isDestinationOpen, payForTravel, updateOffsiteJob } from './travelLocations.js';
import { updateInvestments } from './investmentSystem.js';
import { updateReactionWorld } from './reactionSystem.js';
import { startMiniSoccerAtField, startSoccerPracticeAtField } from './soccerSystem.js';
import { finishBookReading, finishBookReturnAtShelf, startBookReadingAtSeat, startBookReadingRoute, startLooseBookReturnFromSurface } from './bookSystem.js';
import { recordLifeActivity } from './lifeQualitySystem.js';
import { cleanCrumbsNear, clearTableMealForActor, placeTableMeal, spawnCrumbs, startRobotVacuum, updateRobotVacuum } from './mealCleanupSystem.js';

function isTimedBusy(actor) {
  return Boolean(actor?.actionT > 0 && !String(actor.action || '').toLowerCase().includes('idle'));
}

function queueTask(state, actor, task, label) {
  actor.queuedTask = task;
  say(actor, 'WAIT');
  log(state, `${actor.name} is busy. Queued next task: ${label}.`);
  return true;
}

export function startObjectAction(state, actor, obj, actionId, options = {}) {
  if (!obj || !actor) return false;
  if (!options.fromQueue && isTimedBusy(actor)) return queueTask(state, actor, { type: 'object', objectId: obj.id, actionId }, `${obj.label}: ${actionId.replaceAll('_', ' ')}`);
  if (obj.kind === 'trash_can' && actionId === 'take_trash_out') return startTakeTrashOut(state, actor);
  if (obj.kind === 'kennel' && actionId === 'call_dog_yard') return callDogToYard(state, actor);
  if (actor.type === 'dog' && !['dog_bowl', 'dog_bed', 'kennel', 'stairs', 'soccer_field', 'dog_bath'].includes(obj.kind)) {
    say(actor, 'wo?');
    log(state, 'The dog can only use dog actions, the back door route, kennel, bed, yard, bowl, and dog bath for now.');
    return false;
  }
  if (obj.kind === 'stairs') {
    actor.floor = obj.toFloor;
    const dest = getStairExit(obj);
    if (dest) { actor.x = dest.x + dest.w / 2; actor.y = dest.styleAs === 'door' ? dest.y + dest.h / 2 : dest.y + dest.h + 34; }
    if (actor.id === state.selectedId) state.floor = actor.floor;
    actor.action = 'Changed floor'; actor.path = []; actor.target = null; actor.pending = null;
    say(actor, obj.toFloor === 4 ? 'YARD' : obj.toFloor === 3 ? 'GARAGE' : obj.toFloor === 2 ? 'BASE' : obj.toFloor === 1 ? 'UP' : 'MAIN');
    log(state, `${actor.name} used ${obj.label}.`);
    return true;
  }
  commandObject(actor, obj, actionId);
  log(state, `${actor.name} is heading to ${obj.label}.`);
  return true;
}

export function startSocialAction(state, actor, target, socialId, options = {}) {
  if (!actor || !target) return false;
  if (!options.fromQueue && isTimedBusy(actor)) return queueTask(state, actor, { type: 'social', targetId: target.id, socialId }, `${socialId.replaceAll('_', ' ')} with ${target.name}`);
  if (actor.floor !== target.floor) { log(state, `${actor.name} needs to be on the same floor as ${target.name}.`); return false; }
  if (socialId === 'fetch') {
    state.fetch = { phase: 'call_dog', actorId: actor.id, dogId: target.id, ball: null };
    commandSocial(target, actor, 'fetch_ready'); say(actor, 'COME'); log(state, 'The dog is coming over before fetch starts.'); return true;
  }
  commandSocial(actor, target, socialId); log(state, `${actor.name} is moving closer to ${target.name}.`);
  return true;
}

function beginTimedAction(entity, label, actionId) {
  if (['pool_solo', 'pool_together'].includes(actionId)) {
    entity.action = actionId === 'pool_together' ? 'Pool match' : 'Pool practice';
    entity.actionT = 300;
    entity.actionTotal = 300;
    entity.currentActionId = actionId;
    entity.pose = 'pool';
    entity.carrying = 'cue_stick';
    say(entity, 'CUE');
    return;
  }
  entity.action = label;
  entity.actionT = actionDuration(actionId);
  entity.actionTotal = entity.actionT;
  entity.currentActionId = actionId;
  entity.pose = actionId === 'dog_rest' ? 'dog_rest' :
    actionId === 'wash_dog' ? 'wash_dog' :
    ['sleep', 'nap', 'bed_together', 'intimacy'].includes(actionId) ? 'sleep' :
    actionId === 'shower' ? 'shower' :
    actionId === 'pee_stand' ? 'pee_stand' :
    actionId === 'toilet' ? 'toilet_sit' :
    ['watch_tv', 'watch_together', 'comedy', 'horror', 'sports', 'relax', 'desk_work', 'play_game', 'phone', 'shop', 'console_game', 'console_together', 'read', 'study', 'eat_meal', 'sit_table', 'change_clothes', 'plan_week_outfits', 'read_carried_book'].includes(actionId) ? 'sit' :
    ['treadmill', 'lift_weights', 'heavy_bag', 'swim', 'swim_together', 'pool_solo', 'pool_together', 'soccer_practice', 'soccer_match'].includes(actionId) ? actionId : 'stand';
}

function actionDuration(actionId) {
  return destinationFor(actionId)?.duration ?? ACTION_TIMES[actionId] ?? 4;
}

function isTogetherAction(actionId) { return actionId === 'watch_together' || actionId === 'bed_together' || actionId === 'intimacy' || actionId.endsWith('_together'); }

export function resolveArrival(state, entity) {
  if (!entity.target) return;
  const target = entity.target; entity.target = null;
  if (target.type === 'bookSeat') return startBookReadingAtSeat(state, entity, target);
  if (target.type === 'looseBook') return startLooseBookReturnFromSurface(state, entity, target);
  if (target.type === 'bookShelfReturn') return finishBookReturnAtShelf(state, entity, target);
  if (target.type === 'object') {
    const obj = getObject(target.objectId); if (!obj) return;
    if (obj.kind === 'bookshelf' && target.actionId === 'read') return startBookReadingRoute(state, entity, obj);
    if (obj.kind === 'soccer_field') {
      if (target.actionId === 'soccer_match') startMiniSoccerAtField(state, entity);
      else startSoccerPracticeAtField(state, entity);
      return;
    }
    if (obj.kind === 'fridge' && target.actionId === 'meal') return beginIngredientStage(state, entity, obj);
    if (obj.kind === 'stove' && ['meal', 'cook_meal'].includes(target.actionId)) return beginCookStage(state, entity, obj);
    if (obj.kind === 'dining_table' && ['serve_meal', 'eat_meal'].includes(target.actionId)) return beginDiningStage(state, entity, obj);
    if (obj.kind === 'cleaning_closet' && target.actionId === 'get_cleaning_supplies') return beginCleaningSupplyStage(state, entity, obj);
    if (obj.kind === 'vacuum_cleaner' && target.actionId === 'vacuum_clean') return beginVacuumStage(state, entity, obj);
    if (obj.kind === 'robot_vacuum' && target.actionId === 'robot_vacuum_start') return beginRobotVacuumStage(state, entity, obj);
    if (isTogetherAction(target.actionId)) { if (queuePartnerForSharedAction(state, entity, target.actionId, obj)) return; entity.action = 'Idle'; entity.actionT = 0; entity.pose = 'stand'; return; }
    const label = `${obj.label}: ${target.actionId.replaceAll('_', ' ')}`;
    beginTimedAction(entity, label, target.actionId); say(entity, speechFor(target.actionId));
    if (target.actionId === 'shower') { entity.showerObjectId = obj.id; entity.carrying = null; }
    if (target.actionId === 'toilet' || target.actionId === 'pee_stand') entity.toiletObjectId = obj.id;
    if (['sleep', 'nap', 'bed_together', 'intimacy'].includes(target.actionId)) { entity.sleepObjectId = obj.id; state.objectState.bedMade = false; }
    if (target.actionId === 'wash_dog') syncDogForBath(state, entity, obj);
    if (target.actionId === 'make_bed') state.objectState.bedMade = false;
    if (obj.kind === 'fridge') { state.objectState.fridgeOpen = true; state.objectState.fridgeActivity = target.actionId; if (target.actionId === 'snack') entity.carrying = 'snack'; }
    if (obj.kind === 'door') state.objectState.doorOpen = true;
    if (obj.kind === 'tv' || ['watch_tv', 'comedy', 'horror', 'sports'].includes(target.actionId)) { state.tv.on = true; state.tv.channel = target.actionId; if (['watch_tv', 'comedy', 'horror', 'sports'].includes(target.actionId)) entity.carrying = 'popcorn'; }
    return;
  }
  if (target.type === 'social') {
    const other = byId(state, target.targetId); if (!other) return;
    if (target.socialId === 'fetch_ready') { state.fetch = { phase: 'ready', actorId: other.id, dogId: entity.id, ball: null }; say(entity, 'READY'); say(other, 'THROW'); other.carrying = 'ball'; log(state, 'Tap an open floor spot to throw the ball.'); return; }
    beginTimedAction(entity, `${target.socialId} with ${other.name}`, target.socialId); entity.pose = target.socialId;
    other.action = target.socialId === 'pool_together' ? 'Pool match' : `${target.socialId} with ${entity.name}`; other.actionT = entity.actionT; other.actionTotal = entity.actionT; other.pose = entity.pose; other.currentActionId = target.socialId;
    if (target.socialId === 'pool_together') { other.carrying = 'cue_stick'; entity.carrying = 'cue_stick'; }
    say(entity, speechFor(target.socialId)); say(other, speechFor(target.socialId)); other.mood = entity.type === 'dog' ? 'dog' : 'happy';
    if (target.socialId === 'intimacy') { entity.sleepObjectId = 'bed'; other.sleepObjectId = 'bed'; state.roomLights.bedroom = false; state.roomLights.hall = false; log(state, 'The bedroom lights turn off for privacy.'); }
  }
}

function beginIngredientStage(state, entity, obj) {
  beginTimedAction(entity, 'Fridge: gather ingredients', 'gather_ingredients');
  state.objectState.fridgeOpen = true;
  state.objectState.fridgeActivity = 'meal';
  entity.carrying = 'ingredients';
  entity.queuedTask = { type: 'object', objectId: 'stove', actionId: 'cook_meal' };
  say(entity, 'PREP');
  log(state, `${entity.name} grabbed ingredients before cooking.`);
}

function beginCookStage(state, entity, obj) {
  beginTimedAction(entity, 'Stove: cook meal', 'cook_meal');
  state.objectState.stovePan = true;
  entity.carrying = 'cooking_meal';
  entity.queuedTask = { type: 'object', objectId: 'dining_table', actionId: 'serve_meal' };
  say(entity, 'COOK');
  log(state, `${entity.name} is cooking at the stove before eating.`);
}

function beginDiningStage(state, entity, obj) {
  beginTimedAction(entity, 'Dining Table: eat meal', 'eat_meal');
  placeTableMeal(state, entity, obj);
  entity.pose = 'sit';
  say(entity, 'EAT');
  log(state, `${entity.name} set the meal on the dining table before eating.`);
}

function beginCleaningSupplyStage(state, entity, obj) {
  beginTimedAction(entity, `${obj.label}: get cleaning supplies`, 'get_cleaning_supplies');
  entity.carrying = 'cleaning_supplies';
  say(entity, 'CLEAN');
}

function beginVacuumStage(state, entity, obj) {
  beginTimedAction(entity, `${obj.label}: vacuum crumbs`, 'vacuum_clean');
  entity.carrying = 'vacuum';
  say(entity, 'VAC');
}

function beginRobotVacuumStage(state, entity, obj) {
  startRobotVacuum(state, obj);
  beginTimedAction(entity, `${obj.label}: start`, 'robot_vacuum_start');
  say(entity, 'AUTO');
}

function syncDogForBath(state, actor, obj) {
  const dog = byId(state, 'dog');
  if (!dog) return;
  dog.hidden = false;
  dog.floor = obj.floor;
  dog.x = obj.x + obj.w * .58;
  dog.y = obj.y + obj.h * .55;
  dog.path = [];
  dog.target = null;
  dog.pending = null;
  dog.action = `Being washed by ${actor.name}`;
  dog.actionT = actor.actionT;
  dog.actionTotal = actor.actionTotal;
  dog.currentActionId = 'wash_dog';
  dog.pose = 'dog_wash';
  dog.mood = 'dog';
  say(dog, 'bath?');
  log(state, `${actor.name} brought the dog to the backyard bath.`);
}

function queuePartnerForSharedAction(state, entity, actionId, obj) {
  const partner = state.entities.find(e => e.id !== entity.id && e.type === 'person' && !e.hidden && e.floor === entity.floor);
  if (!partner) { say(entity, 'rn?'); log(state, `${entity.name} needs someone nearby for ${actionId.replaceAll('_', ' ')}.`); return false; }
  const decision = canInviteeJoin(state, entity, partner);
  if (!decision.ok) { if (decision.heard) say(partner, 'not rn'); log(state, `${partner.name} declined ${actionId.replaceAll('_', ' ')}: ${decision.reason}.`); return false; }
  partner.path = [];
  partner.target = null;
  partner.pending = null;
  partner.sleepObjectId = obj.kind === 'bed' ? obj.id : partner.sleepObjectId;
  beginTimedAction(entity, `${obj.label}: ${actionId.replaceAll('_', ' ')}`, actionId);
  beginTimedAction(partner, `${obj.label}: ${actionId.replaceAll('_', ' ')}`, actionId);
  if (obj.kind === 'bed') { entity.sleepObjectId = obj.id; partner.sleepObjectId = obj.id; }
  partner.x = obj.x + obj.w * .52;
  partner.y = obj.y + obj.h * .62;
  say(entity, speechFor(actionId));
  say(partner, speechFor(actionId));
  log(state, `${partner.name} joined ${entity.name} for ${actionId.replaceAll('_', ' ')}.`);
  return true;
}

function canInviteeJoin(state, inviter, invitee) {
  const hears = invitee.floor === inviter.floor && Math.hypot(invitee.x - inviter.x, invitee.y - inviter.y) < 280;
  if (invitee.actionT > 0 || invitee.hidden || invitee.stopped) return { ok: false, heard: hears, reason: 'busy' };
  if ((invitee.needs.energy ?? 100) < 18) return { ok: false, heard: hears, reason: 'too tired' };
  if ((invitee.needs.hunger ?? 100) < 16) return { ok: false, heard: hears, reason: 'too hungry' };
  if ((invitee.needs.freshness ?? 100) < 12) return { ok: false, heard: hears, reason: 'needs shower' };
  return { ok: true, heard: hears, reason: '' };
}

export function updateActions(state, dt) {
  updateOffsiteJob(state, dt);
  updateInvestments(state, dt);
  updateRobotVacuum(state, dt);
  updateReactionWorld(state, dt);
  for (const e of state.entities) {
    if (e.hidden || e.actionT <= 0) continue;
    e.actionT -= dt * state.speed;
    if (e.actionT > 0) continue;
    const completedActionId = e.currentActionId || '';
    const text = `${e.action || ''} ${completedActionId}`.toLowerCase();
    const finishedSleepLike = text.includes('sleep') || text.includes('nap') || text.includes('bed together');
    if (completedActionId === 'eat_meal') { clearTableMealForActor(state, e); spawnCrumbs(state, e); changeNeed(e, 'hunger', 42); changeNeed(e, 'fun', 4); e.carrying = null; setMood(e, 'happy'); }
    if (completedActionId === 'cook_meal') { e.carrying = 'plated_meal'; state.objectState.stovePan = false; setMood(e, 'calm'); }
    if (completedActionId === 'gather_ingredients') { setMood(e, 'calm'); }
    if (completedActionId === 'get_cleaning_supplies') { setMood(e, 'calm'); }
    if (completedActionId === 'vacuum_clean') { cleanCrumbsNear(state, e); changeNeed(e, 'freshness', -1); setMood(e, 'calm'); }
    if (completedActionId === 'robot_vacuum_start') { setMood(e, 'calm'); }
    if (text.includes('bring food')) { changeNeed(e, 'social', 5); setMood(e, 'happy'); }
    if (completedActionId === 'shower') { changeNeed(e, 'freshness', 36); setMood(e, 'calm'); e.carrying = 'towel_wrap'; e.showerObjectId = null; }
    if (text.includes('wash dog')) { const dog = byId(state, 'dog'); if (dog) { changeNeed(dog, 'freshness', 42); changeNeed(dog, 'fun', 6); dog.action = 'Idle'; dog.pose = 'stand'; dog.actionT = 0; dog.actionTotal = 0; dog.currentActionId = null; say(dog, 'clean'); } changeNeed(e, 'freshness', -3); changeNeed(e, 'social', 4); setMood(e, 'happy'); }
    if (text.includes('brush')) { changeNeed(e, 'freshness', 12); setMood(e, 'calm'); }
    if (text.includes('groom')) { changeNeed(e, 'freshness', 18); setMood(e, 'calm'); }
    if (completedActionId === 'pee_stand') { changeNeed(e, 'bladder', 28); changeNeed(e, 'freshness', -4); queueHandWash(state, e); setMood(e, 'calm'); }
    if (completedActionId === 'toilet') { changeNeed(e, 'bladder', 100); changeNeed(e, 'freshness', -8); queueHandWash(state, e); setMood(e, 'calm'); }
    if (text.includes('change clothes')) { applyDailyOutfit(state, e); changeNeed(e, 'freshness', 6); if (e.carrying === 'towel_wrap') e.carrying = null; setMood(e, 'calm'); }
    if (text.includes('plan weekly outfits')) { if (e.wardrobe) e.wardrobe.planned = true; say(e, 'FIT'); setMood(e, 'calm'); }
    if (finishedSleepLike) { changeNeed(e, 'energy', 32); changeNeed(e, 'stamina', 24); state.objectState.bedMade = false; setMood(e, 'calm'); }
    if (text.includes('make bed')) { state.objectState.bedMade = true; changeNeed(e, 'fun', -1); setMood(e, 'calm'); }
    if (text.includes('intimacy')) { changeNeed(e, 'social', 30); changeNeed(e, 'fun', 10); state.objectState.bedMade = false; setMood(e, 'love'); }
    if (text.includes('tv') || text.includes('comedy')) { changeNeed(e, 'fun', 20); setMood(e, 'happy'); addGarbageFromAction(state, 'popcorn', e); }
    if (text.includes('horror')) { changeNeed(e, 'fun', 14); setMood(e, 'spooked'); addGarbageFromAction(state, 'popcorn', e); }
    if (text.includes('sports')) { changeNeed(e, 'fun', 16); setMood(e, 'hyped'); addGarbageFromAction(state, 'popcorn', e); }
    if (text.includes('read') || text.includes('study') || text.includes('desk work')) { changeNeed(e, 'fun', 8); changeNeed(e, 'energy', -5); setMood(e, 'calm'); }
    if (text.includes('game') || text.includes('console') || text.includes('arcade') || text.includes('pool') || text.includes('darts') || text.includes('chess')) { changeNeed(e, 'fun', 18); changeNeed(e, 'social', text.includes('together') ? 12 : 0); changeNeed(e, 'stamina', -3); setMood(e, 'hyped'); }
    if (text.includes('soccer')) { changeNeed(e, 'fun', 12); changeNeed(e, 'stamina', -9); changeNeed(e, 'freshness', -5); setMood(e, 'hyped'); }
    if (text.includes('treadmill') || text.includes('lift weights') || text.includes('heavy bag')) { changeNeed(e, 'stamina', -12); changeNeed(e, 'fun', 8); changeNeed(e, 'freshness', -8); setMood(e, 'hyped'); }
    if (text.includes('swim')) { changeNeed(e, 'stamina', -7); changeNeed(e, 'fun', 18); changeNeed(e, 'freshness', 8); setMood(e, 'happy'); e.carrying = 'towel_wrap'; }
    if (text.includes('coffee')) { changeNeed(e, 'energy', 10); setMood(e, 'hyped'); }
    if (text.includes('phone') || text.includes('talk')) { changeNeed(e, 'social', 18); setMood(e, 'phone'); }
    if (text.includes('kiss') || text.includes('cuddle') || text.includes('hands')) { changeNeed(e, 'social', 22); setMood(e, 'love'); }
    if (text.includes('pet') || text.includes('train') || text.includes('tickle')) { changeNeed(e, 'fun', 14); setMood(e, e.type === 'dog' ? 'dog' : 'happy'); }
    if (text.includes('dog rest')) { changeNeed(e, 'energy', 12); setMood(e, 'dog'); }
    if (text.includes('feed dog')) { const dog = byId(state, 'dog'); if (dog) changeNeed(dog, 'hunger', 40); }
    if (text.includes('light')) toggleRoomLight(state, e);
    state.objectState.fridgeOpen = false; state.objectState.fridgeActivity = null; state.objectState.doorOpen = false;
    if (completedActionId !== 'cook_meal') e.carrying = e.carrying === 'plated_meal' ? null : e.carrying;
    e.action = 'Idle'; e.actionT = 0; e.actionTotal = 0; e.pose = 'stand'; e.currentActionId = null; e.toiletObjectId = null; e.idleT = -3;
    if (finishedSleepLike) e.sleepObjectId = null;
    if (e.carrying && ['popcorn', 'snack', 'ingredients', 'cleaning_supplies', 'vacuum'].includes(e.carrying)) e.carrying = null;
    if (e.queuedTask) runQueuedTask(state, e);
  }
}

function queueHandWash(state, e) {
  if (e.queuedTask || e.type !== 'person') return;
  const sink = nearestObjectByKind(e, 'sink');
  if (!sink) return;
  e.queuedTask = { type: 'object', objectId: sink.id, actionId: 'groom' };
  log(state, `${e.name} will wash hands after using the toilet.`);
}

function nearestObjectByKind(actor, kind) {
  return objectsByKind(kind).sort((a, b) => {
    const floorA = a.floor === actor.floor ? 0 : 100000;
    const floorB = b.floor === actor.floor ? 0 : 100000;
    const privateA = privateBathroomPreference(actor, a);
    const privateB = privateBathroomPreference(actor, b);
    const da = floorA + privateA + Math.hypot(actor.x - (a.x + a.w / 2), actor.y - (a.y + a.h / 2));
    const db = floorB + privateB + Math.hypot(actor.x - (b.x + b.w / 2), actor.y - (b.y + b.h / 2));
    return da - db;
  })[0] || null;
}

function privateBathroomPreference(actor, obj) {
  if (actor.floor === 1 && ['master_bath', 'suite_foyer'].includes(obj.room)) return -5000;
  if (actor.floor === 0 && obj.room === 'bath') return -2000;
  return 0;
}

function applyDailyOutfit(state, e) {
  if (!e?.wardrobe) return;
  const day = Math.floor((state.time || 0) / 1440) % 7;
  e.wardrobe.currentDay = day;
  e.wardrobe.changedAt = state.time || 0;
  say(e, 'FIT');
  log(state, `${e.name} changed into ${e.wardrobe.outfits?.[day] || 'a fresh outfit'}.`);
}

function runQueuedTask(state, actor) {
  const task = actor.queuedTask;
  actor.queuedTask = null;
  if (!task) return false;
  if (task.type === 'object') return startObjectAction(state, actor, getObject(task.objectId), task.actionId, { fromQueue: true });
  if (task.type === 'social') return startSocialAction(state, actor, byId(state, task.targetId), task.socialId, { fromQueue: true });
  if (task.type === 'offsite') return startOffsite(state, actor, task.actionId, task.invitedIds || [], task.vehicleId || 'auto', { fromQueue: true });
  return false;
}

function toggleRoomLight(state, entity) { const room = roomAt(entity.x, entity.y, entity.floor)?.id || (entity.floor === 0 ? 'living' : entity.floor === 1 ? 'bedroom' : entity.floor === 2 ? 'basement' : entity.floor === 3 ? 'garage_bay' : 'yard'); state.roomLights[room] = !state.roomLights[room]; state.bill += state.roomLights[room] ? 1 : -1; }

export function startOffsite(state, actor, actionId, invitedIds = [], vehicleId = 'auto', options = {}) {
  if (!actor) return false;
  if (!options.fromQueue && isTimedBusy(actor)) return queueTask(state, actor, { type: 'offsite', actionId, invitedIds, vehicleId }, actionId.replaceAll('_', ' '));
  const destination = destinationFor(actionId);
  if (destination && !isDestinationOpen(state, destination)) { log(state, `${destination.label} is closed right now.`); say(actor, 'CLOSED'); return false; }
  if (destination && !canAffordTravel(state, destination, vehicleId)) { log(state, `Insufficient money for ${destination.label}.`); say(actor, 'BROKE'); return false; }
  if (destination && !payForTravel(state, destination, vehicleId)) { say(actor, 'BROKE'); return false; }
  const party = buildParty(state, actor, invitedIds, actionId, vehicleId);
  const partyIds = party.map(e => e.id);
  const tripVehicle = vehicleId === 'auto' && ['bike_trip', 'motorbike_trip'].includes(actionId) ? actionId === 'bike_trip' ? 'bike' : 'motorbike' : vehicleId;
  const began = beginVehicleDeparture(state, actionId, partyIds, tripVehicle, actor.id);
  if (!began) return false;
  state.objectState.doorOpen = true;
  log(state, `${actor.name} is leaving for ${(destination?.label || actionId.replaceAll('_', ' '))} with ${party.length - 1} guest(s).`);
  return true;
}

function buildParty(state, actor, invitedIds, actionId, vehicleId = 'auto') {
  const party = [actor];
  const limitedVehicle = vehicleId === 'bike' || vehicleId === 'motorbike';
  for (const id of invitedIds || []) {
    const e = byId(state, id);
    if (!e || e.id === actor.id || e.hidden) continue;
    if (limitedVehicle && e.type === 'dog') { log(state, `${e.name} cannot ride on ${vehicleId}.`); continue; }
    if (limitedVehicle && party.length >= (vehicleId === 'bike' ? 1 : 2)) { log(state, `${vehicleId} has limited passenger space.`); continue; }
    if (e.type === 'dog' && !['errand', 'mall', 'date', 'movies', 'dog_park', 'vacation_camping', 'vacation_beach'].includes(actionId)) { log(state, `${e.name} declined ${actionId.replaceAll('_', ' ')}: not allowed for that destination.`); continue; }
    const decision = canInviteeJoin(state, actor, e);
    if (!decision.ok) { if (decision.heard) say(e, 'not rn'); log(state, `${e.name} declined ${actionId.replaceAll('_', ' ')}: ${decision.reason}.`); continue; }
    say(e, 'yeah'); party.push(e);
  }
  return party;
}
function finishOffsite(state) { const job = state.offsite; if (!job) return; applyOffsiteRewards(state, job); beginVehicleReturn(state, job.actionId, job.actors || [], job.vehicleId || state.objectState.vehicleInUse || 'car_1'); state.offsite = null; state.objectState.doorOpen = false; }
function speechFor(actionId) { const map = { shower: 'SHOWER', pee_stand: 'PEE', toilet: 'TOILET', snack: 'SNACK', meal: 'COOK', gather_ingredients: 'PREP', cook_meal: 'COOK', serve_meal: 'PLATE', bring_food: 'FOOD', comedy: 'TV', horror: 'TV', sports: 'TV', phone: 'PHONE', play_game: 'GAME', sleep: 'SLEEP', nap: 'NAP', make_bed: 'BED', change_clothes: 'FIT', plan_week_outfits: 'FIT', get_cleaning_supplies: 'CLEAN', vacuum_clean: 'VAC', robot_vacuum_start: 'AUTO', wash_dog: 'BATH', kiss: 'KISS', cuddle: 'CUDDLE', tickle: 'LAUGH', hands: 'HANDS', watch_together: 'TV', bed_together: 'BED', intimacy: 'LOVE', pet: 'PET', train: 'TRAIN', feed_dog: 'BOWL', pool_solo: 'POOL', pool_together: 'POOL', arcade: 'ARCADE', arcade_together: 'ARCADE', console_game: 'GAME', console_together: 'GAME', read: 'READ', read_carried_book: 'READ', study: 'STUDY', eat_meal: 'EAT', coffee: 'COFFEE', darts: 'DARTS', darts_together: 'DARTS', treadmill: 'RUN', lift_weights: 'LIFT', heavy_bag: 'PUNCH', swim: 'SWIM', swim_together: 'SWIM', take_trash_out: 'TRASH', dump_trash: 'DUMP', throw_trash: 'TOSS', wash_dishes: 'WASH', dog_rest: 'BED', call_dog_yard: 'YARD', drive: 'CAR', bike_trip: 'BIKE', motorbike_trip: 'MOTO', soccer_practice: 'KICK', soccer_match: 'MATCH' }; return map[actionId] || actionId.toUpperCase().slice(0, 8); }