import { COACH_DROPS, DAMAGE_STAGES, LIMBS } from './config.js';
import { ARCHETYPES } from './archetypes.js';
import { createArena } from './arena.js';

export function createBattle(aId = 'marine', bId = 'ninja') {
  const arena = createArena();
  return {
    arena,
    paused: false,
    clock: 0,
    matchState: 'running',
    selectedDrop: null,
    selectedCommand: null,
    trust: 64,
    commandHistory: [],
    dropsLeft: Object.fromEntries(Object.entries(COACH_DROPS).map(([id, drop]) => [id, drop.charges])),
    fighters: [makeFighter('A', ARCHETYPES[aId], arena.spawnA), makeFighter('B', ARCHETYPES[bId], arena.spawnB)],
    projectiles: [], effects: [], pickups: [], log: ['Top Shot v0.1 booted. AI fighters only. You coach, drop supplies, suggest tactics, or extract.']
  };
}

function makeFighter(team, archetype, spawn) {
  return {
    id: `${team}-${archetype.id}`, team, archetypeId: archetype.id, name: `${team}: ${archetype.name}`,
    color: archetype.color, accent: archetype.accent, weapon: archetype.weapon, melee: archetype.melee, special: archetype.special,
    x: spawn.x, y: spawn.y, vx: 0, vy: 0, facing: spawn.facing, target: null, intent: 'scan', pose: 'idle', anim: 0,
    hp: 100, stamina: 100, fight: 100, dodge: 100, block: 100, morale: 75, heat: 0, noise: 0,
    prone: false, crouch: false, hidden: false, extracting: false, extracted: false, incapacitated: false,
    comboT: 0, actionT: 0, cooldown: 0, rangedCd: 0, meleeCd: 0, specialCd: 0, bandageCd: 0, getupT: 0, commandCd: 0,
    stats: { ...archetype.stats }, resources: { ...archetype.resources }, injuries: {}, permanent: {},
    limbs: Object.fromEntries(LIMBS.map(id => [id, { guard: 100, injury: 0, active: false, t: 0 }])),
    memory: { lastSeen: null, lastHitBy: null, fear: 0, mercyRoll: 0.15 + (100 - archetype.stats.aggression) / 300, command: null },
    currentMove: null, downT: 0
  };
}

export function opponentOf(state, fighter) { return state.fighters.find(f => f.team !== fighter.team); }
export function stageFor(fighter) { return DAMAGE_STAGES.find(stage => fighter.hp >= stage.min) || DAMAGE_STAGES[DAMAGE_STAGES.length - 1]; }
export function addLog(state, text) { state.log.unshift(`${state.clock.toFixed(1)}s ${text}`); state.log = state.log.slice(0, 10); }
