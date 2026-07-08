import { startObjectAction } from './actions.js';
import { guidedInterrupt } from './guidedControl.js';
import { log, say } from './state.js';
import { getObject } from './world.js';

export function forceObjectAction(state, actor, obj, actionId) {
  if (!state || !actor || !obj) return false;
  guidedInterrupt(state, actor);
  return startObjectAction(state, actor, obj, actionId, { force: true });
}

export function forceSharedObjectAction(state, actor, objectId, actionId) {
  const obj = getObject(objectId);
  if (!state || !actor || !obj) return false;
  guidedInterrupt(state, actor);
  if (!isSharedAction(actionId)) return startObjectAction(state, actor, obj, actionId, { force: true });

  const partner = state.entities.find(e => e.id !== actor.id && e.type === 'person' && !e.hidden);
  if (!partner) {
    say(actor, 'ALONE');
    log(state, `No available partner for ${actionId.replaceAll('_', ' ')}.`);
    return startObjectAction(state, actor, obj, soloFallback(actionId), { force: true });
  }

  guidedInterrupt(state, partner);
  if (partner.floor === obj.floor) {
    const startedPartner = startObjectAction(state, partner, obj, actionId, { force: true, fromSharedForce: true });
    const startedActor = startObjectAction(state, actor, obj, actionId, { force: true, fromSharedForce: true });
    say(actor, 'TOGETHER');
    say(partner, 'OK');
    log(state, `${actor.name} and ${partner.name} are doing ${actionId.replaceAll('_', ' ')} together.`);
    return Boolean(startedActor || startedPartner);
  }

  const startedPartner = startObjectAction(state, partner, obj, actionId, { force: true, fromSharedForce: true });
  const startedActor = startObjectAction(state, actor, obj, actionId, { force: true, fromSharedForce: true });
  say(actor, 'TOGETHER');
  say(partner, 'COMING');
  log(state, `${actor.name} and ${partner.name} are going to ${obj.label} together.`);
  return Boolean(startedActor || startedPartner);
}

function isSharedAction(actionId) {
  return actionId === 'watch_together' || actionId === 'bed_together' || actionId === 'intimacy' || String(actionId || '').endsWith('_together') || actionId === 'soccer_match';
}

function soloFallback(actionId) {
  const map = {
    watch_together: 'watch_tv',
    bed_together: 'sleep',
    pool_together: 'pool_solo',
    arcade_together: 'arcade',
    console_together: 'console_game',
    darts_together: 'darts',
    swim_together: 'swim',
    soccer_match: 'soccer_practice'
  };
  return map[actionId] || actionId;
}
