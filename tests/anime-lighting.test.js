import { describe, expect, it } from 'vitest';
import { getAnimeSunModel } from '../src/animeTimeLighting.js';

describe('anime time lighting model', () => {
  it('tracks day, night, and warm edge light by game time', () => {
    const noon = getAnimeSunModel(12 * 60);
    const midnight = getAnimeSunModel(0);
    const evening = getAnimeSunModel(18 * 60 + 10);

    expect(noon.daylight).toBeGreaterThan(0.9);
    expect(noon.night).toBeLessThan(0.15);
    expect(midnight.night).toBeGreaterThan(0.9);
    expect(evening.warmth).toBeGreaterThan(0.45);
  });

  it('normalizes time outside one day without throwing', () => {
    expect(getAnimeSunModel(24 * 60 + 12 * 60).minutes).toBe(12 * 60);
    expect(getAnimeSunModel(-60).minutes).toBe(23 * 60);
  });
});
