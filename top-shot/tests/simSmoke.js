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

function assertFinitePoint(point, label) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new Error(`Invalid point for ${label}`);
}

function assertStateIntegrity(state, label) {
  if (!Number.isFinite(state.clock)) throw new Error(`Invalid clock in ${label}`);
  for (const fighter of state.fighters) {
    assertFinitePoint(fighter, `${label} ${fighter.name}`);
    if (!Number.isFinite(fighter.elevation)) throw new Error(`Invalid elevation for ${fighter.name} in ${label}`);
    if (!Number.isFinite(fighter.hp) || fighter.hp < 0 || fighter.hp > 100) throw new Error(`Invalid health percent for ${fighter.name} in ${label}`);
    if (fighter.memory?.command) assertFinitePoint(fighter.memory.command, `${label} ${fighter.name} command`);
    if (fighter.memory?.navTarget) assertFinitePoint(fighter.memory.navTarget, `${label} ${fighter.name} navTarget`);
    if (fighter.memory?.route?.dest) assertFinitePoint(fighter.memory.route.dest, `${label} ${fighter.name} route dest`);
    if (fighter.memory?.route?.route) assertFinitePoint(fighter.memory.route.route, `${label} ${fighter.name} route point`);
    if (fighter.grapple?.active) {
      for (const key of ['fromX', 'fromY', 'toX', 'toY']) if (!Number.isFinite(fighter.grapple[key])) throw new Error(`Invalid grapple ${key} for ${fighter.name} in ${label}`);
    }
  }
  for (const projectile of state.projectiles || []) {
    assertFinitePoint(projectile, `${label} projectile ${projectile.type}`);
    if (!Number.isFinite(projectile.ttl)) throw new Error(`Invalid projectile ttl in ${label}`);
    if (!projectile.stuck && projectile.type !== 'grenade' && (!Number.isFinite(projectile.vx) || !Number.isFinite(projectile.vy))) throw new Error(`Invalid projectile velocity in ${label}`);
  }
}

for (const [a, b] of matchups) {
  const state = createBattle(a, b);
  if (state.fighters.length !== 0) throw new Error(`Expected empty board before Begin Batch in ${a} vs ${b}`);
  if (state.matchState !== 'ready') throw new Error(`Expected ready state before Begin Batch in ${a} vs ${b}`);
  beginBattle(state, a, b);
  if (state.cinematic?.phase !== 'intro') throw new Error(`Expected intro cinematic on deploy in ${a} vs ${b}`);
  if (state.fighters.length !== 2) throw new Error(`Expected two fighters after Begin Batch in ${a} vs ${b}`);
  let deploySteps = 0;
  while (deploySteps < 180 && state.matchState === 'deploying') {
    updateBattle(state, 1 / 60);
    assertStateIntegrity(state, `${a} vs ${b} deploy tick ${deploySteps}`);
    deploySteps++;
  }
  if (state.matchState !== 'running') throw new Error(`Expected running match after deployment in ${a} vs ${b}`);
  if (state.cinematic?.phase !== 'running') throw new Error(`Expected running cinematic after deployment in ${a} vs ${b}`);
  assertStateIntegrity(state, `${a} vs ${b} after deployment`);
  const first = state.fighters[0];
  first.suppressedUntil = state.clock + 2;
  updateBattle(state, 1 / 60);
  assertStateIntegrity(state, `${a} vs ${b} suppression response`);
  const evasionIntent = ['break_contact_cover', 'preserve_life', 'take_cover_before_fire', 'recover_cover', 'emergency_cover', 'wounded_cover', 'vertical_reposition', 'bound_to_cover'].some(intent => String(first.intent || '').includes(intent));
  if (!evasionIntent && !first.coverPinned && !['combat_dive', 'combat_roll', 'grapple_launch'].includes(first.pose)) throw new Error(`${first.name} did not prioritize cover, evasion, or vertical escape under fire.`);
  placeCoachDrop(state, 'med', 180, 360);
  placeCoachDrop(state, 'ammo', 240, 300);
  let steps = 0;
  while (steps < 720 && state.matchState === 'running') {
    updateBattle(state, 1 / 60);
    assertStateIntegrity(state, `${a} vs ${b} live tick ${steps}`);
    steps++;
  }
  assertStateIntegrity(state, `${a} vs ${b} final`);
  const directors = state.fighters.filter(f => f.director);
  if (directors.length < 2) throw new Error(`Engagement director did not initialize both fighters in ${a} vs ${b}`);
  if (!directors.some(f => ['cover_peek_pressure', 'finish_peek', 'force_pressure', 'close_for_exchange', 'ambush_cqc', 'stealth_flank', 'vertical_reposition', 'bound_to_cover'].includes(f.director.state))) throw new Error(`No fighter escalated out of passive movement in ${a} vs ${b}`);
  if (!state.log.length) throw new Error(`Missing log in ${a} vs ${b}`);
  console.log(`${a} vs ${b}: ${state.matchState} after ${steps} ticks, ${state.log[0]}`);
}

const ninjaState = createBattle('shadow_ninja', 'field_agent');
beginBattle(ninjaState, 'shadow_ninja', 'field_agent');
for (let i = 0; i < 180 && ninjaState.matchState === 'deploying'; i++) {
  updateBattle(ninjaState, 1 / 60);
  assertStateIntegrity(ninjaState, `ninja deploy tick ${i}`);
}
const ninja = ninjaState.fighters.find(f => f.archetypeId === 'shadow_ninja');
const agent = ninjaState.fighters.find(f => f.team !== ninja.team);
ninja.x = 490; ninja.y = 350; agent.x = 720; agent.y = 340; ninja.suppressedUntil = ninjaState.clock + 2;
updateBattle(ninjaState, 1 / 60);
assertStateIntegrity(ninjaState, 'ninja grapple pressure');
if (!ninja.grapple?.active && ninja.grappleCd <= ninjaState.clock) throw new Error('Shadow ninja did not fire grappling hook under pressure.');
if (!ninjaState.effects.find(effect => effect.type === 'grapple_line')) throw new Error('Grappling hook line effect was not spawned.');

console.log('Top Shot smoke simulation passed');
