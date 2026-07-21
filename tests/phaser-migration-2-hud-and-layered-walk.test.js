import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { wardrobeLayerColorsForTest } from '../src/phaserCharacterAnimationSystem.js';

const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const hudSource = readFileSync(new URL('../src/phaserMigration2HudPlacement.js', import.meta.url), 'utf8');
const paritySource = readFileSync(new URL('../src/phaserMigration2GameplayParityBridge.js', import.meta.url), 'utf8');
const animationSource = readFileSync(new URL('../src/phaserCharacterAnimationSystem.js', import.meta.url), 'utf8');
const catalogSource = readFileSync(new URL('../src/phaserMigration2VisualCatalog.js', import.meta.url), 'utf8');

describe('Phaser Migration 2 HUD and layered directional walking', () => {
  it('keeps time and money in the HUD instead of inside the game canvas', () => {
    const gameWrap = indexSource.match(/<section id="game-wrap">([\s\S]*?)<\/section>/)?.[1] || '';
    const hud = indexSource.match(/<aside id="hud">([\s\S]*?)<\/aside>/)?.[1] || '';
    expect(gameWrap).not.toContain('hud-calendar-pill');
    expect(gameWrap).not.toContain('hud-money-pill');
    expect(hud).toContain('hud-calendar-pill');
    expect(hud).toContain('hud-money-pill');
    expect(mainSource).toContain('installPhaserMigration2HudPlacement');
    expect(hudSource).toContain('scene.statusText.destroy');
    expect(hudSource).toContain('scene.runtimeText.destroy');
  });

  it('removes the duplicate resource strip instead of appending it over the playfield', () => {
    expect(paritySource).toContain("document.getElementById('hud-resource-strip')?.remove()");
    expect(paritySource).not.toContain('wrap.appendChild(strip)');
    expect(paritySource).not.toContain('#hud-resource-strip{position:absolute');
    expect(paritySource).toContain("document.getElementById('hud-money-pill')");
  });

  it('registers complete side-body assets instead of shifting only the head', () => {
    expect(catalogSource).toContain('resident-side-sheet');
    expect(catalogSource).toContain('girlfriend-side-sheet');
    expect(catalogSource).toContain('lab-subject-side-sheet');
    expect(animationSource).toContain("record.visualMode = sideDirection ? 'side' : 'vertical'");
    expect(animationSource).toContain('record.sideSprite.setFlipX(flip)');
    expect(animationSource).toContain('sideAssetsReady');
  });

  it('uses separate top and bottom sprite layers for wardrobe tinting', () => {
    expect(catalogSource).toContain('human-vertical-top-layer');
    expect(catalogSource).toContain('human-vertical-bottom-layer');
    expect(catalogSource).toContain('human-side-top-layer');
    expect(catalogSource).toContain('human-side-bottom-layer');
    expect(animationSource).toContain('record.verticalTop.setTint(colors.top)');
    expect(animationSource).toContain('record.verticalBottom.setTint(colors.bottom)');
    expect(animationSource).toContain('record.sideTop.setTint(colors.top)');
    expect(animationSource).toContain('record.sideBottom.setTint(colors.bottom)');
  });

  it('changes layer colors when the wardrobe day changes', () => {
    const entity = { wardrobe: { currentDay: 0, colors: ['#24324a', '#8a6230'] } };
    const first = wardrobeLayerColorsForTest(entity, 'resident');
    entity.wardrobe.currentDay = 1;
    const second = wardrobeLayerColorsForTest(entity, 'resident');
    expect(first.top).not.toBe(second.top);
    expect(first.bottom).not.toBe(second.bottom);
  });
});
