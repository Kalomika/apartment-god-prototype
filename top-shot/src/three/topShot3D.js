import { ARENA_H, ARENA_W } from '../config.js';

const THREE_MODULE_URLS = [
  '../../vendor/three.module.js',
  'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js',
  'https://unpkg.com/three@0.164.1/build/three.module.js'
];

const MAP_W = 34;
const MAP_D = 25.5;
const MAX_PIXEL_RATIO = 2;

const COLLISION_VOLUMES = [
  { id: 'north_container_cover', kind: 'box', visual: 'container', x: 112, y: 84, w: 110, h: 86, height: 1.7, cover: true, color: '#65706b' },
  { id: 'long_mid_ruin_wall', kind: 'box', visual: 'ruin', x: 338, y: 86, w: 86, h: 178, height: 2.2, cover: true, color: '#6b6256' },
  { id: 'upper_right_warehouse_shell', kind: 'box', visual: 'ruin', x: 612, y: 112, w: 164, h: 136, height: 2.4, cover: true, color: '#746959' },
  { id: 'east_generator_bank', kind: 'box', visual: 'generator', x: 810, y: 352, w: 96, h: 130, height: 1.35, cover: true, color: '#4d5d61' },
  { id: 'lower_left_scrap_stack', kind: 'box', visual: 'scrap', x: 86, y: 514, w: 118, h: 122, height: 1.2, cover: true, color: '#6b5747' },
  { id: 'lower_mid_water_tank', kind: 'cylinder', visual: 'tank', x: 394, y: 516, w: 108, h: 82, height: 1.4, cover: true, color: '#6d725f' },
  { id: 'lower_right_container_pair', kind: 'box', visual: 'container', x: 604, y: 558, w: 190, h: 64, height: 1.75, cover: true, color: '#5a6b73' },
  { id: 'raised_catwalk_deck', kind: 'elevation', visual: 'platform', x: 604, y: 382, w: 214, h: 82, height: 1.55, elevation: 1.55, cover: false, color: '#4f5c58' },
  { id: 'catwalk_stair_access', kind: 'stairs', visual: 'stairs', x: 550, y: 414, w: 58, h: 112, height: 1.55, elevation: 1.55, access: true, color: '#59615b' }
];

const SHADOW_ZONES = [
  { id: 'shade_north', x: 92, y: 62, w: 150, h: 126, opacity: 0.46 },
  { id: 'shade_mid', x: 318, y: 72, w: 128, h: 216, opacity: 0.42 },
  { id: 'shade_right', x: 590, y: 98, w: 208, h: 182, opacity: 0.38 },
  { id: 'shade_lower_left', x: 68, y: 494, w: 160, h: 166, opacity: 0.45 },
  { id: 'shade_pipe_run', x: 648, y: 332, w: 210, h: 82, opacity: 0.35 }
];

const ROCKS = [
  { x: 70, y: 152, r: 0.42, scale: [1.35, 0.7, 1.05] },
  { x: 264, y: 108, r: 0.28, scale: [1.0, 0.55, 0.8] },
  { x: 304, y: 654, r: 0.34, scale: [1.1, 0.62, 1.0] },
  { x: 522, y: 336, r: 0.24, scale: [0.9, 0.55, 1.4] },
  { x: 890, y: 166, r: 0.38, scale: [1.2, 0.7, 0.85] },
  { x: 878, y: 618, r: 0.31, scale: [0.8, 0.65, 1.3] }
];

const PIPES = [
  { x: 660, y: 322, length: 5.8, axis: 'x', radius: 0.12, lift: 0.18, color: '#5b4f45' },
  { x: 744, y: 322, length: 3.9, axis: 'z', radius: 0.11, lift: 0.18, color: '#4e5754' },
  { x: 274, y: 436, length: 4.4, axis: 'x', radius: 0.09, lift: 0.12, color: '#63594d' }
];

const SCRAP = [
  { x: 148, y: 410, w: 1.9, d: 0.42, rot: -0.45, color: '#8a6245' },
  { x: 232, y: 548, w: 1.2, d: 0.34, rot: 0.62, color: '#6e7171' },
  { x: 514, y: 636, w: 2.1, d: 0.36, rot: -0.18, color: '#7e604f' },
  { x: 836, y: 274, w: 1.55, d: 0.31, rot: 0.82, color: '#8d7a63' },
  { x: 444, y: 284, w: 1.4, d: 0.3, rot: 0.2, color: '#6d5d52' }
];

