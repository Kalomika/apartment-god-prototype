// Anime visual pass 01 was disabled on 2026-07-13 after live garage QA showed
// mismatched garage states and an unwanted metallic/isometric read. Keep this
// module as a safe no-op so existing imports continue to boot while the garage
// falls back to the pre-metallic procedural renderer.

export const ANIME_VISUAL_ASSETS = Object.freeze({});

export function getAnimeVisualAsset() {
  return null;
}

export function getAnimeVisualAssetStatus() {
  return 'disabled';
}
