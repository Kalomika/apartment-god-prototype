import { createState, selected, byId } from '../state.js';
import { ACTIONS, COLORS, DOG_SOCIAL_ACTIONS, NEEDS, PLAY_H, PLAY_W, SOCIAL_ACTIONS } from '../config.js';
import { resolveArrival, startObjectAction, startSocialAction, throwFetchBall, updateActions } from '../actions.js';
import { updateAutoHooks } from '../autoHooks.js';
import { updateAutonomy } from '../autonomy.js';
import { commandMove } from '../movement.js';
import { floors, objectAt, objects, roomAt } from '../world.js';
import { formatTime } from '../renderHelpers.js';

const WORLD_SCALE = 1;
const HUD_IDS = ['selected-name', 'current-action', 'needs', 'world-state', 'log'];
const PALETTE = {
  ink: 0x071018,
  wall: 0x263241,
  wallDark: 0x1d2632,
  floor: 0x303b4c,
  floorAlt: 0x354254,
  roomLine: 0x61708a,
  active: 0xf2d66d,
  resident: 0x79b7ff,
  girlfriend: 0xf2a3d7,
  dog: 0xd7a66a,
  text: '#f4f7fb',
  muted: '#b6c1d2'
};

export function startTopShotPhaser() {
  const canvas = document.getElementById('game');
  const config = {
    type: Phaser.AUTO,
    canvas,
    width: 1280,
    height: 720,
    backgroundColor: '#081019',
    physics: {
      default: 'arcade',
      arcade: { debug: false }
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false
    },
    scene: [ApartmentScene]
  };
  return new Phaser.Game(config);
}

class ApartmentScene extends Phaser.Scene {
  constructor() {
    super('ApartmentScene');
    this.state = null;
    this.rigs = new Map();
    this.objectLabels = [];
    this.lastFloor = -1;
    this.menuEl = null;
    this.hudReady = false;
  }

  create() {
    this.state = createState();
    this.menuEl = document.getElementById('interaction-menu');
    this.worldGraphics = this.add.graphics();
    this.objectGraphics = this.add.graphics();
    this.fxGraphics = this.add.graphics();
    this.objectLabels = [];

    this.buildEntityRigs();
    this.bindDomControls();
    this.bindInput();
    this.drawStaticFloor(true);
    this.renderHud();
  }

  update(_time, deltaMs) {
    const rawDt = Math.min(0.05, deltaMs / 1000);
    const dt = this.state.paused ? 0 : rawDt * this.state.speed;

    if (dt > 0) {
      for (const entity of this.state.entities) {
        const arrived = updateMovementSafe(this.state, entity, dt);
        if (arrived) resolveArrival(this.state, entity);
      }
      updateActions(this.state, dt);
      updateAutoHooks(this.state, dt);
      updateAutonomy(this.state, dt);
      this.state.time += dt * 0.6;
    }

    if (this.lastFloor !== this.state.floor) this.drawStaticFloor(true);
    this.syncEntityRigs();
    this.drawDynamicFx();
    this.renderHud();
  }

  buildEntityRigs() {
    for (const entity of this.state.entities) {
      const rig = entity.type === 'dog' ? createDogRig(this, entity) : createPersonRig(this, entity);
      this.rigs.set(entity.id, rig);
    }
  }

  bindDomControls() {
    for (let i = 0; i <= 4; i += 1) {
      document.getElementById(`floor-${i}`)?.addEventListener('click', () => {
        this.state.floor = i;
        this.state.viewHoldT = 0;
        this.hideMenu();
      });
    }
    document.getElementById('speed-1')?.addEventListener('click', () => { this.state.speed = 1; });
    document.getElementById('speed-3')?.addEventListener('click', () => { this.state.speed = 3; });
    document.getElementById('pause')?.addEventListener('click', () => { this.state.paused = !this.state.paused; });
    document.getElementById('reset')?.addEventListener('click', () => {
      this.state = createState();
      this.rigs.forEach(rig => rig.container.destroy(true));
      this.rigs.clear();
      this.buildEntityRigs();
      this.hideMenu();
      this.drawStaticFloor(true);
    });
    this.hudReady = HUD_IDS.every(id => Boolean(document.getElementById(id)));
  }

