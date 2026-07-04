import { updateFreshAir } from './blueprint.js';
import { updateAppointments } from './buildRequests.js';
import { updateCellPhone } from './cellPhone.js';
import { updateCooking } from './cooking.js';
import { updateDelivery } from './economy.js';
import { updateFetch } from './fetchSystem.js';
import { updateMusic } from './music.js';
import { updateMoveJob } from './objectMove.js';
import { updateAutosave } from './saveSystem.js';
import { runRoutines, updateTraining } from './training.js';

export function updateAutoHooks(state, dt) {
  if (state.viewHoldT > 0) state.viewHoldT = Math.max(0, state.viewHoldT - dt);
  updateFreshAir(state, dt);
  updateCooking(state);
  updateDelivery(state, dt);
  updateFetch(state);
  updateMusic(state);
  updateTraining(state);
  updateMoveJob(state);
  updateAppointments(state, dt);
  updateCellPhone(state, dt);
  updateAutosave(state, dt);
  runRoutines(state);
}
