import { EFFECT_TTL } from './config.js';
import { addLog } from './state.js';
import { angleTo, chance, clamp, dist, normalizeAngle } from './utils.js';

export function updatePrestige(state, dt) {
  for (const f of state.fighters) {
    if (!f.hold) continue;
    const target = state.fighters.find(other => other.id === f.hold.targetId);
    if (!target || target.incapacitated || target.extracted) { f.hold = null; continue; }
    f.hold.t += dt;
    f.stamina = clamp(f.stamina - dt * 12, 0, 100);
    target.stamina = clamp(target.stamina - dt * (8 + f.stats.grapple / 18), 0, 100);
    target.hp = clamp(target.hp - dt * (3 + f.stats.cqc / 35), 0, 100);
    f.pose = 'sleeper_hold';
    target.pose = 'caught_in_hold';
    if (canEscapeHold(target, f)) { breakHold(state, f, target); continue; }
    if (f.stamina < 8) { f.hold = null; f.pose = 'tired_release'; addLog(state, `${f.name} loses the hold from exhaustion.`); continue; }
    if (target.hp <= 8 || target.stamina <= 2 || f.hold.t > 4.5) incapacitateByHold(state, f, target);
  }
}

export function tryPrestigeAction(state, f, enemy, visible) {
  if (f.cooldown > 0 || f.incapacitated || f.extracted || f.extracting || enemy.incapacitated || enemy.extracted) return false;
  if (enemy.defeated && dist(f, enemy) < 58) return chooseFinish(state, f, enemy);
  if (dist(f, enemy) < 38 && !visible && isBehind(f, enemy) && f.stamina > 35 && !f.hold) return trySleeper(state, f, enemy);
  return false;
}

function isBehind(attacker, target) {
  const fromTarget = angleTo(target, attacker);
  return Math.abs(normalizeAngle(fromTarget - target.facing)) > 2.25;
}

function trySleeper(state, f, enemy) {
  const attack = (f.stats.stealth + f.stats.sneakAttack + f.stats.grapple) / 3;
  const defense = (enemy.stats.hearing + enemy.stats.sneakDefense + enemy.stats.counter) / 3;
  const odds = clamp((attack - defense + 55) / 100, 0.18, 0.88);
  f.cooldown = 0.75;
  if (!chance(odds)) { f.pose = 'failed_sneak'; addLog(state, `${f.name} misses the sleeper attempt.`); return true; }
  f.hold = { targetId: enemy.id, t: 0 };
  enemy.heldBy = f.id;
  enemy.pose = 'caught_in_hold';
  state.effects.push({ type: 'grapple', x: enemy.x, y: enemy.y, ttl: EFFECT_TTL.grapple });
  addLog(state, `${f.name} slips behind ${enemy.name} and locks a sleeper hold.`);
  return true;
}

function canEscapeHold(target, holder) {
  const sharpTool = (target.resources.pistol || 0) > 0 || (target.resources.shuriken || 0) > 0 || target.melee === 'knife' || target.melee === 'sword' || target.melee === 'arrow_stab';
  const escapeOdds = clamp((target.stats.counter + target.stats.sneakDefense + target.stamina - holder.stats.grapple) / 280, 0.02, sharpTool ? 0.32 : 0.18);
  return chance(escapeOdds);
}

function breakHold(state, holder, target) {
  holder.hold = null;
  target.heldBy = null;
  holder.pose = 'hold_countered';
  target.pose = 'escape_hold';
  holder.hp = clamp(holder.hp - (target.melee === 'knife' || target.melee === 'sword' ? 12 : 5), 0, 100);
  holder.stamina = clamp(holder.stamina - 14, 0, 100);
  addLog(state, `${target.name} counters the sleeper hold.`);
}

function incapacitateByHold(state, holder, target) {
  holder.hold = null;
  target.heldBy = null;
  target.hp = 0;
  target.incapacitated = true;
  target.pose = 'slept_out';
  state.matchState = 'finished';
  holder.prestige = clamp(holder.prestige + 2, 0, 100);
  addLog(state, `${holder.name} cleanly incapacitates ${target.name} with the hold.`);
}

function chooseFinish(state, f, enemy) {
  const ethos = f.team === 'A' ? state.commanderEthos : 'ai';
  const ruthlessBias = ethos === 'ruthless' ? 34 : ethos === 'respectful' ? -45 : f.stats.ruthlessness - f.stats.prestige;
  if (ruthlessBias > 20 && chance(0.55)) return hardFinish(state, f, enemy);
  if (ethos === 'respectful' || f.stats.prestige >= f.stats.ruthlessness) return respectfulFinish(state, f, enemy);
  return leaveFinish(state, f, enemy);
}

function respectfulFinish(state, f, enemy) {
  enemy.incapacitated = true;
  enemy.pose = 'helped_out';
  f.pose = 'respect_finish';
  f.prestige = clamp(f.prestige + 4, 0, 100);
  f.ruthless = clamp(f.ruthless - 2, 0, 100);
  state.matchState = 'finished';
  addLog(state, `${f.name} helps ${enemy.name} up after the win.`);
  return true;
}
function leaveFinish(state, f, enemy) {
  enemy.incapacitated = true;
  enemy.pose = 'left_for_stretcher';
  f.pose = 'walk_off';
  state.matchState = 'finished';
  addLog(state, `${f.name} leaves ${enemy.name} for the stretcher.`);
  return true;
}
function hardFinish(state, f, enemy) {
  enemy.incapacitated = true;
  enemy.pose = 'hard_finished';
  f.pose = 'ruthless_finish';
  f.ruthless = clamp(f.ruthless + 5, 0, 100);
  f.prestige = clamp(f.prestige - 8, 0, 100);
  state.matchState = 'finished';
  addLog(state, `${f.name} chooses a ruthless final incapacitation.`);
  return true;
}
