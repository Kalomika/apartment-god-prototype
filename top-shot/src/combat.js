import { EFFECT_TTL } from './config.js';
import { blocked, coverPoint, nearCover } from './arena.js';
import { angleTo, chance, choose, clamp, dist, rand } from './utils.js';
import { addLog } from './state.js';
import { clearLine } from './perception.js';
import { canSuddenIncapacitate, recoverVitality, updateVitalityCap } from './vitality.js';
import { addBleed, startBandage } from './wounds.js';

const MOVES = [
  { id: 'left_jab', limb: 'leftArm', kind: 'punch', reach: 38, damage: 7, stamina: 5, lean: 1 },
  { id: 'right_cross', limb: 'rightArm', kind: 'punch', reach: 42, damage: 9, stamina: 7, lean: -1 },
  { id: 'left_elbow', limb: 'leftArm', kind: 'elbow', reach: 28, damage: 12, stamina: 9, lean: 1 },
  { id: 'right_elbow', limb: 'rightArm', kind: 'elbow', reach: 28, damage: 12, stamina: 9, lean: -1 },
  { id: 'left_knee', limb: 'leftLeg', kind: 'knee', reach: 30, damage: 13, stamina: 11, lean: 1 },
  { id: 'right_knee', limb: 'rightLeg', kind: 'knee', reach: 30, damage: 13, stamina: 11, lean: -1 },
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
    f.heat = Math.max(0, f.heat - dt * (f.hidden ? 24 : 12));
    f.stamina = clamp(f.stamina + dt * (f.hidden || f.wallLean ? 13 : 6), 0, 100);
    f.fight = clamp(f.fight + dt * 7, 0, 100);
    f.dodge = clamp(f.dodge + dt * (isSuppressed(state, f) ? 15 : 9), 0, 100);
    f.block = clamp(f.block + dt * (isSuppressed(state, f) ? 16 : 10), 0, 100);
    if (f.hidden && !f.bleed?.rate && f.hp > 0 && f.hp < (f.vitalityCap ?? 100)) recoverVitality(f, dt * (f.bandageCd > 0 ? 5.5 : 2.1));
    for (const limb of Object.values(f.limbs)) { limb.guard = clamp(limb.guard + dt * 10, 0, 100); limb.t = Math.max(0, limb.t - dt); }
  }
  updateProjectiles(state, dt);
}

export function tryAttack(state, f, enemy, visible) {
  if (f.cooldown > 0 || f.incapacitated || f.defeated || f.extracted || f.extracting || enemy.incapacitated || enemy.extracted || enemy.defeated) return;
  if (isSuppressed(state, f) && !f.wallLean && !f.shadowHidden && !f.prone && !f.crouch) return;
  const d = dist(f, enemy);
  if (f.bleed?.rate > 0 && (f.hidden || f.wallLean || f.hp < 35)) return bandage(state, f);
  if (f.hp < 45 && f.bandageCd <= 0 && f.hidden) return bandage(state, f);
  if ((f.archetypeId === 'ninja' || f.archetypeId === 'shadow_ninja') && f.specialCd <= 0 && f.resources.smoke > 0 && f.hp < 52) return smoke(state, f, enemy);
  if (f.memory.command?.type === 'disarm' && d < 54) return disarm(state, f, enemy);
  if (f.memory.command?.type === 'sword' && d < meleeReach(f) && f.melee === 'sword') return melee(state, f, enemy, 'sword');
  if (visible && shouldRanged(f, d)) return ranged(state, f, enemy);
  if (d < meleeReach(f)) return melee(state, f, enemy);
  if (d < 44 && f.stats.grapple > 55 && f.fight > 35 && chance(f.stats.grapple / 420)) return grapple(state, f, enemy);
}

