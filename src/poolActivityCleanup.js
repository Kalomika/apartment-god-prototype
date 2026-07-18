export function cleanupInactivePoolChoreography(state) {
  const activeIds = new Set(state.poolGame?.activeActorIds || []);
  for (const entity of state.entities || []) {
    const hasPoolState = Boolean(entity.poolRoute) || String(entity.action || '').toLowerCase().startsWith('pool:') || entity.carrying === 'cue_stick';
    if (!hasPoolState) continue;
    const stillActive = activeIds.has(entity.id) && Number(entity.actionT || 0) > 0;
    if (stillActive) continue;
    entity.poolRoute = null;
    entity.vx = 0;
    entity.vy = 0;
    if (entity.carrying === 'cue_stick') entity.carrying = null;
    if (String(entity.action || '').toLowerCase().startsWith('pool:')) entity.action = 'Idle';
    if (entity.pose === 'pool' || entity.pose === 'walk') entity.pose = 'stand';
  }
}
