import { ARENA_H, ARENA_W } from '../config.js';

const MAP_W = 34;
const MAP_D = 25.5;
const GRID_STEP = 120;
const DEBUG_UPDATE_HZ = 8;
const DEBUG_UPDATE_INTERVAL = 1 / DEBUG_UPDATE_HZ;
const TEAM_COLORS = { A: '#4dffb8', B: '#ffb45f', preview: '#f0d36a' };

export function installTopShotDebugOverlay3D(world) {
  if (!world || world.__topShotDebugOverlayInstalled) return world?.topShotDebugOverlay || null;
  const overlay = new TopShotDebugOverlay3D(world);
  world.__topShotDebugOverlayInstalled = true;
  world.topShotDebugOverlay = overlay;

  const baseUpdate = world.update.bind(world);
  world.update = function updateWithDebugOverlay(dt, state) {
    overlay.sync(state, dt);
    baseUpdate(dt, state);
  };

  world.toggleTopShotDebugOverlay = () => overlay.toggle();
  world.setTopShotDebugOverlay = visible => overlay.setVisible(visible);

  window.addEventListener('keydown', event => {
    const targetName = String(event.target?.tagName || '').toLowerCase();
    if (['input', 'select', 'textarea'].includes(targetName)) return;
    if (event.key.toLowerCase() !== 'd') return;
    const visible = overlay.toggle();
    window.__topShotDebugOverlayVisible = visible;
    event.preventDefault();
  });

  return overlay;
}

class TopShotDebugOverlay3D {
  constructor(world) {
    this.world = world;
    this.THREE = world.THREE;
    this.enabled = false;
    this.refreshT = DEBUG_UPDATE_INTERVAL;
    this.root = new this.THREE.Group();
    this.root.name = 'top-shot-debug-telemetry-root';
    this.root.visible = false;
    this.gridRoot = new this.THREE.Group();
    this.dynamicRoot = new this.THREE.Group();
    this.root.add(this.gridRoot, this.dynamicRoot);
    world.scene.add(this.root);
    this.buildGrid();
  }

  toggle() {
    return this.setVisible(!this.enabled);
  }

  setVisible(visible) {
    this.enabled = Boolean(visible);
    this.root.visible = this.enabled;
    this.refreshT = DEBUG_UPDATE_INTERVAL;
    if (!this.enabled) clearGroup(this.dynamicRoot);
    return this.enabled;
  }

  sync(state, dt = 0) {
    if (!this.enabled) return;
    this.refreshT += Math.max(0, dt);
    if (this.refreshT < DEBUG_UPDATE_INTERVAL) return;
    this.refreshT = 0;
    clearGroup(this.dynamicRoot);
    if (!state) return;
    this.drawHeader(state);
    this.drawArenaBounds();
    for (const fighter of state.fighters || []) this.drawFighter(state, fighter);
    this.drawRelations(state);
    this.drawPickups(state);
    this.drawProjectiles(state);
  }

  buildGrid() {
    for (let x = 0; x <= ARENA_W; x += GRID_STEP) {
      const major = x % (GRID_STEP * 2) === 0;
      this.gridRoot.add(this.line([{ x, y: 0 }, { x, y: ARENA_H }], '#28ff7c', major ? 0.24 : 0.11, 0.045));
    }
    for (let y = 0; y <= ARENA_H; y += GRID_STEP) {
      const major = y % (GRID_STEP * 2) === 0;
      this.gridRoot.add(this.line([{ x: 0, y }, { x: ARENA_W, y }], '#28ff7c', major ? 0.24 : 0.11, 0.045));
    }
  }

  drawHeader(state) {
    const label = state.mode === 'cqc'
      ? `DEBUG CQC | ${formatClock(state.clock)} | ${state.lab?.auto ? 'AUTO' : 'MANUAL'} | ${state.lab?.slowMo ? 'SLOW' : 'REAL TIME'} | ${DEBUG_UPDATE_HZ}HZ`
      : `DEBUG MATCH | ${formatClock(state.clock)} | ${String(state.matchState || 'ready').toUpperCase()} | ${DEBUG_UPDATE_HZ}HZ`;
    this.dynamicRoot.add(this.label(label, 44, 40, '#9dffd1', 1.5));
  }

  drawArenaBounds() {
    const points = [
      { x: 0, y: 0 },
      { x: ARENA_W, y: 0 },
      { x: ARENA_W, y: ARENA_H },
      { x: 0, y: ARENA_H },
      { x: 0, y: 0 }
    ];
    this.dynamicRoot.add(this.line(points, '#73ffb6', 0.44, 0.06));
  }

