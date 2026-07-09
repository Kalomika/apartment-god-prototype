import { COACH_COMMANDS, COACH_DROPS } from './config.js';
import { blocked, climbableNear, topPoint } from './arena.js';
import { angleTo, clamp, dist } from './utils.js';
import { addLog, opponentOf } from './state.js';
import { canHear, canSee, chooseDestination, moveFighter } from './perception.js';
import { tryAttack, updateCombat } from './combat.js';
import { trySuperMove, updateExplosives } from './explosives.js';
import { tryPrestigeAction, updatePrestige } from './prestige.js';
import { fighterRequest } from './requests.js';
import { recoverVitality } from './vitality.js';
import { updateHiding } from './hiding.js';
import { updateTacticalPosture } from './tactics.js';
import { updateBrain, brainDestination } from './brain.js';
import { updateStealthSystem } from './stealth.js';
import { shouldBandage, startBandage, updateWounds } from './wounds.js';
import { hasAttackWindow, updateEngagementDirector } from './engagementDirector.js';

export function updateBattle(state, dt) {
  if (state.paused) return;
  if (state.matchState === 'ready') return;
  state.clock += dt;
  state.cinematic ||= { phase: state.matchState === 'deploying' ? 'intro' : 'running', t: 0 };
  state.cinematic.t = (state.cinematic.t || 0) + dt;
  state.effects.forEach(e => { e.ttl -= dt; });
  state.effects = state.effects.filter(e => e.ttl > 0);
  if (state.matchState === 'finished') { updateOutro(state, dt); return; }
  if (state.matchState === 'deploying') { updateDeployment(state, dt); return; }
  if (state.matchState !== 'running' || state.fighters.length < 2) return;
  updateExplosives(state, dt);
  updatePrestige(state, dt);
  updateWounds(state, dt);
  updateCombat(state, dt);
  updateStealthSystem(state, dt);
  for (const f of state.fighters) updateFighter(state, f, dt);
  updateHiding(state, dt);
  updatePickups(state);
  updateRetrievals(state);
  checkFinish(state);
}

function updateDeployment(state, dt) {
  state.cinematic = state.cinematic?.phase === 'intro' ? state.cinematic : { phase: 'intro', t: 0, label: 'parachute entry' };
  let allLanded = true;
  for (const f of state.fighters) {
    if (!f.deploying || !f.deploy) continue;
    const delay = f.deploy.delay || 0;
    f.deploy.t += dt;
    const activeT = Math.max(0, f.deploy.t - delay);
    const t = clamp(activeT / Math.max(0.01, f.deploy.duration), 0, 1);
    if (f.deploy.t < delay) { allLanded = false; f.x = f.deploy.fromX; f.y = f.deploy.fromY; f.deployAltitude = f.deploy.altitude; f.pose = 'parachute_wait'; f.intent = 'stacking'; continue; }
    const eased = 1 - Math.pow(1 - t, 3);
    const drift = Math.sin(t * Math.PI) * (f.team === 'A' ? 26 : -26);
    f.x = f.deploy.fromX + (f.deploy.toX - f.deploy.fromX) * eased + drift;
    f.y = f.deploy.fromY + (f.deploy.toY - f.deploy.fromY) * eased;
    f.deployAltitude = Math.max(0, f.deploy.altitude * (1 - eased));
    f.facing = f.spawn.facing;
    f.pose = t < 0.94 ? 'parachute' : t < 1 ? 'land' : 'intro_ready';
    f.intent = t < 1 ? 'intro_drop' : 'intro_ready';
    f.noise = 0; f.hidden = false; f.shadowHidden = false; f.anim += dt * 10;
    if (t < 1) allLanded = false;
    else if (f.deploying) { f.deploying = false; f.deployAltitude = 0; f.actionT = 0.22; f.noise = 28; state.effects.push({ type: 'landing_flash', x: f.x, y: f.y, ttl: 0.38, label: 'ok' }); }
  }
  if (!allLanded) return;
  state.matchState = 'running';
  state.cinematic = { phase: 'running', t: 0, label: 'match live' };
  state.fighters.forEach(f => { f.intent = 'scan'; f.pose = 'idle_guard'; f.deploy = null; f.deployAltitude = 0; f.deploying = false; });
  addLog(state, 'Intro complete. Both fighters landed and the match is live.');
}

