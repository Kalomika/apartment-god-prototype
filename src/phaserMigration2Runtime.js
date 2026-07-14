import { CANVAS_H, CANVAS_W, PLAY_H, PLAY_W } from './config.js';
import { createState, selected } from './state.js';
import { floors, getObject, objects } from './world.js';
import { createUi } from './ui.js';
import { updateMovement } from './movement.js';
import { resolveArrival, updateActions } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { updateAutonomy } from './autonomy.js';
import { updateCalendarRuntime } from './calendarRuntime.js';
import { updateLifeQualitySystem } from './lifeQualitySystem.js';
import { installCameraSwipeNavigation, updateCameraTransition } from './cameraNavigation.js';
import { loadRefreshState, saveRefreshState, updateRefreshAutosave } from './saveSystem.js';
import { applyRuntimeRegressionGuards } from './runtimeRegressionGuards.js';
import { updatePoolActivity } from './poolActivitySystem.js';
import { updateHouseTidiness } from './tidinessSystem.js';
import { formatTime } from './renderHelpers.js';

const REFRESH_SAVE_KEY = 'apartment_god_test_refresh_state_v3';
const ASSET_ROOT = 'assets/phaser-migration-2/sprites';

const TEXTURES = {
  room: `${ASSET_ROOT}/environment/room_panel.svg`,
  resident: `${ASSET_ROOT}/characters/resident_topdown.svg`,
  girlfriend: `${ASSET_ROOT}/characters/girlfriend_topdown.svg`,
  dog: `${ASSET_ROOT}/characters/dog_topdown.svg`,
  generic: `${ASSET_ROOT}/objects/generic_object.svg`,
  furniture: `${ASSET_ROOT}/objects/furniture_set.svg`,
  bed: `${ASSET_ROOT}/objects/bed.svg`,
  tv: `${ASSET_ROOT}/objects/tv.svg`,
  bathroom: `${ASSET_ROOT}/objects/bathroom_fixture.svg`,
  kitchen: `${ASSET_ROOT}/objects/kitchen_fixture.svg`,
  stairs: `${ASSET_ROOT}/objects/stairs.svg`
};

export async function bootPhaserMigration2Game() {
  const canvas = document.getElementById('game');
  if (!canvas) return null;
  try {
    const phaserModule = await import('/vendor/phaser.esm.js');
    const Phaser = phaserModule.default || phaserModule;
    const SceneClass = createApartmentGodNativeScene(Phaser);
    return new Phaser.Game({
      type: Phaser.CANVAS,
      canvas,
      width: CANVAS_W,
      height: CANVAS_H,
      backgroundColor: '#101722',
      render: { antialias: true, pixelArt: false, transparent: false, clearBeforeRender: true },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: CANVAS_W, height: CANVAS_H },
      scene: [SceneClass]
    });
  } catch (error) {
    drawHardBootError(canvas, error);
    console.error('[Apartment God] Phaser Migration 2 failed before scene creation.', error);
    return null;
  }
}

