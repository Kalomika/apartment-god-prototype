import { createOutlineFreeToonMaterial, createToonRampTexture, steppedAnimationTime } from './visualStyle3D.js';

const HUMAN_HEIGHT = 1.78;
let Vector3Ctor = null;

const STYLE = {
  suit_operative: {
    label: 'Suit Operative',
    skin: '#c08b68',
    skinShadow: '#8f5f49',
    hair: '#0c0d10',
    jacket: '#11151b',
    jacket2: '#1c222a',
    shirt: '#202632',
    shirtLight: '#c8c4b9',
    tie: '#080a0e',
    pants: '#10141a',
    sleeve: '#141922',
    glove: '#0a0b0d',
    boot: '#090b0e',
    sole: '#040507',
    gear: '#20252c',
    weapon: '#111316',
    metal: '#8c8f92',
    accent: '#d8d1bd',
    build: 'lean',
    weaponType: 'pistol',
    bareArms: false,
    accessoryType: 'tailored',
    modelClass: 'stealth_suit'
  },
  survival_commando: {
    label: 'Survival Commando',
    skin: '#ba7a55',
    skinShadow: '#87543a',
    hair: '#201713',
    jacket: '#39442f',
    jacket2: '#283323',
    shirt: '#596242',
    shirtLight: '#7a6f4d',
    tie: '#2b2418',
    pants: '#343a2d',
    sleeve: '#ba7a55',
    glove: '#17150f',
    boot: '#17140f',
    sole: '#070706',
    gear: '#4c412d',
    weapon: '#151611',
    metal: '#5c5d59',
    accent: '#8a2721',
    build: 'rugged',
    weaponType: 'rifle',
    bareArms: true,
    accessoryType: 'field',
    modelClass: 'survival_commando'
  },
  shadow_ninja: {
    label: 'Shadow Ninja',
    skin: '#876653',
    skinShadow: '#563f35',
    hair: '#05070a',
    jacket: '#0b0d10',
    jacket2: '#15191f',
    shirt: '#14171c',
    shirtLight: '#252b33',
    tie: '#252b33',
    pants: '#0b0d10',
    sleeve: '#0e1116',
    glove: '#030405',
    boot: '#030405',
    sole: '#010101',
    gear: '#1d242b',
    weapon: '#c9d3dd',
    metal: '#aeb7c0',
    accent: '#343b45',
    build: 'lean',
    weaponType: 'blade',
    bareArms: false,
    accessoryType: 'shinobi',
    modelClass: 'blade_shadow'
  },
  field_agent: {
    label: 'Field Agent',
    skin: '#c49372',
    skinShadow: '#8e644d',
    hair: '#2a211b',
    jacket: '#2c3944',
    jacket2: '#3a4c5b',
    shirt: '#263642',
    shirtLight: '#c7d5dd',
    tie: '#506b7d',
    pants: '#202933',
    sleeve: '#314150',
    glove: '#101418',
    boot: '#0d1117',
    sole: '#05070b',
    gear: '#4f6070',
    weapon: '#15181c',
    metal: '#9ca7ad',
    accent: '#89a7bd',
    build: 'lean',
    weaponType: 'pistol',
    bareArms: false,
    accessoryType: 'agent',
    modelClass: 'field_agent'
  },
  default: {
    label: 'Fighter',
    skin: '#b77b58',
    skinShadow: '#85543d',
    hair: '#11141a',
    jacket: '#27384a',
    jacket2: '#344a60',
    shirt: '#465a6f',
    shirtLight: '#7e8d9b',
    tie: '#776a4a',
    pants: '#26394d',
    sleeve: '#344a60',
    glove: '#11161d',
    boot: '#0d1117',
    sole: '#05070b',
    gear: '#776a4a',
    weapon: '#10151d',
    metal: '#8b8f93',
    accent: '#f0d36a',
    build: 'standard',
    weaponType: 'rifle',
    bareArms: false,
    accessoryType: 'standard',
    modelClass: 'generalist'
  }
};

