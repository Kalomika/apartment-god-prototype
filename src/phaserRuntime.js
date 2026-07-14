import Phaser from '/vendor/phaser.esm.js';
import { CANVAS_H, CANVAS_W } from './config.js';
import { bootCanvasGame } from './canvasRuntime.js';
import { createState } from './state.js';
import { draw } from './rendering.js';
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

const REFRESH_SAVE_KEY = 'apartment_god_test_refresh_state_v3';
const FRAME_TEXTURE_KEY = 'apartment_god_canvas_bridge_frame';

export function bootPhaserGame() {
  const canvas = document.getElementById('game');
  if (!canvas) return bootCanvasGame('missing canvas fallback');

  try {
    return new Phaser.Game({
      type: Phaser.CANVAS,
      canvas,
      width: CANVAS_W,
      height: CANVAS_H,
      backgroundColor: '#171a22',
      render: { antialias: false, pixelArt: true, transparent: false },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: CANVAS_W, height: CANVAS_H },
      scene: [ApartmentGodPhaserBridgeScene]
    });
  } catch (error) {
    console.error('[Apartment God] Phaser host failed before scene boot. Falling back to Canvas runtime.', error);
    return bootCanvasGame('emergency canvas fallback after Phaser boot failure');
  }
}

class ApartmentGodPhaserBridgeScene extends Phaser.Scene {
  constructor() {
    super('ApartmentGodPhaserBridgeScene');
    this.frameErrorCount = 0;
    this.hiddenTicker = null;
    this.lastHiddenTick = 0;
  }

  create() {
    try {
      this.state = createState();
      loadRefreshStateSafely(this.state);
      sanitizeRuntimeState(this.state);
      applyRuntimeRegressionGuards(this.state);

      this.frameTexture = this.textures.createCanvas(FRAME_TEXTURE_KEY, CANVAS_W, CANVAS_H);
      this.frameCtx = this.frameTexture.getContext();
      this.frameImage = this.add.image(0, 0, FRAME_TEXTURE_KEY).setOrigin(0, 0).setDepth(0);
      this.frameImage.setDisplaySize(CANVAS_W, CANVAS_H);

      installCameraSwipeNavigation(this.state, this.game.canvas);
      this.ui = createUi(this.state, this.game.canvas, { externalInput: true });
      this.input.on('pointerdown', pointer => {
        if (!this.ui?.handleCanvasPoint) return;
        this.ui.handleCanvasPoint(pointer.x, pointer.y, pointer.event?.offsetX ?? pointer.x, pointer.event?.offsetY ?? pointer.y);
      });

      window.addEventListener('beforeunload', () => saveRefreshState(this.state));
      document.addEventListener('visibilitychange', () => {
        this.state.backgroundMode = document.hidden;
        if (!document.hidden) this.state.saveStatus = { message: 'Returned from background' };
      });

      this.lastHiddenTick = performance.now();
      this.hiddenTicker = window.setInterval(() => this.hiddenTick(), 1000);
      window.addEventListener('beforeunload', () => window.clearInterval(this.hiddenTicker));
      this.registry.set('apartmentGodRuntime', 'phaser-hosted-canvas-bridge');
      this.renderFrame();
      this.ui.renderHud();
    } catch (error) {
      console.error('[Apartment God] Phaser scene failed. Falling back to Canvas runtime.', error);
      try { this.game.destroy(false); } catch (_) {}
      setTimeout(() => bootCanvasGame('emergency canvas fallback after Phaser scene failure'), 0);
    }
  }

  update(_time, deltaMs) {
    if (!this.state || !this.frameCtx) return;
    try {
      sanitizeRuntimeState(this.state);
      applyRuntimeRegressionGuards(this.state);
      const rawDt = Math.min(document.hidden ? 4.0 : 0.2, Math.max(0, deltaMs / 1000));
      const cameraDt = Math.min(0.05, Math.max(0, deltaMs / 1000));
      updateCameraTransition(this.state, cameraDt);
      if (!document.hidden) advanceSimulation(this.state, rawDt);
      updateRefreshAutosave(this.state, cameraDt);
      if (this.state.skipRecap?.visibleT > 0) this.state.skipRecap.visibleT -= cameraDt;
      this.renderFrame();
      this.ui.renderHud();
    } catch (error) {
      this.recoverFrame(error);
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
      console.error('[Apartment God] Phaser background tick recovered.', error);
    }
  }

  renderFrame() {
    draw(this.frameCtx, this.state);
    this.frameTexture.refresh();
  }

  recoverFrame(error) {
    this.frameErrorCount += 1;
    console.error('[Apartment God] Phaser frame recovered instead of blanking.', error);
    clearBadRefreshState();
    sanitizeRuntimeState(this.state);
    for (const entity of this.state.entities) {
      entity.path = [];
      entity.target = null;
      entity.pending = null;
      entity.pose = 'stand';
      entity.blockedT = 0;
      entity.recoveryCount = 0;
    }
    this.state.saveStatus = { message: 'Phaser runtime error handled' };
    this.drawBootError(error);
    this.frameTexture.refresh();
    if (this.frameErrorCount > 2) this.state.paused = true;
  }

  drawBootError(error) {
    const ctx = this.frameCtx;
    ctx.save();
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#171a22';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = '#f1c66a';
    ctx.font = '900 28px system-ui';
    ctx.fillText('Apartment God Phaser host recovered from a runtime error', 32, 70);
    ctx.fillStyle = '#f0f2f7';
    ctx.font = '700 18px system-ui';
    ctx.fillText('Refresh once. If this stays, press Reset after the UI loads.', 32, 106);
    ctx.fillStyle = '#aab2c5';
    ctx.font = '600 14px system-ui';
    ctx.fillText(String(error?.message || error || 'Unknown error').slice(0, 120), 32, 142);
    ctx.restore();
  }
}

function loadRefreshStateSafely(state) {
  try {
    return loadRefreshState(state);
  } catch (error) {
    console.error('[Apartment God] Bad refresh state skipped so Phaser can boot.', error);
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
  for (const entity of state.entities) {
    entity.path = Array.isArray(entity.path) ? entity.path : [];
    entity.needs ??= {};
    entity.skills ??= {};
    entity.pose ||= 'stand';
    entity.action ||= 'Idle';
    entity.floor = Number.isInteger(entity.floor) ? entity.floor : 0;
    entity.x = Number.isFinite(entity.x) ? entity.x : 120;
    entity.y = Number.isFinite(entity.y) ? entity.y : 120;
  }
  updateHouseTidiness(state);
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
