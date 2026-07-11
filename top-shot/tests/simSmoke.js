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

function smokeError(message, context = {}) {
  const error = new Error(`${message}\n${describeContext(context)}`);
  error.context = context;
  return error;
}

function describeContext({ state, label = 'unknown', matchup = 'unknown', tick = null, phase = null } = {}) {
  const header = [
    `Smoke context: ${label}`,
    `matchup=${matchup}`,
    `phase=${phase || state?.matchState || 'unknown'}`,
    tick === null ? null : `tick=${tick}`,
    `clock=${num(state?.clock)}`,
    `matchState=${state?.matchState || 'unknown'}`,
    `cinematic=${state?.cinematic?.phase || 'none'}`
  ].filter(Boolean).join(' | ');

  const fighters = (state?.fighters || []).map(f => ({
    id: f.id,
    name: f.name,
    team: f.team,
    archetypeId: f.archetypeId,
    x: num(f.x),
    y: num(f.y),
    hp: num(f.hp),
    stamina: num(f.stamina),
    elevation: num(f.elevation),
    deployAltitude: num(f.deployAltitude),
    pose: f.pose,
    intent: f.intent,
    lastMove: num(f.lastMove),
    diveT: num(f.diveT),
    diveVx: num(f.diveVx),
    diveVy: num(f.diveVy),
    currentMove: f.currentMove ? { id: f.currentMove.id, kind: f.currentMove.kind, ttl: num(f.currentMove.ttl), target: f.currentMove.target, zone: f.currentMove.zone } : null,
    command: pointBrief(f.memory?.command),
    navTarget: pointBrief(f.memory?.navTarget),
    brainDest: pointBrief(f.brain?.dest),
    grapple: f.grapple ? { active: f.grapple.active, fromX: num(f.grapple.fromX), fromY: num(f.grapple.fromY), toX: num(f.grapple.toX), toY: num(f.grapple.toY), t: num(f.grapple.t) } : null
  }));

  const projectiles = (state?.projectiles || []).map(p => ({
    type: p.type,
    team: p.team,
    x: num(p.x),
    y: num(p.y),
    vx: num(p.vx),
    vy: num(p.vy),
    ttl: num(p.ttl),
    fuse: num(p.fuse),
    stuck: Boolean(p.stuck)
  }));

  return [
    header,
    `fighters=${JSON.stringify(fighters)}`,
    `projectiles=${JSON.stringify(projectiles)}`,
    `log=${JSON.stringify((state?.log || []).slice(0, 5))}`
  ].join('\n');
}

function num(value) {
  return Number.isFinite(value) ? Math.round(value * 1000) / 1000 : value;
}

function pointBrief(point) {
  if (!point) return null;
  return { type: point.type || null, x: num(point.x), y: num(point.y), until: num(point.until) };
}

function assertFiniteNumber(value, label, context) {
  if (!Number.isFinite(value)) throw smokeError(`Invalid finite number for ${label}: ${String(value)}`, context);
}

function assertPercent(value, label, context) {
  assertFiniteNumber(value, label, context);
  if (value < 0 || value > 100) throw smokeError(`Invalid percent for ${label}: ${value}`, context);
}

function assertFinitePoint(point, label, context) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) throw smokeError(`Invalid point for ${label}`, context);
}

function assertOptionalPoint(point, label, context) {
  if (!point) return;
  assertFinitePoint(point, label, context);
}

function assertRoute(route, label, context) {
  if (!route) return;
  if (route.dest) assertFinitePoint(route.dest, `${label} route dest`, context);
  if (Array.isArray(route.route)) {
    route.route.forEach((point, index) => assertFinitePoint(point, `${label} route[${index}]`, context));
  } else if (route.route) {
    assertFinitePoint(route.route, `${label} route point`, context);
  }
}

function assertStateIntegrity(state, context) {
  assertFiniteNumber(state.clock, `${context.label} clock`, context);
  if (!Array.isArray(state.fighters)) throw smokeError(`Invalid fighters array in ${context.label}`, context);
  if (!Array.isArray(state.projectiles)) throw smokeError(`Invalid projectiles array in ${context.label}`, context);
  for (const fighter of state.fighters) assertFighterIntegrity(fighter, context);
  for (const projectile of state.projectiles || []) assertProjectileIntegrity(projectile, context);
  for (const pickup of state.pickups || []) assertFinitePoint(pickup, `${context.label} pickup ${pickup.type || 'unknown'}`, context);
}

