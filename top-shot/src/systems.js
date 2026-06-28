import { COACH_COMMANDS, COACH_DROPS } from './config.js';
import { clamp, dist } from './utils.js';
import { addLog, opponentOf } from './state.js';
import { canHear, canSee, chooseDestination, moveFighter } from './perception.js';
import { tryAttack, updateCombat } from './combat.js';
import { trySuperMove, updateExplosives } from './explosives.js';
import { tryPrestigeAction, updatePrestige } from './prestige.js';
import { recoverVitality } from './vitality.js';
import { updateHiding } from './hiding.js';
import { updateTacticalPosture } from './tactics.js';
import { shouldBandage, startBandage, updateWounds } from './wounds.js';

export function updateBattle(state, dt) {
  if (state.paused || state.matchState === 'finished') return;
  state.clock += dt;
  state.effects.forEach(e => { e.ttl -= dt; });
  state.effects = state.effects.filter(e => e.ttl > 0);
  updateExplosives(state, dt);
  updatePrestige(state, dt);
  updateWounds(state, dt);
  updateCombat(state, dt);
  for (const f of state.fighters) updateFighter(state, f, dt);
  updateHiding(state, dt);
  updatePickups(state);
  updateRetrievals(state);
  checkFinish(state);
}

function updateFighter(state, f, dt) {
  if (f.currentMove) { f.currentMove.ttl -= dt; if (f.currentMove.ttl <= 0) f.currentMove = null; }
  f.commandCd = Math.max(0, f.commandCd - dt);
  f.helpT = Math.max(0, (f.helpT || 0) - dt);
  if (f.memory.command && f.memory.command.until <= state.clock) f.memory.command = null;
  if (f.incapacitated || f.defeated || f.extracted || f.diveT > 0 || f.hold || f.heldBy || f.bleed?.bandaging) return;
  if (f.extracting) return updateExtraction(state, f, dt);
  const enemy = opponentOf(state, f);
  const visible = canSee(state.arena, f, enemy);
  const audible = canHear(f, enemy);
  if (visible || audible) {
    if (!enemy.spottedT || enemy.spottedT <= 0) state.effects.push({ type: 'alert', x: enemy.x, y: enemy.y - 42, ttl: 0.8 });
    enemy.spottedT = 0.9;
    f.memory.lastSeen = { x: enemy.x, y: enemy.y, t: state.clock };
  }
  f.spottedT = Math.max(0, (f.spottedT || 0) - dt);
  chooseStance(f, enemy, visible);
  updateTacticalPosture(state, f, enemy, visible, dt);
  if (shouldBandage(f) && startBandage(state, f)) return;
  if (!tryPrestigeAction(state, f, enemy, visible) && !trySuperMove(state, f, enemy, visible)) tryAttack(state, f, enemy, visible);
  if (needsHelp(f)) askForHelp(state, f);
  const destination = commandedDestination(state, f, enemy) || nearestUsefulPickup(state, f) || nearestStuckProjectile(state, f) || chooseDestination(state, f, enemy);
  moveFighter(state, f, destination, dt);
  f.anim += dt * (['walk', 'crouchWalk', 'rush', 'stagger_limp', 'limp_run', 'careful_walk', 'wall_strafe', 'reposition', 'roll', 'combat_roll'].includes(f.pose) ? 12 : 3);
}

function chooseStance(f, enemy, visible) {
  const d = dist(f, enemy);
  f.prone = false; f.crouch = false;
  if (f.hideCooldown > 0) return;
  if (f.archetypeId === 'marine' && d > 220 && f.hp < 80 && visible) f.prone = true;
  if ((f.archetypeId === 'ninja' || f.archetypeId === 'archer') && (!visible || f.bleed?.rate > 0) && d > 110) f.crouch = true;
}

function commandedDestination(state, f, enemy) {
  const command = f.memory.command;
  if (!command || f.team !== 'A' && !['investigate', 'strafe'].includes(command.type)) return null;
  if (['move', 'cover', 'investigate', 'strafe'].includes(command.type)) return { x: command.x, y: command.y };
  if (['ranged', 'projectile', 'grenade'].includes(command.type)) {
    const desired = command.type === 'grenade' ? 250 : 175;
    const away = Math.atan2(f.y - enemy.y, f.x - enemy.x);
    return { x: f.x + Math.cos(away) * desired, y: f.y + Math.sin(away) * desired };
  }
  if (['cqc', 'disarm', 'sword'].includes(command.type)) return { x: enemy.x, y: enemy.y };
  return null;
}

function nearestUsefulPickup(state, f) {
  const items = state.pickups.filter(p => !p.used && (p.team === f.team || p.team === 'any'));
  if (!items.length) return null;
  const sorted = [...items].sort((a, b) => dist(f, a) - dist(f, b));
  const pick = sorted[0];
  if (pick.type === 'med' && f.hp > Math.min(72, f.vitalityCap ?? 100) && !f.bleed?.rate) return null;
  if (pick.type === 'ammo' && !['marine', 'archer', 'ninja'].includes(f.archetypeId)) return null;
  return pick;
}

function nearestStuckProjectile(state, f) {
  if (!['ninja', 'archer'].includes(f.archetypeId)) return null;
  const owned = state.projectiles.filter(p => p.stuck && p.team === f.team && ((f.archetypeId === 'ninja' && p.type === 'shuriken') || (f.archetypeId === 'archer' && p.type === 'arrow')));
  return owned.sort((a, b) => dist(f, a) - dist(f, b))[0] || null;
}

