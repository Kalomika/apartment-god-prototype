import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { objects, floors } from '../src/world.js';
import { PM2_OBJECT_TEXTURES, PM2_ROOM_TEXTURES, textureForObject, textureForRoom } from '../src/phaserMigration2VisualCatalog.js';

const runtimeSource = readFileSync(new URL('../src/phaserMigration2Runtime.js', import.meta.url), 'utf8');

describe('Phaser Migration 2 reference quality visual catalog', () => {
  it('assigns every current world object a native object-specific texture key', () => {
    for (const object of objects) {
      const texture = textureForObject(object);
      expect(texture.startsWith('pm2-object-')).toBe(true);
      expect(texture).not.toBe('pm2-object-generic');
    }
  });

  it('provides distinct furniture and appliance assets instead of category placeholders', () => {
    for (const key of ['couch','dining_table','fridge','stove','sink','coffee_maker','shower','bathtub','toilet','bed','desk','bookshelf','pool_table','arcade','game_console','treadmill','weight_bench','heavy_bag']) {
      expect(PM2_OBJECT_TEXTURES[key]).toContain(`/${key}.svg`);
    }
    expect(new Set(['couch','dining_table','fridge','stove','sink'].map(key => PM2_OBJECT_TEXTURES[key])).size).toBe(5);
  });

  it('assigns every room a specific native architectural floor treatment', () => {
    for (const floor of floors) for (const room of floor.rooms || []) {
      expect(textureForRoom(room).startsWith('pm2-room-')).toBe(true);
    }
    expect(Object.keys(PM2_ROOM_TEXTURES).length).toBeGreaterThanOrEqual(16);
  });

  it('keeps the native Phaser runtime and removes the old broad visual selector', () => {
    expect(runtimeSource).toContain('phaserMigration2VisualCatalog');
    expect(runtimeSource).toContain('textureForRoom(room)');
    expect(runtimeSource).not.toContain('drawPhaserEnvironment');
    expect(runtimeSource).not.toContain('textures.addCanvas');
    expect(runtimeSource).not.toContain('function textureForObject(object)');
  });

  it('hides room labels unless explicit visual debugging is enabled', () => {
    expect(runtimeSource).toContain('debugVisualLabels');
    expect(runtimeSource).not.toContain('label.setAlpha(.62)');
  });
});