  drawFighter(state, fighter) {
    const color = TEAM_COLORS[fighter.team] || TEAM_COLORS.preview;
    const radius = fighter.cqc?.coreRadius || 28;
    this.dynamicRoot.add(this.ring(fighter.x, fighter.y, radius, color, fighter.collisionT > 0 ? 0.95 : 0.52, 0.12));
    this.dynamicRoot.add(this.facingRay(fighter, color));

    if (fighter.memory?.lastSeen) {
      this.dynamicRoot.add(this.ring(fighter.memory.lastSeen.x, fighter.memory.lastSeen.y, 18, '#ffea7a', 0.5, 0.16));
      this.dynamicRoot.add(this.line([fighter, fighter.memory.lastSeen], '#ffea7a', 0.32, 0.14));
    }

    const target = fighter.memory?.command || fighter.memory?.navTarget || fighter.brain?.dest || fighter.target;
    if (target && Number.isFinite(target.x) && Number.isFinite(target.y)) {
      this.dynamicRoot.add(this.ring(target.x, target.y, 22, '#ffffff', 0.56, 0.18));
      this.dynamicRoot.add(this.line([fighter, target], '#ffffff', 0.34, 0.14));
      this.dynamicRoot.add(this.label(target.type || fighter.brain?.intent || 'target', target.x + 18, target.y - 18, '#ffffff', 0.8));
    }

    if (state.mode === 'cqc') this.drawCqcHitboxes(fighter, color);

    const status = [fighter.team, fighter.pose || fighter.intent || 'idle'];
    if (fighter.currentMove?.kind) status.push(fighter.currentMove.kind);
    if (fighter.stuckFrames > 0) status.push(`stuck ${fighter.stuckFrames}`);
    if (fighter.cqc?.mounting) status.push('mount top');
    if (fighter.cqc?.mountedBy) status.push('mounted');
    this.dynamicRoot.add(this.label(status.join(' | '), fighter.x + 24, fighter.y - 32, color, 0.9));
    this.dynamicRoot.add(this.label(aiStatusFor(state, fighter), fighter.x + 24, fighter.y + 38, '#c9f7ff', 0.72));
  }

  drawCqcHitboxes(fighter, color) {
    for (const hitbox of fighter.hitboxes || []) {
      const isCore = hitbox.id === 'collision_core';
      const hitboxColor = isCore ? '#ffffff' : color;
      this.dynamicRoot.add(this.ring(hitbox.x, hitbox.y, hitbox.radius, hitboxColor, isCore ? 0.36 : 0.2, isCore ? 0.18 : 0.15));
    }
    if (fighter.cqc?.lastZone) this.dynamicRoot.add(this.label(fighter.cqc.lastZone, fighter.x - 38, fighter.y + 44, '#ffef99', 0.72));
  }

  drawRelations(state) {
    const fighters = state.fighters || [];
    for (const fighter of fighters) {
      const moveTarget = fighter.currentMove?.target ? fighters.find(other => other.id === fighter.currentMove.target) : null;
      if (moveTarget) {
        const label = [fighter.currentMove.kind, fighter.currentMove.zone].filter(Boolean).join(' to ');
        this.dynamicRoot.add(this.line([fighter, moveTarget], '#ff6f5e', 0.78, 0.52));
        this.dynamicRoot.add(this.label(label || fighter.currentMove.id, midpoint(fighter.x, moveTarget.x), midpoint(fighter.y, moveTarget.y) - 18, '#ffd1c8', 0.86));
      }
      const mounted = fighter.cqc?.mounting ? fighters.find(other => other.id === fighter.cqc.mounting) : null;
      if (mounted) {
        this.dynamicRoot.add(this.line([fighter, mounted], '#ff2f6d', 0.9, 0.62));
        this.dynamicRoot.add(this.label('MOUNT LOCK', fighter.x - 34, fighter.y - 54, '#ff9fbd', 0.9));
      }
    }
  }

  drawPickups(state) {
    for (const pickup of state.pickups || []) {
      if (pickup.used) continue;
      this.dynamicRoot.add(this.ring(pickup.x, pickup.y, 18, pickup.color || '#f0d36a', 0.58, 0.16));
      this.dynamicRoot.add(this.label(pickup.type || 'pickup', pickup.x + 16, pickup.y - 14, pickup.color || '#f0d36a', 0.72));
    }
  }

  drawProjectiles(state) {
    for (const projectile of state.projectiles || []) {
      if (!Number.isFinite(projectile.x) || !Number.isFinite(projectile.y)) continue;
      this.dynamicRoot.add(this.ring(projectile.x, projectile.y, projectile.stuck ? 13 : 8, projectile.stuck ? '#b8fffb' : '#fff2a6', 0.44, 0.22));
      if (Number.isFinite(projectile.vx) && Number.isFinite(projectile.vy)) {
        this.dynamicRoot.add(this.line([
          projectile,
          { x: projectile.x + projectile.vx * 0.05, y: projectile.y + projectile.vy * 0.05 }
        ], '#fff2a6', 0.32, 0.28));
      }
    }
  }

