import { floors, objects } from './world.js';
import { setBaseActorVisualVisible } from './phaserCharacterAnimationSystem.js';
import { textureForObject } from './phaserMigration2VisualCatalog.js';

export const REFERENCE_ACTIVITY_FPS = 8;
export const REFERENCE_ACTIVITY_FRAME_MS = 1000 / REFERENCE_ACTIVITY_FPS;
export const REFERENCE_HUMAN_ACTIVITIES = ['cook','eat','coffee','shower','bath','toilet','sleep','sit','tv','cuddle','desk_work','read','arcade','pool','basketball','treadmill','weights','heavy_bag','swim','soccer','wash_dog','pet_dog','vehicle','phone','change_clothes','cleaning','dance'];
export const REFERENCE_DOG_ACTIVITIES = ['dog_eat','dog_drink','dog_sleep','dog_soccer','dog_wash','dog_pet','dog_kennel'];
export const REFERENCE_OBJECT_STATES = ['fridge_open','stove_cooking','sink_running','coffee_brewing','shower_active','bathtub_active','toilet_occupied','bed_sleeping','bed_made','tv_on','desk_active','arcade_active','pool_table_active','treadmill_active','weight_bench_active','heavy_bag_active','door_open','garage_door_open','car_open','dog_bowl_active','swim_pool_active','soccer_field_active','closet_open'];

const ROOT = 'assets/phaser-migration-2/sprites';
const MAX_ACTIVITY_TEXTURES = 18;
const MAX_STATE_TEXTURES = 10;
const activityObjectKinds = {
  cook:['stove'], eat:['dining_table','fridge'], coffee:['coffee_maker'], shower:['shower'], bath:['bathtub'], toilet:['toilet'], sleep:['bed'], sit:['couch'], tv:['couch','tv'], cuddle:['couch'], desk_work:['desk'], read:['bookshelf','couch'], arcade:['arcade','arcade_machine'], pool:['pool_table'], basketball:['basketball_court'], treadmill:['treadmill'], weights:['weight_bench'], heavy_bag:['heavy_bag'], swim:['swim_pool'], soccer:['soccer_field'], wash_dog:['dog_bath'], pet_dog:['dog_bed','kennel'], vehicle:['car','bike','motorbike','atv'], change_clothes:['closet'], cleaning:['vacuum_cleaner','robot_vacuum','cleaning_closet'], dog_eat:['dog_bowl'], dog_drink:['dog_bowl'], dog_sleep:['dog_bed'], dog_soccer:['soccer_field'], dog_wash:['dog_bath'], dog_pet:['dog_bed','kennel'], dog_kennel:['kennel']
};
const activityLayout = {
  cook:{w:78,h:78,y:-8}, eat:{w:74,h:74,y:-4}, coffee:{w:70,h:70,y:-6}, shower:{w:74,h:84,y:0}, bath:{w:104,h:68,y:0}, toilet:{w:72,h:76,y:-2}, sleep:{w:112,h:78,y:0}, sit:{w:76,h:72,y:-3}, tv:{w:76,h:72,y:-3}, cuddle:{w:80,h:74,y:-3}, desk_work:{w:78,h:76,y:-6}, read:{w:78,h:76,y:-4}, arcade:{w:82,h:82,y:-7}, pool:{w:92,h:78,y:-3}, basketball:{w:76,h:82,y:-8}, treadmill:{w:76,h:86,y:-2}, weights:{w:104,h:68,y:0}, heavy_bag:{w:84,h:84,y:-5}, swim:{w:105,h:70,y:0}, soccer:{w:80,h:82,y:-6}, wash_dog:{w:90,h:78,y:-2}, pet_dog:{w:88,h:76,y:-2}, vehicle:{w:74,h:70,y:0}, phone:{w:70,h:76,y:-5}, change_clothes:{w:76,h:82,y:-8}, cleaning:{w:82,h:82,y:-4}, dance:{w:80,h:84,y:-7}, dog_eat:{w:74,h:70,y:0}, dog_drink:{w:74,h:70,y:0}, dog_sleep:{w:86,h:62,y:0}, dog_soccer:{w:78,h:72,y:-2}, dog_wash:{w:82,h:72,y:0}, dog_pet:{w:78,h:70,y:0}, dog_kennel:{w:86,h:62,y:0}
};

export function preloadReferenceCompletion(scene) {
  scene.pm2ReferenceAssetMode = 'lazy-optional';
}

