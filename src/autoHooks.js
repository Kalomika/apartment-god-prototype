import { updateAppointments } from './buildRequests.js';
import { updateMoveJob } from './objectMove.js';
import { runRoutines, updateTraining } from './training.js';

export function updateAutoHooks(state, dt) {
  updateTraining(state);
  updateMoveJob(state);
  updateAppointments(state, dt);
  runRoutines(state);
}
