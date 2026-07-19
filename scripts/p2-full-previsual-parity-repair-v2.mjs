import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const write=(file,content)=>{const target=path.join(ROOT,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,String(content).trimEnd()+'\n');};
const replaceOnce=(source,from,to,label)=>{if(source.includes(to))return source;const count=source.split(from).length-1;if(count!==1)throw new Error(`${label}: expected one match, found ${count}`);return source.replace(from,to);};

const characterSource=read('src/phaserCharacterAnimationSystem.js');
if(!characterSource.includes('export function setBaseActorVisualVisible'))throw new Error('Expected concurrent exact actor visibility fix is missing.');
if(!characterSource.includes('child.pm2EntityId = entity.id'))throw new Error('Expected actor entity tags are missing.');

let completion=read('src/phaserMigration2ReferenceCompletion.js');
completion=replaceOnce(completion,
`import { floors, objects } from './world.js';
import { textureForObject } from './phaserMigration2VisualCatalog.js';`,
`import { floors, objects } from './world.js';
import { setBaseActorVisualVisible } from './phaserCharacterAnimationSystem.js';
import { textureForObject } from './phaserMigration2VisualCatalog.js';`,'completion import');
completion=replaceOnce(completion,
`export function preloadReferenceCompletion(scene) {
  for (const activity of REFERENCE_HUMAN_ACTIVITIES) for (const actor of ACTOR_KEYS) scene.load.spritesheet(\`pm2-activity-\${actor}-\${activity}\`, \`\${ROOT}/activities/\${activity}/\${actor}.png\`, { frameWidth:128, frameHeight:128 });
  for (const activity of REFERENCE_DOG_ACTIVITIES) scene.load.spritesheet(\`pm2-activity-dog-\${activity}\`, \`\${ROOT}/activities/\${activity}/dog.png\`, { frameWidth:128, frameHeight:128 });
  for (const state of REFERENCE_OBJECT_STATES) scene.load.image(\`pm2-state-\${state}\`, \`\${ROOT}/states/\${state}.png\`);
}`,
`export function preloadReferenceCompletion(scene) {
  scene.pm2OptionalVisualKeys ??= new Set();
  for (const activity of REFERENCE_HUMAN_ACTIVITIES) for (const actor of ACTOR_KEYS) {
    const key=\`pm2-activity-\${actor}-\${activity}\`;
    scene.pm2OptionalVisualKeys.add(key);
    scene.load.spritesheet(key,\`\${ROOT}/activities/\${activity}/\${actor}.png\`,{frameWidth:128,frameHeight:128});
  }
  for (const activity of REFERENCE_DOG_ACTIVITIES) {
    const key=\`pm2-activity-dog-\${activity}\`;
    scene.pm2OptionalVisualKeys.add(key);
    scene.load.spritesheet(key,\`\${ROOT}/activities/\${activity}/dog.png\`,{frameWidth:128,frameHeight:128});
  }
  for (const state of REFERENCE_OBJECT_STATES) {
    const key=\`pm2-state-\${state}\`;
    scene.pm2OptionalVisualKeys.add(key);
    scene.load.image(key,\`\${ROOT}/states/\${state}.png\`);
  }
}`,'optional preload');
completion=replaceOnce(completion,
`  const architecture = scene.add.graphics().setDepth(-820);
  const lighting = scene.add.graphics().setDepth(8500).setBlendMode('ADD');
  const effects = scene.add.graphics().setDepth(8600);
  const foreground = scene.add.graphics().setDepth(7800);
  scene.roomLayer?.add?.(architecture);
  scene.effectLayer?.add?.(lighting);
  scene.effectLayer?.add?.(effects);
  scene.effectLayer?.add?.(foreground);`,
`  const underlay=scene.add.graphics().setDepth(-5);
  const architecture=scene.add.graphics().setDepth(5);
  const foreground=scene.add.graphics().setDepth(88);
  const lighting=scene.add.graphics().setDepth(95).setBlendMode('ADD');
  const effects=scene.add.graphics().setDepth(96);`,'persistent graphics');
completion=replaceOnce(completion,
`    const sprite = scene.add.sprite(entity.x, entity.y, \`pm2-activity-\${actor}-\${initial}\`, 0).setVisible(false).setOrigin(.5,.72);`,
`    const initialTexture=\`pm2-activity-\${actor}-\${initial}\`;
    const sprite=scene.add.sprite(entity.x,entity.y,scene.textures.exists(initialTexture)?initialTexture:'__WHITE',0).setVisible(false).setOrigin(.5,.72);`,'safe initial activity');
