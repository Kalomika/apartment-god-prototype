import { getObject, objectAt } from './world.js';

const DOUBLE_TAP_MS = 340;

export function installPhaserParityCorrections(game) {
  if (!game) return;
  const timer = window.setInterval(() => {
    const scene = game.scene?.getScene?.('ApartmentGodParityScene');
    if (!scene?.state || !scene.apartmentGodActorVisuals) return;
    window.clearInterval(timer);
    attachSceneCorrections(scene);
  }, 40);
  window.setTimeout(() => window.clearInterval(timer), 12000);
}

function attachSceneCorrections(scene) {
  if (scene.__apartmentGodParityCorrectionsInstalled) return;
  scene.__apartmentGodParityCorrectionsInstalled = true;
  scene.__apartmentGodProgressVisuals = new Map();
  scene.__apartmentGodLastArcadeTap = { id: null, time: 0 };

  scene.events.on('postupdate', () => {
    syncActorParity(scene);
    syncActionProgress(scene);
  });
  scene.input.on('pointerdown', pointer => handleParityPointerDown(scene, pointer));
  scene.input.on('pointerup', () => releaseArcadeControls(scene));
  scene.input.on('pointerupoutside', () => releaseArcadeControls(scene));
  scene.events.once('shutdown', () => destroyParityVisuals(scene));
}

function syncActorParity(scene) {
  const state = scene.state;
  for (const entity of state.entities || []) {
    const record = scene.apartmentGodActorVisuals.get(entity.id);
    if (!record || entity.hidden || entity.floor !== state.floor) continue;
    const key = activityKey(entity);
    if (isSleeping(key) && entity.type === 'person') syncBedSleep(record, entity);
    else if (key.includes('make_bed') || key.includes('make bed')) syncBedMaking(record, entity, scene.time.now);
  }
}

function syncBedSleep(record, entity) {
  const bed = getObject(entity.sleepObjectId || 'bed');
  if (!bed || bed.floor !== entity.floor) return;
  const lane = entity.id === 'girlfriend' ? .64 : .38;
  const horizontal = bed.w >= bed.h;
  const point = horizontal
    ? { x: bed.x + bed.w * .48, y: bed.y + bed.h * lane }
    : { x: bed.x + bed.w * lane, y: bed.y + bed.h * .50 };
  const headboard = bed.headboard || (bed.facing === 'east' ? 'west' : bed.facing === 'west' ? 'east' : bed.facing === 'south' ? 'north' : 'south');
  const rotation = headboard === 'west' ? -Math.PI / 2 : headboard === 'east' ? Math.PI / 2 : headboard === 'south' ? Math.PI : 0;
  record.sprite.stop();
  record.sprite.setFrame('south-1');
  record.sprite.setPosition(point.x, point.y);
  record.sprite.setRotation(rotation);
  record.sprite.setScale((record.profile === 'girlfriend' ? .78 : .78) * 1.02, .78 * .90);
  record.shadow.setAlpha(0);
  record.ring.setPosition(point.x, point.y + 8);
  record.label.setPosition(point.x, point.y - 46);
}

function syncBedMaking(record, entity, now) {
  const bed = getObject(entity.pending?.objectId || entity.target?.objectId || 'bed');
  if (!bed || bed.floor !== entity.floor) return;
  const tick = Math.floor(now / 125) % 4;
  record.sprite.stop();
  record.sprite.setFrame(`south-${tick < 2 ? 0 : 2}`);
  record.sprite.setRotation(-Math.PI / 2);
  record.sprite.setPosition(bed.x + bed.w * .78, bed.y + bed.h * .54 + Math.sin(now / 160) * 2);
}

