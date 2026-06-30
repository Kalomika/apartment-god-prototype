const HUMAN_HEIGHT = 1.78;
let Vector3Ctor = null;

const STYLE = {
  suit_operative: {
    label: 'Suit Operative',
    skin: '#c08b68',
    hair: '#111014',
    jacket: '#11151b',
    shirt: '#e5e1d7',
    tie: '#1d2638',
    pants: '#11151b',
    sleeve: '#121820',
    glove: '#0a0b0d',
    boot: '#090b0e',
    gear: '#242b31',
    weapon: '#111316',
    accent: '#d8d1bd',
    build: 'lean',
    weaponType: 'pistol',
    bareArms: false,
    accessoryType: 'tailored'
  },
  survival_commando: {
    label: 'Survival Commando',
    skin: '#ba7a55',
    hair: '#201713',
    jacket: '#384634',
    shirt: '#6f5a3f',
    tie: '#5f1918',
    pants: '#3e4f38',
    sleeve: '#ba7a55',
    glove: '#17150f',
    boot: '#17140f',
    gear: '#5a4a31',
    weapon: '#181713',
    accent: '#8a2721',
    build: 'rugged',
    weaponType: 'rifle',
    bareArms: true,
    accessoryType: 'field'
  },
  shadow_ninja: {
    label: 'Shadow Ninja',
    skin: '#876653',
    hair: '#05070a',
    jacket: '#0b0d10',
    shirt: '#14171c',
    tie: '#252b33',
    pants: '#0b0d10',
    sleeve: '#0e1116',
    glove: '#030405',
    boot: '#030405',
    gear: '#1d242b',
    weapon: '#c9d3dd',
    accent: '#343b45',
    build: 'lean',
    weaponType: 'blade',
    bareArms: false,
    accessoryType: 'shinobi'
  },
  field_agent: {
    label: 'Field Agent',
    skin: '#c49372',
    hair: '#2a211b',
    jacket: '#2c3944',
    shirt: '#c7d5dd',
    tie: '#506b7d',
    pants: '#202933',
    sleeve: '#314150',
    glove: '#101418',
    boot: '#0d1117',
    gear: '#4f6070',
    weapon: '#15181c',
    accent: '#89a7bd',
    build: 'lean',
    weaponType: 'pistol',
    bareArms: false,
    accessoryType: 'agent'
  },
  default: {
    label: 'Fighter',
    skin: '#b77b58',
    hair: '#11141a',
    jacket: '#27384a',
    shirt: '#465a6f',
    tie: '#776a4a',
    pants: '#26394d',
    sleeve: '#344a60',
    glove: '#11161d',
    boot: '#0d1117',
    gear: '#776a4a',
    weapon: '#10151d',
    accent: '#f0d36a',
    build: 'standard',
    weaponType: 'rifle',
    bareArms: false,
    accessoryType: 'standard'
  }
};

export function createPlaceholderActor(THREE, archetypeId, options = {}) {
  return new Actor3D(THREE, archetypeId, options);
}

export async function loadActorModel(THREE, archetypeId, options = {}) {
  return createPlaceholderActor(THREE, archetypeId, options);
}

export function setActorAnimationState(actor, stateName) {
  if (!actor) return;
  actor.animationState = stateName || 'idle';
}

export function updateActor(actor, fighter, dt, worldPosition) {
  actor?.update(fighter, dt, worldPosition);
}

export function getLimbHitVolumes(actor) {
  if (!actor) return [];
  return actor.limbVolumes.map(volume => ({ ...volume }));
}

export function getBodyHurtZones(actor) {
  if (!actor) return [];
  return actor.bodyZones.map(zone => ({ ...zone }));
}

class Actor3D {
  constructor(THREE, archetypeId, options = {}) {
    this.THREE = THREE;
    Vector3Ctor = THREE.Vector3;
    this.archetypeId = archetypeId;
    this.style = STYLE[archetypeId] || STYLE.default;
    this.options = options;
    this.group = new THREE.Group();
    this.group.name = `actor_${archetypeId}`;
    this.rig = new THREE.Group();
    this.group.add(this.rig);
    this.clock = 0;
    this.animationState = 'idle';
    this.limbVolumes = [];
    this.bodyZones = [];
    this.points = {};
    this.materials = makeMaterials(THREE, this.style);
    this.parts = {};
    this.build();
  }