function assertFighterIntegrity(fighter, context) {
  const label = `${context.label} ${fighter.name || fighter.id || 'fighter'}`;
  assertFinitePoint(fighter, label, context);
  for (const key of ['elevation', 'deployAltitude', 'facing', 'stamina', 'fight', 'dodge', 'block', 'heat', 'noise']) {
    if (key in fighter) assertFiniteNumber(fighter[key], `${label}.${key}`, context);
  }
  assertPercent(fighter.hp, `${label}.hp`, context);
  if ('vitalityCap' in fighter) assertPercent(fighter.vitalityCap, `${label}.vitalityCap`, context);
  if ('lastMove' in fighter) assertFiniteNumber(fighter.lastMove, `${label}.lastMove`, context);
  if ('anim' in fighter) assertFiniteNumber(fighter.anim, `${label}.anim`, context);
  if ('diveT' in fighter) assertFiniteNumber(fighter.diveT, `${label}.diveT`, context);
  if ((fighter.diveT || 0) > 0 || 'diveVx' in fighter || 'diveVy' in fighter) {
    assertFiniteNumber(fighter.diveVx ?? 0, `${label}.diveVx`, context);
    assertFiniteNumber(fighter.diveVy ?? 0, `${label}.diveVy`, context);
  }
  assertOptionalPoint(fighter.memory?.command, `${label} command`, context);
  assertOptionalPoint(fighter.memory?.navTarget, `${label} navTarget`, context);
  assertRoute(fighter.memory?.route, label, context);
  assertOptionalPoint(fighter.brain?.dest, `${label} brain dest`, context);
  if (fighter.grapple?.active) {
    for (const key of ['fromX', 'fromY', 'toX', 'toY', 't', 'duration']) assertFiniteNumber(fighter.grapple[key], `${label}.grapple.${key}`, context);
  }
  if (fighter.currentMove) {
    if ('ttl' in fighter.currentMove) assertFiniteNumber(fighter.currentMove.ttl, `${label}.currentMove.ttl`, context);
    if ('damage' in fighter.currentMove) assertFiniteNumber(fighter.currentMove.damage, `${label}.currentMove.damage`, context);
  }
  if (fighter.bleed) {
    for (const key of ['rate', 'pool', 'progress']) if (key in fighter.bleed) assertFiniteNumber(fighter.bleed[key], `${label}.bleed.${key}`, context);
  }
}

function assertProjectileIntegrity(projectile, context) {
  const label = `${context.label} projectile ${projectile.type || 'unknown'}`;
  assertFinitePoint(projectile, label, context);
  if ('ttl' in projectile) assertFiniteNumber(projectile.ttl, `${label}.ttl`, context);
  if ('fuse' in projectile) assertFiniteNumber(projectile.fuse, `${label}.fuse`, context);
  if ('blast' in projectile) assertFiniteNumber(projectile.blast, `${label}.blast`, context);
  if ('damage' in projectile) assertFiniteNumber(projectile.damage, `${label}.damage`, context);
  if (!projectile.stuck && projectile.type !== 'grenade') {
    assertFiniteNumber(projectile.vx, `${label}.vx`, context);
    assertFiniteNumber(projectile.vy, `${label}.vy`, context);
  }
  if (projectile.type === 'grenade') {
    assertFiniteNumber(projectile.vx ?? 0, `${label}.vx`, context);
    assertFiniteNumber(projectile.vy ?? 0, `${label}.vy`, context);
  }
}

function smokeContext(state, matchup, phase, tick = null, label = `${matchup} ${phase}`) {
  return { state, matchup, phase, tick, label };
}

