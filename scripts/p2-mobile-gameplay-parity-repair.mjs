import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(ROOT, file), String(content).trimEnd() + '\n');
const replaceOnce = (source, from, to, label) => {
  if (source.includes(to)) return source;
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  return source.replace(from, to);
};

// Restore DOM gameplay systems that the old Canvas draw loop synchronized but native P2 bypassed.
let runtime = read('src/phaserMigration2Runtime.js');
runtime = replaceOnce(
  runtime,
  "import { installCameraSwipeNavigation, updateCameraTransition } from './cameraNavigation.js';",
  "import { installCameraSwipeNavigation, syncCameraNavigationUi, updateCameraTransition } from './cameraNavigation.js';",
  'camera navigation import'
);
if (!runtime.includes("import { syncPhoneUi } from './phoneUI.js';")) {
  runtime = runtime.replace("import { updateOffsiteHomeView } from './offsiteOverlay.js';", "import { updateOffsiteHomeView } from './offsiteOverlay.js';\nimport { syncPhoneUi } from './phoneUI.js';");
}
runtime = runtime.replace(
  "import { PM2_CHARACTER_SHEETS, PM2_OBJECT_TEXTURES, PM2_ROOM_TEXTURES, textureForObject, textureForRoom } from './phaserMigration2VisualCatalog.js';",
  "import { applyObjectVisualTransform, PM2_CHARACTER_SHEETS, PM2_OBJECT_TEXTURES, PM2_ROOM_TEXTURES, textureForObject, textureForRoom } from './phaserMigration2VisualCatalog.js';"
);
if (!runtime.includes('syncNativeDomGameplayUi(this);')) {
  runtime = runtime.replace(/\s*syncReferenceCompletion\(this\);\s*syncNativeGameplayVisuals\(this, this\.state, this\.nativeGameplayVisuals\);/, "\n      syncReferenceCompletion(this);\n      syncNativeGameplayVisuals(this, this.state, this.nativeGameplayVisuals);\n      syncNativeDomGameplayUi(this);");
}
if (!runtime.includes('function syncNativeDomGameplayUi(scene)')) {
  runtime = runtime.replace('function sanitizeRuntimeState(state) {', `function syncNativeDomGameplayUi(scene) {
  if (!scene?.state) return;
  scene.domUiFailures ??= new Set();
  if (!scene.domUiFailures.has('phone')) {
    try { syncPhoneUi(scene.state); }
    catch (error) {
      scene.domUiFailures.add('phone');
      console.error('[Apartment God] Native P2 phone and vertical navigation UI disabled after error.', error);
    }
  }
  if (!scene.domUiFailures.has('camera')) {
    try { syncCameraNavigationUi(scene.state); }
    catch (error) {
      scene.domUiFailures.add('camera');
      console.error('[Apartment God] Native P2 map and locator UI disabled after error.', error);
    }
  }
}

function sanitizeRuntimeState(state) {`);
}
runtime = runtime.replace(
  "        panel.setDisplaySize(room.w, room.h);",
  "        panel.setCrop(6, 6, 116, 116);\n        panel.setDisplaySize(room.w, room.h);"
);
runtime = runtime.replace(
  /        sprite\.setPosition\(object\.x \+ object\.w \/ 2, object\.y \+ object\.h \/ 2\);\n        sprite\.setDisplaySize\(Math\.max\(18, object\.w\), Math\.max\(18, object\.h\)\);\n        sprite\.setDepth\(object\.y \+ object\.h\);\n        sprite\.setRotation\(Number\(object\.renderAngle \|\| 0\)\);/,
  "        applyObjectVisualTransform(sprite, object);"
);
write('src/phaserMigration2Runtime.js', runtime);

