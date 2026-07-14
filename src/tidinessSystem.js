export function updateHouseTidiness(state) {
  state.tidiness ??= { rooms: {} };
  state.tidiness.rooms ??= {};
  const roomPenalty = Object.values(state.tidiness.rooms).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0) / 4;
  const trashPenalty = Math.max(0, Number(state.garbage?.kitchen) || 0) * 0.65;
  const loosePenalty = Math.max(0, Number(state.garbage?.looseItems?.length) || 0) * 4;
  const platePenalty = Math.max(0, Number(state.meals?.tablePlates?.length) || 0) * 3;
  const score = Math.max(0, Math.min(100, 100 - roomPenalty - trashPenalty - loosePenalty - platePenalty));
  const multiplier = +(0.65 + score / 100 * 0.55).toFixed(3);
  state.tidiness.score = score;
  state.tidiness.activityMultiplier = multiplier;
  for (const entity of state.entities || []) {
    if (entity.type === 'person') entity.houseTidinessMultiplier = multiplier;
  }
}

export function tidinessHudLine(state) {
  const score = Number.isFinite(state.tidiness?.score) ? Math.round(state.tidiness.score) : 100;
  const mult = Number.isFinite(state.tidiness?.activityMultiplier) ? state.tidiness.activityMultiplier.toFixed(2) : '1.20';
  return `House tidiness: ${score}% · home reward x${mult}`;
}