completion=replaceOnce(completion,
`  scene.referenceCompletion={architecture,lighting,effects,foreground,activitySprites,lastFloor:null};`,
`  scene.referenceCompletion={underlay,architecture,lighting,effects,foreground,activitySprites,lastFloor:null};`,'completion record');
completion=replaceOnce(completion,
`    const actor=record.actor;
    const texture=\`pm2-activity-\${actor}-\${showing}\`;
    if (record.sprite.texture?.key!==texture) record.sprite.setTexture(texture);`,
`    const actor=record.actor;
    const texture=\`pm2-activity-\${actor}-\${showing}\`;
    if(!scene.textures.exists(texture)){record.sprite.setVisible(false);setLegacyActorVisible(scene,entity,true);continue;}
    if(record.sprite.texture?.key!==texture)record.sprite.setTexture(texture);`,'activity fallback');
completion=replaceOnce(completion,
`  system.architecture?.destroy?.(); system.lighting?.destroy?.(); system.effects?.destroy?.(); system.foreground?.destroy?.();`,
`  system.underlay?.destroy?.(); system.architecture?.destroy?.(); system.lighting?.destroy?.(); system.effects?.destroy?.(); system.foreground?.destroy?.();`,'destroy underlay');
completion=replaceOnce(completion,
`  const explicitIds=[entity.showerObjectId,entity.toiletObjectId,entity.bedObjectId,entity.targetObjectId,entity.objectId,entity.pending?.objectId,entity.target?.id].filter(Boolean);`,
`  const explicitIds=[entity.sleepObjectId,entity.showerObjectId,entity.toiletObjectId,entity.bedObjectId,entity.activityObjectId,entity.targetObjectId,entity.objectId,entity.pending?.objectId,entity.pending?.targetObjectId,entity.pending?.id,entity.target?.objectId,entity.target?.id].filter(Boolean);`,'explicit object ids');
const legacyStart=completion.indexOf('function setLegacyActorVisible(scene,entity,visible) {');
const legacyEnd=completion.indexOf('function activeEntityForObject(state,object) {');
if(legacyStart<0||legacyEnd<=legacyStart)throw new Error('Legacy visibility block missing.');
completion=completion.slice(0,legacyStart)+`function setLegacyActorVisible(scene,entity,visible) {
  const exact=setBaseActorVisualVisible(scene,entity.id,visible);
  if(!exact)for(const child of scene.actorLayer?.list||[]){if(!child.pm2ReferenceActivity&&child.pm2EntityId===entity.id)child.setVisible?.(visible);}
  entity.pm2ReferenceActivityActive=!visible;
}
`+completion.slice(legacyEnd);
completion=replaceOnce(completion,
`function activeEntityForObject(state,object) {
  return (state.entities||[]).find(entity=>entity.floor===object.floor && activityObjectKinds[activityKey(entity)]?.includes(object.kind));
}
function stateKeyForObject(state,object,activeByObject) {
  const activity=activeByObject.get(object.id)||activityKey(activeEntityForObject(state,object)||{});`,
`function activeEntityForObject(state,object) {
  return (state.entities||[]).find(entity=>{if(entity.floor!==object.floor)return false;const activity=activityKey(entity);return Boolean(activity)&&findActivityObject(entity,activity)?.id===object.id;});
}
function stateKeyForObject(state,object,activeByObject) {
  const exactEntity=activeEntityForObject(state,object);
  const activity=activeByObject.get(object.id)||activityKey(exactEntity||{});`,'exact active object');
completion=replaceOnce(completion,
`    const texture=stateKey?\`pm2-state-\${stateKey}\`:textureForObject(object);
    if (scene.textures.exists(texture) && sprite.texture?.key!==texture) sprite.setTexture(texture);`,
`    const requestedTexture=stateKey?\`pm2-state-\${stateKey}\`:textureForObject(object);
    const texture=scene.textures.exists(requestedTexture)?requestedTexture:textureForObject(object);
    if(scene.textures.exists(texture)&&sprite.texture?.key!==texture)sprite.setTexture(texture);`,'state fallback');
