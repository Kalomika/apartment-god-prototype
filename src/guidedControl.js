export function guidedInterrupt(state, actor) {
  if (!actor || state?.autonomyMode !== 'guided') return false;
  actor.path = [];
  actor.target = null;
  actor.pending = null;
  actor.queuedTask = null;
  actor.actionT = 0;
  actor.actionTotal = 0;
  actor.blockedT = 0;
  actor.recoveryCount = 0;
  actor.stopped = false;
  actor.action = 'Guided';
  actor.pose = 'stand';
  if (!actor.carrying || !String(actor.carrying).includes('luggage')) actor.carrying = null;
  return true;
}