  bindInput() {
    this.input.on('pointerdown', pointer => {
      const x = pointer.x / WORLD_SCALE;
      const y = pointer.y / WORLD_SCALE;
      if (x > PLAY_W || y > PLAY_H) return;

      const entityHit = this.hitEntity(x, y);
      if (entityHit) {
        this.state.selectedId = entityHit.id;
        this.hideMenu();
        return;
      }

      const actor = selected(this.state);
      const obj = objectAt(x, y, this.state.floor);
      if (obj) {
        this.showObjectMenu(obj, pointer.x, pointer.y);
        return;
      }

      if (throwFetchBall(this.state, x, y)) {
        this.hideMenu();
        return;
      }

      commandMove(actor, x, y, pointer.event?.shiftKey === true);
      this.hideMenu();
    });
  }

  hitEntity(x, y) {
    let best = null;
    let bestDist = Infinity;
    for (const e of this.state.entities) {
      if (e.hidden || e.floor !== this.state.floor) continue;
      const dist = Math.hypot(e.x - x, e.y - y);
      const radius = e.type === 'dog' ? 32 : 38;
      if (dist < radius && dist < bestDist) {
        best = e;
        bestDist = dist;
      }
    }
    return best;
  }

  showObjectMenu(obj, screenX, screenY) {
    if (!this.menuEl) return;
    const actor = selected(this.state);
    const actions = ACTIONS[obj.kind] || [];
    this.menuEl.innerHTML = '';

    const title = document.createElement('strong');
    title.textContent = obj.label;
    this.menuEl.append(title);

    for (const [id, label] of actions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => {
        startObjectAction(this.state, actor, obj, id);
        this.hideMenu();
      });
      this.menuEl.append(button);
    }

    const otherTargets = this.state.entities.filter(e => e.id !== actor.id && !e.hidden && e.floor === actor.floor);
    if (otherTargets.length) {
      const divider = document.createElement('span');
      divider.textContent = 'Social';
      divider.className = 'menu-divider';
      this.menuEl.append(divider);
      for (const target of otherTargets) {
        const socialSet = target.type === 'dog' ? DOG_SOCIAL_ACTIONS : SOCIAL_ACTIONS;
        for (const [id, label] of socialSet.slice(0, 4)) {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = `${label}: ${target.name}`;
          button.addEventListener('click', () => {
            startSocialAction(this.state, actor, target, id);
            this.hideMenu();
          });
          this.menuEl.append(button);
        }
      }
    }