const FISTING_ACTIONS = new Set([
  'left_jab', 'right_cross', 'right_body_hook', 'left_elbow', 'right_elbow', 'left_knee', 'right_knee', 'left_kick', 'right_kick', 'roundhouse', 'right_sweep', 'inside_trip', 'two_hand_grab', 'judo_throw', 'headbutt', 'limb_control', 'disarm_twist', 'mount_top', 'mounted_bottom', 'ground_punch', 'mount_pressure', 'mount_escape_roll', 'mount_escape_blocked', 'pressure_step', 'step_back'
]);
const KNIFE_ACTIONS = new Set(['knife_stab', 'knife_jab', 'low_knife_cut', 'ground_knife_stab']);
const GUN_ACTIONS = new Set(['pistol', 'burst', 'gun_butt']);

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
    this.dims = dimensionsFor(this.style);
    this.options = options;
    this.group = new THREE.Group();
    this.group.name = `actor_${archetypeId}`;
    this.rig = new THREE.Group();
    this.group.add(this.rig);
    this.clock = 0;
    this.animationState = 'idle';
    this.limbVolumes = [];
    this.bodyZones = [];
    this.parts = {};
    this.detail = {};
    this.materials = makeMaterials(THREE, this.style);
    this.build();
  }

  dispose() {
    this.group.traverse(child => {
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) child.material.forEach(material => material.dispose?.());
      else child.material?.dispose?.();
    });
  }

  addPart(name, mesh) {
    this.parts[name] = mesh;
    this.rig.add(mesh);
    return mesh;
  }

  addDetail(name, mesh) {
    this.detail[name] = mesh;
    this.rig.add(mesh);
    return mesh;
  }

  build() {
    const THREE = this.THREE;
    const d = this.dims;
    this.shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.54 * d.shadow, 24),
      new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.28, depthWrite: false })
    );
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.012;
    this.group.add(this.shadow);

    this.addPart('pelvis', box(THREE, [d.hips, 0.2, d.hipsZ], this.materials.pants));
    this.addPart('waist', box(THREE, [d.waist, 0.18, d.waistZ], this.style.modelClass === 'survival_commando' ? this.materials.shirt : this.materials.jacket));
    this.addPart('torso', box(THREE, [d.chest, 0.58, d.chestZ], this.style.modelClass === 'survival_commando' ? this.materials.shirt : this.materials.jacket));
    this.addPart('shirt', box(THREE, [d.shirtW, 0.54, 0.035], this.materials.shirt));
    this.addPart('shoulders', box(THREE, [0.16, 0.14, d.shoulders], this.materials.sleeve));
    this.addPart('neck', cylinder(THREE, d.neck, 0.16, this.materials.skin));
    this.addPart('head', new THREE.Mesh(new THREE.SphereGeometry(d.head, 12, 8), this.materials.skin));
    this.addPart('jaw', box(THREE, [0.12, 0.07, 0.2], this.materials.skinShadow));
    this.addPart('brow', box(THREE, [0.14, 0.035, 0.23], this.materials.skinShadow));
    this.addPart('nose', box(THREE, [0.07, 0.04, 0.04], this.materials.skin));
    this.addPart('cheekLeft', box(THREE, [0.045, 0.045, 0.07], this.materials.skinShadow));
    this.addPart('cheekRight', box(THREE, [0.045, 0.045, 0.07], this.materials.skinShadow));
    this.addPart('earLeft', box(THREE, [0.035, 0.075, 0.025], this.materials.skinShadow));
    this.addPart('earRight', box(THREE, [0.035, 0.075, 0.025], this.materials.skinShadow));
    this.addPart('eyeLeft', new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.012, 0.03), this.materials.dark));
    this.addPart('eyeRight', new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.012, 0.03), this.materials.dark));
    this.addPart('hairCap', new THREE.Mesh(new THREE.SphereGeometry(d.head * 1.04, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.58), this.materials.hair));
    this.addPart('hairFront', box(THREE, [0.14, 0.055, 0.22], this.materials.hair));

    this.buildLimbs();
    this.buildCostumeDetails();
    this.weapon = this.style.weaponType === 'pistol' ? this.buildPistol() : this.style.weaponType === 'blade' ? this.buildBlade() : this.buildRifle();
    this.rig.add(this.weapon);
    this.placeCore(0, false, false, '', null);
    this.applyPose('idle', 0, null);
  }

  buildLimbs() {
    const THREE = this.THREE;
    const d = this.dims;
    for (const side of ['left', 'right']) {
      const forearmMaterial = this.style.bareArms ? this.materials.skin : this.materials.sleeve;
      this.addPart(`${side}UpperArm`, capsule(THREE, d.upperArmR, 0.37, this.materials.sleeve));
      this.addPart(`${side}Forearm`, capsule(THREE, d.forearmR, 0.34, forearmMaterial));
      this.addPart(`${side}Hand`, new THREE.Mesh(new THREE.BoxGeometry(d.handX, d.handY, d.handZ), this.style.modelClass === 'survival_commando' ? this.materials.glove : this.materials.skin));
      this.addPart(`${side}Thigh`, capsule(THREE, d.thighR, 0.46, this.materials.pants));
      this.addPart(`${side}Shin`, capsule(THREE, d.shinR, 0.43, this.materials.pants));
      this.addPart(`${side}Foot`, box(THREE, [d.footX, 0.09, d.footZ], this.materials.boot));
      this.addDetail(`${side}Sole`, box(THREE, [d.footX * 0.95, 0.025, d.footZ * 1.06], this.materials.sole));
    }
  }

  buildCostumeDetails() {
    const THREE = this.THREE;
    if (this.style.modelClass === 'stealth_suit' || this.style.modelClass === 'field_agent') {
      this.addDetail('tie', box(THREE, [0.035, 0.42, 0.045], this.materials.tie));
      this.addDetail('lapelLeft', box(THREE, [0.045, 0.46, 0.13], this.materials.jacket2));
      this.addDetail('lapelRight', box(THREE, [0.045, 0.46, 0.13], this.materials.jacket2));
      this.addDetail('pocketSquare', box(THREE, [0.018, 0.055, 0.09], this.materials.accent));
      this.addDetail('belt', box(THREE, [0.055, 0.045, 0.47], this.materials.gear));
      this.addDetail('buckle', box(THREE, [0.035, 0.05, 0.08], this.materials.metal));
      this.addDetail('jacketTailLeft', box(THREE, [0.12, 0.34, 0.2], this.materials.jacket));
      this.addDetail('jacketTailRight', box(THREE, [0.12, 0.34, 0.2], this.materials.jacket));
      this.addDetail('holster', box(THREE, [0.08, 0.16, 0.12], this.materials.gear));
      this.addDetail('holsterStrap', box(THREE, [0.035, 0.05, 0.28], this.materials.gear));
      this.addDetail('leftCuff', box(THREE, [0.055, 0.05, 0.14], this.materials.shirtLight));
      this.addDetail('rightCuff', box(THREE, [0.055, 0.05, 0.14], this.materials.shirtLight));
    } else if (this.style.modelClass === 'survival_commando') {
      this.addDetail('vestPlate', box(THREE, [0.12, 0.46, 0.58], this.materials.gear));
      this.addDetail('vestCenter', box(THREE, [0.06, 0.5, 0.24], this.materials.jacket2));
      this.addDetail('strapLeft', box(THREE, [0.055, 0.64, 0.08], this.materials.gear));
      this.addDetail('strapRight', box(THREE, [0.055, 0.64, 0.08], this.materials.gear));
      for (let i = 0; i < 4; i++) this.addDetail(`magPouch${i}`, box(THREE, [0.08, 0.15, 0.1], this.materials.gear));
      this.addDetail('belt', box(THREE, [0.06, 0.055, 0.58], this.materials.dark));
      this.addDetail('buckle', box(THREE, [0.04, 0.055, 0.1], this.materials.metal));
      this.addDetail('cargoLeft', box(THREE, [0.08, 0.18, 0.16], this.materials.gear));
      this.addDetail('cargoRight', box(THREE, [0.08, 0.18, 0.16], this.materials.gear));
      this.addDetail('kneePadLeft', box(THREE, [0.045, 0.08, 0.16], this.materials.gear));
      this.addDetail('kneePadRight', box(THREE, [0.045, 0.08, 0.16], this.materials.gear));
      this.addDetail('gloveLeft', box(THREE, [0.055, 0.055, 0.15], this.materials.glove));
      this.addDetail('gloveRight', box(THREE, [0.055, 0.055, 0.15], this.materials.glove));
      this.addDetail('bandana', box(THREE, [0.055, 0.04, 0.42], this.materials.accent));
    } else if (this.style.modelClass === 'blade_shadow') {
      this.addDetail('mask', box(THREE, [0.09, 0.09, 0.24], this.materials.dark));
      this.addDetail('hood', new THREE.Mesh(new THREE.SphereGeometry(this.dims.head * 1.18, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.72), this.materials.jacket));
      this.addDetail('sash', box(THREE, [0.055, 0.05, 0.5], this.materials.gear));
      this.addDetail('backGear', box(THREE, [0.62, 0.045, 0.045], this.materials.weapon));
    }
  }

  buildPistol() {
    const THREE = this.THREE;
    const group = new THREE.Group();
    const slide = box(THREE, [0.23, 0.045, 0.065], this.materials.weapon);
    const grip = box(THREE, [0.06, 0.15, 0.055], this.materials.weapon);
    const barrel = box(THREE, [0.09, 0.025, 0.035], this.materials.metal);
    slide.position.set(0.1, 0.025, 0);
    barrel.position.set(0.25, 0.03, 0);
    grip.position.set(0, -0.055, 0);
    grip.rotation.z = -0.35;
    group.add(slide, grip, barrel);
    return group;
  }

  buildRifle() {
    const THREE = this.THREE;
    const group = new THREE.Group();
    const stock = box(THREE, [0.22, 0.09, 0.11], this.materials.gear);
    const receiver = box(THREE, [0.42, 0.085, 0.095], this.materials.weapon);
    const mag = box(THREE, [0.11, 0.18, 0.08], this.materials.gear);
    const grip = box(THREE, [0.07, 0.16, 0.07], this.materials.gear);
    const barrel = cylinder(THREE, 0.025, 0.62, this.materials.weapon);
    const handguard = box(THREE, [0.26, 0.065, 0.1], this.materials.weapon);
    const sling = box(THREE, [0.78, 0.025, 0.025], this.materials.gear);
    stock.position.x = -0.2;
    receiver.position.x = 0.1;
    mag.position.set(0.13, -0.13, 0);
    grip.position.set(-0.02, -0.12, 0);
    grip.rotation.z = -0.2;
    handguard.position.x = 0.36;
    barrel.position.x = 0.62;
    barrel.rotation.z = Math.PI / 2;
    sling.position.set(0.15, -0.09, 0);
    group.add(stock, receiver, mag, grip, handguard, barrel, sling);
    return group;
  }

  buildBlade() {
    const THREE = this.THREE;
    const group = new THREE.Group();
    const blade = box(THREE, [0.5, 0.035, 0.045], this.materials.weapon);
    const tip = box(THREE, [0.08, 0.025, 0.035], this.materials.metal);
    const grip = box(THREE, [0.14, 0.04, 0.08], this.materials.gear);
    blade.position.x = 0.24;
    tip.position.x = 0.52;
    grip.position.x = -0.08;
    group.add(blade, tip, grip);
    return group;
  }

  update(fighter, dt, worldPosition) {
    this.clock += dt;
    const stateName = poseState(fighter);
    setActorAnimationState(this, stateName);
    this.group.visible = !fighter.extracted;
    this.group.position.set(worldPosition.x, 0, worldPosition.z);
    this.group.rotation.y = -(fighter.facing || 0);
    this.group.scale.setScalar(fighter.preview ? 1.12 : 1.18);
    this.group.traverse(child => {
      if (child.material?.transparent) return;
      if (child.material) child.material.opacity = fighter.preview ? 0.86 : fighter.shadowHidden ? 0.64 : 1;
    });
    this.applyPose(stateName, steppedAnimationTime(this.clock), fighter);
  }

  applyPose(stateName, t, fighter) {
    const action = fighter?.currentMove?.id || fighter?.pose || '';
    const prone = isProneState(stateName, action);
    const crouch = isCrouchState(stateName, action);
    const running = ['walk', 'run', 'crouchWalk'].includes(stateName) || ['pressure_step', 'step_back'].includes(action);
    const phaseSpeed = stateName === 'run' ? 11.5 : stateName === 'walk' || stateName === 'crouchWalk' ? 7.5 : 2.2;
    const phase = Math.sin(t * phaseSpeed);
    const phaseAlt = Math.sin(t * phaseSpeed + Math.PI);
    const recoil = fighter?.cqc?.recoilT > 0 ? clamp(fighter.cqc.recoilT / 0.32, 0, 1) : 0;
    const d = this.dims;

    this.placeCore(phase, crouch, prone, action, fighter);
    const armSwing = running ? 0.28 : 0.05;
    const legSwing = running ? 0.34 : 0.06;
    const low = crouch ? -0.22 : 0;
    const recoilBack = recoil * 0.12;

    const points = {
      leftShoulder: v(0.04 - recoilBack, 1.36 + low, d.shoulderZ),
      rightShoulder: v(0.04 - recoilBack, 1.36 + low, -d.shoulderZ),
      leftElbow: v(0.05 + phaseAlt * armSwing, 1.04 + low, d.elbowZ),
      rightElbow: v(0.05 + phase * armSwing, 1.04 + low, -d.elbowZ),
      leftHand: v(0.16 + phaseAlt * armSwing * 1.4, 0.8 + low, d.handRestZ),
      rightHand: v(0.18 + phase * armSwing * 1.4, 0.82 + low, -d.handRestZ),
      leftHip: v(-0.06, 0.66 + low, d.hipZ),
      rightHip: v(-0.06, 0.66 + low, -d.hipZ),
      leftKnee: v(-0.04 + phase * legSwing, 0.36 + low * 0.55, d.kneeZ),
      rightKnee: v(-0.04 + phaseAlt * legSwing, 0.36 + low * 0.55, -d.kneeZ),
      leftFoot: v(0.12 + phaseAlt * legSwing * 1.25, 0.07, d.footRestZ),
      rightFoot: v(0.12 + phase * legSwing * 1.25, 0.07, -d.footRestZ)
    };

    if (stateName === 'idle') {
      points.leftHand.set(0.26, 0.98, d.handRestZ * 0.86);
      points.rightHand.set(0.3, 1.0, -d.handRestZ * 0.86);
    }
    if (stateName === 'crouch') {
      points.leftHand.set(0.22, 0.78, d.handRestZ * 0.88);
      points.rightHand.set(0.26, 0.8, -d.handRestZ * 0.88);
    }
    if (prone) applyPronePose(points, action);
    if (stateName === 'roll') {
      const roll = Math.sin(t * 12) * 0.35;
      this.rig.rotation.x = roll;
      points.leftHand.set(0.18, 0.28, 0.28);
      points.rightHand.set(0.18, 0.28, -0.28);
      points.leftFoot.set(-0.32, 0.16, 0.24);
      points.rightFoot.set(-0.32, 0.16, -0.24);
    }

    applyReactionPose(this.parts, action, fighter);
    applyActionPose(action, points, t);
    applySecondaryAction(this.parts, this.detail, action, phase, recoil);
    this.setLimb('leftUpperArm', points.leftShoulder, points.leftElbow);
    this.setLimb('leftForearm', points.leftElbow, points.leftHand);
    this.setLimb('rightUpperArm', points.rightShoulder, points.rightElbow);
    this.setLimb('rightForearm', points.rightElbow, points.rightHand);
    this.setLimb('leftThigh', points.leftHip, points.leftKnee);
    this.setLimb('leftShin', points.leftKnee, points.leftFoot);
    this.setLimb('rightThigh', points.rightHip, points.rightKnee);
    this.setLimb('rightShin', points.rightKnee, points.rightFoot);
    this.setHandFoot(points, action);
    this.setWeapon(points, stateName, action);
    this.updateVolumes(points, stateName, action);
  }

  placeCore(phase, crouch, prone, action, fighter) {
    const low = crouch ? -0.2 : 0;
    const recoil = fighter?.cqc?.recoilT > 0 ? clamp(fighter.cqc.recoilT / 0.32, 0, 1) : 0;
    let tiltX = 0;
    let tiltZ = prone ? -Math.PI / 2 : phase * 0.018;
    let rigY = prone ? 0.2 : 0;
    let torsoY = 1.12 + low;
    let headX = 0.15 - recoil * 0.08;

    if (action === 'hit_body_fold' || action === 'hit_side_fold') {
      tiltZ += action === 'hit_side_fold' ? 0.22 : 0.1;
      tiltX = -0.28;
      torsoY -= 0.1;
      headX -= 0.1;
    }
    if (action === 'hit_head_snap' || action === 'stab_react') {
      tiltX = action === 'hit_head_snap' ? -0.22 : -0.12;
      headX -= 0.16;
    }
    if (action === 'stumble_leg') { tiltZ += 0.28; rigY -= 0.05; }
    if (action === 'mount_top' || action === 'mount_pressure' || action === 'ground_punch' || action === 'ground_knife_stab') { rigY = 0.42; tiltZ = 0.04; torsoY = 0.86; }
    if (action === 'mounted_bottom' || action === 'mount_escape_blocked') { rigY = 0.11; tiltZ = -Math.PI / 2; torsoY = 1.04; }
    if (action === 'mount_escape_roll') { rigY = 0.22; tiltZ = -Math.PI / 2 + Math.sin(phase * 2) * 0.22; }
    if (action === 'judo_throw' || action === 'thrown' || action === 'swept_fall') { tiltZ = -0.58; rigY = 0.08; }

    this.rig.rotation.set(tiltX, 0, tiltZ);
    this.rig.position.y = rigY;
    this.parts.pelvis.position.set(-0.06, 0.72 + low, 0);
    this.parts.waist.position.set(-0.02, 0.9 + low, 0);
    this.parts.torso.position.set(0.02 - recoil * 0.05, torsoY, 0);
    this.parts.torso.rotation.z = prone ? 0 : phase * 0.018;
    this.parts.torso.rotation.x = action === 'hit_body_fold' ? -0.18 : 0;
    this.parts.shirt.position.set(0.285 - recoil * 0.05, 1.13 + low, 0);
    this.parts.shoulders.position.set(0.04 - recoil * 0.08, 1.38 + low, 0);
    this.parts.neck.position.set(0.1 - recoil * 0.08, 1.56 + low, 0);
    this.positionHead(headX, 1.73 + low, 0);
    this.positionDetails(low, recoil, action);
  }

  positionHead(x, y, z) {
    this.parts.head.position.set(x, y, z);
    this.parts.jaw.position.set(x + 0.07, y - 0.09, z);
    this.parts.brow.position.set(x + 0.105, y + 0.045, z);
    this.parts.nose.position.set(x + 0.15, y, z);
    this.parts.cheekLeft.position.set(x + 0.105, y - 0.02, z + 0.075);
    this.parts.cheekRight.position.set(x + 0.105, y - 0.02, z - 0.075);
    this.parts.earLeft.position.set(x - 0.005, y + 0.01, z + this.dims.head * 0.98);
    this.parts.earRight.position.set(x - 0.005, y + 0.01, z - this.dims.head * 0.98);
    this.parts.eyeLeft.position.set(x + 0.14, y + 0.04, z + 0.055);
    this.parts.eyeRight.position.set(x + 0.14, y + 0.04, z - 0.055);
    this.parts.hairCap.position.set(x - 0.04, y + 0.055, z);
    this.parts.hairFront.position.set(x + 0.045, y + 0.12, z);
    this.parts.hairFront.rotation.z = this.style.modelClass === 'stealth_suit' ? -0.18 : 0.04;
  }

  positionDetails(low, recoil, action) {
    const zSign = this.style.modelClass === 'field_agent' ? 1 : -1;
    place(this.detail.tie, 0.305 - recoil * 0.05, 1.13 + low, 0, 0, 0, 0);
    place(this.detail.lapelLeft, 0.295, 1.18 + low, 0.12, 0, 0, -0.12);
    place(this.detail.lapelRight, 0.295, 1.18 + low, -0.12, 0, 0, 0.12);
    place(this.detail.pocketSquare, 0.315, 1.24 + low, 0.19, 0, 0, 0);
    place(this.detail.belt, 0.22, 0.82 + low, 0, 0, 0, 0);
    place(this.detail.buckle, 0.255, 0.82 + low, 0, 0, 0, 0);
    place(this.detail.jacketTailLeft, -0.06, 0.68 + low, 0.13, 0, 0, -0.06);
    place(this.detail.jacketTailRight, -0.06, 0.68 + low, -0.13, 0, 0, 0.06);
    place(this.detail.holster, -0.02, 0.48 + low * 0.3, zSign * 0.34, 0, 0, 0.08 * zSign);
    place(this.detail.holsterStrap, -0.02, 0.58 + low * 0.3, zSign * 0.26, 0, 0, 0);
    place(this.detail.leftCuff, 0.16, 0.78 + low, 0.43, 0, 0, -0.12);
    place(this.detail.rightCuff, 0.16, 0.78 + low, -0.43, 0, 0, 0.12);

    place(this.detail.vestPlate, 0.31, 1.12 + low, 0, 0, 0, 0);
    place(this.detail.vestCenter, 0.35, 1.12 + low, 0, 0, 0, 0);
    place(this.detail.strapLeft, 0.31, 1.22 + low, 0.24, 0, 0, -0.08);
    place(this.detail.strapRight, 0.31, 1.22 + low, -0.24, 0, 0, 0.08);
    for (let i = 0; i < 4; i++) place(this.detail[`magPouch${i}`], 0.37, 0.88 + low, -0.21 + i * 0.14, 0, 0, 0);
    place(this.detail.cargoLeft, -0.01, 0.49 + low * 0.35, 0.31, 0, 0, -0.06);
    place(this.detail.cargoRight, -0.01, 0.49 + low * 0.35, -0.31, 0, 0, 0.06);
    place(this.detail.kneePadLeft, 0.04, 0.34 + low * 0.2, 0.22, 0, 0, 0);
    place(this.detail.kneePadRight, 0.04, 0.34 + low * 0.2, -0.22, 0, 0, 0);
    place(this.detail.gloveLeft, 0.16, 0.79 + low, 0.47, 0, 0, 0);
    place(this.detail.gloveRight, 0.16, 0.79 + low, -0.47, 0, 0, 0);
    place(this.detail.bandana, 0.18, 1.79 + low, 0, 0, 0, 0.05);
    place(this.detail.mask, 0.285, 1.7 + low, 0, 0, 0, 0);
    place(this.detail.hood, 0.09, 1.78 + low, 0, 0, 0, 0);
    place(this.detail.sash, 0.21, 0.9 + low, 0, 0, 0, 0.22);
    place(this.detail.backGear, -0.17, 1.22 + low, 0, 0, 0.62, 0);
  }

  setLimb(name, a, b) {
    const mesh = this.parts[name];
    setSegment(this.THREE, mesh, a, b);
  }

  setHandFoot(points, action) {
    for (const side of ['left', 'right']) {
      this.parts[`${side}Hand`].position.copy(points[`${side}Hand`]);
      this.parts[`${side}Foot`].position.copy(points[`${side}Foot`]);
      this.parts[`${side}Foot`].rotation.set(0, 0, side === 'left' ? -0.08 : 0.08);
      const sole = this.detail[`${side}Sole`];
      if (sole) {
        sole.position.copy(points[`${side}Foot`]).add(v(0, -0.052, 0));
        sole.rotation.copy(this.parts[`${side}Foot`].rotation);
      }
    }
    if (action === 'right_sweep' || action === 'inside_trip') {
      this.parts.rightFoot.rotation.z = -0.4;
      this.parts.leftFoot.rotation.z = 0.22;
    }
    if (action === 'right_kick' || action === 'roundhouse' || action === 'jumping_knee') this.parts.rightFoot.rotation.z = -0.22;
  }

  setWeapon(points, stateName, action) {
    if (this.style.weaponType === 'pistol') {
      if (GUN_ACTIONS.has(action) || action === 'disarm_twist') {
        this.weapon.position.copy(points.rightHand).add(v(action === 'gun_butt' ? 0.04 : 0.15, 0.02, 0.01));
        this.weapon.rotation.set(0, 0, action === 'gun_butt' ? 0.55 : -0.08);
        this.weapon.visible = true;
        return;
      }
      this.weapon.position.set(-0.03, 0.53, -0.36);
      this.weapon.rotation.set(0, 0, -1.1);
      this.weapon.visible = stateName !== 'prone';
      return;
    }
    if (this.style.weaponType === 'blade') {
      if (KNIFE_ACTIONS.has(action)) {
        this.weapon.position.copy(points.rightHand).add(v(0.23, 0.02, -0.02));
        this.weapon.rotation.set(0, 0, action === 'ground_knife_stab' ? -0.8 : -0.02);
        this.weapon.visible = true;
        return;
      }
      this.weapon.position.set(-0.14, 1.14, -0.38);
      this.weapon.rotation.set(0, 0.62, 0.72);
      this.weapon.visible = stateName !== 'prone' && action !== 'mounted_bottom';
      return;
    }

    const shouldSling = FISTING_ACTIONS.has(action) || KNIFE_ACTIONS.has(action) || stateName === 'crouch' || stateName === 'prone';
    if (action === 'gun_butt') {
      this.weapon.position.copy(points.rightHand).add(v(0.1, 0.02, -0.01));
      this.weapon.rotation.set(0, 0, 0.65);
      this.weapon.visible = true;
      return;
    }
    if (shouldSling) {
      this.weapon.position.set(-0.2, 1.16, -0.36);
      this.weapon.rotation.set(0.14, 0.72, -0.88);
      this.weapon.visible = action !== 'mounted_bottom';
      return;
    }
    const left = points.leftHand;
    const right = points.rightHand;
    this.weapon.position.set((left.x + right.x) / 2 + 0.18, (left.y + right.y) / 2 + 0.04, (left.z + right.z) / 2);
    this.weapon.rotation.set(0, 0, action === 'burst' ? -0.04 : -0.12);
    this.weapon.visible = stateName !== 'roll';
  }

  updateVolumes(points, stateName, action) {
    this.limbVolumes = [
      volume('left_fist', points.leftHand, 0.09), volume('right_fist', points.rightHand, 0.09),
      volume('left_elbow', points.leftElbow, 0.1), volume('right_elbow', points.rightElbow, 0.1),
      volume('left_knee', points.leftKnee, 0.12), volume('right_knee', points.rightKnee, 0.12),
      volume('left_foot', points.leftFoot, 0.12), volume('right_foot', points.rightFoot, 0.12),
      volume('weapon_hand', points.rightHand.clone().add(v(0.18, 0, 0)), this.style.weaponType === 'rifle' || this.style.weaponType === 'blade' ? 0.18 : 0.11)
    ];
    this.bodyZones = [
      volume('head', this.parts.head.position, stateName === 'prone' ? 0.2 : 0.16),
      volume('neck', this.parts.neck.position, 0.12),
      volume('chest', this.parts.torso.position.clone().add(v(0.05, 0.18, 0)), 0.28),
      volume('ribs', this.parts.torso.position.clone().add(v(0.03, 0.02, 0)), 0.3),
      volume('solar_plexus', this.parts.torso.position.clone().add(v(0.12, -0.08, 0)), 0.18),
      volume('gut', this.parts.waist.position, 0.22),
      volume('pelvis', this.parts.pelvis.position, 0.24),
      volume('left_thigh', points.leftKnee.clone().add(v(0, 0.12, 0)), 0.16),
      volume('right_thigh', points.rightKnee.clone().add(v(0, 0.12, 0)), 0.16),
      volume('left_calf', points.leftFoot.clone().add(v(0.06, 0.12, 0)), 0.13),
      volume('right_calf', points.rightFoot.clone().add(v(0.06, 0.12, 0)), 0.13),
      volume('mount_anchor', this.parts.pelvis.position.clone().add(v(0.05, 0.38, 0)), action === 'mounted_bottom' ? 0.3 : 0.18)
    ];
  }
}

