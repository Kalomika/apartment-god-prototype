import { COACH_DROPS, LIMBS } from './config.js';
import { ARCHETYPES } from './archetypes.js';
import { createArena } from './arena.js';
import { vitalityStageFor } from './vitality.js';

export function createBattle(aId = 'marine', bId = 'ninja', options = {}) {
  const arena = createArena();
  const state = {
    arena,
    selectedFighters: { A: aId, B: bId },
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
    projectiles: [], effects: [], pickups: [], log: ['Top Shot test board loaded. Press Begin Batch to parachute fighters into the arena.']
  };
  if (options.autoStart) beginBattle(state, aId, bId);
  return state;
}

export function beginBattle(state, aId = state.selectedFighters?.A || 'marine', bId = state.selectedFighters?.B || 'ninja') {
  const arena = createArena();
  state.arena = arena;
  state.selectedFighters = { A: aId, B: bId };
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
  state.fighters = [
    makeFighter('A', ARCHETYPES[aId], arena.spawnA, 0),
    makeFighter('B', ARCHETYPES[bId], arena.spawnB, 1)
  ];
  state.log = ['Begin batch. Fighters are parachuting into the four block test arena.'];
  return state;
}

function freshDropsLeft() {
  return Object.fromEntries(Object.entries(COACH_DROPS).map(([id, drop]) => [id, drop.charges]));
}

function makeFighter(team, archetype, spawn, index = 0) {
  const dropDuration = 1.15 + index * 0.22;
  return {
    id: `${team}-${archetype.id}`, team, archetypeId: archetype.id, name: `${team}: ${archetype.name}`,
    color: archetype.color, accent: archetype.accent, weapon: archetype.weapon, melee: archetype.melee, special: archetype.special,
    x: spawn.x, y: spawn.dropY ?? -140, vx: 0, vy: 0, facing: spawn.facing, target: null, intent: 'deploy', pose: 'parachute', anim: 0,
    spawn: { x: spawn.x, y: spawn.y, facing: spawn.facing },
    deploy: { t: 0, duration: dropDuration, fromY: spawn.dropY ?? -140, toY: spawn.y },
    deploying: true,
    hp: 100, vitalityCap: 100, painStage: 'green', stamina: 100, fight: 100, dodge: 100, block: 100, morale: 75, heat: 0, noise: 0,
    prestige: archetype.stats.prestige, ruthless: archetype.stats.ruthlessness, defeated: false, finishT: 0,
    prone: false, crouch: false, hidden: false, extracting: false, extracted: false, incapacitated: false,
    comboT: 0, actionT: 0, cooldown: 0, rangedCd: 0, meleeCd: 0, specialCd: 0, bandageCd: 0, getupT: 0, commandCd: 0, holdT: 0,
    stats: { ...archetype.stats }, resources: { ...archetype.resources }, injuries: {}, permanent: {},
    limbs: Object.fromEntries(LIMBS.map(id => [id, { guard: 100, injury: 0, active: false, t: 0 }])),
    memory: { lastSeen: null, lastHitBy: null, fear: 0, mercyRoll: 0.15 + (100 - archetype.stats.aggression) / 300, command: null },
    currentMove: null, downT: 0
  };
}

export function opponentOf(state, fighter) { return state.fighters.find(f => f.team !== fighter.team); }
export function stageFor(fighter) { return vitalityStageFor(fighter); }
export function addLog(state, text) { state.log.unshift(`${state.clock.toFixed(1)}s ${text}`); state.log = state.log.slice(0, 10); }
