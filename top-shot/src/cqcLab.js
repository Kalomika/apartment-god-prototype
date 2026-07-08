import { ARCHETYPES } from './archetypes.js';
import { createArena, clampArena } from './arena.js';
import { clamp, dist } from './utils.js';

const LAB_CENTER = { x: 480, y: 360 };
const LAB_SPACE = 64;
const BODY_CORE_RADIUS = 30;
const CONTACT_MIN = BODY_CORE_RADIUS * 2;
const STRIKE_RANGE = 78;
const BODY_RANGE = 72;
const CLINCH_RANGE = 58;
const KICK_RANGE = 92;
const SWEEP_RANGE = 76;
const KNIFE_RANGE = 64;
const JUMP_RANGE = 108;
const MAX_IDLE_RANGE = 112;

const BODY_ZONES = ['head', 'ribs', 'solar_plexus', 'gut', 'liver', 'kidney', 'chest', 'back', 'left_thigh', 'right_thigh', 'left_calf', 'right_calf'];

const MOVE_LIBRARY = {
  jab: { pose: 'left_jab', kind: 'punch', limb: 'leftArm', zone: 'head', range: STRIKE_RANGE, damage: 2.5, push: 7, ttl: 0.28, stamina: 3, label: 'jab to the face' },
  cross: { pose: 'right_cross', kind: 'punch', limb: 'rightArm', zone: 'head', range: STRIKE_RANGE + 3, damage: 4.5, push: 12, ttl: 0.34, stamina: 5, label: 'right cross' },
  body_shot: { pose: 'right_body_hook', kind: 'body', limb: 'rightArm', zone: 'liver', range: BODY_RANGE, damage: 4, push: 8, ttl: 0.34, stamina: 5, label: 'body shot to the liver line' },
  elbow: { pose: 'right_elbow', kind: 'elbow', limb: 'rightArm', zone: 'ribs', range: CLINCH_RANGE + 8, damage: 5, push: 9, ttl: 0.32, stamina: 6, label: 'short elbow' },
  knee: { pose: 'right_knee', kind: 'knee', limb: 'rightLeg', zone: 'gut', range: CLINCH_RANGE + 7, damage: 5.5, push: 10, ttl: 0.36, stamina: 7, label: 'knee to the body' },
  kick: { pose: 'right_kick', kind: 'kick', limb: 'rightLeg', zone: 'chest', range: KICK_RANGE, damage: 5.2, push: 15, ttl: 0.42, stamina: 8, label: 'push kick' },
  sweep: { pose: 'right_sweep', kind: 'sweep', limb: 'rightLeg', zone: 'left_calf', range: SWEEP_RANGE, damage: 2.2, push: 5, ttl: 0.42, stamina: 7, label: 'leg sweep' },
  trip: { pose: 'inside_trip', kind: 'sweep', limb: 'leftLeg', zone: 'right_calf', range: CLINCH_RANGE + 10, damage: 1.8, push: 4, ttl: 0.42, stamina: 6, label: 'inside trip' },
  grab: { pose: 'two_hand_grab', kind: 'grab', limb: 'hands', zone: 'wrist', range: CLINCH_RANGE + 4, damage: 1, push: 2, ttl: 0.36, stamina: 5, label: 'wrist grab' },
  throw: { pose: 'judo_throw', kind: 'throw', limb: 'hips', zone: 'torso', range: CLINCH_RANGE + 3, damage: 4, push: 18, ttl: 0.52, stamina: 10, label: 'judo throw' },
  headbutt: { pose: 'headbutt', kind: 'headbutt', limb: 'head', zone: 'head', range: CLINCH_RANGE + 2, damage: 4.8, push: 10, ttl: 0.32, stamina: 7, label: 'headbutt' },
  knife_attack: { pose: 'knife_stab', kind: 'knife', limb: 'rightArm', zone: 'ribs', range: KNIFE_RANGE, damage: 7.5, push: 5, ttl: 0.34, stamina: 5, label: 'knife stab' },
  gun_butt: { pose: 'gun_butt', kind: 'weapon', limb: 'rightArm', zone: 'head', range: CLINCH_RANGE + 12, damage: 5.8, push: 12, ttl: 0.38, stamina: 7, label: 'gun butt strike' },
  disarm: { pose: 'disarm_twist', kind: 'disarm', limb: 'hands', zone: 'right_wrist', range: CLINCH_RANGE + 5, damage: 2.5, push: 4, ttl: 0.46, stamina: 8, label: 'weapon disarm' },
  limb_grab: { pose: 'limb_control', kind: 'limb', limb: 'hands', zone: 'right_wrist', range: CLINCH_RANGE + 5, damage: 1.2, push: 2, ttl: 0.36, stamina: 4, label: 'limb control' },
  jump_attack: { pose: 'jumping_knee', kind: 'jump', limb: 'rightLeg', zone: 'chest', range: JUMP_RANGE, damage: 6, push: 18, ttl: 0.5, stamina: 12, label: 'jumping knee' },
  ground_punch: { pose: 'ground_punch', kind: 'ground', limb: 'rightArm', zone: 'head', range: CLINCH_RANGE + 6, damage: 4.2, push: 3, ttl: 0.32, stamina: 5, label: 'ground punch' },
  ground_knife: { pose: 'ground_knife_stab', kind: 'ground_knife', limb: 'rightArm', zone: 'ribs', range: CLINCH_RANGE + 6, damage: 8.5, push: 2, ttl: 0.36, stamina: 6, label: 'knife threat from mount' }
};

