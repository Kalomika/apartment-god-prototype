import { floors, objects } from './world.js';
import { textureForObject } from './phaserMigration2VisualCatalog.js';

export const REFERENCE_ACTIVITY_FPS = 8;
export const REFERENCE_ACTIVITY_FRAME_MS = 1000 / REFERENCE_ACTIVITY_FPS;
export const REFERENCE_HUMAN_ACTIVITIES = ["cook","eat","coffee","shower","bath","toilet","sleep","sit","tv","cuddle","desk_work","read","arcade","pool","basketball","treadmill","weights","heavy_bag","swim","soccer","wash_dog","pet_dog","vehicle","phone","change_clothes","cleaning","dance"];
export const REFERENCE_DOG_ACTIVITIES = ["dog_eat","dog_drink","dog_sleep","dog_soccer","dog_wash","dog_pet","dog_kennel"];
export const REFERENCE_OBJECT_STATES = ["fridge_open","stove_cooking","sink_running","coffee_brewing","shower_active","bathtub_active","toilet_occupied","bed_sleeping","bed_made","tv_on","desk_active","arcade_active","pool_table_active","treadmill_active","weight_bench_active","heavy_bag_active","door_open","garage_door_open","car_open","dog_bowl_active","swim_pool_active","soccer_field_active","closet_open"];

const ROOT = 'assets/phaser-migration-2/sprites';
const ACTOR_KEYS = ['resident','girlfriend','lab_subject'];
const activityObjectKinds = {
  cook:['stove'], eat:['dining_table','fridge'], coffee:['coffee_maker'], shower:['shower'], bath:['bathtub'], toilet:['toilet'], sleep:['bed'], sit:['couch'], tv:['couch','tv'], cuddle:['couch'], desk_work:['desk'], read:['bookshelf','couch'], arcade:['arcade','arcade_machine'], pool:['pool_table'], basketball:['basketball_court'], treadmill:['treadmill'], weights:['weight_bench'], heavy_bag:['heavy_bag'], swim:['swim_pool'], soccer:['soccer_field'], wash_dog:['dog_bath'], pet_dog:['dog_bed','kennel'], vehicle:['car','bike','motorbike','atv'], change_clothes:['closet'], cleaning:['vacuum_cleaner','robot_vacuum','cleaning_closet'], dog_eat:['dog_bowl'], dog_drink:['dog_bowl'], dog_sleep:['dog_bed'], dog_soccer:['soccer_field'], dog_wash:['dog_bath'], dog_kennel:['kennel']
};
const activityLayout = {
  cook:{w:78,h:78,y:-8}, eat:{w:74,h:74,y:-4}, coffee:{w:70,h:70,y:-6}, shower:{w:74,h:84,y:0}, bath:{w:104,h:68,y:0}, toilet:{w:72,h:76,y:-2}, sleep:{w:112,h:78,y:0}, sit:{w:76,h:72,y:-3}, tv:{w:76,h:72,y:-3}, cuddle:{w:80,h:74,y:-3}, desk_work:{w:78,h:76,y:-6}, read:{w:78,h:76,y:-4}, arcade:{w:82,h:82,y:-7}, pool:{w:92,h:78,y:-3}, basketball:{w:76,h:82,y:-8}, treadmill:{w:76,h:86,y:-2}, weights:{w:104,h:68,y:0}, heavy_bag:{w:84,h:84,y:-5}, swim:{w:105,h:70,y:0}, soccer:{w:80,h:82,y:-6}, wash_dog:{w:90,h:78,y:-2}, pet_dog:{w:88,h:76,y:-2}, vehicle:{w:74,h:70,y:0}, phone:{w:70,h:76,y:-5}, change_clothes:{w:76,h:82,y:-8}, cleaning:{w:82,h:82,y:-4}, dance:{w:80,h:84,y:-7}, dog_eat:{w:74,h:70,y:0}, dog_drink:{w:74,h:70,y:0}, dog_sleep:{w:86,h:62,y:0}, dog_soccer:{w:78,h:72,y:-2}, dog_wash:{w:82,h:72,y:0}, dog_pet:{w:78,h:70,y:0}, dog_kennel:{w:86,h:62,y:0}
};

