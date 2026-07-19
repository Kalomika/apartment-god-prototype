import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const write = (file, content) => {
  const target = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, String(content).trimEnd() + '\n');
};
const replaceOnce = (source, from, to, label) => {
  if (source.includes(to)) return source;
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one match, found ${count}`);
  return source.replace(from, to);
};

// 1. Make the exact native actor record visible or hidden during activity replacement.
let characters = read('src/phaserCharacterAnimationSystem.js');
if (!characters.includes('export function setCharacterVisualVisible')) {
  characters = replaceOnce(
    characters,
    `export function clearCharacterVisuals(scene) {
  for (const record of scene.pm2ActorVisuals?.values?.() || []) destroyRecord(record);
  scene.pm2ActorVisuals?.clear?.();
}`,
    `export function clearCharacterVisuals(scene) {
  for (const record of scene.pm2ActorVisuals?.values?.() || []) destroyRecord(record);
  scene.pm2ActorVisuals?.clear?.();
}

export function setCharacterVisualVisible(scene, entityId, visible) {
  const record = scene.pm2ActorVisuals?.get?.(entityId);
  if (!record) return false;
  for (const child of [record.shadow, record.ring, record.sprite, record.cue, record.label]) child?.setVisible?.(visible);
  return true;
}`,
    'character visibility export'
  );
}
characters = replaceOnce(
  characters,
  `  for (const child of [shadow, ring, sprite, cue, label]) layer.add(child);
  const record = { profile, shadow, ring, sprite, cue, label, lastX: point.x, lastY: point.y, direction: headingDirection(entity) };`,
  `  for (const [role, child] of Object.entries({ shadow, ring, sprite, cue, label })) {
    child.pm2EntityId = entity.id;
    child.pm2ActorRole = role;
    layer.add(child);
  }
  const record = { entityId: entity.id, profile, shadow, ring, sprite, cue, label, lastX: point.x, lastY: point.y, direction: headingDirection(entity) };`,
  'actor entity tags'
);
write('src/phaserCharacterAnimationSystem.js', characters);

// 2. Repair activity replacement, exact object binding, optional fallback, and persistent architecture.
let completion = read('src/phaserMigration2ReferenceCompletion.js');
completion = replaceOnce(
  completion,
  `import { floors, objects } from './world.js';
import { textureForObject } from './phaserMigration2VisualCatalog.js';`,
  `import { floors, objects } from './world.js';
import { setCharacterVisualVisible } from './phaserCharacterAnimationSystem.js';
import { textureForObject } from './phaserMigration2VisualCatalog.js';`,
  'completion imports'
);
completion = replaceOnce(
  completion,
  `export function preloadReferenceCompletion(scene) {
  for (const activity of REFERENCE_HUMAN_ACTIVITIES) for (const actor of ACTOR_KEYS) scene.load.spritesheet(\`pm2-activity-\${actor}-\${activity}\`, \`\${ROOT}/activities/\${activity}/\${actor}.png\`, { frameWidth:128, frameHeight:128 });
  for (const activity of REFERENCE_DOG_ACTIVITIES) scene.load.spritesheet(\`pm2-activity-dog-\${activity}\`, \`\${ROOT}/activities/\${activity}/dog.png\`, { frameWidth:128, frameHeight:128 });
  for (const state of REFERENCE_OBJECT_STATES) scene.load.image(\`pm2-state-\${state}\`, \`\${ROOT}/states/\${state}.png\`);
}`,
  `export function preloadReferenceCompletion(scene) {
  scene.pm2OptionalVisualKeys ??= new Set();
  for (const activity of REFERENCE_HUMAN_ACTIVITIES) for (const actor of ACTOR_KEYS) {
    const key = \`pm2-activity-\${actor}-\${activity}\`;
    scene.pm2OptionalVisualKeys.add(key);
    scene.load.spritesheet(key, \`\${ROOT}/activities/\${activity}/\${actor}.png\`, { frameWidth:128, frameHeight:128 });
  }
  for (const activity of REFERENCE_DOG_ACTIVITIES) {
    const key = \`pm2-activity-dog-\${activity}\`;
    scene.pm2OptionalVisualKeys.add(key);
    scene.load.spritesheet(key, \`\${ROOT}/activities/\${activity}/dog.png\`, { frameWidth:128, frameHeight:128 });
  }
  for (const state of REFERENCE_OBJECT_STATES) {
    const key = \`pm2-state-\${state}\`;
    scene.pm2OptionalVisualKeys.add(key);
    scene.load.image(key, \`\${ROOT}/states/\${state}.png\`);
  }
}`,
  'optional preload registration'
);
completion = replaceOnce(
  completion,
  `  const architecture = scene.add.graphics().setDepth(-820);
  const lighting = scene.add.graphics().setDepth(8500).setBlendMode('ADD');
  const effects = scene.add.graphics().setDepth(8600);
  const foreground = scene.add.graphics().setDepth(7800);
  scene.roomLayer?.add?.(architecture);
  scene.effectLayer?.add?.(lighting);
  scene.effectLayer?.add?.(effects);
  scene.effectLayer?.add?.(foreground);`,
  `  const underlay = scene.add.graphics().setDepth(-5);
  const architecture = scene.add.graphics().setDepth(5);
  const foreground = scene.add.graphics().setDepth(88);
  const lighting = scene.add.graphics().setDepth(95).setBlendMode('ADD');
  const effects = scene.add.graphics().setDepth(96);`,
  'persistent completion layers'
);
completion = replaceOnce(
  completion,
  `    const sprite = scene.add.sprite(entity.x, entity.y, \`pm2-activity-\${actor}-\${initial}\`, 0).setVisible(false).setOrigin(.5,.72);`,
  `    const initialTexture = \`pm2-activity-\${actor}-\${initial}\`;
    const sprite = scene.add.sprite(entity.x, entity.y, scene.textures.exists(initialTexture) ? initialTexture : '__WHITE', 0).setVisible(false).setOrigin(.5,.72);`,
  'safe initial activity texture'
);
completion = replaceOnce(
  completion,
  `  scene.referenceCompletion={architecture,lighting,effects,foreground,activitySprites,lastFloor:null};`,
  `  scene.referenceCompletion={underlay,architecture,lighting,effects,foreground,activitySprites,lastFloor:null};`,
  'completion record'
);
completion = replaceOnce(
  completion,
  `    const actor=record.actor;
    const texture=\`pm2-activity-\${actor}-\${showing}\`;
    if (record.sprite.texture?.key!==texture) record.sprite.setTexture(texture);`,
  `    const actor=record.actor;
    const texture=\`pm2-activity-\${actor}-\${showing}\`;
    if (!scene.textures.exists(texture)) {
      record.sprite.setVisible(false);
      setLegacyActorVisible(scene,entity,true);
      continue;
    }
    if (record.sprite.texture?.key!==texture) record.sprite.setTexture(texture);`,
  'activity texture fallback'
);
completion = replaceOnce(
  completion,
  `  system.architecture?.destroy?.(); system.lighting?.destroy?.(); system.effects?.destroy?.(); system.foreground?.destroy?.();`,
  `  system.underlay?.destroy?.(); system.architecture?.destroy?.(); system.lighting?.destroy?.(); system.effects?.destroy?.(); system.foreground?.destroy?.();`,
  'completion destruction'
);
completion = replaceOnce(
  completion,
  `  const explicitIds=[entity.showerObjectId,entity.toiletObjectId,entity.bedObjectId,entity.targetObjectId,entity.objectId,entity.pending?.objectId,entity.target?.id].filter(Boolean);`,
  `  const explicitIds=[entity.sleepObjectId,entity.showerObjectId,entity.toiletObjectId,entity.bedObjectId,entity.activityObjectId,entity.targetObjectId,entity.objectId,entity.pending?.objectId,entity.pending?.targetObjectId,entity.pending?.id,entity.target?.objectId,entity.target?.id].filter(Boolean);`,
  'exact activity object IDs'
);
const legacyStart = completion.indexOf('function setLegacyActorVisible(scene,entity,visible) {');
const legacyEnd = completion.indexOf('function activeEntityForObject(state,object) {');
if (legacyStart < 0 || legacyEnd < 0 || legacyEnd <= legacyStart) throw new Error('legacy actor visibility section not found');
completion = completion.slice(0, legacyStart) + `function setLegacyActorVisible(scene,entity,visible) {
  const exact = setCharacterVisualVisible(scene, entity.id, visible);
  if (!exact) {
    for (const child of scene.actorLayer?.list||[]) {
      if (child.pm2ReferenceActivity) continue;
      if (child.pm2EntityId===entity.id) child.setVisible?.(visible);
    }
  }
  entity.pm2ReferenceActivityActive=!visible;
}
` + completion.slice(legacyEnd);
completion = replaceOnce(
  completion,
  `function activeEntityForObject(state,object) {
  return (state.entities||[]).find(entity=>entity.floor===object.floor && activityObjectKinds[activityKey(entity)]?.includes(object.kind));
}
function stateKeyForObject(state,object,activeByObject) {
  const activity=activeByObject.get(object.id)||activityKey(activeEntityForObject(state,object)||{});`,
  `function activeEntityForObject(state,object) {
  return (state.entities||[]).find(entity=>{
    if (entity.floor!==object.floor) return false;
    const activity=activityKey(entity);
    if (!activity) return false;
    return findActivityObject(entity,activity)?.id===object.id;
  });
}
function stateKeyForObject(state,object,activeByObject) {
  const exactEntity=activeEntityForObject(state,object);
  const activity=activeByObject.get(object.id)||activityKey(exactEntity||{});`,
  'exact state binding'
);
completion = replaceOnce(
  completion,
  `    const texture=stateKey?\`pm2-state-\${stateKey}\`:textureForObject(object);
    if (scene.textures.exists(texture) && sprite.texture?.key!==texture) sprite.setTexture(texture);`,
  `    const requestedTexture=stateKey?\`pm2-state-\${stateKey}\`:textureForObject(object);
    const texture=scene.textures.exists(requestedTexture)?requestedTexture:textureForObject(object);
    if (scene.textures.exists(texture) && sprite.texture?.key!==texture) sprite.setTexture(texture);`,
  'state texture fallback'
);
const architectureStart = completion.indexOf('function drawArchitecture(scene,force) {');
const lightingStart = completion.indexOf('function drawLightingAndEffects(scene,activeByObject,now) {');
if (architectureStart < 0 || lightingStart < 0 || lightingStart <= architectureStart) throw new Error('architecture function section not found');
const architectureReplacement = `function drawArchitecture(scene,force) {
  const system=scene.referenceCompletion;
  if (!system) return;
  const floor=scene.state.floor;
  if (!force && system.lastFloor===floor) return;
  system.lastFloor=floor;
  const u=system.underlay,g=system.architecture,fg=system.foreground;
  u.clear();g.clear();fg.clear();
  const rooms=floors.find(f=>f.id===floor)?.rooms||floors[floor]?.rooms||[];
  u.fillStyle(0x111922,.98);
  for (const room of rooms) u.fillRect(room.x-7,room.y-7,room.w+14,room.h+14);
  for (const room of rooms) {
    g.lineStyle(4,0x17232d,.98);g.strokeRect(room.x,room.y,room.w,room.h);
    g.lineStyle(1.5,0x91a9b7,.2);g.strokeRect(room.x+3,room.y+3,room.w-6,room.h-6);
    const topOuter=!hasNeighbor(rooms,room,'top');
    const bottomOuter=!hasNeighbor(rooms,room,'bottom');
    const leftOuter=!hasNeighbor(rooms,room,'left');
    const rightOuter=!hasNeighbor(rooms,room,'right');
    g.lineStyle(6,0x0b141c,.98);
    if (topOuter) g.lineBetween(room.x,room.y,room.x+room.w,room.y);
    if (bottomOuter) { g.lineBetween(room.x,room.y+room.h,room.x+room.w,room.y+room.h); fg.lineStyle(6,0x071018,.72);fg.lineBetween(room.x+5,room.y+room.h-1,room.x+room.w-5,room.y+room.h-1); }
    if (leftOuter) g.lineBetween(room.x,room.y,room.x,room.y+room.h);
    if (rightOuter) g.lineBetween(room.x+room.w,room.y,room.x+room.w,room.y+room.h);
    if (topOuter&&room.w>240&&!room.id.includes('garage')) { const color=room.id.includes('bath')?0x8ee7ee:0x72b9d1;g.lineStyle(5,color,.5);g.lineBetween(room.x+room.w*.36,room.y+2,room.x+room.w*.64,room.y+2); }
  }
}
function hasNeighbor(rooms,room,side) {
  const tolerance=18;
  return rooms.some(other=>{
    if (other===room) return false;
    const overlapX=Math.min(room.x+room.w,other.x+other.w)-Math.max(room.x,other.x)>12;
    const overlapY=Math.min(room.y+room.h,other.y+other.h)-Math.max(room.y,other.y)>12;
    if (side==='top') return overlapX&&Math.abs(other.y+other.h-room.y)<=tolerance;
    if (side==='bottom') return overlapX&&Math.abs(room.y+room.h-other.y)<=tolerance;
    if (side==='left') return overlapY&&Math.abs(other.x+other.w-room.x)<=tolerance;
    return overlapY&&Math.abs(room.x+room.w-other.x)<=tolerance;
  });
}
`;
completion = completion.slice(0, architectureStart) + architectureReplacement + completion.slice(lightingStart);
write('src/phaserMigration2ReferenceCompletion.js', completion);

// 3. Separate optional visual failures and make recovery terminal and stable.
let runtime = read('src/phaserMigration2Runtime.js');
runtime = replaceOnce(
  runtime,
  `      this.assetFailures = [];
      this.nativeGameplayVisuals = null;`,
  `      this.assetFailures = [];
      this.optionalVisualFailures = [];
      this.runtimeFailed = false;
      this.nativeGameplayVisuals = null;`,
  'runtime fields'
);
runtime = replaceOnce(
  runtime,
  `      this.load.on('loaderror', file => {
        this.assetFailures.push(file?.key || file?.src || 'unknown asset');
        console.error('[Apartment God] Phaser Migration 2 asset failed:', file?.key, file?.src);
      });`,
  `      this.load.on('loaderror', file => {
        const key=file?.key||file?.src||'unknown asset';
        if (this.pm2OptionalVisualKeys?.has?.(file?.key)||String(file?.key||'').startsWith('pm2-activity-')||String(file?.key||'').startsWith('pm2-state-')) {
          this.optionalVisualFailures.push(key);
          console.warn('[Apartment God] Optional P2 visual failed and will use a fallback:', file?.key, file?.src);
          return;
        }
        this.assetFailures.push(key);
        console.error('[Apartment God] Required Phaser Migration 2 asset failed:', file?.key, file?.src);
      });`,
  'asset fallback classification'
);
runtime = replaceOnce(
  runtime,
  `        this.state.runtimeRenderer = 'phaser-migration-2-native-full-gameplay';`,
  `        this.state.runtimeRenderer = 'phaser-migration-2-native-full-gameplay';
        this.state.optionalVisualFailures = [...this.optionalVisualFailures];`,
  'optional failure state'
);
runtime = replaceOnce(
  runtime,
  `    update(_time, deltaMs) {
      if (!this.state) return;`,
  `    update(_time, deltaMs) {
      if (!this.state || this.runtimeFailed) return;`,
  'terminal update guard'
);
runtime = replaceOnce(
  runtime,
  `    hiddenTick() {
      if (!this.state || !document.hidden || this.state.paused) return;`,
  `    hiddenTick() {
      if (!this.state || this.runtimeFailed || !document.hidden || this.state.paused) return;`,
  'terminal hidden tick guard'
);
runtime = replaceOnce(
  runtime,
  `    renderNativeFrame() {
      const signature = floorSignature(this.state.floor);`,
  `    renderNativeFrame() {
      if (this.runtimeFailed) return;
      const signature = floorSignature(this.state.floor);`,
  'terminal render guard'
);
runtime = replaceOnce(
  runtime,
  `    recoverFrame(error, boot = false) {
      this.frameErrorCount += 1;`,
  `    recoverFrame(error, boot = false) {
      if (this.runtimeFailed) return;
      this.runtimeFailed = true;
      this.frameErrorCount += 1;`,
  'terminal recovery state'
);
runtime = replaceOnce(
  runtime,
  `        this.state.saveStatus = { message: 'Phaser Migration 2 runtime error handled' };
        this.state.paused = this.frameErrorCount > 2;`,
  `        this.state.saveStatus = { message: 'Phaser Migration 2 runtime stopped safely after an error' };
        this.state.paused = true;`,
  'terminal recovery pause'
);
runtime = replaceOnce(
  runtime,
  `      destroyNativeGameplayVisuals(this.nativeGameplayVisuals);
      this.nativeGameplayVisuals = null;`,
  `      if (this.hiddenTicker) window.clearInterval(this.hiddenTicker);
      this.hiddenTicker = null;
      destroyNativeGameplayVisuals(this.nativeGameplayVisuals);
      this.nativeGameplayVisuals = null;`,
  'recovery ticker stop'
);
write('src/phaserMigration2Runtime.js', runtime);

// 4. Record the generated art honestly as temporary fallback, not finished authored art.
const manifestPath='assets/manifests/phaser-migration-2-reference-visual-completion.json';
const manifest=JSON.parse(read(manifestPath));
manifest.status='procedural_temporary_fallback_needs_authored_replacement';
manifest.preVisualParityBaseline='c8941bbe16e5725ad02eb20596ee5a07868303b8';
manifest.authoredArtApproval=false;
manifest.generatedActivityPngsAreFinal=false;
manifest.generatedObjectStatePngsAreFinal=false;
manifest.notes=[
  'Gameplay and object parity are audited separately from final art approval.',
  'Generated activity and state PNGs remain safe temporary fallbacks only.',
  'Final character, room, vehicle, architecture and activity art still requires authored top-down approval.'
];
write(manifestPath,JSON.stringify(manifest,null,2));

// 5. Regression tests for the concrete runtime defects and parity contract.
write('tests/phaser-migration-2-previsual-parity-repair.test.js',`import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { objects } from '../src/world.js';
import { setCharacterVisualVisible } from '../src/phaserCharacterAnimationSystem.js';
import { PM2_OBJECT_TEXTURES, textureForObject } from '../src/phaserMigration2VisualCatalog.js';
const runtime=readFileSync(new URL('../src/phaserMigration2Runtime.js',import.meta.url),'utf8');
const completion=readFileSync(new URL('../src/phaserMigration2ReferenceCompletion.js',import.meta.url),'utf8');
const characterSource=readFileSync(new URL('../src/phaserCharacterAnimationSystem.js',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('../assets/manifests/phaser-migration-2-reference-visual-completion.json',import.meta.url),'utf8'));
describe('P2 full previsual parity repair',()=>{
  it('targets the exact native actor record so activity sprites cannot leave a duplicate body underneath',()=>{const calls=[];const child={setVisible:value=>calls.push(value)};const scene={pm2ActorVisuals:new Map([['resident',{shadow:child,ring:child,sprite:child,cue:child,label:child}]])};expect(setCharacterVisualVisible(scene,'resident',false)).toBe(true);expect(calls).toEqual([false,false,false,false,false]);expect(characterSource).toContain('child.pm2EntityId = entity.id');expect(completion).toContain('setCharacterVisualVisible(scene, entity.id, visible)');});
  it('uses exact sleep and activity object ids before any nearest-object fallback',()=>{expect(completion).toContain('entity.sleepObjectId');expect(completion).toContain('entity.activityObjectId');expect(completion).toContain("findActivityObject(entity,activity)?.id===object.id");});
  it('treats activity and object-state images as optional fallbacks instead of boot blockers',()=>{expect(runtime).toContain('this.optionalVisualFailures = []');expect(runtime).toContain("startsWith('pm2-activity-')");expect(runtime).toContain("startsWith('pm2-state-')");expect(completion).toContain("scene.textures.exists(texture)");});
  it('stops normal update and rendering after one terminal recovery',()=>{expect(runtime).toContain('if (!this.state || this.runtimeFailed) return');expect(runtime).toContain('if (this.runtimeFailed) return');expect(runtime).toContain('this.runtimeFailed = true');expect(runtime).toContain('this.state.paused = true');});
  it('keeps architecture outside room containers so floor rebuilds do not destroy it',()=>{expect(completion).toContain('const underlay = scene.add.graphics().setDepth(-5)');expect(completion).not.toContain('scene.roomLayer?.add?.(architecture)');expect(completion).not.toContain('scene.effectLayer?.add?.(lighting)');});
  it('maps every baseline world object kind to a non-generic texture',()=>{for(const object of objects){expect(PM2_OBJECT_TEXTURES[object.kind],object.id).toBeTruthy();expect(textureForObject(object),object.id).not.toBe('pm2-object-generic');}});
  it('does not falsely mark generated procedural PNGs as final authored art',()=>{expect(manifest.status).toBe('procedural_temporary_fallback_needs_authored_replacement');expect(manifest.authoredArtApproval).toBe(false);expect(manifest.generatedActivityPngsAreFinal).toBe(false);});
});
`);

write('apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-19_P2_FULL_PREVISUAL_PARITY_REPAIR.md',`## 2026-07-19, P2 Full Previsual Parity Repair

Status: NEEDS_BROWSER_TESTING
Branch: phaser-migration-2
Baseline: c8941bbe16e5725ad02eb20596ee5a07868303b8
Commit: generated after baseline audit, repository checks, tests and static build
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-2-before-full-previsual-parity-repair-2026-07-19

Summary:
Performed a source-level and data-level audit against the last verified P2 build before the visual overhaul, then repaired concrete translation defects without reverting the improved visual files or restoring the old Canvas renderer.

Implementation details:
- Kept the baseline world, room, object, actor, action, movement, autonomy, economy, calendar, career, save, phone, camera, gate, vehicle, pool, basketball, tidiness and offsite systems.
- Fixed duplicate actor rendering by targeting the exact scene.pm2ActorVisuals record and tagging every base actor display object with its entity ID.
- Fixed sleep and repeated-object state binding by using sleepObjectId and other exact action object IDs before nearest fallback.
- Changed optional activity and state image failures from fatal boot errors to per-asset fallbacks.
- Added a terminal runtimeFailed state so one recovery screen remains stable instead of entering repeated update errors.
- Moved architecture, foreground, lighting and effects out of containers that floor rebuilds destroy.
- Replaced detached rounded room boxes with connected room boundary logic based on the unchanged baseline room coordinates.
- Marked generated activity and object-state PNGs honestly as temporary procedural fallbacks rather than final authored art.
- Generated a machine-readable parity report from a detached worktree at the baseline commit.

Testing performed:
- Exact baseline and current floor, room and object data comparison.
- Baseline gameplay source preservation checks.
- Current runtime import and update-loop coverage checks.
- Object visual coverage checks.
- Repository checks, unit tests and static build.

Testing requested:
Test every floor, every navigation route, every object menu, all phone and utility tabs, movement, autonomy, save/load, vehicles, arcade, pool, basketball, sleeping, showering, eating, dog activities and offsite behavior in the isolated P2 preview. Report any behavioral difference from the pre-overhaul build separately from art-quality corrections.

Known risks:
This repair verifies and protects gameplay translation. It does not falsely claim the current procedural SVG and generated PNG art has reached Kam's peak authored sprite standard. Those assets remain temporary until replaced by approved true top-down art.

Follow ups:
Correct browser-observed parity defects first. Then replace temporary visual fallbacks with approved authored assets object by object and activity by activity, preserving the verified gameplay contract.
`);

write('apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-19_P2_FULL_PREVISUAL_PARITY_REPAIR.md',`# Development Matrix Patch, P2 Full Previsual Parity Repair

Date: 2026-07-19
Branch: phaser-migration-2
Baseline: c8941bbe16e5725ad02eb20596ee5a07868303b8
Status: NEEDS_BROWSER_TESTING
Backup: backup/phaser-migration-2-before-full-previsual-parity-repair-2026-07-19

| System | Status | Audit or repair result | Required test |
|---|---|---|---|
| Baseline floors, rooms and objects | VERIFIED_BY_DATA_DIFF | Exact normalized floor, room and object data are compared against the pre-overhaul P2 commit. | Browse every floor and inspect placement. |
| Gameplay source preservation | VERIFIED_BY_SOURCE_DIFF | Core actions, movement, autonomy, state, UI, phone, camera, save, calendar, careers, vehicles, gates, pool, basketball, tidiness and offsite source remain present. | End-to-end play session. |
| Actor activity replacement | FIXED, NEEDS_BROWSER_TEST | Exact pm2ActorVisuals record is hidden while an activity sheet is shown. | Confirm exactly one body per actor during every activity. |
| Exact object-state binding | FIXED, NEEDS_BROWSER_TEST | sleepObjectId and explicit activity object IDs bind state to one exact object. | Test repeated sinks, showers, toilets, beds and couches. |
| Optional asset fallback | FIXED_BY_CODE | Missing optional activity or state art no longer blocks game boot. | Force one optional asset failure in browser testing. |
| Runtime recovery | FIXED_BY_CODE | runtimeFailed prevents repeated update loops after a recovery screen. | Force one controlled runtime error. |
| Architecture persistence | FIXED, NEEDS_VISUAL_TEST | Completion graphics no longer live inside floor containers that are cleared during rebuild. | Change floors repeatedly and inspect boundaries and effects. |
| Generated visual art | TEMPORARY | Generated SVG and PNG art is explicitly marked procedural fallback, not final authored art. | Continue authored asset replacement after parity acceptance. |
| Native Phaser ownership | PRESERVED | No legacy drawPhaserEnvironment or textures.addCanvas frame bridge added. | Confirm native boot and pointer input. |
`);
