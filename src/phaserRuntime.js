import Phaser from '/vendor/phaser.esm.js';
import { createState, selected } from './state.js';
import { createUi } from './ui.js';
import { updateMovement } from './movement.js';
import { resolveArrival, updateActions } from './actions.js';
import { updateAutoHooks } from './autoHooks.js';
import { updateAutonomy } from './autonomy.js';
import { COLORS, MOODS, PLAY_H, PLAY_W } from './config.js';
import { doorways, windows } from './blueprint.js';
import { floors, objects, roomAt } from './world.js';
import { syncPhoneUi } from './phoneUI.js';
import { formatTime } from './renderHelpers.js';

const VIEW_W = 960;
const VIEW_H = 720;

export function bootPhaserGame() {
  const canvas = document.getElementById('game');
  return new Phaser.Game({
    type: Phaser.AUTO,
    canvas,
    width: VIEW_W,
    height: VIEW_H,
    backgroundColor: '#171a22',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: VIEW_W, height: VIEW_H },
    scene: [ApartmentGodScene]
  });
}

class ApartmentGodScene extends Phaser.Scene {
  constructor() { super('ApartmentGod'); }

  create() {
    this.state = createState();
    this.ui = createUi(this.state, this.game.canvas, { externalInput: true });
    this.g = this.add.graphics();
    this.labels = [];
    this.last = 0;
    this.input.on('pointerdown', pointer => {
      this.ui.handleCanvasPoint(pointer.x, pointer.y, pointer.event?.offsetX ?? pointer.x, pointer.event?.offsetY ?? pointer.y);
    });
  }

  update(time, deltaMs) {
    const rawDt = Math.min(0.05, deltaMs / 1000);
    const dt = this.state.paused ? 0 : rawDt * this.state.speed;
    if (dt > 0) {
      for (const entity of this.state.entities) {
        const arrived = updateMovement(this.state, entity, dt);
        if (arrived) resolveArrival(this.state, entity);
      }
      updateActions(this.state, dt);
      updateAutoHooks(this.state, dt);
      updateAutonomy(this.state, dt);
      this.state.time += dt * 0.6;
    }
    syncPhoneUi(this.state);
    this.renderPhaser();
    this.ui.renderHud();
  }

  clearLabels() {
    for (const label of this.labels) label.destroy();
    this.labels.length = 0;
  }

  label(x, y, text, size = 12, color = '#f4f7fb', style = {}) {
    const t = this.add.text(x, y, text, { fontFamily: 'system-ui, Segoe UI, sans-serif', fontSize: `${size}px`, color, ...style });
    t.setDepth(10);
    this.labels.push(t);
    return t;
  }

  renderPhaser() {
    this.clearLabels();
    this.g.clear();
    this.drawWorld();
    this.drawObjects();
    this.drawDynamic();
    this.drawEntities();
    this.drawStatus();
    this.drawOffsiteOverlay();
  }

  drawWorld() {
    const s = this.state;
    const g = this.g;
    g.fillStyle(0x1d2632, 1).fillRect(0, 0, PLAY_W, PLAY_H);
    const floor = floors[s.floor];
    for (const room of floor.rooms) {
      const lit = s.roomLights[room.id] !== false;
      g.fillStyle(roomColor(room, s.floor, lit), 1).fillRect(room.x, room.y, room.w, room.h);
      g.lineStyle(s.floor === 4 ? 3 : 5, s.floor === 4 ? 0x355f4c : 0x61708a, 1).strokeRect(room.x, room.y, room.w, room.h);
      g.fillStyle(lit ? 0xf4dc75 : 0x59606e, 1).fillCircle(room.x + room.w - 24, room.y + 22, 6);
      this.label(room.x + 12, room.y + 12, room.name, 13, '#b6c1d2', { fontStyle: '700' });
    }
    for (const d of doorways.filter(x => x.floor === s.floor)) {
      g.fillStyle(roomColor({ id: 'door' }, s.floor, true), 1).fillRect(d.x, d.y, d.w, d.h);
      g.lineStyle(2, 0xe6eef9, 1).strokeRect(d.x, d.y, d.w, d.h);
    }
    const openWindows = s.objectState.openWindows || {};
    for (const w of windows.filter(x => x.floor === s.floor)) {
      g.fillStyle(openWindows[w.id] ? 0x9ee9ff : 0x4f6d87, 1).fillRect(w.x, w.y, w.w, w.h);
      g.lineStyle(1, openWindows[w.id] ? 0xdffaff : 0xa8bdd1, 1).strokeRect(w.x, w.y - 2, w.w, w.h + 4);
    }
    this.label(26, 676, floor.name, 22, '#f4f7fb', { fontStyle: '900' });
  }

