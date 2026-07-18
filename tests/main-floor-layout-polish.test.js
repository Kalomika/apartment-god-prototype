import { describe, expect, it } from 'vitest';
import { applyMainFloorLayoutPolish } from '../src/mainFloorLayoutPolish.js';
import { getObject } from '../src/world.js';

describe('main floor layout polish', () => {
  it('places the L sectional against the living wall with a blocked footprint and safe interaction approach', () => {
    applyMainFloorLayoutPolish();
    const couch = getObject('couch');

    expect(couch.floor).toBe(0);
    expect(couch.x).toBeLessThan(90);
    expect(couch.y).toBeGreaterThan(210);
    expect(couch.h).toBe(86);
    expect(couch.facing).toBe('up');
    expect(couch.enterable).toBe(false);
    expect(couch.solid).toBe(true);
  });

  it('keeps the current cleaner dining layout as one compact four-seat table zone', () => {
    applyMainFloorLayoutPolish();
    const dining = getObject('dining_table');

    expect(dining.floor).toBe(0);
    expect(dining.x).toBe(498);
    expect(dining.y).toBe(230);
    expect(dining.w).toBe(174);
    expect(dining.h).toBe(58);
    expect(dining.solid).toBe(true);
  });

  it('moves dog and robot items into the pet robot nook instead of the walkway', () => {
    applyMainFloorLayoutPolish();
    const dogBed = getObject('dog_bed');
    const dogBowl = getObject('dog_bowl');
    const robot = getObject('robot_vacuum');

    expect(dogBed.x).toBeGreaterThanOrEqual(520);
    expect(dogBowl.x).toBeGreaterThan(dogBed.x);
    expect(robot.x).toBeGreaterThan(dogBowl.x);
    expect(robot.y).toBeGreaterThanOrEqual(590);
  });
});
