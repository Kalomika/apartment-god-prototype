import { createState } from './state.js';
import { draw } from './rendering.js';
import { createUi } from './ui.js';
import { updateMovement } from './movement.js';
import { resolveArrival, updateActions } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { updateAutonomy } from './autonomy.js';
import { updateGameActivities } from './activitySystems.js';
import { updateVehicleDeparture } from './vehicleSystem.js';
import { installCameraSwipeNavigation, updateCameraTransition } from './cameraNavigation.js';
import { loadRefreshState, saveRefreshState, updateRefreshAutosave } from './saveSystem.js';

const REFRESH_SAVE_KEY = 'apartment_god_test_refresh_state_v3';

function loadRefreshStateSafely(state) {
  try {
    return loadRefreshState(state);
  } catch (error) {
    console.error('[Apartment God] Bad refresh state skipped so the game can boot.', error);
    try { localStorage.removeItem(REFRESH_SAVE_KEY); } catch (_) {}
    state.saveStatus = { message: 'Skipped bad refresh state' };
    return false;
  }
}

export function bootCanvasGame() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const state = createState();
  loadRefreshStateSafely(state);
  installCameraSwipeNavigation(state, canvas);
  const ui = createUi(state, canvas);

  window.addEventListener('beforeunload', () => saveRefreshState(state));

  let last = performance.now();
  function frame(now) {
    const rawDt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const dt = state.paused ? 0 : rawDt * state.speed;

    updateCameraTransition(state, rawDt);

    if (dt > 0) {
      for (const entity of state.entities) {
        const arrived = updateMovement(state, entity, dt);
        if (arrived) resolveArrival(state, entity);
      }
      updateActions(state, dt);
      updateVehicleDeparture(state, dt);
      updateGameActivities(state, dt);
      updateAutoHooks(state, dt);
      updateAutonomy(state, dt);
      state.time += dt * 0.6;
      updateRefreshAutosave(state, rawDt);
    }

    draw(ctx, state);
    ui.renderHud();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  return { state, ui };
}
