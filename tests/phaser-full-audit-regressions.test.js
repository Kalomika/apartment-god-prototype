import { afterEach, describe, expect, it } from 'vitest';
import { calculateActionProgressForTest } from '../src/phaserParityCorrections.js';
import { normalizeRuntimeEntityForTest } from '../src/phaserParityRuntime.js';
import { installManagedCameraSwipeNavigation, swipeTargetForTest } from '../src/managedCameraSwipeNavigation.js';
import { mergeSavedObjectsForTest, mergeSavedStateForTest } from '../src/saveSystem.js';
import { applyRuntimeObjectCorrections } from '../src/runtimeObjectCorrections.js';
import { getObject } from '../src/world.js';

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;

afterEach(() => {
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
});

describe('Phaser full audit regressions', () => {
  it('advances an activity bar even when actionTotal is absent and resets for a new action', () => {
    const started = calculateActionProgressForTest({}, 'read|desk', 10, 0);
    expect(started.progress).toBe(0);
    expect(started.startRemaining).toBe(10);

    const halfway = calculateActionProgressForTest(started, 'read|desk', 5, 0);
    expect(halfway.progress).toBeCloseTo(0.5);

    const changed = calculateActionProgressForTest(halfway, 'coffee|maker', 4, 0);
    expect(changed.progress).toBe(0);
    expect(changed.startRemaining).toBe(4);
  });

  it('clears stale activity metadata once a timed activity is no longer active', () => {
    const stale = normalizeRuntimeEntityForTest({
      path: [], floor: 0, action: 'Walking to vehicle', pose: 'walk', actionT: 0,
      actionTotal: 300, currentActionId: 'sleep', activityObjectId: 'bed'
    });
    expect(stale.actionTotal).toBe(0);
    expect(stale.currentActionId).toBeNull();
    expect(stale.activityObjectId).toBeNull();

    const active = normalizeRuntimeEntityForTest({
      path: [], floor: 0, action: 'Reading', pose: 'sit', actionT: 8,
      actionTotal: 10, currentActionId: 'read', activityObjectId: 'bookshelf'
    });
    expect(active.currentActionId).toBe('read');
    expect(active.activityObjectId).toBe('bookshelf');
  });

  it('merges an older save with modern nested defaults and preserves newly added entities', () => {
    const defaults = {
      money: 640,
      cleaning: { robotVacuum: { active: true, cleaned: 0 }, crumbs: [] },
      careers: { people: { resident: { level: 1, xp: 0 } }, history: [] },
      entities: [
        { id: 'resident', x: 10, needs: { hunger: 70, energy: 80 }, wardrobe: { currentDay: 1, outfits: ['A'] } },
        { id: 'dog', x: 20, needs: { hunger: 60 } }
      ]
    };
    const oldSave = {
      money: 125,
      entities: [{ id: 'resident', x: 99, needs: { hunger: 12 } }]
    };
    const merged = mergeSavedStateForTest(defaults, oldSave);
    expect(merged.money).toBe(125);
    expect(merged.cleaning.robotVacuum.active).toBe(true);
    expect(merged.careers.people.resident.level).toBe(1);
    expect(merged.entities.find(entity => entity.id === 'resident').needs.energy).toBe(80);
    expect(merged.entities.find(entity => entity.id === 'resident').wardrobe.outfits).toEqual(['A']);
    expect(merged.entities.find(entity => entity.id === 'dog')).toBeTruthy();
  });

  it('keeps new default world objects while restoring saved object changes', () => {
    const defaults = [
      { id: 'sink', x: 10, solid: true },
      { id: 'new_closet', x: 40, solid: false }
    ];
    const saved = [{ id: 'sink', x: 22 }];
    const merged = mergeSavedObjectsForTest(defaults, saved);
    expect(merged.find(object => object.id === 'sink')).toMatchObject({ x: 22, solid: true });
    expect(merged.find(object => object.id === 'new_closet')).toBeTruthy();
  });

  it('keeps the kitchen sink visual anchor and collision anchor identical', () => {
    applyRuntimeObjectCorrections();
    expect(getObject('sink')).toMatchObject({
      x: 665, y: 88, w: 62, h: 52, facing: 'diagonal_in', solid: true, enterable: false
    });
  });

  it('preserves the intended camera swipe map', () => {
    expect(swipeTargetForTest(0, 80, 0, 200)).toEqual({ floor: 3, label: 'Garage West' });
    expect(swipeTargetForTest(0, -80, 0, 200)).toEqual({ floor: 5, label: 'Secret Lab East' });
    expect(swipeTargetForTest(0, 10, 0, 200)).toBeNull();
  });

  it('removes every managed surface listener during scene cleanup', () => {
    const listeners = new Map();
    const surface = {
      addEventListener(type, handler, options) { listeners.set(`${type}:${String(options)}`, handler); },
      removeEventListener(type, handler, options) {
        const key = `${type}:${String(options)}`;
        if (listeners.get(key) === handler) listeners.delete(key);
      }
    };
    globalThis.window = { setTimeout, clearTimeout };
    globalThis.document = { getElementById: () => null };
    const state = { floor: 0, buildPick: null, movePick: null, assign: null, cameraGestureActive: false, suppressNextCanvasClick: false };
    const cleanup = installManagedCameraSwipeNavigation(state, surface);
    expect(listeners.size).toBe(5);
    cleanup();
    expect(listeners.size).toBe(0);
  });
});
