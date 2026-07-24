import { resolveArrival } from './actions.js';
import { updateMovement } from './movement.js';

const STALL_WINDOW_MS = 350;
const WATCHDOG_INTERVAL_MS = 100;

export function shouldFallbackStepForTest(entity, sample, now, statePaused = false, hidden = false, runtimeFailed = false) {
  if (!entity || entity.hidden || entity.labOnly || entity.stopped || statePaused || hidden || runtimeFailed) return false;
  if (!Array.isArray(entity.path) || entity.path.length === 0) return false;
  if (!sample) return false;
  const moved = Math.hypot(Number(entity.x || 0) - sample.x, Number(entity.y || 0) - sample.y) > .5;
  if (moved) return false;
  return Boolean(sample.fallbackActive) || now - sample.lastMovedAt >= STALL_WINDOW_MS;
}

export function installPhaserMigration2StalledMovementWatchdog(scene) {
  if (!scene || scene.__pm2MovementWatchdogInstalled) return () => {};
  scene.__pm2MovementWatchdogInstalled = true;
  scene.__pm2MovementWatchdogSteps = 0;
  scene.__pm2MovementWatchdogError = '';
  const samples = new Map();

  const tick = () => {
    const state = scene.state;
    if (!state || document.hidden || state.paused || scene.runtimeFailed) return;
    const now = performance.now();
    let stepped = false;

    for (const entity of state.entities || []) {
      if (!entity) continue;
      let sample = samples.get(entity.id);
      if (!sample) {
        sample = { x: Number(entity.x || 0), y: Number(entity.y || 0), lastMovedAt: now, fallbackActive: false };
        samples.set(entity.id, sample);
        continue;
      }

      const moved = Math.hypot(Number(entity.x || 0) - sample.x, Number(entity.y || 0) - sample.y) > .5;
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

      try {
        const simulationSpeed = Number.isFinite(state.speed) && state.speed > 0 ? state.speed : 1;
        updateMovement(state, entity, Math.min(.2, .1 * simulationSpeed));
        resolveArrival(state, entity);
        sample.x = Number(entity.x || 0);
        sample.y = Number(entity.y || 0);
        sample.lastMovedAt = now;
        sample.fallbackActive = Array.isArray(entity.path) && entity.path.length > 0;
        scene.__pm2MovementWatchdogSteps += 1;
        stepped = true;
      } catch (error) {
        scene.__pm2MovementWatchdogError = String(error?.message || error || 'watchdog error');
        console.error('[Apartment God] P2 stalled movement watchdog recovered.', error);
      }
    }

    if (!stepped) return;
    scene.renderNativeFrame?.();
    scene.ui?.renderHud?.();
    const loop = scene.game?.loop;
    if (loop && (!loop.running || loop.sleeping)) loop.tick?.();
  };

  const intervalId = window.setInterval(tick, WATCHDOG_INTERVAL_MS);
  const cleanup = () => {
    window.clearInterval(intervalId);
    samples.clear();
    scene.__pm2MovementWatchdogInstalled = false;
  };
  scene.events?.once?.('shutdown', cleanup);
  scene.events?.once?.('destroy', cleanup);
  return cleanup;
}
