import { PLAY_H, PLAY_W } from './config.js';
import { createState } from './state.js';
import { createUi } from './ui.js';
import { updateMovement } from './movement.js';
import { resolveArrival, updateActions } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { updateAutonomy } from './autonomy.js';
import { updateCalendarRuntime } from './calendarRuntime.js';
import { updateLifeQualitySystem } from './lifeQualitySystem.js';
import { updateCameraTransition } from './cameraNavigation.js';
import { installManagedCameraSwipeNavigation } from './managedCameraSwipeNavigation.js?v=20260721-full-audit-repair';
import { loadRefreshState, saveRefreshState, updateRefreshAutosave } from './saveSystem.js';
import { applyRuntimeRegressionGuards } from './runtimeRegressionGuards.js';
import { normalizeRuntimeEntity } from './runtimeStateNormalization.js';
import { updatePoolActivity } from './poolActivitySystem.js';
import { updateHouseTidiness } from './tidinessSystem.js';
import { advanceGameClock } from './timeSystem.js';
import { installFrontYardWorld, updateFrontYardEnvironment } from './frontYardDriveway.js';
import { applyRuntimeObjectCorrections } from './runtimeObjectCorrections.js?v=20260721-full-audit-repair';
import { updateArcadeSystem } from './arcadeSystem.js';
import { updateBasketballSystem } from './basketballSystem.js';
import { updateOffsiteHomeView } from './offsiteOverlay.js';
import { captureGateTraversalState, enforceGateTraversal, requestGateForApproachingEntities } from './gateTraversalGuard.js';
import { drawPhaserEnvironment, drawPhaserForeground } from './rendering.js?v=20260717-phaser-parity';
import {
  CHARACTER_ANIMATION_FPS,
  clearCharacterVisuals,
  registerCharacterAnimations,
  syncCharacterVisuals
} from './phaserCharacterAnimationSystem.js?v=20260721-full-audit-repair';

installFrontYardWorld();

const REFRESH_SAVE_KEY = 'apartment_god_test_refresh_state_v3';
const CHARACTER_SHEETS = {
  'ag-resident-sheet': 'assets/sprites/characters/resident/resident_8fps_sheet.svg',
  'ag-girlfriend-sheet': 'assets/sprites/characters/girlfriend/girlfriend_8fps_sheet.svg',
  'ag-lab-subject-sheet': 'assets/sprites/characters/lab_test_subject/lab_subject_8fps_sheet.svg',
  'ag-dog-sheet': 'assets/sprites/characters/dog/dog_8fps_sheet.svg'
};

export async function bootPhaserParityGame() {
  const canvas = document.getElementById('game');
  if (!canvas) return null;
  try {
    const phaserModule = await import('/vendor/phaser.esm.js');
    const Phaser = phaserModule.default || phaserModule;
    const SceneClass = createApartmentGodParityScene(Phaser);
    return new Phaser.Game({
      type: Phaser.CANVAS,
      canvas,
      parent: 'game-wrap',
      width: PLAY_W,
      height: PLAY_H,
      backgroundColor: '#101722',
      render: { antialias: true, pixelArt: false, transparent: false, clearBeforeRender: true },
      scale: {
        parent: 'game-wrap',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NO_CENTER,
        width: PLAY_W,
        height: PLAY_H,
        expandParent: false,
        autoRound: true
      },
      scene: [SceneClass]
    });
  } catch (error) {
    drawHardBootError(canvas, error);
    console.error('[Apartment God] Full Phaser parity runtime failed before scene creation.', error);
    return null;
  }
}

