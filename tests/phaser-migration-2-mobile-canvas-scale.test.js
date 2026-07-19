import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const runtime = readFileSync(new URL('../src/phaserMigration2Runtime.js', import.meta.url), 'utf8');
const fit = readFileSync(new URL('../src/fit.js', import.meta.url), 'utf8');

 describe('Phaser Migration 2 mobile canvas scaling', () => {
  it('leaves display sizing to the responsive page instead of Phaser Scale FIT', () => {
    expect(runtime).toContain('mode: Phaser.Scale.NONE');
    expect(runtime).toContain('autoCenter: Phaser.Scale.NO_CENTER');
    expect(runtime).not.toContain('mode: Phaser.Scale.FIT');
    expect(runtime).not.toContain('autoCenter: Phaser.Scale.CENTER_BOTH');
  });

  it('keeps a fixed 960 by 720 game coordinate space with a responsive 4 by 3 display box', () => {
    expect(runtime).toContain('width: PLAY_W');
    expect(runtime).toContain('height: PLAY_H');
    expect(fit).toContain("canvas.style.aspectRatio = '4 / 3'");
    expect(fit).toContain('const displayHeight = Math.round(displayWidth * 3 / 4)');
    expect(fit).toContain("wrap.style.alignItems = 'flex-start'");
  });
});
