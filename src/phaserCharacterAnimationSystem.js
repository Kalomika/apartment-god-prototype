import { getObject } from './world.js';

export const CHARACTER_ANIMATION_FPS = 8;
export const CHARACTER_FRAME_SIZE = 128;
export const CHARACTER_FRAMES_PER_DIRECTION = 4;

const DIRECTION_ROWS = ['south', 'west', 'east', 'north'];
const VERTICAL_TOP_TEXTURE = 'pm2-human-vertical-top-layer';
const VERTICAL_BOTTOM_TEXTURE = 'pm2-human-vertical-bottom-layer';
const SIDE_TOP_TEXTURE = 'pm2-human-side-top-layer';
const SIDE_BOTTOM_TEXTURE = 'pm2-human-side-bottom-layer';

const PROFILE_CONFIG = {
  resident: { texture: 'pm2-resident-sheet', sideTexture: 'pm2-resident-side-sheet', scale: .78, shadowW: 46, shadowH: 22, top: 0x24324a, bottom: 0x171a21 },
  girlfriend: { texture: 'pm2-girlfriend-sheet', sideTexture: 'pm2-girlfriend-side-sheet', scale: .78, shadowW: 44, shadowH: 21, top: 0x26526f, bottom: 0x17131b },
  labSubject: { texture: 'pm2-lab-subject-sheet', sideTexture: 'pm2-lab-subject-side-sheet', scale: .78, shadowW: 46, shadowH: 22, top: 0x173b47, bottom: 0x102833 },
  dog: { texture: 'pm2-dog-sheet', sideTexture: null, scale: .72, shadowW: 58, shadowH: 25 }
};

export function registerCharacterAnimations(scene) {
  for (const [profile, config] of Object.entries(PROFILE_CONFIG)) {
    registerDirectionalFrames(scene, config.texture);
    const texture = scene.textures.get(config.texture);
    if (texture && texture.key !== '__MISSING') {
      for (const direction of DIRECTION_ROWS) {
        const animationKey = animationName(profile, direction);
        if (!scene.anims.exists(animationKey)) {
          scene.anims.create({
            key: animationKey,
            frames: [0, 1, 2, 3].map(column => ({ key: config.texture, frame: `${direction}-${column}` })),
            frameRate: CHARACTER_ANIMATION_FPS,
            repeat: -1
          });
        }
      }
    }
    if (config.sideTexture) registerSideFrames(scene, config.sideTexture);
  }

  registerDirectionalFrames(scene, VERTICAL_TOP_TEXTURE);
  registerDirectionalFrames(scene, VERTICAL_BOTTOM_TEXTURE);
  registerSideFrames(scene, SIDE_TOP_TEXTURE);
  registerSideFrames(scene, SIDE_BOTTOM_TEXTURE);
}

function registerDirectionalFrames(scene, textureKey) {
  const texture = scene.textures.get(textureKey);
  if (!texture || texture.key === '__MISSING') return;
  for (let row = 0; row < DIRECTION_ROWS.length; row += 1) {
    const direction = DIRECTION_ROWS[row];
    for (let column = 0; column < CHARACTER_FRAMES_PER_DIRECTION; column += 1) {
      const frameName = `${direction}-${column}`;
      if (!texture.has(frameName)) texture.add(frameName, 0, column * CHARACTER_FRAME_SIZE, row * CHARACTER_FRAME_SIZE, CHARACTER_FRAME_SIZE, CHARACTER_FRAME_SIZE);
    }
  }
}

function registerSideFrames(scene, textureKey) {
  const texture = scene.textures.get(textureKey);
  if (!texture || texture.key === '__MISSING') return;
  for (let column = 0; column < CHARACTER_FRAMES_PER_DIRECTION; column += 1) {
    const frameName = `side-${column}`;
    if (!texture.has(frameName)) texture.add(frameName, 0, column * CHARACTER_FRAME_SIZE, 0, CHARACTER_FRAME_SIZE, CHARACTER_FRAME_SIZE);
  }
}

