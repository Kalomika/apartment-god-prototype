import { describe, expect, it } from 'vitest';
import { resumeEntity, stopEntity } from '../src/state.js';
import {
  defaultActorSpeedForTest,
  hasActivePoolChoreographyForTest,
  normalizeP2ActorMotionForTest,
  shouldPreferBaseActorVisualForTest
} from '../src/phaserMigration2CharacterRecovery.js';

describe('Phaser Migration 2 character recovery', () => {
  it('clears an empty stale pool route so normal movement is no longer skipped', () => {
    const actor = {
      id: 'resident', type: 'person', x: 180, y: 180, speed: 92,
      path: [{ x: 260, y: 180 }], poolRoute: { key: 'old', points: [] },
      action: 'Walking', actionT: 0, pose: 'walk', stopped: false
    };
    normalizeP2ActorMotionForTest(actor);
    expect(actor.poolRoute).toBeNull();
    expect(actor.path).toHaveLength(1);
    expect(hasActivePoolChoreographyForTest(actor)).toBe(false);
  });

  it('keeps a real pool route active while it still contains points', () => {
    const actor = {
      type: 'person', x: 180, y: 180, speed: 84,
      path: [], poolRoute: { key: 'shot', points: [{ x: 200, y: 180 }] },
      action: 'Pool: circling table', actionT: 8, pose: 'walk'
    };
    normalizeP2ActorMotionForTest(actor);
    expect(hasActivePoolChoreographyForTest(actor)).toBe(true);
    expect(actor.poolRoute.points).toHaveLength(1);
  });

  it('repairs zero, null, or invalid saved movement speeds', () => {
    const person = normalizeP2ActorMotionForTest({ type: 'person', x: 10, y: 10, speed: 0, path: [], actionT: 0 });
    const dog = normalizeP2ActorMotionForTest({ type: 'dog', x: 10, y: 10, speed: null, path: [], actionT: 0 });
    expect(person.speed).toBe(defaultActorSpeedForTest(person));
    expect(person.speed).toBeGreaterThan(0);
    expect(dog.speed).toBe(defaultActorSpeedForTest(dog));
    expect(dog.speed).toBeGreaterThan(0);
  });

  it('releases a legacy stopped flag but preserves intentional and lab stops', () => {
    const legacy = normalizeP2ActorMotionForTest({ type: 'person', stopped: true, x: 1, y: 1, speed: 92, path: [], actionT: 0 });
    const manual = normalizeP2ActorMotionForTest({ type: 'person', stopped: true, manualStop: true, x: 1, y: 1, speed: 92, path: [], actionT: 0 });
    const lab = normalizeP2ActorMotionForTest({ type: 'person', stopped: true, labOnly: true, x: 1, y: 1, speed: 92, path: [], actionT: 0 });
    expect(legacy.stopped).toBe(false);
    expect(manual.stopped).toBe(true);
    expect(lab.stopped).toBe(true);
  });

  it('clears stale waking and blocked sprite states when no activity or route remains', () => {
    const actor = normalizeP2ActorMotionForTest({
      type: 'person', x: 100, y: 100, speed: 92, path: [], target: null, pending: null,
      action: 'Waking up', pose: 'sleep', actionT: 0, currentActionId: 'sleep', activityObjectId: 'bed', idleT: -4
    });
    expect(actor.action).toBe('Idle');
    expect(actor.pose).toBe('stand');
    expect(actor.currentActionId).toBeNull();
    expect(actor.activityObjectId).toBeNull();
    expect(actor.idleT).toBe(0);
  });

  it('prefers the live directional sprite during movement and after stale activities', () => {
    expect(shouldPreferBaseActorVisualForTest({ hidden: false, path: [{ x: 2, y: 2 }], actionT: 10 })).toBe(true);
    expect(shouldPreferBaseActorVisualForTest({ hidden: false, path: [], vx: 0, vy: 0, actionT: 0 })).toBe(true);
    expect(shouldPreferBaseActorVisualForTest({ hidden: false, path: [], vx: 0, vy: 0, actionT: 10 })).toBe(false);
  });

  it('marks only explicit player stops as persistent manual stops', () => {
    const actor = { path: [{ x: 2, y: 2 }], target: {}, pending: {}, action: 'Walking', actionT: 3, pose: 'walk', stopped: false };
    stopEntity(actor);
    expect(actor.stopped).toBe(true);
    expect(actor.manualStop).toBe(true);
    resumeEntity(actor);
    expect(actor.stopped).toBe(false);
    expect(actor.manualStop).toBe(false);
  });
});