function dimensionsFor(style) {
  if (style.modelClass === 'stealth_suit' || style.modelClass === 'field_agent') {
    return { shadow: 0.92, shoulders: 0.66, shoulderZ: 0.34, chest: 0.42, chestZ: 0.34, waist: 0.31, waistZ: 0.33, hips: 0.35, hipsZ: 0.42, shirtW: 0.13, neck: 0.06, head: 0.145, upperArmR: 0.048, forearmR: 0.042, thighR: 0.06, shinR: 0.052, handX: 0.075, handY: 0.095, handZ: 0.055, footX: 0.22, footZ: 0.105, elbowZ: 0.48, handRestZ: 0.39, hipZ: 0.18, kneeZ: 0.21, footRestZ: 0.22 };
  }
  if (style.modelClass === 'survival_commando') {
    return { shadow: 1.12, shoulders: 0.86, shoulderZ: 0.43, chest: 0.56, chestZ: 0.44, waist: 0.43, waistZ: 0.43, hips: 0.47, hipsZ: 0.52, shirtW: 0.18, neck: 0.075, head: 0.155, upperArmR: 0.068, forearmR: 0.058, thighR: 0.076, shinR: 0.067, handX: 0.09, handY: 0.105, handZ: 0.07, footX: 0.25, footZ: 0.14, elbowZ: 0.57, handRestZ: 0.48, hipZ: 0.23, kneeZ: 0.25, footRestZ: 0.27 };
  }
  return { shadow: 1, shoulders: 0.74, shoulderZ: 0.38, chest: 0.5, chestZ: 0.38, waist: 0.38, waistZ: 0.38, hips: 0.42, hipsZ: 0.46, shirtW: 0.16, neck: 0.068, head: 0.15, upperArmR: 0.056, forearmR: 0.049, thighR: 0.068, shinR: 0.058, handX: 0.082, handY: 0.1, handZ: 0.06, footX: 0.23, footZ: 0.12, elbowZ: 0.52, handRestZ: 0.44, hipZ: 0.2, kneeZ: 0.23, footRestZ: 0.25 };
}