// Apply explicit object facing without changing world footprints or click targets.
let catalog = read('src/phaserMigration2VisualCatalog.js');
if (!catalog.includes('export function applyObjectVisualTransform')) {
  catalog = catalog.replace('export function textureForObject(object) {', `const FACING_ROTATIONS = { down: 0, south: 0, west: Math.PI / 2, up: Math.PI, north: Math.PI, east: -Math.PI / 2 };

export function objectVisualRotation(object) {
  const explicit = Number(object?.renderAngle);
  if (Number.isFinite(explicit)) return explicit;
  if (object?.headboard) return FACING_ROTATIONS[String(object.headboard).toLowerCase()] ?? 0;
  return FACING_ROTATIONS[String(object?.facing || 'down').toLowerCase()] ?? 0;
}

export function objectVisualDisplaySize(object) {
  const rotation = objectVisualRotation(object);
  const quarterTurn = Math.abs(Math.sin(rotation)) > 0.5;
  const width = Math.max(18, Number(object?.w) || 18);
  const height = Math.max(18, Number(object?.h) || 18);
  return quarterTurn ? { width: height, height: width } : { width, height };
}

export function applyObjectVisualTransform(sprite, object) {
  const rotation = objectVisualRotation(object);
  const size = objectVisualDisplaySize(object);
  sprite.setPosition(object.x + object.w / 2, object.y + object.h / 2);
  sprite.setDisplaySize(size.width, size.height);
  sprite.setDepth(object.y + object.h);
  sprite.setRotation(rotation);
  return sprite;
}

export function textureForObject(object) {`);
}
write('src/phaserMigration2VisualCatalog.js', catalog);

