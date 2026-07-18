import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { installFrontYardWorld, FRONT_YARD_FLOOR, DRIVEWAY_FLOOR } from '../src/frontYardDriveway.js';
import { floors, getObject } from '../src/world.js';

const runtimeSource = readFileSync(new URL('../src/phaserMigration2Runtime.js', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const uiSource = readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8');
const visualSource = readFileSync(new URL('../src/phaserMigration2GameplayVisuals.js', import.meta.url), 'utf8');

describe('Phaser Migration 2 full main gameplay synchronization', () => {
  it('preserves the native P2 boot instead of the main compatibility renderer', () => {
    expect(mainSource).toContain('bootPhaserMigration2Game');
    expect(mainSource).not.toContain('bootPhaserParityGame');
    expect(runtimeSource).toContain('createApartmentGodNativeScene');
    expect(runtimeSource).not.toContain('drawPhaserEnvironment');
    expect(runtimeSource).not.toContain('textures.addCanvas');
    expect(runtimeSource).toContain("import('../vendor/phaser.esm.js')");
    expect(runtimeSource).not.toContain("import('/vendor/phaser.esm.js')");
  });

  it('runs every synchronized current gameplay system in the native Phaser simulation', () => {
    for (const system of [
      'updateFrontYardEnvironment',
      'requestGateForApproachingEntities',
      'captureGateTraversalState',
      'enforceGateTraversal',
      'updatePoolActivity',
      'updateArcadeSystem',
      'updateBasketballSystem',
      'updateOffsiteHomeView',
      'updateCalendarRuntime',
      'updateAutoHooks',
      'updateAutonomy',
      'advanceGameClock',
      'updateLifeQualitySystem',
      'applyRuntimeObjectCorrections'
    ]) expect(runtimeSource).toContain(system);
  });

  it('installs the current front yard, driveway, and basketball court world data', () => {
    installFrontYardWorld();
    expect(floors.some(floor => floor.id === FRONT_YARD_FLOOR)).toBe(true);
    expect(floors.some(floor => floor.id === DRIVEWAY_FLOOR)).toBe(true);
    expect(getObject('basketball_court')?.floor).toBe(FRONT_YARD_FLOOR);
    expect(getObject('front_driveway_garage_mouth')?.toFloor).toBe(3);
  });

  it('keeps native Phaser visual adapters for synchronized dynamic gameplay', () => {
    for (const adapter of ['drawFrontGate', 'drawTransientVehicle', 'drawArcade', 'drawBasketball', 'drawOffsite']) {
      expect(visualSource).toContain(adapter);
    }
    expect(visualSource).not.toContain('CanvasRenderingContext2D');
  });

  it('exposes the driveway in the P2 interface and compound map', () => {
    expect(uiSource).toContain("[7, 'Driveway West']");
    expect(uiSource).toContain("jumpArea(7, 'Driveway West')");
  });
});
