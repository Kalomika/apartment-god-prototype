import { EFFECT_TTL } from './config.js';
import { blocked } from './arena.js';
import { angleTo, chance, choose, clamp, dist, rand } from './utils.js';
import { addLog } from './state.js';
import { clearLine } from './perception.js';
import { canSuddenIncapacitate, recoverVitality, updateVitalityCap } from './vitality.js';
import { addBleed, startBandage } from './wounds.js';

const MOVES = [
  { id: 'left_jab', limb: 'leftArm', kind: 'punch', reach: 38, damage: 7, stamina: 5, lean: 1 },
  { id: 'right_cross', limb: 'rightArm', kind: 'punch', reach: 42, damage: 9, stamina: 7, lean: -1 },
  { id: 'left_kick', limb: 'leftLeg', kind: 'kick', reach: 52, damage: 11, stamina: 9, lean: 1 },
  { id: 'right_kick', limb: 'rightLeg', kind: 'kick', reach: 52, damage: 11, stamina: 9, lean: -1 },
  { id: 'roundhouse', limb: 'rightLeg', kind: 'power', reach: 60, damage: 17, stamina: 18, lean: -1 },
  { id: 'headbutt', limb: 'head', kind: 'headbutt', reach: 28, damage: 10, stamina: 12, lean: 0 }
];
const SWORD = ['short_slash', 'wide_slash', 'reverse_slash', 'thrust_slash'];
const STABS = [
  { id: 'knife_jab', limb: 'rightArm', kind: 'knife', reach: 48, damage: 13, stamina: 8, lean: -1 },
  { id: 'low_knife_cut', limb: 'leftArm', kind: 'knife', reach: 43, damage: 10, stamina: 7, lean: 1 },
  { id: 'arrow_stab', limb: 'rightArm', kind: 'arrow_stab', reach: 46, damage: 11, stamina: 8, lean: -1 }
];

export function updateCombat(state, dt) {
  for (const f of state.fighters) {
    if (f.defeated) continue;
    f.cooldown = Math.max(0, f.cooldown - dt);
    f.rangedCd = Math.max(0, f.rangedCd - dt);
    f.meleeCd = Math.max(0, f.meleeCd - dt);
    f.specialCd = Math.max(0, f.specialCd - dt);
    f.bandageCd = Math.max(0, f.bandageCd - dt);
    f.heat = Math.max(0, f.heat - dt * (f.hidden ? 22 : 10));
    f.stamina = clamp(f.stamina + dt * (f.hidden || f.wallLean ? 11 : 5), 0, 100);
    f.fight = clamp(f.fight + dt * 6, 0, 100);
    f.dodge = clamp(f.dodge + dt * 8, 0, 100);
    f.block = clamp(f.block + dt * 9, 0, 100);
    if (f.hidden && !f.bleed?.rate && f.hp > 0 && f.hp < (f.vitalityCap ?? 100)) recoverVitality(f, dt * (f.bandageCd > 0 ? 5.5 : 1.4));
    for (const limb of Object.values(f.limbs)) { limb.guard = clamp(limb.guard + dt * 10, 0, 100); limb.t = Math.max(0, limb.t - dt); }
  }
  updateProjectiles(state, dt);
}

export function tryAttack(state, f, enemy, visible) {
  if (f.cooldown > 0 || f.incapacitated || f.defeated || f.extracted || f.extracting || enemy.incapacitated || enemy.extracted || enemy.defeated) return;
  const d = dist(f, enemy);
  if (f.bleed?.rate > 0 && (f.hidden || f.wallLean || f.hp < 35)) return bandage(state, f);
  if (f.hp < 45 && f.bandageCd <= 0 && f.hidden) return bandage(state, f);
  if (f.archetypeId === 'ninja' && f.specialCd <= 0 && f.resources.smoke > 0 && f.hp < 52) return smoke(state, f, enemy);
  if (f.memory.command?.type === 'disarm' && d < 54) return disarm(state, f, enemy);
  if (f.memory.command?.type === 'sword' && d < meleeReach(f) && f.melee === 'sword') return melee(state, f, enemy, 'sword');
  if (visible && shouldRanged(f, d)) return ranged(state, f, enemy);
  if (d < meleeReach(f)) return melee(state, f, enemy);
  if (d < 44 && f.stats.grapple > 55 && f.fight > 35 && chance(f.stats.grapple / 420)) return grapple(state, f, enemy);
}

function shouldRanged(f, d) {
  if (f.rangedCd > 0 || f.heat > 88) return false;
  if (['cqc', 'disarm', 'sword'].includes(f.memory.command?.type)) return false;
  if (f.memory.command?.type === 'projectile') return d > 60;
  if (f.archetypeId === 'marine') return (f.resources.rifle > 0 || f.resources.pistol > 0) && d > 95;
  if (f.archetypeId === 'ninja') return f.resources.shuriken > 0 && d > 92 && d < 430;
  if (f.archetypeId === 'archer') return f.resources.arrows > 0 && d > 80 && d < 520;
  if (f.archetypeId === 'martial_artist') return f.resources.debris > 0 && d > 100 && d < 310;
  return false;
}

