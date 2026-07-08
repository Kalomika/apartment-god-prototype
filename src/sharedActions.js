import { startObjectAction } from './actions.js';
import { log, say } from './state.js';
import { getObject } from './world.js';

export function startSharedObjectAction(state, actor, objectId, actionId) {
  const obj = getObject(objectId);
  if (!obj) {
    say(actor, 'NO');
    log(state, `Missing object for ${actionId.replaceAll('_', ' ')}.`);
    return false;
  }

  const force = state?.autonomyMode === 'guided';
  startObjectAction(state, actor, obj, actionId, { force });
  if (actionId.endsWith('_together') || actionId === 'watch_together' || actionId === 'bed_together' || actionId === 'intimacy') {
    say(actor, force ? 'TOGETHER' : 'ASK');
    log(state, force ? `${actor.name} is forcing ${actionId.replaceAll('_', ' ')} in test mode.` : `${actor.name} is asking someone to join ${actionId.replaceAll('_', ' ')}.`);
  }
  return true;
}