const AUTO_PROFILES = {
  survival_commando: ['body_shot', 'knife_attack', 'sweep', 'gun_butt', 'grab', 'throw'],
  suit_operative: ['jab', 'cross', 'disarm', 'gun_butt', 'throw', 'body_shot'],
  shadow_ninja: ['jump_attack', 'knife_attack', 'sweep', 'limb_grab', 'kick', 'disarm'],
  ninja: ['jump_attack', 'knife_attack', 'sweep', 'limb_grab', 'kick', 'disarm'],
  martial_artist: ['jab', 'body_shot', 'kick', 'sweep', 'throw', 'headbutt'],
  field_agent: ['jab', 'cross', 'disarm', 'body_shot', 'kick', 'gun_butt'],
  marine: ['body_shot', 'gun_butt', 'sweep', 'grab', 'throw', 'knife_attack'],
  archer: ['step_back', 'kick', 'limb_grab', 'disarm', 'body_shot']
};

export function createCqcLabState(aId = 'suit_operative', bId = 'survival_commando') {
  const arena = createArena();
  const a = makeLabFighter('A', ARCHETYPES[aId], LAB_CENTER.x - LAB_SPACE, LAB_CENTER.y, 0);
  const b = makeLabFighter('B', ARCHETYPES[bId], LAB_CENTER.x + LAB_SPACE, LAB_CENTER.y, Math.PI);
  return {
    mode: 'cqc',
    arena,
    selectedFighters: { A: aId, B: bId },
    paused: false,
    clock: 0,
    matchState: 'running',
    commanderEthos: 'lab',
    trust: 100,
    selectedDrop: null,
    selectedCommand: null,
    commandHistory: [],
    dropsLeft: {},
    fighters: [a, b],
    projectiles: [],
    effects: [],
    pickups: [],
    debris: [],
    lab: {
      action: 'guard',
      actionT: 0,
      exchange: 0,
      slowMo: false,
      auto: false,
      autoT: 0,
      nextAuto: 0.35,
      lastHitZone: null,
      notes: 'CQC Lab ready.'
    },
    log: ['CQC Lab loaded. Manual moves test one action. Auto makes fighters close and exchange until stopped.']
  };
}

export function triggerCqcAction(state, action) {
  if (!state || state.mode !== 'cqc') return false;
  const [a, b] = state.fighters;
  state.lab.action = action;
  state.lab.actionT = 0;
  state.lab.exchange += 1;
  state.effects.push({ type: 'command', x: LAB_CENTER.x, y: LAB_CENTER.y - 42, ttl: 0.5, label: action });

  if (action === 'reset') {
    resetLabSpacing(state);
    pushLog(state, 'Reset spacing. Fighters return to close face-off range.');
    return true;
  }
  if (action === 'slowmo') return toggleCqcSlowMo(state);
  if (action === 'auto') {
    state.lab.auto = !state.lab.auto;
    state.lab.autoT = 0;
    state.lab.nextAuto = 0.2;
    a.currentMove = null;
    b.currentMove = null;
    a.pose = b.pose = state.lab.auto ? 'idle_guard' : 'idle_guard';
    pushLog(state, state.lab.auto ? 'Auto CQC on. Fighters will close distance and keep fighting.' : 'Auto CQC off. Manual buttons now test isolated moves.');
    return true;
  }
  if (action === 'guard') {
    state.lab.auto = false;
    a.pose = 'idle_guard';
    b.pose = 'idle_guard';
    a.cqc.guard = 'high';
    b.cqc.guard = 'high';
    pushLog(state, 'Both fighters guard and read each other.');
    return true;
  }
  if (action === 'block') return manualDefense(state, 'block');
  if (action === 'parry') return manualDefense(state, 'parry');
  if (action === 'slip_left' || action === 'slip_right') return manualDefense(state, action);
  if (action === 'step_back') return stepBack(state, a, b, 'manual');
  if (action === 'mount') return manualMount(state, a, b);
  if (action === 'escape_mount') return escapeMount(state, mountedPair(state)?.bottom || b, mountedPair(state)?.top || a);
  if (MOVE_LIBRARY[action]) {
    state.lab.auto = false;
    return performAction(state, a, b, action, { manual: true });
  }
  return false;
}

