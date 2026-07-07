import { startFetchThrow } from './fetchSystem.js';
import { addGarbageFromAction, callDogToYard, continueTrashRun, startTakeTrashOut } from './garbage.js';
import { byId, changeNeed, log, say, setMood } from './state.js';
import { beginVehicleDeparture, beginVehicleReturn } from './vehicleSystem.js';
import { getObject, getStairExit, roomAt } from './world.js';
import { commandObject, commandSocial } from './movement.js';
import { applyOffsiteRewards, canAffordTravel, createOffsiteJob, destinationFor, isDestinationOpen, payForTravel, updateOffsiteJob } from './travelLocations.js';
import { updateInvestments } from './investmentSystem.js';

export function startObjectAction(state, actor, obj, actionId) {
  if (!obj) return;
  if (obj.kind === 'trash_can' && actionId === 'take_trash_out') return startTakeTrashOut(state, actor);
  if (obj.kind === 'kennel' && actionId === 'call_dog_yard') return callDogToYard(state, actor);
  if (actor.type === 'dog' && !['dog_bowl', 'kennel', 'stairs'].includes(obj.kind)) {
    say(actor, 'wo?');
    return log(state, 'The dog can only use dog actions, doors, kennel, and the bowl for now.');
  }
  if (obj.kind === 'stairs') {
    actor.floor = obj.toFloor;
    const dest = getStairExit(obj);
    if (dest) { actor.x = dest.x + dest.w / 2; actor.y = dest.y + dest.h + 34; }
    if (actor.id === 'resident') state.floor = actor.floor;
    actor.action = 'Changed floor'; actor.path = []; actor.target = null; actor.pending = null;
    say(actor, obj.toFloor === 4 ? 'YARD' : obj.toFloor === 3 ? 'GARAGE' : obj.toFloor === 2 ? 'BASE' : obj.toFloor === 1 ? 'UP' : 'MAIN');
    log(state, `${actor.name} used ${obj.label}.`);
    return;
  }
  commandObject(actor, obj, actionId);
  log(state, `${actor.name} is heading to ${obj.label}.`);
}

export function startSocialAction(state, actor, target, socialId) {
  if (actor.floor !== target.floor) { log(state, `${actor.name} needs to be on the same floor as ${target.name}.`); return; }
  if (socialId === 'fetch') {
    state.fetch = { phase: 'call_dog', actorId: actor.id, dogId: target.id, ball: null };
    commandSocial(target, actor, 'fetch_ready'); say(actor, 'COME'); log(state, 'The dog is coming over before fetch starts.'); return;
  }
  commandSocial(actor, target, socialId); log(state, `${actor.name} is moving closer to ${target.name}.`);
}

function beginTimedAction(entity, label, actionId) {
  entity.action = label; entity.actionT = actionDuration(actionId); entity.actionTotal = entity.actionT;
  entity.pose = ['sleep', 'nap', 'bed_together', 'intimacy', 'dog_rest'].includes(actionId) ? 'sleep' : ['watch_tv', 'watch_together', 'comedy', 'horror', 'sports', 'relax', 'toilet', 'desk_work', 'play_game', 'phone', 'shop', 'console_game', 'console_together'].includes(actionId) ? 'sit' : ['treadmill', 'lift_weights', 'heavy_bag', 'swim', 'swim_together'].includes(actionId) ? actionId : 'stand';
}

function actionDuration(actionId) {
  return destinationFor(actionId)?.duration ?? {
    watch_tv: 7, watch_together: 9, comedy: 7, horror: 7, sports: 7, relax: 5, nap: 8, snack: 4, meal: 7,
    bring_food: 6, clean: 6, wash_dishes: 5, brush_teeth: 4, groom: 5, shower: 7, toilet: 4, sleep: 12,
    bed_together: 12, intimacy: 14, desk_work: 8, play_game: 7, phone: 5, shop: 5, feed_dog: 3, toggle_light: 1,
    talk: 4, kiss: 3, cuddle: 6, tickle: 3, hands: 4, pet: 3, train: 5, fetch: 0,
    work: 14, errand: 9, mall: 12, movies: 13, date: 14,
    pool_solo: 14, pool_together: 18, arcade: 8, arcade_together: 10, console_game: 10, console_together: 12, darts: 7, darts_together: 9,
    throw_trash: 3, take_trash_out: 9, dump_trash: 3, treadmill: 10, lift_weights: 10, heavy_bag: 8, swim: 10, swim_together: 12,
    dog_rest: 6, call_dog_yard: 3, drive: 5, maintain_vehicle: 8, bike_trip: 10, motorbike_trip: 8
  }[actionId] ?? 4;
}

