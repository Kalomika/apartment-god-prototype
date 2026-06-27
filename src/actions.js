import { ACTION_TIMES } from './config.js';
import { byId, changeNeed, log, say, setMood } from './state.js';
import { getObject } from './world.js';
import { commandObject, commandSocial } from './movement.js';

export function startObjectAction(state, actor, obj, actionId) {
  if (!obj) return;
  if (actor.type === 'dog' && obj.kind !== 'dog_bowl') {
    say(actor, 'wo?');
    return log(state, 'The dog can only use dog actions and the bowl for now.');
  }
  if (obj.kind === 'stairs') {
    actor.floor = obj.toFloor;
    const dest = getObject(obj.toFloor === 1 ? 'stairs_up' : 'stairs_down');
    if (dest) { actor.x = dest.x + dest.w / 2; actor.y = dest.y + dest.h + 34; }
    if (actor.id === 'resident') state.floor = actor.floor;
    actor.action = 'Changed floor';
    say(actor, obj.toFloor === 1 ? 'UP' : 'DOWN');
    return;
  }
  commandObject(actor, obj, actionId);
  log(state, `${actor.name} is heading to ${obj.label}.`);
}

export function startSocialAction(state, actor, target, socialId) {
  if (actor.floor !== target.floor) {
    log(state, `${actor.name} needs to be on the same floor as ${target.name}.`);
    return;
  }
  if (socialId === 'fetch') {
    state.fetch = { phase: 'call_dog', actorId: actor.id, dogId: target.id, ball: null };
    commandSocial(target, actor, 'fetch_ready');
    say(actor, 'COME');
    log(state, 'The dog is coming over before fetch starts.');
    return;
  }
  commandSocial(actor, target, socialId);
  log(state, `${actor.name} is moving closer to ${target.name}.`);
}

function beginTimedAction(entity, label, actionId) {
  entity.action = label;
  entity.actionT = ACTION_TIMES[actionId] ?? 4;
  entity.pose = ['sleep', 'nap'].includes(actionId) ? 'sleep' : ['watch_tv', 'comedy', 'horror', 'sports', 'relax', 'toilet', 'desk_work', 'play_game', 'phone', 'shop'].includes(actionId) ? 'sit' : 'stand';
}

export function resolveArrival(state, entity) {
  if (!entity.target) return;
  const target = entity.target;
  entity.target = null;

  if (target.type === 'object') {
    const obj = getObject(target.objectId);
    if (!obj) return;
    const label = `${obj.label}: ${target.actionId.replaceAll('_', ' ')}`;
    beginTimedAction(entity, label, target.actionId);
    say(entity, speechFor(target.actionId));
    if (obj.kind === 'fridge') state.objectState.fridgeOpen = true;
    if (obj.kind === 'door') state.objectState.doorOpen = true;
    if (obj.kind === 'tv' || ['watch_tv', 'comedy', 'horror', 'sports'].includes(target.actionId)) {
      state.tv.on = true;
      state.tv.channel = target.actionId;
    }
    return;
  }

  if (target.type === 'social') {
    const other = byId(state, target.targetId);
    if (!other) return;
    if (target.socialId === 'fetch_ready') {
      state.fetch = { phase: 'ready', actorId: other.id, dogId: entity.id, ball: null };
      say(entity, 'READY');
      say(other, 'THROW');
      log(state, 'Tap an open floor spot to throw the ball.');
      return;
    }
    beginTimedAction(entity, `${target.socialId} with ${other.name}`, target.socialId);
    say(entity, speechFor(target.socialId));
    say(other, speechFor(target.socialId));
    other.mood = entity.type === 'dog' ? 'dog' : 'happy';
  }
}

export function throwFetchBall(state, x, y) {
  if (!state.fetch || state.fetch.phase !== 'ready') return false;
  const dog = byId(state, state.fetch.dogId);
  const actor = byId(state, state.fetch.actorId);
  if (!dog || !actor) return false;
  state.fetch = { ...state.fetch, phase: 'thrown', ball: { x, y } };
  dog.path = [{ x, y }, { x: actor.x + 42, y: actor.y + 10 }];
  dog.target = null;
  dog.action = 'Fetching ball';
  dog.pose = 'walk';
  say(dog, 'BALL');
  log(state, 'Ball thrown. The dog is fetching it.');
  return true;
}

export function updateActions(state, dt) {
  for (const e of state.entities) {
    if (e.hidden) continue;
    if (e.bubbleT > 0) e.bubbleT -= dt;
    if (e.actionT > 0) {
      e.actionT -= dt;
      if (e.actionT <= 0) finishAction(state, e);
    }
  }
  if (state.offsite) {
    state.offsite.t -= dt;
    state.time += dt * 22;
    if (state.offsite.t <= 0) finishOffsite(state);
  }
  state.tv.pulse += dt;
}