function ranged(state, f, enemy) {
  if (f.archetypeId === 'marine') return fireGun(state, f, enemy);
  if (f.archetypeId === 'ninja') return throwProjectile(state, f, enemy, 'shuriken', 520, 9, 'shuriken');
  if (f.archetypeId === 'archer') return throwProjectile(state, f, enemy, 'arrow', 420, 15, 'arrows');
  return throwProjectile(state, f, enemy, 'debris', 360, 7, 'debris');
}

function fireGun(state, f, enemy) {
  const rifle = f.resources.rifle > 0 && f.heat < 72;
  const shots = rifle ? Math.min(3, f.resources.rifle) : f.resources.pistol > 0 ? 1 : 0;
  if (!shots) return;
  for (let i = 0; i < shots; i++) {
    if (rifle) f.resources.rifle--; else f.resources.pistol--;
    f.heat += rifle ? 13 : 8;
    const spread = rifle ? rand(-0.13, 0.13) : rand(-0.05, 0.05);
    const a = angleTo(f, enemy) + spread;
    const end = rayEnd(state, f, a, 800);
    state.effects.push({ type: 'tracer', x: f.x, y: f.y, x2: end.x, y2: end.y, ttl: EFFECT_TTL.tracer });
    if (dist(end, enemy) < 28 || clearLine(state.arena, f, enemy) && Math.abs(spread) < hitSpread(f, enemy)) hit(state, f, enemy, rifle ? rand(8, 14) : rand(12, 18), 'shot', a);
    else impact(state, end.x, end.y, 'ricochet');
  }
  f.rangedCd = rifle ? 0.55 : 0.75; f.cooldown = 0.16; f.pose = rifle ? 'burst' : 'pistol';
  addLog(state, `${f.name} fires ${rifle ? 'rifle burst' : 'pistol'}.`);
}