  dispose() {
    this.group.traverse(child => {
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) child.material.forEach(material => material.dispose?.());
      else child.material?.dispose?.();
    });
  }

  build() {
    const THREE = this.THREE;
    const bulk = this.style.build === 'rugged' ? 1.13 : this.style.build === 'lean' ? 0.94 : 1;
    this.shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.64 * bulk, 32),
      new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.28, depthWrite: false })
    );
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.012;
    this.group.add(this.shadow);

    this.parts.pelvis = box(THREE, [0.34 * bulk, 0.22, 0.46 * bulk], this.materials.pants);
    this.parts.waist = box(THREE, [0.38 * bulk, 0.18, 0.4 * bulk], this.materials.jacket);
    this.parts.torso = box(THREE, [0.5 * bulk, 0.66, 0.36 * bulk], this.materials.jacket);
    this.parts.shirt = box(THREE, [0.16, 0.58, 0.03], this.materials.shirt);
    this.parts.shoulders = box(THREE, [0.36 * bulk, 0.16, 0.78 * bulk], this.materials.sleeve);
    this.parts.neck = cylinder(THREE, 0.07, 0.16, this.materials.skin);
    this.parts.head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 14), this.materials.skin);
    this.parts.hair = new THREE.Mesh(new THREE.SphereGeometry(0.165, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), this.materials.hair);
    this.parts.nose = box(THREE, [0.055, 0.035, 0.04], this.materials.skin);
    this.parts.eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), this.materials.dark);
    this.parts.eyeRight = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), this.materials.dark);
    this.parts.tie = box(THREE, [0.025, 0.38, 0.05], this.style.weaponType === 'pistol' ? this.materials.tie : this.materials.gear);
    this.parts.bandana = this.style.accessoryType === 'field' ? box(THREE, [0.055, 0.04, 0.42], this.materials.accent) : null;
    this.parts.mask = this.style.accessoryType === 'shinobi' ? box(THREE, [0.09, 0.09, 0.24], this.materials.dark) : null;
    this.parts.hood = this.style.accessoryType === 'shinobi' ? new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.72), this.materials.jacket) : null;
    this.parts.lapel = ['tailored', 'agent'].includes(this.style.accessoryType) ? box(THREE, [0.035, 0.48, 0.17], this.materials.accent) : null;
    this.parts.backGear = this.style.accessoryType === 'shinobi' ? box(THREE, [0.62, 0.045, 0.045], this.materials.weapon) : null;

    for (const part of Object.values(this.parts)) if (part) this.rig.add(part);

    for (const side of ['left', 'right']) {
      const forearmMaterial = this.style.bareArms ? this.materials.skin : this.materials.sleeve;
      this.parts[`${side}UpperArm`] = capsule(THREE, 0.055, 0.38, this.materials.sleeve);
      this.parts[`${side}Forearm`] = capsule(THREE, 0.05, 0.34, forearmMaterial);
      this.parts[`${side}Hand`] = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 8), this.materials.skin);
      this.parts[`${side}Thigh`] = capsule(THREE, 0.07, 0.44, this.materials.pants);
      this.parts[`${side}Shin`] = capsule(THREE, 0.06, 0.43, this.materials.pants);
      this.parts[`${side}Foot`] = box(THREE, [0.22, 0.085, 0.12], this.materials.boot);
      this.rig.add(
        this.parts[`${side}UpperArm`],
        this.parts[`${side}Forearm`],
        this.parts[`${side}Hand`],
        this.parts[`${side}Thigh`],
        this.parts[`${side}Shin`],
        this.parts[`${side}Foot`]
      );
    }

    this.weapon = this.style.weaponType === 'pistol' ? this.buildPistol() : this.style.weaponType === 'blade' ? this.buildBlade() : this.buildRifle();
    this.rig.add(this.weapon);
    this.placeCore(0, false, false);
    this.applyPose('idle', 0, null);
  }

  buildPistol() {
    const THREE = this.THREE;
    const group = new THREE.Group();
    const slide = box(THREE, [0.24, 0.045, 0.065], this.materials.weapon);
    const grip = box(THREE, [0.06, 0.16, 0.055], this.materials.weapon);
    slide.position.set(0.1, 0.025, 0);
    grip.position.set(0, -0.055, 0);
    grip.rotation.z = -0.35;
    group.add(slide, grip);
    return group;
  }

  buildRifle() {
    const THREE = this.THREE;
    const group = new THREE.Group();
    const stock = box(THREE, [0.22, 0.08, 0.1], this.materials.gear);
    const receiver = box(THREE, [0.42, 0.08, 0.09], this.materials.weapon);
    const barrel = cylinder(THREE, 0.025, 0.58, this.materials.weapon);
    const sling = box(THREE, [0.74, 0.025, 0.025], this.materials.gear);
    stock.position.x = -0.18;
    receiver.position.x = 0.12;
    barrel.position.x = 0.52;
    barrel.rotation.z = Math.PI / 2;
    sling.position.set(0.13, -0.08, 0);
    group.add(stock, receiver, barrel, sling);
    return group;
  }

  buildBlade() {
    const THREE = this.THREE;
    const group = new THREE.Group();
    const blade = box(THREE, [0.5, 0.035, 0.045], this.materials.weapon);
    const grip = box(THREE, [0.14, 0.04, 0.08], this.materials.gear);
    blade.position.x = 0.24;
    grip.position.x = -0.08;
    group.add(blade, grip);
    return group;
  }

  update(fighter, dt, worldPosition) {
    this.clock += dt;
    const stateName = poseState(fighter);
    setActorAnimationState(this, stateName);
    this.group.visible = !fighter.extracted;
    this.group.position.set(worldPosition.x, 0, worldPosition.z);
    this.group.rotation.y = -(fighter.facing || 0);
    this.group.scale.setScalar(fighter.preview ? 1.14 : 1.2);
    this.group.traverse(child => {
      if (child.material?.transparent) return;
      if (child.material) child.material.opacity = fighter.preview ? 0.86 : fighter.shadowHidden ? 0.64 : 1;
    });
    this.applyPose(stateName, this.clock, fighter);
  }

  applyPose(stateName, t, fighter) {
    const prone = ['prone', 'crawl', 'down', 'defeated', 'roll'].includes(stateName);
    const crouch = stateName === 'crouch' || stateName === 'crouchWalk';
    const running = ['walk', 'run', 'crouchWalk'].includes(stateName);
    const phaseSpeed = stateName === 'run' ? 11.5 : stateName === 'walk' || stateName === 'crouchWalk' ? 7.5 : 2.2;
    const phase = Math.sin(t * phaseSpeed);
    const phaseAlt = Math.sin(t * phaseSpeed + Math.PI);
    const action = fighter?.currentMove?.id || fighter?.pose || '';

    this.placeCore(phase, crouch, prone);
    const armSwing = running ? 0.28 : 0.05;
    const legSwing = running ? 0.34 : 0.06;
    const low = crouch ? -0.22 : 0;

    const points = {
      leftShoulder: v(0.04, 1.36 + low, 0.42),
      rightShoulder: v(0.04, 1.36 + low, -0.42),
      leftElbow: v(0.05 + phaseAlt * armSwing, 1.04 + low, 0.56),
      rightElbow: v(0.05 + phase * armSwing, 1.04 + low, -0.56),
      leftHand: v(0.16 + phaseAlt * armSwing * 1.4, 0.8 + low, 0.45),
      rightHand: v(0.18 + phase * armSwing * 1.4, 0.82 + low, -0.45),
      leftHip: v(-0.06, 0.66 + low, 0.2),
      rightHip: v(-0.06, 0.66 + low, -0.2),
      leftKnee: v(-0.04 + phase * legSwing, 0.36 + low * 0.55, 0.23),
      rightKnee: v(-0.04 + phaseAlt * legSwing, 0.36 + low * 0.55, -0.23),
      leftFoot: v(0.12 + phaseAlt * legSwing * 1.25, 0.07, 0.25),
      rightFoot: v(0.12 + phase * legSwing * 1.25, 0.07, -0.25)
    };

    if (stateName === 'idle') {
      points.leftHand.set(0.28, 0.98, 0.36);
      points.rightHand.set(0.32, 1.0, -0.34);
    }
    if (stateName === 'crouch') {
      points.leftHand.set(0.22, 0.78, 0.36);
      points.rightHand.set(0.26, 0.8, -0.34);
    }
    if (stateName === 'prone' || stateName === 'crawl' || stateName === 'down' || stateName === 'defeated') {
      points.leftHand.set(0.42, 0.17, 0.33);
      points.rightHand.set(0.42, 0.17, -0.33);
      points.leftElbow.set(0.15, 0.2, 0.46);
      points.rightElbow.set(0.15, 0.2, -0.46);
      points.leftKnee.set(-0.24, 0.16, 0.22);
      points.rightKnee.set(-0.24, 0.16, -0.22);
      points.leftFoot.set(-0.62, 0.13, 0.24);
      points.rightFoot.set(-0.62, 0.13, -0.24);
    }
    if (stateName === 'roll') {
      const roll = Math.sin(t * 12) * 0.35;
      this.rig.rotation.x = roll;
      points.leftHand.set(0.18, 0.28, 0.28);
      points.rightHand.set(0.18, 0.28, -0.28);
      points.leftFoot.set(-0.32, 0.16, 0.24);
      points.rightFoot.set(-0.32, 0.16, -0.24);
    }

    applyActionPose(action, points);
    this.setLimb('leftUpperArm', points.leftShoulder, points.leftElbow, 0.055);
    this.setLimb('leftForearm', points.leftElbow, points.leftHand, 0.05);
    this.setLimb('rightUpperArm', points.rightShoulder, points.rightElbow, 0.055);
    this.setLimb('rightForearm', points.rightElbow, points.rightHand, 0.05);
    this.setLimb('leftThigh', points.leftHip, points.leftKnee, 0.07);
    this.setLimb('leftShin', points.leftKnee, points.leftFoot, 0.06);
    this.setLimb('rightThigh', points.rightHip, points.rightKnee, 0.07);
    this.setLimb('rightShin', points.rightKnee, points.rightFoot, 0.06);
    this.setHandFoot(points);
    this.setWeapon(points, stateName, action);
    this.updateVolumes(points, stateName);
  }

  placeCore(phase, crouch, prone) {
    const low = crouch ? -0.2 : 0;
    this.rig.rotation.set(0, 0, prone ? -Math.PI / 2 : 0);
    this.rig.position.y = prone ? 0.2 : 0;
    this.parts.pelvis.position.set(-0.06, 0.72 + low, 0);
    this.parts.waist.position.set(-0.02, 0.9 + low, 0);
    this.parts.torso.position.set(0.02, 1.12 + low, 0);
    this.parts.torso.rotation.z = prone ? 0 : phase * 0.018;
    this.parts.shirt.position.set(0.275, 1.13 + low, 0);
    this.parts.shoulders.position.set(0.04, 1.38 + low, 0);
    this.parts.neck.position.set(0.1, 1.56 + low, 0);
    this.parts.head.position.set(0.15, 1.73 + low, 0);
    this.parts.hair.position.set(0.09, 1.79 + low, 0);
    this.parts.nose.position.set(0.31, 1.72 + low, 0);
    this.parts.eyeLeft.position.set(0.29, 1.76 + low, 0.055);
    this.parts.eyeRight.position.set(0.29, 1.76 + low, -0.055);
    this.parts.tie.position.set(0.292, 1.13 + low, 0);
    if (this.parts.bandana) this.parts.bandana.position.set(0.18, 1.79 + low, 0);
    if (this.parts.mask) this.parts.mask.position.set(0.295, 1.7 + low, 0);
    if (this.parts.hood) this.parts.hood.position.set(0.09, 1.78 + low, 0);
    if (this.parts.lapel) this.parts.lapel.position.set(0.292, 1.17 + low, this.style.accessoryType === 'agent' ? 0.13 : -0.13);
    if (this.parts.backGear) {
      this.parts.backGear.position.set(-0.17, 1.22 + low, 0);
      this.parts.backGear.rotation.y = 0.62;
    }
  }

  setLimb(name, a, b) {
    const mesh = this.parts[name];
    setSegment(this.THREE, mesh, a, b);
  }

  setHandFoot(points) {
    for (const side of ['left', 'right']) {
      this.parts[`${side}Hand`].position.copy(points[`${side}Hand`]);
      this.parts[`${side}Foot`].position.copy(points[`${side}Foot`]);
      this.parts[`${side}Foot`].rotation.set(0, 0, side === 'left' ? -0.08 : 0.08);
    }
  }

  setWeapon(points, stateName, action) {
    if (this.style.weaponType === 'pistol') {
      this.weapon.position.copy(points.rightHand).add(v(0.15, 0.02, 0.01));
      this.weapon.rotation.set(0, 0, action === 'pistol' || action === 'right_cross' ? -0.08 : -0.22);
      this.weapon.visible = stateName !== 'prone' || action === 'pistol';
      return;
    }
    if (this.style.weaponType === 'blade') {
      this.weapon.position.copy(points.rightHand).add(v(0.23, 0.02, -0.02));
      this.weapon.rotation.set(0, 0, action.includes('slash') || action.includes('knife') ? -0.02 : -0.18);
      this.weapon.visible = stateName !== 'prone' || action.includes('slash');
      return;
    }
    const left = points.leftHand;
    const right = points.rightHand;
    this.weapon.position.set((left.x + right.x) / 2 + 0.18, (left.y + right.y) / 2 + 0.04, (left.z + right.z) / 2);
    this.weapon.rotation.set(0, 0, action === 'burst' ? -0.04 : -0.12);
    this.weapon.visible = stateName !== 'roll';
  }

  updateVolumes(points, stateName) {
    this.limbVolumes = [
      volume('left_fist', points.leftHand, 0.09),
      volume('right_fist', points.rightHand, 0.09),
      volume('left_foot', points.leftFoot, 0.12),
      volume('right_foot', points.rightFoot, 0.12),
      volume('weapon_hand', points.rightHand.clone().add(v(0.18, 0, 0)), this.style.weaponType === 'rifle' || this.style.weaponType === 'blade' ? 0.18 : 0.11)
    ];
    this.bodyZones = [
      volume('head', this.parts.head.position, stateName === 'prone' ? 0.2 : 0.16),
      volume('torso', this.parts.torso.position, 0.34),
      volume('pelvis', this.parts.pelvis.position, 0.24),
      volume('left_leg', points.leftKnee, 0.16),
      volume('right_leg', points.rightKnee, 0.16)
    ];
  }
}