export function createReferenceCompletion(scene) {
  if (scene.referenceCompletion) return scene.referenceCompletion;
  const architecture = scene.add.graphics().setDepth(-820);
  const lighting = scene.add.graphics().setDepth(8500).setBlendMode('ADD');
  const effects = scene.add.graphics().setDepth(8600);
  const foreground = scene.add.graphics().setDepth(7800);
  scene.roomLayer?.add?.(architecture);
  scene.fxLayer?.add?.(lighting);
  scene.fxLayer?.add?.(effects);
  scene.fxLayer?.add?.(foreground);

  const system = {
    architecture,
    lighting,
    effects,
    foreground,
    activitySprites: new Map(),
    loadingTextures: new Set(),
    failedTextures: new Set(),
    loadedActivityTextures: new Set(),
    loadedStateTextures: new Set(),
    lastUsed: new Map(),
    lastFloor: null,
    disposed: false
  };
  scene.referenceCompletion = system;
  for (const entity of scene.state?.entities || []) ensureActivityRecord(scene, system, entity);
  drawArchitecture(scene, true);
  return system;
}

export function syncReferenceCompletion(scene) {
  const system = scene.referenceCompletion || createReferenceCompletion(scene);
  if (!system || system.disposed || !scene.state) return;
  drawArchitecture(scene, false);
  const now = scene.time?.now || performance.now();
  const activeByObject = new Map();
  const activeActivityTextures = new Set();

  for (const entity of scene.state.entities || []) {
    const record = ensureActivityRecord(scene, system, entity);
    const next = activityKey(entity);
    if (next !== record.current) {
      if (record.current) {
        record.exit = record.current;
        record.exitUntil = now + REFERENCE_ACTIVITY_FRAME_MS * 2;
      }
      record.current = next;
      record.startedAt = now;
    }

    const showing = record.current || (record.exit && now < record.exitUntil ? record.exit : null);
    if (!showing || entity.hidden || entity.floor !== scene.state.floor) {
      hideActivityRecord(scene, entity, record);
      if (record.exit && now >= record.exitUntil) record.exit = null;
      continue;
    }

    const texture = activityTextureKey(record.actor, showing);
    if (!ensureActivityTexture(scene, system, record.actor, showing, now)) {
      hideActivityRecord(scene, entity, record);
      continue;
    }

    const object = findActivityObject(entity, showing);
    if (object) activeByObject.set(object.id, showing);
    if (record.sprite.texture?.key !== texture) record.sprite.setTexture(texture);
    record.sprite.setFrame(activityFrame(record, now));
    placeActivitySprite(record.sprite, entity, object, showing);
    record.sprite.setVisible(true);
    setBaseActorVisualVisible(scene, entity.id, false);
    entity.pm2ReferenceActivityActive = true;
    activeActivityTextures.add(texture);
    touchTexture(system, texture, now);
  }

  const activeStateTextures = syncObjectStates(scene, system, activeByObject, now);
  drawLightingAndEffects(scene, activeByObject, now);
  pruneTexturePool(scene, system, system.loadedActivityTextures, activeActivityTextures, MAX_ACTIVITY_TEXTURES);
  pruneTexturePool(scene, system, system.loadedStateTextures, activeStateTextures, MAX_STATE_TEXTURES);
}

export function destroyReferenceCompletion(scene) {
  const system = scene.referenceCompletion;
  if (!system) return;
  system.disposed = true;
  for (const record of system.activitySprites.values()) record.sprite?.destroy?.();
  for (const entity of scene.state?.entities || []) setBaseActorVisualVisible(scene, entity.id, true);
  system.architecture?.destroy?.();
  system.lighting?.destroy?.();
  system.effects?.destroy?.();
  system.foreground?.destroy?.();
  scene.referenceCompletion = null;
}

