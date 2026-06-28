import { startObjectAction } from './actions.js';
import { log, say } from './state.js';
import { getObject } from './world.js';

export function startSharedObjectAction(state, actor, objectId, actionId) {
  const obj = getObject(objectId);
  if (!obj) return false;
  const partner = state.entities.find(e => e.id !== actor.id && e.type === 'person' && !e.hidden);
  if (!partner) {
    log(state, `${actor.name} has no available partner for ${actionId.replaceAll('_', ' ')}.`);
    startObjectAction(state, actor, obj, actionId);
    return true;
  }

  startObjectAction(state, actor, obj, actionId);
  startObjectAction(state, partner, obj, actionId);
  actor.sharedWith = partner.id;
  partner.sharedWith = actor.id;
  say(actor, 'COME');
  say(partner, 'OK');
  log(state, `${actor.name} called ${partner.name} for ${actionId.replaceAll('_', ' ')}.`);
  return true;
}
