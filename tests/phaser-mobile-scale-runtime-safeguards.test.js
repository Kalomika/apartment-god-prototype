import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const runtimeSource = readFileSync(new URL('../src/phaserParityRuntime.js', import.meta.url), 'utf8');

describe('mobile scale repair preserves runtime safeguards', () => {
  it('keeps the intended Phaser mobile scale configuration', () => {
    expect(runtimeSource).toContain("parent: 'game-wrap'");
    expect(runtimeSource).toContain('mode: Phaser.Scale.FIT');
    expect(runtimeSource).toContain('autoCenter: Phaser.Scale.NO_CENTER');
    expect(runtimeSource).toContain('expandParent: false');
  });

  it('retains fixed step simulation and catchup limits', () => {
    expect(runtimeSource).toContain('function runSimulationStep(state, dt)');
    expect(runtimeSource).toContain("const maximumStep = document.hidden ? .2 : .05");
    expect(runtimeSource).toContain("const maximumCatchup = document.hidden ? 4 : .2");
    expect(runtimeSource).toContain('while (remaining > .0001 && guard < 80)');
  });

  it('does not feed normal movement into active pool choreography', () => {
    expect(runtimeSource).toContain("const poolChoreography = Array.isArray(entity.poolRoute?.points) || String(entity.action || '').toLowerCase().startsWith('pool:')");
    expect(runtimeSource).toContain('if (poolChoreography) continue');
  });

  it('normalizes old save coordinates and clears stale actor movement state', () => {
    expect(runtimeSource).toContain('entity.x = Number.isFinite(entity.x) ? entity.x : 120');
    expect(runtimeSource).toContain('entity.y = Number.isFinite(entity.y) ? entity.y : 120');
    expect(runtimeSource).toContain('cleanupStaleActorState(entity)');
    expect(runtimeSource).toContain("action.startsWith('going to ')");
  });
});