const architectureStart=completion.indexOf('function drawArchitecture(scene,force) {');
const lightingStart=completion.indexOf('function drawLightingAndEffects(scene,activeByObject,now) {');
if(architectureStart<0||lightingStart<=architectureStart)throw new Error('Architecture block missing.');
const architecture=`function drawArchitecture(scene,force) {
  const system=scene.referenceCompletion;if(!system)return;const floor=scene.state.floor;if(!force&&system.lastFloor===floor)return;system.lastFloor=floor;
  const u=system.underlay,g=system.architecture,fg=system.foreground;u.clear();g.clear();fg.clear();
  const rooms=floors.find(f=>f.id===floor)?.rooms||floors[floor]?.rooms||[];u.fillStyle(0x111922,.98);for(const room of rooms)u.fillRect(room.x-7,room.y-7,room.w+14,room.h+14);
  for(const room of rooms){g.lineStyle(4,0x17232d,.98);g.strokeRect(room.x,room.y,room.w,room.h);g.lineStyle(1.5,0x91a9b7,.2);g.strokeRect(room.x+3,room.y+3,room.w-6,room.h-6);
    const top=!hasNeighbor(rooms,room,'top'),bottom=!hasNeighbor(rooms,room,'bottom'),left=!hasNeighbor(rooms,room,'left'),right=!hasNeighbor(rooms,room,'right');g.lineStyle(6,0x0b141c,.98);
    if(top)g.lineBetween(room.x,room.y,room.x+room.w,room.y);if(bottom){g.lineBetween(room.x,room.y+room.h,room.x+room.w,room.y+room.h);fg.lineStyle(6,0x071018,.72);fg.lineBetween(room.x+5,room.y+room.h-1,room.x+room.w-5,room.y+room.h-1);}if(left)g.lineBetween(room.x,room.y,room.x,room.y+room.h);if(right)g.lineBetween(room.x+room.w,room.y,room.x+room.w,room.y+room.h);
    if(top&&room.w>240&&!room.id.includes('garage')){const color=room.id.includes('bath')?0x8ee7ee:0x72b9d1;g.lineStyle(5,color,.5);g.lineBetween(room.x+room.w*.36,room.y+2,room.x+room.w*.64,room.y+2);}}
}
function hasNeighbor(rooms,room,side){const t=18;return rooms.some(other=>{if(other===room)return false;const ox=Math.min(room.x+room.w,other.x+other.w)-Math.max(room.x,other.x)>12;const oy=Math.min(room.y+room.h,other.y+other.h)-Math.max(room.y,other.y)>12;if(side==='top')return ox&&Math.abs(other.y+other.h-room.y)<=t;if(side==='bottom')return ox&&Math.abs(room.y+room.h-other.y)<=t;if(side==='left')return oy&&Math.abs(other.x+other.w-room.x)<=t;return oy&&Math.abs(room.x+room.w-other.x)<=t;});}
`;
completion=completion.slice(0,architectureStart)+architecture+completion.slice(lightingStart);
write('src/phaserMigration2ReferenceCompletion.js',completion);

let runtime=read('src/phaserMigration2Runtime.js');
runtime=replaceOnce(runtime,`      this.assetFailures = [];
      this.nativeGameplayVisuals = null;`,`      this.assetFailures = [];
      this.optionalVisualFailures = [];
      this.runtimeFailed = false;
      this.nativeGameplayVisuals = null;`,'runtime fields');
runtime=replaceOnce(runtime,`      this.load.on('loaderror', file => {
        this.assetFailures.push(file?.key || file?.src || 'unknown asset');
        console.error('[Apartment God] Phaser Migration 2 asset failed:', file?.key, file?.src);
      });`,`      this.load.on('loaderror', file => {
        const key=file?.key||file?.src||'unknown asset';
        if(this.pm2OptionalVisualKeys?.has?.(file?.key)||String(file?.key||'').startsWith('pm2-activity-')||String(file?.key||'').startsWith('pm2-state-')){this.optionalVisualFailures.push(key);console.warn('[Apartment God] Optional P2 visual failed and will use a fallback:',file?.key,file?.src);return;}
        this.assetFailures.push(key);console.error('[Apartment God] Required Phaser Migration 2 asset failed:',file?.key,file?.src);
      });`,'load failure split');
