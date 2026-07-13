const ASSET_ROOT = 'assets/sprites';

export const ANIME_VISUAL_ASSETS = Object.freeze({
  garageFamilySuv: Object.freeze({
    path: `${ASSET_ROOT}/vehicles/anime-pass-01/family-suv/garage_suv_anime_top_512.png`,
    crop: Object.freeze({ x: 108, y: 38, w: 296, h: 444 })
  }),
  garageSportsConvertible: Object.freeze({
    path: `${ASSET_ROOT}/vehicles/anime-pass-01/sports-convertible/garage_convertible_anime_top_512.png`,
    crop: Object.freeze({ x: 84, y: 24, w: 344, h: 464 })
  }),
  garageFloor: Object.freeze({
    path: `${ASSET_ROOT}/environments/anime-pass-01/garage/garage_floor_anime_painterly_960x720.png`
  })
});

const records = new Map();

export function getAnimeVisualAsset(key) {
  const spec = ANIME_VISUAL_ASSETS[key];
  if (!spec) return null;
  let record = records.get(key);
  if (!record) {
    record = beginImageLoad(spec.path);
    records.set(key, record);
  }
  return record.status === 'ready' ? record.image : null;
}

export function getAnimeVisualAssetStatus(key) {
  return records.get(key)?.status || 'idle';
}

function beginImageLoad(path) {
  const record = { status: 'loading', image: null };
  if (typeof Image === 'undefined') {
    record.status = 'unavailable';
    return record;
  }

  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    record.status = 'ready';
    record.image = image;
  };
  image.onerror = () => {
    record.status = 'failed';
    record.image = null;
    console.warn(`[Apartment God] Anime visual asset failed to load: ${path}`);
  };
  image.src = path;
  return record;
}
