import { beginBattle, createBattle } from '../src/state.js';
import { updateBattle, placeCoachDrop } from '../src/systems.js';

const matchups = [
  ['suit_operative', 'survival_commando'],
  ['marine', 'ninja'],
  ['ninja', 'archer'],
  ['archer', 'martial_artist'],
  ['martial_artist', 'marine']
];

for (const [a, b] of matchups) {
  const state = createBattle(a, b);
  if (state.fighters.length !== 0) throw new Error(`Expected empty board before Begin Batch in ${a} vs ${b}`);
  if (state.matchState !== 'ready') throw new Error(`Expected ready state before Begin Batch in ${a} vs ${b}`);
  beginBattle(state, a, b);
  if (state.fighters.length !== 2) throw new Error(`Expected two fighters after Begin Batch in ${a} vs ${b}`);
  let deploySteps = 0;
  while (deploySteps < 180 && state.matchState === 'deploying') {
    updateBattle(state, 1 / 60);
    deploySteps++;
  }
  if (state.matchState !== 'running') throw new Error(`Expected running match after deployment in ${a} vs ${b}`);
  placeCoachDrop(state, 'med', 180, 360);
  placeCoachDrop(state, 'ammo', 240, 300);
  let steps = 0;
  while (steps < 3600 && state.matchState === 'running') {
    updateBattle(state, 1 / 60);
    steps++;
  }
  const invalid = state.fighters.some(f => Number.isNaN(f.x) || Number.isNaN(f.y) || Number.isNaN(f.hp));
  if (invalid) throw new Error(`Invalid fighter state in ${a} vs ${b}`);
  if (!state.log.length) throw new Error(`Missing log in ${a} vs ${b}`);
  console.log(`${a} vs ${b}: ${state.matchState} after ${steps} ticks, ${state.log[0]}`);
}
console.log('Top Shot smoke simulation passed');