function makeMaterials(THREE, style) {
  const gradientMap = createToonRampTexture(THREE);
  const make = color => createOutlineFreeToonMaterial(THREE, color, { gradientMap });
  const cloth = color => createOutlineFreeToonMaterial(THREE, color, { gradientMap });
  const metal = color => createOutlineFreeToonMaterial(THREE, color, { gradientMap });
  return {
    skin: make(style.skin), skinShadow: make(style.skinShadow), hair: cloth(style.hair),
    jacket: cloth(style.jacket), jacket2: cloth(style.jacket2), shirt: cloth(style.shirt), shirtLight: cloth(style.shirtLight),
    tie: cloth(style.tie), pants: cloth(style.pants), sleeve: cloth(style.sleeve), glove: cloth(style.glove), boot: cloth(style.boot), sole: cloth(style.sole),
    gear: cloth(style.gear), weapon: metal(style.weapon), metal: metal(style.metal), accent: make(style.accent), dark: make('#05070b')
  };
}

function box(THREE, size, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.baseLength = size[1];
  return mesh;
}

function cylinder(THREE, radius, length, material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 10), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.baseLength = length;
  return mesh;
}

function capsule(THREE, radius, length, material) {
  const geometry = THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(radius, length, 5, 8) : new THREE.CylinderGeometry(radius, radius, length + radius * 2, 8);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.baseLength = length + radius * 2;
  return mesh;
}

