const MANIFEST_URL = '/assets/manifests/sprite-pipeline.json';

let cachedManifest = null;

export async function loadSpriteManifest(url = MANIFEST_URL) {
  if (cachedManifest) return cachedManifest;
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    cachedManifest = normalizeManifest(await response.json());
  } catch (error) {
    console.warn('Sprite manifest unavailable. Using procedural fallbacks.', error);
    cachedManifest = normalizeManifest(emptyManifest());
  }
  return cachedManifest;
}

export function normalizeManifest(manifest) {
  const animations = Array.isArray(manifest.animations) ? manifest.animations : [];
  const sprites = Array.isArray(manifest.sprites) ? manifest.sprites : [];
  return {
    ...manifest,
    atlas: manifest.atlas || {},
    animations,
    sprites,
    animationByState: Object.fromEntries(animations.map(item => [item.state_id, item])),
    spritesById: Object.fromEntries(sprites.map(item => [item.id, item])),
    spritesByKind: sprites.reduce((map, item) => {
      if (!map[item.kind]) map[item.kind] = [];
      map[item.kind].push(item);
      return map;
    }, {})
  };
}

export function getObjectSprite(manifest, object) {
  if (!object) return null;
  return manifest.spritesById?.[object.id] || manifest.spritesByKind?.[object.kind]?.[0] || null;
}

export function getEntityStateId(entity) {
  const direction = entity?.facing || entity?.dir || 'down';
  if (entity?.type === 'dog') return `dog_trot_${direction}`;
  if (entity?.role === 'girlfriend' || entity?.id === 'girlfriend') return `girlfriend_walk_${direction}`;
  return `resident_walk_${direction}`;
}

export function getEntityAnimation(manifest, entity) {
  const stateId = getEntityStateId(entity);
  return manifest.animationByState?.[stateId] || manifest.animationByState?.[stateId.replace(/_(up|left|right)$/, '_down')] || null;
}

export function spriteKeyFromPath(path) {
  return String(path || '')
    .replace(/^assets\//, 'asset_')
    .replace(/[^a-zA-Z0-9_]/g, '_');
}

export function missingSpriteLabel(kind, id = '') {
  return `${kind || 'sprite'}${id ? `:${id}` : ''}`;
}

function emptyManifest() {
  return {
    version: 0,
    style_target: 'Fallback only. Production sprite manifest missing.',
    forbidden_looks: [],
    atlas: {},
    animations: [],
    sprites: []
  };
}