export function updateCqcLab(state, dt) {
  if (!state || state.mode !== 'cqc' || state.paused) return;
  const scaledDt = state.lab?.slowMo ? dt * 0.35 : dt;
  state.clock += scaledDt;
  state.effects.forEach(e => { e.ttl -= scaledDt; });
  state.effects = state.effects.filter(e => e.ttl > 0);
  state.lab.actionT += scaledDt;
  const [a, b] = state.fighters;

  updateFighterTimers(a, scaledDt);
  updateFighterTimers(b, scaledDt);
  updateGroundStates(state, scaledDt);
  updateMountAnchor(state);
  keepFacing(a, b);

  if (state.lab.auto) updateAutoCombat(state, scaledDt);

  maintainLabSpacing(state, a, b, scaledDt);
  updateHitboxes(a);
  updateHitboxes(b);

  for (const f of state.fighters) {
    f.intent = state.lab.auto ? 'cqc_auto' : 'cqc_lab';
    f.hidden = false;
    f.crouch = f.pose === 'mount_top' || f.pose === 'knee_on_body';
    f.prone = ['grounded_back', 'grounded_side', 'mounted_bottom', 'swept_fall'].includes(f.pose);
    f.shadowHidden = false;
    f.stamina = clamp(f.stamina + scaledDt * 6, 0, 100);
    f.block = clamp(f.block + scaledDt * 7, 0, 100);
    f.dodge = clamp(f.dodge + scaledDt * 7, 0, 100);
  }

  if (state.lab.actionT > 0.7 && !a.currentMove && !b.currentMove && !state.lab.auto) {
    for (const f of state.fighters) {
      if (f.cqc.grounded || f.cqc.mountedBy || f.cqc.mounting) continue;
      if (!['guard', 'reset', 'auto'].includes(state.lab.action)) f.pose = 'idle_guard';
    }
  }
}

export function toggleCqcSlowMo(state) {
  if (!state || state.mode !== 'cqc') return false;
  state.lab.slowMo = !state.lab.slowMo;
  pushLog(state, state.lab.slowMo ? 'Slow motion on.' : 'Slow motion off.');
  return true;
}

function makeLabFighter(team, archetype, x, y, facing) {
  return {
    id: `${team}-${archetype.id}`, team, archetypeId: archetype.id, name: `${team}: ${archetype.name}`,
    color: archetype.color, accent: archetype.accent, weapon: archetype.weapon, melee: archetype.melee, special: archetype.special,
    x, y, vx: 0, vy: 0, facing, target: null, intent: 'cqc_lab', pose: 'idle_guard', anim: 0,
    spawn: { x, y, facing }, deploy: null, deployAltitude: 0, deploying: false,
    hp: 100, vitalityCap: 100, painStage: 'green', stamina: 100, fight: 100, dodge: 100, block: 100, morale: 75, heat: 0, noise: 0,
    prestige: archetype.stats.prestige, ruthless: archetype.stats.ruthlessness, defeated: false, finishT: 0,
    prone: false, crouch: false, hidden: false, extracting: false, extracted: false, incapacitated: false,
    comboT: 0, actionT: 0, cooldown: 0, rangedCd: 0, meleeCd: 0, specialCd: 0, bandageCd: 0, getupT: 0, commandCd: 0, holdT: 0,
    stats: { ...archetype.stats }, resources: { ...archetype.resources }, injuries: {}, permanent: {}, limbs: {}, memory: { command: null, lastSeen: null, lastHitBy: null, fear: 0 },
    currentMove: null, downT: 0, collisionT: 0, dizzyT: 0, stepPhase: 0, stepLock: 0, lastMove: 0,
    hitboxes: [],
    cqc: {
      coreRadius: BODY_CORE_RADIUS,
      guard: 'high',
      grounded: false,
      groundedT: 0,
      mounting: null,
      mountedBy: null,
      mountRole: null,
      controlledLimb: null,
      disarmedT: 0,
      recoilX: 0,
      recoilY: 0,
      recoilT: 0,
      lastZone: null,
      lastIncomingSide: null,
      style: styleFor(archetype.id)
    }
  };
}

function resetLabSpacing(state) {
  const [a, b] = state.fighters;
  for (const f of state.fighters) {
    f.x = f.spawn.x;
    f.y = f.spawn.y;
    f.vx = 0;
    f.vy = 0;
    f.hp = 100;
    f.stamina = 100;
    f.block = 100;
    f.dodge = 100;
    f.pose = 'idle_guard';
    f.currentMove = null;
    f.defeated = false;
    f.incapacitated = false;
    f.prone = false;
    f.crouch = false;
    f.downT = 0;
    f.dizzyT = 0;
    f.cqc.grounded = false;
    f.cqc.groundedT = 0;
    f.cqc.mounting = null;
    f.cqc.mountedBy = null;
    f.cqc.mountRole = null;
    f.cqc.controlledLimb = null;
    f.cqc.disarmedT = 0;
    f.cqc.recoilX = 0;
    f.cqc.recoilY = 0;
    f.cqc.recoilT = 0;
  }
  state.lab.auto = false;
  state.lab.autoT = 0;
  state.lab.nextAuto = 0.35;
  keepFacing(a, b);
}

