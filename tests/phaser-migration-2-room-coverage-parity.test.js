import { describe, expect, it } from 'vitest';
import { installFrontYardWorld } from '../src/frontYardDriveway.js';
import { floors } from '../src/world.js';
import { PM2_ROOM_TEXTURES, textureForRoom } from '../src/phaserMigration2VisualCatalog.js';

installFrontYardWorld();

describe('Phaser Migration 2 previsual room coverage', () => {
  it('includes all eight baseline and dynamically installed floors', () => {
    expect(floors.map(floor => floor.id).sort((a, b) => a - b)).toEqual([0,1,2,3,4,5,6,7]);
  });

  it('assigns every room a deliberate non-neutral visual treatment', () => {
    for (const floor of floors) {
      for (const room of floor.rooms || []) {
        const texture = textureForRoom(room);
        expect(texture, `${floor.id}:${room.id}`).not.toBe('pm2-room-neutral');
        expect(PM2_ROOM_TEXTURES[texture.replace('pm2-room-', '')], `${floor.id}:${room.id}`).toBeTruthy();
      }
    }
  });

  it('uses dedicated curb and walkway surface assets', () => {
    expect(PM2_ROOM_TEXTURES.curb).toContain('/room_curb.svg');
    expect(PM2_ROOM_TEXTURES.walkway).toContain('/room_walkway.svg');
  });
});