export function activityKey(entity) {
  const text = `${entity.currentActionId||''} ${entity.actionId||''} ${entity.action||''} ${entity.pose||''}`.toLowerCase();
  const dog = actorKey(entity) === 'dog';
  if (/walking|running|going to|idle|stand|recovered/.test(text) && !Number(entity.actionT||0)) return null;
  if (dog) {
    if (/wash dog|dog bath|being washed/.test(text)) return 'dog_wash';
    if (/soccer|ball|fetch/.test(text)) return 'dog_soccer';
    if (/drink/.test(text)) return 'dog_drink';
    if (/eat|bowl|food/.test(text)) return 'dog_eat';
    if (/kennel/.test(text)) return 'dog_kennel';
    if (/pet|scratch|cuddle/.test(text)) return 'dog_pet';
    if (/sleep|rest|nap/.test(text)) return 'dog_sleep';
    return null;
  }
  if (/wash dog/.test(text)) return 'wash_dog';
  if (/pet dog|petting|scratch dog/.test(text)) return 'pet_dog';
  if (/change clothes|wardrobe|outfit/.test(text)) return 'change_clothes';
  if (/cook|meal prep|stove/.test(text)) return 'cook';
  if (/coffee|espresso/.test(text)) return 'coffee';
  if (/shower/.test(text)) return 'shower';
  if (/bath(?!room)/.test(text)) return 'bath';
  if (/toilet|bathroom|bladder/.test(text)) return 'toilet';
  if (/sleep|nap|bedtime/.test(text)) return 'sleep';
  if (/cuddle|hold hands|kiss/.test(text)) return 'cuddle';
  if (/watch tv|television|movie|show/.test(text)) return 'tv';
  if (/desk|laptop|computer|work from home|animation work/.test(text)) return 'desk_work';
  if (/read|book/.test(text)) return 'read';
  if (/arcade|fighter game|pong|racing game/.test(text)) return 'arcade';
  if (/play pool|pool shot|pool:/.test(text)) return 'pool';
  if (/basketball|shoot hoop|dribble/.test(text)) return 'basketball';
  if (/treadmill/.test(text)) return 'treadmill';
  if (/weight|bench press|lift/.test(text)) return 'weights';
  if (/heavy bag|punch|boxing/.test(text)) return 'heavy_bag';
  if (/swim/.test(text)) return 'swim';
  if (/soccer|football practice/.test(text)) return 'soccer';
  if (/drive|vehicle|passenger|car ride|bike ride|motorbike|atv/.test(text)) return 'vehicle';
  if (/phone|call|texting/.test(text)) return 'phone';
  if (/vacuum|clean|tidy|mop/.test(text)) return 'cleaning';
  if (/dance|music/.test(text)) return 'dance';
  if (/eat|snack|meal|dining/.test(text)) return 'eat';
  if (/sit|rest|couch/.test(text)) return 'sit';
  return null;
}

function ensureActivityRecord(scene, system, entity) {
  let record = system.activitySprites.get(entity.id);
  if (record) return record;
  const actor = actorKey(entity);
  const sprite = scene.add.sprite(entity.x, entity.y, '__MISSING', 0).setVisible(false).setOrigin(.5, .72);
  sprite.pm2ReferenceActivity = true;
  sprite.pm2EntityId = entity.id;
  scene.actorLayer?.add?.(sprite);
  record = { sprite, actor, current: null, startedAt: 0, exit: null, exitUntil: 0 };
  system.activitySprites.set(entity.id, record);
  return record;
}

function hideActivityRecord(scene, entity, record) {
  record.sprite.setVisible(false);
  if (record.sprite.texture?.key !== '__MISSING') record.sprite.setTexture('__MISSING');
  setBaseActorVisualVisible(scene, entity.id, true);
  entity.pm2ReferenceActivityActive = false;
}

function activityTextureKey(actor, activity) {
  return `pm2-activity-${actor}-${activity}`;
}

function activityTextureUrl(actor, activity) {
  return actor === 'dog' ? `${ROOT}/activities/${activity}/dog.png` : `${ROOT}/activities/${activity}/${actor}.png`;
}

function stateTextureKey(state) {
  return `pm2-state-${state}`;
}

function stateTextureUrl(state) {
  return `${ROOT}/states/${state}.png`;
}

function ensureActivityTexture(scene, system, actor, activity, now) {
  const key = activityTextureKey(actor, activity);
  if (scene.textures.exists(key)) {
    system.loadedActivityTextures.add(key);
    touchTexture(system, key, now);
    return true;
  }
  queueOptionalTexture(scene, system, {
    key,
    type: 'spritesheet',
    url: activityTextureUrl(actor, activity),
    config: { frameWidth: 128, frameHeight: 128 },
    destination: system.loadedActivityTextures
  });
  return false;
}

function ensureStateTexture(scene, system, state, now) {
  const key = stateTextureKey(state);
  if (scene.textures.exists(key)) {
    system.loadedStateTextures.add(key);
    touchTexture(system, key, now);
    return true;
  }
  queueOptionalTexture(scene, system, {
    key,
    type: 'image',
    url: stateTextureUrl(state),
    destination: system.loadedStateTextures
  });
  return false;
}