// Repair the visual completion layer so it survives floor rebuilds and does not box every room as an island.
let completion = read('src/phaserMigration2ReferenceCompletion.js');
completion = completion.replace(
  "import { textureForObject } from './phaserMigration2VisualCatalog.js';",
  "import { applyObjectVisualTransform, textureForObject } from './phaserMigration2VisualCatalog.js';"
);
completion = completion.replace(
`  const architecture = scene.add.graphics().setDepth(-820);
  const lighting = scene.add.graphics().setDepth(8500).setBlendMode('ADD');
  const effects = scene.add.graphics().setDepth(8600);
  const foreground = scene.add.graphics().setDepth(7800);
  scene.roomLayer?.add?.(architecture);
  scene.effectLayer?.add?.(lighting);
  scene.effectLayer?.add?.(effects);
  scene.effectLayer?.add?.(foreground);`,
`  const underlay = scene.add.graphics().setDepth(-5);
  const architecture = scene.add.graphics().setDepth(10);
  const foreground = scene.add.graphics().setDepth(85);
  const lighting = scene.add.graphics().setDepth(95).setBlendMode('ADD');
  const effects = scene.add.graphics().setDepth(96);`
);
completion = completion.replace(
  'scene.referenceCompletion={architecture,lighting,effects,foreground,activitySprites,lastFloor:null};',
  'scene.referenceCompletion={underlay,architecture,lighting,effects,foreground,activitySprites,lastFloor:null};'
);
completion = completion.replace(
  "system.architecture?.destroy?.(); system.lighting?.destroy?.(); system.effects?.destroy?.(); system.foreground?.destroy?.();",
  "system.underlay?.destroy?.(); system.architecture?.destroy?.(); system.lighting?.destroy?.(); system.effects?.destroy?.(); system.foreground?.destroy?.();"
);
completion = completion.replace(
  '    sprite.setDisplaySize(Math.max(18,object.w),Math.max(18,object.h));',
  '    applyObjectVisualTransform(sprite,object);'
);
const architectureStart = completion.indexOf('function drawArchitecture(scene,force) {');
const lightingStart = completion.indexOf('function drawLightingAndEffects(scene,activeByObject,now) {');
if (architectureStart < 0 || lightingStart < 0 || lightingStart <= architectureStart) throw new Error('architecture function anchors missing');
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
  for (const room of rooms) u.fillRect(room.x-8,room.y-8,room.w+16,room.h+16);
  for (const room of rooms) {
    g.lineStyle(4,0x17222c,.96);
    g.strokeRect(room.x,room.y,room.w,room.h);
    g.lineStyle(1.5,0x91a9b7,.22);
    g.strokeRect(room.x+3,room.y+3,room.w-6,room.h-6);
    const topOuter=!hasNeighbor(rooms,room,'top');
    const bottomOuter=!hasNeighbor(rooms,room,'bottom');
    const leftOuter=!hasNeighbor(rooms,room,'left');
    const rightOuter=!hasNeighbor(rooms,room,'right');
    g.lineStyle(6,0x0d151d,.96);
    if (topOuter) g.lineBetween(room.x,room.y,room.x+room.w,room.y);
    if (leftOuter) g.lineBetween(room.x,room.y,room.x,room.y+room.h);
    if (rightOuter) g.lineBetween(room.x+room.w,room.y,room.x+room.w,room.y+room.h);
    if (bottomOuter) {
      g.lineBetween(room.x,room.y+room.h,room.x+room.w,room.y+room.h);
      fg.lineStyle(6,0x071018,.76);
      fg.lineBetween(room.x+5,room.y+room.h-1,room.x+room.w-5,room.y+room.h-1);
    }
    if (topOuter && room.w>240 && !room.id.includes('garage')) {
      const windowColor=room.id.includes('bath')?0x8ee7ee:0x72b9d1;
      g.lineStyle(5,windowColor,.5);
      g.lineBetween(room.x+room.w*.36,room.y+2,room.x+room.w*.64,room.y+2);
    }
  }
  if (floor===0) {
    g.fillStyle(0x4e3c31,.7);g.fillRect(472,48,286,21);
    g.lineStyle(3,0xc59b69,.35);g.lineBetween(480,58,750,58);
    g.lineStyle(5,0x15212b,.95);g.lineBetween(784,166,932,166);
  }
  if (floor===3) { g.lineStyle(4,0xf1c66a,.2);for(let x=90;x<900;x+=90)g.lineBetween(x,45,x,675); }
}
function hasNeighbor(rooms,room,side) {
  const tolerance=18;
  return rooms.some(other=>{
    if (other===room) return false;
    const overlapX=Math.min(room.x+room.w,other.x+other.w)-Math.max(room.x,other.x)>12;
    const overlapY=Math.min(room.y+room.h,other.y+other.h)-Math.max(room.y,other.y)>12;
    if (side==='top') return overlapX&&Math.abs((other.y+other.h)-room.y)<=tolerance;
    if (side==='bottom') return overlapX&&Math.abs((room.y+room.h)-other.y)<=tolerance;
    if (side==='left') return overlapY&&Math.abs((other.x+other.w)-room.x)<=tolerance;
    return overlapY&&Math.abs((room.x+room.w)-other.x)<=tolerance;
  });
}
`;
completion = completion.slice(0, architectureStart) + architectureReplacement + completion.slice(lightingStart);
write('src/phaserMigration2ReferenceCompletion.js', completion);

// Replace the source-level fit that centered a 4:3 canvas inside a fixed 50vh portrait box.
write('src/fit.js', `const shell = document.getElementById('app-shell');
const wrap = document.getElementById('game-wrap');
const hud = document.getElementById('hud');
const canvas = document.getElementById('game');
const controlBar = document.getElementById('game-control-bar');