function hitSpread(f, enemy) { return (f.stats.aim / 100) * (enemy.dodge < 30 ? 0.2 : 0.11); }
function rayEnd(state, f, a, range) { for (let t = 22; t < range; t += 12) { const p = { x: f.x + Math.cos(a) * t, y: f.y + Math.sin(a) * t }; if (blocked(state.arena, p, 2)) return p; } return { x: f.x + Math.cos(a) * range, y: f.y + Math.sin(a) * range }; }
function throwProjectile(state, f, enemy, type, speed, damage, resource) { f.resources[resource]--; const a = angleTo(f, enemy) + rand(-0.08, 0.08); state.projectiles.push({ type, team: f.team, owner: f.name, x: f.x, y: f.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, damage, ttl: 2.2, stuck: false }); f.rangedCd = type === 'arrow' ? 1.15 : 0.75; f.cooldown = 0.25; f.pose = type; addLog(state, `${f.name} throws ${type}.`); }
function updateProjectiles(state, dt) { for (const p of state.projectiles) { if (p.type === 'grenade' || p.stuck) continue; p.ttl -= dt; p.x += p.vx * dt; p.y += p.vy * dt; if (blocked(state.arena, p, 4)) { p.stuck = true; p.vx = 0; p.vy = 0; impact(state, p.x, p.y, 'stick'); continue; } const target = state.fighters.find(f => f.team !== p.team && !f.incapacitated && !f.defeated && !f.extracted && dist(f, p) < 24); if (target) { hit(state, { name: p.owner, stats: { aim: 55 } }, target, p.damage, p.type, Math.atan2(p.vy, p.vx)); p.ttl = 0; } } state.projectiles = state.projectiles.filter(p => p.type === 'grenade' || p.ttl > 0 || p.stuck); }
function meleeReach(f) { if (f.melee === 'sword') return 70; if (f.melee === 'knife' || f.melee === 'arrow_stab') return 48; return 42; }
function melee(state, f, enemy, force = null) { const sword = f.melee === 'sword' || force === 'sword'; const stab = !sword && (f.melee === 'knife' || f.melee === 'arrow_stab'); const move = sword ? { id: choose(SWORD), limb: 'rightArm', kind: 'sword', reach: 70, damage: 18, stamina: 12, lean: -1 } : stab ? choose(STABS) : choose(MOVES); if (f.fight < move.stamina) return; f.fight -= move.stamina; f.stamina -= move.stamina * 0.4; f.meleeCd = move.kind === 'power' ? 1.0 : 0.38; f.cooldown = f.meleeCd; f.pose = move.id; f.currentMove = { ...move, ttl: 0.22 }; const defended = defend(state, f, enemy, move); state.effects.push({ type: defended, x: enemy.x, y: enemy.y, ttl: EFFECT_TTL[defended] || 0.2, move: move.id }); if (defended === 'hit') hit(state, f, enemy, move.damage + f.stats.cqc * 0.05, move.kind, angleTo(f, enemy), move); }
function disarm(state, f, enemy) { f.fight -= 16; f.cooldown = 0.75; f.pose = 'disarm_attempt'; f.memory.command = null; const success = chance((f.stats.cqc + f.stats.grapple + f.stats.counter) / 330) && enemy.block < 75; if (!success) { addLog(state, `${f.name} fails the disarm.`); if (chance(enemy.stats.counter / 220)) counter(state, enemy, f); return; } enemy.rangedCd = 2.2; enemy.heat = Math.max(enemy.heat, 65); enemy.pose = 'disarmed'; if (enemy.resources.rifle) enemy.resources.rifle = Math.floor(enemy.resources.rifle * 0.55); if (enemy.resources.pistol) enemy.resources.pistol = Math.floor(enemy.resources.pistol * 0.7); if (enemy.resources.arrows) enemy.resources.arrows = Math.max(0, enemy.resources.arrows - 3); if (enemy.resources.shuriken) enemy.resources.shuriken = Math.max(0, enemy.resources.shuriken - 2); state.effects.push({ type: 'block', x: enemy.x, y: enemy.y, ttl: 0.28, move: 'disarm' }); addLog(state, `${f.name} disarms ${enemy.name}.`); }
function defend(state, attacker, defender, move) { const dodgeChance = defender.dodge / 130 * (defender.stats.dodge / 100); if (defender.dodge > 18 && chance(dodgeChance)) { defender.dodge -= 22; defender.pose = 'dodge'; shove(defender, angleTo(attacker, defender), 18); return 'dodge'; } const blockLimb = move.kind === 'kick' ? move.limb === 'leftLeg' ? 'rightLeg' : 'leftLeg' : move.limb === 'leftArm' ? 'rightArm' : 'leftArm'; const limb = defender.limbs[blockLimb]; const blockChance = defender.block / 135 * (defender.stats.block / 100) * (limb.guard / 100); if (defender.block > 14 && limb.guard > 12 && chance(blockChance)) { defender.block -= 18; limb.guard -= 22 + move.damage * 0.65; limb.t = 0.18; defender.pose = `block_${blockLimb}`; if (attacker.stats.counter < defender.stats.counter && chance(defender.stats.counter / 310)) counter(state, defender, attacker); return 'block'; } return 'hit'; }
function counter(state, defender, attacker) { hit(state, defender, attacker, rand(8, 15), 'counter', angleTo(defender, attacker)); addLog(state, `${defender.name} counters.`); }
function grapple(state, f, enemy) { f.fight -= 22; f.cooldown = 1.1; enemy.pose = 'thrown'; f.pose = 'grapple'; const a = angleTo(f, enemy); shove(enemy, a, 78); hit(state, f, enemy, 9, 'throw', a); state.effects.push({ type: 'grapple', x: enemy.x, y: enemy.y, ttl: EFFECT_TTL.grapple }); addLog(state, `${f.name} grabs and throws ${enemy.name}.`); }
function smoke(state, f, enemy) { f.resources.smoke--; f.specialCd = 7; state.effects.push({ type: 'smoke', x: f.x, y: f.y, ttl: EFFECT_TTL.smoke }); const a = angleTo(enemy, f); f.x += Math.cos(a) * 135; f.y += Math.sin(a) * 135; addLog(state, `${f.name} vanishes through smoke.`); }
function bandage(state, f) { f.bandageCd = 10; f.cooldown = 1.4; if (!startBandage(state, f)) { f.pose = 'bandage'; recoverVitality(f, 8); addLog(state, `${f.name} patches up.`); } }
function hit(state, attacker, defender, amount, type, a, move = null) { const toughness = defender.stats?.toughness || 60; const final = Math.max(2, amount * (1.22 - toughness / 180)); defender.hp = clamp(defender.hp - final, 0, 100); updateVitalityCap(defender); defender.memory.lastHitBy = attacker.name; defender.pose = 'hit'; defender.hitLean = move?.lean || (Math.cos(a) > 0 ? 1 : -1); shove(defender, a, final * 1.2); impact(state, defender.x, defender.y, type); if (['shot', 'sword', 'knife', 'arrow_stab'].includes(type) && final > 7 && chance(0.22 + final / 80)) addBleed(state, defender, type === 'shot' ? 2.8 : type === 'sword' ? 2.2 : 1.7, type); if (canSuddenIncapacitate(attacker, defender, type, final)) return incapacitate(state, defender, attacker, type); if (defender.hp <= 0) defeat(state, defender, attacker); }
function shove(f, a, power) { f.x += Math.cos(a) * power; f.y += Math.sin(a) * power; }
function impact(state, x, y, kind) { state.effects.push({ type: 'impact', kind, x, y, ttl: EFFECT_TTL.impact }); }
function defeat(state, f, attacker) { f.defeated = true; f.hp = 1; f.pose = 'defeated_kneel'; f.finishT = 4; f.stamina = 0; f.fight = 0; addLog(state, `${f.name} drops to a knee. ${attacker.name || 'Opponent'} can decide the finish.`); }
function incapacitate(state, f, attacker, type = 'critical') { f.incapacitated = true; f.defeated = false; f.hp = 0; f.pose = 'down'; addLog(state, `${f.name} is suddenly incapacitated by ${attacker.name || type}.`); state.matchState = 'finished'; }
