import { describe, expect, it } from 'vitest';
import { ANIME_VISUAL_ASSETS, getAnimeVisualAsset, getAnimeVisualAssetStatus } from '../src/animeVisualAssets.js';
import { vehicleSpriteRotation } from '../src/vehicleSpriteRenderer.js';

describe('anime visual assets', () => {
  it('keeps production asset paths and crop metadata stable', () => {
    expect(ANIME_VISUAL_ASSETS.garageFamilySuv.path).toContain('garage_suv_anime_top_512.png');
    expect(ANIME_VISUAL_ASSETS.garageSportsConvertible.crop.w).toBeGreaterThan(0);
    expect(ANIME_VISUAL_ASSETS.garageFloor.path).toContain('garage_floor_anime_painterly_960x720.png');
  });

  it('fails safely when browser Image is unavailable', () => {
    expect(getAnimeVisualAsset('garageFamilySuv')).toBeNull();
    expect(getAnimeVisualAssetStatus('garageFamilySuv')).toBe('unavailable');
    expect(getAnimeVisualAsset('missing')).toBeNull();
  });

  it('maps vehicle facings to overhead sprite rotation', () => {
    expect(vehicleSpriteRotation('up')).toBe(0);
    expect(vehicleSpriteRotation('down')).toBe(Math.PI);
    expect(vehicleSpriteRotation('left')).toBe(-Math.PI / 2);
    expect(vehicleSpriteRotation('right')).toBe(Math.PI / 2);
  });
});