function isTogetherAction(actionId) { return actionId === 'watch_together' || actionId === 'bed_together' || actionId === 'intimacy' || actionId.endsWith('_together'); }

export function resolveArrival(state, entity) {
  if (!entity.target) return;
  const target = entity.target; entity.target = null;
  if (target.type === 'object') {
    const obj = getObject(target.objectId); if (!obj) return;
    if (isTogetherAction(target.actionId)) { if (queuePartnerForSharedAction(state, entity, target.actionId, obj)) return; entity.action = 'Idle'; entity.actionT = 0; entity.pose = 'stand'; return; }
    const label = `${obj.label}: ${target.actionId.replaceAll('_', ' ')}`;
    beginTimedAction(entity, label, target.actionId); say(entity, speechFor(target.actionId));
    if (obj.kind === 'fridge') { state.objectState.fridgeOpen = true; state.objectState.fridgeActivity = target.actionId; if (target.actionId === 'snack') entity.carrying = 'snack'; }
    if (obj.kind === 'door') state.objectState.doorOpen = true;
    if (obj.kind === 'tv' || ['watch_tv', 'comedy', 'horror', 'sports'].includes(target.actionId)) { state.tv.on = true; state.tv.channel = target.actionId; if (['watch_tv', 'comedy', 'horror', 'sports'].includes(target.actionId)) entity.carrying = 'popcorn'; }
    return;
  }
  if (target.type === 'social') {
    const other = byId(state, target.targetId); if (!other) return;
    if (target.socialId === 'fetch_ready') { state.fetch = { phase: 'ready', actorId: other.id, dogId: entity.id, ball: null }; say(entity, 'READY'); say(other, 'THROW'); other.carrying = 'ball'; log(state, 'Tap an open floor spot to throw the ball.'); return; }
    beginTimedAction(entity, `${target.socialId} with ${other.name}`, target.socialId); entity.pose = target.socialId;
    other.action = `${target.socialId} with ${entity.name}`; other.actionT = entity.actionT; other.actionTotal = entity.actionT; other.pose = target.socialId;
    say(entity, speechFor(target.socialId)); say(other, speechFor(target.socialId)); other.mood = entity.type === 'dog' ? 'dog' : 'happy';
    if (target.socialId === 'intimacy') { state.roomLights.bedroom = false; state.roomLights.hall = false; log(state, 'The bedroom lights turn off for privacy.'); }
  }
}

function queuePartnerForSharedAction(state, entity, actionId, obj) {
  const partner = state.entities.find(e => e.id !== entity.id && e.type === 'person' && !e.hidden && e.floor === entity.floor);
  if (!partner) { say(entity, 'rn?'); log(state, `${entity.name} needs someone nearby for ${actionId.replaceAll('_', ' ')}.`); return false; }
  const decision = canInviteeJoin(state, entity, partner);
  if (!decision.ok) { if (decision.heard) say(partner, 'not rn'); say(entity, 'rn?'); log(state, `${partner.name} declined ${obj.label}: ${decision.reason}.`); return false; }
  say(partner, 'yeah'); entity.action = `Waiting for ${partner.name}`; entity.actionT = 0; entity.pose = 'stand'; commandSocial(partner, entity, actionId); log(state, `${partner.name} agreed to join ${entity.name} at ${obj.label}.`); return true;
}

function canInviteeJoin(state, actor, invitee) {
  const distance = Math.hypot(invitee.x - actor.x, invitee.y - actor.y);
  const actorRoom = roomAt(actor.x, actor.y, actor.floor)?.id || ''; const inviteeRoom = roomAt(invitee.x, invitee.y, invitee.floor)?.id || '';
  const hearingRange = actorRoom.includes('bath') || inviteeRoom.includes('bath') ? 120 : 260;
  if (distance > hearingRange) return { ok: false, heard: false, reason: 'too far to hear' };
  const current = String(invitee.action || '').toLowerCase();
  if (invitee.path?.length || invitee.actionT > 0) return { ok: false, heard: true, reason: 'busy' };
  if (current.includes('shower') || current.includes('toilet') || current.includes('cooking') || current.includes('eating')) return { ok: false, heard: true, reason: 'busy' };
  if ((invitee.needs?.bladder ?? 100) < 25) return { ok: false, heard: true, reason: 'bathroom need' };
  if ((invitee.needs?.hunger ?? 100) < 25) return { ok: false, heard: true, reason: 'hungry' };
  if ((invitee.needs?.energy ?? 100) < 18) return { ok: false, heard: true, reason: 'tired' };
  return { ok: true, heard: true, reason: 'available' };
}

