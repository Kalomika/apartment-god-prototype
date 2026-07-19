import { PLAY_H, PLAY_W } from './config.js';
import { createState, selected } from './state.js';
import { floors, objects } from './world.js';
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
import { advanceGameClock } from './timeSystem.js';
import { installFrontYardWorld, updateFrontYardEnvironment } from './frontYardDriveway.js';
import { applyRuntimeObjectCorrections } from './runtimeObjectCorrections.js';
import { applyMainFloorLayoutPolish } from './mainFloorLayoutPolish.js';
import { updateArcadeSystem } from './arcadeSystem.js';
import { updateBasketballSystem } from './basketballSystem.js';
import { updateOffsiteHomeView } from './offsiteOverlay.js';
import { captureGateTraversalState, enforceGateTraversal, requestGateForApproachingEntities } from './gateTraversalGuard.js';
import {
  CHARACTER_ANIMATION_FPS,
  clearCharacterVisuals,
  registerCharacterAnimations,
  syncCharacterVisuals
} from './phaserCharacterAnimationSystem.js';
import {
  createNativeGameplayVisuals,
  destroyNativeGameplayVisuals,
  syncNativeGameplayVisuals
} from './phaserMigration2GameplayVisuals.js';
import {
  PM2_CHARACTER_SHEETS,
  PM2_OBJECT_TEXTURES,
  PM2_ROOM_TEXTURES,
  textureForObject,
  textureForRoom
} from './phaserMigration2VisualCatalog.js';
import {
  preloadReferenceCompletion,
  createReferenceCompletion,
  syncReferenceCompletion,
  destroyReferenceCompletion
} from './phaserMigration2ReferenceCompletion.js';

installFrontYardWorld();
applyMainFloorLayoutPolish();
applyRuntimeObjectCorrections();

const REFRESH_SAVE_KEY = 'apartment_god_test_refresh_state_v3';