function manualDefense(state, action) {
  state.lab.auto = false;
  const [a, b] = state.fighters;
  approachToRange(b, a, STRIKE_RANGE - 5, 1);
  const incoming = action.includes('slip') ? 'jab' : 'cross';
  const spec = MOVE_LIBRARY[incoming];
  b.pose = spec.pose;
  b.currentMove = moveState(spec, b, a);
  if (action === 'block') {
    const blockPose = spec.limb === 'rightArm' ? 'block_left' : 'block_right';
    a.pose = blockPose;
    a.cqc.guard = spec.limb === 'rightArm' ? 'left' : 'right';
    a.block = clamp(a.block + 8, 0, 100);
    pushLog(state, `A blocks with the ${a.cqc.guard} side against the incoming ${spec.label}.`);
    return true;
  }
  if (action === 'parry') {
    a.pose = spec.limb === 'rightArm' ? 'parry_left' : 'parry_right';
    b.facing += 0.08;
    b.stamina = clamp(b.stamina - 3, 0, 100);
    state.effects.push({ type: 'parry', x: b.x - 16, y: b.y, ttl: 0.22 });
    pushLog(state, 'A redirects the strike with a side aware parry.');
    return true;
  }
  const side = action === 'slip_left' ? -1 : 1;
  a.pose = action;
  a.x += side * 12;
  a.y += side * 8;
  a.dodge = clamp(a.dodge + 5, 0, 100);
  pushLog(state, `A slips ${side < 0 ? 'left' : 'right'} outside the punch.`);
  return true;
}

function performAction(state, attacker, defender, action, options = {}) {
  const spec = MOVE_LIBRARY[action];
  if (!spec) return false;
  const pair = mountedPair(state);

  if (['ground_punch', 'ground_knife'].includes(action) && !attacker.cqc.mounting) {
    if (!manualMount(state, attacker, defender, false)) return false;
  }

  if (action === 'throw' && !inRange(attacker, defender, spec.range)) approachToRange(attacker, defender, spec.range - 3, options.manual ? 1 : 0.8);
  else if (!attacker.cqc.mounting && !defender.cqc.mountedBy) approachToRange(attacker, defender, spec.range - 4, options.manual ? 1 : 0.65);

  if (action === 'mount') return manualMount(state, attacker, defender);
  if (action === 'step_back') return stepBack(state, attacker, defender, options.manual ? 'manual' : 'auto');

  const distance = dist(attacker, defender);
  const reachable = attacker.cqc.mounting === defender.id || distance <= spec.range;
  attacker.pose = spec.pose;
  attacker.currentMove = moveState(spec, attacker, defender);
  attacker.stamina = clamp(attacker.stamina - spec.stamina, 0, 100);
  attacker.cqc.controlledLimb = action === 'limb_grab' || action === 'disarm' ? spec.zone : null;

  if (!reachable) {
    attacker.pose = 'pressure_step';
    pushLog(state, `${attacker.team} steps in for ${spec.label}, but the range is still short.`);
    return true;
  }

  const defended = resolveDefense(state, attacker, defender, spec);
  if (defended) return true;

  if (spec.kind === 'sweep') return applySweep(state, attacker, defender, spec);
  if (spec.kind === 'throw') return applyThrow(state, attacker, defender, spec);
  if (spec.kind === 'grab' || spec.kind === 'limb') return applyLimbControl(state, attacker, defender, spec);
  if (spec.kind === 'disarm') return applyDisarm(state, attacker, defender, spec);
  if (spec.kind === 'jump' && defender.cqc.grounded) return manualMount(state, attacker, defender);

  applyDamage(state, attacker, defender, spec);
  if (pair?.top === attacker && ['ground', 'ground_knife'].includes(spec.kind)) updateMountAnchor(state);
  return true;
}

function resolveDefense(state, attacker, defender, spec) {
  if (defender.cqc.mountedBy || defender.cqc.grounded) return false;
  const autoDefense = state.lab.auto && Math.random() < defenseChance(defender, spec);
  const side = spec.limb?.includes('right') ? 'left' : spec.limb?.includes('left') ? 'right' : 'center';
  defender.cqc.lastIncomingSide = side;
  if (!autoDefense) return false;
  if (spec.kind === 'sweep' && Math.random() < 0.55) {
    defender.pose = side === 'left' ? 'check_left' : 'check_right';
    attacker.pose = 'sweep_checked';
    attacker.stamina = clamp(attacker.stamina - 2, 0, 100);
    pushLog(state, `${defender.team} checks the ${spec.label} and keeps balance.`);
    return true;
  }
  if (Math.random() < 0.38 && defender.dodge > 25) {
    defender.pose = side === 'left' ? 'slip_left' : 'slip_right';
    defender.dodge = clamp(defender.dodge - 14, 0, 100);
    pushLog(state, `${defender.team} slips away before the ${spec.label} lands.`);
    return true;
  }
  defender.pose = side === 'left' ? 'block_left' : side === 'right' ? 'block_right' : 'cross_block';
  defender.block = clamp(defender.block - 12, 0, 100);
  state.effects.push({ type: 'block_spark', x: midpoint(attacker.x, defender.x), y: midpoint(attacker.y, defender.y), ttl: 0.12, kind: spec.zone });
  pushLog(state, `${defender.team} blocks with the ${side} side against ${attacker.team}'s ${spec.label}.`);
  return true;
}