function setSegment(THREE, mesh, a, b) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const delta = b.clone().sub(a);
  const len = Math.max(0.001, delta.length());
  mesh.position.copy(mid);
  mesh.scale.y = len / Math.max(0.001, mesh.userData.baseLength || 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
}

function poseState(fighter) {
  if (!fighter) return 'idle';
  const pose = fighter.currentMove?.id || fighter.pose || 'idle';
  if (fighter.incapacitated || fighter.defeated || ['down', 'thrown', 'swept_fall'].includes(pose)) return 'down';
  if (fighter.prone || ['prone', 'crawl', 'flat_dive', 'mounted_bottom', 'mount_escape_blocked'].includes(pose)) return 'prone';
  if (['roll', 'combat_roll', 'dive_roll', 'somersault_dive', 'recover_dive', 'mount_escape_roll'].includes(pose)) return 'roll';
  if (fighter.crouch || ['crouchWalk', 'duck', 'mount_top', 'mount_pressure', 'ground_punch', 'ground_knife_stab'].includes(pose) || fighter.shadowHidden) return fighter.lastMove > 0.35 ? 'crouchWalk' : 'crouch';
  if (['run', 'rush', 'limp_run', 'stagger_limp', 'jumping_knee'].includes(pose) || fighter.lastMove > 0.65) return 'run';
  if (['walk', 'wall_strafe', 'careful_walk', 'pressure_step', 'step_back', 'get_up'].includes(pose) || fighter.lastMove > 0.2) return 'walk';
  return 'idle';
}