    this.menuEl.style.left = `${Math.min(screenX, 820)}px`;
    this.menuEl.style.top = `${Math.min(screenY, 610)}px`;
    this.menuEl.classList.remove('hidden');
  }

  hideMenu() {
    if (!this.menuEl) return;
    this.menuEl.classList.add('hidden');
    this.menuEl.innerHTML = '';
  }

  drawStaticFloor(force = false) {
    if (!force && this.lastFloor === this.state.floor) return;
    this.lastFloor = this.state.floor;
    this.worldGraphics.clear();
    this.objectGraphics.clear();
    for (const label of this.objectLabels) label.destroy();
    this.objectLabels = [];

    const floor = floors[this.state.floor];
    this.worldGraphics.fillStyle(0x111925, 1);
    this.worldGraphics.fillRect(0, 0, PLAY_W, PLAY_H);
    drawGrid(this.worldGraphics);

    for (const room of floor.rooms) {
      const fill = room.id.includes('bath') ? 0x374556 : room.id.includes('garage') ? 0x2b323d : room.id.includes('yard') ? 0x263a2e : PALETTE.floor;
      this.worldGraphics.fillStyle(fill, 1);
      this.worldGraphics.fillRoundedRect(room.x, room.y, room.w, room.h, 8);
      this.worldGraphics.lineStyle(3, PALETTE.roomLine, 0.92);
      this.worldGraphics.strokeRoundedRect(room.x, room.y, room.w, room.h, 8);

      const text = this.add.text(room.x + 12, room.y + 10, room.name, {
        fontFamily: 'system-ui', fontSize: '13px', fontStyle: '700', color: PALETTE.muted
      }).setDepth(2);
      this.objectLabels.push(text);
    }

    for (const obj of objects.filter(o => o.floor === this.state.floor)) this.drawObject(obj);
  }

  drawObject(obj) {
    const g = this.objectGraphics;
    const style = objectStyle(obj.kind);
    g.fillStyle(style.fill, style.alpha);
    g.lineStyle(style.lineWidth, style.stroke, 0.95);
    if (style.round) {
      g.fillRoundedRect(obj.x, obj.y, obj.w, obj.h, style.round);
      g.strokeRoundedRect(obj.x, obj.y, obj.w, obj.h, style.round);
    } else {
      g.fillRect(obj.x, obj.y, obj.w, obj.h);
      g.strokeRect(obj.x, obj.y, obj.w, obj.h);
    }

    if (obj.kind === 'tv' || obj.kind === 'arcade' || obj.kind === 'game_console') {
      g.fillStyle(0x74e6ff, 0.2);
      g.fillRect(obj.x + 6, obj.y + 6, Math.max(8, obj.w - 12), Math.max(8, obj.h - 12));
    }
    if (obj.kind === 'swim_pool') {
      g.fillStyle(0x74e6ff, 0.35);
      g.fillRoundedRect(obj.x + 10, obj.y + 10, obj.w - 20, obj.h - 20, 28);
    }
    if (obj.kind === 'car') {
      g.fillStyle(0x090c11, 0.75);
      g.fillRoundedRect(obj.x + 18, obj.y + 24, obj.w - 36, 42, 12);
      g.fillRoundedRect(obj.x + 18, obj.y + obj.h - 66, obj.w - 36, 42, 12);
    }

    const label = this.add.text(obj.x + obj.w / 2, obj.y + obj.h / 2, labelForObject(obj), {
      fontFamily: 'system-ui', fontSize: '9px', fontStyle: '900', color: '#f4f7fb', align: 'center'
    }).setOrigin(0.5).setDepth(obj.y + obj.h + 1);
    this.objectLabels.push(label);
  }

  syncEntityRigs() {
    const selectedId = this.state.selectedId;
    for (const e of this.state.entities) {
      const rig = this.rigs.get(e.id);
      if (!rig) continue;
      rig.container.setVisible(!e.hidden && e.floor === this.state.floor);
      if (e.hidden || e.floor !== this.state.floor) continue;
      updateRigVisual(this, rig, e, selectedId === e.id);
    }
  }

  drawDynamicFx() {
    const g = this.fxGraphics;
    g.clear();
    const state = this.state;
    const fetchBall = state.fetch?.ball;
    if (fetchBall && fetchBall.floor === state.floor) {
      g.fillStyle(0xf1c66a, 1);
      g.lineStyle(2, PALETTE.ink, 1);
      g.fillCircle(fetchBall.x, fetchBall.y, 8);
      g.strokeCircle(fetchBall.x, fetchBall.y, 8);
    }

    const game = state.poolGame;
    if (game && !game.winner) {
      for (const b of game.balls || []) {
        if (b.pocketed) continue;
        g.fillStyle(hexToInt(b.fill || '#ffffff'), 1);
        g.lineStyle(2, PALETTE.ink, 1);
        g.fillCircle(b.x, b.y, 8);
        g.strokeCircle(b.x, b.y, 8);
      }
    }
  }

  renderHud() {
    if (!this.hudReady) return;
    const actor = selected(this.state);
    const room = roomAt(actor.x, actor.y, actor.floor);
    setText('selected-name', `${actor.name} ${actor.floor === this.state.floor ? '' : `(floor ${actor.floor})`}`);
    setText('current-action', actor.action || 'Idle');

    const needs = document.getElementById('needs');
    needs.innerHTML = '';
    for (const [key, label] of NEEDS) {
      const value = Math.round(actor.needs?.[key] ?? 0);
      const row = document.createElement('div');
      row.className = 'need-row';
      row.innerHTML = `<span>${label}</span><meter min="0" max="100" value="${value}"></meter><b>${value}</b>`;
      needs.append(row);
    }

    const worldState = document.getElementById('world-state');
    worldState.innerHTML = [
      `<div><b>${floors[this.state.floor]?.name || 'Unknown floor'}</b></div>`,
      `<div>Clock: ${formatTime(this.state.time)}</div>`,
      `<div>Money: $${Math.round(this.state.money ?? 0)}</div>`,
      `<div>Mode: ${this.state.autonomyMode || 'guided'}${this.state.paused ? ' paused' : ''}</div>`,
      `<div>Room: ${room?.name || 'Open area'}</div>`
    ].join('');

    const log = document.getElementById('log');
    log.innerHTML = '';
    for (const item of this.state.notifications || []) {
      const li = document.createElement('li');
      li.textContent = item;
      log.append(li);
    }
  }
}

