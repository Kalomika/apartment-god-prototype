import { describe, expect, it } from 'vitest';
import { doorways } from '../src/blueprint.js';
import { applyUpstairsExtensionLayout } from '../src/upstairsExtensionLayout.js';
import { floors, getObject } from '../src/world.js';

describe('upstairs extension layout', () => {
  it('moves the upstairs stairs into the new landing section instead of the primary suite side', () => {
    applyUpstairsExtensionLayout();
    const stairs = getObject('stairs_up');
    const landing = floors[1].rooms.find(room => room.id === 'upstairs_landing');

    expect(stairs.floor).toBe(1);
    expect(stairs.room).toBe('upstairs_landing');
    expect(stairs.x).toBeGreaterThanOrEqual(landing.x);
    expect(stairs.x + stairs.w).toBeLessThanOrEqual(landing.x + landing.w);
    expect(stairs.y + stairs.h).toBeLessThanOrEqual(landing.y + landing.h);
  });

  it('adds two non-primary bedrooms with closets and wall TVs', () => {
    const fullBed = getObject('full_bed');
    const queenBed = getObject('queen_bed');

    expect(fullBed.kind).toBe('bed');
    expect(queenBed.kind).toBe('bed');
    expect(fullBed.w).toBeLessThan(queenBed.w);
    expect(queenBed.w).toBeLessThan(getObject('bed').w);
    expect(getObject('full_bedroom_closet').kind).toBe('closet');
    expect(getObject('queen_bedroom_closet').kind).toBe('closet');
    expect(getObject('full_bedroom_tv').kind).toBe('tv');
    expect(getObject('queen_bedroom_tv').kind).toBe('tv');
  });

  it('adds a shared upstairs bathroom with shower sink and toilet', () => {
    expect(getObject('shared_shower').kind).toBe('shower');
    expect(getObject('shared_bath_sink').kind).toBe('sink');
    expect(getObject('shared_toilet').kind).toBe('toilet');
  });

  it('keeps the primary vanity east-facing with west-side handles', () => {
    applyUpstairsExtensionLayout();
    const sink = getObject('master_bath_sink');

    expect(sink.facing).toBe('east');
    expect(sink.handleSide).toBe('west');
  });

  it('connects the new upstairs section to the shifted primary suite side', () => {
    const floorOneDoors = doorways.filter(door => door.floor === 1);
    const connectedRooms = new Set();
    for (const door of floorOneDoors) {
      connectedRooms.add(door.a);
      connectedRooms.add(door.b);
    }

    for (const roomId of ['upstairs_landing', 'hall', 'bedroom_full', 'bedroom_queen', 'shared_bath', 'office', 'bedroom', 'suite_foyer', 'walkin_closet', 'master_bath']) {
      expect(connectedRooms.has(roomId)).toBe(true);
    }
  });
});