function isProneState(stateName, action) {
  return stateName === 'prone' || ['down', 'defeated', 'mounted_bottom', 'swept_fall', 'thrown', 'mount_escape_blocked'].includes(action);
}

function isCrouchState(stateName, action) {
  return stateName === 'crouch' || stateName === 'crouchWalk' || ['mount_top', 'mount_pressure', 'ground_punch', 'ground_knife_stab'].includes(action);
}

function applyPronePose(points, action) {
  points.leftHand.set(0.42, 0.17, 0.33); points.rightHand.set(0.42, 0.17, -0.33);
  points.leftElbow.set(0.15, 0.2, 0.46); points.rightElbow.set(0.15, 0.2, -0.46);
  points.leftKnee.set(-0.24, 0.16, 0.22); points.rightKnee.set(-0.24, 0.16, -0.22);
  points.leftFoot.set(-0.62, 0.13, 0.24); points.rightFoot.set(-0.62, 0.13, -0.24);
  if (action === 'mounted_bottom' || action === 'mount_escape_blocked') {
    points.leftHand.set(0.28, 0.24, 0.42); points.rightHand.set(0.3, 0.24, -0.42);
    points.leftKnee.set(-0.08, 0.16, 0.32); points.rightKnee.set(-0.08, 0.16, -0.32);
    points.leftFoot.set(-0.38, 0.12, 0.28); points.rightFoot.set(-0.38, 0.12, -0.28);
  }
}