function applyDamage(state, attacker, defender, spec) {
  const zone = chooseZone(spec.zone);
  const damage = damageForZone(spec.damage, zone, defender);
  defender.hp = clamp(defender.hp - damage, 0, 100);
  defender.memory.lastHitBy = attacker.id;
  defender.cqc.lastZone = zone;
  state.lab.lastHitZone = zone;
  applyDirectionalRecoil(attacker, defender, spec.push, zone);
  defender.pose = reactionPose(zone, spec);
  defender.dizzyT = Math.max(defender.dizzyT || 0, stunForZone(zone, spec));
  state.effects.push({ type: 'impact_flash', x: defender.x, y: defender.y, ttl: 0.1, kind: zone });
  if (defender.hp <= 0) {
    defender.defeated = true;
    defender.pose = 'down';
    defender.cqc.grounded = true;
    defender.cqc.groundedT = 1.6;
  }
  pushLog(state, `${attacker.team} lands a ${spec.label} on ${defender.team}'s ${zoneLabel(zone)}. ${reactionCopy(zone)}`);
}

function applySweep(state, attacker, defender, spec) {
  const balance = (defender.stats?.dodge || 50) + defender.dodge * 0.45 + defender.stamina * 0.25;
  const sweepPower = (attacker.stats?.grapple || 55) + attacker.stamina * 0.35 + (spec.kind === 'sweep' ? 15 : 0);
  if (Math.random() * 130 + balance * 0.25 > sweepPower) {
    defender.pose = 'stumble_leg';
    applyDirectionalRecoil(attacker, defender, 7, spec.zone);
    defender.stamina = clamp(defender.stamina - 8, 0, 100);
    pushLog(state, `${attacker.team} clips the leg with a sweep, ${defender.team} stumbles but stays up.`);
    return true;
  }
  defender.hp = clamp(defender.hp - spec.damage, 0, 100);
  defender.pose = 'swept_fall';
  defender.cqc.grounded = true;
  defender.cqc.groundedT = 1.25;
  defender.downT = Math.max(defender.downT || 0, 1.15);
  applyDirectionalRecoil(attacker, defender, 12, spec.zone);
  pushLog(state, `${attacker.team} sweeps ${defender.team}'s legs and puts them on the floor.`);
  if (state.lab.auto && Math.random() < 0.48) manualMount(state, attacker, defender, true);
  return true;
}

function applyThrow(state, attacker, defender, spec) {
  defender.hp = clamp(defender.hp - spec.damage, 0, 100);
  defender.pose = 'thrown';
  defender.cqc.grounded = true;
  defender.cqc.groundedT = 1.5;
  defender.downT = Math.max(defender.downT || 0, 1.35);
  applyDirectionalRecoil(attacker, defender, spec.push, spec.zone);
  pushLog(state, `${attacker.team} turns the clinch into a judo style throw. ${defender.team} hits the ground.`);
  return true;
}

function applyLimbControl(state, attacker, defender, spec) {
  defender.cqc.controlledLimb = spec.zone;
  defender.pose = 'limb_trapped';
  defender.stamina = clamp(defender.stamina - 8, 0, 100);
  pushLog(state, `${attacker.team} traps ${defender.team}'s ${zoneLabel(spec.zone)} for control, disarm, or a follow-up.`);
  return true;
}

function applyDisarm(state, attacker, defender, spec) {
  defender.cqc.controlledLimb = spec.zone;
  defender.cqc.disarmedT = 2.4;
  defender.pose = 'disarmed_react';
  defender.stamina = clamp(defender.stamina - 10, 0, 100);
  state.effects.push({ type: 'weapon_jolt', x: defender.x, y: defender.y, ttl: 0.22 });
  pushLog(state, `${attacker.team} redirects the weapon hand and disarms ${defender.team}.`);
  return true;
}

function manualMount(state, attacker, defender, log = true) {
  if (!defender.cqc.grounded && !['swept_fall', 'thrown', 'down', 'mounted_bottom'].includes(defender.pose)) {
    performAction(state, attacker, defender, 'sweep', { manual: true });
  }
  defender.cqc.grounded = true;
  defender.cqc.mountedBy = attacker.id;
  defender.cqc.mountRole = 'bottom';
  defender.pose = 'mounted_bottom';
  attacker.cqc.mounting = defender.id;
  attacker.cqc.mountRole = 'top';
  attacker.pose = 'mount_top';
  attacker.currentMove = { id: 'mount_top', ttl: 0.42, limb: 'hips', kind: 'mount' };
  positionMount(attacker, defender);
  if (log) pushLog(state, `${attacker.team} jumps into mount and stays on top of the body instead of clipping through it.`);
  return true;
}