function shouldRanged(f, d) { if (f.rangedCd > 0 || f.heat > 88) return false; if (['cqc', 'disarm', 'sword'].includes(f.memory.command?.type)) return false; if (f.memory.command?.type === 'projectile') return d > 60; if (['marine', 'suit_operative', 'survival_commando', 'field_agent'].includes(f.archetypeId)) return (f.resources.rifle > 0 || f.resources.pistol > 0) && d > (['suit_operative', 'field_agent'].includes(f.archetypeId) ? 75 : 95); if (['ninja', 'shadow_ninja'].includes(f.archetypeId)) return f.resources.shuriken > 0 && d > 92 && d < 430; if (f.archetypeId === 'archer') return f.resources.arrows > 0 && d > 80 && d < 520; if (f.archetypeId === 'martial_artist') return f.resources.debris > 0 && d > 100 && d < 310; return false; }
function ranged(state, f, enemy) { if (['marine', 'suit_operative', 'survival_commando', 'field_agent'].includes(f.archetypeId)) return fireGun(state, f, enemy); if (['ninja', 'shadow_ninja'].includes(f.archetypeId)) return throwProjectile(state, f, enemy, 'shuriken', 520, 9, 'shuriken'); if (f.archetypeId === 'archer') return throwProjectile(state, f, enemy, 'arrow', 420, 15, 'arrows'); return throwProjectile(state, f, enemy, 'debris', 360, 7, 'debris'); }
function fireGun(state, f, enemy) {
  const rifle = f.resources.rifle > 0 && f.heat < 72;
  const shots = rifle ? Math.min(3, f.resources.rifle) : f.resources.pistol > 0 ? 1 : 0;
  if (!shots) return;
  for (let i = 0; i < shots; i++) {
    if (rifle) f.resources.rifle--; else f.resources.pistol--;
    f.heat += rifle ? 13 : 8;
    const spread = rifle ? rand(-0.16, 0.16) : rand(-0.07, 0.07);
    const a = angleTo(f, enemy) + spread;
    const muzzle = { x: f.x + Math.cos(a) * 26, y: f.y + Math.sin(a) * 26 };
    const end = rayEnd(state, f, a, 800);
    state.effects.push({ type: 'tracer', x: muzzle.x, y: muzzle.y, x2: end.x, y2: end.y, ttl: EFFECT_TTL.tracer });
    state.effects.push({ type: 'muzzle_flash', x: muzzle.x, y: muzzle.y, angle: a, ttl: 0.09 });
    suppressTarget(state, enemy, f, end);
    if (dist(end, enemy) < 28 || clearLine(state.arena, f, enemy) && Math.abs(spread) < hitSpread(f, enemy)) {
      state.effects.push({ type: 'impact_flash', x: enemy.x, y: enemy.y, ttl: 0.1, kind: 'body' });
      hit(state, f, enemy, rifle ? rand(5, 9) : rand(7, 12), 'shot', a);
    } else {
      impact(state, end.x, end.y, 'ricochet');
      state.effects.push({ type: 'impact_flash', x: end.x, y: end.y, ttl: 0.1, kind: 'wall' });
    }
  }
  f.rangedCd = rifle ? 0.72 : 0.95;
  f.cooldown = 0.18;
  f.pose = rifle ? 'burst' : 'pistol';
  addLog(state, `${f.name} fires ${rifle ? 'rifle burst' : 'pistol'}.`);
}
function hitSpread(f, enemy) { return (f.stats.aim / 100) * (enemy.dodge < 30 ? 0.17 : 0.085); }
function rayEnd(state, f, a, range) { for (let t = 22; t < range; t += 12) { const p = { x: f.x + Math.cos(a) * t, y: f.y + Math.sin(a) * t }; if (blocked(state.arena, p, 2)) return p; } return { x: f.x + Math.cos(a) * range, y: f.y + Math.sin(a) * range }; }
function throwProjectile(state, f, enemy, type, speed, damage, resource) { f.resources[resource]--; const a = angleTo(f, enemy) + rand(-0.08, 0.08); state.projectiles.push({ type, team: f.team, owner: f.name, x: f.x, y: f.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, damage, ttl: 2.2, stuck: false }); f.rangedCd = type === 'arrow' ? 1.15 : 0.75; f.cooldown = 0.25; f.pose = type; addLog(state, `${f.name} throws ${type}.`); }
function updateProjectiles(state, dt) { for (const p of state.projectiles) { if (p.type === 'grenade' || p.stuck) continue; p.ttl -= dt; p.x += p.vx * dt; p.y += p.vy * dt; if (blocked(state.arena, p, 4)) { p.stuck = true; p.vx = 0; p.vy = 0; impact(state, p.x, p.y, 'stick'); continue; } const target = state.fighters.find(f => f.team !== p.team && !f.incapacitated && !f.defeated && !f.extracted && f.rollT <= 0 && dist(f, p) < 24); if (target) { hit(state, { name: p.owner, stats: { aim: 55 } }, target, p.damage * 0.72, p.type, Math.atan2(p.vy, p.vx)); p.ttl = 0; } } state.projectiles = state.projectiles.filter(p => p.type === 'grenade' || p.ttl > 0 || p.stuck); }
function meleeReach(f) { if (f.melee === 'sword') return 70; if (f.melee === 'knife' || f.melee === 'arrow_stab') return 48; return 46; }
function melee(state, f, enemy, force = null) { const sword = f.melee === 'sword' || force === 'sword'; const stab = !sword && (f.melee === 'knife' || f.melee === 'arrow_stab'); const move = sword ? { id: choose(SWORD), limb: 'rightArm', kind: 'sword', reach: 70, damage: 18, stamina: 12, lean: -1 } : stab ? choose(STABS) : chooseCqcMove(f, enemy); if (f.fight < move.stamina) return; f.fight -= move.stamina; f.stamina -= move.stamina * 0.4; f.meleeCd = move.kind === 'power' ? 1.0 : move.kind === 'knee' || move.kind === 'elbow' ? 0.46 : 0.38; f.cooldown = f.meleeCd; f.pose = move.id; f.currentMove = { ...move, ttl: 0.25 }; const defended = defend(state, f, enemy, move); state.effects.push({ type: defended, x: enemy.x, y: enemy.y, ttl: EFFECT_TTL[defended] || 0.2, move: move.id }); if (defended === 'hit') hit(state, f, enemy, move.damage + f.stats.cqc * 0.05, move.kind, angleTo(f, enemy), move); }
function chooseCqcMove(f, enemy) { const d = dist(f, enemy); const close = MOVES.filter(m => d < 34 ? ['punch', 'elbow', 'knee', 'headbutt'].includes(m.kind) : m.reach >= d - 4); const pool = close.length ? close : MOVES; if (f.archetypeId === 'martial_artist') return choose(pool); if (['ninja', 'shadow_ninja'].includes(f.archetypeId)) return choose(pool.filter(m => m.kind !== 'headbutt') || pool); return choose(pool.filter(m => !['knee','elbow'].includes(m.kind)) || pool); }
function disarm(state, f, enemy) { f.fight -= 16; f.cooldown = 0.75; f.pose = 'disarm_attempt'; f.memory.command = null; const success = chance((f.stats.cqc + f.stats.grapple + f.stats.counter) / 330) && enemy.block < 75; if (!success) { addLog(state, `${f.name} fails the disarm.`); if (chance(enemy.stats.counter / 220)) counter(state, enemy, f); return; } enemy.rangedCd = 2.2; enemy.heat = Math.max(enemy.heat, 65); enemy.pose = 'disarmed'; if (enemy.resources.rifle) enemy.resources.rifle = Math.floor(enemy.resources.rifle * 0.55); if (enemy.resources.pistol) enemy.resources.pistol = Math.floor(enemy.resources.pistol * 0.7); if (enemy.resources.arrows) enemy.resources.arrows = Math.max(0, enemy.resources.arrows - 3); if (enemy.resources.shuriken) enemy.resources.shuriken = Math.max(0, enemy.resources.shuriken - 2); state.effects.push({ type: 'block', x: enemy.x, y: enemy.y, ttl: 0.28, move: 'disarm' }); addLog(state, `${f.name} disarms ${enemy.name}.`); }
function defend(state, attacker, defender, move) {
  const side = attackSide(move);
  const normalLimb = normalDefenseLimb(move, side);
  const crossLimb = crossDefenseLimb(move, side);
  const normal = defender.limbs[normalLimb];
  const cross = defender.limbs[crossLimb];
  const pressure = clamp((defender.stats.block + defender.stats.dodge + defender.stats.counter) / 300, 0.2, 1.05);

  if (canSlip(move) && defender.dodge > 18 && chance(defender.dodge / 155 * defender.stats.dodge / 100)) {
    defender.dodge -= 18;
    defender.pose = `slip_${side}`;
    shove(defender, angleTo(attacker, defender) + (side === 'left' ? 0.45 : -0.45), 16);
    maybeCounter(state, defender, attacker, pressure * 0.45);
    return 'slip';
  }

  if (normal && defender.block > 16 && normal.guard > 16 && canParry(move) && chance(defender.stats.counter / 190 * pressure)) {
    defender.block -= 12;
    normal.guard -= 13 + move.damage * 0.35;
    normal.t = 0.16;
    defender.pose = `parry_${normalLimb}`;
    maybeCounter(state, defender, attacker, pressure * 0.75);
    return 'parry';
  }

  if (normal && defender.block > 14 && normal.guard > 12 && chance(defender.block / 135 * defender.stats.block / 100 * normal.guard / 100)) {
    defender.block -= 18;
    normal.guard -= 22 + move.damage * 0.65;
    normal.t = 0.2;
    defender.pose = `block_${normalLimb}`;
    maybeCounter(state, defender, attacker, pressure * 0.28);
    return 'block';
  }

  if (cross && defender.block > 28 && cross.guard > 24 && !['kick', 'knee', 'power'].includes(move.kind) && chance(defender.block / 185 * defender.stats.block / 100 * cross.guard / 100)) {
    defender.block -= 28;
    cross.guard -= 32 + move.damage * 0.7;
    cross.t = 0.22;
    defender.pose = `cross_block_${crossLimb}`;
    maybeCounter(state, defender, attacker, pressure * 0.4);
    return 'cross_block';
  }

  return 'hit';
}

