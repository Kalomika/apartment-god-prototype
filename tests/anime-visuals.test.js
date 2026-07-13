import { describe, expect, it } from 'vitest';
import { ANIME_VISUAL_ASSETS, getAnimeVisualAsset, getAnimeVisualAssetStatus } from '../src/animeVisualAssets.js';

describe('disabled anime visual pass 01', () => {
  it('keeps the rejected garage anime pass disabled at runtime', () => {
    expect(Object.keys(ANIME_VISUAL_ASSETS)).toHaveLength(0);
    expect(getAnimeVisualAsset('garageFamilySuv')).toBeNull();
    expect(getAnimeVisualAsset('garageSportsConvertible')).toBeNull();
    expect(getAnimeVisualAsset('garageFloor')).toBeNull();
    expect(getAnimeVisualAssetStatus('garageFamilySuv')).toBe('disabled');
  });
});