  drawObjects() {
    for (const obj of objects.filter(o => o.floor === this.state.floor)) this.drawObject(obj);
  }

  drawObject(o) {
    const g = this.g;
    const color = objectColor(o.kind);
    if (o.kind === 'swim_pool') {
      g.fillStyle(0x0e5278, 1).fillRoundedRect(o.x, o.y, o.w, o.h, 28);
      g.fillStyle(0x1fa9d8, 1).fillRoundedRect(o.x + 12, o.y + 12, o.w - 24, o.h - 24, 22);
      this.label(o.x + 54, o.y + 80, 'POOL', 18, '#dffaff', { fontStyle: '900' });
      return;
    }
    if (o.kind === 'garage_door') {
      g.fillStyle(this.state.objectState.garageDoorOpen ? 0x74e6ff : 0x2a3140, this.state.objectState.garageDoorOpen ? .35 : 1).fillRect(o.x, o.y, o.w, o.h);
      g.lineStyle(3, 0x74e6ff, 1).strokeRect(o.x, o.y, o.w, o.h);
      this.label(o.x + 12, o.y + 4, this.state.objectState.garageDoorOpen ? 'GARAGE OPEN' : 'GARAGE DOOR', 12, '#dffaff', { fontStyle: '900' });
      return;
    }
    g.fillStyle(color, 1).fillRoundedRect(o.x, o.y, o.w, o.h, Math.min(18, Math.max(4, Math.min(o.w, o.h) / 5)));
    g.lineStyle(2, o.solid ? 0xd7e1f0 : 0x74e6ff, o.solid ? .35 : .65).strokeRoundedRect(o.x, o.y, o.w, o.h, Math.min(18, Math.max(4, Math.min(o.w, o.h) / 5)));
    drawObjectDetail(g, o, this.state);
    const short = shortLabel(o);
    if (short) this.label(o.x + 6, o.y + Math.max(4, o.h / 2 - 7), short, Math.min(12, Math.max(8, o.w / 9)), '#f8fbff', { fontStyle: '900' });
  }

  drawDynamic() {
    const s = this.state;
    const g = this.g;
    if (s.delivery && s.delivery.floor === s.floor) {
      g.fillStyle(0x1e2937, 1).fillRoundedRect(s.delivery.x - 15, s.delivery.y - 10, 30, 38, 8);
      g.fillStyle(0xf1c66a, 1).fillRect(s.delivery.x - 24, s.delivery.y + 3, 16, 14);
      g.fillStyle(0xf8fbff, 1).fillCircle(s.delivery.x, s.delivery.y - 20, 11);
      this.label(s.delivery.x - 24, s.delivery.y - 64, s.delivery.phase === 'arriving' ? '...' : (s.delivery.bubble || 'ORDER'), 12, '#10141b', { backgroundColor: '#f8fbff', padding: { x: 8, y: 4 }, fontStyle: '900' });
    }
    if (s.fetch?.ball && s.fetch.ball.floor === s.floor) {
      g.fillStyle(0xf1c66a, 1).fillCircle(s.fetch.ball.x, s.fetch.ball.y, 8);
      g.lineStyle(2, 0x11151c, 1).strokeCircle(s.fetch.ball.x, s.fetch.ball.y, 8);
    }
    if (s.vehicleDeparture && s.floor === 3) {
      const v = s.vehicleDeparture;
      g.fillStyle(0x202838, 1).fillRoundedRect(v.x, v.y, 230, 116, 26);
      g.fillStyle(0x0d1118, 1).fillRoundedRect(v.x + 46, v.y + 20, 138, 76, 16);
      g.lineStyle(3, 0x74e6ff, 1).strokeRect(v.x + 60, v.y + 30, 110, 56);
      this.label(v.x + 76, v.y + 50, 'LEAVING', 12, '#f1c66a', { fontStyle: '900' });
    }
    if (s.buildPick) this.label(294, 14, `Tap placement spot for ${s.buildPick.label}`, 15, '#f8fbff', { backgroundColor: 'rgba(10,12,18,.78)', padding: { x: 10, y: 6 }, fontStyle: '900' });
  }

