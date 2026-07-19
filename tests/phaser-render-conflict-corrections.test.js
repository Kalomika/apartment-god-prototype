import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const parity = readFileSync(new URL('../src/phaserParityCorrections.js', import.meta.url), 'utf8');
const conflicts = readFileSync(new URL('../src/phaserRenderConflictCorrections.js', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

describe('Phaser Render conflict corrections', () => {
  it('derives activity progress from the current action countdown when actionTotal is absent or stale', () => {
    expect(parity).toContain('visual.startRemaining = Math.max(remaining');
    expect(parity).toContain('1 - remaining / total');
  });

  it('uses world coordinates for world-object arcade hit testing', () => {
    expect(parity).toContain('pointer.worldX');
    expect(parity).toContain('pointer.worldY');
    expect(parity).toContain('objectAt(worldX, worldY, state.floor)');
  });

  it('erases the legacy kitchen sink before drawing the preferred sink', () => {
    expect(conflicts).toContain('eraseLegacyKitchenSink');
    expect(conflicts).toContain('drawPreferredKitchenSink');
    expect(conflicts.indexOf('eraseLegacyKitchenSink(scene.environmentContext')).toBeLessThan(
      conflicts.indexOf('drawPreferredKitchenSink(scene.environmentContext')
    );
  });

  it('corrects stationary object-facing without rotating excluded lying and swimming states', () => {
    expect(conflicts).toContain('correctStationaryObjectFacing');
    expect(conflicts).toContain("key.includes('sleep')");
    expect(conflicts).toContain('record.sprite.setRotation(0)');
  });

  it('installs the correction layer from the Phaser entry point', () => {
    expect(main).toContain('installPhaserRenderConflictCorrections(game)');
  });
});