function suppressTarget(state, target, shooter, end) {
  if (!target || target.incapacitated || target.defeated || target.extracted) return;
  target.suppressedUntil = Math.max(target.suppressedUntil || 0, state.clock + 1.45);
  target.dodge = clamp(target.dodge + 10, 0, 100);
  target.block = clamp(target.block + 12, 0, 100);
  const cover = nearCover(state.arena, target);
  const p = cover ? coverPoint(state.arena, cover, target, shooter, 38) : null;
  if (p) {
    target.memory.command = { type: 'roll_cover', x: p.x, y: p.y, urgent: true, until: state.clock + 1.75 };
    target.pose = 'combat_roll';
    target.crouch = true;
    target.prone = false;
    if (!target.lastSuppressionLog || target.lastSuppressionLog < state.clock - 2.5) {
      addLog(state, `${target.name} dives for cover under fire.`);
      target.lastSuppressionLog = state.clock;
    }
  } else {
    const a = angleTo(shooter, target);
    target.memory.command = { type: 'roll_cover', x: clamp(target.x + Math.cos(a) * 120, 70, 890), y: clamp(target.y + Math.sin(a) * 120, 70, 650), urgent: true, until: state.clock + 1.4 };
    target.pose = 'combat_roll';
  }
  state.effects.push({ type: 'suppression', x: target.x, y: target.y - 26, x2: end.x, y2: end.y, ttl: 0.28 });
}
function isSuppressed(state, f) { return Boolean(f.suppressedUntil && f.suppressedUntil > state.clock); }
function attackSide(move) { if (move.limb?.startsWith('left')) return 'left'; if (move.limb?.startsWith('right')) return 'right'; return move.lean >= 0 ? 'left' : 'right'; }
function normalDefenseLimb(move, side) { if (['kick', 'knee', 'power'].includes(move.kind)) return side === 'left' ? 'rightLeg' : 'leftLeg'; return side === 'left' ? 'rightArm' : 'leftArm'; }
function crossDefenseLimb(move, side) { return side === 'left' ? 'leftArm' : 'rightArm'; }
function canSlip(move) { return ['punch', 'elbow', 'headbutt', 'knife', 'arrow_stab'].includes(move.kind); }
function canParry(move) { return ['punch', 'elbow', 'knife', 'arrow_stab', 'sword'].includes(move.kind); }
function maybeCounter(state, defender, attacker, probability) { if (defender.cooldown > 0.18 || defender.fight < 12 || !chance(probability)) return; counter(state, defender, attacker); }
function counter(state, defender, attacker) { const move = { id: 'right_cross', limb: 'rightArm', kind: 'counter', reach: 42, damage: 10, stamina: 0, lean: -1, ttl: 0.18 }; defender.fight = clamp(defender.fight - 10, 0, 100); defender.pose = move.id; defender.currentMove = move; hit(state, defender, attacker, rand(8, 15), 'counter', angleTo(defender, attacker), move); addLog(state, `${defender.name} counters.`); }
function grapple(state, f, enemy) { f.fight -= 22; f.cooldown = 1.1; enemy.pose = 'thrown'; f.pose = 'grapple'; const a = angleTo(f, enemy); shove(enemy, a, 78); hit(state, f, enemy, 9, 'throw', a); state.effects.push({ type: 'grapple', x: enemy.x, y: enemy.y, ttl: EFFECT_TTL.grapple }); addLog(state, `${f.name} grabs and throws ${enemy.name}.`); }
function smoke(state, f, enemy) { f.resources.smoke--; f.specialCd = 7; state.effects.push({ type: 'smoke', x: f.x, y: f.y, ttl: EFFECT_TTL.smoke }); const a = angleTo(enemy, f); f.x += Math.cos(a) * 135; f.y += Math.sin(a) * 135; addLog(state, `${f.name} vanishes through smoke.`); }
function bandage(state, f) { f.bandageCd = 10; f.cooldown = 1.4; if (!startBandage(state, f)) { f.pose = 'bandage'; recoverVitality(f, 8); addLog(state, `${f.name} patches up.`); } }
function hit(state, attacker, defender, amount, type, a, move = null) { const toughness = defender.stats?.toughness || 60; const defense = defender.wallLean || defender.shadowHidden || defender.crouch || defender.prone ? 0.62 : isSuppressed(state, defender) ? 0.78 : 1; const final = Math.max(1.1, amount * (1.04 - toughness / 240) * defense); defender.hp = clamp(defender.hp - final, 0, 100); updateVitalityCap(defender); defender.memory.lastHitBy = attacker.name; defender.pose = 'hit'; defender.hitLean = move?.lean || (Math.cos(a) > 0 ? 1 : -1); shove(defender, a, final * 0.72); impact(state, defender.x, defender.y, type); suppressTarget(state, defender, attacker, defender); if (['shot', 'sword', 'knife', 'arrow_stab'].includes(type) && final > 8 && chance(0.12 + final / 110)) addBleed(state, defender, type === 'shot' ? 1.4 : type === 'sword' ? 1.8 : 1.2, type); if (canSuddenIncapacitate(attacker, defender, type, final)) return incapacitate(state, defender, attacker, type); if (defender.hp <= 0) defeat(state, defender, attacker); }
function shove(f, a, power) { f.x += Math.cos(a) * power; f.y += Math.sin(a) * power; }
function impact(state, x, y, kind) { state.effects.push({ type: 'impact', kind, x, y, ttl: EFFECT_TTL.impact }); }
function defeat(state, f, attacker) { f.defeated = true; f.hp = 1; f.pose = 'defeated_kneel'; f.finishT = 4; f.stamina = 0; f.fight = 0; addLog(state, `${f.name} drops to a knee. ${attacker.name || 'Opponent'} can decide the finish.`); }
function incapacitate(state, f, attacker, type = 'critical') { f.incapacitated = true; f.defeated = false; f.hp = 0; f.pose = 'down'; addLog(state, `${f.name} is suddenly incapacitated by ${attacker.name || type}.`); state.matchState = 'finished'; }