function updateFighter(state, f, dt) {
  if (f.currentMove) { f.currentMove.ttl -= dt; if (f.currentMove.ttl <= 0) f.currentMove = null; }
  f.commandCd = Math.max(0, f.commandCd - dt);
  f.helpT = Math.max(0, (f.helpT || 0) - dt);
  f.woundT = Math.max(0, (f.woundT || 0) - dt);
  if (f.memory.command && f.memory.command.until <= state.clock) f.memory.command = null;
  if (f.incapacitated || f.defeated || f.extracted || f.hold || f.heldBy || f.bleed?.bandaging) return;
  if (f.extracting) return updateExtraction(state, f, dt);
  if (updateGrappleTravel(state, f, dt)) return;

  const enemy = opponentOf(state, f);
  if (!enemy) return;
  const visible = canSee(state.arena, f, enemy);
  const audible = canHear(f, enemy);
  if (visible || audible) { if (!enemy.spottedT || enemy.spottedT <= 0) state.effects.push({ type: 'alert', x: enemy.x, y: enemy.y - 42, ttl: 0.8 }); enemy.spottedT = 0.9; if (visible) f.memory.lastSeen = { x: enemy.x, y: enemy.y, t: state.clock }; }

  f.spottedT = Math.max(0, (f.spottedT || 0) - dt);
  updateEngagementDirector(state, f, enemy, visible, audible, dt);
  updateBrain(state, f, enemy, visible, audible);
  chooseStance(state, f, enemy, visible);
  if (!f.tacticLock || f.tacticLock <= state.clock) { updateTacticalPosture(state, f, enemy, visible, dt); f.tacticLock = state.clock + 0.3; }
  if (shouldBandage(f) && startBandage(state, f)) return;
  if (tryNinjaGrappleHook(state, f, enemy, visible)) return;

  const preserving = wantsPreservation(state, f, visible);
  if (!preserving || canPeekFromCover(state, f, visible)) {
    if (!tryPrestigeAction(state, f, enemy, visible) && !trySuperMove(state, f, enemy, visible)) tryAttack(state, f, enemy, visible);
  } else if (f.coverPinned) {
    f.pose = f.woundT > 0 ? 'wound_cover_hold' : 'cover_pinned';
  }
  if (needsHelp(state, f)) askForHelp(state, f);

  const destination = stableDestination(state, f, enemy);
  const before = { x: f.x, y: f.y };
  moveFighter(state, f, destination, dt);
  recoverIfStuck(state, f, before, destination);
  const movingPose = ['walk', 'run', 'crouchWalk', 'rush', 'stagger_limp', 'limp_run', 'careful_walk', 'wall_strafe', 'roll', 'combat_roll', 'combat_dive', 'climb_up', 'jump_down_escape', 'drop_down', 'crawl', 'grapple_launch'].includes(f.pose);
  f.anim += dt * (movingPose && (f.lastMove || 0) > 0.35 ? 9 : 3);
}

function wantsPreservation(state, f, visible) {
  if (hasAttackWindow(state, f) && (f.coverPinned || f.wallLean || f.intent === 'strike_now')) return false;
  const underFire = f.suppressedUntil && f.suppressedUntil > state.clock;
  return Boolean(underFire && !f.coverPinned || f.woundT > 0.15 || f.bleed?.rate > 0 && !f.hidden || f.hp < 62 && !f.coverPinned || f.stamina < 14);
}
function canPeekFromCover(state, f, visible) { return Boolean(visible && f.coverPinned && ((f.peekCooldown || 0) <= 0 || hasAttackWindow(state, f)) && (f.woundT || 0) <= 0.15 && (f.bleed?.rate || 0) < 6); }

function tryNinjaGrappleHook(state, f, enemy, visible) {
  if (!['ninja', 'shadow_ninja'].includes(f.archetypeId) || f.grappleCd > state.clock || f.grapple?.active) return false;
  const underFire = f.suppressedUntil && f.suppressedUntil > state.clock;
  const shouldUse = underFire || visible && dist(f, enemy) > 115 || f.hp < 72 || f.intent === 'vertical_reposition';
  if (!shouldUse) return false;
  const target = climbableNear(state.arena, f, 280);
  if (!target) return false;
  const to = topPoint(target, f);
  f.grappleCd = state.clock + 7.5;
  f.grapple = { active: true, t: 0, duration: 0.52, fromX: f.x, fromY: f.y, toX: to.x, toY: to.y, targetId: target.id };
  f.pose = 'grapple_launch';
  f.shadowHidden = true;
  f.crouch = true;
  state.effects.push({ type: 'grapple_line', x: f.x, y: f.y, x2: to.x, y2: to.y, ttl: 0.55 });
  addLog(state, `${f.name} fires a grappling hook and launches toward high cover.`);
  return true;
}