export function throwFetchBall(state, x, y) { if (!state.fetch || state.fetch.phase !== 'ready') return false; const dog = byId(state, state.fetch.dogId); const actor = byId(state, state.fetch.actorId); if (!dog || !actor) return false; return startFetchThrow(state, actor, dog, x, y); }

export function updateActions(state, dt) {
  for (const e of state.entities) { if (e.hidden) continue; if (e.bubbleT > 0) e.bubbleT -= dt; if (e.actionT > 0) { e.actionT -= dt; if (e.actionT <= 0) finishAction(state, e); } }
  updateInvestments(state, dt);
  if (state.offsite) { state.time += dt * 22; if (updateOffsiteJob(state, dt)) finishOffsite(state); }
  state.tv.pulse += dt;
}

function finishAction(state, e) {
  const text = String(e.action || '').toLowerCase(); const continued = continueTrashRun(state, e, text); if (continued && text.includes('take trash out')) return;
  if (text.includes('snack')) { changeNeed(e, 'hunger', 18); setMood(e, 'happy'); addGarbageFromAction(state, 'snack', e); }
  if (text.includes('meal')) { changeNeed(e, 'hunger', 30); changeNeed(e, 'fun', 4); setMood(e, 'happy'); addGarbageFromAction(state, 'meal', e); }
  if (text.includes('bring food')) { changeNeed(e, 'social', 5); setMood(e, 'happy'); }
  if (text.includes('shower')) { changeNeed(e, 'freshness', 36); setMood(e, 'calm'); }
  if (text.includes('brush')) { changeNeed(e, 'freshness', 12); setMood(e, 'calm'); }
  if (text.includes('groom')) { changeNeed(e, 'freshness', 18); setMood(e, 'calm'); }
  if (text.includes('toilet')) { changeNeed(e, 'bladder', 36); setMood(e, 'calm'); }
  if (text.includes('sleep') || text.includes('nap') || text.includes('bed together')) { changeNeed(e, 'energy', 32); changeNeed(e, 'stamina', 24); setMood(e, 'calm'); }
  if (text.includes('intimacy')) { changeNeed(e, 'social', 30); changeNeed(e, 'fun', 10); setMood(e, 'love'); }
  if (text.includes('tv') || text.includes('comedy')) { changeNeed(e, 'fun', 20); setMood(e, 'happy'); addGarbageFromAction(state, 'popcorn', e); }
  if (text.includes('horror')) { changeNeed(e, 'fun', 14); setMood(e, 'spooked'); addGarbageFromAction(state, 'popcorn', e); }
  if (text.includes('sports')) { changeNeed(e, 'fun', 16); setMood(e, 'hyped'); addGarbageFromAction(state, 'popcorn', e); }
  if (text.includes('game') || text.includes('console') || text.includes('arcade') || text.includes('pool') || text.includes('darts') || text.includes('chess')) { changeNeed(e, 'fun', 18); changeNeed(e, 'social', text.includes('together') ? 12 : 0); changeNeed(e, 'stamina', -3); setMood(e, 'hyped'); }
  if (text.includes('treadmill') || text.includes('lift weights') || text.includes('heavy bag')) { changeNeed(e, 'stamina', -12); changeNeed(e, 'fun', 8); changeNeed(e, 'freshness', -8); setMood(e, 'hyped'); }
  if (text.includes('swim')) { changeNeed(e, 'stamina', -7); changeNeed(e, 'fun', 18); changeNeed(e, 'freshness', 8); setMood(e, 'happy'); }
  if (text.includes('phone') || text.includes('talk')) { changeNeed(e, 'social', 18); setMood(e, 'phone'); }
  if (text.includes('kiss') || text.includes('cuddle') || text.includes('hands')) { changeNeed(e, 'social', 22); setMood(e, 'love'); }
  if (text.includes('pet') || text.includes('train') || text.includes('tickle')) { changeNeed(e, 'fun', 14); setMood(e, e.type === 'dog' ? 'dog' : 'happy'); }
  if (text.includes('dog rest')) { changeNeed(e, 'energy', 12); setMood(e, 'dog'); }
  if (text.includes('feed dog')) { const dog = byId(state, 'dog'); if (dog) changeNeed(dog, 'hunger', 40); }
  if (text.includes('light')) toggleRoomLight(state, e);
  state.objectState.fridgeOpen = false; state.objectState.fridgeActivity = null; state.objectState.doorOpen = false; e.action = 'Idle'; e.actionT = 0; e.pose = 'stand'; e.idleT = 0;
}

