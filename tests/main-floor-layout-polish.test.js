import { describe, expect, it } from 'vitest';
import { applyMainFloorLayoutPolish } from '../src/mainFloorLayoutPolish.js';
import { getObject } from '../src/world.js';

describe('main floor layout polish', () => {
  it('places the L sectional against the living wall with chaise on wall side', () => {
    applyMainFloorLayoutPolish();
    const couch = getObject('couch');

    expect(couch.floor).toBe(0);
    expect(couch.x).toBeLessThan(90);
    expect(couch.y).toBeGreaterThan(220);
    expect(couch.facing).toBe('up');
    expect(couch.enterable).toBe(true);
  });

  it('keeps the cleaner dining layout as a single four-seat table zone', () => {
    applyMainFloorLayoutPolish();
    const dining = getObject('dining_table');

    expect(dining.floor).toBe(0);
    expect(dining.x).toBe(494);
    expect(dining.w).toBe(190);
    expect(dining.h).toBe(64);
  });
});
