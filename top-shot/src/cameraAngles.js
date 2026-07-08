import { ARENA_H, ARENA_W } from './config.js';

const MAP_W = 34;
const MAP_D = 25.5;

const CAMERA_PRESETS = {
  topdown: {
    label: 'Top Down',
    description: 'straight overhead tactical read that zooms toward close combat',
    heightBase: 12.5,
    heightScale: 1.55,
    minHeight: 13.5,
    maxHeight: 34,
    closePadding: 5.2,
    farPadding: 9.4,
    offsetX: 0,
    offsetZ: 0,
    up: [0, 0, -1]
  },
  high: {
    label: 'High Tactical',
    description: 'mostly overhead with a slight forward lean',
    heightBase: 12,
    heightScale: 1.5,
    minHeight: 13,
    maxHeight: 32,
    closePadding: 5,
    farPadding: 9.2,
    offsetX: 0,
    offsetZ: 0.18,
    up: [0, 1, 0]
  },
  oblique: {
    label: 'Oblique',
    description: 'angled action-board view',
    heightBase: 11,
    heightScale: 1.36,
    minHeight: 12.5,
    maxHeight: 30,
    closePadding: 5,
    farPadding: 9,
    offsetX: 0.28,
    offsetZ: 0.42,
    up: [0, 1, 0]
  },
  isometric: {
    label: 'Isometric',
    description: 'optional diagonal 3D view',
    heightBase: 11,
    heightScale: 1.28,
    minHeight: 13,
    maxHeight: 30,
    closePadding: 5.5,
    farPadding: 9.5,
    offsetX: 0.48,
    offsetZ: 0.54,
    up: [0, 1, 0]
  }
};

const CAMERA_ORDER = ['topdown', 'high', 'oblique', 'isometric'];
const CAMERA_KEYS = {
  '1': 'topdown',
  '2': 'high',
  '3': 'oblique',
  '4': 'isometric',
  t: 'topdown',
  h: 'high',
  o: 'oblique',
  i: 'isometric'
};

export function installCameraAngleControls(world, overlayEl) {
  if (!world || world.__topShotCameraControlsInstalled) return world;
  world.__topShotCameraControlsInstalled = true;
  world.cameraMode = 'topdown';

  world.setCameraMode = mode => {
    if (!CAMERA_PRESETS[mode]) return world.cameraMode;
    world.cameraMode = mode;
    announceCameraMode(world, overlayEl, true);
    return world.cameraMode;
  };

  world.cycleCameraMode = () => {
    const index = CAMERA_ORDER.indexOf(world.cameraMode);
    const next = CAMERA_ORDER[(index + 1) % CAMERA_ORDER.length] || 'topdown';
    return world.setCameraMode(next);
  };

  world.updateCamera = function updateCamera(dt, state, actorEntities = []) {
    const THREE = this.THREE;
    const active = actorEntities.filter(f => !f.extracted);
    const points = active.map(f => arenaToWorld(f.x, f.y));
    const target = new THREE.Vector3(0, 0, 0);
    let span = 8;
    let combatFocus = 1;

    if (points.length) {
      const minX = Math.min(...points.map(p => p.x));
      const maxX = Math.max(...points.map(p => p.x));
      const minZ = Math.min(...points.map(p => p.z));
      const maxZ = Math.max(...points.map(p => p.z));
      target.set((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
      const rawSpan = Math.max(maxX - minX, maxZ - minZ);
      const fighterDistance = points.length > 1 ? Math.hypot(points[0].x - points[1].x, points[0].z - points[1].z) : rawSpan;
      combatFocus = clamp((fighterDistance - 3.2) / 8.8, 0, 1);
      const preset = CAMERA_PRESETS[this.cameraMode] || CAMERA_PRESETS.topdown;
      const padding = lerp(preset.closePadding, preset.farPadding, combatFocus);
      span = Math.max(rawSpan + padding, padding);
    }

    const preset = CAMERA_PRESETS[this.cameraMode] || CAMERA_PRESETS.topdown;
    const height = clamp(span * preset.heightScale + preset.heightBase, preset.minHeight, preset.maxHeight);
    const desiredPosition = new THREE.Vector3(
      target.x + height * preset.offsetX,
      height,
      target.z + height * preset.offsetZ
    );
    const alpha = 1 - Math.pow(0.001, dt);

    this.cameraTarget.lerp(desiredPosition, alpha);
    this.cameraLook.lerp(target, alpha);
    this.camera.position.copy(this.cameraTarget);
    this.camera.up.set(preset.up[0], preset.up[1], preset.up[2]);
    this.camera.lookAt(this.cameraLook.x, 0, this.cameraLook.z);
  };

  window.addEventListener('keydown', event => {
    if (!world || event.defaultPrevented) return;
    const key = event.key.toLowerCase();
    if (key === 'v') {
      world.cycleCameraMode();
      event.preventDefault();
      return;
    }
    const mode = CAMERA_KEYS[key];
    if (!mode) return;
    world.setCameraMode(mode);
    event.preventDefault();
  });

  announceCameraMode(world, overlayEl, false);
  return world;
}

function announceCameraMode(world, overlayEl, userTriggered) {
  const preset = CAMERA_PRESETS[world.cameraMode] || CAMERA_PRESETS.topdown;
  if (!overlayEl || !userTriggered) return;
  overlayEl.textContent = `Camera: ${preset.label}. 1 Top Down, 2 High, 3 Oblique, 4 Isometric, V cycles.`;
}

function arenaToWorld(x, y) {
  return {
    x: (x / ARENA_W - 0.5) * MAP_W,
    z: (y / ARENA_H - 0.5) * MAP_D
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}