  drawEntities() {
    for (const e of this.state.entities.filter(e => !e.hidden && e.floor === this.state.floor)) {
      const g = this.g;
      g.fillStyle(0x000000, .25).fillEllipse(e.x, e.y + 16, 42, 20);
      const body = Phaser.Display.Color.HexStringToColor(e.color || (e.type === 'dog' ? '#d7a66a' : '#79b7ff')).color;
      if (e.type === 'dog') {
        g.fillStyle(body, 1).fillEllipse(e.x, e.y, 42, 28);
        g.fillStyle(0x3d2a1f, 1).fillCircle(e.x + 17, e.y - 5, 10);
      } else {
        g.fillStyle(body, 1).fillRoundedRect(e.x - 14, e.y - 10, 28, 38, 10);
        g.fillStyle(0xf8d6bd, 1).fillCircle(e.x, e.y - 22, 13);
        drawPose(g, e);
      }
      if (e.carrying) this.drawCarry(e);
      const emoji = MOODS[e.mood] || MOODS.neutral;
      this.label(e.x - 14, e.y - 54, emoji, 18);
      this.label(e.x - 26, e.y + 28, e.name, 10, '#f4f7fb', { fontStyle: '800' });
      if (e.bubble && e.bubbleT > 0) this.label(e.x + 22, e.y - 64, e.bubble, 12, '#10141b', { backgroundColor: '#f8fbff', padding: { x: 8, y: 4 }, fontStyle: '900' });
    }
  }

  drawCarry(e) {
    const g = this.g;
    const x = e.x + 20; const y = e.y - 22;
    const item = String(e.carrying).toLowerCase();
    if (item.includes('ball')) { g.fillStyle(0xf1c66a, 1).fillCircle(x, y, 7); g.lineStyle(2, 0x11151c, 1).strokeCircle(x, y, 7); return; }
    if (item.includes('trash')) { g.fillStyle(0x20252f, 1).fillRoundedRect(x - 10, y - 8, 20, 18, 5); this.label(x - 7, y - 7, 'TR', 7, '#f8fbff', { fontStyle: '900' }); return; }
    if (item.includes('bag') || item.includes('food')) { g.fillStyle(0xf1c66a, 1).fillRoundedRect(x - 10, y - 8, 20, 18, 5); this.label(x - 8, y - 7, 'FD', 7, '#10141b', { fontStyle: '900' }); return; }
    if (item.includes('dish')) { g.fillStyle(0xd7e1f0, 1).fillRoundedRect(x - 11, y - 5, 22, 10, 5); return; }
    g.fillStyle(0xf1c66a, 1).fillRoundedRect(x - 9, y - 7, 18, 14, 4);
  }

  drawStatus() {
    const s = this.state;
    this.g.fillStyle(0x0a0c12, .72).fillRect(12, 10, 440, 34);
    const trash = s.garbage ? ` trash ${Math.round(s.garbage.kitchen || 0)}%` : '';
    this.label(24, 18, `${formatTime(s.time)}   $${Math.round(s.money ?? 0)}   ${s.autonomyMode || 'guided'}${trash}`, 16, '#f4f7fb', { fontStyle: '900' });
  }

  drawOffsiteOverlay() {
    const s = this.state;
    if (!s.offsite) return;
    this.g.fillStyle(0x080a0f, .54).fillRect(0, 0, PLAY_W, PLAY_H);
    this.label(320, 300, `Time-lapse: ${s.offsite.actionId.replaceAll('_', ' ')}`, 34, '#f4f7fb', { fontStyle: '900' });
    this.label(410, 354, `Clock ${formatTime(s.time)}`, 20, '#f4f7fb', { fontStyle: '700' });
  }
}

function roomColor(room, floor, lit) {
  if (floor === 3) return lit ? 0x2a303b : 0x202631;
  if (floor === 4) return room.id === 'pool_area' ? 0x2e4f44 : 0x244733;
  if (floor === 2 && room.id === 'basement_gym') return lit ? 0x2f3445 : 0x242938;
  return lit ? 0x303b4c : 0x354254;
}

