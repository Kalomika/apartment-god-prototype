import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const backdropSource = readFileSync(new URL('../src/phaserMigration2BackdropSafety.js', import.meta.url), 'utf8');

describe('Phaser Migration 2 non-black backdrop safety', () => {
  it('sets a visible canvas surface before Phaser finishes booting', () => {
    expect(mainSource).toContain("gameCanvas.style.background = '#708078'");
    expect(mainSource).toContain('installPhaserMigration2BackdropSafety');
  });

  it('draws a floor and room fallback behind loaded art', () => {
    expect(backdropSource).toContain('setDepth(-20000)');
    expect(backdropSource).toContain('setDepth(-19000)');
    expect(backdropSource).toContain('fillRoundedRect');
    expect(backdropSource).toContain('setBackgroundColor');
  });

  it('does not use black as a normal floor fallback', () => {
    expect(backdropSource).not.toContain("canvas: '#000000'");
    expect(backdropSource).not.toContain('floor: 0x000000');
  });
});