export function syncCharacterVisuals(scene, state, actorLayer) {
  scene.pm2ActorVisuals ??= new Map();
  const activeIds = new Set();

  for (const entity of state.entities || []) {
    if (!entity || entity.hidden || entity.floor !== state.floor) continue;
    activeIds.add(entity.id);
    const point = actorRenderPoint(entity);
    const profile = profileForEntity(entity);
    const record = ensureActorVisual(scene, actorLayer, entity, profile, point);
    syncActorVisual(scene, state, entity, profile, point, record);
  }

  for (const [id, record] of scene.pm2ActorVisuals.entries()) {
    if (activeIds.has(id)) continue;
    destroyRecord(record);
    scene.pm2ActorVisuals.delete(id);
  }

  if (typeof actorLayer?.sort === 'function') actorLayer.sort('depth');
}

export function setBaseActorVisualVisible(scene, entityId, visible) {
  const record = scene.pm2ActorVisuals?.get?.(entityId);
  if (!record) return false;
  record.suppressedByActivity = !visible;
  applyRecordVisibility(record);
  return true;
}

export function clearCharacterVisuals(scene) {
  for (const record of scene.pm2ActorVisuals?.values?.() || []) destroyRecord(record);
  scene.pm2ActorVisuals?.clear?.();
}

export function shouldPlayWalkForTest(previous, current, entity = {}) {
  if (isStationaryActivity(entity)) return false;
  return Math.hypot(current.x - previous.x, current.y - previous.y) > .08;
}

export function directionFromDeltaForTest(dx, dy, fallback = 'south') {
  if (Math.hypot(dx, dy) <= .08) return fallback;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'west' : 'east';
  return dy < 0 ? 'north' : 'south';
}

export function wardrobeLayerColorsForTest(entity, profile = 'resident') {
  return wardrobeLayerColors(entity, PROFILE_CONFIG[profile] || PROFILE_CONFIG.resident);
}

function ensureActorVisual(scene, layer, entity, profile, point) {
  const existing = scene.pm2ActorVisuals.get(entity.id);
  if (existing?.profile === profile) return existing;
  if (existing) destroyRecord(existing);

  const config = PROFILE_CONFIG[profile];
  const shadow = scene.add.ellipse(point.x, point.y + 20, config.shadowW, config.shadowH, 0x05080d, .24);
  const ring = scene.add.ellipse(point.x, point.y + 17, profile === 'dog' ? 64 : 54, profile === 'dog' ? 34 : 31, 0xf1c66a, 0);
  ring.setStrokeStyle(3, 0xf1c66a, .94);
  const sprite = createSprite(scene, point, config.texture, 'south-1', config.scale);
  const human = profile !== 'dog';
  const sideSprite = human ? createSprite(scene, point, config.sideTexture, 'side-1', config.scale) : null;
  const verticalTop = human ? createSprite(scene, point, VERTICAL_TOP_TEXTURE, 'south-1', config.scale) : null;
  const verticalBottom = human ? createSprite(scene, point, VERTICAL_BOTTOM_TEXTURE, 'south-1', config.scale) : null;
  const sideTop = human ? createSprite(scene, point, SIDE_TOP_TEXTURE, 'side-1', config.scale) : null;
  const sideBottom = human ? createSprite(scene, point, SIDE_BOTTOM_TEXTURE, 'side-1', config.scale) : null;
  const cue = scene.add.graphics();
  const label = scene.add.text(point.x, point.y - 66, '', {
    fontFamily: 'system-ui', fontSize: 10, fontStyle: '900', color: '#071018', backgroundColor: '#f8fbff', padding: { x: 5, y: 3 }
  }).setOrigin(.5, .5);

  const roles = { shadow, ring, sprite, sideSprite, verticalTop, verticalBottom, sideTop, sideBottom, cue, label };
  for (const [role, child] of Object.entries(roles)) {
    if (!child) continue;
    child.pm2EntityId = entity.id;
    child.pm2ActorRole = role;
    layer.add(child);
  }

  const record = {
    profile,
    entityId: entity.id,
    shadow,
    ring,
    sprite,
    sideSprite,
    verticalTop,
    verticalBottom,
    sideTop,
    sideBottom,
    cue,
    label,
    lastX: point.x,
    lastY: point.y,
    direction: headingDirection(entity),
    visualMode: 'vertical',
    suppressedByActivity: false,
    ringWanted: false,
    labelWanted: false
  };
  scene.pm2ActorVisuals.set(entity.id, record);
  return record;
}

