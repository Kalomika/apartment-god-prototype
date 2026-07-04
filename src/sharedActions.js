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

  actor.sharedWith = partner.id;
  partner.sharedWith = actor.id;
  say(actor, 'rn?');
  startObjectAction(state, actor, obj, actionId);
  log(state, `${actor.name} is heading to ${obj.label} before inviting ${partner.name} for ${actionId.replaceAll('_', ' ')}.`);
  return true;
}
