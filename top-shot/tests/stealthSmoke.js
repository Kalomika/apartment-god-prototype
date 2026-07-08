import { createBattle, beginBattle } from '../src/state.js';
import { updateStealthSystem, stealthSearchPlan, visualDetectionScore, soundDetectionScore } from '../src/stealth.js';

const state = createBattle('suit_operative', 'survival_commando');
beginBattle(state, 'suit_operative', 'survival_commando');
state.matchState = 'running';
for (const f of state.fighters) {
  f.deploying = false;
  f.deploy = null;
  f.deployAltitude = 0;
}

const [a, b] = state.fighters;
a.x = 480;
a.y = 360;
a.facing = 0;
a.crouch = true;
a.shadowHidden = true;
a.noise = 8;
b.x = 700;
b.y = 360;
b.facing = Math.PI;
b.noise = 12;

updateStealthSystem(state, 1 / 60);
if (!state.stealth || state.stealth.phase !== 'infiltration') throw new Error('Expected stealth system to initialize in infiltration.');

const quietVisual = visualDetectionScore(state.arena, b, a);
if (quietVisual >= 80) throw new Error(`Shadow crouch detection too strong: ${quietVisual}`);

a.noise = 92;
for (let i = 0; i < 90; i++) updateStealthSystem(state, 1 / 60);
if (!b.awareness || b.awareness.suspicion <= 0) throw new Error('Noise did not build suspicion.');
if (soundDetectionScore(b, a, state.stealth.ambientNoise) <= 0) throw new Error('Sound score did not register loud movement.');

a.shadowHidden = false;
a.crouch = false;
a.noise = 32;
b.facing = Math.atan2(a.y - b.y, a.x - b.x);
for (let i = 0; i < 120; i++) updateStealthSystem(state, 1 / 60);
if (!b.awareness.lastKnownPosition) throw new Error('Clear sight did not store last known position.');
if (!['suspicious', 'alert', 'evasion'].includes(state.stealth.phase)) throw new Error(`Expected suspicious or alert phase, got ${state.stealth.phase}`);

const plan = stealthSearchPlan(state, b, a, false, true);
if (!plan?.dest) throw new Error('Stealth search plan did not generate a destination.');

console.log(`Stealth smoke passed. Phase ${state.stealth.phase}, suspicion ${Math.round(b.awareness.suspicion)}, plan ${plan.intent}.`);
