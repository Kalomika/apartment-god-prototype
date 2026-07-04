import { ACTION_TIMES } from './config.js';
import { startFetchThrow } from './fetchSystem.js';
import { byId, changeNeed, log, say, setMood } from './state.js';
import { getObject, getStairExit, roomAt } from './world.js';
import { commandObject, commandSocial } from './movement.js';

export function startObjectAction(state, actor, obj, actionId) {
  if (!obj) return;
  if (actor.type === 'dog' && obj.kind !== 'dog_bowl') {
    say(actor, 'wo?');
    return log(state, 'The dog can only use dog actions and the bowl for now.');
  }
  if (obj.kind === 'stairs') {
    actor.floor = obj.toFloor;
    const dest = getStairExit(obj);
    if (dest) { actor.x = dest.x + dest.w / 2; actor.y = dest.y + dest.h + 34; }
    if (actor.id === 'resident') state.floor = actor.floor;
    actor.action = 'Changed floor';
    actor.path = [];
    actor.target = null;
    actor.pending = null;
    say(actor, obj.toFloor === 2 ? 'BASE' : obj.toFloor === 1 ? 'UP' : 'DOWN');
    log(state, `${actor.name} used ${obj.label}.`);
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
  entity.actionTotal = entity.actionT;
  entity.pose = ['sleep', 'nap', 'bed_together', 'intimacy'].includes(actionId) ? 'sleep' : ['watch_tv', 'watch_together', 'comedy', 'horror', 'sports', 'relax', 'toilet', 'desk_work', 'play_game', 'phone', 'shop', 'console_game', 'console_together'].includes(actionId) ? 'sit' : 'stand';
}

function isTogetherAction(actionId) {
  return actionId === 'watch_together' || actionId === 'bed_together' || actionId === 'intimacy' || actionId.endsWith('_together');
}

export function resolveArrival(state, entity) {
  if (!entity.target) return;
  const target = entity.target;
  entity.target = null;

  if (target.type === 'object') {
    const obj = getObject(target.objectId);
    if (!obj) return;
    if (isTogetherAction(target.actionId)) {
      if (queuePartnerForSharedAction(state, entity, target.actionId, obj)) return;
      entity.action = 'Idle';
      entity.actionT = 0;
      entity.pose = 'stand';
      return;
    }
    const label = `${obj.label}: ${target.actionId.replaceAll('_', ' ')}`;
    beginTimedAction(entity, label, target.actionId);
    say(entity, speechFor(target.actionId));
    if (obj.kind === 'fridge') {
      state.objectState.fridgeOpen = true;
      state.objectState.fridgeActivity = target.actionId;
    }
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
    entity.pose = target.socialId;
    other.action = `${target.socialId} with ${entity.name}`;
    other.actionT = entity.actionT;
    other.actionTotal = entity.actionT;
    other.pose = target.socialId;
    say(entity, speechFor(target.socialId));
    say(other, speechFor(target.socialId));
    other.mood = entity.type === 'dog' ? 'dog' : 'happy';
    if (target.socialId === 'intimacy') {
      state.roomLights.bedroom = false;
      state.roomLights.hall = false;
      log(state, 'The bedroom lights turn off for privacy.');
    }
  }
}

function queuePartnerForSharedAction(state, entity, actionId, obj) {
  const partner = state.entities.find(e => e.id !== entity.id && e.type === 'person' && !e.hidden && e.floor === entity.floor);
  if (!partner) {
    say(entity, 'rn?');
    log(state, `${entity.name} needs someone nearby for ${actionId.replaceAll('_', ' ')}.`);
    return false;
  }
  const decision = canInviteeJoin(state, entity, partner);
  if (!decision.ok) {
    if (decision.heard) say(partner, 'not rn');
    say(entity, 'rn?');
    log(state, `${partner.name} declined ${obj.label}: ${decision.reason}.`);
    return false;
  }
  say(partner, 'yeah');
  entity.action = `Waiting for ${partner.name}`;
  entity.actionT = 0;
  entity.pose = 'stand';
  commandSocial(partner, entity, actionId);
  log(state, `${partner.name} agreed to join ${entity.name} at ${obj.label}.`);
  return true;
}

function canInviteeJoin(state, actor, invitee) {
  const distance = Math.hypot(invitee.x - actor.x, invitee.y - actor.y);
  const actorRoom = roomAt(actor.x, actor.y, actor.floor)?.id || '';
  const inviteeRoom = roomAt(invitee.x, invitee.y, invitee.floor)?.id || '';
  const bathroomTalk = actorRoom.includes('bath') || inviteeRoom.includes('bath');
  const hearingRange = bathroomTalk ? 120 : 260;
  if (distance > hearingRange) return { ok: false, heard: false, reason: 'too far to hear' };
  const current = String(invitee.action || '').toLowerCase();
  if (invitee.path?.length || invitee.actionT > 0) return { ok: false, heard: true, reason: 'busy' };
  if (current.includes('shower') || current.includes('toilet') || current.includes('cooking') || current.includes('eating')) return { ok: false, heard: true, reason: 'busy' };
  if ((invitee.needs?.bladder ?? 100) < 25) return { ok: false, heard: true, reason: 'bathroom need' };
  if ((invitee.needs?.hunger ?? 100) < 25) return { ok: false, heard: true, reason: 'hungry' };
  if ((invitee.needs?.energy ?? 100) < 18) return { ok: false, heard: true, reason: 'tired' };
  return { ok: true, heard: true, reason: 'available' };
}

export function throwFetchBall(state, x, y) {
  if (!state.fetch || state.fetch.phase !== 'ready') return false;
  const dog = byId(state, state.fetch.dogId);
  const actor = byId(state, state.fetch.actorId);
  if (!dog || !actor) return false;
  return startFetchThrow(state, actor, dog, x, y);
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
  if (text.includes('sleep') || text.includes('nap') || text.includes('bed together')) { changeNeed(e, 'energy', 32); changeNeed(e, 'stamina', 24); setMood(e, 'calm'); }
  if (text.includes('intimacy')) { changeNeed(e, 'social', 30); changeNeed(e, 'fun', 10); setMood(e, 'love'); }
  if (text.includes('tv') || text.includes('comedy')) { changeNeed(e, 'fun', 20); setMood(e, 'happy'); }
  if (text.includes('horror')) { changeNeed(e, 'fun', 14); setMood(e, 'spooked'); }
  if (text.includes('sports')) { changeNeed(e, 'fun', 16); setMood(e, 'hyped'); }
  if (text.includes('game') || text.includes('console') || text.includes('arcade') || text.includes('pool') || text.includes('darts')) { changeNeed(e, 'fun', 18); changeNeed(e, 'social', text.includes('together') ? 12 : 0); changeNeed(e, 'stamina', -3); setMood(e, 'hyped'); }
  if (text.includes('phone') || text.includes('talk')) { changeNeed(e, 'social', 18); setMood(e, 'phone'); }
  if (text.includes('kiss') || text.includes('cuddle') || text.includes('hands')) { changeNeed(e, 'social', 22); setMood(e, 'love'); }
  if (text.includes('pet') || text.includes('train') || text.includes('tickle')) { changeNeed(e, 'fun', 14); setMood(e, e.type === 'dog' ? 'dog' : 'happy'); }
  if (text.includes('feed dog')) { const dog = byId(state, 'dog'); if (dog) changeNeed(dog, 'hunger', 40); }
  if (text.includes('light')) { toggleRoomLight(state, e); }
  state.objectState.fridgeOpen = false;
  state.objectState.fridgeActivity = null;
  state.objectState.doorOpen = false;
  e.action = 'Idle';
  e.actionT = 0;
  e.pose = 'stand';
  e.idleT = 0;
}

function toggleRoomLight(state, entity) {
  const room = entity.floor === 0 ? 'living' : entity.floor === 1 ? 'bedroom' : 'basement_game';
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
  const map = { shower: '🚿', toilet: '🚽', snack: '🍎', meal: '🍳', bring_food: '🍽️', comedy: '😂', horror: '😱', sports: '🏆', phone: '📱', play_game: '🎮', sleep: '😴', nap: '😴', kiss: '😘', cuddle: '🤗', tickle: '😂', hands: '🤝', watch_together: '📺', bed_together: '🛏️', intimacy: '❤️', pet: '🐾', train: '🎾', feed_dog: '🍖', pool_solo: 'POOL', pool_together: 'POOL', arcade: 'ARCADE', arcade_together: 'ARCADE', console_game: 'GAME', console_together: 'GAME', darts: 'DARTS', darts_together: 'DARTS' };
  return map[actionId] || actionId.toUpperCase().slice(0, 8);
}
