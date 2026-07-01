export const USE_PRODUCTION_PASS_01_ASSETS = true;

const BASE = 'public/assets/production_pass_01';
const cache = new Map();

const environment = {
  floor0: `${BASE}/environment/floor1_base.png`,
  floor1: `${BASE}/environment/floor2_base.png`,
  walls: `${BASE}/environment/walls_dark_base.png`,
  neon: `${BASE}/environment/neon_lighting_overlay.png`
};

function pathForEntity(entity, state) {
  if (entity.type === 'dog') return `${BASE}/dog/${dogAssetName(entity)}.png`;
  const prefix = entity.id === 'girlfriend' ? 'female' : 'male';
  return `${BASE}/${prefix}/${humanAssetName(prefix, entity, state)}.png`;
}

function imageFor(path) {
  if (!USE_PRODUCTION_PASS_01_ASSETS || !path) return null;
  if (!cache.has(path)) {
    const image = new Image();
    const record = { image, failed: false };
    image.onload = () => { record.failed = false; };
    image.onerror = () => { record.failed = true; };
    image.src = path;
    cache.set(path, record);
  }
  const record = cache.get(path);
  if (record.failed || !record.image.complete || !record.image.naturalWidth) return null;
  return record.image;
}

export function drawProductionEnvironment(ctx, state) {
  if (!USE_PRODUCTION_PASS_01_ASSETS) return false;
  const floor = imageFor(state.floor === 1 ? environment.floor1 : environment.floor0);
  if (!floor) return false;
  ctx.drawImage(floor, 0, 0, 960, 720);
  const walls = imageFor(environment.walls);
  if (walls) ctx.drawImage(walls, 0, 0, 960, 720);
  const neon = imageFor(environment.neon);
  if (neon) {
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.drawImage(neon, 0, 0, 960, 720);
    ctx.restore();
  }
  return true;
}

export function drawProductionEntity(ctx, entity, state) {
  const image = imageFor(pathForEntity(entity, state));
  if (!image) return false;
  if (entity.type === 'dog') return drawDogImage(ctx, image);
  return drawHumanImage(ctx, image, entity);
}

function drawHumanImage(ctx, image, entity) {
  const action = String(entity.action || '').toLowerCase();
  const sleeping = entity.pose === 'sleep' || action.includes('sleep') || action.includes('nap');
  const sitting = entity.pose === 'sit' || action.includes('tv') || action.includes('desk') || action.includes('phone') || action.includes('game') || action.includes('ordering');
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  const y = sleeping ? -h / 2 : sitting ? -h * 0.72 : -h * 0.86;
  ctx.drawImage(image, -w / 2, y, w, h);
  return true;
}

function drawDogImage(ctx, image) {
  const w = image.naturalWidth;
  const h = image.naturalHeight;
  ctx.drawImage(image, -w / 2, -h / 2, w, h);
  return true;
}

function humanAssetName(prefix, entity) {
  const action = String(entity.action || '').toLowerCase();
  if (entity.pose === 'sleep' || action.includes('sleep') || action.includes('nap')) return `${prefix}_sleep_b`;
  if (action.includes('phone') || action.includes('shop') || action.includes('ordering') || action.includes('planning')) return `${prefix}_phone_b`;
  if (action.includes('desk') || action.includes('game') || action.includes('study')) return `${prefix}_laptop_b`;
  if (action.includes('food') || action.includes('snack') || action.includes('meal') || action.includes('cook') || action.includes('eat')) return `${prefix}_eat_b`;
  if (entity.pose === 'sit' || action.includes('tv') || action.includes('relax')) return `${prefix}_sit_b`;
  if (action.includes('going to') || entity.pose === 'walk' || entity.path?.length) return `${prefix}_walk_${cardinalDirection(entity)}_a`;
  if (action.includes('shower') || action.includes('toilet') || action.includes('transition')) return `${prefix}_transition_a`;
  return `${prefix}_idle_${idleFrame()}`;
}

function dogAssetName(entity) {
  const action = String(entity.action || '').toLowerCase();
  if (action.includes('sleep') || action.includes('nap') || entity.pose === 'sleep') return 'dog_sleep_b';
  if (action.includes('eat') || action.includes('bowl') || action.includes('feed')) return 'dog_eat_b';
  if (action.includes('alert') || action.includes('bark')) return 'dog_alert_b';
  if (entity.pose === 'sit') return 'dog_sit_b';
  if (action.includes('fetch') || action.includes('returning') || entity.pose === 'walk' || entity.path?.length) return `dog_walk_${cardinalDirection(entity)}_a`;
  return `dog_idle_${idleFrame()}`;
}

function cardinalDirection(entity) {
  const next = entity.path?.[0];
  if (!next) return 'south';
  const dx = next.x - entity.x;
  const dy = next.y - entity.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? 'east' : 'west';
  return dy >= 0 ? 'south' : 'north';
}

function idleFrame() {
  return Math.floor(performance.now() / 650) % 2 === 0 ? 'a' : 'b';
}