export function preloadReferenceCompletion(scene) {
  for (const activity of REFERENCE_HUMAN_ACTIVITIES) for (const actor of ACTOR_KEYS) scene.load.spritesheet(`pm2-activity-${actor}-${activity}`, `${ROOT}/activities/${activity}/${actor}.png`, { frameWidth:128, frameHeight:128 });
  for (const activity of REFERENCE_DOG_ACTIVITIES) scene.load.spritesheet(`pm2-activity-dog-${activity}`, `${ROOT}/activities/${activity}/dog.png`, { frameWidth:128, frameHeight:128 });
  for (const state of REFERENCE_OBJECT_STATES) scene.load.image(`pm2-state-${state}`, `${ROOT}/states/${state}.png`);
}

export function createReferenceCompletion(scene) {
  if (scene.referenceCompletion) return scene.referenceCompletion;
  const architecture = scene.add.graphics().setDepth(-820);
  const lighting = scene.add.graphics().setDepth(8500).setBlendMode('ADD');
  const effects = scene.add.graphics().setDepth(8600);
  const foreground = scene.add.graphics().setDepth(7800);
  scene.roomLayer?.add?.(architecture);
  scene.effectLayer?.add?.(lighting);
  scene.effectLayer?.add?.(effects);
  scene.effectLayer?.add?.(foreground);
  const activitySprites = new Map();
  for (const entity of scene.state?.entities || []) {
    const actor = actorKey(entity);
    const initial = actor === 'dog' ? 'dog_sleep' : 'sit';
    const sprite = scene.add.sprite(entity.x, entity.y, `pm2-activity-${actor}-${initial}`, 0).setVisible(false).setOrigin(.5,.72);
    sprite.pm2ReferenceActivity = true;
    sprite.pm2EntityId = entity.id;
    scene.actorLayer?.add?.(sprite);
    activitySprites.set(entity.id,{sprite,actor,current:null,startedAt:0,exit:null,exitUntil:0});
  }
  scene.referenceCompletion={architecture,lighting,effects,foreground,activitySprites,lastFloor:null};
  drawArchitecture(scene,true);
  return scene.referenceCompletion;
}

export function syncReferenceCompletion(scene) {
  const system=scene.referenceCompletion || createReferenceCompletion(scene);
  if (!system || !scene.state) return;
  drawArchitecture(scene,false);
  const now=scene.time?.now || performance.now();
  const activeByObject=new Map();
  for (const entity of scene.state.entities || []) {
    let record=system.activitySprites.get(entity.id);
    if (!record) continue;
    const next=activityKey(entity);
    if (next!==record.current) {
      if (record.current) { record.exit=record.current; record.exitUntil=now+REFERENCE_ACTIVITY_FRAME_MS*2; }
      record.current=next;
      record.startedAt=now;
    }
    const showing=record.current || (record.exit && now<record.exitUntil ? record.exit : null);
    if (!showing || entity.hidden || entity.floor!==scene.state.floor) {
      record.sprite.setVisible(false);
      setLegacyActorVisible(scene,entity,true);
      continue;
    }
    const object=findActivityObject(entity,showing);
    if (object) activeByObject.set(object.id,showing);
    const actor=record.actor;
    const texture=`pm2-activity-${actor}-${showing}`;
    if (record.sprite.texture?.key!==texture) record.sprite.setTexture(texture);
    const frame=activityFrame(record,now);
    record.sprite.setFrame(frame);
    placeActivitySprite(record.sprite,entity,object,showing);
    record.sprite.setVisible(true);
    setLegacyActorVisible(scene,entity,false);
  }
  syncObjectStates(scene,activeByObject);
  drawLightingAndEffects(scene,activeByObject,now);
}

