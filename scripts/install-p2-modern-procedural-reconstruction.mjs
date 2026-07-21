import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(root, file), String(content).trimEnd() + '\n');
const replaceOnce = (source, from, to, label) => {
  if (source.includes(to)) return source;
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`);
  return source.replace(from, to);
};

let renderer = read('src/phaserMigration2ModernProceduralRenderer.js');
renderer = replaceOnce(renderer,
`const COLORS = {`,
`export const MODERN_PROCEDURAL_OBJECT_KINDS = new Set([
  'couch','dining_table','fridge','stove','sink','coffee_maker','trash_can','outdoor_trash','shower','dog_bath','bathtub','toilet','bed','tv','stereo','desk','bookshelf','pool_table','arcade','arcade_machine','game_console','dartboard','treadmill','weight_bench','heavy_bag','stairs','door','panic_room_door','garage_door','dog_bed','dog_bowl','closet','cleaning_closet','nightstand','kennel','swim_pool','soccer_field','basketball_court','car','bike','motorbike','atv','robot_vacuum','vacuum_cleaner','light','security_panel','security_locker','security_supply'
]);

const COLORS = {`,
'renderer object kind export');
write('src/phaserMigration2ModernProceduralRenderer.js', renderer);

let runtime = read('src/phaserMigration2Runtime.js');
runtime = replaceOnce(runtime,
`import {
  PM2_CHARACTER_SHEETS,
  PM2_OBJECT_TEXTURES,
  PM2_ROOM_TEXTURES,
  textureForObject,
  textureForRoom
} from './phaserMigration2VisualCatalog.js';`,
`import {
  PM2_CHARACTER_SHEETS,
  PM2_OBJECT_TEXTURES,
  PM2_ROOM_TEXTURES
} from './phaserMigration2VisualCatalog.js';
import {
  createModernProceduralObject,
  createModernProceduralRoom,
  isModernProceduralVisual,
  refreshModernProceduralObject
} from './phaserMigration2ModernProceduralRenderer.js';`,
'runtime imports');
runtime = replaceOnce(runtime,
`      for (const room of floor.rooms || []) {
        const requestedTexture = textureForRoom(room);
        const texture = this.textures.exists(requestedTexture) ? requestedTexture : '__MISSING';
        const panel = this.add.image(room.x + room.w / 2, room.y + room.h / 2, texture);
        panel.setDisplaySize(room.w, room.h);
        panel.setAlpha(roomAlpha(room.id));
        panel.setDepth(room.y - 1000);
        this.roomLayer.add(panel);
        const label = this.add.text(room.x + 10, room.y + 8, room.name, {
          fontFamily: 'system-ui', fontSize: 10, fontStyle: '900', color: '#d9e7f2', backgroundColor: 'rgba(7,10,16,.34)', padding: { x: 4, y: 2 }
        });
        label.setVisible(Boolean(this.state.debugVisualLabels));
        label.setDepth(room.y - 900);
        this.roomLayer.add(label);
      }

      for (const object of objects.filter(candidate => candidate.floor === this.state.floor)) {
        const requestedTexture = textureForObject(object);
        const texture = this.textures.exists(requestedTexture) ? requestedTexture : '__MISSING';
        const sprite = this.add.image(object.x + object.w / 2, object.y + object.h / 2, texture);
        sprite.pm2Object = object;
        this.objectLayer.add(sprite);
        this.nativeObjects.push(sprite);
      }`,
`      for (const room of floor.rooms || []) {
        const panel = createModernProceduralRoom(this, room, floor.id, this.state);
        this.roomLayer.add(panel);
        const label = this.add.text(room.x + 16, room.y + 14, room.name, {
          fontFamily: 'system-ui', fontSize: 11, fontStyle: '900', color: '#3f352d', backgroundColor: 'rgba(247,242,233,.72)', padding: { x: 5, y: 3 }
        });
        label.setVisible(Boolean(this.state.debugVisualLabels));
        label.setDepth(room.y - 850);
        this.roomLayer.add(label);
      }

      const floorObjects = objects
        .filter(candidate => candidate.floor === this.state.floor)
        .sort((a, b) => (a.y + a.h) - (b.y + b.h));
      for (const object of floorObjects) {
        const visual = createModernProceduralObject(this, object, this.state);
        this.objectLayer.add(visual);
        this.nativeObjects.push(visual);
      }`,
'runtime procedural rebuild');
runtime = replaceOnce(runtime,
`        sprite.setVisible(visible);
        if (!visible) continue;
        sprite.setPosition(object.x + object.w / 2, object.y + object.h / 2);
        sprite.setDisplaySize(Math.max(18, object.w), Math.max(18, object.h));
        sprite.setDepth(object.y + object.h);
        sprite.setRotation(Number(object.renderAngle || 0));
        sprite.clearTint();
        sprite.setAlpha(object.kind === 'light' ? .5 : 1);`,
`        sprite.setVisible(visible);
        if (!visible) continue;
        if (isModernProceduralVisual(sprite)) {
          sprite.setPosition(object.x + object.w / 2, object.y + object.h / 2);
          sprite.setDepth(object.y + object.h);
          sprite.setRotation(0);
          sprite.setAlpha(1);
          refreshModernProceduralObject(sprite, this.state);
          continue;
        }
        sprite.setPosition(object.x + object.w / 2, object.y + object.h / 2);
        sprite.setDisplaySize(Math.max(18, object.w), Math.max(18, object.h));
        sprite.setDepth(object.y + object.h);
        sprite.setRotation(Number(object.renderAngle || 0));
        sprite.clearTint();
        sprite.setAlpha(object.kind === 'light' ? .5 : 1);`,
'runtime procedural refresh');
write('src/phaserMigration2Runtime.js', runtime);

let bridge = read('src/phaserMigration2GameplayParityBridge.js');
bridge = replaceOnce(bridge,
`  const roomPanels = (scene.roomLayer?.list || []).filter(child => String(child?.texture?.key || '').startsWith('pm2-room-'));
  roomPanels.forEach((panel, index) => {`,
`  const modernRooms = (scene.roomLayer?.list || []).filter(child => child?.pm2ModernProceduralRoom);
  if (modernRooms.length) {
    scene.__pm2ParityFloor = floorId;
    scene.__pm2ParityArchitecture?.clear?.();
    return;
  }

  const roomPanels = (scene.roomLayer?.list || []).filter(child => String(child?.texture?.key || '').startsWith('pm2-room-'));
  roomPanels.forEach((panel, index) => {`,
'bridge modern room bypass');
bridge = replaceOnce(bridge,
`    if (!object || !sprite.visible) continue;
    const rotation = objectVisualRotation(object);`,
`    if (!object || !sprite.visible) continue;
    if (sprite.pm2ModernProcedural) {
      sprite.setPosition(object.x + object.w / 2, object.y + object.h / 2);
      sprite.setRotation(0);
      sprite.setDepth(object.y + object.h);
      continue;
    }
    const rotation = objectVisualRotation(object);`,
'bridge modern object bypass');
write('src/phaserMigration2GameplayParityBridge.js', bridge);

let completion = read('src/phaserMigration2ReferenceCompletion.js');
completion = replaceOnce(completion,
`function placeActivitySprite(sprite, entity, object, activity) {
  const layout = activityLayout[activity] || { w: 76, h: 78, y: -4 };`,
`function placeActivitySprite(sprite, entity, object, activity) {
  let layout = activityLayout[activity] || { w: 76, h: 78, y: -4 };`,
'activity mutable layout');
completion = replaceOnce(completion,
`    if (['sleep','bath','shower','toilet','weights','treadmill','swim','vehicle','dog_wash','dog_kennel'].includes(activity)) {
      x = centerX;
      y = centerY + layout.y;
      depth = object.y + object.h + 12;
    } else if (['desk_work','arcade','cook','coffee','cleaning'].includes(activity)) {`,
`    if (activity === 'sleep') {
      const horizontal = object.w >= object.h;
      const headboard = String(object.headboard || (horizontal ? 'west' : 'north')).toLowerCase();
      layout = horizontal ? { w: 66, h: Math.min(150, object.w * .66), y: 0 } : { w: Math.min(84, object.w * .62), h: Math.min(150, object.h * .66), y: 0 };
      x = centerX;
      y = centerY;
      if (headboard === 'west') x = object.x + object.w * .43;
      if (headboard === 'east') x = object.x + object.w * .57;
      if (headboard === 'north') y = object.y + object.h * .43;
      if (headboard === 'south') y = object.y + object.h * .57;
      depth = object.y + object.h + 12;
    } else if (['bath','shower','toilet','weights','treadmill','swim','vehicle','dog_wash','dog_kennel'].includes(activity)) {
      x = centerX;
      y = centerY + layout.y;
      depth = object.y + object.h + 12;
    } else if (['desk_work','arcade','cook','coffee','cleaning'].includes(activity)) {`,
'sleep placement');
completion = replaceOnce(completion,
`    const facing = object.facing || object.headboard;
    if (facing === 'east') rotation = Math.PI / 2;
    else if (facing === 'west') rotation = -Math.PI / 2;
    else if (facing === 'up' || facing === 'north') rotation = Math.PI;`,
`    const facing = activity === 'sleep' ? (object.headboard || object.facing) : (object.facing || object.headboard);
    if (facing === 'east') rotation = Math.PI / 2;
    else if (facing === 'west') rotation = -Math.PI / 2;
    else if (facing === 'down' || facing === 'south') rotation = Math.PI;
    else if (facing === 'up' || facing === 'north') rotation = 0;`,
'sleep headboard rotation');
completion = replaceOnce(completion,
`    const object = sprite.pm2Object;
    if (!object) continue;
    const stateKey = stateKeyForObject(scene.state, object, activeByObject);`,
`    const object = sprite.pm2Object;
    if (!object) continue;
    if (sprite.pm2ModernProcedural) continue;
    const stateKey = stateKeyForObject(scene.state, object, activeByObject);`,
'completion procedural object bypass');
completion = replaceOnce(completion,
`  const graphics = system.architecture;
  const foreground = system.foreground;
  graphics.clear();
  foreground.clear();`,
`  const graphics = system.architecture;
  const foreground = system.foreground;
  graphics.clear();
  foreground.clear();
  if ((scene.roomLayer?.list || []).some(child => child?.pm2ModernProceduralRoom)) return;`,
'completion modern room bypass');
completion = replaceOnce(completion,
`    if (object.kind === 'swim_pool') {
      effects.lineStyle(2, 0xcdf8ff, .32);`,
`    if (activity === 'sleep' && object.kind === 'bed') drawSleepBlanket(effects, object);
    if (object.kind === 'swim_pool') {
      effects.lineStyle(2, 0xcdf8ff, .32);`,
'completion blanket hook');
completion = replaceOnce(completion,
`  lighting.fillStyle(0x06101a, .08);
  lighting.fillRect(0, 0, 960, 720);
}`,
`  lighting.fillStyle(0x06101a, .035);
  lighting.fillRect(0, 0, 960, 720);
}

function drawSleepBlanket(graphics, object) {
  const horizontal = object.w >= object.h;
  const headboard = String(object.headboard || (horizontal ? 'west' : 'north')).toLowerCase();
  graphics.fillStyle(0x557896, .96);
  graphics.lineStyle(2, 0x91afc2, .72);
  if (horizontal) {
    const west = headboard === 'west';
    const x = west ? object.x + object.w * .43 : object.x + object.w * .08;
    const width = object.w * .48;
    const y = object.y + object.h * .15;
    const height = object.h * .70;
    graphics.fillRoundedRect(x, y, width, height, 9);
    graphics.strokeRoundedRect(x, y, width, height, 9);
    graphics.lineBetween(west ? x + width * .30 : x + width * .70, y + 5, west ? x + width * .30 : x + width * .70, y + height - 5);
  } else {
    const north = headboard !== 'south';
    const x = object.x + object.w * .15;
    const width = object.w * .70;
    const y = north ? object.y + object.h * .43 : object.y + object.h * .08;
    const height = object.h * .48;
    graphics.fillRoundedRect(x, y, width, height, 9);
    graphics.strokeRoundedRect(x, y, width, height, 9);
  }
}`,
'completion sleep blanket function');
write('src/phaserMigration2ReferenceCompletion.js', completion);

let phone = read('src/phoneUI.js');
phone = replaceOnce(phone,
`  up.onclick = event => {
    event.stopPropagation();
    navigateView(state, upTarget(state.floor), floorName(upTarget(state.floor)), 'vertical-button');
    dirty = true;
  };`,
`  bindImmediateTap(up, event => {
    event.stopPropagation();
    navigateView(state, upTarget(state.floor), floorName(upTarget(state.floor)), 'vertical-button');
    dirty = true;
  });`,
'phone up immediate tap');
phone = replaceOnce(phone,
`  down.onclick = event => {
    event.stopPropagation();
    navigateView(state, downTarget(state.floor), floorName(downTarget(state.floor)), 'vertical-button');
    dirty = true;
  };`,
`  bindImmediateTap(down, event => {
    event.stopPropagation();
    navigateView(state, downTarget(state.floor), floorName(downTarget(state.floor)), 'vertical-button');
    dirty = true;
  });`,
'phone down immediate tap');
phone = replaceOnce(phone,
`  button.onclick = event => {
    event.stopPropagation();
    open = !open;
    dirty = true;
    fitPhonePanel();
    renderPhone(state);
  };`,
`  bindImmediateTap(button, event => {
    event.stopPropagation();
    open = !open;
    dirty = true;
    fitPhonePanel();
    renderPhone(state);
  });`,
'phone button immediate tap');
phone = replaceOnce(phone,
`function fitPhonePanel() {`,
`function bindImmediateTap(button, handler) {
  let pointerHandledAt = -Infinity;
  button.addEventListener('pointerup', event => {
    if (event.pointerType === 'mouse') return;
    pointerHandledAt = performance.now();
    event.preventDefault();
    handler(event);
  });
  button.addEventListener('click', event => {
    if (performance.now() - pointerHandledAt < 450) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    handler(event);
  });
}

function fitPhonePanel() {`,
'phone bind helper');
write('src/phoneUI.js', phone);

let camera = read('src/cameraNavigation.js');
camera = replaceOnce(camera,
`  if (floor === 0) {
    if (!horizontal && dy > 42) return { floor: 4, label: 'Backyard North' };`,
`  if (floor === 0) {
    if (Math.abs(dx) > 46 && Math.abs(dy) > 46 && dx > 0 && dy < 0) return { floor: 7, label: 'Driveway West' };
    if (!horizontal && dy > 42) return { floor: 4, label: 'Backyard North' };`,
'camera direct driveway diagonal');
camera = replaceOnce(camera,
`  if (floor === 7) {
    if (!horizontal && dy > 42) return { floor: 3, label: 'Garage West' };
    if (horizontal && dx < -42) return { floor: 6, label: 'Front Yard South' };`,
`  if (floor === 7) {
    if (Math.abs(dx) > 46 && Math.abs(dy) > 46 && dx < 0 && dy > 0) return { floor: 0, label: 'Main House' };
    if (!horizontal && dy > 42) return { floor: 3, label: 'Garage West' };
    if (horizontal && dx < -42) return { floor: 6, label: 'Front Yard South' };`,
'camera direct main diagonal');
camera = replaceOnce(camera,
`  selectedButton.onclick = event => { event.stopPropagation(); closePanel(); jumpToSelectedCharacter(getActiveState()); };`,
`  bindImmediateTap(selectedButton, event => { event.stopPropagation(); closePanel(); jumpToSelectedCharacter(getActiveState()); });`,
'camera selected immediate tap');
camera = replaceOnce(camera,
`  lab.onclick = event => { event.stopPropagation(); closePanel(); navigateView(getActiveState(), 5, 'Secret Lab East', 'secret-lab-button'); };`,
`  bindImmediateTap(lab, event => { event.stopPropagation(); closePanel(); navigateView(getActiveState(), 5, 'Secret Lab East', 'secret-lab-button'); });`,
'camera lab immediate tap');
camera = replaceOnce(camera,
`  blueprint.onclick = event => { event.stopPropagation(); togglePanel('blueprint'); };`,
`  bindImmediateTap(blueprint, event => { event.stopPropagation(); togglePanel('blueprint'); });`,
'camera blueprint immediate tap');
camera = replaceOnce(camera,
`  locator.onclick = event => { event.stopPropagation(); togglePanel('locator'); };`,
`  bindImmediateTap(locator, event => { event.stopPropagation(); togglePanel('locator'); });`,
'camera locator immediate tap');
camera = replaceOnce(camera,
`function getActiveState() {`,
`function bindImmediateTap(button, handler) {
  let pointerHandledAt = -Infinity;
  button.addEventListener('pointerup', event => {
    if (event.pointerType === 'mouse') return;
    pointerHandledAt = performance.now();
    event.preventDefault();
    handler(event);
  });
  button.addEventListener('click', event => {
    if (performance.now() - pointerHandledAt < 450) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    handler(event);
  });
}

function getActiveState() {`,
'camera bind helper');
write('src/cameraNavigation.js', camera);

let main = read('src/main.js');
main = main.replace("./phaserMigration2Runtime.js?v=20260719-p2-visual-completion", "./phaserMigration2Runtime.js?v=20260721-p2-modern-procedural-reconstruction");
main = main.replace("./phaserMigration2GameplayParityBridge.js?v=20260719-p2-mobile-gameplay-parity", "./phaserMigration2GameplayParityBridge.js?v=20260721-p2-modern-procedural-reconstruction");
main = main.replace("./phaserMigration2BackdropSafety.js?v=20260721-p2-nonblack-backdrop", "./phaserMigration2BackdropSafety.js?v=20260721-p2-modern-procedural-reconstruction");
write('src/main.js', main);

let styles = read('styles.css');
if (!styles.includes('/* P2 modern procedural mobile reconstruction */')) {
  styles += `
/* P2 modern procedural mobile reconstruction */
@media(max-width:760px){
  #game-control-bar{display:grid;grid-template-columns:repeat(5,minmax(52px,1fr));gap:8px;overflow:visible;touch-action:manipulation;padding:8px 10px}
  .control-bar-group{display:contents}
  .control-bar-button,.camera-float-button,.phone-float-button{width:100%;min-width:0;height:54px;padding:0;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
  .icon-control-button{width:100%}
  .vertical-screen-button{touch-action:manipulation;-webkit-tap-highlight-color:transparent}
}
`;
}
write('styles.css', styles);
