import { getObject } from './world.js';

export const CHARACTER_ANIMATION_FPS = 8;
export const CHARACTER_FRAME_SIZE = 128;

const DIRECTION_ROWS = ['south', 'west', 'east', 'north'];
const PROFILE_CONFIG = {
  resident: { texture: 'ag-resident-sheet', scale: .78, shadowW: 46, shadowH: 22 },
  girlfriend: { texture: 'ag-girlfriend-sheet', scale: .78, shadowW: 44, shadowH: 21 },
  labSubject: { texture: 'ag-lab-subject-sheet', scale: .78, shadowW: 46, shadowH: 22 },
  dog: { texture: 'ag-dog-sheet', scale: .72, shadowW: 58, shadowH: 25 }
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
      const key = animationName(profile, direction);
      if (!scene.anims.exists(key)) {
        scene.anims.create({
          key,
          frames: [0, 1, 2, 3].map(column => ({ key: config.texture, frame: `${direction}-${column}` })),
          frameRate: CHARACTER_ANIMATION_FPS,
          repeat: -1
        });
      }
    }
  }
}

export function syncCharacterVisuals(scene, state, actorLayer) {
  scene.apartmentGodActorVisuals ??= new Map();
  const activeIds = new Set();

  for (const entity of state.entities || []) {
    if (!entity || entity.hidden || entity.floor !== state.floor) continue;
    activeIds.add(entity.id);
    const profile = profileForEntity(entity);
    const point = actorRenderPoint(entity);
    const record = ensureActorVisual(scene, actorLayer, entity, profile, point);
    syncActorVisual(scene, state, entity, profile, point, record);
  }

  for (const [id, record] of scene.apartmentGodActorVisuals.entries()) {
    if (activeIds.has(id)) continue;
    destroyRecord(record);
    scene.apartmentGodActorVisuals.delete(id);
  }

  if (typeof actorLayer?.sort === 'function') actorLayer.sort('depth');
}

export function clearCharacterVisuals(scene) {
  for (const record of scene.apartmentGodActorVisuals?.values?.() || []) destroyRecord(record);
  scene.apartmentGodActorVisuals?.clear?.();
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
  const existing = scene.apartmentGodActorVisuals.get(entity.id);
  if (existing?.profile === profile) return existing;
  if (existing) destroyRecord(existing);

  const config = PROFILE_CONFIG[profile];
  const shadow = scene.add.ellipse(point.x, point.y + 20, config.shadowW, config.shadowH, 0x05080d, .24);
  const ring = scene.add.ellipse(point.x, point.y + 17, profile === 'dog' ? 64 : 54, profile === 'dog' ? 34 : 31, 0xf1c66a, 0);
  ring.setStrokeStyle(3, 0xf1c66a, .94);
  const sprite = scene.add.sprite(point.x, point.y, config.texture, 'south-1');
  sprite.setScale(config.scale);
  sprite.setOrigin(.5, .63);
  const cue = scene.add.graphics();
  const label = scene.add.text(point.x, point.y - 66, '', {
    fontFamily: 'system-ui', fontSize: 10, fontStyle: '900', color: '#071018', backgroundColor: '#f8fbff', padding: { x: 5, y: 3 }
  }).setOrigin(.5, .5);

  for (const child of [shadow, ring, sprite, cue, label]) layer.add(child);
  const record = { profile, shadow, ring, sprite, cue, label, lastX: point.x, lastY: point.y, direction: headingDirection(entity) };
  scene.apartmentGodActorVisuals.set(entity.id, record);
  return record;
}

