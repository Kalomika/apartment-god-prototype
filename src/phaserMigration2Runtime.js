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

installFrontYardWorld();
applyMainFloorLayoutPolish();
applyRuntimeObjectCorrections();

const REFRESH_SAVE_KEY = 'apartment_god_test_refresh_state_v3';
const ASSET_ROOT = 'assets/phaser-migration-2/sprites';

const OBJECT_TEXTURES = {
  room: `${ASSET_ROOT}/environment/room_panel.svg`,
  generic: `${ASSET_ROOT}/objects/generic_object.svg`,
  furniture: `${ASSET_ROOT}/objects/furniture_set.svg`,
  bed: `${ASSET_ROOT}/objects/bed.svg`,
  tv: `${ASSET_ROOT}/objects/tv.svg`,
  bathroom: `${ASSET_ROOT}/objects/bathroom_fixture.svg`,
  kitchen: `${ASSET_ROOT}/objects/kitchen_fixture.svg`,
  stairs: `${ASSET_ROOT}/objects/stairs.svg`
};

const CHARACTER_SHEETS = {
  'resident-sheet': `${ASSET_ROOT}/characters/resident_8fps_sheet.svg`,
  'girlfriend-sheet': `${ASSET_ROOT}/characters/girlfriend_8fps_sheet.svg`,
  'lab-subject-sheet': `${ASSET_ROOT}/characters/lab_subject_8fps_sheet.svg`,
  'dog-sheet': `${ASSET_ROOT}/characters/dog_8fps_sheet.svg`
};

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
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: PLAY_W, height: PLAY_H },
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
      this.lastHiddenTick = 0;
      this.hiddenTicker = null;
      this.nativeObjects = [];
      this.pm2ActorVisuals = new Map();
      this.assetFailures = [];
      this.nativeGameplayVisuals = null;
    }

    preload() {
      this.loadText = this.add.text(28, 28, 'Apartment God Phaser Migration 2 loading full gameplay...', {
        fontFamily: 'system-ui', fontSize: 20, fontStyle: '900', color: '#f1c66a'
      }).setDepth(10000);

      for (const [key, url] of Object.entries(OBJECT_TEXTURES)) this.load.svg(`pm2-${key}`, url, { width: 128, height: 128 });
      for (const [key, url] of Object.entries(CHARACTER_SHEETS)) this.load.svg(`pm2-${key}`, url, { width: 512, height: 512 });
      this.load.on('loaderror', file => {
        this.assetFailures.push(file?.key || file?.src || 'unknown asset');
        console.error('[Apartment God] Phaser Migration 2 asset failed:', file?.key, file?.src);
      });
    }

    create() {
      try {
        if (this.assetFailures.length) throw new Error(`Required Phaser Migration 2 assets failed: ${this.assetFailures.join(', ')}`);
        this.state = createState();
        this.state.runtimeRenderer = 'phaser-migration-2-native-full-gameplay';
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

        registerCharacterAnimations(this);

        this.statusText = this.add.text(12, 12, '', {
          fontFamily: 'system-ui', fontSize: 14, fontStyle: '900', color: '#f8fbff', backgroundColor: 'rgba(7,10,16,.55)', padding: { x: 8, y: 5 }
        }).setDepth(1000);
        this.runtimeText = this.add.text(12, PLAY_H - 25, `PHASER MIGRATION 2 | native world | full gameplay | ${CHARACTER_ANIMATION_FPS} FPS`, {
          fontFamily: 'system-ui', fontSize: 11, fontStyle: '900', color: '#f1c66a', backgroundColor: 'rgba(7,10,16,.45)', padding: { x: 7, y: 3 }
        }).setDepth(1000);

        installCameraSwipeNavigation(this.state, this.game.canvas);
        this.ui = createUi(this.state, this.game.canvas, { externalInput: true });
        this.input.on('pointerdown', pointer => this.handleGamePointer(pointer));

        window.addEventListener('beforeunload', () => saveRefreshState(this.state));
        document.addEventListener('visibilitychange', () => {
          this.state.backgroundMode = document.hidden;
          if (!document.hidden) this.state.saveStatus = { message: 'Returned from background' };
        });
        this.lastHiddenTick = performance.now();
        this.hiddenTicker = window.setInterval(() => this.hiddenTick(), 1000);
        this.events.once('shutdown', () => this.shutdownRuntime());
        this.events.once('destroy', () => this.shutdownRuntime());

        this.registry.set('apartmentGodRuntime', 'phaser-migration-2-native-full-main-gameplay');
        this.registry.set('apartmentGodCharacterFps', CHARACTER_ANIMATION_FPS);
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
      if (!this.ui?.handleCanvasPoint) return;
      const bounds = this.game.canvas.getBoundingClientRect();
      const event = pointer.event;
      const menuX = event?.clientX == null ? pointer.x : event.clientX - bounds.left;
      const menuY = event?.clientY == null ? pointer.y : event.clientY - bounds.top;
      this.ui.handleCanvasPoint(pointer.x, pointer.y, menuX, menuY);
    }

    hiddenTick() {
      if (!this.state || !document.hidden || this.state.paused) return;
      const now = performance.now();
      const elapsed = Math.min(4, Math.max(0, (now - this.lastHiddenTick) / 1000));
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
      const signature = floorSignature(this.state.floor);
      if (this.currentFloor !== this.state.floor || this.floorSignature !== signature) this.rebuildFloor(signature);
      this.refreshObjectStates();
      syncCharacterVisuals(this, this.state, this.actorLayer);
      this.refreshPoolFx();
      syncNativeGameplayVisuals(this, this.state, this.nativeGameplayVisuals);
      const actor = selected(this.state);
      const tidy = Number.isFinite(this.state.tidiness?.score) ? ` tidy ${Math.round(this.state.tidiness.score)}%` : '';
      const floor = floors.find(candidate => candidate.id === this.state.floor);
      this.statusText.setText(`${formatTime(this.state.time)}   $${Math.round(this.state.money ?? 0)}   ${this.state.autonomyMode}${tidy}   ${floor?.name || this.state.floor}   ${actor?.name || ''}: ${actor?.action || 'Idle'}`);
      this.statusText.setVisible(true);
      this.runtimeText.setVisible(true);
    }

    rebuildFloor(signature = floorSignature(this.state.floor)) {
      this.currentFloor = this.state.floor;
      this.floorSignature = signature;
      this.roomLayer.removeAll(true);
      this.objectLayer.removeAll(true);
      this.nativeObjects = [];
      const floor = floors.find(candidate => candidate.id === this.state.floor);
      if (!floor) return;

      for (const room of floor.rooms || []) {
        const panel = this.add.image(room.x + room.w / 2, room.y + room.h / 2, 'pm2-room');
        panel.setDisplaySize(room.w, room.h);
        panel.setAlpha(roomAlpha(room.id));
        panel.setDepth(room.y - 1000);
        this.roomLayer.add(panel);
        const label = this.add.text(room.x + 10, room.y + 8, room.name, {
          fontFamily: 'system-ui', fontSize: 10, fontStyle: '900', color: '#d9e7f2', backgroundColor: 'rgba(7,10,16,.34)', padding: { x: 4, y: 2 }
        });
        label.setAlpha(.62);
        label.setDepth(room.y - 900);
        this.roomLayer.add(label);
      }

      const floorObjects = objects.filter(object => object.floor === this.state.floor);
      for (const object of floorObjects) {
        const sprite = this.add.image(object.x + object.w / 2, object.y + object.h / 2, textureForObject(object));
        sprite.pm2Object = object;
        this.objectLayer.add(sprite);
        this.nativeObjects.push(sprite);
      }
      this.refreshObjectStates();
    }

    refreshObjectStates() {
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
        if (object.kind === 'shower' || object.kind === 'bathtub' || object.kind === 'dog_bath') {
          const active = this.state.entities?.some(entity => entity.showerObjectId === object.id && entity.actionT > 0) || this.state.entities?.some(entity => entity.currentActionId === 'wash_dog' && entity.actionT > 0 && entity.floor === object.floor);
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
      destroyNativeGameplayVisuals(this.nativeGameplayVisuals);
      this.nativeGameplayVisuals = null;
      clearCharacterVisuals(this);
    }

    recoverFrame(error, boot = false) {
      this.frameErrorCount += 1;
      console.error('[Apartment God] Phaser Migration 2 recovered instead of blanking.', error);
      clearBadRefreshState();
      if (this.state) {
        sanitizeRuntimeState(this.state);
        for (const entity of this.state.entities || []) {
          entity.path = [];
          entity.poolRoute = null;
          entity.target = null;
          entity.pending = null;
          entity.pose = 'stand';
          entity.blockedT = 0;
          entity.recoveryCount = 0;
        }
        this.state.saveStatus = { message: 'Phaser Migration 2 runtime error handled' };
        this.state.paused = this.frameErrorCount > 2;
      }
      destroyNativeGameplayVisuals(this.nativeGameplayVisuals);
      this.nativeGameplayVisuals = null;
      clearCharacterVisuals(this);
      this.children.removeAll(true);
      this.add.rectangle(0, 0, PLAY_W, PLAY_H, 0x171a22).setOrigin(0, 0);
      this.add.text(32, 64, boot ? 'Phaser Migration 2 boot recovery screen' : 'Phaser Migration 2 frame recovery screen', {
        fontFamily: 'system-ui', fontSize: 28, fontStyle: '900', color: '#f1c66a'
      });
      this.add.text(32, 108, 'The branch did not blank. Check console and refresh once.', {
        fontFamily: 'system-ui', fontSize: 18, fontStyle: '700', color: '#f0f2f7'
      });
      this.add.text(32, 144, String(error?.message || error || 'Unknown error').slice(0, 160), {
        fontFamily: 'system-ui', fontSize: 14, color: '#aab2c5'
      });
    }
  };
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
  while (remaining > .0001 && guard < 80) {
    const step = Math.min(maximumStep, remaining);
    runSimulationStep(state, step);
    remaining -= step;
    guard += 1;
  }
}