function createSprite(scene, point, textureKey, frameName, scale) {
  const valid = textureKey && scene.textures.exists(textureKey);
  const sprite = scene.add.sprite(point.x, point.y, valid ? textureKey : '__MISSING', valid ? frameName : undefined);
  sprite.setScale(scale);
  sprite.setOrigin(.5, .63);
  sprite.setVisible(false);
  return sprite;
}

function syncActorVisual(scene, state, entity, profile, point, record) {
  const config = PROFILE_CONFIG[profile];
  const previous = { x: record.lastX, y: record.lastY };
  const dx = point.x - previous.x;
  const dy = point.y - previous.y;
  const moving = shouldPlayWalkForTest(previous, point, entity);
  const direction = directionFromDeltaForTest(dx, dy, record.direction || headingDirection(entity));
  const sideDirection = profile !== 'dog' && (direction === 'east' || direction === 'west') && sideAssetsReady(scene, config);
  const frameIndex = moving ? Math.floor(scene.time.now / (1000 / CHARACTER_ANIMATION_FPS)) % CHARACTER_FRAMES_PER_DIRECTION : stationaryFrame(entity, scene.time.now);
  record.direction = direction;
  record.visualMode = sideDirection ? 'side' : 'vertical';
  entity.spriteDirection = direction;

  record.shadow.setPosition(point.x, point.y + (profile === 'dog' ? 15 : 19));
  record.shadow.setDisplaySize(config.shadowW, config.shadowH);
  record.shadow.setAlpha(moving ? .19 : .24);
  record.ring.setPosition(point.x, point.y + (profile === 'dog' ? 14 : 17));
  record.ringWanted = state.selectedId === entity.id;
  positionActorSprites(record, point);

  if (sideDirection) syncSideVisual(scene, entity, config, record, direction, frameIndex);
  else syncVerticalVisual(scene, entity, profile, config, record, direction, moving);

  const depth = point.y + (profile === 'dog' ? 46 : 58);
  record.shadow.setDepth(depth - 3);
  record.ring.setDepth(depth - 2);
  setSpriteDepths(record, depth);
  record.cue.setDepth(depth + 5);
  record.label.setDepth(depth + 6);
  syncPoolCue(record.cue, state, entity, point, direction, moving, scene.time.now);

  const text = visibleActorText(entity);
  record.label.setText(text);
  record.labelWanted = Boolean(text);
  record.label.setPosition(point.x, point.y - (profile === 'dog' ? 54 : 68));
  applyRecordVisibility(record);

  record.lastX = point.x;
  record.lastY = point.y;
}

function positionActorSprites(record, point) {
  for (const sprite of actorSprites(record)) sprite?.setPosition?.(point.x, point.y);
}

function setSpriteDepths(record, depth) {
  record.sprite?.setDepth(depth);
  record.sideSprite?.setDepth(depth);
  record.verticalBottom?.setDepth(depth + .1);
  record.sideBottom?.setDepth(depth + .1);
  record.verticalTop?.setDepth(depth + .2);
  record.sideTop?.setDepth(depth + .2);
}

function syncVerticalVisual(scene, entity, profile, config, record, direction, moving) {
  const animationKey = animationName(profile, direction);
  record.sprite.setFlipX(false);
  if (moving && scene.anims.exists(animationKey) && scene.textures.exists(config.texture)) {
    if (record.sprite.texture?.key !== config.texture) record.sprite.setTexture(config.texture, `${direction}-1`);
    if (record.sprite.anims.currentAnim?.key !== animationKey || !record.sprite.anims.isPlaying) record.sprite.play(animationKey, true);
  } else {
    record.sprite.stop();
    setSafeCharacterFrame(scene, record.sprite, config.texture, `${direction}-${stationaryFrame(entity, scene.time.now)}`);
  }

  if (profile === 'dog') return;
  const frameName = String(record.sprite.frame?.name || `${direction}-1`);
  setSafeCharacterFrame(scene, record.verticalTop, VERTICAL_TOP_TEXTURE, frameName);
  setSafeCharacterFrame(scene, record.verticalBottom, VERTICAL_BOTTOM_TEXTURE, frameName);
  const colors = wardrobeLayerColors(entity, config);
  record.verticalTop.setTint(colors.top);
  record.verticalBottom.setTint(colors.bottom);
}

