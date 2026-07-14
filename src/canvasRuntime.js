import { createState } from './state.js';
import { draw } from './rendering.js';
import { createUi } from './ui.js';
import { updateMovement } from './movement.js';
import { resolveArrival, updateActions } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { updateAutonomy } from './autonomy.js';
import { updateCalendarRuntime } from './calendarRuntime.js';
import { updateLifeQualitySystem } from './lifeQualitySystem.js';
import { installCameraSwipeNavigation, updateCameraTransition } from './cameraNavigation.js';
import { loadRefreshState, saveRefreshState, updateRefreshAutosave } from './saveSystem.js';
import { applyRuntimeRegressionGuards } from './runtimeRegressionGuards.js';
import { updatePoolActivity } from './poolActivitySystem.js';

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
  state.lifeControl ??= { mode: 'semi_auto', pendingChoices: [] };
  state.lifeQuality ??= { lastMonthIndex: null, lastYearIndex: null, reviews: [], yearReviews: [] };
  for (const entity of state.entities) {
    entity.path = Array.isArray(entity.path) ? entity.path : [];
    entity.needs ??= {};
    entity.skills ??= {};
    entity.pose ||= 'stand';
    entity.action ||= 'Idle';
    entity.floor = Number.isInteger(entity.floor) ? entity.floor : 0;
    entity.x = Number.isFinite(entity.x) ? entity.x : 120;
    entity.y = Number.isFinite(entity.y) ? entity.y : 120;
    applyPoseOrientation(entity);
    cleanupStaleActorState(entity);
  }
}

function applyPoseOrientation(entity) {
  if (entity.type !== 'person') return;
  const action = String(entity.action || '').toLowerCase();
  const pose = String(entity.pose || '').toLowerCase();
  const bedPose = pose === 'sleep' || action.includes('sleep') || action.includes('nap') || action.includes('bed together') || action.includes('waking up') || action.includes('king bed');
  if (bedPose) entity.lastHeading = 0;
}

function cleanupStaleActorState(entity) {
  const hasPath = Array.isArray(entity.path) && entity.path.length > 0;
  const hasTarget = Boolean(entity.target || entity.pending);
  const hasTimer = Number(entity.actionT || 0) > 0;
  if (hasPath || hasTarget || hasTimer || entity.hidden) return;
  const action = String(entity.action || '').toLowerCase();
  if (action === 'recovered' || action === 'runtime recovered' || action === 'walking' || action === 'running' || action.startsWith('going to ')) {
    entity.action = 'Idle';
    entity.pose = 'stand';
    entity.blockedT = 0;
    entity.recoveryCount = 0;
  }
  if (['walk', 'sit'].includes(entity.pose) && (action === 'idle' || action === 'walking' || action === 'running' || action === 'recovered')) {
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

function runSimulationStep(state, dt) {
  if (dt <= 0) return;
  updatePoolActivity(state, dt);
  for (const entity of state.entities) {
    const arrived = updateMovement(state, entity, dt);
    if (arrived) resolveArrival(state, entity);
  }
  updateActions(state, dt);
  updateCalendarRuntime(state);
  updateAutoHooks(state, dt);
  updateAutonomy(state, dt);
  state.time += dt * 0.6;
  updateLifeQualitySystem(state);
}

function advanceSimulation(state, rawDt) {
  if (state.paused) return;
  const maxStep = document.hidden ? 0.2 : 0.05;
  const maxCatchup = document.hidden ? 4.0 : 0.2;
  let remaining = Math.min(rawDt * state.speed, maxCatchup);
  let guard = 0;
  while (remaining > 0.0001 && guard < 80) {
    const step = Math.min(maxStep, remaining);
    runSimulationStep(state, step);
    remaining -= step;
    guard += 1;
  }
}

export function bootCanvasGame() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const state = createState();
  loadRefreshStateSafely(state);
  sanitizeRuntimeState(state);
  applyRuntimeRegressionGuards(state);
  installCameraSwipeNavigation(state, canvas);
  const ui = createUi(state, canvas);

  window.addEventListener('beforeunload', () => saveRefreshState(state));
  document.addEventListener('visibilitychange', () => {
    state.backgroundMode = document.hidden;
    if (!document.hidden) state.saveStatus = { message: 'Returned from background' };
  });

  let last = performance.now();
  let lastHiddenTick = performance.now();
  const hiddenTicker = window.setInterval(() => {
    if (!document.hidden || state.paused) return;
    const now = performance.now();
    const elapsed = Math.min(4.0, Math.max(0, (now - lastHiddenTick) / 1000));
    lastHiddenTick = now;
    try {
      sanitizeRuntimeState(state);
      applyRuntimeRegressionGuards(state);
      advanceSimulation(state, elapsed);
      updateRefreshAutosave(state, Math.min(1, elapsed));
    } catch (error) {
      console.error('[Apartment God] Background tick recovered.', error);
    }
  }, 1000);
  window.addEventListener('beforeunload', () => window.clearInterval(hiddenTicker));

  function frame(now) {
    try {
      sanitizeRuntimeState(state);
      applyRuntimeRegressionGuards(state);
      const rawElapsed = Math.max(0, (now - last) / 1000);
      const rawDt = Math.min(document.hidden ? 4.0 : 0.2, rawElapsed);
      last = now;
      if (!document.hidden) lastHiddenTick = now;
      const cameraDt = Math.min(0.05, rawElapsed);

      updateCameraTransition(state, cameraDt);
      if (!document.hidden) advanceSimulation(state, rawDt);
      updateRefreshAutosave(state, cameraDt);

      if (state.skipRecap?.visibleT > 0) state.skipRecap.visibleT -= cameraDt;
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
        if (String(entity.action || '').toLowerCase() === 'recovered') entity.action = 'Idle';
        entity.pose = 'stand';
        entity.blockedT = 0;
        entity.recoveryCount = 0;
      }
      state.saveStatus = { message: 'Runtime error handled' };
      drawBootError(ctx, error);
      if (frameErrorCount > 2) state.paused = true;
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  return { state, ui };
}
