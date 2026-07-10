import { blocked } from '../src/arena.js';
import { createCqcLabState, triggerCqcAction, updateCqcLab } from '../src/cqcLab.js';

const state = createCqcLabState('suit_operative', 'survival_commando');
const [a, b] = state.fighters;

assertOpen(state, 'initial spawn');

for (const action of ['jab', 'cross', 'body_shot', 'kick', 'sweep', 'mount', 'ground_punch', 'escape_mount', 'reset']) {
  const ok = triggerCqcAction(state, action);
  if (!ok) throw new Error(`CQC action failed: ${action}`);
  for (let i = 0; i < 20; i++) {
    updateCqcLab(state, 1 / 60);
    assertOpen(state, `${action} frame ${i}`);
  }
}

triggerCqcAction(state, 'auto');
for (let i = 0; i < 360; i++) {
  updateCqcLab(state, 1 / 60);
  assertOpen(state, `auto frame ${i}`);
}

if (!state.lab.auto) throw new Error('Auto CQC did not stay enabled.');
if (!state.log.length) throw new Error('CQC log did not record exchanges.');
if (Number.isNaN(a.x) || Number.isNaN(a.y) || Number.isNaN(b.x) || Number.isNaN(b.y)) throw new Error('CQC fighter position became invalid.');
if (!Array.isArray(a.hitboxes) || !a.hitboxes.find(hitbox => hitbox.id === 'collision_core')) throw new Error('CQC hitboxes were not generated.');

console.log(`CQC smoke passed with ${state.log.length} log entries. Latest: ${state.log[0]}`);

function assertOpen(state, context) {
  for (const fighter of state.fighters) {
    if (blocked(state.arena, fighter, 30)) throw new Error(`${fighter.name} entered blocked prop space during ${context} at ${Math.round(fighter.x)},${Math.round(fighter.y)}.`);
  }
}