function createApartmentGodParityScene(Phaser) {
  return class ApartmentGodParityScene extends Phaser.Scene {
    constructor() {
      super('ApartmentGodParityScene');
      this.frameErrorCount = 0;
      this.lastHiddenTick = 0;
      this.hiddenTicker = null;
      this.assetFailures = [];
      this.apartmentGodActorVisuals = new Map();
      this.beforeUnloadHandler = null;
      this.visibilityHandler = null;
      this.pointerHandler = null;
      this.cameraSwipeCleanup = null;
      this.runtimeCleaned = false;
    }

    preload() {
      this.loadingText = this.add.text(28, 28, 'Apartment God full Phaser parity build loading...', {
        fontFamily: 'system-ui', fontSize: 20, fontStyle: '900', color: '#f1c66a'
      }).setDepth(10000);
      for (const [key, path] of Object.entries(CHARACTER_SHEETS)) this.load.svg(key, path, { width: 512, height: 512 });
      this.load.on('loaderror', file => {
        this.assetFailures.push(file?.key || file?.src || 'unknown asset');
        console.error('[Apartment God] Phaser parity asset failed:', file?.key, file?.src);
      });
    }

    create() {
      try {
        this.runtimeCleaned = false;
        if (this.assetFailures.length) throw new Error(`Required Phaser actor assets failed: ${this.assetFailures.join(', ')}`);
        this.state = createState();
        this.state.runtimeRenderer = 'phaser-parity';
        loadRefreshStateSafely(this.state);
        sanitizeRuntimeState(this.state);
        applyRuntimeRegressionGuards(this.state);

        const environment = createRuntimeCanvas();
        const foreground = createRuntimeCanvas();
        this.environmentCanvas = environment.canvas;
        this.environmentContext = environment.context;
        this.foregroundCanvas = foreground.canvas;
        this.foregroundContext = foreground.context;

        this.environmentTexture = this.textures.addCanvas('ag-phaser-environment', this.environmentCanvas);
        this.foregroundTexture = this.textures.addCanvas('ag-phaser-foreground', this.foregroundCanvas);
        this.environmentImage = this.add.image(0, 0, 'ag-phaser-environment').setOrigin(0, 0).setDepth(0);
        this.actorLayer = this.add.container(0, 0).setDepth(60);
        this.foregroundImage = this.add.image(0, 0, 'ag-phaser-foreground').setOrigin(0, 0).setDepth(90);

        registerCharacterAnimations(this);
        this.cameraSwipeCleanup = installManagedCameraSwipeNavigation(this.state, this.game.canvas);
        this.ui = createUi(this.state, this.game.canvas, { externalInput: true });
        this.pointerHandler = pointer => this.handleGamePointer(pointer);
        this.input.on('pointerdown', this.pointerHandler);

        this.beforeUnloadHandler = () => saveRefreshState(this.state);
        this.visibilityHandler = () => {
          this.state.backgroundMode = document.hidden;
          this.lastHiddenTick = performance.now();
          if (!document.hidden) this.state.saveStatus = { message: 'Returned from background' };
        };
        window.addEventListener('beforeunload', this.beforeUnloadHandler);
        document.addEventListener('visibilitychange', this.visibilityHandler);
        this.lastHiddenTick = performance.now();
        this.hiddenTicker = window.setInterval(() => this.hiddenTick(), 1000);
        this.events.once('shutdown', () => this.cleanupRuntime());
        this.events.once('destroy', () => this.cleanupRuntime());

        this.registry.set('apartmentGodRuntime', 'full-phaser-parity');
        this.registry.set('apartmentGodCharacterFps', CHARACTER_ANIMATION_FPS);
        this.loadingText?.destroy();
        this.renderParityFrame();
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
        this.renderParityFrame();
        this.ui?.renderHud();
      } catch (error) {
        this.recoverFrame(error, false);
      }
    }

    handleGamePointer(pointer) {
      if (!this.ui?.handleCanvasPoint) return;
      const bounds = this.game.canvas.getBoundingClientRect();
      const event = pointer.event;
      const menuX = event?.clientX == null ? null : event.clientX - bounds.left;
      const menuY = event?.clientY == null ? null : event.clientY - bounds.top;
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
        console.error('[Apartment God] Phaser parity background tick recovered.', error);
      }
    }

    renderParityFrame() {
      drawPhaserEnvironment(this.environmentContext, this.state);
      this.environmentTexture.refresh();
      syncCharacterVisuals(this, this.state, this.actorLayer);
      drawPhaserForeground(this.foregroundContext, this.state);
      this.foregroundTexture.refresh();
    }

    cleanupRuntime() {
      if (this.runtimeCleaned) return;
      this.runtimeCleaned = true;
      if (this.beforeUnloadHandler) window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      if (this.visibilityHandler) document.removeEventListener('visibilitychange', this.visibilityHandler);
      if (this.hiddenTicker != null) window.clearInterval(this.hiddenTicker);
      if (this.pointerHandler) this.input?.off?.('pointerdown', this.pointerHandler);
      this.cameraSwipeCleanup?.();
      this.cameraSwipeCleanup = null;
      this.beforeUnloadHandler = null;
      this.visibilityHandler = null;
      this.pointerHandler = null;
      this.hiddenTicker = null;
      if (this.state) this.state.backgroundMode = false;
    }

    recoverFrame(error, boot = false) {
      this.frameErrorCount += 1;
      console.error('[Apartment God] Phaser parity runtime recovered instead of blanking.', error);
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
          entity.actionT = 0;
          entity.actionTotal = 0;
          entity.currentActionId = null;
          entity.activityObjectId = null;
        }
        this.state.saveStatus = { message: 'Phaser parity runtime error handled' };
        if (this.frameErrorCount > 2) this.state.paused = true;
      }
      clearCharacterVisuals(this);
      this.children.removeAll(true);
      this.add.rectangle(0, 0, PLAY_W, PLAY_H, 0x171a22).setOrigin(0, 0);
      this.add.text(32, 64, boot ? 'Apartment God Phaser parity boot recovery' : 'Apartment God Phaser parity frame recovery', {
        fontFamily: 'system-ui', fontSize: 28, fontStyle: '900', color: '#f1c66a'
      });
      this.add.text(32, 108, 'The game did not blank. Check the console and refresh once.', {
        fontFamily: 'system-ui', fontSize: 18, fontStyle: '700', color: '#f0f2f7'
      });
      this.add.text(32, 144, String(error?.message || error || 'Unknown error').slice(0, 150), {
        fontFamily: 'system-ui', fontSize: 14, color: '#aab2c5'
      });
    }
  };
}

function createRuntimeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = PLAY_W;
  canvas.height = PLAY_H;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) throw new Error('Unable to create Phaser compatibility rendering context.');
  return { canvas, context };
}

function loadRefreshStateSafely(state) {
  try {
    return loadRefreshState(state);
  } catch (error) {
    console.error('[Apartment God] Bad refresh state skipped so Phaser parity can boot.', error);
    clearBadRefreshState();
    state.saveStatus = { message: 'Skipped bad refresh state' };
    return false;
  }
}

function clearBadRefreshState() {
  try { localStorage.removeItem(REFRESH_SAVE_KEY); } catch (_) {}
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
  applyRuntimeObjectCorrections();
  for (const entity of state.entities) normalizeRuntimeEntity(entity);
}

function drawHardBootError(canvas, error) {
  const context = canvas.getContext('2d');
  if (!context) return;
  context.fillStyle = '#171a22';
  context.fillRect(0, 0, PLAY_W, PLAY_H);
  context.fillStyle = '#f1c66a';
  context.font = '900 28px system-ui';
  context.fillText('Apartment God Phaser boot failed safely', 32, 74);
  context.fillStyle = '#f0f2f7';
  context.font = '700 18px system-ui';
  context.fillText('Refresh once. If this remains, report the visible message below.', 32, 112);
  context.fillStyle = '#aab2c5';
  context.font = '14px system-ui';
  context.fillText(String(error?.message || error || 'Unknown error').slice(0, 140), 32, 150);
}

function advanceSimulation(state, rawDt) {
  if (state.paused) return;
  const dt = rawDt * state.speed;
  advanceGameClock(state, dt);
  updateCalendarRuntime(state, dt);
  updateLifeQualitySystem(state, dt);
  updateHouseTidiness(state, dt);
  updateFrontYardEnvironment(state, dt);
  updateAutoHooks(state, dt);
  updateAutonomy(state, dt);
  const gateSnapshots = captureGateTraversalState(state);
  requestGateForApproachingEntities(state);
  for (const entity of state.entities) {
    if (entity.target?.type === 'object' && entity.target.objectId) entity.activityObjectId = entity.target.objectId;
    updateMovement(state, entity, dt);
    resolveArrival(state, entity);
  }
  enforceGateTraversal(state, gateSnapshots);
  updateActions(state, dt);
  updatePoolActivity(state, dt);
  updateArcadeSystem(state, dt);
  updateBasketballSystem(state, dt);
  updateOffsiteHomeView(state, dt);
}