export async function createTopShot3D(canvas, options = {}) {
  const { THREE, sourceUrl } = await loadThree();
  const world = new TopShot3D(THREE, canvas, sourceUrl, options);
  world.init();
  return world;
}

export function terrainCollisionVolumes() {
  return COLLISION_VOLUMES.map(volume => ({ ...volume }));
}

async function loadThree() {
  let lastError = null;
  for (const sourceUrl of THREE_MODULE_URLS) {
    try {
      const THREE = await import(sourceUrl);
      return { THREE, sourceUrl };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Three.js module could not be loaded.');
}

class TopShot3D {
  constructor(THREE, canvas, threeSource, options = {}) {
    this.THREE = THREE;
    this.canvas = canvas;
    this.threeSource = threeSource;
    this.options = options;
    this.pickupMarkers = new Map();
    this.elapsed = 0;
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    this.cameraLook = new THREE.Vector3(0, 0, 0);
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.resize = this.resize.bind(this);
  }

  init() {
    const THREE = this.THREE;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1a1814');
    this.scene.fog = new THREE.FogExp2('#1a1712', 0.018);

    this.camera = new THREE.PerspectiveCamera(46, 16 / 9, 0.1, 120);
    this.camera.position.set(14, 23, 15);
    this.camera.lookAt(0, 0, 0);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.mapRoot = new THREE.Group();
    this.markerRoot = new THREE.Group();
    this.debugRoot = new THREE.Group();
    this.debugRoot.visible = false;
    this.scene.add(this.mapRoot, this.markerRoot, this.debugRoot);

    this.buildLights();
    this.buildTerrain();
    this.resize();
    window.addEventListener('resize', this.resize);
    return this;
  }

  dispose() {
    window.removeEventListener('resize', this.resize);
    this.renderer?.dispose();
  }

  update(dt, state) {
    this.elapsed += dt;
    this.resize();
    this.syncPickupMarkers(state);
    this.updateCamera(dt, state);
    this.renderer.render(this.scene, this.camera);
  }

  toggleCollisionDebug() {
    this.debugRoot.visible = !this.debugRoot.visible;
    return this.debugRoot.visible;
  }

  arenaPointFromPointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = new this.THREE.Vector3();
    if (!this.raycaster.ray.intersectPlane(this.groundPlane, hit)) return null;
    return worldToArena(hit);
  }

  buildLights() {
    const THREE = this.THREE;
    const hemi = new THREE.HemisphereLight('#f7dca3', '#25333b', 1.25);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight('#fff0c6', 2.2);
    sun.position.set(-8, 20, 8);
    sun.castShadow = true;
    sun.shadow.camera.left = -22;
    sun.shadow.camera.right = 22;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.mapSize.set(2048, 2048);
    this.scene.add(sun);

    const lowFill = new THREE.DirectionalLight('#7ea0b6', 0.35);
    lowFill.position.set(10, 7, -9);
    this.scene.add(lowFill);
  }

  buildTerrain() {
    const THREE = this.THREE;
    this.materials = {
      ground: new THREE.MeshStandardMaterial({ color: '#b07b42', map: this.createGroundTexture(), roughness: 0.95, metalness: 0.02 }),
      rust: new THREE.MeshStandardMaterial({ color: '#7c5238', roughness: 0.88, metalness: 0.18 }),
      metal: new THREE.MeshStandardMaterial({ color: '#596766', roughness: 0.75, metalness: 0.3 }),
      concrete: new THREE.MeshStandardMaterial({ color: '#6f6659', roughness: 0.96, metalness: 0.03 }),
      rubber: new THREE.MeshStandardMaterial({ color: '#151715', roughness: 0.8, metalness: 0.05 }),
      warning: new THREE.MeshStandardMaterial({ color: '#b8914d', roughness: 0.78, metalness: 0.18 }),
      shadow: new THREE.MeshBasicMaterial({ color: '#020407', transparent: true, opacity: 0.42, depthWrite: false })
    };

    const groundGeo = new THREE.PlaneGeometry(MAP_W, MAP_D, 48, 36);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const height = Math.sin(x * 1.1 + y * 0.7) * 0.035 + Math.sin(x * 2.3 - y * 0.9) * 0.018;
      pos.setZ(i, height);
    }
    groundGeo.computeVertexNormals();
    const ground = new THREE.Mesh(groundGeo, this.materials.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.mapRoot.add(ground);

    this.addPerimeter();
    for (const zone of SHADOW_ZONES) this.addShadowPatch(zone);
    for (const volume of COLLISION_VOLUMES) this.addCollisionVisual(volume);
    for (const rock of ROCKS) this.addRock(rock);
    for (const pipe of PIPES) this.addPipe(pipe);
    for (const scrap of SCRAP) this.addScrap(scrap);
    this.addRoadMarks();
    this.addDebugCollision();
  }

  createGroundTexture() {
    const THREE = this.THREE;
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 256;
    textureCanvas.height = 256;
    const ctx = textureCanvas.getContext('2d');
    ctx.fillStyle = '#aa7741';
    ctx.fillRect(0, 0, 256, 256);

    let seed = 42017;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let i = 0; i < 1800; i++) {
      const shade = 120 + Math.floor(rand() * 80);
      ctx.fillStyle = `rgba(${shade}, ${90 + Math.floor(rand() * 52)}, ${46 + Math.floor(rand() * 28)}, ${0.08 + rand() * 0.12})`;
      ctx.fillRect(rand() * 256, rand() * 256, 1 + rand() * 2.8, 1 + rand() * 2.8);
    }

    ctx.strokeStyle = 'rgba(83, 58, 35, 0.22)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      const y = rand() * 256;
      ctx.moveTo(rand() * 40, y);
      ctx.bezierCurveTo(80 + rand() * 60, y + rand() * 18 - 9, 150 + rand() * 60, y + rand() * 22 - 11, 256, y + rand() * 20 - 10);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(51, 45, 38, 0.16)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 72);
    ctx.lineTo(256, 52);
    ctx.moveTo(0, 190);
    ctx.lineTo(256, 208);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 6);
    texture.colorSpace = THREE.SRGBColorSpace;
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy ? this.renderer.capabilities.getMaxAnisotropy() : 1;
    texture.anisotropy = Math.min(8, maxAnisotropy);
    return texture;
  }

  addPerimeter() {
    const THREE = this.THREE;
    const wallMat = new THREE.MeshStandardMaterial({ color: '#2c2e2a', roughness: 0.84, metalness: 0.28 });
    const wallSpecs = [
      { x: 0, z: -MAP_D / 2 - 0.2, w: MAP_W + 1, d: 0.22 },
      { x: 0, z: MAP_D / 2 + 0.2, w: MAP_W + 1, d: 0.22 },
      { x: -MAP_W / 2 - 0.2, z: 0, w: 0.22, d: MAP_D + 1 },
      { x: MAP_W / 2 + 0.2, z: 0, w: 0.22, d: MAP_D + 1 }
    ];
    for (const spec of wallSpecs) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(spec.w, 0.34, spec.d), wallMat);
      mesh.position.set(spec.x, 0.17, spec.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.mapRoot.add(mesh);
    }
  }

  addCollisionVisual(volume) {
    if (volume.visual === 'container') return this.addContainer(volume);
    if (volume.visual === 'ruin') return this.addRuin(volume);
    if (volume.visual === 'generator') return this.addGenerator(volume);
    if (volume.visual === 'scrap') return this.addScrapStack(volume);
    if (volume.visual === 'tank') return this.addTank(volume);
    if (volume.visual === 'platform') return this.addPlatform(volume);
    if (volume.visual === 'stairs') return this.addStairs(volume);
    return null;
  }

  addContainer(volume) {
    const THREE = this.THREE;
    const rect = rectToWorld(volume);
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: volume.color, roughness: 0.78, metalness: 0.42 });
    const shell = new THREE.Mesh(new THREE.BoxGeometry(rect.w, volume.height, rect.d), material);
    shell.position.y = volume.height / 2;
    shell.castShadow = true;
    shell.receiveShadow = true;
    group.add(shell);
    addEdges(THREE, shell, '#222a2a');

    const ribMat = this.materials.rust;
    const ribCount = Math.max(3, Math.floor(rect.w / 1.1));
    for (let i = 0; i < ribCount; i++) {
      const x = -rect.w / 2 + (i + 0.5) * rect.w / ribCount;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.08, volume.height + 0.05, rect.d + 0.08), ribMat);
      rib.position.set(x, volume.height / 2 + 0.02, 0);
      rib.castShadow = true;
      group.add(rib);
    }
    group.position.set(rect.x, 0, rect.z);
    this.mapRoot.add(group);
  }

  addRuin(volume) {
    const THREE = this.THREE;
    const rect = rectToWorld(volume);
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: volume.color, roughness: 0.94, metalness: 0.02 });
    const pieces = [
      { x: -rect.w * 0.2, z: -rect.d * 0.34, w: rect.w * 0.92, d: 0.28, h: volume.height },
      { x: -rect.w * 0.48, z: rect.d * 0.08, w: 0.26, d: rect.d * 0.74, h: volume.height * 0.76 },
      { x: rect.w * 0.35, z: rect.d * 0.35, w: rect.w * 0.42, d: 0.24, h: volume.height * 0.48 }
    ];
    for (const part of pieces) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(part.w, part.h, part.d), mat);
      mesh.position.set(part.x, part.h / 2, part.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      addEdges(THREE, mesh, '#2b241d');
    }
    group.position.set(rect.x, 0, rect.z);
    this.mapRoot.add(group);
  }

  addGenerator(volume) {
    const THREE = this.THREE;
    const rect = rectToWorld(volume);
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(rect.w, volume.height, rect.d), this.materials.metal);
    base.position.y = volume.height / 2;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    addEdges(THREE, base, '#1f2929');

    const grilleMat = new THREE.MeshStandardMaterial({ color: '#1c2425', roughness: 0.74, metalness: 0.42 });
    for (let i = 0; i < 6; i++) {
      const grille = new THREE.Mesh(new THREE.BoxGeometry(rect.w * 0.72, 0.05, 0.05), grilleMat);
      grille.position.set(0, volume.height + 0.04, -rect.d * 0.28 + i * rect.d * 0.11);
      group.add(grille);
    }

    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.85, 14), this.materials.rubber);
    exhaust.position.set(rect.w * 0.28, volume.height + 0.42, rect.d * 0.22);
    exhaust.castShadow = true;
    group.add(exhaust);
    group.position.set(rect.x, 0, rect.z);
    this.mapRoot.add(group);
  }

  addScrapStack(volume) {
    const THREE = this.THREE;
    const rect = rectToWorld(volume);
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(rect.w, 0.35, rect.d), this.materials.rust);
    base.position.y = 0.18;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    for (let i = 0; i < 8; i++) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(rect.w * (0.34 + i * 0.04), 0.08, rect.d * 0.18), i % 2 ? this.materials.metal : this.materials.rust);
      plate.position.set((i - 3.5) * rect.w * 0.055, 0.42 + i * 0.08, (i % 3 - 1) * rect.d * 0.16);
      plate.rotation.y = -0.8 + i * 0.23;
      plate.castShadow = true;
      group.add(plate);
    }
    group.position.set(rect.x, 0, rect.z);
    this.mapRoot.add(group);
  }

  addTank(volume) {
    const THREE = this.THREE;
    const rect = rectToWorld(volume);
    const radius = Math.min(rect.w, rect.d) * 0.34;
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, rect.w, 24), new THREE.MeshStandardMaterial({ color: volume.color, roughness: 0.72, metalness: 0.34 }));
    tank.rotation.z = Math.PI / 2;
    tank.position.set(rect.x, radius + 0.08, rect.z);
    tank.castShadow = true;
    tank.receiveShadow = true;
    this.mapRoot.add(tank);
    addEdges(THREE, tank, '#303325');

    const skid = new THREE.Mesh(new THREE.BoxGeometry(rect.w * 0.88, 0.16, rect.d * 0.18), this.materials.rubber);
    skid.position.set(rect.x, 0.09, rect.z + radius + 0.2);
    skid.receiveShadow = true;
    this.mapRoot.add(skid);
  }

  addPlatform(volume) {
    const THREE = this.THREE;
    const rect = rectToWorld(volume);
    const group = new THREE.Group();
    const deck = new THREE.Mesh(new THREE.BoxGeometry(rect.w, 0.22, rect.d), this.materials.metal);
    deck.position.y = volume.elevation;
    deck.castShadow = true;
    deck.receiveShadow = true;
    group.add(deck);
    addEdges(THREE, deck, '#202928');

    const railMat = new THREE.MeshStandardMaterial({ color: '#363f3c', roughness: 0.7, metalness: 0.5 });
    const railSpecs = [
      { x: 0, z: -rect.d / 2, w: rect.w, d: 0.08 },
      { x: 0, z: rect.d / 2, w: rect.w, d: 0.08 },
      { x: rect.w / 2, z: 0, w: 0.08, d: rect.d }
    ];
    for (const spec of railSpecs) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(spec.w, 0.55, spec.d), railMat);
      rail.position.set(spec.x, volume.elevation + 0.38, spec.z);
      rail.castShadow = true;
      group.add(rail);
    }
    group.position.set(rect.x, 0, rect.z);
    this.mapRoot.add(group);
  }

  addStairs(volume) {
    const THREE = this.THREE;
    const rect = rectToWorld(volume);
    const group = new THREE.Group();
    const steps = 7;
    for (let i = 0; i < steps; i++) {
      const stepH = volume.height * (i + 1) / steps;
      const step = new THREE.Mesh(new THREE.BoxGeometry(rect.w, stepH, rect.d / steps + 0.04), this.materials.metal);
      step.position.set(0, stepH / 2, -rect.d / 2 + (i + 0.5) * rect.d / steps);
      step.castShadow = true;
      step.receiveShadow = true;
      group.add(step);
    }
    group.position.set(rect.x, 0, rect.z);
    this.mapRoot.add(group);
  }

  addRock(rock) {
    const THREE = this.THREE;
    const pos = arenaToWorld(rock.x, rock.y);
    const mat = new THREE.MeshStandardMaterial({ color: '#75634f', roughness: 0.98, metalness: 0.01, flatShading: true });
    const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(rock.r, 0), mat);
    mesh.scale.set(rock.scale[0], rock.scale[1], rock.scale[2]);
    mesh.position.set(pos.x, rock.r * rock.scale[1] * 0.55, pos.z);
    mesh.rotation.set(0.4, rock.x * 0.01, -0.2);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.mapRoot.add(mesh);
  }

  addPipe(pipe) {
    const THREE = this.THREE;
    const pos = arenaToWorld(pipe.x, pipe.y);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(pipe.radius, pipe.radius, pipe.length, 16), new THREE.MeshStandardMaterial({ color: pipe.color, roughness: 0.8, metalness: 0.45 }));
    if (pipe.axis === 'x') mesh.rotation.z = Math.PI / 2;
    if (pipe.axis === 'z') mesh.rotation.x = Math.PI / 2;
    mesh.position.set(pos.x, pipe.lift + pipe.radius, pos.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.mapRoot.add(mesh);
  }

  addScrap(scrap) {
    const THREE = this.THREE;
    const pos = arenaToWorld(scrap.x, scrap.y);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(scrap.w, 0.06, scrap.d), new THREE.MeshStandardMaterial({ color: scrap.color, roughness: 0.82, metalness: 0.36 }));
    mesh.position.set(pos.x, 0.045, pos.z);
    mesh.rotation.y = scrap.rot;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.mapRoot.add(mesh);
  }

  addShadowPatch(zone) {
    const THREE = this.THREE;
    const rect = rectToWorld(zone);
    const material = this.materials.shadow.clone();
    material.opacity = zone.opacity;
    const patch = new THREE.Mesh(new THREE.PlaneGeometry(rect.w, rect.d), material);
    patch.rotation.x = -Math.PI / 2;
    patch.position.set(rect.x, 0.035, rect.z);
    this.mapRoot.add(patch);
  }

  addRoadMarks() {
    const THREE = this.THREE;
    const mat = new THREE.MeshBasicMaterial({ color: '#d1b16a', transparent: true, opacity: 0.22, depthWrite: false });
    for (let i = 0; i < 9; i++) {
      const mark = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.08), mat);
      const pos = arenaToWorld(165 + i * 70, 352 + Math.sin(i) * 12);
      mark.position.set(pos.x, 0.045, pos.z);
      mark.rotation.x = -Math.PI / 2;
      mark.rotation.z = -0.08;
      this.mapRoot.add(mark);
    }
  }

  addDebugCollision() {
    const THREE = this.THREE;
    const mat = new THREE.MeshBasicMaterial({ color: '#7fffd4', transparent: true, opacity: 0.28, wireframe: true, depthWrite: false });
    for (const volume of COLLISION_VOLUMES) {
      const rect = rectToWorld(volume);
      const height = Math.max(0.18, volume.height || volume.elevation || 1);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(rect.w, height, rect.d), mat);
      mesh.position.set(rect.x, height / 2, rect.z);
      this.debugRoot.add(mesh);
    }
  }

  syncPickupMarkers(state) {
    const active = new Set();
    (state.pickups || []).forEach((pickup, index) => {
      if (pickup.used) return;
      const key = `${index}:${pickup.type}:${Math.round(pickup.x)}:${Math.round(pickup.y)}`;
      active.add(key);
      if (!this.pickupMarkers.has(key)) {
        const marker = this.createPickupMarker(pickup);
        this.pickupMarkers.set(key, marker);
        this.markerRoot.add(marker);
      }
    });

    for (const [key, marker] of this.pickupMarkers) {
      if (active.has(key)) continue;
      this.markerRoot.remove(marker);
      disposeObject(marker);
      this.pickupMarkers.delete(key);
    }
  }

  createPickupMarker(pickup) {
    const THREE = this.THREE;
    const pos = arenaToWorld(pickup.x, pickup.y);
    const group = new THREE.Group();
    const color = pickup.color || '#f0d36a';
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.06, 24), new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.08 }));
    disc.position.y = 0.12;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 8, 32), new THREE.MeshBasicMaterial({ color }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.18;
    group.add(disc, ring);
    group.position.set(pos.x, 0, pos.z);
    return group;
  }

  updateCamera(dt, state) {
    const THREE = this.THREE;
    const points = (state?.fighters || [])
      .filter(f => !f.extracted)
      .map(f => arenaToWorld(f.x, f.y));
    const target = new THREE.Vector3(0, 0, 0);
    let span = 13;

    if (points.length) {
      const minX = Math.min(...points.map(p => p.x));
      const maxX = Math.max(...points.map(p => p.x));
      const minZ = Math.min(...points.map(p => p.z));
      const maxZ = Math.max(...points.map(p => p.z));
      target.set((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
      span = Math.max(maxX - minX, maxZ - minZ, 9);
    }

    const zoom = clamp(span * 0.85 + 12, 15.5, 27);
    const desiredPosition = new THREE.Vector3(target.x + zoom * 0.58, zoom, target.z + zoom * 0.64);
    const alpha = 1 - Math.pow(0.001, dt);
    this.cameraTarget.lerp(desiredPosition, alpha);
    this.cameraLook.lerp(target, alpha);
    this.camera.position.copy(this.cameraTarget);
    this.camera.lookAt(this.cameraLook.x, 0, this.cameraLook.z);
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    const width = Math.max(1, this.canvas.clientWidth || this.canvas.width);
    const height = Math.max(1, this.canvas.clientHeight || this.canvas.height);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    this.renderer.setPixelRatio(pixelRatio);
    if (this.canvas.width !== Math.round(width * pixelRatio) || this.canvas.height !== Math.round(height * pixelRatio)) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
}

function addEdges(THREE, mesh, color) {
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.42 }));
  mesh.add(edges);
}

function rectToWorld(rect) {
  const center = arenaToWorld(rect.x + rect.w / 2, rect.y + rect.h / 2);
  return {
    x: center.x,
    z: center.z,
    w: rect.w / ARENA_W * MAP_W,
    d: rect.h / ARENA_H * MAP_D
  };
}

function arenaToWorld(x, y) {
  return {
    x: (x / ARENA_W - 0.5) * MAP_W,
    z: (y / ARENA_H - 0.5) * MAP_D
  };
}

function worldToArena(world) {
  return {
    x: clamp((world.x / MAP_W + 0.5) * ARENA_W, 0, ARENA_W),
    y: clamp((world.z / MAP_D + 0.5) * ARENA_H, 0, ARENA_H)
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function disposeObject(object) {
  object.traverse(child => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) child.material.forEach(material => material.dispose?.());
    else child.material?.dispose?.();
  });
}