function updatePickups(state) {
  for (const pick of state.pickups) {
    if (pick.used) continue;
    for (const f of state.fighters) {
      if (dist(f, pick) < 28 && (pick.team === 'any' || pick.team === f.team)) { usePickup(state, f, pick); pick.used = true; }
    }
  }
}

function updateRetrievals(state) {
  for (const f of state.fighters) {
    for (const p of state.projectiles) {
      if (!p.stuck || p.team !== f.team || dist(f, p) >= 24) continue;
      if (p.type === 'shuriken') f.resources.shuriken = (f.resources.shuriken || 0) + 1;
      if (p.type === 'arrow') f.resources.arrows = (f.resources.arrows || 0) + 1;
      p.ttl = 0; p.stuck = false;
      addLog(state, `${f.name} retrieves a ${p.type}.`);
    }
  }
  state.projectiles = state.projectiles.filter(p => p.ttl > 0 || p.stuck);
}

function usePickup(state, f, pick) {
  if (pick.type === 'med') { if (f.bleed?.rate) startBandage(state, f); recoverVitality(f, 22); f.bandageCd = 2; rewardTrust(state, 2); addLog(state, `${f.name} uses a coach med drop.`); }
  if (pick.type === 'ammo') { f.resources.rifle = (f.resources.rifle || 0) + 24; f.resources.pistol = (f.resources.pistol || 0) + 8; f.resources.grenades = (f.resources.grenades || 0) + 1; f.resources.arrows = (f.resources.arrows || 0) + 6; f.resources.shuriken = (f.resources.shuriken || 0) + 3; rewardTrust(state, 1); addLog(state, `${f.name} grabs ammunition.`); }
  if (pick.type === 'weapon') { f.heat = 0; f.fight = 100; f.dodge = Math.max(f.dodge, 65); f.block = Math.max(f.block, 65); rewardTrust(state, 1); addLog(state, `${f.name} regains weapon rhythm.`); }
  if (pick.type === 'extract') beginExtraction(state, f);
}

function beginExtraction(state, f) { f.extracting = true; f.actionT = 1.3; f.pose = 'extract'; state.effects.push({ type: 'extraction', x: f.x, y: f.y, ttl: 1.3 }); addLog(state, `${f.name} grabs the extraction rope. Match forfeited, fighter saved.`); }
function updateExtraction(state, f, dt) { f.actionT -= dt; f.y -= 160 * dt; f.pose = 'extract'; if (f.actionT <= 0) { f.extracted = true; f.extracting = false; state.matchState = 'finished'; rewardTrust(state, -4); addLog(state, `${f.name} extracted from the arena.`); } }

export function placeCoachDrop(state, type, x, y) { if (!COACH_DROPS[type] || (state.dropsLeft[type] || 0) <= 0) return false; state.dropsLeft[type]--; state.pickups.push({ type, team: 'A', x, y, used: false, label: COACH_DROPS[type].label, color: COACH_DROPS[type].color }); addLog(state, `Coach drops ${COACH_DROPS[type].label}.`); return true; }
export function suggestCommand(state, type, x, y, urgent = false) { if (!COACH_COMMANDS[type]) return false; const f = state.fighters.find(f => f.team === 'A'); if (!f || f.incapacitated || f.defeated || f.extracted || f.commandCd > 0) return false; const obeyChance = clamp((state.trust + f.stats.discipline) / 190 + (urgent ? 0.12 : 0), 0.18, 0.94); state.commandHistory.push({ t: state.clock, type, obeyChance }); f.commandCd = urgent ? 0.45 : 0.9; if (Math.random() > obeyChance) { rewardTrust(state, -COACH_COMMANDS[type].trustCost); addLog(state, `${f.name} ignores the ${COACH_COMMANDS[type].label} call.`); return false; } f.memory.command = { type, x, y, urgent, until: state.clock + (urgent ? 2.4 : 3.8) }; f.stamina = clamp(f.stamina - (urgent ? 12 : 4), 0, 100); f.helpT = 0; state.effects.push({ type: 'command', x, y, ttl: 0.65 }); rewardTrust(state, -Math.ceil(COACH_COMMANDS[type].trustCost / 3)); addLog(state, `${f.name} follows opportunity call: ${COACH_COMMANDS[type].label}.`); return true; }
export function setCommanderEthos(state, ethos) { if (!['ai', 'respectful', 'ruthless'].includes(ethos)) return false; state.commanderEthos = ethos; addLog(state, `Commander ethos set to ${ethos}.`); return true; }

function needsHelp(f) { return f.team === 'A' && !f.memory.command && !f.helpT && (f.bleed?.rate > 0 || f.hp < 38 || f.stamina < 18 || f.dodge < 12 || f.block < 12); }
function askForHelp(state, f) { f.helpT = 2.2; f.helpIcon = f.bleed?.rate > 0 ? 'bleed' : f.resources.grenades === 0 && f.archetypeId === 'marine' ? 'grenade' : '?'; state.effects.push({ type: 'command', x: f.x, y: f.y - 36, ttl: 0.65, label: f.helpIcon }); addLog(state, `${f.name} looks to you for a call.`); }
function rewardTrust(state, amount) { state.trust = clamp(state.trust + amount, 0, 100); }
function checkFinish(state) { const active = state.fighters.filter(f => !f.incapacitated && !f.extracted); if (active.length <= 1 && state.matchState !== 'finished') state.matchState = 'finished'; }
