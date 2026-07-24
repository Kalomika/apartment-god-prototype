import { describe, expect, it } from 'vitest';
import { resumeEntity, stopEntity } from '../src/state.js';
import {
  defaultActorSpeedForTest,
  hasActivePoolChoreographyForTest,
  normalizeP2ActorMotionForTest,
  prepareActorForManualRecoveryForTest,
  shouldPreferBaseActorVisualForTest,
  wakeVisibleEmbeddedGameForTest
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

  it('clears a nonempty stale pool route after the pool timer ends', () => {
    const actor = normalizeP2ActorMotionForTest({
      id: 'resident', type: 'person', x: 180, y: 180, speed: 84,
      path: [{ x: 320, y: 180 }], poolRoute: { key: 'stale', points: [{ x: 200, y: 180 }] },
      action: 'Walking', actionT: 0, pose: 'walk', currentActionId: 'pool_solo', carrying: 'cue_stick'
    });
    expect(actor.poolRoute).toBeNull();
    expect(actor.currentActionId).toBeNull();
    expect(actor.carrying).toBeNull();
    expect(actor.path).toHaveLength(1);
    expect(hasActivePoolChoreographyForTest(actor)).toBe(false);
  });

  it('clears a completed stale Pool action so it cannot exclude normal movement forever', () => {
    const actor = normalizeP2ActorMotionForTest({
      id: 'resident', type: 'person', x: 180, y: 180, speed: 84,
      path: [], poolRoute: { key: 'finished', points: [{ x: 200, y: 180 }] },
      action: 'Pool: watching balls', actionT: 0, pose: 'pool', currentActionId: 'pool_solo'
    });
    expect(actor.poolRoute).toBeNull();
    expect(hasActivePoolChoreographyForTest(actor)).toBe(false);
    expect(actor.action).toBe('Idle');
    expect(actor.pose).toBe('stand');
    expect(actor.currentActionId).toBeNull();
  });

  it('keeps a real pool route active only while a timed pool activity is active', () => {
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

  it('releases a contradictory manual stop when a real destination exists', () => {
    const actor = normalizeP2ActorMotionForTest({
      type: 'person', stopped: true, manualStop: true, x: 1, y: 1, speed: 92,
      path: [{ x: 20, y: 20 }], action: 'Walking', actionT: 0
    });
    expect(actor.stopped).toBe(false);
    expect(actor.manualStop).toBe(false);
    expect(actor.path).toHaveLength(1);
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

  it('wakes a visible embedded Phaser loop but preserves hidden and terminal failure safety', () => {
    const calls = [];
    const scene = {
      runtimeFailed: false,
      state: { paused: true },
      game: { resume: () => calls.push('game'), loop: { wake: () => calls.push('loop') } },
      scene: { resume: () => calls.push('scene') }
    };
    expect(wakeVisibleEmbeddedGameForTest(scene, false)).toBe(true);
    expect(calls).toEqual(['game', 'loop', 'scene']);
    expect(scene.state.paused).toBe(false);
    expect(wakeVisibleEmbeddedGameForTest(scene, true)).toBe(false);
    scene.runtimeFailed = true;
    expect(wakeVisibleEmbeddedGameForTest(scene, false)).toBe(false);
  });

  it('prepares a stuck actor for the visible manual recovery control', () => {
    const actor = prepareActorForManualRecoveryForTest({
      type: 'person', x: 20, y: 20, speed: 0, stopped: true, manualStop: true,
      poolRoute: { key: 'stale', points: [{ x: 40, y: 40 }] }, action: 'Pool match', actionT: 120,
      actionTotal: 300, currentActionId: 'pool_together', activityObjectId: 'pool_table', carrying: 'cue_stick', pose: 'pool'
    });
    expect(actor.stopped).toBe(false);
    expect(actor.manualStop).toBe(false);
    expect(actor.poolRoute).toBeNull();
    expect(actor.actionT).toBe(0);
    expect(actor.currentActionId).toBeNull();
    expect(actor.activityObjectId).toBeNull();
    expect(actor.carrying).toBeNull();
    expect(actor.action).toBe('Idle');
    expect(actor.pose).toBe('stand');
    expect(actor.speed).toBeGreaterThan(0);
  });

  it('Stop and Resume fully clear pool state before autonomy resumes', () => {
    const actor = {
      path: [{ x: 2, y: 2 }], target: {}, pending: {}, action: 'Pool: circling table', actionT: 30,
      actionTotal: 300, currentActionId: 'pool_solo', activityObjectId: 'pool_table', pose: 'walk',
      poolRoute: { key: 'shot', points: [{ x: 3, y: 3 }] }, carrying: 'cue_stick', vx: 84, vy: 0, stopped: false
    };
    stopEntity(actor);
    expect(actor.stopped).toBe(true);
    expect(actor.manualStop).toBe(true);
    expect(actor.poolRoute).toBeNull();
    expect(actor.currentActionId).toBeNull();
    expect(actor.activityObjectId).toBeNull();
    expect(actor.actionTotal).toBe(0);
    expect(actor.carrying).toBeNull();
    expect(actor.vx).toBe(0);
    resumeEntity(actor);
    expect(actor.stopped).toBe(false);
    expect(actor.manualStop).toBe(false);
    expect(actor.action).toBe('Idle');
    expect(actor.pose).toBe('stand');
  });
});