function runMatchupSmoke(a, b) {
  const matchup = `${a} vs ${b}`;
  const state = createBattle(a, b);
  if (state.fighters.length !== 0) throw smokeError(`Expected empty board before Begin Batch in ${matchup}`, smokeContext(state, matchup, 'ready'));
  if (state.matchState !== 'ready') throw smokeError(`Expected ready state before Begin Batch in ${matchup}`, smokeContext(state, matchup, 'ready'));
  beginBattle(state, a, b);
  if (state.cinematic?.phase !== 'intro') throw smokeError(`Expected intro cinematic on deploy in ${matchup}`, smokeContext(state, matchup, 'deploying'));
  if (state.fighters.length !== 2) throw smokeError(`Expected two fighters after Begin Batch in ${matchup}`, smokeContext(state, matchup, 'deploying'));
  let deploySteps = 0;
  while (deploySteps < 180 && state.matchState === 'deploying') {
    updateBattle(state, 1 / 60);
    assertStateIntegrity(state, smokeContext(state, matchup, 'deploying', deploySteps, `${matchup} deploy tick ${deploySteps}`));
    deploySteps++;
  }
  if (state.matchState !== 'running') throw smokeError(`Expected running match after deployment in ${matchup}`, smokeContext(state, matchup, 'after deployment'));
  if (state.cinematic?.phase !== 'running') throw smokeError(`Expected running cinematic after deployment in ${matchup}`, smokeContext(state, matchup, 'after deployment'));
  assertStateIntegrity(state, smokeContext(state, matchup, 'after deployment'));
  const first = state.fighters[0];
  first.suppressedUntil = state.clock + 2;
  updateBattle(state, 1 / 60);
  assertStateIntegrity(state, smokeContext(state, matchup, 'suppression response'));
  const evasionIntent = ['break_contact_cover', 'preserve_life', 'take_cover_before_fire', 'recover_cover', 'emergency_cover', 'wounded_cover', 'vertical_reposition', 'bound_to_cover'].some(intent => String(first.intent || '').includes(intent));
  if (!evasionIntent && !first.coverPinned && !['combat_dive', 'combat_roll', 'grapple_launch'].includes(first.pose)) throw smokeError(`${first.name} did not prioritize cover, evasion, or vertical escape under fire.`, smokeContext(state, matchup, 'suppression response'));
  placeCoachDrop(state, 'med', 180, 360);
  placeCoachDrop(state, 'ammo', 240, 300);
  let steps = 0;
  while (steps < 720 && state.matchState === 'running') {
    updateBattle(state, 1 / 60);
    assertStateIntegrity(state, smokeContext(state, matchup, 'live', steps, `${matchup} live tick ${steps}`));
    steps++;
  }
  assertStateIntegrity(state, smokeContext(state, matchup, 'final'));
  const directors = state.fighters.filter(f => f.director);
  if (directors.length < 2) throw smokeError(`Engagement director did not initialize both fighters in ${matchup}`, smokeContext(state, matchup, 'final'));
  if (!directors.some(f => ['cover_peek_pressure', 'finish_peek', 'force_pressure', 'close_for_exchange', 'ambush_cqc', 'stealth_flank', 'vertical_reposition', 'bound_to_cover'].includes(f.director.state))) throw smokeError(`No fighter escalated out of passive movement in ${matchup}`, smokeContext(state, matchup, 'final'));
  if (!state.log.length) throw smokeError(`Missing log in ${matchup}`, smokeContext(state, matchup, 'final'));
  console.log(`${matchup}: ${state.matchState} after ${steps} ticks, ${state.log[0]}`);
}

function runDiveVelocityRegression() {
  const matchup = 'suit_operative vs survival_commando dive velocity regression';
  const state = createBattle('suit_operative', 'survival_commando');
  beginBattle(state, 'suit_operative', 'survival_commando');
  for (let i = 0; i < 180 && state.matchState === 'deploying'; i++) updateBattle(state, 1 / 60);
  const fighter = state.fighters[0];
  fighter.diveT = 0.25;
  delete fighter.diveVx;
  delete fighter.diveVy;
  updateBattle(state, 1 / 60);
  assertStateIntegrity(state, smokeContext(state, matchup, 'diveT without velocities'));
  if (!Number.isFinite(fighter.diveVx) || !Number.isFinite(fighter.diveVy)) throw smokeError('Dive velocity regression did not sanitize missing dive velocity.', smokeContext(state, matchup, 'diveT without velocities'));
}

for (const [a, b] of matchups) runMatchupSmoke(a, b);

runDiveVelocityRegression();

const ninjaState = createBattle('shadow_ninja', 'field_agent');
beginBattle(ninjaState, 'shadow_ninja', 'field_agent');
for (let i = 0; i < 180 && ninjaState.matchState === 'deploying'; i++) {
  updateBattle(ninjaState, 1 / 60);
  assertStateIntegrity(ninjaState, smokeContext(ninjaState, 'shadow_ninja vs field_agent', 'ninja deploy', i, `ninja deploy tick ${i}`));
}
const ninja = ninjaState.fighters.find(f => f.archetypeId === 'shadow_ninja');
const agent = ninjaState.fighters.find(f => f.team !== ninja.team);
ninja.x = 490; ninja.y = 350; agent.x = 720; agent.y = 340; ninja.suppressedUntil = ninjaState.clock + 2;
updateBattle(ninjaState, 1 / 60);
assertStateIntegrity(ninjaState, smokeContext(ninjaState, 'shadow_ninja vs field_agent', 'ninja grapple pressure'));
if (!ninja.grapple?.active && ninja.grappleCd <= ninjaState.clock) throw smokeError('Shadow ninja did not fire grappling hook under pressure.', smokeContext(ninjaState, 'shadow_ninja vs field_agent', 'ninja grapple pressure'));
if (!ninjaState.effects.find(effect => effect.type === 'grapple_line')) throw smokeError('Grappling hook line effect was not spawned.', smokeContext(ninjaState, 'shadow_ninja vs field_agent', 'ninja grapple pressure'));

console.log('Top Shot smoke simulation passed');