function queueOptionalTexture(scene, system, request) {
  if (system.disposed || system.failedTextures.has(request.key) || system.loadingTextures.has(request.key)) return;
  system.loadingTextures.add(request.key);

  const completeEvent = `filecomplete-${request.type}-${request.key}`;
  const onComplete = () => {
    scene.load.off('loaderror', onError);
    system.loadingTextures.delete(request.key);
    if (system.disposed) return;
    request.destination.add(request.key);
    touchTexture(system, request.key, scene.time?.now || performance.now());
  };
  const onError = file => {
    if (file?.key !== request.key) return;
    scene.load.off(completeEvent, onComplete);
    scene.load.off('loaderror', onError);
    system.loadingTextures.delete(request.key);
    system.failedTextures.add(request.key);
    console.warn(`[Apartment God] Optional Phaser visual skipped: ${request.key}`);
  };

  scene.load.once(completeEvent, onComplete);
  scene.load.on('loaderror', onError);
  if (request.type === 'spritesheet') scene.load.spritesheet(request.key, request.url, request.config);
  else scene.load.image(request.key, request.url);
  scene.load.start();
}

function touchTexture(system, key, now) {
  system.lastUsed.set(key, now);
}

function pruneTexturePool(scene, system, pool, activeKeys, limit) {
  if (pool.size <= limit) return;
  const candidates = [...pool]
    .filter(key => !activeKeys.has(key) && !system.loadingTextures.has(key))
    .sort((a, b) => (system.lastUsed.get(a) || 0) - (system.lastUsed.get(b) || 0));
  while (pool.size > limit && candidates.length) {
    const key = candidates.shift();
    if (scene.textures.exists(key)) scene.textures.remove(key);
    pool.delete(key);
    system.lastUsed.delete(key);
  }
}

function actorKey(entity) {
  const text = `${entity.id||''} ${entity.name||''} ${entity.kind||''} ${entity.type||''}`.toLowerCase();
  if (text.includes('dog')) return 'dog';
  if (text.includes('girlfriend') || text.includes('partner')) return 'girlfriend';
  if (text.includes('lab') || text.includes('subject')) return 'lab_subject';
  return 'resident';
}

function activityFrame(record, now) {
  if (!record.current) {
    const elapsed = Math.max(0, REFERENCE_ACTIVITY_FRAME_MS * 2 - Math.max(0, record.exitUntil - now));
    return 6 + Math.min(1, Math.floor(elapsed / REFERENCE_ACTIVITY_FRAME_MS));
  }
  const elapsed = Math.max(0, now - record.startedAt);
  if (elapsed < REFERENCE_ACTIVITY_FRAME_MS * 2) return Math.min(1, Math.floor(elapsed / REFERENCE_ACTIVITY_FRAME_MS));
  return 2 + (Math.floor((elapsed - REFERENCE_ACTIVITY_FRAME_MS * 2) / REFERENCE_ACTIVITY_FRAME_MS) % 4);
}

function findActivityObject(entity, activity) {
  const kinds = activityObjectKinds[activity] || [];
  const explicitIds = [
    entity.showerObjectId,
    entity.toiletObjectId,
    entity.sleepObjectId,
    entity.bedObjectId,
    entity.targetObjectId,
    entity.objectId,
    entity.pending?.objectId,
    entity.target?.objectId,
    entity.target?.id
  ].filter(Boolean);
  for (const id of explicitIds) {
    const found = objects.find(object => object.id === id && object.floor === entity.floor);
    if (found && (!kinds.length || kinds.includes(found.kind))) return found;
  }

  let best = null;
  let bestDistance = Infinity;
  for (const object of objects) {
    if (object.floor !== entity.floor || !kinds.includes(object.kind)) continue;
    const dx = entity.x - (object.x + object.w / 2);
    const dy = entity.y - (object.y + object.h / 2);
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      best = object;
      bestDistance = distance;
    }
  }
  return best;
}