function updateGrappleTravel(state, f, dt) {
  if (!f.grapple?.active) return false;
  f.grapple.t += dt;
  const t = clamp(f.grapple.t / Math.max(0.01, f.grapple.duration), 0, 1);
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  f.x = f.grapple.fromX + (f.grapple.toX - f.grapple.fromX) * ease;
  f.y = f.grapple.fromY + (f.grapple.toY - f.grapple.fromY) * ease;
  f.elevation = Math.max(f.elevation || 0, Math.sin(t * Math.PI) * 1.1);
  f.pose = 'grapple_launch';
  f.noise = 22;
  if (t >= 1) { f.grapple.active = false; f.onObject = f.grapple.targetId; f.climbT = 0.25; f.shadowHidden = true; f.pose = 'hide_shadow'; addLog(state, `${f.name} lands on high cover and vanishes low.`); }
  return true;
}

function stableDestination(state, f, enemy) {
  const command = commandedDestination(state, f, enemy);
  if (command) { f.memory.navTarget = null; return command; }
  const brainTarget = brainDestination(f);
  if (brainTarget) return brainTarget;
  const cached = f.memory.navTarget;
  if (cached && cached.until > state.clock && dist(f, cached) > 28) return cached;
  const next = nearestUsefulPickup(state, f) || nearestStuckProjectile(state, f) || chooseDestination(state, f, enemy);
  f.memory.navTarget = { x: next.x, y: next.y, until: state.clock + 0.85 };
  return next;
}

function recoverIfStuck(state, f, before, destination) {
  const moved = dist(before, f);
  f.lastMove = moved;
  if (moved < 0.7 && dist(f, destination) > 32 && !f.currentMove) f.stuckFrames = (f.stuckFrames || 0) + 1;
  else f.stuckFrames = Math.max(0, (f.stuckFrames || 0) - 2);
  if (f.stuckFrames < 12) return;
  f.memory.navTarget = null; f.memory.command = null;
  if (f.brain) { f.brain.dest = null; f.brain.until = 0; }
  f.pose = 'reposition'; f.stamina = clamp(f.stamina + 4, 0, 100);
  f.memory.navTarget = { ...stuckEscapePoint(state, f, destination), until: state.clock + 1.15 };
  f.stuckFrames = 0;
  addLog(state, `${f.name} breaks off and repositions.`);
}