export async function bootPhaserMigration2Game() {
  const canvas = document.getElementById('game');
  if (!canvas) return null;
  try {
    const phaserModule = await import('../vendor/phaser.esm.js').catch(() => import('https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.esm.js'));
    const Phaser = phaserModule.default || phaserModule;
    const SceneClass = createApartmentGodNativeScene(Phaser);
    return new Phaser.Game({
      type: Phaser.CANVAS,
      canvas,
      width: PLAY_W,
      height: PLAY_H,
      backgroundColor: '#101722',
      render: { antialias: true, pixelArt: false, transparent: false, clearBeforeRender: true },
      scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.NO_CENTER, width: PLAY_W, height: PLAY_H },
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
      this.floorSignature = '';
      this.frameErrorCount = 0;
      this.runtimeFailed = false;
      this.lastHiddenTick = 0;
      this.hiddenTicker = null;
      this.nativeObjects = [];
      this.pm2ActorVisuals = new Map();
      this.assetFailures = [];
      this.nativeGameplayVisuals = null;
      this.beforeUnloadHandler = null;
      this.visibilityHandler = null;
      this.pointerHandler = null;
    }

    preload() {
      preloadReferenceCompletion(this);
      this.loadText = this.add.text(28, 28, 'Apartment God Phaser Migration 2 loading full gameplay...', {
        fontFamily: 'system-ui', fontSize: 20, fontStyle: '900', color: '#f1c66a'
      }).setDepth(10000);

      for (const [key, url] of Object.entries(PM2_ROOM_TEXTURES)) this.load.svg(`pm2-room-${key}`, url, { width: 128, height: 128 });
      for (const [key, url] of Object.entries(PM2_OBJECT_TEXTURES)) this.load.svg(`pm2-object-${key}`, url, { width: 128, height: 128 });
      for (const [key, url] of Object.entries(PM2_CHARACTER_SHEETS)) this.load.svg(`pm2-${key}`, url, { width: 512, height: 512 });
      this.load.on('loaderror', file => {
        const key = file?.key || file?.src || 'unknown asset';
        if (!this.assetFailures.includes(key)) this.assetFailures.push(key);
        console.warn('[Apartment God] Phaser Migration 2 visual asset failed safely:', file?.key, file?.src);
      });
    }

    create() {
      try {
        this.state = createState();
        this.state.runtimeRenderer = 'phaser-migration-2-native-full-gameplay';
        this.state.assetFailures = [...this.assetFailures];
        loadRefreshStateSafely(this.state);
        sanitizeRuntimeState(this.state);
        applyRuntimeRegressionGuards(this.state);

        this.roomLayer = this.add.container(0, 0).setDepth(0);
        this.objectLayer = this.add.container(0, 0).setDepth(20);
        this.actorLayer = this.add.container(0, 0).setDepth(60);
        this.fxLayer = this.add.container(0, 0).setDepth(90);
        this.poolGraphics = this.add.graphics();
        this.fxLayer.add(this.poolGraphics);
        this.nativeGameplayVisuals = createNativeGameplayVisuals(this, this.fxLayer);
        createReferenceCompletion(this);
        registerCharacterAnimations(this);

        this.statusText = this.add.text(12, 12, '', {
          fontFamily: 'system-ui', fontSize: 14, fontStyle: '900', color: '#f8fbff', backgroundColor: 'rgba(7,10,16,.55)', padding: { x: 8, y: 5 }
        }).setDepth(1000);
        this.runtimeText = this.add.text(12, PLAY_H - 25, runtimeLabel(this.assetFailures), {
          fontFamily: 'system-ui', fontSize: 11, fontStyle: '900', color: '#f1c66a', backgroundColor: 'rgba(7,10,16,.45)', padding: { x: 7, y: 3 }
        }).setDepth(1000);

        installCameraSwipeNavigation(this.state, this.game.canvas);
        this.ui = createUi(this.state, this.game.canvas, { externalInput: true });
        this.pointerHandler = pointer => this.handleGamePointer(pointer);
        this.input.on('pointerdown', this.pointerHandler);

        this.beforeUnloadHandler = () => {
          if (!this.runtimeFailed && this.state) saveRefreshState(this.state);
        };
        this.visibilityHandler = () => {
          if (!this.state || this.runtimeFailed) return;
          this.state.backgroundMode = document.hidden;
          if (!document.hidden) this.state.saveStatus = { message: 'Returned from background' };
        };
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
        document.addEventListener('visibilitychange', this.visibilityHandler);

        this.lastHiddenTick = performance.now();
        this.hiddenTicker = window.setInterval(() => this.hiddenTick(), 1000);
        this.events.once('shutdown', () => this.shutdownRuntime());
        this.events.once('destroy', () => this.shutdownRuntime());

        this.registry.set('apartmentGodRuntime', 'phaser-migration-2-native-full-main-gameplay');
        this.registry.set('apartmentGodCharacterFps', CHARACTER_ANIMATION_FPS);
        this.registry.set('apartmentGodAssetFallbackCount', this.assetFailures.length);
        if (this.assetFailures.length) this.state.saveStatus = { message: `${this.assetFailures.length} visual asset fallback(s) active` };
        this.loadText?.destroy();
        this.renderNativeFrame();
        this.ui?.renderHud();
      } catch (error) {
        this.recoverFrame(error, true);
      }
    }

    update(_time, deltaMs) {
      if (this.runtimeFailed || !this.state) return;
      try {
        sanitizeRuntimeState(this.state);
        applyRuntimeRegressionGuards(this.state);
        const rawElapsed = Math.max(0, deltaMs / 1000);
        const rawDt = Math.min(document.hidden ? 4 : .2, rawElapsed);
        const cameraDt = Math.min(.05, rawElapsed);
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

    handleGamePointer(pointer) {
      if (this.runtimeFailed || !this.ui?.handleCanvasPoint) return;
      const bounds = this.game.canvas.getBoundingClientRect();
      const event = pointer.event;
      const menuX = event?.clientX == null ? pointer.x : event.clientX - bounds.left;
      const menuY = event?.clientY == null ? pointer.y : event.clientY - bounds.top;
      this.ui.handleCanvasPoint(pointer.x, pointer.y, menuX, menuY);
    }

    hiddenTick() {
      if (this.runtimeFailed || !this.state || !document.hidden || this.state.paused) return;
      const now = performance.now();
      const elapsed = Math.min(4, Math.max(0, (now - this.lastHiddenTick) / 1000));
      this.lastHiddenTick = now;
      try {
        sanitizeRuntimeState(this.state);
        applyRuntimeRegressionGuards(this.state);
        advanceSimulation(this.state, elapsed);
        updateRefreshAutosave(this.state, Math.min(1, elapsed));
      } catch (error) {
        this.recoverFrame(error, false);
      }
    }

    renderNativeFrame() {
      if (this.runtimeFailed || !this.state) return;
      const signature = floorSignature(this.state.floor);
      if (this.currentFloor !== this.state.floor || this.floorSignature !== signature) this.rebuildFloor(signature);
      this.refreshObjectStates();
      syncCharacterVisuals(this, this.state, this.actorLayer);
      this.refreshPoolFx();
      syncReferenceCompletion(this);
      syncNativeGameplayVisuals(this, this.state, this.nativeGameplayVisuals);
      const actor = selected(this.state);
      const tidy = Number.isFinite(this.state.tidiness?.score) ? ` tidy ${Math.round(this.state.tidiness.score)}%` : '';
      const floor = floors.find(candidate => candidate.id === this.state.floor);
      this.statusText?.setText(`${formatTime(this.state.time)}   $${Math.round(this.state.money ?? 0)}   ${this.state.autonomyMode}${tidy}   ${floor?.name || this.state.floor}   ${actor?.name || ''}: ${actor?.action || 'Idle'}`);
      this.statusText?.setVisible(true);
      this.runtimeText?.setVisible(true);
    }

    rebuildFloor(signature = floorSignature(this.state.floor)) {
      if (this.runtimeFailed || !this.roomLayer || !this.objectLayer) return;
      this.currentFloor = this.state.floor;
      this.floorSignature = signature;
      this.roomLayer.removeAll(true);
      this.objectLayer.removeAll(true);
      this.nativeObjects = [];
      const floor = floors.find(candidate => candidate.id === this.state.floor);
      if (!floor) return;

      for (const room of floor.rooms || []) {
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
      }
      this.refreshObjectStates();
    }

    refreshObjectStates() {
      if (this.runtimeFailed) return;
      for (const sprite of this.nativeObjects) {
        const object = sprite.pm2Object;
        if (!object) continue;
        const visible = object.floor === this.state.floor && !object.hidden && !object.collisionOnly;
        sprite.setVisible(visible);
        if (!visible) continue;
        sprite.setPosition(object.x + object.w / 2, object.y + object.h / 2);
        sprite.setDisplaySize(Math.max(18, object.w), Math.max(18, object.h));
        sprite.setDepth(object.y + object.h);
        sprite.setRotation(Number(object.renderAngle || 0));
        sprite.clearTint();
        sprite.setAlpha(object.kind === 'light' ? .5 : 1);

        if (object.kind === 'tv') sprite.setTint(this.state.tv?.on ? 0x74e6ff : 0x5d6876);
        if (['shower','bathtub','dog_bath'].includes(object.kind)) {
          const active = this.state.entities?.some(entity => entity.showerObjectId === object.id && entity.actionT > 0)
            || this.state.entities?.some(entity => entity.currentActionId === 'wash_dog' && entity.actionT > 0 && entity.floor === object.floor);
          if (active) sprite.setTint(0x9feaff);
        }
        if (object.kind === 'toilet') {
          const active = this.state.entities?.some(entity => entity.toiletObjectId === object.id && entity.actionT > 0);
          if (active) sprite.setTint(0xf1c66a);
        }
        if (object.kind === 'basketball_court') sprite.setAlpha(.32);
        if (object.id?.includes('garage_door') || String(object.label || '').toLowerCase().includes('garage door')) {
          sprite.setAlpha(this.state.objectState?.garageDoorOpen ? .35 : 1);
          if (this.state.objectState?.garageDoorOpen) sprite.setTint(0x74e6ff);
        }
      }
    }

    refreshPoolFx() {
      const graphics = this.poolGraphics;
      if (!graphics || this.runtimeFailed) return;
      graphics.clear();
      const game = this.state.poolGame;
      if (!game || game.floor !== this.state.floor || !Array.isArray(game.balls)) return;

      if (game.cueLine?.t > 0) {
        graphics.lineStyle(2, 0xf1c66a, Math.min(1, game.cueLine.t));
        graphics.lineBetween(game.cueLine.x1, game.cueLine.y1, game.cueLine.x2, game.cueLine.y2);
      }
      if (game.cueThrust?.t > 0) {
        graphics.lineStyle(4, 0xc99d62, Math.min(1, game.cueThrust.t * 2));
        graphics.lineBetween(game.cueThrust.x1, game.cueThrust.y1, game.cueThrust.x2, game.cueThrust.y2);
      }
      for (const ball of game.balls) {
        if (ball.pocketed) continue;
        graphics.fillStyle(parseHexColor(ball.fill, 0xf8fbff), 1);
        graphics.fillCircle(ball.x, ball.y, 7);
        graphics.lineStyle(1.5, 0x111820, 1);
        graphics.strokeCircle(ball.x, ball.y, 7);
      }
    }

    shutdownRuntime() {
      if (this.hiddenTicker) window.clearInterval(this.hiddenTicker);
      this.hiddenTicker = null;
      if (this.beforeUnloadHandler) window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler);
      if (this.pointerHandler) this.input?.off?.('pointerdown', this.pointerHandler);
      this.beforeUnloadHandler = null;
      this.visibilityHandler = null;
      this.pointerHandler = null;
      destroyNativeGameplayVisuals(this.nativeGameplayVisuals);
      this.nativeGameplayVisuals = null;
      destroyReferenceCompletion(this);
      clearCharacterVisuals(this);
    }

    recoverFrame(error, boot = false) {
      if (this.runtimeFailed) return;
      this.runtimeFailed = true;
      this.frameErrorCount += 1;
      console.error('[Apartment God] Phaser Migration 2 entered terminal recovery instead of blanking.', error);
      clearBadRefreshState();

      if (this.hiddenTicker) window.clearInterval(this.hiddenTicker);
      this.hiddenTicker = null;
      if (this.pointerHandler) this.input?.off?.('pointerdown', this.pointerHandler);
      if (this.input) this.input.enabled = false;

      if (this.state) {
        try { sanitizeRuntimeState(this.state); } catch {}
        for (const entity of this.state.entities || []) {
          entity.path = [];
          entity.poolRoute = null;
          entity.target = null;
          entity.pending = null;
          entity.pose = 'stand';
          entity.blockedT = 0;
          entity.recoveryCount = 0;
        }
        this.state.saveStatus = { message: 'Phaser Migration 2 stopped safely after a runtime error' };
        this.state.paused = true;
      }

      try { destroyNativeGameplayVisuals(this.nativeGameplayVisuals); } catch {}
      this.nativeGameplayVisuals = null;
      try { destroyReferenceCompletion(this); } catch {}
      try { clearCharacterVisuals(this); } catch {}
      try { this.children.removeAll(true); } catch {}

      this.cameras?.main?.setBackgroundColor?.('#171a22');
      this.add.rectangle(0, 0, PLAY_W, PLAY_H, 0x171a22).setOrigin(0, 0);
      this.add.text(32, 64, boot ? 'Phaser Migration 2 boot recovery screen' : 'Phaser Migration 2 runtime recovery screen', {
        fontFamily: 'system-ui', fontSize: 28, fontStyle: '900', color: '#f1c66a'
      });
      this.add.text(32, 108, 'The game stopped safely. The error screen will remain stable instead of looping or blanking.', {
        fontFamily: 'system-ui', fontSize: 17, fontStyle: '700', color: '#f0f2f7', wordWrap: { width: PLAY_W - 64 }
      });
      this.add.text(32, 158, String(error?.message || error || 'Unknown error').slice(0, 220), {
        fontFamily: 'system-ui', fontSize: 14, color: '#aab2c5', wordWrap: { width: PLAY_W - 64 }
      });
      this.registry.set('apartmentGodRuntimeFailed', true);
      this.registry.set('apartmentGodRuntimeError', String(error?.message || error || 'Unknown error'));
      this.scene.pause();
    }
  };
}

function runtimeLabel(assetFailures) {
  const fallback = assetFailures.length ? ` | ${assetFailures.length} visual fallback${assetFailures.length === 1 ? '' : 's'}` : '';
  return `PHASER MIGRATION 2 | native world | full gameplay | ${CHARACTER_ANIMATION_FPS} FPS${fallback}`;
}

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
  state.frontGate ??= { open: 0, requested: false };
  applyMainFloorLayoutPolish(state);
  applyRuntimeObjectCorrections();
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
  const hasPoolRoute = Array.isArray(entity.poolRoute?.points) && entity.poolRoute.points.length > 0;
  const hasTarget = Boolean(entity.target || entity.pending);
  const hasTimer = Number(entity.actionT || 0) > 0;
  if (hasPath || hasPoolRoute || hasTarget || hasTimer || entity.hidden) return;
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
  applyMainFloorLayoutPolish(state);
  applyRuntimeObjectCorrections();
  updateFrontYardEnvironment(state, dt);
  requestGateForApproachingEntities(state, dt);
  updateHouseTidiness(state);
  updatePoolActivity(state, dt);
  captureGateTraversalState(state);

  for (const entity of state.entities) {
    const poolChoreography = Array.isArray(entity.poolRoute?.points) || String(entity.action || '').toLowerCase().startsWith('pool:');
    if (poolChoreography) continue;
    const arrived = updateMovement(state, entity, dt);
    if (arrived) resolveArrival(state, entity);
  }

  enforceGateTraversal(state);
  updateActions(state, dt);
  updateArcadeSystem(state, dt);
  updateBasketballSystem(state, dt);
  updateOffsiteHomeView(state);
  updateCalendarRuntime(state);
  updateAutoHooks(state, dt);
  updateAutonomy(state, dt);
  advanceGameClock(state, dt);
  updateLifeQualitySystem(state);
  updateHouseTidiness(state);
}