function escapeMount(state, bottom, top) {
  if (!bottom || !top || bottom.cqc.mountedBy !== top.id) {
    pushLog(state, 'No mount is locked right now, escape mount has nothing to resolve.');
    return false;
  }
  const escapePower = (bottom.stats?.grapple || 50) + bottom.stamina * 0.7 + bottom.dodge * 0.25;
  const topControl = (top.stats?.grapple || 50) + top.stamina * 0.65;
  if (escapePower + Math.random() * 45 > topControl + 18) {
    bottom.cqc.mountedBy = null;
    bottom.cqc.mountRole = null;
    bottom.cqc.grounded = false;
    bottom.cqc.groundedT = 0;
    bottom.pose = 'mount_escape_roll';
    top.cqc.mounting = null;
    top.cqc.mountRole = null;
    top.pose = 'off_balance';
    top.currentMove = null;
    stepBack(state, bottom, top, 'escape');
    pushLog(state, `${bottom.team} bucks, rolls, and escapes the mount.`);
    return true;
  }
  bottom.pose = 'mount_escape_blocked';
  bottom.stamina = clamp(bottom.stamina - 9, 0, 100);
  top.pose = 'mount_pressure';
  pushLog(state, `${bottom.team} tries to buck out, but ${top.team} keeps mount pressure.`);
  return true;
}

function stepBack(state, actor, opponent, source) {
  const d = Math.max(0.001, dist(actor, opponent));
  const nx = (actor.x - opponent.x) / d;
  const ny = (actor.y - opponent.y) / d;
  actor.x += nx * 32;
  actor.y += ny * 32;
  actor.pose = source === 'escape' ? actor.pose : 'step_back';
  opponent.pose = opponent.cqc?.grounded ? opponent.pose : 'pressure_step';
  clampFighter(actor);
  pushLog(state, `${actor.team} steps back to break range without sliding through ${opponent.team}.`);
  return true;
}

function updateAutoCombat(state, dt) {
  const [a, b] = state.fighters;
  const pair = mountedPair(state);
  state.lab.autoT += dt;
  if (!pair && dist(a, b) > STRIKE_RANGE - 3) {
    approachToRange(a, b, STRIKE_RANGE - 8, 0.42);
    approachToRange(b, a, STRIKE_RANGE - 8, 0.42);
    a.pose = a.pose === 'idle_guard' ? 'pressure_step' : a.pose;
    b.pose = b.pose === 'idle_guard' ? 'pressure_step' : b.pose;
  }
  if (state.lab.autoT < state.lab.nextAuto) return;
  state.lab.autoT = 0;
  state.lab.nextAuto = 0.34 + Math.random() * 0.34;

  if (pair) {
    if (Math.random() < 0.38) escapeMount(state, pair.bottom, pair.top);
    else performAction(state, pair.top, pair.bottom, Math.random() < 0.7 ? 'ground_punch' : 'ground_knife', { manual: false });
    return;
  }

  const attacker = state.lab.exchange % 2 === 0 ? a : b;
  const defender = attacker === a ? b : a;
  state.lab.exchange += 1;
  const action = pickAutoAction(attacker, defender);
  if (action === 'step_back') stepBack(state, attacker, defender, 'auto');
  else if (action === 'mount') manualMount(state, attacker, defender, true);
  else performAction(state, attacker, defender, action, { manual: false });
}

function pickAutoAction(attacker, defender) {
  if (defender.cqc.grounded && Math.random() < 0.7) return 'mount';
  const styleMoves = AUTO_PROFILES[attacker.archetypeId] || ['jab', 'cross', 'body_shot', 'kick', 'sweep', 'grab'];
  const lowStamina = attacker.stamina < 26;
  if (lowStamina && Math.random() < 0.35) return 'step_back';
  const move = styleMoves[Math.floor(Math.random() * styleMoves.length)] || 'jab';
  if (move === 'knife_attack' && !hasBlade(attacker)) return attacker.weapon === 'rifle' || attacker.weapon === 'pistol' ? 'gun_butt' : 'body_shot';
  return move;
}

function updateFighterTimers(f, dt) {
  f.currentMove &&= tickMove(f.currentMove, dt);
  f.collisionT = Math.max(0, (f.collisionT || 0) - dt);
  f.dizzyT = Math.max(0, (f.dizzyT || 0) - dt);
  f.downT = Math.max(0, (f.downT || 0) - dt);
  f.cqc.disarmedT = Math.max(0, (f.cqc.disarmedT || 0) - dt);
  f.cqc.recoilT = Math.max(0, (f.cqc.recoilT || 0) - dt);
  f.anim += dt * 8;
  f.x += (f.vx || 0) * dt;
  f.y += (f.vy || 0) * dt;
  f.vx *= Math.pow(0.02, dt);
  f.vy *= Math.pow(0.02, dt);
  clampFighter(f);
}

