/*
 * Phaser runtime is now the production path.
 * Final visuals must come from imported assets. Graphics primitives here are fallback, room masks, UI, or debug only.
 */

import Phaser from '/vendor/phaser.esm.js';
import { ASSET_ENTRIES, FALLBACK_ASSET_KEY, assetForCharacter, assetForObject, assetForVehicle, roomFloorAsset } from './assetRegistry.js';
import { updateGameActivities } from './activitySystems.js';
import { resolveArrival, updateActions } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { updateAutonomy } from './autonomy.js';
import { doorways, windows } from './blueprint.js';
import { COLORS, MOODS, PLAY_H, PLAY_W } from './config.js';
import { bootCanvasGame } from './canvasRuntime.js';
import { createState } from './state.js';
import { createUi } from './ui.js';
import { updateMovement } from './movement.js';
import { objects, floors } from './world.js';
import { formatTime } from './renderHelpers.js';
import { syncPhoneUi } from './phoneUI.js';
import { updateVehicleDeparture } from './vehicleSystem.js';

const VIEW_W = 960;
const VIEW_H = 720;

export function bootPhaserGame() {
  const canvas = document.getElementById('game');
  try {
    return new Phaser.Game({
      type: Phaser.AUTO,
      canvas,
      width: VIEW_W,
      height: VIEW_H,
      backgroundColor: '#1d222b',
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: VIEW_W, height: VIEW_H },
      scene: [ApartmentGodAssetScene]
    });
  } catch (error) {
    console.error('[Apartment God] Phaser boot failed. Falling back to Canvas runtime.', error);
    return bootCanvasGame('emergency canvas fallback');
  }
}

class ApartmentGodAssetScene extends Phaser.Scene {
  constructor() { super('ApartmentGodAssetScene'); }

  preload() {
    for (const entry of ASSET_ENTRIES) {
      if (entry.type === 'svg') this.load.svg(entry.key, entry.path);
      else this.load.image(entry.key, entry.path);
    }
  }

  create() {
    this.state = createState();
    this.ui = createUi(this.state, this.game.canvas, { externalInput: true });
    this.g = this.add.graphics();
    this.rendered = [];
    this.missingLogged = new Set();
    this.input.on('pointerdown', pointer => {
      this.ui.handleCanvasPoint(pointer.x, pointer.y, pointer.event?.offsetX ?? pointer.x, pointer.event?.offsetY ?? pointer.y);
    });
  }

  update(_time, deltaMs) {
    const rawDt = Math.min(0.05, deltaMs / 1000);
    const dt = this.state.paused ? 0 : rawDt * this.state.speed;
    if (dt > 0) {
      for (const entity of this.state.entities) {
        const arrived = updateMovement(this.state, entity, dt);
        if (arrived) resolveArrival(this.state, entity);
      }
      updateActions(this.state, dt);
      updateVehicleDeparture(this.state, dt);
      updateGameActivities(this.state, dt);
      updateAutoHooks(this.state, dt);
      updateAutonomy(this.state, dt);
      this.state.time += dt * 0.6;
    }
    syncPhoneUi(this.state);
    this.renderFrame();
    this.ui.renderHud();
  }

  renderFrame() {
    this.clearFrame();
    this.drawWorld();
    this.drawObjects();
    this.drawDynamic();
    this.drawCharacters();
    this.drawStatus();
    this.drawOffsiteOverlay();
  }

  clearFrame() {
    this.g.clear();
    for (const item of this.rendered) item.destroy();
    this.rendered.length = 0;
  }

  drawWorld() {
    const floor = floors[this.state.floor];
    this.g.fillStyle(0xeee5d8, 1).fillRect(0, 0, PLAY_W, PLAY_H);
    this.g.fillStyle(0x1d222b, 1).fillRect(PLAY_W, 0, VIEW_W - PLAY_W, VIEW_H);
    for (const room of floor.rooms) {
      const lit = this.state.roomLights[room.id] !== false;
      this.g.fillStyle(0x2d2824, 1).fillRoundedRect(room.x, room.y, room.w, room.h, 4);
      this.g.fillStyle(0xf6efe4, 1).fillRoundedRect(room.x + 5, room.y + 5, room.w - 10, room.h - 10, 3);
      const floorKey = this.safeKey(roomFloorAsset(room));
      const tile = this.add.tileSprite(room.x + room.w / 2, room.y + room.h / 2, Math.max(8, room.w - 26), Math.max(8, room.h - 26), floorKey);
      tile.setDepth(1);
      tile.setAlpha(lit ? 1 : 0.72);
      this.rendered.push(tile);
      this.label(room.x + 18, room.y + 17, room.name, 12, '#51483f', { fontStyle: '800' }, 50);
    }
    for (const doorway of doorways.filter(d => d.floor === this.state.floor)) {
      this.g.fillStyle(0xd8c09a, 1).fillRect(doorway.x - 2, doorway.y - 2, doorway.w + 4, doorway.h + 4);
    }
    const openWindows = this.state.objectState.openWindows || {};
    for (const windowDef of windows.filter(w => w.floor === this.state.floor)) {
      this.g.fillStyle(openWindows[windowDef.id] ? 0xc6eef0 : 0xa8d2d8, 1).fillRect(windowDef.x, windowDef.y, windowDef.w, windowDef.h);
    }
    this.label(26, 676, floor.name, 22, '#352f2a', { fontStyle: '900' }, 5000);
  }