function applyActionPose(action, points, t) {
  const jabStretch = 0.08 * Math.sin(t * 28);
  if (action === 'left_jab') { points.leftElbow.set(0.46, 1.16, 0.28); points.leftHand.set(0.78 + jabStretch, 1.18, 0.22); points.rightHand.set(0.22, 1.12, -0.3); }
  if (action === 'right_cross' || action === 'pistol' || action === 'burst') { points.rightElbow.set(0.48, 1.12, -0.24); points.rightHand.set(0.8 + jabStretch, 1.2, -0.18); points.leftHand.set(0.24, 1.08, 0.28); }
  if (action === 'right_body_hook') { points.rightElbow.set(0.34, 0.96, -0.34); points.rightHand.set(0.68, 0.92, -0.1); points.leftHand.set(0.24, 1.18, 0.28); }
  if (action === 'left_elbow') { points.leftElbow.set(0.42, 1.2, 0.2); points.leftHand.set(0.34, 1.2, 0.08); }
  if (action === 'right_elbow') { points.rightElbow.set(0.42, 1.2, -0.2); points.rightHand.set(0.34, 1.2, -0.08); }
  if (action === 'left_knee') { points.leftKnee.set(0.38, 0.68, 0.18); points.leftFoot.set(0.2, 0.24, 0.18); points.leftHand.set(0.22, 1.22, 0.38); }
  if (action === 'right_knee' || action === 'jumping_knee') { points.rightKnee.set(0.4, action === 'jumping_knee' ? 0.88 : 0.66, -0.18); points.rightFoot.set(0.2, 0.24, -0.18); points.leftHand.set(0.22, 1.22, 0.38); points.rightHand.set(0.24, 1.2, -0.32); }
  if (action === 'left_kick') { points.leftKnee.set(0.42, 0.4, 0.2); points.leftFoot.set(0.86, 0.42, 0.2); }
  if (action === 'right_kick' || action === 'roundhouse') { points.rightKnee.set(0.42, 0.4, -0.2); points.rightFoot.set(0.88, 0.42, -0.2); points.leftHand.set(0.14, 1.18, 0.34); }
  if (action === 'right_sweep') { points.rightKnee.set(0.06, 0.18, -0.32); points.rightFoot.set(0.72, 0.1, -0.34); points.leftKnee.set(-0.16, 0.36, 0.24); points.leftFoot.set(-0.02, 0.08, 0.26); points.leftHand.set(0.22, 1.08, 0.38); points.rightHand.set(0.22, 1.0, -0.38); }
  if (action === 'inside_trip') { points.leftKnee.set(0.12, 0.22, 0.24); points.leftFoot.set(0.56, 0.1, 0.22); points.rightHand.set(0.34, 1.02, -0.3); }
  if (action === 'knife_stab' || action === 'knife_jab') { points.rightElbow.set(0.46, 1.06, -0.18); points.rightHand.set(0.76, 1.08, -0.12); points.leftHand.set(0.24, 1.16, 0.28); }
  if (action === 'ground_knife_stab') { points.rightElbow.set(0.34, 0.72, -0.12); points.rightHand.set(0.58, 0.54, -0.06); points.leftHand.set(0.24, 0.72, 0.24); }
  if (action === 'gun_butt') { points.rightElbow.set(0.42, 1.18, -0.28); points.rightHand.set(0.52, 1.28, -0.18); points.leftHand.set(0.24, 1.1, 0.32); }
  if (action === 'two_hand_grab' || action === 'limb_control' || action === 'disarm_twist') { points.leftHand.set(0.58, 1.03, 0.18); points.rightHand.set(0.6, 1.0, -0.18); points.leftElbow.set(0.32, 1.1, 0.28); points.rightElbow.set(0.32, 1.08, -0.28); }
  if (action === 'judo_throw') { points.leftHand.set(0.5, 1.02, 0.22); points.rightHand.set(0.46, 0.92, -0.18); points.leftKnee.set(0.08, 0.38, 0.22); points.rightKnee.set(-0.14, 0.34, -0.24); }
  if (action === 'headbutt') { points.leftHand.set(0.24, 1.1, 0.32); points.rightHand.set(0.24, 1.1, -0.32); }
  if (action === 'mount_top' || action === 'mount_pressure') { points.leftHand.set(0.38, 0.66, 0.32); points.rightHand.set(0.38, 0.66, -0.32); points.leftKnee.set(-0.04, 0.28, 0.44); points.rightKnee.set(-0.04, 0.28, -0.44); points.leftFoot.set(-0.34, 0.16, 0.5); points.rightFoot.set(-0.34, 0.16, -0.5); }
  if (action === 'ground_punch') { points.leftHand.set(0.24, 0.72, 0.32); points.rightElbow.set(0.34, 0.72, -0.2); points.rightHand.set(0.64, 0.56, -0.1); points.leftKnee.set(-0.04, 0.28, 0.44); points.rightKnee.set(-0.04, 0.28, -0.44); }
  if (action.startsWith?.('block') || action.startsWith?.('parry') || action.startsWith?.('cross_block')) { points.leftHand.set(0.44, 1.28, 0.12); points.rightHand.set(0.44, 1.28, -0.12); if (action.endsWith?.('left')) points.leftHand.set(0.5, 1.3, 0.06); if (action.endsWith?.('right')) points.rightHand.set(0.5, 1.3, -0.06); }
  if (action.startsWith?.('slip')) { const side = action.endsWith('left') ? 0.16 : -0.16; points.leftHand.set(0.16, 1.24, 0.34 + side * 0.3); points.rightHand.set(0.16, 1.24, -0.34 + side * 0.3); }
}