function syncActorVisual(scene, state, entity, profile, point, record) {
  const config = PROFILE_CONFIG[profile];
  const previous = { x: record.lastX, y: record.lastY };
  const dx = point.x - previous.x;
  const dy = point.y - previous.y;
  const direction = directionFromDeltaForTest(dx, dy, record.direction || headingDirection(entity));
  const visual = activityVisual(entity, scene.time.now);
  const moving = shouldPlayWalkForTest(previous, point, entity) || visual.forceLoop;
  record.direction = direction;
  entity.spriteDirection = direction;

  record.shadow.setPosition(point.x, point.y + (profile === 'dog' ? 15 : 19));
  record.shadow.setDisplaySize(config.shadowW * visual.shadowScale, config.shadowH * visual.shadowScale);
  record.shadow.setAlpha(visual.hideShadow ? 0 : moving ? .19 : .24);
  record.ring.setPosition(point.x, point.y + (profile === 'dog' ? 14 : 17));
  record.ring.setVisible(state.selectedId === entity.id);
  record.sprite.setPosition(point.x + visual.offsetX, point.y + visual.offsetY);
  record.sprite.setRotation(visual.rotation);
  record.sprite.setScale(config.scale * visual.scaleX, config.scale * visual.scaleY);
  record.sprite.setAlpha(visual.alpha);

  if (moving && visual.useWalkLoop) {
    const key = animationName(profile, direction);
    if (record.sprite.anims.currentAnim?.key !== key || !record.sprite.anims.isPlaying) record.sprite.play(key, true);
  } else {
    record.sprite.stop();
    record.sprite.setFrame(`${direction}-${visual.frame}`);
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

function activityVisual(entity, now) {
  const key = activityKey(entity);
  const tick = Math.floor(now / 125) % 4;
  const base = { frame: 1, useWalkLoop: true, forceLoop: false, rotation: 0, scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0, alpha: 1, shadowScale: 1, hideShadow: false };

  if (key.includes('sleep') || key.includes('nap') || key.includes('bed together') || key.includes('waking')) {
    return { ...base, frame: 1, useWalkLoop: false, rotation: Math.PI / 2, scaleX: 1.02, scaleY: .92, offsetY: 4, shadowScale: .8 };
  }
  if (key.includes('treadmill')) return { ...base, useWalkLoop: true, forceLoop: true, scaleY: .98 };
  if (key.includes('swim')) return { ...base, useWalkLoop: true, forceLoop: true, rotation: entity.lastHeading || 0, scaleX: 1.04, scaleY: .82, alpha: .92, hideShadow: true };
  if (key.includes('lift weights') || key.includes('lift_weights')) {
    return { ...base, frame: tick < 2 ? 0 : 2, useWalkLoop: false, rotation: Math.PI / 2, scaleX: 1.02, scaleY: .92, offsetY: 3, shadowScale: .82 };
  }
  if (key.includes('heavy bag') || key.includes('heavy_bag')) return { ...base, frame: tick < 2 ? 1 : 3, useWalkLoop: false, rotation: Math.sin(now / 125) * .035 };
  if (key.includes('pool: taking shot')) return { ...base, frame: tick < 2 ? 1 : 3, useWalkLoop: false, scaleY: .96 };
  if (key.includes('pool: lining up') || key.includes('pool: watching')) return { ...base, frame: 1, useWalkLoop: false };
  if (key.includes('arcade') || key.includes('console') || key.includes('desk work') || key.includes('desk_work') || key.includes('read') || key.includes('phone')) {
    return { ...base, frame: 1, useWalkLoop: false, scaleY: .93, offsetY: 5, shadowScale: .9 };
  }
  if (key.includes('eat') || key.includes('sit table') || key.includes('sit_table') || key.includes('watch tv') || key.includes('relax')) {
    return { ...base, frame: 1, useWalkLoop: false, scaleY: .91, offsetY: 7, shadowScale: .88 };
  }
  if (key.includes('shower') || key.includes('bath')) return { ...base, frame: tick < 2 ? 0 : 2, useWalkLoop: false, alpha: .96, hideShadow: true };
  if (key.includes('toilet') || key.includes('pee standing')) return { ...base, frame: 1, useWalkLoop: false, scaleY: .94, offsetY: 4, shadowScale: .9 };
  if (key.includes('basketball')) return { ...base, frame: tick, useWalkLoop: false };
  if (key.includes('dog rest')) return { ...base, frame: 1, useWalkLoop: false, rotation: Math.PI / 2, scaleX: 1.02, scaleY: .86, offsetY: 6, shadowScale: .85 };
  return base;
}

function syncPoolCue(graphics, state, entity, point, direction, moving, now) {
  graphics.clear();
  const key = activityKey(entity);
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

function isStationaryActivity(entity) {
  const key = activityKey(entity);
  return key.includes('sleep') || key.includes('nap') || key.includes('bed together') || key.includes('waking') || key.includes('pool: lining up') || key.includes('pool: taking shot') || key.includes('pool: watching') || key.includes('arcade') || key.includes('console') || key.includes('desk work') || key.includes('desk_work') || key.includes('read') || key.includes('phone') || key.includes('eat') || key.includes('sit table') || key.includes('sit_table') || key.includes('watch tv') || key.includes('relax') || key.includes('lift weights') || key.includes('lift_weights') || key.includes('heavy bag') || key.includes('heavy_bag') || key.includes('shower') || key.includes('bath') || key.includes('toilet') || key.includes('pee standing') || key.includes('basketball') || key.includes('dog rest');
}

function profileForEntity(entity) {
  if (entity.type === 'dog') return 'dog';
  if (entity.id === 'lab_test_subject') return 'labSubject';
  const key = `${entity.id || ''} ${entity.name || ''}`.toLowerCase();
  if (entity.id === 'girlfriend' || key.includes('woman') || key.includes('female')) return 'girlfriend';
  return 'resident';
}

function actorRenderPoint(entity) {
  const key = activityKey(entity);
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

function activityKey(entity) { return `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase(); }
function animationName(profile, direction) { return `ag-${profile}-walk-${direction}`; }
function offsetPoint(point, direction, distance) {
  if (direction === 'north') return { x: point.x, y: point.y - distance };
  if (direction === 'south') return { x: point.x, y: point.y + distance };
  if (direction === 'west') return { x: point.x - distance, y: point.y };
  return { x: point.x + distance, y: point.y };
}
function unit(x, y) { const magnitude = Math.max(.001, Math.hypot(x, y)); return { x: x / magnitude, y: y / magnitude }; }
function destroyRecord(record) { for (const child of [record.shadow, record.ring, record.sprite, record.cue, record.label]) child?.destroy?.(); }
