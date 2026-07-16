const DRIVEWAY_FLOOR = 7;
const GATE_Y = 414;
const OPEN_THRESHOLD = .72;

export function requestGateForApproachingEntities(state, dt) {
  const approaching = (state.entities || []).some(entity => {
    if (!entity || entity.hidden || entity.floor !== DRIVEWAY_FLOOR) return false;
    if (Math.abs(entity.y - GATE_Y) > 130) return false;
    return (entity.path || []).some(point => crossedGate(entity.y, point.y));
  });
  if (!approaching) return;
  state.frontGate ??= { open: 0, requested: false };
  if (!state.frontGate.requested) {
    state.frontGate.requested = true;
    state.frontGate.open = Math.min(1, Number(state.frontGate.open || 0) + dt * 1.8);
  }
}

export function captureGateTraversalState(state) {
  state.gateTraversalSnapshots ??= {};
  for (const entity of state.entities || []) {
    if (!entity || entity.hidden || entity.floor !== DRIVEWAY_FLOOR) continue;
    state.gateTraversalSnapshots[entity.id] = {
      x: entity.x,
      y: entity.y,
      path: Array.isArray(entity.path) ? entity.path.map(point => ({ ...point })) : [],
      target: entity.target ? { ...entity.target } : null,
      pending: entity.pending ? { ...entity.pending } : null,
      moveAllowId: entity.moveAllowId || ''
    };
  }
}

export function enforceGateTraversal(state) {
  const snapshots = state.gateTraversalSnapshots || {};
  const open = Number(state.frontGate?.open || 0);
  for (const entity of state.entities || []) {
    const before = snapshots[entity.id];
    if (!before || entity.hidden || entity.floor !== DRIVEWAY_FLOOR) continue;
    if (!crossedGate(before.y, entity.y) || open >= OPEN_THRESHOLD) continue;
    entity.x = before.x;
    entity.y = before.y;
    entity.path = before.path;
    entity.target = before.target;
    entity.pending = before.pending;
    entity.moveAllowId = before.moveAllowId;
    entity.blockedT = 0;
    entity.recoveryCount = 0;
    entity.action = 'Waiting for driveway gate';
    entity.pose = 'stand';
    entity.stopped = false;
    state.frontGate ??= { open: 0, requested: false };
    state.frontGate.requested = true;
  }
}

function crossedGate(fromY, toY) {
  const northToSouth = fromY < GATE_Y && toY >= GATE_Y;
  const southToNorth = fromY > GATE_Y && toY <= GATE_Y;
  return northToSouth || southToNorth;
}