export function destroyReferenceCompletion(scene) {
  const system=scene.referenceCompletion;
  if (!system) return;
  for (const record of system.activitySprites.values()) record.sprite?.destroy?.();
  system.architecture?.destroy?.(); system.lighting?.destroy?.(); system.effects?.destroy?.(); system.foreground?.destroy?.();
  scene.referenceCompletion=null;
}

export function activityKey(entity) {
  const text=`${entity.currentActionId||''} ${entity.actionId||''} ${entity.action||''} ${entity.pose||''}`.toLowerCase();
  const dog=actorKey(entity)==='dog';
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

function actorKey(entity) {
  const text=`${entity.id||''} ${entity.name||''} ${entity.kind||''} ${entity.type||''}`.toLowerCase();
  if (text.includes('dog')) return 'dog';
  if (text.includes('girlfriend')||text.includes('partner')) return 'girlfriend';
  if (text.includes('lab')||text.includes('subject')) return 'lab_subject';
  return 'resident';
}
function activityFrame(record,now) {
  if (!record.current) return Math.min(7,6+Math.floor((record.exitUntil-now)/REFERENCE_ACTIVITY_FRAME_MS));
  const elapsed=Math.max(0,now-record.startedAt);
  if (elapsed<REFERENCE_ACTIVITY_FRAME_MS*2) return Math.min(1,Math.floor(elapsed/REFERENCE_ACTIVITY_FRAME_MS));
  return 2+(Math.floor((elapsed-REFERENCE_ACTIVITY_FRAME_MS*2)/REFERENCE_ACTIVITY_FRAME_MS)%4);
}
function findActivityObject(entity,activity) {
  const kinds=activityObjectKinds[activity]||[];
  const explicitIds=[entity.showerObjectId,entity.toiletObjectId,entity.bedObjectId,entity.targetObjectId,entity.objectId,entity.pending?.objectId,entity.target?.id].filter(Boolean);
  for (const id of explicitIds) { const found=objects.find(o=>o.id===id); if (found) return found; }
  let best=null,bestD=Infinity;
  for (const object of objects) if (object.floor===entity.floor && kinds.includes(object.kind)) {
    const dx=entity.x-(object.x+object.w/2),dy=entity.y-(object.y+object.h/2),d=dx*dx+dy*dy;
    if (d<bestD) { best=object;bestD=d; }
  }
  return best;
}
function placeActivitySprite(sprite,entity,object,activity) {
  const layout=activityLayout[activity]||{w:76,h:78,y:-4};
  let x=entity.x,y=entity.y+layout.y,depth=entity.y+60,rotation=0;
  if (object) {
    const cx=object.x+object.w/2,cy=object.y+object.h/2;
    if (['sleep','bath','shower','toilet','weights','treadmill','swim','vehicle','dog_wash','dog_kennel'].includes(activity)) { x=cx;y=cy+layout.y;depth=object.y+object.h+12; }
    else if (activity==='desk_work'||activity==='arcade'||activity==='cook'||activity==='coffee'||activity==='cleaning') { x=entity.x;y=entity.y+layout.y;depth=Math.max(entity.y+55,object.y+object.h+8); }
    const facing=object.facing||object.headboard;
    if (facing==='east') rotation=Math.PI/2; else if (facing==='west') rotation=-Math.PI/2; else if (facing==='up'||facing==='north') rotation=Math.PI; else rotation=0;
  }
  sprite.setPosition(x,y).setDisplaySize(layout.w,layout.h).setDepth(depth).setRotation(rotation);
}
function setLegacyActorVisible(scene,entity,visible) {
  const containers=[scene.characterVisuals,scene.nativeCharacterVisuals,scene.entityVisuals];
  for (const collection of containers) {
    const item=collection?.get?.(entity.id)||collection?.[entity.id];
    setTreeVisible(item,visible);
  }
  for (const child of scene.actorLayer?.list||[]) {
    if (child.pm2ReferenceActivity) continue;
    const id=child.pm2EntityId||child.entityId||child.actorId||child.pm2Entity?.id||child.entity?.id;
    if (id===entity.id) child.setVisible?.(visible);
  }
  entity.pm2ReferenceActivityActive=!visible;
}
function setTreeVisible(item,visible) {
  if (!item) return;
  if (Array.isArray(item)) { for (const child of item) setTreeVisible(child,visible); return; }
  item.setVisible?.(visible);
  for (const child of item.list||[]) setTreeVisible(child,visible);
  for (const value of Object.values(item)) if (value && typeof value==='object' && value!==item && (value.setVisible||Array.isArray(value))) setTreeVisible(value,visible);
}
function activeEntityForObject(state,object) {
  return (state.entities||[]).find(entity=>entity.floor===object.floor && activityObjectKinds[activityKey(entity)]?.includes(object.kind));
}
function stateKeyForObject(state,object,activeByObject) {
  const activity=activeByObject.get(object.id)||activityKey(activeEntityForObject(state,object)||{});
  if (object.kind==='fridge' && ['eat','cook'].includes(activity)) return 'fridge_open';
  if (object.kind==='stove' && activity==='cook') return 'stove_cooking';
  if (object.kind==='sink' && ['cleaning','shower','toilet'].includes(activity)) return 'sink_running';
  if (object.kind==='coffee_maker' && activity==='coffee') return 'coffee_brewing';
  if (object.kind==='shower' && activity==='shower') return 'shower_active';
  if (object.kind==='bathtub' && activity==='bath') return 'bathtub_active';
  if (object.kind==='toilet' && activity==='toilet') return 'toilet_occupied';
  if (object.kind==='bed' && activity==='sleep') return 'bed_sleeping';
  if (object.kind==='bed' && (state.objectState?.bedMade?.[object.id]||state.objectState?.bedMade===true)) return 'bed_made';
  if (object.kind==='tv' && state.tv?.on) return 'tv_on';
  if (object.kind==='desk' && activity==='desk_work') return 'desk_active';
  if ((object.kind==='arcade'||object.kind==='arcade_machine') && activity==='arcade') return 'arcade_active';
  if (object.kind==='pool_table' && activity==='pool') return 'pool_table_active';
  if (object.kind==='treadmill' && activity==='treadmill') return 'treadmill_active';
  if (object.kind==='weight_bench' && activity==='weights') return 'weight_bench_active';
  if (object.kind==='heavy_bag' && activity==='heavy_bag') return 'heavy_bag_active';
  if (object.kind==='door' && (state.objectState?.doors?.[object.id]||state.objectState?.doorOpen?.[object.id])) return 'door_open';
  if ((object.kind==='stairs'&&object.styleAs==='door') && state.objectState?.doors?.[object.id]) return 'door_open';
  if (object.kind==='garage_door' && state.objectState?.garageDoorOpen) return 'garage_door_open';
  if (object.kind==='car' && (state.vehicleState?.[object.id]?.doorOpen||state.objectState?.vehicleDoors?.[object.id])) return 'car_open';
  if (object.kind==='dog_bowl' && ['dog_eat','dog_drink'].includes(activity)) return 'dog_bowl_active';
  if (object.kind==='swim_pool' && activity==='swim') return 'swim_pool_active';
  if (object.kind==='soccer_field' && ['soccer','dog_soccer'].includes(activity)) return 'soccer_field_active';
  if (object.kind==='closet' && activity==='change_clothes') return 'closet_open';
  return null;
}
function syncObjectStates(scene,activeByObject) {
  for (const sprite of scene.nativeObjects||[]) {
    const object=sprite.pm2Object;
    if (!object) continue;
    const stateKey=stateKeyForObject(scene.state,object,activeByObject);
    const texture=stateKey?`pm2-state-${stateKey}`:textureForObject(object);
    if (scene.textures.exists(texture) && sprite.texture?.key!==texture) sprite.setTexture(texture);
    sprite.setDisplaySize(Math.max(18,object.w),Math.max(18,object.h));
  }
}
function drawArchitecture(scene,force) {
  const system=scene.referenceCompletion;
  if (!system) return;
  const floor=scene.state.floor;
  if (!force && system.lastFloor===floor) return;
  system.lastFloor=floor;
  const g=system.architecture,fg=system.foreground;
  g.clear();fg.clear();
  const rooms=floors.find(f=>f.id===floor)?.rooms||floors[floor]?.rooms||[];
  for (const room of rooms) {
    g.lineStyle(10,0x101820,.95);g.strokeRoundedRect(room.x,room.y,room.w,room.h,8);
    g.lineStyle(3,0x8aa6b7,.24);g.strokeRoundedRect(room.x+5,room.y+5,room.w-10,room.h-10,6);
    g.lineStyle(5,0xc8a36c,.22);g.lineBetween(room.x+12,room.y+12,room.x+room.w-12,room.y+12);
    fg.lineStyle(9,0x0c131a,.9);fg.lineBetween(room.x+8,room.y+room.h-3,room.x+room.w-8,room.y+room.h-3);
    const windowColor=room.id.includes('bath')?0x8ee7ee:0x72b9d1;
    g.lineStyle(6,windowColor,.55);
    if (room.w>240) g.lineBetween(room.x+room.w*.34,room.y+5,room.x+room.w*.66,room.y+5);
  }
  if (floor===0) {
    g.fillStyle(0x4e3c31,.7);g.fillRoundedRect(472,48,286,21,7);
    g.lineStyle(4,0xc59b69,.35);g.lineBetween(480,58,750,58);
    g.lineStyle(7,0x15212b,.95);g.lineBetween(784,166,932,166);
  }
  if (floor===1) { g.lineStyle(7,0x192630,.9);g.strokeRoundedRect(30,530,416,146,10); }
  if (floor===3) { g.lineStyle(5,0xf1c66a,.25);for(let x=90;x<900;x+=90)g.lineBetween(x,45,x,675); }
}
function drawLightingAndEffects(scene,activeByObject,now) {
  const system=scene.referenceCompletion,l=system.lighting,e=system.effects;
  l.clear();e.clear();
  const floor=scene.state.floor;
  for (const light of objects.filter(o=>o.floor===floor&&o.kind==='light')) {
    const enabled=scene.state.roomLights?.[light.room]!==false;
    if (!enabled) continue;
    for (let r=130,a=.018;r>25;r-=22,a+=.012) { l.fillStyle(0xf1d49a,a);l.fillCircle(light.x+light.w/2,light.y+light.h/2,r); }
  }
  for (const object of objects.filter(o=>o.floor===floor)) {
    const activity=activeByObject.get(object.id);
    if (object.kind==='tv'&&scene.state.tv?.on) { l.fillStyle(0x57cce5,.12);l.fillTriangle(object.x,object.y+object.h,object.x+object.w,object.y+object.h,object.x+object.w/2,object.y+object.h+180); }
    if (activity==='shower'||activity==='bath'||activity==='wash_dog'||activity==='dog_wash') {
      const cx=object.x+object.w/2,cy=object.y+object.h/2;
      e.lineStyle(3,0xd8f7fb,.45);
      for(let i=0;i<4;i++){const drift=Math.sin(now/450+i)*8;e.beginPath();e.moveTo(cx-20+i*13,cy+18);e.quadraticBezierTo(cx-30+i*13+drift,cy-8,cx-16+i*13,cy-35);e.strokePath();}
    }
    if (object.kind==='swim_pool') { e.lineStyle(2,0xcdf8ff,.32);for(let y=object.y+28;y<object.y+object.h;y+=28){const w=Math.sin(now/350+y)*7;e.lineBetween(object.x+18+w,y,object.x+object.w-18+w,y);} }
  }
  l.fillStyle(0x06101a,.08);l.fillRect(0,0,960,720);
}
