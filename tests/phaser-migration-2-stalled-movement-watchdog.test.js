import { describe, expect, it, vi } from 'vitest';
import {
  advanceFallbackEntityForTest,
  fallbackStepSecondsForTest,
  renderFallbackFrameForTest,
  shouldFallbackStepForTest,
  WATCHDOG_INTERVAL_MS_FOR_TEST
} from '../src/phaserMigration2StalledMovementWatchdog.js';

describe('Phaser Migration 2 stalled movement watchdog', () => {
  const movingActor = () => ({
    id: 'resident', hidden: false, labOnly: false, stopped: false,
    x: 100, y: 100, path: [{ x: 200, y: 100 }]
  });

  it('does not intervene before the bounded stall window expires', () => {
    const actor = movingActor();
    const sample = { x: 100, y: 100, lastMovedAt: 1000, fallbackActive: false };
    expect(shouldFallbackStepForTest(actor, sample, 1119)).toBe(false);
  });

  it('intervenes after a real path remains motionless past the stall window', () => {
    const actor = movingActor();
    const sample = { x: 100, y: 100, lastMovedAt: 1000, fallbackActive: false };
    expect(shouldFallbackStepForTest(actor, sample, 1120)).toBe(true);
  });

  it('continues an already activated fallback while the path remains stalled', () => {
    const actor = movingActor();
    const sample = { x: 100, y: 100, lastMovedAt: 1119, fallbackActive: true };
    expect(shouldFallbackStepForTest(actor, sample, 1120)).toBe(true);
  });

  it('does not duplicate healthy movement when coordinates already changed', () => {
    const actor = movingActor();
    actor.x = 101;
    const sample = { x: 100, y: 100, lastMovedAt: 1000, fallbackActive: false };
    expect(shouldFallbackStepForTest(actor, sample, 1400)).toBe(false);
  });

  it('uses a smooth visible-iframe clock instead of the old 100 millisecond cadence', () => {
    expect(WATCHDOG_INTERVAL_MS_FOR_TEST).toBe(16);
    expect(WATCHDOG_INTERVAL_MS_FOR_TEST).toBeLessThan(25);
  });

  it('uses frame paced fallback steps and the same maximum step as native simulation', () => {
    expect(fallbackStepSecondsForTest(16.667, 1)).toBeCloseTo(0.016667, 4);
    expect(fallbackStepSecondsForTest(16.667, 3)).toBeCloseTo(0.05, 4);
    expect(fallbackStepSecondsForTest(100, 1)).toBe(0.05);
    expect(fallbackStepSecondsForTest(-10, 1)).toBe(0);
    expect(fallbackStepSecondsForTest(16.667, 0)).toBeCloseTo(0.016667, 4);
  });

  it('resolves arrival only after movement reports the route complete', () => {
    const state = {};
    const actor = movingActor();
    const resolve = vi.fn();
    const stillMoving = vi.fn(() => false);
    expect(advanceFallbackEntityForTest(state, actor, 0.016, stillMoving, resolve)).toBe(false);
    expect(resolve).not.toHaveBeenCalled();

    const arrived = vi.fn(() => true);
    expect(advanceFallbackEntityForTest(state, actor, 0.016, arrived, resolve)).toBe(true);
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledWith(state, actor);
  });

  it('contains a render failure without disabling future movement ticks', () => {
    const scene = {
      renderNativeFrame: () => { throw new Error('visual sync failure'); },
      ui: { renderHud: vi.fn() },
      __pm2MovementWatchdogError: ''
    };
    expect(renderFallbackFrameForTest(scene)).toBe(false);
    expect(scene.__pm2MovementWatchdogError).toContain('visual sync failure');
    expect(scene.ui.renderHud).not.toHaveBeenCalled();
  });

  it('does not move actors when the game or actor state prohibits movement', () => {
    const sample = { x: 100, y: 100, lastMovedAt: 1000, fallbackActive: false };

    const pathless = movingActor();
    pathless.path = [];
    expect(shouldFallbackStepForTest(pathless, sample, 1400)).toBe(false);

    const stopped = movingActor();
    stopped.stopped = true;
    expect(shouldFallbackStepForTest(stopped, sample, 1400)).toBe(false);

    const hidden = movingActor();
    hidden.hidden = true;
    expect(shouldFallbackStepForTest(hidden, sample, 1400)).toBe(false);

    const labOnly = movingActor();
    labOnly.labOnly = true;
    expect(shouldFallbackStepForTest(labOnly, sample, 1400)).toBe(false);

    expect(shouldFallbackStepForTest(movingActor(), sample, 1400, true)).toBe(false);
    expect(shouldFallbackStepForTest(movingActor(), sample, 1400, false, true)).toBe(false);
    expect(shouldFallbackStepForTest(movingActor(), sample, 1400, false, false, true)).toBe(false);
  });
});