export function normalizeRuntimeEntity(entity) {
  entity.path = Array.isArray(entity.path) ? entity.path : [];
  entity.needs ??= {};
  entity.skills ??= {};
  entity.pose ||= 'stand';
  entity.action ||= 'Idle';
  entity.floor = Number.isInteger(entity.floor) ? entity.floor : 0;
  entity.actionT = Number.isFinite(entity.actionT) ? Math.max(0, entity.actionT) : 0;
  entity.actionTotal = Number.isFinite(entity.actionTotal) ? Math.max(0, entity.actionTotal) : 0;
  if (!(entity.actionT > 0)) {
    entity.actionTotal = 0;
    entity.currentActionId = null;
    entity.activityObjectId = null;
  }
  return entity;
}

export const normalizeRuntimeEntityForTest = normalizeRuntimeEntity;
