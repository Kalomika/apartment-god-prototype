import { ARCHETYPES } from './archetypes.js';
import { createArena, clampArena } from './arena.js';
import { clamp, dist } from './utils.js';

const LAB_CENTER = { x: 480, y: 360 };
const LAB_SPACE = 58;

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
    lab: { action: 'guard', actionT: 0, exchange: 0, slowMo: false, notes: 'CQC Lab ready.' },
    log: ['CQC Lab loaded. Use lab buttons to test one close-quarter move at a time.']
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
    pushLog(state, 'Reset spacing. Fighters return to face-off range.');
    return true;
  }
  if (action === 'guard') {
    a.pose = 'idle_guard';
    b.pose = 'idle_guard';
    pushLog(state, 'Both fighters guard and read each other.');
    return true;
  }
  if (action === 'block') {
    a.pose = 'block_rightArm';
    b.pose = 'right_cross';
    b.currentMove = { id: 'right_cross', ttl: 0.34, limb: 'rightArm', kind: 'punch' };
    a.block = clamp(a.block + 8, 0, 100);
    pushLog(state, 'A shells up and blocks the incoming cross.');
    return true;
  }
  if (action === 'parry') {
    a.pose = 'parry_leftArm';
    b.pose = 'right_cross';
    b.currentMove = { id: 'right_cross', ttl: 0.28, limb: 'rightArm', kind: 'punch' };
    b.facing += 0.08;
    state.effects.push({ type: 'parry', x: b.x - 16, y: b.y, ttl: 0.22 });
    pushLog(state, 'A redirects the strike with a parry.');
    return true;
  }
  if (action === 'slip_left' || action === 'slip_right') {
    const side = action === 'slip_left' ? -1 : 1;
    a.pose = action;
    b.pose = 'left_jab';
    b.currentMove = { id: 'left_jab', ttl: 0.25, limb: 'leftArm', kind: 'punch' };
    a.x += side * 12;
    a.y += side * 8;
    pushLog(state, `A slips ${side < 0 ? 'left' : 'right'} outside the punch.`);
    return true;
  }
  if (action === 'step_back') {
    a.pose = 'step_back';
    b.pose = 'pressure_step';
    a.x -= 30;
    b.x += 4;
    pushLog(state, 'A steps back to break range without sliding through B.');
    return true;
  }
  if (action === 'jab' || action === 'cross') {
    const move = action === 'jab' ? 'left_jab' : 'right_cross';
    a.pose = move;
    a.currentMove = { id: move, ttl: 0.3, limb: action === 'jab' ? 'leftArm' : 'rightArm', kind: 'punch' };
    b.pose = 'hit_react';
    b.hp = clamp(b.hp - (action === 'jab' ? 2.5 : 4.5), 0, 100);
    b.x += action === 'jab' ? 8 : 14;
    state.effects.push({ type: 'impact_flash', x: b.x, y: b.y, ttl: 0.08, kind: 'body' });
    pushLog(state, `A tests a clean ${action === 'jab' ? 'jab' : 'cross'} and B gives ground.`);
    return true;
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
  keepFacing(a, b);
  maintainLabSpacing(state, a, b, scaledDt);
  for (const f of state.fighters) {
    f.currentMove &&= tickMove(f.currentMove, scaledDt);
    f.collisionT = Math.max(0, (f.collisionT || 0) - scaledDt);
    f.dizzyT = Math.max(0, (f.dizzyT || 0) - scaledDt);
    f.anim += scaledDt * 8;
    f.intent = 'cqc_lab';
    f.hidden = false;
    f.crouch = false;
    f.prone = false;
    f.shadowHidden = false;
    f.stamina = clamp(f.stamina + scaledDt * 7, 0, 100);
    f.block = clamp(f.block + scaledDt * 8, 0, 100);
    f.dodge = clamp(f.dodge + scaledDt * 8, 0, 100);
  }
  if (state.lab.actionT > 0.55 && !a.currentMove && !b.currentMove) {
    if (!['guard', 'reset'].includes(state.lab.action)) {
      a.pose = 'idle_guard';
      b.pose = 'idle_guard';
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
    currentMove: null, downT: 0, collisionT: 0, dizzyT: 0, stepPhase: 0, stepLock: 0
  };
}

function resetLabSpacing(state) {
  const [a, b] = state.fighters;
  a.x = LAB_CENTER.x - LAB_SPACE;
  a.y = LAB_CENTER.y;
  b.x = LAB_CENTER.x + LAB_SPACE;
  b.y = LAB_CENTER.y;
  a.hp = b.hp = 100;
  a.stamina = b.stamina = 100;
  a.block = b.block = 100;
  a.dodge = b.dodge = 100;
  a.pose = b.pose = 'idle_guard';
  a.currentMove = b.currentMove = null;
  keepFacing(a, b);
}

function maintainLabSpacing(state, a, b, dt) {
  const d = Math.max(0.001, dist(a, b));
  const target = LAB_SPACE * 2;
  const min = 72;
  const max = 148;
  if (d < min) {
    const push = (min - d) * 0.5;
    const nx = (a.x - b.x) / d;
    const ny = (a.y - b.y) / d;
    a.x += nx * push;
    a.y += ny * push;
    b.x -= nx * push;
    b.y -= ny * push;
    a.collisionT = b.collisionT = 0.15;
  } else if (d > max) {
    const pull = Math.min(24 * dt, (d - target) * 0.18);
    const nx = (b.x - a.x) / d;
    const ny = (b.y - a.y) / d;
    a.x += nx * pull;
    a.y += ny * pull;
    b.x -= nx * pull;
    b.y -= ny * pull;
  }
  a.x = clampArena(a, 16).x;
  a.y = clampArena(a, 16).y;
  b.x = clampArena(b, 16).x;
  b.y = clampArena(b, 16).y;
}

function keepFacing(a, b) {
  a.facing = Math.atan2(b.y - a.y, b.x - a.x);
  b.facing = Math.atan2(a.y - b.y, a.x - b.x);
}

function tickMove(move, dt) {
  move.ttl -= dt;
  return move.ttl > 0 ? move : null;
}

function pushLog(state, text) {
  state.log.unshift(`${state.clock.toFixed(1)}s ${text}`);
  state.log = state.log.slice(0, 10);
}