  drawObjects() {
    for (const object of objects.filter(o => o.floor === this.state.floor)) {
      if (object.kind === 'car' && this.state.objectState.vehicleInUse === object.id) continue;
      const key = this.safeKey(assetForObject(object), object.kind);
      const image = this.sprite(key, object.x + object.w / 2, object.y + object.h / 2, object.w, object.h, object.y + object.h);
      image.setName(object.id || object.kind);
      if (key === FALLBACK_ASSET_KEY) this.label(object.x + 4, object.y + 4, object.kind || object.id, 8, '#211d1a', { fontStyle: '900' }, object.y + object.h + 2);
    }
  }

  drawCharacters() {
    for (const entity of this.state.entities.filter(e => !e.hidden && e.floor === this.state.floor)) {
      const key = this.safeKey(assetForCharacter(entity), entity.id);
      const w = entity.type === 'dog' ? 58 : 46;
      const h = entity.type === 'dog' ? 42 : 68;
      this.sprite(key, entity.x, entity.y, w, h, entity.y + 400);
      const mood = MOODS[entity.mood] || MOODS.neutral;
      this.label(entity.x - 14, entity.y - 56, mood, 18, '#f4f7fb', {}, entity.y + 520);
      this.label(entity.x - 26, entity.y + 32, entity.name, 10, '#352f2a', { fontStyle: '800' }, entity.y + 521);
      if (entity.bubble && entity.bubbleT > 0) this.label(entity.x + 22, entity.y - 64, entity.bubble, 12, '#10141b', { backgroundColor: '#f8fbff', padding: { x: 8, y: 4 }, fontStyle: '900' }, entity.y + 522);
    }
  }

  drawDynamic() {
    if (this.state.vehicleDeparture && this.state.floor === 3) this.drawVehicleSprite(this.state.vehicleDeparture, 'Leaving');
    if (this.state.vehicleReturn && this.state.floor === 3) this.drawVehicleSprite(this.state.vehicleReturn, 'Returning');
    if (this.state.fetch?.ball && this.state.fetch.ball.floor === this.state.floor) {
      this.g.fillStyle(0xf1c66a, 1).fillCircle(this.state.fetch.ball.x, this.state.fetch.ball.y, 8);
      this.g.lineStyle(2, 0x11151c, 1).strokeCircle(this.state.fetch.ball.x, this.state.fetch.ball.y, 8);
    }
    if (this.state.buildPick) this.label(294, 14, `Tap placement spot for ${this.state.buildPick.label}`, 15, '#f8fbff', { backgroundColor: 'rgba(10,12,18,.78)', padding: { x: 10, y: 6 }, fontStyle: '900' }, 9000);
  }

  drawVehicleSprite(vehicle, label) {
    const key = this.safeKey(assetForVehicle(vehicle), vehicle.vehicleKind || vehicle.vehicleId);
    this.sprite(key, vehicle.x + (vehicle.w || 116) / 2, vehicle.y + (vehicle.h || 230) / 2, vehicle.w || 116, vehicle.h || 230, 3500);
    if (vehicle.open) this.label(vehicle.x + (vehicle.w || 116) + 10, vehicle.y + 40, 'door open', 11, '#f1c66a', { fontStyle: '900' }, 3600);
    else this.label(vehicle.x + 10, vehicle.y + 10, label, 11, '#f1c66a', { fontStyle: '900' }, 3600);
  }

  drawStatus() {
    this.g.fillStyle(0x0a0c12, .72).fillRoundedRect(12, 10, 440, 34, 9);
    const s = this.state;
    const trash = s.garbage ? ` trash ${Math.round(s.garbage.kitchen || 0)}%` : '';
    const mode = s.autonomyMode || 'guided';
    this.label(24, 18, `${formatTime(s.time)}   $${Math.round(s.money ?? 0)}   ${mode}${trash}`, 16, COLORS.text, { fontStyle: '900' }, 10000);
  }

  drawOffsiteOverlay() {
    const offsite = this.state.offsite;
    if (!offsite) return;
    const allPeopleAway = this.state.entities.filter(e => e.type === 'person').every(e => e.hidden);
    if (!allPeopleAway) {
      this.g.fillStyle(0x080a0f, .78).fillRoundedRect(682, 12, 266, 58, 12);
      this.label(736, 28, `Off site: ${offsite.label || offsite.actionId}`, 13, '#f4f7fb', { fontStyle: '900' }, 10001);
      this.label(736, 48, offsite.stage === 'plane' ? 'Plane travel' : 'Activity', 11, '#b6c1d2', { fontStyle: '700' }, 10001);
      return;
    }
    this.g.fillStyle(0x080a0f, .62).fillRect(0, 0, PLAY_W, PLAY_H);
    this.label(320, 300, offsite.label || offsite.actionId.replaceAll('_', ' '), 34, '#f4f7fb', { fontStyle: '900' }, 10002);
    this.label(410, 354, offsite.stage === 'plane' ? 'Plane interior asset pending' : `Clock ${formatTime(this.state.time)}`, 20, '#f4f7fb', { fontStyle: '700' }, 10002);
  }

  sprite(key, x, y, width, height, depth) {
    const image = this.add.image(x, y, this.safeKey(key));
    image.setDisplaySize(Math.max(4, width), Math.max(4, height));
    image.setDepth(depth);
    this.rendered.push(image);
    return image;
  }

  label(x, y, text, size = 12, color = '#f4f7fb', style = {}, depth = 1000) {
    const label = this.add.text(x, y, text, { fontFamily: 'system-ui, Segoe UI, sans-serif', fontSize: `${size}px`, color, ...style });
    label.setDepth(depth);
    this.rendered.push(label);
    return label;
  }

  safeKey(key, source = '') {
    if (this.textures.exists(key)) return key;
    if (source && !this.missingLogged.has(source)) {
      this.missingLogged.add(source);
      console.info(`[Apartment God art fallback] Missing production asset for ${source}.`);
    }
    return FALLBACK_ASSET_KEY;
  }
}