function fit() {
  if (!shell || !wrap || !hud || !canvas) return;
  const width = Math.max(320, window.innerWidth);
  const height = Math.max(420, window.innerHeight);
  const wide = width > height && width >= 760;
  if (canvas.dataset.phaserOwned !== 'true') {
    canvas.width = 960;
    canvas.height = 720;
  }
  shell.style.width = '100vw';
  shell.style.height = '100dvh';
  shell.style.overflow = 'hidden';
  wrap.style.overflow = 'hidden';
  canvas.style.aspectRatio = '4 / 3';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvas.style.margin = '0 auto';

  if (wide) {
    const hudWidth = Math.min(388, Math.max(320, Math.round(width * .28)));
    const controlsWidth = 92;
    shell.style.display = 'flex';
    shell.style.flexDirection = 'row';
    wrap.style.flex = '1 1 auto';
    wrap.style.width = 'auto';
    wrap.style.height = '100dvh';
    wrap.style.minHeight = '0';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    const gameWidth = Math.max(320, width - hudWidth - controlsWidth);
    canvas.style.width = `${Math.min(gameWidth, Math.round(height * 4 / 3))}px`;
    canvas.style.height = 'auto';
    if (controlBar) {
      controlBar.style.flex = `0 0 ${controlsWidth}px`;
      controlBar.style.height = '100dvh';
      controlBar.style.minHeight = '0';
      controlBar.style.flexDirection = 'column';
      controlBar.style.overflowX = 'hidden';
      controlBar.style.overflowY = 'auto';
    }
    hud.style.flex = `0 0 ${hudWidth}px`;
    hud.style.width = `${hudWidth}px`;
    hud.style.height = '100dvh';
    hud.style.minHeight = '0';
  } else {
    const controlsHeight = 70;
    const gameHeight = Math.max(240, Math.min(Math.floor(width * 3 / 4), height - controlsHeight - 150));
    const gameWidth = Math.min(width, Math.floor(gameHeight * 4 / 3));
    shell.style.display = 'flex';
    shell.style.flexDirection = 'column';
    wrap.style.flex = `0 0 ${gameHeight}px`;
    wrap.style.width = '100vw';
    wrap.style.height = `${gameHeight}px`;
    wrap.style.minHeight = '0';
    wrap.style.alignItems = 'flex-start';
    wrap.style.justifyContent = 'center';
    canvas.style.width = `${gameWidth}px`;
    canvas.style.height = `${gameHeight}px`;
    if (controlBar) {
      controlBar.style.flex = `0 0 ${controlsHeight}px`;
      controlBar.style.height = `${controlsHeight}px`;
      controlBar.style.minHeight = `${controlsHeight}px`;
      controlBar.style.flexDirection = 'row';
      controlBar.style.overflowX = 'auto';
      controlBar.style.overflowY = 'hidden';
    }
    hud.style.flex = '1 1 0';
    hud.style.width = '100%';
    hud.style.height = 'auto';
    hud.style.minHeight = '0';
    hud.style.overflowY = 'auto';
  }
}