runtime=replaceOnce(runtime,`        this.state.runtimeRenderer = 'phaser-migration-2-native-full-gameplay';`,`        this.state.runtimeRenderer = 'phaser-migration-2-native-full-gameplay';
        this.state.optionalVisualFailures = [...this.optionalVisualFailures];`,'failure state');
runtime=replaceOnce(runtime,`    update(_time, deltaMs) {
      if (!this.state) return;`,`    update(_time, deltaMs) {
      if (!this.state || this.runtimeFailed) return;`,'update guard');
runtime=replaceOnce(runtime,`    hiddenTick() {
      if (!this.state || !document.hidden || this.state.paused) return;`,`    hiddenTick() {
      if (!this.state || this.runtimeFailed || !document.hidden || this.state.paused) return;`,'hidden guard');
runtime=replaceOnce(runtime,`    renderNativeFrame() {
      const signature = floorSignature(this.state.floor);`,`    renderNativeFrame() {
      if (this.runtimeFailed) return;
      const signature = floorSignature(this.state.floor);`,'render guard');
runtime=replaceOnce(runtime,`    recoverFrame(error, boot = false) {
      this.frameErrorCount += 1;`,`    recoverFrame(error, boot = false) {
      if(this.runtimeFailed)return;
      this.runtimeFailed=true;
      this.frameErrorCount += 1;`,'recovery guard');
runtime=replaceOnce(runtime,`        this.state.saveStatus = { message: 'Phaser Migration 2 runtime error handled' };
        this.state.paused = this.frameErrorCount > 2;`,`        this.state.saveStatus = { message: 'Phaser Migration 2 runtime stopped safely after an error' };
        this.state.paused = true;`,'stable recovery');
write('src/phaserMigration2Runtime.js',runtime);

const manifestPath='assets/manifests/phaser-migration-2-reference-visual-completion.json';
const manifest=JSON.parse(read(manifestPath));
Object.assign(manifest,{status:'procedural_temporary_fallback_needs_authored_replacement',preVisualParityBaseline:'c8941bbe16e5725ad02eb20596ee5a07868303b8',authoredArtApproval:false,generatedActivityPngsAreFinal:false,generatedObjectStatePngsAreFinal:false});
manifest.notes=['Gameplay and object parity are audited separately from final art approval.','Generated activity and state PNGs remain safe temporary fallbacks only.','Final character, room, vehicle, architecture and activity art still requires authored top-down approval.'];
write(manifestPath,JSON.stringify(manifest,null,2));

write('tests/phaser-migration-2-previsual-parity-repair.test.js',`import { readFileSync } from 'node:fs';
import { describe,expect,it } from 'vitest';
import { objects } from '../src/world.js';
import { setBaseActorVisualVisible } from '../src/phaserCharacterAnimationSystem.js';
import { PM2_OBJECT_TEXTURES,textureForObject } from '../src/phaserMigration2VisualCatalog.js';
const runtime=readFileSync(new URL('../src/phaserMigration2Runtime.js',import.meta.url),'utf8');const completion=readFileSync(new URL('../src/phaserMigration2ReferenceCompletion.js',import.meta.url),'utf8');const manifest=JSON.parse(readFileSync(new URL('../assets/manifests/phaser-migration-2-reference-visual-completion.json',import.meta.url),'utf8'));
describe('P2 full previsual parity repair',()=>{
 it('hides the exact base actor record during activity replacement',()=>{const calls=[];const child={setVisible:v=>calls.push(v)};const record={shadow:child,ring:child,sprite:child,cue:child,label:child};const scene={pm2ActorVisuals:new Map([['resident',record]])};expect(setBaseActorVisualVisible(scene,'resident',false)).toBe(true);expect(calls).toEqual([false,false,false,false,false]);expect(completion).toContain('setBaseActorVisualVisible(scene,entity.id,visible)');});
 it('binds repeated object states to exact action object ids',()=>{expect(completion).toContain('entity.sleepObjectId');expect(completion).toContain('entity.activityObjectId');expect(completion).toContain("findActivityObject(entity,activity)?.id===object.id");});
 it('uses optional per-asset fallback without stopping boot',()=>{expect(runtime).toContain('this.optionalVisualFailures = []');expect(runtime).toContain("startsWith('pm2-activity-')");expect(runtime).toContain("startsWith('pm2-state-')");});
 it('enters one terminal recovery state',()=>{expect(runtime).toContain('if (!this.state || this.runtimeFailed) return');expect(runtime).toContain('this.runtimeFailed=true');expect(runtime).toContain('this.state.paused = true');});
 it('keeps completion graphics outside floor-cleared containers',()=>{expect(completion).toContain('const underlay=scene.add.graphics().setDepth(-5)');expect(completion).not.toContain('scene.roomLayer?.add?.(architecture)');});
 it('covers every baseline object kind with a non-generic texture',()=>{for(const object of objects){expect(PM2_OBJECT_TEXTURES[object.kind],object.id).toBeTruthy();expect(textureForObject(object),object.id).not.toBe('pm2-object-generic');}});
 it('marks generated art honestly as temporary',()=>{expect(manifest.status).toBe('procedural_temporary_fallback_needs_authored_replacement');expect(manifest.authoredArtApproval).toBe(false);});
});
`);

