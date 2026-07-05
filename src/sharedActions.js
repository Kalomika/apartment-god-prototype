import { startObjectAction } from './actions.js';
import { markPhoneActivity } from './cellPhone.js';
import { log, say } from './state.js';
import { getObject } from './world.js';

export function startSharedObjectAction(state, actor, objectId, actionId, options = {}) {
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
  if (options.phoneInvite) {
    markPhoneActivity(state, actor, 'calling invite', 7);
    markPhoneActivity(state, partner, 'incoming invite', 5);
    actor.sharedInviteByPhone = true;
    partner.sharedInviteByPhone = true;
    say(actor, 'rn?');
    say(partner, 'rn?', 1.5);
  } else {
    actor.sharedInviteByPhone = false;
    partner.sharedInviteByPhone = false;
    say(actor, 'rn?');
  }
  startObjectAction(state, actor, obj, actionId);
  log(state, `${actor.name} is heading to ${obj.label} before inviting ${partner.name} for ${actionId.replaceAll('_', ' ')}${options.phoneInvite ? ' by phone' : ''}.`);
  return true;
}