window.addEventListener('resize', fit);
window.addEventListener('orientationchange', fit);
window.addEventListener('pageshow', fit);
fit();`);

// Expose critical status and navigation without requiring the HUD to be scrolled first.
let index = read('index.html');
if (!index.includes('id="hud-resource-strip"')) {
  index = index.replace(
    '<div id="hud-calendar-pill" aria-live="polite">Y1 | Mon Jan 1 | 6:45 AM</div>',
    '<div id="hud-calendar-pill" aria-live="polite">Y1 | Mon Jan 1 | 6:45 AM</div>\n        <div id="hud-resource-strip" aria-live="polite"><span id="resource-money">$0</span><span id="resource-utilities">Power $0</span><span id="resource-tidiness">Tidy 100%</span></div>'
  );
}
if (!index.includes('id="utility-state"')) {
  index = index.replace(
    '        <section class="panel">\n          <h2>Needs</h2>',
    '        <section class="panel utility-panel">\n          <h2>Money, Utilities & Navigation</h2>\n          <div id="utility-state"></div>\n        </section>\n\n        <section class="panel">\n          <h2>Needs</h2>'
  );
}
if (!index.includes('id="floor-5"')) index = index.replace('<button id="floor-4">Backyard</button>', '<button id="floor-4">Backyard</button>\n          <button id="floor-5">Secret Lab</button>');
index = index.replaceAll('20260717-p2-full-gameplay', '20260719-p2-mobile-parity');
write('index.html', index);

let ui = read('src/ui.js');
if (!ui.includes("const resourceMoney = document.getElementById('resource-money');")) {
  ui = ui.replace(
    "  const calendarPill = document.getElementById('hud-calendar-pill');",
    "  const calendarPill = document.getElementById('hud-calendar-pill');\n  const resourceMoney = document.getElementById('resource-money');\n  const resourceUtilities = document.getElementById('resource-utilities');\n  const resourceTidiness = document.getElementById('resource-tidiness');\n  const utilityState = document.getElementById('utility-state');"
  );
}
ui = ui.replace(
  "const areaButtons = [[0, 'Main'], [1, 'Upstairs'], [2, 'Basement'], [3, 'Garage West'], [4, 'Yard North'], [6, 'Front South'], [7, 'Driveway West']];",
  "const areaButtons = [[0, 'Main'], [1, 'Upstairs'], [2, 'Basement'], [3, 'Garage West'], [4, 'Yard North'], [5, 'Secret Lab'], [6, 'Front South'], [7, 'Driveway West']];"
);
if (!ui.includes("resourceMoney.textContent = `$${money}`;")) {
  ui = ui.replace(
    "    if (calendarPill) calendarPill.textContent = compactDate;",
    "    if (calendarPill) calendarPill.textContent = compactDate;\n    const money = Math.round(state.money ?? 0);\n    const electric = Math.max(0, Math.round(state.bill ?? 0));\n    const tidyScore = Math.round(state.tidiness?.score ?? 100);\n    if (resourceMoney) resourceMoney.textContent = `$${money}`;\n    if (resourceUtilities) resourceUtilities.textContent = `Power $${electric}`;\n    if (resourceTidiness) resourceTidiness.textContent = `Tidy ${tidyScore}%`;\n    if (utilityState) utilityState.innerHTML = `<div class=\"utility-grid\"><span><strong>Money</strong>$${money}</span><span><strong>Electric</strong>$${electric}</span><span><strong>Tidiness</strong>${tidyScore}%</span><span><strong>Autonomy</strong>${state.autonomyMode}</span></div><p class=\"utility-note\">Use the visible ↑ Up and ↓ Down controls on the game, or Map and Phone in the control bar.</p>`;"
  );
}
write('src/ui.js', ui);

let css = read('styles.css');
if (!css.includes('P2_MOBILE_GAMEPLAY_PARITY_REPAIR')) css += `

/* P2_MOBILE_GAMEPLAY_PARITY_REPAIR */
#hud-resource-strip{position:absolute;right:10px;top:10px;z-index:43;display:flex;gap:6px;pointer-events:none;max-width:calc(100% - 390px)}
#hud-resource-strip span{padding:6px 9px;border:1px solid rgba(114,200,216,.38);border-radius:999px;background:rgba(8,14,21,.78);box-shadow:0 8px 22px rgba(0,0,0,.3);backdrop-filter:blur(8px);font-size:11px;font-weight:900;color:#eef5f6;white-space:nowrap}
#resource-money{color:#f2d587!important}#resource-utilities{color:#9edbe5!important}
.utility-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.utility-grid span{display:flex;flex-direction:column;gap:3px;padding:8px 10px;border:1px solid rgba(142,169,184,.2);border-radius:10px;background:rgba(5,11,17,.3);font-size:13px}.utility-grid strong{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--ag-gold,#d6b36c)}.utility-note{margin:9px 0 0;color:var(--ag-muted,#9cabb4);font-size:11px;line-height:1.35}
#command-panel{position:static}.utility-panel{border-color:rgba(214,179,108,.32)}
@media(max-width:899px){body{overflow:hidden}#app-shell{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}#game-wrap{min-height:0!important;place-items:start center!important}#game{display:block!important}#hud{min-height:0!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}#game-control-bar{justify-content:flex-start!important;overscroll-behavior-x:contain}#vertical-nav-dock{top:52px;bottom:10px}.compact-grid{position:static}#hud-resource-strip{top:42px;right:8px;max-width:calc(100% - 16px);gap:4px}#hud-resource-strip span{padding:5px 7px;font-size:10px}}
@media(max-width:430px){#hud-resource-strip span:nth-child(3){display:none}.utility-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#vertical-nav-dock{top:76px}.vertical-screen-button{min-width:64px;padding:0 10px}}
`;
write('styles.css', css);