function syncSideVisual(scene, entity, config, record, direction, frameIndex) {
  record.sprite.stop();
  const frameName = `side-${frameIndex}`;
  setSafeCharacterFrame(scene, record.sideSprite, config.sideTexture, frameName);
  setSafeCharacterFrame(scene, record.sideTop, SIDE_TOP_TEXTURE, frameName);
  setSafeCharacterFrame(scene, record.sideBottom, SIDE_BOTTOM_TEXTURE, frameName);
  const flip = direction === 'west';
  record.sideSprite.setFlipX(flip);
  record.sideTop.setFlipX(flip);
  record.sideBottom.setFlipX(flip);
  const colors = wardrobeLayerColors(entity, config);
  record.sideTop.setTint(colors.top);
  record.sideBottom.setTint(colors.bottom);
}

function wardrobeLayerColors(entity, config) {
  const wardrobe = entity?.wardrobe;
  const day = Number.isInteger(wardrobe?.currentDay) ? wardrobe.currentDay : 0;
  const source = wardrobe?.colors?.[day] || wardrobe?.colors?.[0] || null;
  const top = parseColor(source, config.top || 0x263544);
  return { top, bottom: darkenColor(top, .48, config.bottom || 0x171a21) };
}

function parseColor(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const parsed = Number.parseInt(value.replace('#', ''), 16);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function darkenColor(color, factor, fallback) {
  if (!Number.isFinite(color)) return fallback;
  const red = Math.max(0, Math.min(255, Math.round(((color >> 16) & 255) * factor)));
  const green = Math.max(0, Math.min(255, Math.round(((color >> 8) & 255) * factor)));
  const blue = Math.max(0, Math.min(255, Math.round((color & 255) * factor)));
  return (red << 16) | (green << 8) | blue;
}

function sideAssetsReady(scene, config) {
  return Boolean(config.sideTexture)
    && scene.textures.exists(config.sideTexture)
    && scene.textures.exists(SIDE_TOP_TEXTURE)
    && scene.textures.exists(SIDE_BOTTOM_TEXTURE);
}

function setSafeCharacterFrame(scene, sprite, textureKey, frameName) {
  if (!sprite) return false;
  const texture = scene.textures.get(textureKey);
  if (texture && texture.key !== '__MISSING' && texture.has(frameName)) {
    if (sprite.texture?.key !== textureKey) sprite.setTexture(textureKey, frameName);
    else sprite.setFrame(frameName);
    return true;
  }
  if (sprite.texture?.key !== '__MISSING') sprite.setTexture('__MISSING');
  return false;
}

function applyRecordVisibility(record) {
  const visible = !record.suppressedByActivity;
  const side = visible && record.visualMode === 'side';
  const vertical = visible && !side;
  record.shadow?.setVisible?.(visible);
  record.ring?.setVisible?.(visible && Boolean(record.ringWanted));
  record.sprite?.setVisible?.(vertical);
  record.verticalTop?.setVisible?.(vertical && record.profile !== 'dog');
  record.verticalBottom?.setVisible?.(vertical && record.profile !== 'dog');
  record.sideSprite?.setVisible?.(side);
  record.sideTop?.setVisible?.(side);
  record.sideBottom?.setVisible?.(side);
  record.cue?.setVisible?.(visible);
  record.label?.setVisible?.(visible && Boolean(record.labelWanted));
}

function syncPoolCue(graphics, state, entity, point, direction, moving, now) {
  graphics.clear();
  const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
  if (!key.includes('pool') && entity.carrying !== 'cue_stick') return;

  const cueBall = state.poolGame?.balls?.find(ball => ball.id === 'cue' && !ball.pocketed);
  const aimPoint = cueBall || offsetPoint(point, direction, 54);
  const vector = unit(aimPoint.x - point.x, aimPoint.y - point.y);
  const normal = { x: -vector.y, y: vector.x };
  const pulse = Math.floor(now / 125) % 4;
  const stroke = moving ? 3 : pulse === 0 ? 4 : 3;
  const back = moving ? 21 : 30;
  const front = moving ? 24 : 52;
  const x1 = point.x - vector.x * back;
  const y1 = point.y - vector.y * back;
  const x2 = point.x + vector.x * front;
  const y2 = point.y + vector.y * front;

  graphics.lineStyle(stroke + 2, 0x13171d, .9);
  graphics.beginPath(); graphics.moveTo(x1, y1); graphics.lineTo(x2, y2); graphics.strokePath();
  graphics.lineStyle(stroke, 0xc99d62, 1);
  graphics.beginPath(); graphics.moveTo(x1, y1); graphics.lineTo(x2, y2); graphics.strokePath();
  if (!moving) {
    graphics.fillStyle(0x4d2d26, 1);
    graphics.fillCircle(point.x + normal.x * 8 + vector.x * 9, point.y + normal.y * 8 + vector.y * 9, 4.4);
    graphics.fillCircle(point.x - normal.x * 8 + vector.x * 13, point.y - normal.y * 8 + vector.y * 13, 4.4);
  }
}

function visibleActorText(entity) {
  if (entity.bubbleT > 0 && entity.bubble) return String(entity.bubble).slice(0, 30);
  if (entity.actionT > 0 && entity.action && !String(entity.action).toLowerCase().includes('pool: circling')) return String(entity.action).slice(0, 28);
  return '';
}

function stationaryFrame(entity, now) {
  const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
  if (key.includes('pool: taking shot')) return Math.floor(now / 125) % 2 ? 1 : 3;
  if (key.includes('pool: lining up') || key.includes('pool: watching')) return 1;
  return 1;
}

function isStationaryActivity(entity) {
  const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
  return key.includes('sleep') || key.includes('nap') || key.includes('bed together') || key.includes('waking') || key.includes('pool: lining up') || key.includes('pool: taking shot') || key.includes('pool: watching');
}

function profileForEntity(entity) {
  if (entity.type === 'dog') return 'dog';
  if (entity.id === 'lab_test_subject') return 'labSubject';
  const key = `${entity.id || ''} ${entity.name || ''}`.toLowerCase();
  if (entity.id === 'girlfriend' || key.includes('woman') || key.includes('female')) return 'girlfriend';
  return 'resident';
}

function actorRenderPoint(entity) {
  const key = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
  if (entity.type === 'person' && (key.includes('sleep') || key.includes('nap') || key.includes('bed together') || key.includes('waking'))) {
    const bed = getObject(entity.sleepObjectId || 'bed');
    if (bed && bed.floor === entity.floor) {
      const lane = entity.id === 'girlfriend' ? .64 : .38;
      return { x: bed.x + bed.w * .56, y: bed.y + bed.h * lane };
    }
  }
  return { x: entity.x, y: entity.y };
}

function headingDirection(entity) {
  if (entity.spriteDirection) return entity.spriteDirection;
  const heading = Number(entity.lastHeading || 0);
  const normalized = ((heading % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  if (normalized < Math.PI / 4 || normalized >= Math.PI * 7 / 4) return 'north';
  if (normalized < Math.PI * 3 / 4) return 'east';
  if (normalized < Math.PI * 5 / 4) return 'south';
  return 'west';
}

function animationName(profile, direction) { return `pm2-${profile}-walk-${direction}`; }
function offsetPoint(point, direction, distance) {
  if (direction === 'north') return { x: point.x, y: point.y - distance };
  if (direction === 'south') return { x: point.x, y: point.y + distance };
  if (direction === 'west') return { x: point.x - distance, y: point.y };
  return { x: point.x + distance, y: point.y };
}
function unit(x, y) { const mag = Math.max(.001, Math.hypot(x, y)); return { x: x / mag, y: y / mag }; }
function actorSprites(record) { return [record.sprite, record.sideSprite, record.verticalTop, record.verticalBottom, record.sideTop, record.sideBottom].filter(Boolean); }
function destroyRecord(record) { for (const child of [record.shadow, record.ring, ...actorSprites(record), record.cue, record.label]) child?.destroy?.(); }
