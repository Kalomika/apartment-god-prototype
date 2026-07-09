import { createState } from './state.js';
import { draw } from './rendering.js';
import { createUi } from './ui.js';
import { updateMovement } from './movement.js';
import { resolveArrival, updateActions } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { updateAutonomy } from './autonomy.js';
import { installCameraSwipeNavigation, updateCameraTransition } from './cameraNavigation.js';
import { loadRefreshState, saveRefreshState, updateRefreshAutosave } from './saveSystem.js';

const REFRESH_SAVE_KEY = 'apartment_god_test_refresh_state_v3';
let frameErrorCount = 0;

function loadRefreshStateSafely(state) {
  try {
    return loadRefreshState(state);
  } catch (error) {
    console.error('[Apartment God] Bad refresh state skipped so the game can boot.', error);
    clearBadRefreshState();
    state.saveStatus = { message: 'Skipped bad refresh state' };
    return false;
  }
}

function clearBadRefreshState() {
  try { localStorage.removeItem(REFRESH_SAVE_KEY); } catch (_) {}
}

function sanitizeRuntimeState(state) {
  state.entities = Array.isArray(state.entities) ? state.entities : [];
  state.speed = Number.isFinite(state.speed) && state.speed > 0 ? state.speed : 1;
  state.time = Number.isFinite(state.time) ? state.time : 0;
  state.floor = Number.isInteger(state.floor) ? state.floor : 0;
  state.objectState ??= {};
  state.roomLights ??= {};
  state.notifications = Array.isArray(state.notifications) ? state.notifications : [];
  for (const entity of state.entities) {
    entity.path = Array.isArray(entity.path) ? entity.path : [];
    entity.needs ??= {};
    entity.skills ??= {};
    entity.pose ||= 'stand';
    entity.action ||= 'Idle';
    entity.floor = Number.isInteger(entity.floor) ? entity.floor : 0;
    entity.x = Number.isFinite(entity.x) ? entity.x : 120;
    entity.y = Number.isFinite(entity.y) ? entity.y : 120;
    cleanupStaleActorState(entity);
  }
}

function cleanupStaleActorState(entity) {
  const hasPath = Array.isArray(entity.path) && entity.path.length > 0;
  const hasTarget = Boolean(entity.target || entity.pending);
  const hasTimer = Number(entity.actionT || 0) > 0;
  if (hasPath || hasTarget || hasTimer || entity.hidden) return;
  const action = String(entity.action || '').toLowerCase();
  if (action === 'walking' || action === 'running' || action.startsWith('going to ')) {
    entity.action = 'Idle';
    entity.pose = 'stand';
    entity.blockedT = 0;
    entity.recoveryCount = 0;
  }
  if (['walk', 'sit'].includes(entity.pose) && (action === 'idle' || action === 'walking' || action === 'running')) {
    entity.pose = 'stand';
  }
}

function drawBootError(ctx, error) {
  try {
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#171a22';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#f1c66a';
    ctx.font = '900 28px system-ui';
    ctx.fillText('Apartment God recovered from a runtime error', 32, 70);
    ctx.fillStyle = '#f0f2f7';
    ctx.font = '700 18px system-ui';
    ctx.fillText('Refresh once. If this stays, press Reset after the UI loads.', 32, 106);
    ctx.fillStyle = '#aab2c5';
    ctx.font = '600 14px system-ui';
    ctx.fillText(String(error?.message || error || 'Unknown error').slice(0, 120), 32, 142);
    ctx.restore();
  } catch (_) {}
}

export function bootCanvasGame() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const state = createState();
  loadRefreshStateSafely(state);
  sanitizeRuntimeState(state);
  installCameraSwipeNavigation(state, canvas);
  const ui = createUi(state, canvas);

  window.addEventListener('beforeunload', () => saveRefreshState(state));

  let last = performance.now();
  function frame(now) {
    try {
      sanitizeRuntimeState(state);
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
        updateAutoHooks(state, dt);
        updateAutonomy(state, dt);
        state.time += dt * 0.6;
        updateRefreshAutosave(state, rawDt);
      }

      draw(ctx, state);
      ui.renderHud();
    } catch (error) {
      frameErrorCount += 1;
      console.error('[Apartment God] Frame recovered instead of blanking.', error);
      clearBadRefreshState();
      sanitizeRuntimeState(state);
      for (const entity of state.entities) {
        entity.path = [];
        entity.target = null;
        entity.pending = null;
        entity.action = 'Recovered';
        entity.pose = 'stand';
      }
      state.saveStatus = { message: 'Recovered from runtime error' };
      drawBootError(ctx, error);
      if (frameErrorCount > 2) state.paused = true;
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  return { state, ui };
}