function createApartmentGodNativeScene(Phaser) {
  return class ApartmentGodNativeScene extends Phaser.Scene {
    constructor() {
      super('ApartmentGodNativeScene');
      this.currentFloor = null;
      this.frameErrorCount = 0;
      this.lastHiddenTick = 0;
      this.hiddenTicker = null;
      this.nativeObjects = [];
      this.nativeActors = [];
    }

    preload() {
      this.loadText = this.add.text(28, 28, 'Apartment God Phaser Migration 2 loading...', {
        fontFamily: 'system-ui', fontSize: 20, fontStyle: '900', color: '#f1c66a'
      }).setDepth(10000);
      for (const [key, url] of Object.entries(TEXTURES)) {
        this.load.svg(`pm2-${key}`, url, { width: 128, height: 128 });
      }
      this.load.on('loaderror', file => {
        console.error('[Apartment God] Phaser Migration 2 asset failed:', file?.key, file?.src);
      });
    }

    create() {
      try {
        this.state = createState();
        loadRefreshStateSafely(this.state);
        sanitizeRuntimeState(this.state);
        applyRuntimeRegressionGuards(this.state);

        this.roomLayer = this.add.container(0, 0).setDepth(0);
        this.objectLayer = this.add.container(0, 0).setDepth(20);
        this.actorLayer = this.add.container(0, 0).setDepth(60);
        this.fxLayer = this.add.container(0, 0).setDepth(90);
        this.statusText = this.add.text(12, 12, '', {
          fontFamily: 'system-ui', fontSize: 14, fontStyle: '900', color: '#f8fbff', backgroundColor: 'rgba(7,10,16,.55)', padding: { x: 8, y: 5 }
        }).setDepth(1000);
        this.runtimeText = this.add.text(12, PLAY_H - 25, 'PHASER MIGRATION 2 | native scene | asset-backed bridge', {
          fontFamily: 'system-ui', fontSize: 11, fontStyle: '900', color: '#f1c66a', backgroundColor: 'rgba(7,10,16,.45)', padding: { x: 7, y: 3 }
        }).setDepth(1000);

        installCameraSwipeNavigation(this.state, this.game.canvas);
        this.ui = createUi(this.state, this.game.canvas, { externalInput: true });
        this.input.on('pointerdown', pointer => {
          if (!this.ui?.handleCanvasPoint) return;
          this.ui.handleCanvasPoint(pointer.x, pointer.y, pointer.x, pointer.y);
        });
        window.addEventListener('beforeunload', () => saveRefreshState(this.state));
        document.addEventListener('visibilitychange', () => {
          this.state.backgroundMode = document.hidden;
          if (!document.hidden) this.state.saveStatus = { message: 'Returned from background' };
        });
        this.lastHiddenTick = performance.now();
        this.hiddenTicker = window.setInterval(() => this.hiddenTick(), 1000);
        window.addEventListener('beforeunload', () => window.clearInterval(this.hiddenTicker));
        this.registry.set('apartmentGodRuntime', 'phaser-migration-2-native-asset-bridge');
        this.loadText?.destroy();
        this.renderNativeFrame();
        this.ui.renderHud();
      } catch (error) {
        this.recoverFrame(error, true);
      }
    }

    update(_time, deltaMs) {
      if (!this.state) return;
      try {
        sanitizeRuntimeState(this.state);
        applyRuntimeRegressionGuards(this.state);
        const rawDt = Math.min(document.hidden ? 4.0 : 0.2, Math.max(0, deltaMs / 1000));
        const cameraDt = Math.min(0.05, Math.max(0, deltaMs / 1000));
        updateCameraTransition(this.state, cameraDt);
        if (!document.hidden) advanceSimulation(this.state, rawDt);
        updateRefreshAutosave(this.state, cameraDt);
        if (this.state.skipRecap?.visibleT > 0) this.state.skipRecap.visibleT -= cameraDt;
        this.renderNativeFrame();
        this.ui?.renderHud();
      } catch (error) {
        this.recoverFrame(error, false);
      }
    }

    hiddenTick() {
      if (!this.state || !document.hidden || this.state.paused) return;
      const now = performance.now();
      const elapsed = Math.min(4.0, Math.max(0, (now - this.lastHiddenTick) / 1000));
      this.lastHiddenTick = now;
      try {
        sanitizeRuntimeState(this.state);
        applyRuntimeRegressionGuards(this.state);
        advanceSimulation(this.state, elapsed);
        updateRefreshAutosave(this.state, Math.min(1, elapsed));
      } catch (error) {
        console.error('[Apartment God] Phaser Migration 2 background tick recovered.', error);
      }
    }

    renderNativeFrame() {
      if (this.currentFloor !== this.state.floor) this.rebuildFloor();
      this.refreshObjectStates();
      this.rebuildActors();
      const actor = selected(this.state);
      const tidy = Number.isFinite(this.state.tidiness?.score) ? ` tidy ${Math.round(this.state.tidiness.score)}%` : '';
      this.statusText.setText(`${formatTime(this.state.time)}   $${Math.round(this.state.money ?? 0)}   ${this.state.autonomyMode}${tidy}   ${floors[this.state.floor]?.name || this.state.floor}   ${actor?.name || ''}: ${actor?.action || 'Idle'}`);
      this.statusText.setVisible(true);
      this.runtimeText.setVisible(true);
    }

    rebuildFloor() {
      this.currentFloor = this.state.floor;
      this.roomLayer.removeAll(true);
      this.objectLayer.removeAll(true);
      this.nativeObjects = [];
      const floor = floors[this.state.floor];
      if (!floor) return;
      for (const room of floor.rooms || []) {
        const panel = this.add.image(room.x + room.w / 2, room.y + room.h / 2, 'pm2-room');
        panel.setDisplaySize(room.w, room.h);
        panel.setAlpha(room.id.includes('bath') ? .92 : room.id.includes('garage') ? .82 : .88);
        this.roomLayer.add(panel);
        const label = this.add.text(room.x + 10, room.y + 8, room.name, {
          fontFamily: 'system-ui', fontSize: 10, fontStyle: '900', color: '#d9e7f2', backgroundColor: 'rgba(7,10,16,.34)', padding: { x: 4, y: 2 }
        });
        label.setAlpha(.62);
        this.roomLayer.add(label);
      }
      const floorObjects = objects.filter(obj => obj.floor === this.state.floor);
      for (const obj of floorObjects) {
        const texture = textureForObject(obj);
        const sprite = this.add.image(obj.x + obj.w / 2, obj.y + obj.h / 2, texture);
        sprite.setDisplaySize(Math.max(18, obj.w), Math.max(18, obj.h));
        sprite.setDepth(obj.y + obj.h);
        sprite.setAlpha(obj.kind === 'light' ? .5 : 1);
        sprite.pm2Object = obj;
        this.objectLayer.add(sprite);
        this.nativeObjects.push(sprite);
      }
    }

    refreshObjectStates() {
      for (const sprite of this.nativeObjects) {
        const obj = sprite.pm2Object;
        if (!obj) continue;
        sprite.clearTint();
        sprite.setAlpha(obj.kind === 'light' ? .5 : 1);
        if (obj.kind === 'tv') {
          if (this.state.tv?.on) sprite.setTint(0x74e6ff);
          else sprite.setTint(0x5d6876);
        }
        if (obj.kind === 'shower') {
          const active = this.state.entities?.some(e => e.showerObjectId === obj.id && e.actionT > 0);
          if (active) sprite.setTint(0x9feaff);
        }
        if (obj.kind === 'toilet') {
          const active = this.state.entities?.some(e => e.toiletObjectId === obj.id && e.actionT > 0);
          if (active) sprite.setTint(0xf1c66a);
        }
      }
    }

    rebuildActors() {
      this.actorLayer.removeAll(true);
      this.nativeActors = [];
      for (const entity of this.state.entities || []) {
        if (entity.hidden || entity.floor !== this.state.floor) continue;
        const texture = entity.type === 'dog' ? 'pm2-dog' : entity.id === 'girlfriend' ? 'pm2-girlfriend' : 'pm2-resident';
        const pos = actorRenderPoint(entity);
        const sprite = this.add.image(pos.x, pos.y, texture);
        const scale = entity.type === 'dog' ? .72 : .76;
        sprite.setScale(scale);
        sprite.setDepth(pos.y + 80);
        if (entity.type === 'dog') sprite.setRotation(directionAngle(entity));
        if (this.state.selectedId === entity.id) {
          const ring = this.add.ellipse(pos.x, pos.y + 12, entity.type === 'dog' ? 54 : 48, entity.type === 'dog' ? 30 : 32, 0xf1c66a, .0);
          ring.setStrokeStyle(3, 0xf1c66a, .92);
          ring.setDepth(pos.y + 79);
          this.actorLayer.add(ring);
        }
        this.actorLayer.add(sprite);
        if (entity.actionT > 0 || entity.bubbleT > 0) {
          const text = this.add.text(pos.x, pos.y - 58, entity.bubbleT > 0 ? entity.bubble : String(entity.action || '').slice(0, 24), {
            fontFamily: 'system-ui', fontSize: 10, fontStyle: '900', color: '#071018', backgroundColor: '#f8fbff', padding: { x: 5, y: 3 }
          }).setOrigin(.5, .5).setDepth(pos.y + 120);
          this.actorLayer.add(text);
        }
      }
    }

    recoverFrame(error, boot = false) {
      this.frameErrorCount += 1;
      console.error('[Apartment God] Phaser Migration 2 recovered instead of blanking.', error);
      clearBadRefreshState();
      if (this.state) {
        sanitizeRuntimeState(this.state);
        for (const entity of this.state.entities || []) {
          entity.path = [];
          entity.target = null;
          entity.pending = null;
          entity.pose = 'stand';
          entity.blockedT = 0;
          entity.recoveryCount = 0;
        }
        this.state.saveStatus = { message: 'Phaser Migration 2 runtime error handled' };
        this.state.paused = this.frameErrorCount > 2;
      }
      this.children.removeAll(true);
      this.add.rectangle(0, 0, CANVAS_W, CANVAS_H, 0x171a22).setOrigin(0, 0);
      this.add.text(32, 64, boot ? 'Phaser Migration 2 boot recovery screen' : 'Phaser Migration 2 frame recovery screen', {
        fontFamily: 'system-ui', fontSize: 28, fontStyle: '900', color: '#f1c66a'
      });
      this.add.text(32, 108, 'The branch did not blank. Check console and refresh once.', {
        fontFamily: 'system-ui', fontSize: 18, fontStyle: '700', color: '#f0f2f7'
      });
      this.add.text(32, 144, String(error?.message || error || 'Unknown error').slice(0, 140), {
        fontFamily: 'system-ui', fontSize: 14, color: '#aab2c5'
      });
    }
  };
}