function updateGroundStates(state, dt) {
  for (const f of state.fighters) {
    if (!f.cqc.grounded || f.cqc.mountedBy) continue;
    f.cqc.groundedT = Math.max(0, f.cqc.groundedT - dt);
    if (f.cqc.groundedT <= 0 && !state.lab.auto) continue;
    if (f.cqc.groundedT <= 0 && Math.random() < 0.18) {
      f.cqc.grounded = false;
      f.pose = 'get_up';
      pushLog(state, `${f.team} scrambles back to their feet.`);
    }
  }
}

function updateMountAnchor(state) {
  const pair = mountedPair(state);
  if (!pair) return;
  positionMount(pair.top, pair.bottom);
}

function maintainLabSpacing(state, a, b, dt) {
  if (mountedPair(state)) return;
  separateFighters(a, b, CONTACT_MIN);
  const d = Math.max(0.001, dist(a, b));
  const shouldClose = state.lab.auto || state.lab.actionT < 0.48;
  if (shouldClose && d > STRIKE_RANGE) {
    const pull = Math.min(58 * dt, (d - STRIKE_RANGE) * 0.35);
    moveToward(a, b, pull * 0.5);
    moveToward(b, a, pull * 0.5);
  } else if (!state.lab.auto && d > MAX_IDLE_RANGE) {
    const pull = Math.min(18 * dt, (d - MAX_IDLE_RANGE) * 0.18);
    moveToward(a, b, pull * 0.5);
    moveToward(b, a, pull * 0.5);
  }
  clampFighter(a);
  clampFighter(b);
}

function approachToRange(attacker, defender, desiredRange, amount = 1) {
  const d = Math.max(0.001, dist(attacker, defender));
  const target = Math.max(CONTACT_MIN + 2, desiredRange);
  if (d <= target) return;
  const move = Math.min((d - target) * amount, d - CONTACT_MIN - 1);
  moveToward(attacker, defender, move);
  separateFighters(attacker, defender, CONTACT_MIN);
  clampFighter(attacker);
}

function moveToward(actor, target, amount) {
  const d = Math.max(0.001, dist(actor, target));
  actor.x += (target.x - actor.x) / d * amount;
  actor.y += (target.y - actor.y) / d * amount;
  actor.lastMove = Math.max(actor.lastMove || 0, amount / 32);
}

function separateFighters(a, b, minDistance) {
  const d = Math.max(0.001, dist(a, b));
  if (d >= minDistance) return;
  const push = (minDistance - d) * 0.5;
  const nx = (a.x - b.x) / d;
  const ny = (a.y - b.y) / d;
  a.x += nx * push;
  a.y += ny * push;
  b.x -= nx * push;
  b.y -= ny * push;
  a.collisionT = b.collisionT = 0.15;
}

function applyDirectionalRecoil(attacker, defender, amount, zone) {
  const d = Math.max(0.001, dist(attacker, defender));
  const nx = (defender.x - attacker.x) / d;
  const ny = (defender.y - attacker.y) / d;
  const sideKick = zone.includes('liver') || zone.includes('ribs') || zone.includes('calf') || zone.includes('thigh') ? 0.45 : 0;
  defender.x += nx * amount + -ny * amount * sideKick;
  defender.y += ny * amount + nx * amount * sideKick;
  defender.vx = nx * amount * 14;
  defender.vy = ny * amount * 14;
  defender.cqc.recoilX = nx;
  defender.cqc.recoilY = ny;
  defender.cqc.recoilT = 0.32;
  clampFighter(defender);
}

function updateHitboxes(f) {
  const forward = { x: Math.cos(f.facing || 0), y: Math.sin(f.facing || 0) };
  const right = { x: -forward.y, y: forward.x };
  const point = (id, fx, ry, radius) => ({ id, x: f.x + forward.x * fx + right.x * ry, y: f.y + forward.y * fx + right.y * ry, radius });
  f.hitboxes = [
    point('head', 24, 0, 13),
    point('neck', 14, 0, 10),
    point('chest', 8, 0, 22),
    point('ribs', 3, 0, 20),
    point('solar_plexus', 4, 0, 16),
    point('gut', -8, 0, 19),
    point('liver', -2, 14, 13),
    point('kidney', -12, -14, 13),
    point('back', -18, 0, 18),
    point('left_arm', 7, 27, 11),
    point('right_arm', 7, -27, 11),
    point('left_forearm_block', 22, 25, 12),
    point('right_forearm_block', 22, -25, 12),
    point('left_hand', 34, 24, 8),
    point('right_hand', 34, -24, 8),
    point('left_leg', -26, 13, 13),
    point('right_leg', -26, -13, 13),
    point('left_knee', -20, 14, 10),
    point('right_knee', -20, -14, 10),
    point('left_foot', -38, 14, 11),
    point('right_foot', -38, -14, 11),
    point('collision_core', 0, 0, BODY_CORE_RADIUS)
  ];
}