  line(points, color, opacity = 0.6, y = 0.1) {
    const THREE = this.THREE;
    const positions = points.map(point => {
      const p = arenaToWorld(point.x, point.y, y);
      return new THREE.Vector3(p.x, p.y, p.z);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(positions);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
    return new THREE.Line(geometry, material);
  }

  facingRay(fighter, color) {
    const facing = fighter.facing || 0;
    const reach = fighter.currentMove ? 78 : 48;
    return this.line([
      fighter,
      { x: fighter.x + Math.cos(facing) * reach, y: fighter.y + Math.sin(facing) * reach }
    ], color, fighter.currentMove ? 0.82 : 0.5, fighter.currentMove ? 0.46 : 0.22);
  }

  ring(x, y, radius, color, opacity = 0.5, lift = 0.12) {
    const THREE = this.THREE;
    const worldRadius = radius / ARENA_W * MAP_W;
    const geometry = new THREE.TorusGeometry(Math.max(0.02, worldRadius), 0.012, 8, 42);
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
    const mesh = new THREE.Mesh(geometry, material);
    const p = arenaToWorld(x, y, lift);
    mesh.position.set(p.x, p.y, p.z);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }

  label(text, x, y, color = '#bfffe1', scale = 1) {
    const THREE = this.THREE;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '800 26px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 14, 8, 0.78)';
    ctx.fillRect(0, 14, canvas.width, 56);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.82;
    ctx.strokeRect(1, 15, canvas.width - 2, 54);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillText(String(text).slice(0, 56), 18, 43);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    const p = arenaToWorld(x, y, 1.72);
    sprite.position.set(p.x, p.y, p.z);
    sprite.scale.set(3.7 * scale, 0.7 * scale, 1);
    return sprite;
  }
}

function aiStatusFor(state, fighter) {
  if (!fighter) return 'ai: none';
  if (state.mode === 'cqc') return cqcStatusFor(state, fighter);
  const other = (state.fighters || []).find(unit => unit.team !== fighter.team && !unit.extracted && !unit.incapacitated && !unit.defeated);
  const parts = [];
  if (fighter.memory?.command?.type) parts.push(`coach:${fighter.memory.command.type}${fighter.memory.command.urgent ? '!' : ''}`);
  if (fighter.brain?.intent) parts.push(`brain:${fighter.brain.intent}`);
  else if (fighter.intent) parts.push(`intent:${fighter.intent}`);
  if (other) {
    parts.push(`${Math.round(distance(fighter, other))}u`);
    parts.push(fighter.spottedT > 0 ? 'spotted' : fighter.memory?.lastSeen ? 'last seen' : 'search');
  }
  if (fighter.awareness?.phase) parts.push(`aware:${fighter.awareness.phase}`);
  if (fighter.coverPinned) parts.push('cover');
  if (fighter.shadowHidden) parts.push('shadow');
  if (fighter.stuckFrames > 0) parts.push(`stuck:${fighter.stuckFrames}`);
  return parts.slice(0, 6).join(' | ') || 'ai: idle';
}

function cqcStatusFor(state, fighter) {
  const parts = [state.lab?.auto ? 'cqc:auto' : 'cqc:manual'];
  if (state.lab?.action) parts.push(`action:${state.lab.action}`);
  if (fighter.cqc?.style) parts.push(fighter.cqc.style);
  if (fighter.cqc?.guard) parts.push(`guard:${fighter.cqc.guard}`);
  if (fighter.currentMove?.kind) parts.push(`move:${fighter.currentMove.kind}`);
  if (fighter.cqc?.lastZone) parts.push(`zone:${fighter.cqc.lastZone}`);
  return parts.slice(0, 6).join(' | ');
}

function arenaToWorld(x, y, lift = 0) {
  return {
    x: (x / ARENA_W - 0.5) * MAP_W,
    y: lift,
    z: (y / ARENA_H - 0.5) * MAP_D
  };
}

function midpoint(a, b) {
  return (a + b) / 2;
}

function distance(a, b) {
  return Math.hypot((a?.x || 0) - (b?.x || 0), (a?.y || 0) - (b?.y || 0));
}

function formatClock(seconds = 0) {
  const total = Math.max(0, Math.floor(seconds));
  const min = String(Math.floor(total / 60)).padStart(2, '0');
  const sec = String(total % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function clearGroup(group) {
  while (group.children.length) {
    const child = group.children.pop();
    disposeObject(child);
  }
}

function disposeObject(object) {
  object.traverse?.(child => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) child.material.forEach(disposeMaterial);
    else disposeMaterial(child.material);
  });
}

function disposeMaterial(material) {
  if (!material) return;
  material.map?.dispose?.();
  material.dispose?.();
}