function updateMovementSafe(state, entity, dt) {
  return window.__topShotUpdateMovement(state, entity, dt);
}

function drawGrid(g) {
  g.lineStyle(1, 0xffffff, 0.035);
  for (let x = 0; x <= PLAY_W; x += 32) {
    g.lineBetween(x, 0, x, PLAY_H);
  }
  for (let y = 0; y <= PLAY_H; y += 32) {
    g.lineBetween(0, y, PLAY_W, y);
  }
}

function objectStyle(kind) {
  const map = {
    couch: [0x56384b, 0xff75df, 12], tv: [0x05070a, 0x74e6ff, 4], fridge: [0xcbd8e6, 0x071018, 6], stove: [0x1b2028, 0xf2d66d, 4],
    sink: [0x8292a8, 0x071018, 6], shower: [0x74e6ff, 0xf4f7fb, 12], toilet: [0xf4f7fb, 0x071018, 12], door: [0x7b5636, 0xf2d66d, 3],
    bed: [0x2f4968, 0x79b7ff, 14], desk: [0x6f4a2e, 0x071018, 6], dog_bowl: [0xf1c66a, 0x071018, 12], light: [0xf2d66d, 0xffffff, 12],
    stairs: [0x39485d, 0xf4f7fb, 4], pool_table: [0x124b3c, 0xf1c66a, 14], arcade: [0x2b1235, 0xff75df, 6], game_console: [0x111820, 0x74e6ff, 8],
    dartboard: [0x8a2a2a, 0xf4f7fb, 14], trash_can: [0x25333a, 0x9fb1c8, 4], outdoor_trash: [0x25333a, 0x9fb1c8, 6], treadmill: [0x171b22, 0x74e6ff, 8],
    weight_bench: [0x202733, 0xf4f7fb, 8], heavy_bag: [0x3b1515, 0xf2d66d, 18], swim_pool: [0x10485c, 0x74e6ff, 28], kennel: [0x6b4a2a, 0xf2d66d, 8],
    garage_door: [0x465160, 0xf4f7fb, 2], car: [0x161e2a, 0x74e6ff, 18], bike: [0x10151d, 0xf2d66d, 10], motorbike: [0x10151d, 0xff75df, 12]
  };
  const [fill, stroke, round] = map[kind] || [0x2c3442, 0x61708a, 6];
  return { fill, stroke, round, alpha: 0.94, lineWidth: 2 };
}

