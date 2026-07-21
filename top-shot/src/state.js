import { COACH_DROPS, LIMBS } from './config.js';
import { ARCHETYPES } from './archetypes.js';
import { createArena } from './arena.js';
import { createStealthState, freshAwareness } from './stealth.js';
import { vitalityStageFor } from './vitality.js';
import { finiteOr } from './utils.js';

const DEFAULT_A = 'suit_operative';
const DEFAULT_B = 'survival_commando';

export function createBattle(aId = DEFAULT_A, bId = DEFAULT_B, options = {}) {
  const safeA = safeArchetypeId(aId, DEFAULT_A);
  const safeB = safeArchetypeId(bId, DEFAULT_B);
  const arena = createArena();
  const state = {
    arena,
    selectedFighters: { A: safeA, B: safeB },
    paused: false,
    clock: 0,
    matchState: 'ready',
    selectedDrop: null,
    selectedCommand: null,
    commanderEthos: 'ai',
    trust: 64,
    commandHistory: [],
    dropsLeft: freshDropsLeft(),
    fighters: [],
    projectiles: [], effects: [], pickups: [], debris: [], stealth: createStealthState(), log: ['Top Shot desert industrial site loaded. Press Begin Sortie to deploy fighters.']
  };
  if (options.autoStart) beginBattle(state, safeA, safeB);
  return state;
}

export function beginBattle(state, aId = state.selectedFighters?.A || DEFAULT_A, bId = state.selectedFighters?.B || DEFAULT_B) {
  const safeA = safeArchetypeId(aId, DEFAULT_A);
  const safeB = safeArchetypeId(bId, DEFAULT_B);
  const arena = createArena();
  state.arena = arena;
  state.selectedFighters = { A: safeA, B: safeB };
  state.paused = false;
  state.clock = 0;
  state.matchState = 'deploying';
  state.result = '';
  state.selectedDrop = null;
  state.selectedCommand = null;
  state.commandHistory = [];
  state.trust = 64;
  state.dropsLeft = freshDropsLeft();
  state.projectiles = [];
  state.effects = [];
  state.pickups = [];
  state.debris = [];
  state.stealth = createStealthState();
  state.fighters = [
    makeFighter('A', ARCHETYPES[safeA], arena.spawnA, 0),
    makeFighter('B', ARCHETYPES[safeB], arena.spawnB, 1)
  ];
  state.log = ['Begin sortie. Fighters are parachuting into the desert industrial site one after another.'];
  return state;
}

function safeArchetypeId(id, fallback) { return ARCHETYPES[id] ? id : fallback; }

function freshDropsLeft() {
  return Object.fromEntries(Object.entries(COACH_DROPS).map(([id, drop]) => [id, drop.charges]));
}

function makeFighter(team, archetype, spawn, index = 0) {
  const safeArchetype = archetype || ARCHETYPES[team === 'A' ? DEFAULT_A : DEFAULT_B];
  const dropDuration = 1.55 + index * 0.2;
  const dropDelay = index * 0.48;
  return {
    id: `${team}-${safeArchetype.id}`, team, archetypeId: safeArchetype.id, name: `${team}: ${safeArchetype.name}`,
    color: safeArchetype.color, accent: safeArchetype.accent, weapon: safeArchetype.weapon, melee: safeArchetype.melee, special: safeArchetype.special,
    x: spawn.dropX ?? spawn.x, y: spawn.dropY ?? -140, vx: 0, vy: 0, facing: spawn.facing, target: null, intent: 'deploy', pose: 'parachute', anim: 0,
    spawn: { x: spawn.x, y: spawn.y, facing: spawn.facing },
    deploy: { t: 0, delay: dropDelay, duration: dropDuration, fromX: spawn.dropX ?? spawn.x, fromY: spawn.dropY ?? -140, toX: spawn.x, toY: spawn.y, altitude: 12 + index * 1.8 },
    deployAltitude: 12 + index * 1.8,
    deploying: true,
    hp: 100, vitalityCap: 100, painStage: 'green', stamina: 100, fight: 100, dodge: 100, block: 100, morale: 75, heat: 0, noise: 0,
    elevation: 0, onObject: null, climbT: 0, jumpT: 0,
    prestige: safeArchetype.stats.prestige, ruthless: safeArchetype.stats.ruthlessness, defeated: false, finishT: 0,
    prone: false, crouch: false, hidden: false, extracting: false, extracted: false, incapacitated: false,
    comboT: 0, actionT: 0, cooldown: 0, rangedCd: 0, meleeCd: 0, specialCd: 0, bandageCd: 0, getupT: 0, commandCd: 0, holdT: 0,
    stats: { ...safeArchetype.stats }, resources: { ...safeArchetype.resources }, injuries: {}, permanent: {},
    limbs: Object.fromEntries(LIMBS.map(id => [id, { guard: 100, injury: 0, active: false, t: 0 }])),
    awareness: freshAwareness(),
    memory: { lastSeen: null, lastHitBy: null, fear: 0, mercyRoll: 0.15 + (100 - safeArchetype.stats.aggression) / 300, command: null },
    currentMove: null, downT: 0, collisionT: 0, dizzyT: 0, stepPhase: 0, stepLock: 0
  };
}

export function opponentOf(state, fighter) { return state.fighters.find(f => f.team !== fighter.team && !f.extracted) || state.fighters.find(f => f.team !== fighter.team); }
export function stageFor(fighter) { return vitalityStageFor(fighter); }
export function addLog(state, text) { const clock = finiteOr(state.clock, 0).toFixed(1); state.log.unshift(`${clock}s ${text}`); state.log = state.log.slice(0, 10); }