const test = `import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { objectVisualDisplaySize, objectVisualRotation } from '../src/phaserMigration2VisualCatalog.js';
const runtime=readFileSync(new URL('../src/phaserMigration2Runtime.js',import.meta.url),'utf8');
const fit=readFileSync(new URL('../src/fit.js',import.meta.url),'utf8');
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const ui=readFileSync(new URL('../src/ui.js',import.meta.url),'utf8');
const completion=readFileSync(new URL('../src/phaserMigration2ReferenceCompletion.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
describe('P2 mobile gameplay parity repair',()=>{
  it('restores phone map locator and vertical navigation synchronization',()=>{expect(runtime).toContain('syncPhoneUi(scene.state)');expect(runtime).toContain('syncCameraNavigationUi(scene.state)');expect(runtime).toContain('syncNativeDomGameplayUi(this)');});
  it('keeps money utilities and every house area visible in the DOM HUD',()=>{expect(index).toContain('hud-resource-strip');expect(index).toContain('utility-state');expect(index).toContain('floor-5');expect(ui).toContain('Power $');expect(ui).toContain("[5, 'Secret Lab']");});
  it('fits portrait gameplay to an exact 4 by 3 box instead of a fixed 50vh wrapper',()=>{expect(fit).toContain('Math.floor(width * 3 / 4)');expect(fit).not.toContain("wrap.style.flex = '0 0 50vh'");expect(fit).toContain("wrap.style.alignItems = 'flex-start'");});
  it('preserves directional art inside the original gameplay footprint',()=>{const west={x:0,y:0,w:42,h:112,facing:'west'};expect(objectVisualRotation(west)).toBeCloseTo(Math.PI/2);expect(objectVisualDisplaySize(west)).toEqual({width:112,height:42});const bed={x:0,y:0,w:236,h:118,headboard:'west'};expect(objectVisualRotation(bed)).toBeCloseTo(-Math.PI/2);expect(objectVisualDisplaySize(bed)).toEqual({width:118,height:236});});
  it('removes the disconnected rounded room boxing and keeps completion graphics alive',()=>{expect(completion).toContain('const underlay = scene.add.graphics().setDepth(-5)');expect(completion).not.toContain('scene.roomLayer?.add?.(architecture)');expect(completion).not.toContain('strokeRoundedRect(room.x,room.y,room.w,room.h,8)');expect(runtime).toContain('panel.setCrop(6, 6, 116, 116)');});
  it('keeps native Phaser ownership and mobile control visibility',()=>{expect(runtime).not.toContain('drawPhaserEnvironment');expect(runtime).not.toContain('textures.addCanvas');expect(css).toContain('P2_MOBILE_GAMEPLAY_PARITY_REPAIR');expect(css).toContain('#vertical-nav-dock');});
});
`;
write('tests/phaser-migration-2-mobile-gameplay-parity.test.js', test);