function objectColor(kind) {
  const colors = {
    couch: 0x775f7f, tv: 0x151923, stereo: 0x202735, fridge: 0xd5dde8, stove: 0x606878, sink: 0xaab7c8,
    shower: 0x6d8ea6, toilet: 0xd9e3ef, door: 0x8a5c3d, bed: 0x59739c, desk: 0x795d45, dog_bowl: 0xb43f4e,
    light: 0xffe377, stairs: 0x3b4656, bookshelf: 0x6c4b33, workout: 0x45505e, pool_table: 0x185c4f,
    arcade: 0x22152f, game_console: 0x202735, dartboard: 0x10141b, trash_can: 0x3d4654, outdoor_trash: 0x1f5a47,
    treadmill: 0x1e2734, weight_bench: 0x202735, heavy_bag: 0x3b1622, kennel: 0x4a2f22, car: 0x252d3c,
    bike: 0xd7e1f0, motorbike: 0x111820
  };
  return colors[kind] || 0x667085;
}

function shortLabel(o) {
  const labels = { fridge: 'FRIDGE', stove: 'STOVE', sink: 'SINK', shower: 'SHOWER', toilet: 'WC', door: 'DOOR', stairs: o.toFloor === 4 ? 'YARD' : o.toFloor === 3 ? 'GAR' : o.toFloor === 2 ? 'BASE' : o.toFloor === 1 ? 'UP' : 'MAIN', pet_flap: 'PET', trash_can: 'TRASH', outdoor_trash: 'BIN', treadmill: 'RUN', weight_bench: 'WEIGHTS', heavy_bag: 'BAG', kennel: 'KENNEL', car: 'CAR', bike: 'BIKE', motorbike: 'MOTO' };
  if (o.id?.includes('pet_flap')) return 'PET';
  return labels[o.kind] || o.label?.split(' ').map(w => w[0]).join('').slice(0, 8);
}

function drawObjectDetail(g, o, state) {
  if (o.kind === 'light') g.fillStyle(state.roomLights[roomAt(o.x, o.y, o.floor)?.id] !== false ? 0xffe377 : 0x555d69, 1).fillCircle(o.x + o.w / 2, o.y + o.h / 2, 11);
  if (o.kind === 'tv') g.fillStyle(state.tv.on ? 0x5fc7ff : 0x242b38, 1).fillRect(o.x + 8, o.y + 6, o.w - 16, o.h - 12);
  if (o.kind === 'pool_table') { g.fillStyle(0xf8fbff, 1).fillCircle(o.x + o.w / 2 - 24, o.y + o.h / 2, 7); g.fillStyle(0xf1c66a, 1).fillCircle(o.x + o.w / 2 + 22, o.y + o.h / 2 - 12, 6); }
  if (o.kind === 'trash_can') { g.fillStyle((state.garbage?.kitchen || 0) > 80 ? 0x6a2a2a : 0x3d4654, 1).fillRoundedRect(o.x, o.y, o.w, o.h, 6); }
}

function drawPose(g, e) {
  const x = e.x; const y = e.y;
  g.lineStyle(3, 0xf4f7fb, .75);
  if (e.pose === 'treadmill' || e.pose === 'walk') { g.lineBetween(x - 10, y + 22, x - 24, y + 38); g.lineBetween(x + 10, y + 22, x + 24, y + 36); return; }
  if (e.pose === 'lift_weights') { g.lineBetween(x - 28, y - 18, x + 28, y - 18); g.fillStyle(0xf4f7fb, 1).fillRect(x - 34, y - 24, 8, 12).fillRect(x + 26, y - 24, 8, 12); return; }
  if (e.pose === 'heavy_bag') { g.lineBetween(x + 10, y - 2, x + 30, y - 8); return; }
  if (e.pose === 'swim') { g.lineBetween(x - 24, y, x + 24, y); return; }
  if (e.pose === 'throw') { g.lineBetween(x + 8, y - 8, x + 28, y - 26); return; }
  g.lineBetween(x - 14, y + 8, x - 28, y + 18); g.lineBetween(x + 14, y + 8, x + 28, y + 18);
}