function inRange(a, b, range) {
  return dist(a, b) <= range;
}

function moveState(spec, attacker, defender) {
  return { id: spec.pose, ttl: spec.ttl, limb: spec.limb, kind: spec.kind, target: defender.id, zone: spec.zone, from: attacker.id };
}

function tickMove(move, dt) {
  move.ttl -= dt;
  return move.ttl > 0 ? move : null;
}

function keepFacing(a, b) {
  a.facing = Math.atan2(b.y - a.y, b.x - a.x);
  b.facing = Math.atan2(a.y - b.y, a.x - b.x);
}

function clampFighter(f) {
  const point = clampArena(f, 16);
  f.x = point.x;
  f.y = point.y;
}

function mountedPair(state) {
  const top = state.fighters.find(f => f.cqc.mounting);
  if (!top) return null;
  const bottom = state.fighters.find(f => f.id === top.cqc.mounting);
  return bottom ? { top, bottom } : null;
}

function positionMount(top, bottom) {
  const facing = bottom.facing || 0;
  const nx = Math.cos(facing);
  const ny = Math.sin(facing);
  top.x = bottom.x - nx * 7;
  top.y = bottom.y - ny * 7;
  top.facing = Math.atan2(bottom.y - top.y, bottom.x - top.x);
  bottom.pose = 'mounted_bottom';
  top.pose = top.currentMove?.id?.startsWith('ground') ? top.currentMove.id : 'mount_top';
}

function chooseZone(zone) {
  if (zone && zone !== 'torso') return zone;
  return BODY_ZONES[Math.floor(Math.random() * BODY_ZONES.length)] || 'gut';
}

function damageForZone(base, zone, defender) {
  const toughness = defender.stats?.toughness || 60;
  const toughnessScale = clamp(1.12 - toughness / 300, 0.74, 1.05);
  const zoneScale = zone.includes('head') ? 1.18 : zone.includes('liver') || zone.includes('solar') ? 1.14 : zone.includes('calf') || zone.includes('thigh') ? 0.82 : 1;
  return base * toughnessScale * zoneScale;
}

function stunForZone(zone, spec) {
  if (spec.kind === 'knife' || spec.kind === 'ground_knife') return 0.24;
  if (zone.includes('head')) return 0.34;
  if (zone.includes('liver') || zone.includes('solar') || zone.includes('gut')) return 0.28;
  if (zone.includes('calf') || zone.includes('thigh')) return 0.18;
  return 0.16;
}

function reactionPose(zone, spec) {
  if (spec.kind === 'knife' || spec.kind === 'ground_knife') return 'stab_react';
  if (zone.includes('head')) return 'hit_head_snap';
  if (zone.includes('liver') || zone.includes('ribs')) return 'hit_side_fold';
  if (zone.includes('gut') || zone.includes('solar')) return 'hit_body_fold';
  if (zone.includes('calf') || zone.includes('thigh')) return 'stumble_leg';
  return 'hit_react';
}

function reactionCopy(zone) {
  if (zone.includes('head')) return 'The head and shoulders snap off line.';
  if (zone.includes('gut') || zone.includes('solar')) return 'The body folds instead of just jittering back.';
  if (zone.includes('liver') || zone.includes('ribs')) return 'The torso twists away from the impact.';
  if (zone.includes('calf') || zone.includes('thigh')) return 'The stance weakens and balance breaks.';
  return 'The target staggers away from the force.';
}

function zoneLabel(zone) {
  return String(zone || 'body').replace(/_/g, ' ');
}

function defenseChance(defender, spec) {
  const defense = ((defender.stats?.block || 50) + (defender.stats?.dodge || 50)) * 0.005 + defender.block * 0.002 + defender.dodge * 0.0015;
  const attackPenalty = spec.kind === 'jump' || spec.kind === 'knife' ? 0.09 : 0;
  return clamp(0.18 + defense - attackPenalty, 0.12, 0.62);
}

function styleFor(archetypeId) {
  if (['survival_commando', 'marine'].includes(archetypeId)) return 'military_survival';
  if (['suit_operative', 'field_agent'].includes(archetypeId)) return 'gun_fu_assassin';
  if (archetypeId === 'martial_artist') return 'jeet_kune_do_striker';
  if (['shadow_ninja', 'ninja'].includes(archetypeId)) return 'hong_kong_acrobatic_blade';
  return 'cqc_generalist';
}

function hasBlade(f) {
  return ['knife', 'sword', 'arrow_stab'].includes(f.melee) || ['knife', 'sword', 'shuriken', 'bow'].includes(f.weapon);
}

function midpoint(a, b) {
  return (a + b) / 2;
}

function pushLog(state, text) {
  state.log.unshift(`${state.clock.toFixed(1)}s ${text}`);
  state.log = state.log.slice(0, 12);
}