write('apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-19_P2_FULL_PREVISUAL_PARITY_REPAIR.md',`## 2026-07-19, P2 Full Previsual Parity Repair

Status: NEEDS_BROWSER_TESTING
Branch: phaser-migration-2
Baseline: c8941bbe16e5725ad02eb20596ee5a07868303b8
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-2-before-full-previsual-parity-repair-2026-07-19

Summary:
Audited the current native P2 branch against the last verified pre-visual build and repaired concrete translation failures while preserving the improved assets and native Phaser ownership.

Implementation details:
- Preserved baseline floors, rooms, objects, actors, actions, movement, autonomy, economy, calendar, careers, saves, phone, camera, gates, vehicles, pool, basketball, tidiness and offsite systems.
- Connected the activity layer to the exact base actor record, preventing duplicate bodies.
- Bound sleep and repeated-object states to exact recorded object IDs.
- Made optional activity and object-state art use per-asset fallback instead of blocking boot.
- Added a stable terminal recovery state.
- Moved architecture and effects outside containers cleared during floor rebuild.
- Replaced detached rounded room boxes with connected boundaries based on unchanged baseline room coordinates.
- Marked generated activity and state PNGs as temporary procedural fallbacks rather than final authored art.
- Generated a machine-readable parity report from a detached worktree at the baseline commit.

Testing performed:
Exact baseline floor, room and object comparison, core gameplay source preservation checks, runtime call coverage, object texture coverage, repository checks, unit tests and static build.

Testing requested:
Test every floor, route, object menu, phone tab, utility control, movement mode, autonomy mode, save/load path, vehicle, arcade, pool, basketball, sleep, shower, meal, dog and offsite activity. Separate behavioral parity defects from final art-quality corrections.

Known risks:
This verifies gameplay translation. It does not claim the current procedural SVG and generated PNG fallback art has reached Kam's final authored sprite standard.
`);
write('apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-19_P2_FULL_PREVISUAL_PARITY_REPAIR.md',`# Development Matrix Patch, P2 Full Previsual Parity Repair

Date: 2026-07-19
Branch: phaser-migration-2
Baseline: c8941bbe16e5725ad02eb20596ee5a07868303b8
Status: NEEDS_BROWSER_TESTING
Backup: backup/phaser-migration-2-before-full-previsual-parity-repair-2026-07-19

| System | Status | Audit or repair result | Required test |
|---|---|---|---|
| Baseline floors, rooms and objects | VERIFIED_BY_DATA_DIFF | Exact normalized baseline data is compared. | Browse every floor. |
| Gameplay source preservation | VERIFIED_BY_SOURCE_DIFF | Core baseline systems remain present. | End-to-end play session. |
| Actor activity replacement | FIXED, NEEDS_BROWSER_TEST | Exact base actor record is suppressed. | Confirm one body per actor. |
| Exact object-state binding | FIXED, NEEDS_BROWSER_TEST | Explicit action object IDs are used. | Test repeated sinks, showers, toilets, beds and couches. |
| Optional asset fallback | FIXED_BY_CODE | Missing optional visuals do not block boot. | Force one optional failure. |
| Runtime recovery | FIXED_BY_CODE | One stable terminal recovery state. | Force one controlled error. |
| Architecture persistence | FIXED, NEEDS_VISUAL_TEST | Graphics survive floor rebuilds. | Change floors repeatedly. |
| Generated visual art | TEMPORARY | Procedural fallback, not final authored art. | Continue approved asset replacement. |
| Native Phaser ownership | PRESERVED | No legacy Canvas frame bridge added. | Confirm native boot. |
`);