function stuckEscapePoint(state, f, destination) { const away = Math.atan2(f.y - destination.y, f.x - destination.x); const side = f.memory.flankSide || f.brainSide || 1; const angles = [away, away + side * 0.75, away - side * 0.75, away + side * 1.35, away - side * 1.35, away + Math.PI]; const options = []; for (const radius of [92, 132, 170]) for (const a of angles) { const p = { x: clamp(f.x + Math.cos(a) * radius, 72, 888), y: clamp(f.y + Math.sin(a) * radius, 72, 648) }; if (!blocked(state.arena, p, 18)) options.push(p); } return options.sort((a, b) => dist(b, destination) - dist(a, destination))[0] || { x: f.x, y: f.y }; }
function chooseStance(state, f, enemy, visible) { const d = dist(f, enemy); const underFire = f.suppressedUntil && f.suppressedUntil > state.clock; f.prone = false; f.crouch = false; if (f.hideCooldown > 0) return; if (f.coverPinned) { f.crouch = true; return; } if (underFire && !f.wallLean) { f.crouch = true; if ((f.diveT || 0) > 0.1) f.prone = false; return; } if (['alert', 'evasion', 'suspicious'].includes(f.awareness?.phase) && !visible && d > 120) { f.crouch = true; return; } if (['marine', 'survival_commando'].includes(f.archetypeId) && d > 220 && f.hp < 80 && visible) f.prone = true; if (['suit_operative', 'field_agent'].includes(f.archetypeId) && d > 110 && (f.hp < 68 || f.shadowHidden || f.archetypeId === 'field_agent')) f.crouch = true; if ((['ninja', 'shadow_ninja'].includes(f.archetypeId) || f.archetypeId === 'archer') && (visible || !visible || f.bleed?.rate > 0) && d > 90) f.crouch = true; }
function commandedDestination(state, f, enemy) { const command = f.memory.command; if (!command || (f.team !== 'A' && !['investigate', 'strafe', 'roll_cover', 'grapple_hook'].includes(command.type))) return null; if (['move', 'cover', 'investigate', 'strafe', 'roll_cover', 'grapple_hook'].includes(command.type)) return { x: command.x, y: command.y }; if (['ranged', 'projectile', 'grenade'].includes(command.type)) { const desired = command.type === 'grenade' ? 250 : 175; const away = Math.atan2(f.y - enemy.y, f.x - enemy.x); return { x: f.x + Math.cos(away) * desired, y: f.y + Math.sin(away) * desired }; } if (['cqc', 'disarm', 'sword'].includes(command.type)) return { x: enemy.x, y: enemy.y }; return null; }
function nearestUsefulPickup(state, f) { const items = state.pickups.filter(p => !p.used && (p.team === f.team || p.team === 'any')); if (!items.length) return null; const pick = [...items].sort((a, b) => dist(f, a) - dist(f, b))[0]; if (pick.type === 'med' && f.hp > Math.min(72, f.vitalityCap ?? 100) && !f.bleed?.rate) return null; if (pick.type === 'ammo' && !['marine', 'suit_operative', 'survival_commando', 'field_agent', 'archer', 'ninja', 'shadow_ninja'].includes(f.archetypeId)) return null; return pick; }
function nearestStuckProjectile(state, f) { if (!['ninja', 'shadow_ninja', 'archer'].includes(f.archetypeId)) return null; const owned = state.projectiles.filter(p => p.stuck && p.team === f.team && ((['ninja', 'shadow_ninja'].includes(f.archetypeId) && p.type === 'shuriken') || (f.archetypeId === 'archer' && p.type === 'arrow'))); return owned.sort((a, b) => dist(f, a) - dist(f, b))[0] || null; }
function updatePickups(state) { for (const pick of state.pickups) { if (pick.used) continue; for (const f of state.fighters) if (dist(f, pick) < 28 && (pick.team === 'any' || pick.team === f.team)) { usePickup(state, f, pick); pick.used = true; } } }
function updateRetrievals(state) { for (const f of state.fighters) { for (const p of state.projectiles) { if (!p.stuck || p.team !== f.team || dist(f, p) >= 24) continue; if (p.type === 'shuriken') f.resources.shuriken = (f.resources.shuriken || 0) + 1; if (p.type === 'arrow') f.resources.arrows = (f.resources.arrows || 0) + 1; p.ttl = 0; p.stuck = false; addLog(state, `${f.name} retrieves a ${p.type}.`); } } state.projectiles = state.projectiles.filter(p => p.ttl > 0 || p.stuck); }
function usePickup(state, f, pick) { if (pick.type === 'med') { if (f.bleed?.rate) startBandage(state, f); recoverVitality(f, 22); f.bandageCd = 2; rewardTrust(state, 2); addLog(state, `${f.name} uses a coach med drop.`); } if (pick.type === 'ammo') { f.resources.rifle = (f.resources.rifle || 0) + 24; f.resources.pistol = (f.resources.pistol || 0) + 8; f.resources.grenades = (f.resources.grenades || 0) + 1; f.resources.arrows = (f.resources.arrows || 0) + 6; f.resources.shuriken = (f.resources.shuriken || 0) + 3; rewardTrust(state, 1); addLog(state, `${f.name} grabs ammunition.`); } if (pick.type === 'weapon') { f.heat = 0; f.fight = 100; f.dodge = Math.max(f.dodge, 65); f.block = Math.max(f.block, 65); rewardTrust(state, 1); addLog(state, `${f.name} regains weapon rhythm.`); } if (pick.type === 'extract') beginExtraction(state, f); }
function beginExtraction(state, f) { f.extracting = true; f.actionT = 1.3; f.pose = 'extract'; state.effects.push({ type: 'extraction', x: f.x, y: f.y, ttl: 1.3 }); addLog(state, `${f.name} grabs the extraction rope. Match forfeited, fighter saved.`); }
function updateExtraction(state, f, dt) { f.actionT -= dt; f.y -= 160 * dt; f.pose = 'extract'; if (f.actionT <= 0) { f.extracted = true; f.extracting = false; state.result = `${f.name} extracted. Opponent wins by forfeit.`; state.matchState = 'finished'; state.cinematic = { phase: 'outro', t: 0, winner: opponentOf(state, f)?.id, loser: f.id, label: 'extraction forfeit' }; rewardTrust(state, -4); addLog(state, state.result); } }
export function placeCoachDrop(state, type, x, y) { if (state.matchState !== 'running') return false; if (!COACH_DROPS[type] || (state.dropsLeft[type] || 0) <= 0) return false; state.dropsLeft[type]--; state.pickups.push({ type, team: 'A', x, y, used: false, label: COACH_DROPS[type].label, color: COACH_DROPS[type].color }); addLog(state, `Coach drops ${COACH_DROPS[type].label}.`); return true; }
export function suggestCommand(state, type, x, y, urgent = false) { if (state.matchState !== 'running') return false; if (!COACH_COMMANDS[type]) return false; const f = state.fighters.find(f => f.team === 'A'); if (!f || f.incapacitated || f.defeated || f.extracted || f.commandCd > 0) return false; const obeyChance = clamp((state.trust + f.stats.discipline) / 190 + (urgent ? 0.12 : 0), 0.18, 0.94); state.commandHistory.push({ t: state.clock, type, obeyChance }); f.commandCd = urgent ? 0.45 : 0.9; if (Math.random() > obeyChance) { rewardTrust(state, -COACH_COMMANDS[type].trustCost); addLog(state, `${f.name} ignores the ${COACH_COMMANDS[type].label} call.`); return false; } f.memory.command = { type, x, y, urgent, until: state.clock + (urgent ? 2.4 : 3.8) }; f.stamina = clamp(f.stamina - (urgent ? 12 : 4), 0, 100); f.helpT = 0.95; f.helpIcon = 'ok'; f.helpRequest = 'approval'; state.effects.push({ type: 'command', x, y, ttl: 0.65 }); rewardTrust(state, -Math.ceil(COACH_COMMANDS[type].trustCost / 3)); addLog(state, `${f.name} follows opportunity call: ${COACH_COMMANDS[type].label}.`); return true; }
export function setCommanderEthos(state, ethos) { if (!['ai', 'respectful', 'ruthless'].includes(ethos)) return false; state.commanderEthos = ethos; addLog(state, `Commander ethos set to ${ethos}.`); return true; }
function updateOutro(state, dt) { for (const f of state.fighters) { if (f.incapacitated || f.defeated) f.pose = f.incapacitated ? 'down' : 'defeated_kneel'; else if (!f.extracted) f.pose = state.cinematic?.t > 0.7 ? 'victory_hold' : 'scan'; } }
function needsHelp(state, f) { const request = fighterRequest(state, f); return Boolean(request?.urgent && !f.memory.command && !f.helpT && !f.extracting && !f.extracted); }
function askForHelp(state, f) { const request = fighterRequest(state, f) || { id: 'help', icon: '?', callout: 'a command' }; f.helpT = request.id === 'extract' ? 2.8 : 2.2; f.helpIcon = request.icon; f.helpRequest = request.id; state.effects.push({ type: 'command', x: f.x, y: f.y - 36, ttl: 0.65, label: request.icon }); addLog(state, `${f.name} looks up for ${request.callout}.`); }
function rewardTrust(state, amount) { state.trust = clamp(state.trust + amount, 0, 100); }
function checkFinish(state) { if (state.matchState !== 'running') return; const active = state.fighters.filter(f => !f.incapacitated && !f.extracted); if (active.length > 1) return; const winner = active[0]; const loser = state.fighters.find(f => f !== winner); state.result = winner ? `${winner.name} wins. ${loser?.name || 'Opponent'} is out.` : 'Match ends with no active fighters.'; state.matchState = 'finished'; state.cinematic = { phase: 'outro', t: 0, winner: winner?.id, loser: loser?.id, label: 'match finish' }; if (winner) winner.pose = 'victory_hold'; if (loser) loser.pose = loser.incapacitated ? 'down' : 'defeated_kneel'; addLog(state, `Outro sequence. ${state.result}`); }
