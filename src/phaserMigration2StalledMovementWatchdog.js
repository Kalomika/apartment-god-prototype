import { resolveArrival } from './actions.js';
import { updateMovement } from './movement.js';

const STALL_WINDOW_MS = 120;
const MAX_FALLBACK_STEP_SECONDS = 0.05;
const MOVEMENT_EPSILON = 0.35;
export const WATCHDOG_INTERVAL_MS_FOR_TEST = 16;

export function fallbackStepSecondsForTest(elapsedMs, simulationSpeed = 1) {
  const elapsedSeconds = Math.max(0, Number(elapsedMs || 0)) / 1000;
  const speed = Number.isFinite(simulationSpeed) && simulationSpeed > 0 ? simulationSpeed : 1;
  return Math.min(MAX_FALLBACK_STEP_SECONDS, elapsedSeconds * speed);
}

export function shouldFallbackStepForTest(entity, sample, now, statePaused = false, hidden = false, runtimeFailed = false) {
  if (!entity || entity.hidden || entity.labOnly || entity.stopped || statePaused || hidden || runtimeFailed) return false;
  if (!Array.isArray(entity.path) || entity.path.length === 0) return false;
  if (!sample) return false;
  const moved = Math.hypot(Number(entity.x || 0) - sample.x, Number(entity.y || 0) - sample.y) > MOVEMENT_EPSILON;
  if (moved) return false;
  return Boolean(sample.fallbackActive) || now - sample.lastMovedAt >= STALL_WINDOW_MS;
}

export function advanceFallbackEntityForTest(state, entity, dt, movementUpdater = updateMovement, arrivalResolver = resolveArrival) {
  const arrived = Boolean(movementUpdater(state, entity, dt));
  if (arrived) arrivalResolver(state, entity);
  return arrived;
}

export function renderFallbackFrameForTest(scene) {
  try {
    scene.renderNativeFrame?.();
    scene.ui?.renderHud?.();
    return true;
  } catch (error) {
    scene.__pm2MovementWatchdogError = String(error?.message || error || 'watchdog render error');
    return false;
  }
}

export function installPhaserMigration2StalledMovementWatchdog(scene) {
  if (!scene || scene.__pm2MovementWatchdogInstalled) return () => {};
  scene.__pm2MovementWatchdogInstalled = true;
  scene.__pm2MovementWatchdogSteps = 0;
  scene.__pm2MovementWatchdogError = '';
  scene.__pm2MovementWatchdogActive = false;
  scene.__pm2MovementWatchdogMaxJump = 0;
  const samples = new Map();
  let previousTickAt = performance.now();

  const tick = () => {
    const now = performance.now();
    try {
      const elapsedMs = Math.min(50, Math.max(0, now - previousTickAt));
      previousTickAt = now;
      const state = scene.state;
      let stepped = false;
      let fallbackActive = false;

      if (state && !document.hidden && !state.paused && !scene.runtimeFailed) {
        for (const entity of state.entities || []) {
          if (!entity) continue;
          let sample = samples.get(entity.id);
          if (!sample) {
            sample = { x: Number(entity.x || 0), y: Number(entity.y || 0), lastMovedAt: now, fallbackActive: false };
            samples.set(entity.id, sample);
            continue;
          }

          const moved = Math.hypot(Number(entity.x || 0) - sample.x, Number(entity.y || 0) - sample.y) > MOVEMENT_EPSILON;
          if (moved) {
            sample.x = Number(entity.x || 0);
            sample.y = Number(entity.y || 0);
            sample.lastMovedAt = now;
            sample.fallbackActive = false;
            continue;
          }

          if (!Array.isArray(entity.path) || entity.path.length === 0 || entity.hidden || entity.labOnly || entity.stopped) {
            sample.lastMovedAt = now;
            sample.fallbackActive = false;
            continue;
          }

          if (!shouldFallbackStepForTest(entity, sample, now, state.paused, document.hidden, scene.runtimeFailed)) continue;
          fallbackActive = true;

          try {
            const dt = fallbackStepSecondsForTest(elapsedMs, state.speed);
            if (dt <= 0) continue;
            const beforeX = Number(entity.x || 0);
            const beforeY = Number(entity.y || 0);
            advanceFallbackEntityForTest(state, entity, dt);
            const jump = Math.hypot(Number(entity.x || 0) - beforeX, Number(entity.y || 0) - beforeY);
            scene.__pm2MovementWatchdogMaxJump = Math.max(Number(scene.__pm2MovementWatchdogMaxJump || 0), jump);
            sample.x = Number(entity.x || 0);
            sample.y = Number(entity.y || 0);
            sample.lastMovedAt = now;
            sample.fallbackActive = Array.isArray(entity.path) && entity.path.length > 0;
            scene.__pm2MovementWatchdogSteps += 1;
            stepped = true;
          } catch (error) {
            scene.__pm2MovementWatchdogError = String(error?.message || error || 'watchdog movement error');
            console.error('[Apartment God] P2 stalled movement watchdog recovered.', error);
          }
        }
      }

      scene.__pm2MovementWatchdogActive = fallbackActive;
      if (stepped) renderFallbackFrameForTest(scene);
    } catch (error) {
      scene.__pm2MovementWatchdogError = String(error?.message || error || 'watchdog frame error');
      console.error('[Apartment God] P2 movement watchdog frame recovered.', error);
    }
  };

  const intervalId = window.setInterval(tick, WATCHDOG_INTERVAL_MS_FOR_TEST);
  const cleanup = () => {
    window.clearInterval(intervalId);
    samples.clear();
    scene.__pm2MovementWatchdogInstalled = false;
    scene.__pm2MovementWatchdogActive = false;
  };
  scene.events?.once?.('shutdown', cleanup);
  scene.events?.once?.('destroy', cleanup);
  return cleanup;
}