const matrix = `# Development Matrix Patch, P2 Mobile Gameplay Parity Repair

Date: 2026-07-19
Branch: phaser-migration-2
Status: NEEDS_BROWSER_TESTING
Backup: backup/phaser-migration-2-before-mobile-gameplay-parity-repair-2026-07-19

| System | Status | Repair | Required test |
|---|---|---|---|
| Money visibility | NEEDS_TESTING | Money is restored to an always-visible resource strip and the Utilities panel. | Confirm money updates after purchases and Dev Money. |
| Utility section | NEEDS_TESTING | Electric bill, tidiness, autonomy, save and world details remain accessible without losing gameplay. | Inspect portrait HUD and scroll behavior. |
| Up and Down navigation | NEEDS_TESTING | Native P2 now synchronizes phoneUI, which creates the existing vertical floor dock. | Test Upstairs to Main, Main to Basement, Basement to Main. |
| Map and household locator | NEEDS_TESTING | Native P2 now synchronizes camera navigation UI in its own render loop. | Open Map, locator, selected character and Secret Lab. |
| Phone | NEEDS_TESTING | Native P2 now synchronizes the existing full phone system. | Open all phone tabs and close safely. |
| Portrait gameplay fit | NEEDS_TESTING | Exact 4:3 width-based game wrapper replaces centered fixed 50vh letterboxing. | Test 375x667 and current Android viewport. |
| Object orientation | NEEDS_TESTING | Facing and headboard metadata rotate art while swapped display dimensions preserve original footprints. | Inspect bed, vanity, toilet, couch, TV and closets. |
| Connected architecture | NEEDS_TESTING | Cropped room textures and a persistent connected wall underlay replace heavy rounded room boxes. | Inspect Main and Upstairs for disconnected sections. |
| Gameplay parity | VERIFIED_BY_CODE_AND_TEST | State, actions, autonomy, movement, saves, careers and world coordinates were not removed by the visual commits. | Perform browser regression test. |
| Native Phaser ownership | VERIFIED_BY_CODE_AND_TEST | Repair uses native Phaser images, sprites and Graphics with DOM controls. | Confirm no legacy Canvas bridge. |
`;
write('apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-19_MOBILE_GAMEPLAY_PARITY_REPAIR.md', matrix);

const log = `## 2026-07-19, P2 Mobile Gameplay Parity Repair Committed

Status: NEEDS_TESTING
Branch: phaser-migration-2
Commit: generated after checks, unit tests and static build
Files changed: src/phaserMigration2Runtime.js, src/phaserMigration2VisualCatalog.js, src/phaserMigration2ReferenceCompletion.js, src/fit.js, src/ui.js, index.html, styles.css, regression test, matrix patch and this log append
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-2-before-mobile-gameplay-parity-repair-2026-07-19

Summary:
Repaired the mobile and gameplay exposure regression shown in Kam's Android screenshot while preserving the improved visual assets. The repair restores the existing phone, Map, locator, selected-character and vertical Up and Down systems to the native P2 render loop, makes money and utilities visible, removes fixed 50vh portrait letterboxing, preserves directional object footprints and replaces disconnected room boxing with connected architecture.

Implementation details:
- Cross-check against pre-visual P2 commit c8941bbe16e5725ad02eb20596ee5a07868303b8 confirmed actions, state, movement, autonomy, calendar, saves, economy and UI command logic were not deleted by the visual commits.
- Identified that the native P2 runtime bypassed rendering.js, so syncPhoneUi and syncCameraNavigationUi were never called. This hid the phone, vertical navigation dock, Map, locator and selected-character controls.
- Identified that fit.js centered the 4:3 canvas inside a fixed 50vh portrait wrapper, producing large unused blank bands.
- Restored the missing native DOM UI synchronization behind isolated error guards.
- Added always-visible money, electric and tidiness status plus an explicit Utilities panel.
- Added Secret Lab to the static area controls.
- Added facing and headboard-aware sprite orientation while swapping texture dimensions so world footprints and click targets do not rotate or drift.
- Cropped decorative borders from room textures and rebuilt the completion architecture as a persistent connected wall layer instead of rounded room islands.

Testing performed:
- Repository checks passed.
- Unit tests passed.
- Static build passed.
- Regression tests verify restored phone, Map, locator, Up and Down calls, money and utilities markup, 4:3 portrait fitting, orientation footprint preservation, connected architecture and native Phaser ownership.

Testing requested:
Hard refresh the isolated AppDeploy preview. Confirm the game starts at the top of the gameplay region with no large empty band, Up and Down are visible, Phone and Map controls populate the control bar, money and utilities are visible, the HUD scrolls, every floor can be browsed, and Upstairs no longer reads as detached rounded room boxes.

Known risks:
Browser testing is still required for exact mobile dimensions, touch placement, art orientation and the visual quality of connected wall boundaries. Main and Render remain unchanged.

Follow ups:
Correct only observed browser defects on phaser-migration-2. Do not update main or Render without explicit authorization.
`;
write('apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-19_MOBILE_GAMEPLAY_PARITY_REPAIR_COMMITTED.md', log);