function advanceSimulation(state, rawDt) {
  if (state.paused) return;
  const maximumStep = document.hidden ? .2 : .05;
  const maximumCatchup = document.hidden ? 4 : .2;
  let remaining = Math.min(rawDt * state.speed, maximumCatchup);
  let guard = 0;
  while (remaining > .0001 && guard < 40) {
    const step = Math.min(maximumStep, remaining);
    runSimulationStep(state, step);
    remaining -= step;
    guard += 1;
  }
}

function floorSignature(floorId) {
  const floorRooms = floors.find(candidate => candidate.id === floorId)?.rooms || [];
  const floorObjects = objects.filter(object => object.floor === floorId && !object.collisionOnly);
  return `${floorId}|${floorRooms.map(room => `${room.id}:${room.x}:${room.y}:${room.w}:${room.h}`).join(';')}|${floorObjects.map(object => `${object.id}:${object.x}:${object.y}:${object.w}:${object.h}:${object.kind}:${object.hidden ? 1 : 0}`).join(';')}`;
}

function roomAlpha(roomId) {
  if (roomId === 'yard' || roomId === 'front_yard' || roomId === 'garden') return .92;
  if (roomId.includes('pool')) return .9;
  if (roomId.includes('garage') || roomId.includes('driveway') || roomId.includes('road')) return .9;
  return .97;
}