function syncActionProgress(scene) {
  const state = scene.state;
  const activeIds = new Set();
  for (const entity of state.entities || []) {
    if (!entity || entity.hidden || entity.floor !== state.floor) continue;
    const total = Number(entity.actionTotal || 0);
    const remaining = Number(entity.actionT || 0);
    if (!(total > 0 && remaining > 0)) continue;
    const record = scene.apartmentGodActorVisuals.get(entity.id);
    if (!record) continue;
    activeIds.add(entity.id);
    let visual = scene.__apartmentGodProgressVisuals.get(entity.id);
    if (!visual) {
      const graphics = scene.add.graphics();
      const text = scene.add.text(0, 0, '', { fontFamily: 'system-ui', fontSize: 9, fontStyle: '900', color: '#f8fbff' }).setOrigin(.5, 1);
      scene.actorLayer.add([graphics, text]);
      visual = { graphics, text };
      scene.__apartmentGodProgressVisuals.set(entity.id, visual);
    }
    const progress = Math.max(0, Math.min(1, 1 - remaining / total));
    const x = record.sprite.x;
    const y = record.sprite.y - (entity.type === 'dog' ? 46 : 60);
    visual.graphics.clear();
    visual.graphics.fillStyle(0x071018, .88);
    visual.graphics.fillRoundedRect(x - 35, y, 70, 9, 5);
    visual.graphics.fillStyle(0xf1c66a, 1);
    visual.graphics.fillRoundedRect(x - 33, y + 2, Math.max(2, 66 * progress), 5, 3);
    visual.graphics.lineStyle(1, 0xffffff, .28);
    visual.graphics.strokeRoundedRect(x - 35, y, 70, 9, 5);
    visual.graphics.setDepth(record.sprite.depth + 5);
    visual.text.setText(`${Math.round(progress * 100)}%`);
    visual.text.setPosition(x, y - 2);
    visual.text.setDepth(record.sprite.depth + 6);
    visual.graphics.setVisible(true);
    visual.text.setVisible(true);
  }
  for (const [id, visual] of scene.__apartmentGodProgressVisuals.entries()) {
    if (activeIds.has(id)) continue;
    visual.graphics.destroy();
    visual.text.destroy();
    scene.__apartmentGodProgressVisuals.delete(id);
  }
}

function handleParityPointerDown(scene, pointer) {
  const state = scene.state;
  const game = state.arcadeGame;
  if (game?.expanded) {
    state.suppressNextCanvasClick = true;
    handleExpandedArcadePointer(game, pointer);
    closeInteractionMenu();
    return;
  }
  const obj = objectAt(pointer.x, pointer.y, state.floor);
  if (!obj || obj.kind !== 'arcade' || !game || game.machineId !== obj.id) return;
  const now = performance.now();
  const last = scene.__apartmentGodLastArcadeTap;
  const doubleTap = last.id === obj.id && now - last.time <= DOUBLE_TAP_MS;
  scene.__apartmentGodLastArcadeTap = { id: obj.id, time: now };
  if (!doubleTap) return;
  game.expanded = true;
  game.playerControl = true;
  state.suppressNextCanvasClick = true;
  closeInteractionMenu();
}

function handleExpandedArcadePointer(game, pointer) {
  if (pointer.x >= 844 && pointer.y <= 92) {
    game.expanded = false;
    game.playerControl = false;
    game.inputX = 0;
    game.inputY = 0;
    game.buttons = [false, false, false];
    return;
  }
  if (pointer.x < 480 && pointer.y > 470) {
    const dx = pointer.x - 210;
    const dy = pointer.y - 590;
    const magnitude = Math.max(60, Math.hypot(dx, dy));
    game.inputX = Math.max(-1, Math.min(1, dx / magnitude));
    game.inputY = Math.max(-1, Math.min(1, dy / magnitude));
    game.playerControl = true;
    return;
  }
  if (pointer.x >= 650 && pointer.y > 470) {
    const index = pointer.x > 820 ? 1 : 0;
    game.buttons[index] = true;
    game.playerControl = true;
  }
}

function releaseArcadeControls(scene) {
  const game = scene.state?.arcadeGame;
  if (!game?.expanded) return;
  game.inputX = 0;
  game.inputY = 0;
  game.buttons = [false, false, false];
}

function closeInteractionMenu() {
  const menu = document.getElementById('interaction-menu');
  if (!menu) return;
  menu.classList.add('hidden');
  menu.innerHTML = '';
}

function destroyParityVisuals(scene) {
  for (const visual of scene.__apartmentGodProgressVisuals?.values?.() || []) {
    visual.graphics?.destroy?.();
    visual.text?.destroy?.();
  }
  scene.__apartmentGodProgressVisuals?.clear?.();
}

function activityKey(entity) {
  return `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
}

function isSleeping(key) {
  return key.includes('sleep') || key.includes('nap') || key.includes('bed together') || key.includes('bed_together') || key.includes('waking');
}