function toggleRoomLight(state, entity) { const room = roomAt(entity.x, entity.y, entity.floor)?.id || (entity.floor === 0 ? 'living' : entity.floor === 1 ? 'bedroom' : entity.floor === 2 ? 'basement_game' : entity.floor === 3 ? 'garage_bay' : 'yard'); state.roomLights[room] = !state.roomLights[room]; state.bill += state.roomLights[room] ? 1 : -1; }

export function startOffsite(state, actor, actionId, invitedIds = []) {
  const destination = destinationFor(actionId);
  if (destination && !isDestinationOpen(state, destination)) { log(state, `${destination.label} is closed right now.`); say(actor, 'CLOSED'); return false; }
  if (destination && !canAffordTravel(state, destination)) { say(actor, 'BROKE'); return false; }
  if (destination && !payForTravel(state, destination)) { say(actor, 'BROKE'); return false; }
  const party = buildParty(state, actor, invitedIds, actionId);
  const partyIds = party.map(e => e.id);
  state.offsite = createOffsiteJob(actionId, partyIds, 'car_1');
  for (const e of party) { e.hidden = true; e.action = actionId; e.path = []; say(e, 'GO'); }
  state.objectState.doorOpen = true;
  beginVehicleDeparture(state, actionId, partyIds);
  log(state, `${actor.name} left for ${state.offsite.label} with ${party.length - 1} guest(s).`);
  return true;
}

function buildParty(state, actor, invitedIds, actionId) { const party = [actor]; for (const id of invitedIds || []) { const e = byId(state, id); if (!e || e.id === actor.id || e.hidden) continue; if (e.type === 'dog' && !['errand', 'mall', 'date', 'movies', 'dog_park', 'vacation_camping', 'vacation_beach'].includes(actionId)) continue; const current = String(e.action || '').toLowerCase(); const urgent = e.actionT > 0 || e.path?.length || current.includes('toilet') || current.includes('shower') || (e.needs?.bladder ?? 100) < 25 || (e.needs?.hunger ?? 100) < 20; if (urgent) { say(e, 'not rn'); log(state, `${e.name} declined ${actionId.replaceAll('_', ' ')}.`); continue; } say(e, 'yeah'); party.push(e); } return party; }
function finishOffsite(state) { const job = state.offsite; if (!job) return; applyOffsiteRewards(state, job); beginVehicleReturn(state, job.actionId, job.actors || [], job.vehicleId || state.objectState.vehicleInUse || 'car_1'); state.offsite = null; state.objectState.doorOpen = false; }
function speechFor(actionId) { const map = { shower: '🚿', toilet: '🚽', snack: '🍎', meal: '🍳', bring_food: '🍽️', comedy: '😂', horror: '😱', sports: '🏆', phone: '📱', play_game: '🎮', sleep: '😴', nap: '😴', kiss: '😘', cuddle: '🤗', tickle: '😂', hands: '🤝', watch_together: '📺', bed_together: '🛏️', intimacy: '❤️', pet: '🐾', train: '🎾', feed_dog: '🍖', pool_solo: 'POOL', pool_together: 'POOL', arcade: 'ARCADE', arcade_together: 'ARCADE', console_game: 'GAME', console_together: 'GAME', chess: 'CHESS', darts: 'DARTS', darts_together: 'DARTS', treadmill: 'RUN', lift_weights: 'LIFT', heavy_bag: 'PUNCH', swim: 'SWIM', swim_together: 'SWIM', take_trash_out: 'TRASH', dump_trash: 'DUMP', throw_trash: 'TOSS', wash_dishes: 'WASH', dog_rest: 'KENNEL', call_dog_yard: 'YARD', drive: 'CAR', bike_trip: 'BIKE', motorbike_trip: 'MOTO' }; return map[actionId] || actionId.toUpperCase().slice(0, 8); }
