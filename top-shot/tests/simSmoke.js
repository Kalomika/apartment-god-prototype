import { beginBattle, createBattle } from '../src/state.js';
import { updateBattle, placeCoachDrop } from '../src/systems.js';

const matchups = [
  ['suit_operative', 'survival_commando'],
  ['shadow_ninja', 'field_agent'],
  ['marine', 'ninja'],
  ['ninja', 'archer'],
  ['archer', 'martial_artist'],
  ['martial_artist', 'marine']
];

verifyInvalidArchetypeFallback();
verifyDiveWithoutVelocityRegression();

for (const [a, b] of matchups) {
  const state = createBattle(a, b);
  if (state.fighters.length !== 0) throw new Error(`Expected empty board before Begin Sortie in ${a} vs ${b}`);
  if (state.matchState !== 'ready') throw new Error(`Expected ready state before Begin Sortie in ${a} vs ${b}`);
  beginBattle(state, a, b);
  if (state.fighters.length !== 2) throw new Error(`Expected two fighters after Begin Sortie in ${a} vs ${b}`);
  assertStateIntegrity(state, `${a} vs ${b} initial deployment`);

  let deploySteps = 0;
  while (deploySteps < 180 && state.matchState === 'deploying') {
    updateBattle(state, 1 / 60);
    assertStateIntegrity(state, `${a} vs ${b} deployment tick ${deploySteps}`);
    deploySteps++;
  }
  if (state.matchState !== 'running') throw new Error(`Expected running match after deployment in ${a} vs ${b}`);
  placeCoachDrop(state, 'med', 180, 360);
  placeCoachDrop(state, 'ammo', 240, 300);

  let steps = 0;
  while (steps < 3600 && state.matchState === 'running') {
    updateBattle(state, 1 / 60);
    assertStateIntegrity(state, `${a} vs ${b} running tick ${steps}`);
    steps++;
  }
  if (!state.log.length) throw new Error(`Missing log in ${a} vs ${b}`);
  console.log(`${a} vs ${b}: ${state.matchState} after ${steps} ticks, ${state.log[0]}`);
}
console.log('Top Shot smoke simulation passed');

function verifyInvalidArchetypeFallback() {
  const state = createBattle('missing_a', 'missing_b', { autoStart: true });
  if (state.selectedFighters.A !== 'suit_operative' || state.selectedFighters.B !== 'survival_commando') throw new Error('Invalid archetype IDs did not fall back safely.');
  assertStateIntegrity(state, 'invalid archetype fallback');
}

function verifyDiveWithoutVelocityRegression() {
  const state = createBattle('suit_operative', 'survival_commando', { autoStart: true });
  state.matchState = 'running';
  const fighter = state.fighters[0];
  fighter.deploying = false;
  fighter.deploy = null;
  fighter.diveT = 0.3;
  delete fighter.diveVx;
  delete fighter.diveVy;
  updateBattle(state, 1 / 60);
  assertStateIntegrity(state, 'dive without velocity regression');
}

function assertStateIntegrity(state, context) {
  if (!Number.isFinite(state.clock)) throw new Error(`Invalid match clock during ${context}: ${state.clock}`);
  for (const fighter of state.fighters || []) {
    for (const key of ['x', 'y', 'facing', 'hp', 'stamina', 'fight', 'dodge', 'block', 'elevation', 'deployAltitude']) {
      if (!Number.isFinite(fighter[key])) throw new Error(`${fighter.name}.${key} invalid during ${context}: ${fighter[key]}`);
    }
    if (fighter.hp < 0 || fighter.hp > 100) throw new Error(`${fighter.name}.hp out of range during ${context}: ${fighter.hp}`);
  }
  for (const projectile of state.projectiles || []) {
    for (const key of ['x', 'y', 'ttl']) {
      if (!Number.isFinite(projectile[key])) throw new Error(`${projectile.type}.${key} invalid during ${context}: ${projectile[key]}`);
    }
    if ('vx' in projectile && !Number.isFinite(projectile.vx)) throw new Error(`${projectile.type}.vx invalid during ${context}: ${projectile.vx}`);
    if ('vy' in projectile && !Number.isFinite(projectile.vy)) throw new Error(`${projectile.type}.vy invalid during ${context}: ${projectile.vy}`);
  }
}
