import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { setBaseActorVisualVisible } from '../src/phaserCharacterAnimationSystem.js';
import { preloadReferenceCompletion } from '../src/phaserMigration2ReferenceCompletion.js';

const runtimeSource = readFileSync(new URL('../src/phaserMigration2Runtime.js', import.meta.url), 'utf8');
const activitySource = readFileSync(new URL('../src/phaserMigration2ReferenceCompletion.js', import.meta.url), 'utf8');
const characterSource = readFileSync(new URL('../src/phaserCharacterAnimationSystem.js', import.meta.url), 'utf8');

describe('Phaser Migration 2 perfection runtime corrections', () => {
  it('suppresses and restores the exact base actor record', () => {
    const child = () => ({ setVisible: vi.fn() });
    const record = {
      shadow: child(),
      sprite: child(),
      cue: child(),
      ring: child(),
      label: child(),
      ringWanted: true,
      labelWanted: true,
      suppressedByActivity: false
    };
    const scene = { pm2ActorVisuals: new Map([['resident', record]]) };

    expect(setBaseActorVisualVisible(scene, 'resident', false)).toBe(true);
    expect(record.suppressedByActivity).toBe(true);
    expect(record.sprite.setVisible).toHaveBeenLastCalledWith(false);
    expect(record.ring.setVisible).toHaveBeenLastCalledWith(false);

    expect(setBaseActorVisualVisible(scene, 'resident', true)).toBe(true);
    expect(record.suppressedByActivity).toBe(false);
    expect(record.sprite.setVisible).toHaveBeenLastCalledWith(true);
    expect(record.ring.setVisible).toHaveBeenLastCalledWith(true);
  });

  it('tags every base actor display object with the owning entity ID', () => {
    expect(characterSource).toContain('child.pm2EntityId = entity.id');
    expect(characterSource).toContain('child.pm2ActorRole = role');
  });

  it('does not preload all optional activity and state sheets at boot', () => {
    const scene = {};
    preloadReferenceCompletion(scene);
    expect(scene.pm2ReferenceAssetMode).toBe('lazy-optional');
    expect(activitySource).not.toContain('for (const activity of REFERENCE_HUMAN_ACTIVITIES) for (const actor');
    expect(activitySource).toContain('queueOptionalTexture');
    expect(activitySource).toContain('MAX_ACTIVITY_TEXTURES = 18');
    expect(activitySource).toContain('MAX_STATE_TEXTURES = 10');
  });

  it('binds sleep and routed activities to exact object IDs before nearest fallback', () => {
    expect(activitySource).toContain('entity.sleepObjectId');
    expect(activitySource).toContain('entity.target?.objectId');
    expect(activitySource).not.toContain('activeEntityForObject');
    expect(activitySource).toContain("const activity = activeByObject.get(object.id) || null");
  });

  it('falls back per optional visual instead of failing the whole scene', () => {
    expect(activitySource).toContain('Optional Phaser visual skipped');
    expect(runtimeSource).not.toContain('Required Phaser Migration 2 assets failed');
    expect(runtimeSource).toContain('visual asset failed safely');
    expect(runtimeSource).toContain("'__MISSING'");
  });

  it('enters one terminal recovery state instead of repeating normal updates', () => {
    expect(runtimeSource).toContain('this.runtimeFailed = true');
    expect(runtimeSource).toContain('if (this.runtimeFailed || !this.state) return');
    expect(runtimeSource).toContain('this.scene.pause()');
    expect(runtimeSource).toContain('runtime recovery screen');
  });
});
