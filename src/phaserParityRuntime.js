import { CANVAS_H, CANVAS_W } from './config.js';
import { createState } from './state.js';
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
import { advanceGameClock } from './timeSystem.js';
import { installFrontYardWorld, updateFrontYardEnvironment } from './frontYardDriveway.js';
import { applyRuntimeObjectCorrections } from './runtimeObjectCorrections.js?v=20260717-phaser-parity';
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
} from './phaserCharacterAnimationSystem.js?v=20260717-phaser-parity';

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
      width: CANVAS_W,
      height: CANVAS_H,
      backgroundColor: '#101722',
      render: { antialias: true, pixelArt: false, transparent: false, clearBeforeRender: true },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: CANVAS_W, height: CANVAS_H },
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
        window.addEventListener('beforeunload', () => window.clearInterval(this.hiddenTicker));

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
        }
        this.state.saveStatus = { message: 'Phaser parity runtime error handled' };
        if (this.frameErrorCount > 2) this.state.paused = true;
      }
      clearCharacterVisuals(this);
      this.children.removeAll(true);
      this.add.rectangle(0, 0, CANVAS_W, CANVAS_H, 0x171a22).setOrigin(0, 0);
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
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
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
  for (const entity of state.entities) {
    entity.path = Array.isArray(entity.path) ? entity.path : [];
    entity.needs ??= {};
    entity.skills ??= {};
    entity.pose ||= 'stand';
    entity.action ||= 'Idle';
    entity.floor = Number.isInteger(entity.floor) ? entity.floor : 0;
    entity.x = Number.isFinite(entity.x) ? entity.x : 120;
    entity.y = Number.isFinite(entity.y) ? entity.y : 120;
    applyPoseOrientation(entity);
    cleanupStaleActorState(entity);
  }
  updateHouseTidiness(state);
}

function applyPoseOrientation(entity) {
  if (entity.type !== 'person') return;
  const action = String(entity.action || '').toLowerCase();
  const pose = String(entity.pose || '').toLowerCase();
  const bedPose = pose === 'sleep' || action.includes('sleep') || action.includes('nap') || action.includes('bed together') || action.includes('waking up') || action.includes('king bed');
  if (bedPose) entity.lastHeading = 0;
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
  if (['walk', 'sit'].includes(entity.pose) && (action === 'idle' || action === 'walking' || action === 'running' || action === 'recovered')) entity.pose = 'stand';
}

function runSimulationStep(state, dt) {
  if (dt <= 0) return;
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

function drawHardBootError(canvas, error) {
  try {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#171a22';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f1c66a';
    context.font = '900 28px system-ui';
    context.fillText('Apartment God full Phaser parity runtime could not start', 32, 70);
    context.fillStyle = '#f0f2f7';
    context.font = '700 18px system-ui';
    context.fillText('This is a visible error screen, not a blank canvas.', 32, 106);
    context.fillStyle = '#aab2c5';
    context.font = '600 14px system-ui';
    context.fillText(String(error?.message || error || 'Unknown error').slice(0, 150), 32, 142);
  } catch (_) {}
}