function parseHexColor(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.replace('#', '');
  const parsed = Number.parseInt(normalized, 16);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function loadRefreshStateSafely(state) {
  try {
    const snapshot = loadRefreshState(state);
    if (snapshot?.floor != null) state.floor = snapshot.floor;
    return snapshot;
  } catch (error) {
    clearBadRefreshState();
    console.warn('[Apartment God] Ignored incompatible refresh state.', error);
    return null;
  }
}

function clearBadRefreshState() {
  try { localStorage.removeItem(REFRESH_SAVE_KEY); } catch {}
}

function drawHardBootError(canvas, error) {
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.width = PLAY_W;
  canvas.height = PLAY_H;
  context.fillStyle = '#171a22';
  context.fillRect(0, 0, PLAY_W, PLAY_H);
  context.fillStyle = '#f1c66a';
  context.font = '900 34px system-ui';
  context.fillText('Phaser Migration 2 could not boot', 42, 84);
  context.fillStyle = '#f0f2f7';
  context.font = '700 18px system-ui';
  context.fillText('The game stopped on a visible error screen instead of showing a blank canvas.', 42, 122);
  context.fillStyle = '#aab2c5';
  context.font = '600 14px system-ui';
  context.fillText(String(error?.message || error || 'Unknown error').slice(0, 150), 42, 160);
}
