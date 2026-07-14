export const GAME_MINUTES_PER_REAL_SECOND = 1;
export const GAME_TIME_SCALE_LABEL = '1 real minute = 1 in game hour';

export function advanceGameClock(state, dt) {
  if (!state || !Number.isFinite(dt) || dt <= 0) return Number.isFinite(state?.time) ? state.time : 0;
  const current = Number.isFinite(state.time) ? state.time : 0;
  state.time = current + dt * GAME_MINUTES_PER_REAL_SECOND;
  return state.time;
}