function labelForObject(obj) {
  const labels = {
    couch: 'COUCH', tv: 'TV', stereo: 'STEREO', fridge: 'FRIDGE', stove: 'STOVE', sink: 'SINK', shower: 'SHOWER', toilet: 'TOILET', bed: 'BED', desk: 'DESK',
    pool_table: 'POOL', arcade: 'ARCADE', game_console: 'CONSOLE', treadmill: 'RUN', weight_bench: 'LIFT', heavy_bag: 'BAG', swim_pool: 'POOL', kennel: 'KENNEL', car: 'CAR'
  };
  return labels[obj.kind] || obj.label.split(' ').map(w => w[0]).join('').slice(0, 5).toUpperCase();
}

function createPersonRig(scene, entity) {
  const color = entity.id === 'girlfriend' ? PALETTE.girlfriend : PALETTE.resident;
  const dark = entity.id === 'girlfriend' ? 0x17131b : 0x111820;
  const skin = 0x3a241f;
  const lit = 0x5a372f;
  const c = scene.add.container(entity.x, entity.y).setDepth(entity.y);
  const shadow = scene.add.ellipse(0, 16, 54, 28, 0x000000, 0.28);
  const leftLeg = scene.add.rectangle(-8, 18, 9, 34, dark).setOrigin(0.5, 0.1);
  const rightLeg = scene.add.rectangle(8, 18, 9, 34, dark).setOrigin(0.5, 0.1);
  const torso = scene.add.rectangle(0, 0, 32, 44, dark).setStrokeStyle(3, PALETTE.ink);
  const chest = scene.add.rectangle(0, 0, 24, 34, color, 0.28);
  const leftArm = scene.add.rectangle(-23, 0, 8, 34, dark).setOrigin(0.5, 0.05);
  const rightArm = scene.add.rectangle(23, 0, 8, 34, dark).setOrigin(0.5, 0.05);
  const leftHand = scene.add.circle(-25, 30, 6, skin).setStrokeStyle(2, PALETTE.ink);
  const rightHand = scene.add.circle(25, 30, 6, skin).setStrokeStyle(2, PALETTE.ink);
  const neck = scene.add.circle(0, -23, 7, skin).setStrokeStyle(2, PALETTE.ink);
  const head = scene.add.circle(0, -38, 16, skin).setStrokeStyle(3, PALETTE.ink);
  const face = scene.add.circle(0, -35, 10, lit, 0.9);
  const hair = scene.add.ellipse(0, -44, entity.id === 'girlfriend' ? 34 : 27, entity.id === 'girlfriend' ? 28 : 20, 0x05070a, 1).setStrokeStyle(2, PALETTE.ink);
  const select = scene.add.circle(0, 5, 38).setStrokeStyle(3, PALETTE.active).setFillStyle(0x000000, 0).setVisible(false);
  c.add([shadow, leftLeg, rightLeg, torso, chest, leftArm, rightArm, leftHand, rightHand, neck, head, face, hair, select]);
  return { type: 'person', container: c, parts: { leftLeg, rightLeg, leftArm, rightArm, leftHand, rightHand, torso, chest, head, face, hair, shadow, select } };
}

function createDogRig(scene, entity) {
  const c = scene.add.container(entity.x, entity.y).setDepth(entity.y);
  const shadow = scene.add.ellipse(0, 12, 58, 24, 0x000000, 0.26);
  const rearLeg = scene.add.rectangle(-12, 10, 7, 26, 0xf6f2e8).setOrigin(0.5, 0.1);
  const frontLeg = scene.add.rectangle(12, 10, 7, 26, 0xf6f2e8).setOrigin(0.5, 0.1);
  const body = scene.add.ellipse(0, 0, 48, 28, 0xf6f2e8).setStrokeStyle(3, PALETTE.ink);
  const head = scene.add.ellipse(26, -10, 26, 20, 0xf6f2e8).setStrokeStyle(3, PALETTE.ink);
  const nose = scene.add.circle(40, -11, 5, PALETTE.ink);
  const ear1 = scene.add.ellipse(18, -22, 9, 18, 0xd8d0c0).setStrokeStyle(2, PALETTE.ink);
  const ear2 = scene.add.ellipse(31, -21, 9, 18, 0xd8d0c0).setStrokeStyle(2, PALETTE.ink);
  const tail = scene.add.rectangle(-29, -6, 6, 30, 0xf6f2e8).setOrigin(0.5, 0.95).setStrokeStyle(2, PALETTE.ink);
  const collar = scene.add.rectangle(12, -18, 22, 4, PALETTE.resident);
  const select = scene.add.circle(0, 5, 34).setStrokeStyle(3, PALETTE.active).setFillStyle(0x000000, 0).setVisible(false);
  c.add([shadow, rearLeg, frontLeg, body, head, nose, ear1, ear2, tail, collar, select]);
  return { type: 'dog', container: c, parts: { rearLeg, frontLeg, body, head, tail, select } };
}