function finishAction(state, e) {
  const text = String(e.action || '').toLowerCase();
  if (text.includes('snack')) { changeNeed(e, 'hunger', 18); setMood(e, 'happy'); }
  if (text.includes('meal')) { changeNeed(e, 'hunger', 30); changeNeed(e, 'fun', 4); setMood(e, 'happy'); }
  if (text.includes('bring food')) { changeNeed(e, 'social', 5); setMood(e, 'happy'); }
  if (text.includes('shower')) { changeNeed(e, 'freshness', 36); setMood(e, 'calm'); }
  if (text.includes('brush')) { changeNeed(e, 'freshness', 12); setMood(e, 'calm'); }
  if (text.includes('groom')) { changeNeed(e, 'freshness', 18); setMood(e, 'calm'); }
  if (text.includes('toilet')) { changeNeed(e, 'bladder', 36); setMood(e, 'calm'); }
  if (text.includes('sleep') || text.includes('nap')) { changeNeed(e, 'energy', 32); changeNeed(e, 'stamina', 24); setMood(e, 'calm'); }
  if (text.includes('tv') || text.includes('comedy')) { changeNeed(e, 'fun', 20); setMood(e, 'happy'); }
  if (text.includes('horror')) { changeNeed(e, 'fun', 14); setMood(e, 'spooked'); }
  if (text.includes('sports')) { changeNeed(e, 'fun', 16); setMood(e, 'hyped'); }
  if (text.includes('game')) { changeNeed(e, 'fun', 22); setMood(e, 'happy'); }
  if (text.includes('phone') || text.includes('talk')) { changeNeed(e, 'social', 18); setMood(e, 'phone'); }
  if (text.includes('kiss') || text.includes('cuddle') || text.includes('hands')) { changeNeed(e, 'social', 22); setMood(e, 'love'); }
  if (text.includes('pet') || text.includes('train')) { changeNeed(e, 'fun', 14); setMood(e, e.type === 'dog' ? 'dog' : 'happy'); }
  if (text.includes('feed dog')) { const dog = byId(state, 'dog'); if (dog) changeNeed(dog, 'hunger', 40); }
  if (text.includes('light')) { toggleRoomLight(state, e); }
  state.objectState.fridgeOpen = false;
  state.objectState.doorOpen = false;
  e.action = 'Idle';
  e.actionT = 0;
  e.pose = 'stand';
  e.idleT = 0;
}

function toggleRoomLight(state, entity) {
  const room = entity.floor === 0 ? 'living' : 'bedroom';
  state.roomLights[room] = !state.roomLights[room];
  state.bill += state.roomLights[room] ? 1 : -1;
}

export function startOffsite(state, actor, actionId) {
  const partner = actionId === 'date' ? byId(state, 'girlfriend') : null;
  state.offsite = { actionId, t: ACTION_TIMES[actionId] ?? 10, actors: partner ? [actor.id, partner.id] : [actor.id] };
  for (const id of state.offsite.actors) {
    const e = byId(state, id);
    if (e) { e.hidden = true; e.action = actionId; }
  }
  state.objectState.doorOpen = true;
  log(state, `${actor.name} left for ${actionId.replaceAll('_', ' ')}.`);
}

function finishOffsite(state) {
  for (const id of state.offsite.actors) {
    const e = byId(state, id);
    if (e) {
      e.hidden = false; e.floor = 0; e.x = 112; e.y = 424; e.action = 'Returned'; e.pose = 'stand';
      changeNeed(e, 'fun', state.offsite.actionId === 'work' ? -5 : 22);
      changeNeed(e, 'hunger', -12); changeNeed(e, 'energy', -12);
    }
  }
  log(state, `Returned from ${state.offsite.actionId.replaceAll('_', ' ')}.`);
  state.offsite = null;
  state.objectState.doorOpen = false;
}

function speechFor(actionId) {
  const map = { shower: 'SHOWER', toilet: 'TOILET', snack: 'FOOD', meal: 'COOK', bring_food: 'FOOD', comedy: 'HA!', horror: '!!', sports: 'GO', phone: 'CALL', play_game: 'GAME', sleep: 'Zz', nap: 'Zz', kiss: '<3', cuddle: '<3', pet: 'PET', train: 'TRAIN', feed_dog: 'FOOD' };
  return map[actionId] || actionId.toUpperCase().slice(0, 8);
}