function placeActivitySprite(sprite, entity, object, activity) {
  const layout = activityLayout[activity] || { w: 76, h: 78, y: -4 };
  let x = entity.x;
  let y = entity.y + layout.y;
  let depth = entity.y + 60;
  let rotation = 0;
  if (object) {
    const centerX = object.x + object.w / 2;
    const centerY = object.y + object.h / 2;
    if (['sleep','bath','shower','toilet','weights','treadmill','swim','vehicle','dog_wash','dog_kennel'].includes(activity)) {
      x = centerX;
      y = centerY + layout.y;
      depth = object.y + object.h + 12;
    } else if (['desk_work','arcade','cook','coffee','cleaning'].includes(activity)) {
      depth = Math.max(entity.y + 55, object.y + object.h + 8);
    }
    const facing = object.facing || object.headboard;
    if (facing === 'east') rotation = Math.PI / 2;
    else if (facing === 'west') rotation = -Math.PI / 2;
    else if (facing === 'up' || facing === 'north') rotation = Math.PI;
  }
  sprite.setPosition(x, y).setDisplaySize(layout.w, layout.h).setDepth(depth).setRotation(rotation);
}

function stateKeyForObject(state, object, activeByObject) {
  const activity = activeByObject.get(object.id) || null;
  if (object.kind === 'fridge' && ['eat','cook'].includes(activity)) return 'fridge_open';
  if (object.kind === 'stove' && activity === 'cook') return 'stove_cooking';
  if (object.kind === 'sink' && ['cleaning','shower','toilet'].includes(activity)) return 'sink_running';
  if (object.kind === 'coffee_maker' && activity === 'coffee') return 'coffee_brewing';
  if (object.kind === 'shower' && activity === 'shower') return 'shower_active';
  if (object.kind === 'bathtub' && activity === 'bath') return 'bathtub_active';
  if (object.kind === 'toilet' && activity === 'toilet') return 'toilet_occupied';
  if (object.kind === 'bed' && activity === 'sleep') return 'bed_sleeping';
  if (object.kind === 'bed' && (state.objectState?.bedMade?.[object.id] || state.objectState?.bedMade === true)) return 'bed_made';
  if (object.kind === 'tv' && state.tv?.on) return 'tv_on';
  if (object.kind === 'desk' && activity === 'desk_work') return 'desk_active';
  if ((object.kind === 'arcade' || object.kind === 'arcade_machine') && activity === 'arcade') return 'arcade_active';
  if (object.kind === 'pool_table' && activity === 'pool') return 'pool_table_active';
  if (object.kind === 'treadmill' && activity === 'treadmill') return 'treadmill_active';
  if (object.kind === 'weight_bench' && activity === 'weights') return 'weight_bench_active';
  if (object.kind === 'heavy_bag' && activity === 'heavy_bag') return 'heavy_bag_active';
  if (object.kind === 'door' && (state.objectState?.doors?.[object.id] || state.objectState?.doorOpen?.[object.id])) return 'door_open';
  if (object.kind === 'stairs' && object.styleAs === 'door' && state.objectState?.doors?.[object.id]) return 'door_open';
  if (object.kind === 'garage_door' && state.objectState?.garageDoorOpen) return 'garage_door_open';
  if (object.kind === 'car' && (state.vehicleState?.[object.id]?.doorOpen || state.objectState?.vehicleDoors?.[object.id])) return 'car_open';
  if (object.kind === 'dog_bowl' && ['dog_eat','dog_drink'].includes(activity)) return 'dog_bowl_active';
  if (object.kind === 'swim_pool' && activity === 'swim') return 'swim_pool_active';
  if (object.kind === 'soccer_field' && ['soccer','dog_soccer'].includes(activity)) return 'soccer_field_active';
  if (object.kind === 'closet' && activity === 'change_clothes') return 'closet_open';
  return null;
}

function syncObjectStates(scene, system, activeByObject, now) {
  const activeStateTextures = new Set();
  for (const sprite of scene.nativeObjects || []) {
    const object = sprite.pm2Object;
    if (!object) continue;
    const stateKey = stateKeyForObject(scene.state, object, activeByObject);
    const baseTexture = textureForObject(object);
    if (!stateKey) {
      if (sprite.texture?.key !== baseTexture) sprite.setTexture(baseTexture);
      sprite.setDisplaySize(Math.max(18, object.w), Math.max(18, object.h));
      continue;
    }

    const stateTexture = stateTextureKey(stateKey);
    if (ensureStateTexture(scene, system, stateKey, now)) {
      if (sprite.texture?.key !== stateTexture) sprite.setTexture(stateTexture);
      activeStateTextures.add(stateTexture);
      touchTexture(system, stateTexture, now);
    } else if (sprite.texture?.key !== baseTexture) {
      sprite.setTexture(baseTexture);
    }
    sprite.setDisplaySize(Math.max(18, object.w), Math.max(18, object.h));
  }
  return activeStateTextures;
}

