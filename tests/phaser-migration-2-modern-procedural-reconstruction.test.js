import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { installFrontYardWorld } from '../src/frontYardDriveway.js';
import {
  MODERN_PROCEDURAL_OBJECT_KINDS,
  roomThemeKey
} from '../src/phaserMigration2ModernProceduralRenderer.js';
import { floors, objects } from '../src/world.js';

installFrontYardWorld();

const runtimeSource = readFileSync(new URL('../src/phaserMigration2Runtime.js', import.meta.url), 'utf8');
const bridgeSource = readFileSync(new URL('../src/phaserMigration2GameplayParityBridge.js', import.meta.url), 'utf8');
const completionSource = readFileSync(new URL('../src/phaserMigration2ReferenceCompletion.js', import.meta.url), 'utf8');
const phoneSource = readFileSync(new URL('../src/phoneUI.js', import.meta.url), 'utf8');
const cameraSource = readFileSync(new URL('../src/cameraNavigation.js', import.meta.url), 'utf8');
const stylesSource = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

describe('Phaser Migration 2 modern procedural reconstruction', () => {
  it('retains all eight playable areas and gives every room a deliberate material theme', () => {
    expect(floors.map(floor => floor.id).sort((a, b) => a - b)).toEqual([0,1,2,3,4,5,6,7]);
    for (const floor of floors) {
      for (const room of floor.rooms || []) {
        expect(roomThemeKey(room, floor.id), `${floor.id}:${room.id}`).not.toBe('neutral');
      }
    }
  });

  it('has object-specific native construction coverage for every visible world object kind', () => {
    const visibleKinds = [...new Set(objects.filter(object => !object.collisionOnly).map(object => object.kind))].sort();
    const missing = visibleKinds.filter(kind => !MODERN_PROCEDURAL_OBJECT_KINDS.has(kind));
    expect(missing).toEqual([]);
  });

  it('uses native Graphics construction instead of stretching room and object images', () => {
    expect(runtimeSource).toContain('createModernProceduralRoom');
    expect(runtimeSource).toContain('createModernProceduralObject');
    expect(runtimeSource).toContain('refreshModernProceduralObject');
    expect(runtimeSource).not.toContain('this.add.image(room.x + room.w / 2');
    expect(runtimeSource).not.toContain('this.add.image(object.x + object.w / 2');
  });

  it('keeps compatibility overlays from resizing or covering modern procedural visuals', () => {
    expect(bridgeSource).toContain('child?.pm2ModernProceduralRoom');
    expect(bridgeSource).toContain('sprite.pm2ModernProcedural');
    expect(completionSource).toContain('if (sprite.pm2ModernProcedural) continue');
    expect(completionSource).toContain('child?.pm2ModernProceduralRoom');
  });

  it('aligns sleeping to the exact bed headboard and renders an object-aware blanket', () => {
    expect(completionSource).toContain("activity === 'sleep' ? (object.headboard || object.facing)");
    expect(completionSource).toContain("if (headboard === 'west') x = object.x + object.w * .43");
    expect(completionSource).toContain('drawSleepBlanket');
  });

  it('activates mobile navigation on the first touch and prevents duplicate synthetic clicks', () => {
    expect(phoneSource).toContain('bindImmediateTap(up');
    expect(phoneSource).toContain('bindImmediateTap(down');
    expect(phoneSource).toContain('bindImmediateTap(button');
    expect(cameraSource).toContain('bindImmediateTap(blueprint');
    expect(cameraSource).toContain('pointerHandledAt');
    expect(stylesSource).toContain('touch-action:manipulation');
  });

  it('restores a direct one-gesture route between Main House and Driveway West', () => {
    expect(cameraSource).toContain("return { floor: 7, label: 'Driveway West' }");
    expect(cameraSource).toContain("return { floor: 0, label: 'Main House' }");
  });

  it('remains native Phaser without the retired Canvas frame bridge', () => {
    expect(runtimeSource).not.toContain('drawPhaserEnvironment');
    expect(runtimeSource).not.toContain('textures.addCanvas');
    expect(runtimeSource).toContain('new Phaser.Game');
  });
});
