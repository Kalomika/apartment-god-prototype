import { updateFreshAir } from './blueprint.js';
import { updateAppointments } from './buildRequests.js';
import { updateMoveJob } from './objectMove.js';
import { runRoutines, updateTraining } from './training.js';

export function updateAutoHooks(state, dt) {
  if (state.viewHoldT > 0) state.viewHoldT = Math.max(0, state.viewHoldT - dt);
  updateFreshAir(state, dt);
  updateTraining(state);
  updateMoveJob(state);
  updateAppointments(state, dt);
  runRoutines(state);
}