function drawArchitecture(scene, force) {
  const system = scene.referenceCompletion;
  if (!system) return;
  const floorId = scene.state.floor;
  if (!force && system.lastFloor === floorId) return;
  system.lastFloor = floorId;
  const graphics = system.architecture;
  const foreground = system.foreground;
  graphics.clear();
  foreground.clear();
  const rooms = floors.find(floor => floor.id === floorId)?.rooms || floors[floorId]?.rooms || [];
  for (const room of rooms) {
    graphics.lineStyle(10, 0x101820, .95);
    graphics.strokeRoundedRect(room.x, room.y, room.w, room.h, 8);
    graphics.lineStyle(3, 0x8aa6b7, .24);
    graphics.strokeRoundedRect(room.x + 5, room.y + 5, room.w - 10, room.h - 10, 6);
    graphics.lineStyle(5, 0xc8a36c, .22);
    graphics.lineBetween(room.x + 12, room.y + 12, room.x + room.w - 12, room.y + 12);
    foreground.lineStyle(9, 0x0c131a, .9);
    foreground.lineBetween(room.x + 8, room.y + room.h - 3, room.x + room.w - 8, room.y + room.h - 3);
    const windowColor = room.id.includes('bath') ? 0x8ee7ee : 0x72b9d1;
    graphics.lineStyle(6, windowColor, .55);
    if (room.w > 240) graphics.lineBetween(room.x + room.w * .34, room.y + 5, room.x + room.w * .66, room.y + 5);
  }
  if (floorId === 0) {
    graphics.fillStyle(0x4e3c31, .7);
    graphics.fillRoundedRect(472, 48, 286, 21, 7);
    graphics.lineStyle(4, 0xc59b69, .35);
    graphics.lineBetween(480, 58, 750, 58);
    graphics.lineStyle(7, 0x15212b, .95);
    graphics.lineBetween(784, 166, 932, 166);
  }
  if (floorId === 1) {
    graphics.lineStyle(7, 0x192630, .9);
    graphics.strokeRoundedRect(30, 530, 416, 146, 10);
  }
  if (floorId === 3) {
    graphics.lineStyle(5, 0xf1c66a, .25);
    for (let x = 90; x < 900; x += 90) graphics.lineBetween(x, 45, x, 675);
  }
}

function drawLightingAndEffects(scene, activeByObject, now) {
  const system = scene.referenceCompletion;
  const lighting = system.lighting;
  const effects = system.effects;
  lighting.clear();
  effects.clear();
  const floorId = scene.state.floor;
  for (const light of objects.filter(object => object.floor === floorId && object.kind === 'light')) {
    if (scene.state.roomLights?.[light.room] === false) continue;
    for (let radius = 130, alpha = .018; radius > 25; radius -= 22, alpha += .012) {
      lighting.fillStyle(0xf1d49a, alpha);
      lighting.fillCircle(light.x + light.w / 2, light.y + light.h / 2, radius);
    }
  }
  for (const object of objects.filter(candidate => candidate.floor === floorId)) {
    const activity = activeByObject.get(object.id);
    if (object.kind === 'tv' && scene.state.tv?.on) {
      lighting.fillStyle(0x57cce5, .12);
      lighting.fillTriangle(object.x, object.y + object.h, object.x + object.w, object.y + object.h, object.x + object.w / 2, object.y + object.h + 180);
    }
    if (['shower','bath','wash_dog','dog_wash'].includes(activity)) {
      const centerX = object.x + object.w / 2;
      const centerY = object.y + object.h / 2;
      effects.lineStyle(3, 0xd8f7fb, .45);
      for (let index = 0; index < 4; index += 1) {
        const drift = Math.sin(now / 450 + index) * 8;
        effects.beginPath();
        effects.moveTo(centerX - 20 + index * 13, centerY + 18);
        effects.quadraticBezierTo(centerX - 30 + index * 13 + drift, centerY - 8, centerX - 16 + index * 13, centerY - 35);
        effects.strokePath();
      }
    }
    if (object.kind === 'swim_pool') {
      effects.lineStyle(2, 0xcdf8ff, .32);
      for (let y = object.y + 28; y < object.y + object.h; y += 28) {
        const wave = Math.sin(now / 350 + y) * 7;
        effects.lineBetween(object.x + 18 + wave, y, object.x + object.w - 18 + wave, y);
      }
    }
  }
  lighting.fillStyle(0x06101a, .08);
  lighting.fillRect(0, 0, 960, 720);
}