function makeMaterials(THREE, style) {
  const make = color => new THREE.MeshStandardMaterial({ color, roughness: 0.74, metalness: 0.04 });
  const metal = color => new THREE.MeshStandardMaterial({ color, roughness: 0.54, metalness: 0.42 });
  return {
    skin: make(style.skin),
    hair: make(style.hair),
    jacket: make(style.jacket),
    shirt: make(style.shirt),
    tie: make(style.tie),
    pants: make(style.pants),
    sleeve: make(style.sleeve),
    glove: make(style.glove),
    boot: make(style.boot),
    gear: make(style.gear),
    weapon: metal(style.weapon),
    accent: make(style.accent),
    dark: make('#05070b')
  };
}

function box(THREE, size, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinder(THREE, radius, length, material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 14), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function capsule(THREE, radius, length, material) {
  const geometry = THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(radius, length, 8, 12) : new THREE.CylinderGeometry(radius, radius, length + radius * 2, 12);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function setSegment(THREE, mesh, a, b) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const delta = b.clone().sub(a);
  const len = Math.max(0.001, delta.length());
  mesh.position.copy(mid);
  mesh.scale.y = len / 0.5;
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
}

function poseState(fighter) {
  if (!fighter) return 'idle';
  const pose = fighter.currentMove?.id || fighter.pose || 'idle';
  if (fighter.incapacitated || fighter.defeated || pose === 'down' || pose === 'thrown') return 'down';
  if (fighter.prone || ['prone', 'crawl', 'flat_dive'].includes(pose)) return 'prone';
  if (['roll', 'combat_roll', 'dive_roll', 'somersault_dive', 'recover_dive'].includes(pose)) return 'roll';
  if (fighter.crouch || pose === 'crouchWalk' || pose === 'duck' || fighter.shadowHidden) return fighter.lastMove > 0.35 ? 'crouchWalk' : 'crouch';
  if (['run', 'rush', 'limp_run', 'stagger_limp'].includes(pose) || fighter.lastMove > 0.65) return 'run';
  if (['walk', 'wall_strafe', 'careful_walk'].includes(pose) || fighter.lastMove > 0.2) return 'walk';
  return 'idle';
}

function applyActionPose(action, points) {
  if (action === 'left_jab') points.leftHand.set(0.72, 1.18, 0.23);
  if (action === 'right_cross' || action === 'pistol' || action === 'burst') points.rightHand.set(0.76, 1.2, -0.2);
  if (action === 'left_elbow') points.leftHand.set(0.36, 1.2, 0.16);
  if (action === 'right_elbow') points.rightHand.set(0.36, 1.2, -0.16);
  if (action === 'left_knee') points.leftKnee.set(0.34, 0.66, 0.18);
  if (action === 'right_knee') points.rightKnee.set(0.34, 0.66, -0.18);
  if (action === 'left_kick') points.leftFoot.set(0.78, 0.42, 0.22);
  if (action === 'right_kick' || action === 'roundhouse') points.rightFoot.set(0.78, 0.42, -0.22);
  if (action === 'knife_jab' || action === 'low_knife_cut' || action === 'grenade_throw') points.rightHand.set(0.66, 1.08, -0.16);
  if (action.startsWith?.('block') || action.startsWith?.('parry') || action.startsWith?.('cross_block')) {
    points.leftHand.set(0.44, 1.28, 0.1);
    points.rightHand.set(0.44, 1.28, -0.1);
  }
  if (action.startsWith?.('slip')) {
    points.leftHand.set(0.16, 1.24, 0.34);
    points.rightHand.set(0.16, 1.24, -0.34);
  }
}

function volume(id, position, radius) {
  return { id, x: position.x, y: position.y, z: position.z, radius };
}

function v(x, y, z) {
  return new Vector3Ctor(x, y, z);
}