function applyReactionPose(parts, action, fighter) {
  const lastZone = fighter?.cqc?.lastZone || '';
  const headSnap = action === 'hit_head_snap' ? -0.34 : 0;
  const bodyFold = action === 'hit_body_fold' ? -0.28 : 0;
  const sideFold = action === 'hit_side_fold' || lastZone.includes('liver') || lastZone.includes('ribs') ? 0.18 : 0;
  parts.head.rotation.set(headSnap, 0, sideFold); parts.jaw.rotation.set(headSnap * 0.8, 0, sideFold * 0.8); parts.brow.rotation.set(headSnap * 0.7, 0, sideFold * 0.6);
  parts.neck.rotation.set(headSnap * 0.45, 0, sideFold * 0.55); parts.shoulders.rotation.set(bodyFold * 0.35, 0, sideFold * 0.8); parts.waist.rotation.set(bodyFold * 0.4, 0, sideFold * 0.4);
}

function applySecondaryAction(parts, detail, action, phase, recoil) {
  const overlap = Math.sin(phase * 1.7) * 0.035;
  if (detail.tie) detail.tie.rotation.z = overlap + recoil * 0.22;
  if (detail.lapelLeft) detail.lapelLeft.rotation.z = -0.12 + overlap * 0.8;
  if (detail.lapelRight) detail.lapelRight.rotation.z = 0.12 - overlap * 0.8;
  if (detail.bandana) detail.bandana.rotation.z = overlap * 1.5;
  if (parts.hairCap) parts.hairCap.rotation.z = -recoil * 0.18;
  if (parts.hairFront) parts.hairFront.rotation.z += -recoil * 0.15;
  if (action === 'jumping_knee' && detail.tie) detail.tie.rotation.z += 0.24;
}

function place(mesh, x, y, z, rx = 0, ry = 0, rz = 0) {
  if (!mesh) return;
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
}

function volume(id, position, radius) { return { id, x: position.x, y: position.y, z: position.z, radius }; }
function v(x, y, z) { return new Vector3Ctor(x, y, z); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