function textureForObject(object) {
  if (object.kind === 'bed') return 'pm2-bed';
  if (object.kind === 'tv') return 'pm2-tv';
  if (['toilet', 'shower', 'bathtub', 'sink', 'dog_bath'].includes(object.kind)) return 'pm2-bathroom';
  if (['fridge', 'stove', 'coffee_maker', 'trash_can', 'outdoor_trash'].includes(object.kind)) return 'pm2-kitchen';
  if (['stairs', 'door'].includes(object.kind)) return 'pm2-stairs';
  if (['couch', 'dining_table', 'desk', 'bookshelf', 'pool_table', 'arcade_machine', 'game_console', 'dartboard', 'weight_bench', 'heavy_bag', 'treadmill', 'closet', 'basketball_court'].includes(object.kind)) return 'pm2-furniture';
  return 'pm2-generic';
}

function roomAlpha(roomId) {
  if (roomId.includes('bath')) return .92;
  if (roomId.includes('garage') || roomId.includes('driveway')) return .82;
  if (roomId.includes('road')) return .74;
  if (roomId.includes('garden') || roomId.includes('yard')) return .8;
  return .88;
}

function floorSignature(floorId) {
  const floor = floors.find(candidate => candidate.id === floorId);
  const roomCount = floor?.rooms?.length || 0;
  const objectCount = objects.filter(object => object.floor === floorId).length;
  return `${floorId}:${roomCount}:${objectCount}`;
}

function loadRefreshStateSafely(state) {
  try {
    return loadRefreshState(state);
  } catch (error) {
    console.error('[Apartment God] Bad refresh state skipped for Phaser Migration 2.', error);
    clearBadRefreshState();
    state.saveStatus = { message: 'Skipped bad refresh state' };
    return false;
  }
}

function clearBadRefreshState() {
  try { localStorage.removeItem(REFRESH_SAVE_KEY); } catch (_) {}
}

function parseHexColor(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().replace('#', '');
  const parsed = Number.parseInt(normalized, 16);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function drawHardBootError(canvas, error) {
  try {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#171a22';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f1c66a';
    context.font = '900 28px system-ui';
    context.fillText('Apartment God Phaser Migration 2 could not start', 32, 70);
    context.fillStyle = '#f0f2f7';
    context.font = '700 18px system-ui';
    context.fillText('This is a visible error screen, not a blank canvas.', 32, 106);
    context.fillStyle = '#aab2c5';
    context.font = '600 14px system-ui';
    context.fillText(String(error?.message || error || 'Unknown error').slice(0, 160), 32, 142);
  } catch (_) {}
}