function textureForObject(obj) {
  if (obj.kind === 'bed') return 'pm2-bed';
  if (obj.kind === 'tv') return 'pm2-tv';
  if (['toilet', 'shower', 'bathtub', 'sink', 'dog_bath'].includes(obj.kind)) return 'pm2-bathroom';
  if (['fridge', 'stove', 'coffee_maker', 'trash_can', 'outdoor_trash'].includes(obj.kind)) return 'pm2-kitchen';
  if (['stairs', 'door'].includes(obj.kind)) return 'pm2-stairs';
  if (['couch', 'dining_table', 'desk', 'bookshelf', 'pool_table', 'arcade_machine', 'game_console', 'dartboard', 'weight_bench', 'heavy_bag', 'treadmill', 'closet'].includes(obj.kind)) return 'pm2-furniture';
  return 'pm2-generic';
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

function directionAngle(entity) {
  const target = Array.isArray(entity.path) && entity.path.length > 0 ? entity.path[0] : entity.target;
  const dx = Number.isFinite(entity.vx) && Math.abs(entity.vx) > .01 ? entity.vx : target ? target.x - entity.x : 1;
  const dy = Number.isFinite(entity.vy) && Math.abs(entity.vy) > .01 ? entity.vy : target ? target.y - entity.y : 0;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? Math.PI : 0;
  return dy < 0 ? -Math.PI / 2 : Math.PI / 2;
}

function loadRefreshStateSafely(state) {
  try { return loadRefreshState(state); }
  catch (error) {
    console.error('[Apartment God] Bad refresh state skipped for Phaser Migration 2.', error);
    clearBadRefreshState();
    state.saveStatus = { message: 'Skipped bad refresh state' };
    return false;
  }
}

function clearBadRefreshState() { try { localStorage.removeItem(REFRESH_SAVE_KEY); } catch (_) {} }

function sanitizeRuntimeState(state) {
  state.entities = Array.isArray(state.entities) ? state.entities : [];
  state.speed = Number.isFinite(state.speed) && state.speed > 0 ? state.speed : 1;
  state.time = Number.isFinite(state.time) ? state.time : 0;
  state.floor = Number.isInteger(state.floor) ? state.floor : 0;
  state.objectState ??= {};
  state.roomLights ??= {};
  state.tidiness ??= { rooms: {}, score: 100, activityMultiplier: 1.2 };
  state.tidiness.rooms ??= {};
  state.notifications = Array.isArray(state.notifications) ? state.notifications : [];
  state.lifeControl ??= { mode: 'semi_auto', pendingChoices: [] };
  state.lifeQuality ??= { lastMonthIndex: null, lastYearIndex: null, reviews: [], yearReviews: [] };
  for (const entity of state.entities) {
    entity.path = Array.isArray(entity.path) ? entity.path : [];
    entity.needs ??= {};
    entity.skills ??= {};
    entity.pose ||= 'stand';
    entity.action ||= 'Idle';
    entity.floor = Number.isInteger(entity.floor) ? entity.floor : 0;
    entity.x = Number.isFinite(entity.x) ? entity.x : 120;
    entity.y = Number.isFinite(entity.y) ? entity.y : 120;
    cleanupStaleActorState(entity);
  }
  updateHouseTidiness(state);
}

function cleanupStaleActorState(entity) {
  const hasPath = Array.isArray(entity.path) && entity.path.length > 0;
  const hasTarget = Boolean(entity.target || entity.pending);
  const hasTimer = Number(entity.actionT || 0) > 0;
  if (hasPath || hasTarget || hasTimer || entity.hidden) return;
  const action = String(entity.action || '').toLowerCase();
  if (action === 'recovered' || action === 'runtime recovered' || action === 'walking' || action === 'running' || action.startsWith('going to ')) {
    entity.action = 'Idle';
    entity.pose = 'stand';
    entity.blockedT = 0;
    entity.recoveryCount = 0;
  }
}

function runSimulationStep(state, dt) {
  if (dt <= 0) return;
  updateHouseTidiness(state);
  updatePoolActivity(state, dt);
  for (const entity of state.entities) {
    const arrived = updateMovement(state, entity, dt);
    if (arrived) resolveArrival(state, entity);
  }
  updateActions(state, dt);
  updateCalendarRuntime(state);
  updateAutoHooks(state, dt);
  updateAutonomy(state, dt);
  state.time += dt * 0.6;
  updateLifeQualitySystem(state);
  updateHouseTidiness(state);
}

function advanceSimulation(state, rawDt) {
  if (state.paused) return;
  const maxStep = document.hidden ? 0.2 : 0.05;
  const maxCatchup = document.hidden ? 4.0 : 0.2;
  let remaining = Math.min(rawDt * state.speed, maxCatchup);
  let guard = 0;
  while (remaining > 0.0001 && guard < 80) {
    const step = Math.min(maxStep, remaining);
    runSimulationStep(state, step);
    remaining -= step;
    guard += 1;
  }
}

function drawHardBootError(canvas, error) {
  try {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#171a22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f1c66a';
    ctx.font = '900 28px system-ui';
    ctx.fillText('Apartment God Phaser Migration 2 could not start', 32, 70);
    ctx.fillStyle = '#f0f2f7';
    ctx.font = '700 18px system-ui';
    ctx.fillText('This is a visible error screen, not a blank canvas.', 32, 106);
    ctx.fillStyle = '#aab2c5';
    ctx.font = '600 14px system-ui';
    ctx.fillText(String(error?.message || error || 'Unknown error').slice(0, 140), 32, 142);
  } catch (_) {}
}