function updateRigVisual(scene, rig, e, selectedEntity) {
  const c = rig.container;
  c.x = e.x;
  c.y = e.y;
  c.depth = e.y + 100;
  const angle = heading(e);
  c.rotation = angle;
  rig.parts.select?.setVisible(selectedEntity);

  const moving = Boolean(e.path?.length) || e.pose === 'walk' || String(e.action || '').toLowerCase().includes('run');
  const phase = scene.time.now / 120;
  const step = moving ? Math.sin(phase) : Math.sin(scene.time.now / 700) * 0.15;
  if (rig.type === 'person') {
    const seated = e.pose === 'sit' || String(e.action || '').toLowerCase().includes('desk') || String(e.action || '').toLowerCase().includes('tv');
    const sleep = e.pose === 'sleep' || String(e.action || '').toLowerCase().includes('sleep') || String(e.action || '').toLowerCase().includes('nap');
    rig.parts.leftLeg.rotation = seated ? -0.45 : step * 0.35;
    rig.parts.rightLeg.rotation = seated ? 0.45 : -step * 0.35;
    rig.parts.leftArm.rotation = seated ? -0.15 : -step * 0.4;
    rig.parts.rightArm.rotation = seated ? 0.15 : step * 0.4;
    rig.parts.leftHand.x = -25 + Math.sin(rig.parts.leftArm.rotation) * 8;
    rig.parts.rightHand.x = 25 + Math.sin(rig.parts.rightArm.rotation) * 8;
    c.scaleX = sleep ? 1.05 : 1;
    c.scaleY = sleep ? 0.88 : 1;
    c.rotation = sleep ? angle + Math.PI / 2 : angle;
  } else {
    rig.parts.rearLeg.rotation = step * 0.5;
    rig.parts.frontLeg.rotation = -step * 0.5;
    rig.parts.tail.rotation = Math.sin(scene.time.now / 90) * (moving ? 0.5 : 0.18) - 0.2;
  }

  drawSpeech(scene, rig, e);
}

function drawSpeech(scene, rig, e) {
  if (!rig.speech) {
    rig.speech = scene.add.text(0, 0, '', {
      fontFamily: 'system-ui', fontSize: '12px', fontStyle: '900', color: '#071018', backgroundColor: '#f4f7fb', padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setDepth(2000).setVisible(false);
  }
  if (e.bubble && e.bubbleT > 0) {
    rig.speech.setText(e.bubble).setPosition(e.x, e.y - 70).setVisible(true);
  } else {
    rig.speech.setVisible(false);
  }
}

function heading(e) {
  const dx = e.vx || (e.path?.[0] ? e.path[0].x - e.x : 0);
  const dy = e.vy || (e.path?.[0] ? e.path[0].y - e.y : 0);
  if (Math.abs(dx) + Math.abs(dy) < 0.01) return e.lastHeading ?? 0;
  e.lastHeading = Math.atan2(dy, dx) + Math.PI / 2;
  return e.lastHeading;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function hexToInt(hex) {
  return Number.parseInt(String(hex).replace('#', ''), 16) || 0xffffff;
}

import { updateMovement } from '../movement.js';
window.__topShotUpdateMovement = updateMovement;
