import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const fitSource = readFileSync(new URL('../src/fit.js', import.meta.url), 'utf8');

describe('Phaser canvas ownership', () => {
  it('marks the canvas before dynamically importing the Phaser runtime', () => {
    const ownershipIndex = mainSource.indexOf("dataset.phaserOwned = 'true'");
    const runtimeImportIndex = mainSource.indexOf("await import('./phaserParityRuntime.js");
    expect(ownershipIndex).toBeGreaterThan(-1);
    expect(runtimeImportIndex).toBeGreaterThan(ownershipIndex);
  });

  it('does not reset canvas dimensions after Phaser owns the canvas', () => {
    expect(fitSource).toContain("canvas.dataset.phaserOwned !== 'true'");
    expect(fitSource).toContain('canvas.width = 960');
    expect(fitSource).toContain('canvas.height = 720');
  });
});
