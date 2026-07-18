import { describe, expect, it } from 'vitest';
import { pointerWorldPositionForTest } from '../src/phaserParityCorrections.js';

describe('Phaser arcade pointer mapping', () => {
  it('uses Phaser world coordinates for cabinet hit testing', () => {
    expect(pointerWorldPositionForTest({ x: 120, y: 80, worldX: 420, worldY: 280 })).toEqual({ x: 420, y: 280 });
  });

  it('falls back to screen coordinates when world coordinates are unavailable', () => {
    expect(pointerWorldPositionForTest({ x: 120, y: 80 })).toEqual({ x: 120, y: 80 });
  });
});
