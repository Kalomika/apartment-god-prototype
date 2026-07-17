import { getObject } from './world.js';

export const CHARACTER_ANIMATION_FPS = 8;
export const CHARACTER_FRAME_SIZE = 128;

const DIRECTION_ROWS = ['south', 'west', 'east', 'north'];
const PROFILE_CONFIG = {
  resident: { texture: 'pm2-resident-sheet', fallback: 'pm2-resident-fallback', scale: .78, shadowW: 46, shadowH: 22 },
  girlfriend: { texture: 'pm2-girlfriend-sheet', fallback: 'pm2-girlfriend-fallback', scale: .78, shadowW: 44, shadowH: 21 },
  labSubject: { texture: 'pm2-lab-subject-sheet', fallback: 'pm2-resident-fallback', scale: .78, shadowW: 46, shadowH: 22 },
  dog: { texture: 'pm2-dog-sheet', fallback: 'pm2-dog-fallback', scale: .72, shadowW: 58, shadowH: 25 }
};

export function registerCharacterAnimations(scene) {
  for (const [profile, config] of Object.entries(PROFILE_CONFIG)) {
    const texture = scene.textures.get(config.texture);
    if (!texture || texture.key === '__MISSING') continue;
    for (let row = 0; row < DIRECTION_ROWS.length; row += 1) {
      const direction = DIRECTION_ROWS[row];
      for (let column = 0; column < 4; column += 1) {
        const frameName = `${direction}-${column}`;
        if (!texture.has(frameName)) texture.add(frameName, 0, column * CHARACTER_FRAME_SIZE, row * CHARACTER_FRAME_SIZE, CHARACTER_FRAME_SIZE, CHARACTER_FRAME_SIZE);
      }
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

function ensureActorVisual(scene, layer, entity, profile, point) {
  const existing = scene.pm2ActorVisuals.get(entity.id);
  if (existing?.profile === profile) return existing;
  if (existing) destroyRecord(existing);

  const config = PROFILE_CONFIG[profile];
  const shadow = scene.add.ellipse(point.x, point.y + 20, config.shadowW, config.shadowH, 0x05080d, .24);
  const ring = scene.add.ellipse(point.x, point.y + 17, profile === 'dog' ? 64 : 54, profile === 'dog' ? 34 : 31, 0xf1c66a, 0);
  ring.setStrokeStyle(3, 0xf1c66a, .94);
  const texture = scene.textures.get(config.texture);
  const animated = Boolean(texture && texture.key !== '__MISSING' && texture.has('south-1'));
  const sprite = scene.add.sprite(point.x, point.y, animated ? config.texture : config.fallback, animated ? 'south-1' : undefined);
  sprite.setScale(config.scale);
  sprite.setOrigin(.5, .63);
  const cue = scene.add.graphics();
  const label = scene.add.text(point.x, point.y - 66, '', {
    fontFamily: 'system-ui', fontSize: 10, fontStyle: '900', color: '#071018', backgroundColor: '#f8fbff', padding: { x: 5, y: 3 }
  }).setOrigin(.5, .5);

  for (const child of [shadow, ring, sprite, cue, label]) layer.add(child);
  const record = { profile, animated, shadow, ring, sprite, cue, label, lastX: point.x, lastY: point.y, direction: headingDirection(entity) };
  scene.pm2ActorVisuals.set(entity.id, record);
  return record;
}

function syncActorVisual(scene, state, entity, profile, point, record) {
  const config = PROFILE_CONFIG[profile];
  const previous = { x: record.lastX, y: record.lastY };
  const dx = point.x - previous.x;
  const dy = point.y - previous.y;
  const moving = shouldPlayWalkForTest(previous, point, entity);
  const direction = directionFromDeltaForTest(dx, dy, record.direction || headingDirection(entity));
  record.direction = direction;
  entity.spriteDirection = direction;

  record.shadow.setPosition(point.x, point.y + (profile === 'dog' ? 15 : 19));
  record.shadow.setDisplaySize(config.shadowW, config.shadowH);
  record.shadow.setAlpha(moving ? .19 : .24);
  record.ring.setPosition(point.x, point.y + (profile === 'dog' ? 14 : 17));
  record.ring.setVisible(state.selectedId === entity.id);
  record.sprite.setPosition(point.x, point.y);

  if (moving && record.animated) {
    const key = animationName(profile, direction);
    if (record.sprite.anims.currentAnim?.key !== key || !record.sprite.anims.isPlaying) record.sprite.play(key, true);
  } else {
    record.sprite.stop();
    if (record.animated) record.sprite.setFrame(`${direction}-${stationaryFrame(entity, scene.time.now)}`);
    else if (profile === 'dog') record.sprite.setRotation(directionRotation(direction));
  }

  const depth = point.y + (profile === 'dog' ? 46 : 58);
  record.shadow.setDepth(depth - 3);
  record.ring.setDepth(depth - 2);
  record.sprite.setDepth(depth);
  record.cue.setDepth(depth + 1);
  record.label.setDepth(depth + 4);
  syncPoolCue(record.cue, state, entity, point, direction, moving, scene.time.now);

  const text = visibleActorText(entity);
  record.label.setText(text);
  record.label.setVisible(Boolean(text));
  record.label.setPosition(point.x, point.y - (profile === 'dog' ? 54 : 68));

  record.lastX = point.x;
  record.lastY = point.y;
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
function directionRotation(direction) {
  if (direction === 'east') return Math.PI / 2;
  if (direction === 'south') return Math.PI;
  if (direction === 'west') return -Math.PI / 2;
  return 0;
}
function offsetPoint(point, direction, distance) {
  if (direction === 'north') return { x: point.x, y: point.y - distance };
  if (direction === 'south') return { x: point.x, y: point.y + distance };
  if (direction === 'west') return { x: point.x - distance, y: point.y };
  return { x: point.x + distance, y: point.y };
}
function unit(x, y) { const mag = Math.max(.001, Math.hypot(x, y)); return { x: x / mag, y: y / mag }; }
function destroyRecord(record) { for (const child of [record.shadow, record.ring, record.sprite, record.cue, record.label]) child?.destroy?.(); }
