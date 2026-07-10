import { EFFECT_TTL } from './config.js';
import { blocked, climbableNear, coverPoint, nearCover, solidAt, topPoint } from './arena.js';
import { angleTo, chance, choose, clamp, dist, finiteOr, rand } from './utils.js';
import { addLog } from './state.js';
import { clearLine } from './perception.js';
import { canSuddenIncapacitate, recoverVitality, updateVitalityCap } from './vitality.js';
import { addBleed, startBandage } from './wounds.js';

const MOVES = [
  { id: 'left_jab', limb: 'leftArm', kind: 'punch', reach: 42, damage: 7, stamina: 5, lean: 1 },
  { id: 'right_cross', limb: 'rightArm', kind: 'punch', reach: 46, damage: 9, stamina: 7, lean: -1 },
  { id: 'left_elbow', limb: 'leftArm', kind: 'elbow', reach: 30, damage: 12, stamina: 9, lean: 1 },
  { id: 'right_elbow', limb: 'rightArm', kind: 'elbow', reach: 30, damage: 12, stamina: 9, lean: -1 },
  { id: 'left_knee', limb: 'leftLeg', kind: 'knee', reach: 32, damage: 13, stamina: 11, lean: 1 },
  { id: 'right_knee', limb: 'rightLeg', kind: 'knee', reach: 32, damage: 13, stamina: 11, lean: -1 },
  { id: 'left_kick', limb: 'leftLeg', kind: 'kick', reach: 60, damage: 11, stamina: 9, lean: 1 },
  { id: 'right_kick', limb: 'rightLeg', kind: 'kick', reach: 60, damage: 11, stamina: 9, lean: -1 },
  { id: 'roundhouse', limb: 'rightLeg', kind: 'power', reach: 66, damage: 17, stamina: 18, lean: -1 },
  { id: 'headbutt', limb: 'head', kind: 'headbutt', reach: 28, damage: 10, stamina: 12, lean: 0 }
];
const SWORD = ['short_slash', 'wide_slash', 'reverse_slash', 'thrust_slash'];
const STABS = [
  { id: 'knife_jab', limb: 'rightArm', kind: 'knife', reach: 50, damage: 13, stamina: 8, lean: -1 },
  { id: 'low_knife_cut', limb: 'leftArm', kind: 'knife', reach: 45, damage: 10, stamina: 7, lean: 1 },
  { id: 'arrow_stab', limb: 'rightArm', kind: 'arrow_stab', reach: 48, damage: 11, stamina: 8, lean: -1 }
];

export function updateCombat(state, dt) {
  const safeDt = Math.max(0, finiteOr(dt, 0));
  state.projectiles = Array.isArray(state.projectiles) ? state.projectiles : [];
  state.effects = Array.isArray(state.effects) ? state.effects : [];
  for (const f of state.fighters || []) {
    if (!active(f)) continue;
    f.resources ||= {};
    f.stats ||= {};
    f.limbs ||= {};
    f.cooldown = Math.max(0, finiteOr(f.cooldown, 0) - safeDt);
    f.rangedCd = Math.max(0, finiteOr(f.rangedCd, 0) - safeDt);
    f.meleeCd = Math.max(0, finiteOr(f.meleeCd, 0) - safeDt);
    f.specialCd = Math.max(0, finiteOr(f.specialCd, 0) - safeDt);
    f.bandageCd = Math.max(0, finiteOr(f.bandageCd, 0) - safeDt);
    f.peekCooldown = Math.max(0, finiteOr(f.peekCooldown, 0) - safeDt);
    f.heat = Math.max(0, finiteOr(f.heat, 0) - safeDt * (f.hidden || f.coverPinned ? 25 : 13));
    f.stamina = clamp(finiteOr(f.stamina, 100) + safeDt * (f.hidden || f.wallLean || f.coverPinned ? 14 : 5), 0, 100);
    f.fight = clamp(finiteOr(f.fight, 100) + safeDt * 6, 0, 100);
    f.dodge = clamp(finiteOr(f.dodge, 100) + safeDt * (isSuppressed(state, f) ? 18 : 8), 0, 100);
    f.block = clamp(finiteOr(f.block, 100) + safeDt * (isSuppressed(state, f) ? 18 : 9), 0, 100);
    if (f.hidden && !f.bleed?.rate && f.hp > 0 && f.hp < (f.vitalityCap ?? 100)) recoverVitality(f, safeDt * (f.bandageCd > 0 ? 5.5 : 2.1));
    for (const limb of Object.values(f.limbs)) {
      limb.guard = clamp(finiteOr(limb.guard, 100) + safeDt * 10, 0, 100);
      limb.t = Math.max(0, finiteOr(limb.t, 0) - safeDt);
    }
  }
  updateProjectiles(state, safeDt);
}

export function tryAttack(state, f, enemy, visible) {
  if (!active(f) || !active(enemy) || finiteOr(f.cooldown, 0) > 0) return;
  f.resources ||= {};
  f.stats ||= {};
  f.memory ||= {};
  const d = dist(f, enemy);
  if (!Number.isFinite(d)) return;
  if ((f.archetypeId === 'ninja' || f.archetypeId === 'shadow_ninja') && f.specialCd <= 0 && finiteOr(f.resources.smoke, 0) > 0 && (isSuppressed(state, f) || visible && d > 92 || f.hp < 70)) return smoke(state, f, enemy);
  if (isSuppressed(state, f) && !f.coverPinned && !f.shadowHidden) return;
  if (f.bleed?.rate > 0 && (f.hidden || f.wallLean || f.coverPinned || f.hp < 50)) return bandage(state, f);
  if (f.hp < 45 && f.bandageCd <= 0 && (f.hidden || f.coverPinned)) return bandage(state, f);
  if (f.memory.command?.type === 'disarm' && d < 54) return disarm(state, f, enemy);
  if (f.memory.command?.type === 'sword' && d < meleeReach(f) && f.melee === 'sword') return melee(state, f, enemy, 'sword');
  if (visible && shouldRanged(f, d)) return ranged(state, f, enemy);
  if (d < meleeReach(f)) return melee(state, f, enemy);
  if (d < 44 && finiteOr(f.stats.grapple, 0) > 55 && f.fight > 35 && chance(f.stats.grapple / 420)) return grapple(state, f, enemy);
}

function shouldRanged(f, d) {
  f.resources ||= {};
  if (f.rangedCd > 0 || f.heat > 88) return false;
  if (['cqc', 'disarm', 'sword'].includes(f.memory?.command?.type)) return false;
  if (f.memory?.command?.type === 'projectile') return d > 60;
  if (['marine', 'suit_operative', 'survival_commando', 'field_agent'].includes(f.archetypeId)) return (f.resources.rifle > 0 || f.resources.pistol > 0) && d > (['suit_operative', 'field_agent'].includes(f.archetypeId) ? 75 : 95) && (f.coverPinned || f.wallLean || f.memory?.command?.type === 'ranged');
  if (['ninja', 'shadow_ninja'].includes(f.archetypeId)) return f.resources.shuriken > 0 && d > 92 && d < 430 && (f.shadowHidden || f.coverPinned || f.memory?.command?.type === 'projectile');
  if (f.archetypeId === 'archer') return f.resources.arrows > 0 && d > 80 && d < 520 && (f.shadowHidden || f.coverPinned || f.onObject || f.memory?.command?.type === 'projectile');
  if (f.archetypeId === 'martial_artist') return f.resources.debris > 0 && d > 100 && d < 310;
  return false;
}
function ranged(state, f, enemy) { if (['marine', 'suit_operative', 'survival_commando', 'field_agent'].includes(f.archetypeId)) return fireGun(state, f, enemy); if (['ninja', 'shadow_ninja'].includes(f.archetypeId)) return throwProjectile(state, f, enemy, 'shuriken', 520, 9, 'shuriken'); if (f.archetypeId === 'archer') return throwProjectile(state, f, enemy, 'arrow', 420, 15, 'arrows'); return throwProjectile(state, f, enemy, 'debris', 360, 7, 'debris'); }

function fireGun(state, f, enemy) {
  const rifle = finiteOr(f.resources.rifle, 0) > 0 && f.heat < 72;
  const shots = rifle ? Math.min(f.coverPinned ? 2 : 1, f.resources.rifle) : finiteOr(f.resources.pistol, 0) > 0 ? 1 : 0;
  if (!shots) return;
  f.peekT = 0.32;
  f.peekCooldown = rifle ? 0.48 : 0.62;
  for (let i = 0; i < shots; i++) {
    if (rifle) f.resources.rifle--; else f.resources.pistol--;
    f.heat += rifle ? 15 : 9;
    const spread = rifle ? rand(-0.12, 0.12) : rand(-0.06, 0.06);
    const a = angleTo(f, enemy) + spread;
    const muzzle = { x: f.x + Math.cos(a) * 26, y: f.y + Math.sin(a) * 26 };
    const end = rayEnd(state, f, a, 800);
    state.effects.push({ type: 'tracer', x: muzzle.x, y: muzzle.y, x2: end.x, y2: end.y, ttl: EFFECT_TTL.tracer });
    state.effects.push({ type: 'muzzle_flash', x: muzzle.x, y: muzzle.y, angle: a, ttl: 0.09 });
    suppressTarget(state, enemy, f, end);
    if (dist(end, enemy) < 28 || clearLine(state.arena, f, enemy) && Math.abs(spread) < hitSpread(f, enemy)) hit(state, f, enemy, rifle ? rand(5, 9) : rand(7, 12), 'shot', a);
    else bulletSurfaceImpact(state, end, a);
  }
  f.rangedCd = rifle ? 1.1 : 1.35;
  f.cooldown = 0.28;
  f.pose = f.coverPinned ? 'cover_peek_fire' : rifle ? 'burst' : 'pistol';
  addLog(state, `${f.name} peeks and fires ${rifle ? 'controlled rifle shots' : 'pistol'} from cover.`);
}
function hitSpread(f, enemy) { return (finiteOr(f.stats?.aim, 55) / 100) * (finiteOr(enemy.dodge, 100) < 30 ? 0.17 : 0.085); }
function rayEnd(state, f, a, range) { for (let t = 22; t < range; t += 12) { const p = { x: f.x + Math.cos(a) * t, y: f.y + Math.sin(a) * t }; if (blocked(state.arena, p, 2)) return p; } return { x: f.x + Math.cos(a) * range, y: f.y + Math.sin(a) * range }; }
function bulletSurfaceImpact(state, end, angle) { const surface = solidAt(state.arena, end, 4); const material = surface?.material || 'concrete'; state.effects.push({ type: material === 'metal' ? 'spark' : 'shrapnel', x: end.x, y: end.y, angle, ttl: 0.22, material }); state.effects.push({ type: 'impact_flash', x: end.x, y: end.y, ttl: 0.08, kind: 'bullet' }); impact(state, end.x, end.y, material === 'metal' ? 'spark' : 'chip'); }
function throwProjectile(state, f, enemy, type, speed, damage, resource) { if (finiteOr(f.resources[resource], 0) <= 0) return; f.resources[resource]--; const a = angleTo(f, enemy) + rand(-0.08, 0.08); state.projectiles.push({ type, team: f.team, owner: f.name, x: f.x, y: f.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, damage, ttl: 2.2, stuck: false }); f.rangedCd = type === 'arrow' ? 1.35 : 0.95; f.cooldown = 0.28; f.peekT = 0.2; f.pose = f.coverPinned ? 'cover_peek_fire' : type; addLog(state, `${f.name} launches ${type}.`); }

function updateProjectiles(state, dt) {
  for (const p of state.projectiles) {
    if (p.type === 'grenade' || p.stuck) continue;
    p.ttl = finiteOr(p.ttl, 0) - dt;
    p.vx = finiteOr(p.vx, 0);
    p.vy = finiteOr(p.vy, 0);
    p.x = finiteOr(p.x, 0) + p.vx * dt;
    p.y = finiteOr(p.y, 0) + p.vy * dt;
    const surface = solidAt(state.arena, p, 4);
    if (surface) { projectileSurfaceImpact(state, p, surface); continue; }
    const target = state.fighters.find(f => active(f) && f.team !== p.team && (f.rollT || 0) <= 0 && dist(f, p) < 24);
    if (target) { hit(state, { name: p.owner, stats: { aim: 55 } }, target, finiteOr(p.damage, 1) * 0.72, p.type, Math.atan2(p.vy, p.vx)); p.ttl = 0; }
  }
  state.projectiles = state.projectiles.filter(p => p.type === 'grenade' || p.ttl > 0 || p.stuck);
}
function projectileSurfaceImpact(state, p, surface) {
  const material = surface.material || 'concrete';
  const angle = Math.atan2(finiteOr(p.vy, 0), finiteOr(p.vx, 0));
  if (p.type === 'arrow' && material !== 'metal') { p.stuck = true; p.vx = 0; p.vy = 0; state.effects.push({ type: 'lodged_arrow', x: p.x, y: p.y, angle, ttl: 5, material }); impact(state, p.x, p.y, 'lodged_arrow'); return; }
  if ((p.type === 'arrow' || p.type === 'shuriken') && material === 'metal') { p.vx *= -0.35; p.vy *= -0.35; p.ttl = Math.min(finiteOr(p.ttl, 0), 0.45); state.effects.push({ type: 'spark', x: p.x, y: p.y, angle, ttl: 0.24, material }); impact(state, p.x, p.y, 'bounce'); return; }
  if (['shuriken', 'debris'].includes(p.type) && material !== 'metal') { p.stuck = true; p.vx = 0; p.vy = 0; state.effects.push({ type: 'shrapnel', x: p.x, y: p.y, angle, ttl: 0.28, material }); return; }
  p.ttl = 0; state.effects.push({ type: 'shrapnel', x: p.x, y: p.y, angle, ttl: 0.22, material });
}

function meleeReach(f) { if (f.melee === 'sword') return 70; if (f.melee === 'knife' || f.melee === 'arrow_stab') return 48; return 52; }
function melee(state, f, enemy, force = null) {
  const sword = f.melee === 'sword' || force === 'sword';
  const stab = !sword && (f.melee === 'knife' || f.melee === 'arrow_stab');
  const move = sword ? { id: choose(SWORD) || 'short_slash', limb: 'rightArm', kind: 'sword', reach: 70, damage: 18, stamina: 12, lean: -1 } : stab ? choose(STABS) || STABS[0] : chooseCqcMove(f, enemy);
  if (!move || f.fight < move.stamina) return;
  f.fight -= move.stamina;
  f.stamina = clamp(f.stamina - move.stamina * 0.4, 0, 100);
  f.meleeCd = move.kind === 'power' ? 1.0 : move.kind === 'knee' || move.kind === 'elbow' ? 0.52 : 0.42;
  f.cooldown = f.meleeCd;
  f.pose = move.id;
  f.currentMove = { ...move, ttl: 0.38, started: state.clock };
  const defended = defend(state, f, enemy, move);
  if (defended === 'hit') hit(state, f, enemy, move.damage + finiteOr(f.stats.cqc, 50) * 0.05, move.kind, angleTo(f, enemy), move);
  else state.effects.push({ type: defended, x: enemy.x, y: enemy.y, ttl: EFFECT_TTL[defended] || 0.2, move: move.id });
}
function chooseCqcMove(f, enemy) { const d = dist(f, enemy); const close = MOVES.filter(m => d < 34 ? ['punch', 'elbow', 'knee', 'headbutt'].includes(m.kind) : m.reach >= d - 4); const pool = close.length ? close : MOVES; if (f.archetypeId === 'martial_artist') return choose(pool) || MOVES[0]; if (['ninja', 'shadow_ninja'].includes(f.archetypeId)) { const ninjaPool = pool.filter(m => m.kind !== 'headbutt'); return choose(ninjaPool.length ? ninjaPool : pool) || MOVES[0]; } const standardPool = pool.filter(m => !['knee','elbow'].includes(m.kind)); return choose(standardPool.length ? standardPool : pool) || MOVES[0]; }
function disarm(state, f, enemy) { f.fight -= 16; f.cooldown = 0.75; f.pose = 'disarm_attempt'; f.memory.command = null; const success = chance((finiteOr(f.stats.cqc, 50) + finiteOr(f.stats.grapple, 50) + finiteOr(f.stats.counter, 50)) / 330) && enemy.block < 75; if (!success) { addLog(state, `${f.name} fails the disarm.`); if (chance(finiteOr(enemy.stats?.counter, 50) / 220)) counter(state, enemy, f); return; } enemy.rangedCd = 2.2; enemy.heat = Math.max(enemy.heat, 65); enemy.pose = 'disarmed'; if (enemy.resources.rifle) enemy.resources.rifle = Math.floor(enemy.resources.rifle * 0.55); if (enemy.resources.pistol) enemy.resources.pistol = Math.floor(enemy.resources.pistol * 0.7); if (enemy.resources.arrows) enemy.resources.arrows = Math.max(0, enemy.resources.arrows - 3); if (enemy.resources.shuriken) enemy.resources.shuriken = Math.max(0, enemy.resources.shuriken - 2); state.effects.push({ type: 'block', x: enemy.x, y: enemy.y, ttl: 0.28, move: 'disarm' }); addLog(state, `${f.name} disarms ${enemy.name}.`); }
function defend(state, attacker, defender, move) { const limbs = defender.limbs || {}; const side = attackSide(move); const normalLimb = normalDefenseLimb(move, side); const crossLimb = crossDefenseLimb(move, side); const normal = limbs[normalLimb]; const cross = limbs[crossLimb]; const pressure = clamp((finiteOr(defender.stats?.block, 50) + finiteOr(defender.stats?.dodge, 50) + finiteOr(defender.stats?.counter, 50)) / 300, 0.2, 1.05); if (canSlip(move) && defender.dodge > 18 && chance(defender.dodge / 155 * finiteOr(defender.stats?.dodge, 50) / 100)) { defender.dodge -= 18; defender.pose = `slip_${side}`; shove(defender, angleTo(attacker, defender) + (side === 'left' ? 0.45 : -0.45), 16); maybeCounter(state, defender, attacker, pressure * 0.45); return 'slip'; } if (normal && defender.block > 16 && normal.guard > 16 && canParry(move) && chance(finiteOr(defender.stats?.counter, 50) / 190 * pressure)) { defender.block -= 12; normal.guard -= 13 + move.damage * 0.35; normal.t = 0.16; defender.pose = `parry_${normalLimb}`; maybeCounter(state, defender, attacker, pressure * 0.75); return 'parry'; } if (normal && defender.block > 14 && normal.guard > 12 && chance(defender.block / 135 * finiteOr(defender.stats?.block, 50) / 100 * normal.guard / 100)) { defender.block -= 18; normal.guard -= 22 + move.damage * 0.65; normal.t = 0.2; defender.pose = `block_${normalLimb}`; maybeCounter(state, defender, attacker, pressure * 0.28); return 'block'; } if (cross && defender.block > 28 && cross.guard > 24 && !['kick', 'knee', 'power'].includes(move.kind) && chance(defender.block / 185 * finiteOr(defender.stats?.block, 50) / 100 * cross.guard / 100)) { defender.block -= 28; cross.guard -= 32 + move.damage * 0.7; cross.t = 0.22; defender.pose = `cross_block_${crossLimb}`; maybeCounter(state, defender, attacker, pressure * 0.4); return 'cross_block'; } return 'hit'; }

function suppressTarget(state, target, shooter, end) {
  if (!active(target)) return;
  target.memory ||= {};
  target.suppressedUntil = Math.max(target.suppressedUntil || 0, state.clock + 2.8);
  target.dodge = clamp(target.dodge + 18, 0, 100);
  target.block = clamp(target.block + 15, 0, 100);
  const cover = nearCover(state.arena, target);
  let p = cover ? coverPoint(state.arena, cover, target, shooter, 28) : null;
  const climbable = climbableNear(state.arena, target, 80);
  if (!p && climbable) p = topPoint(climbable, target);
  if (!p) { const a = angleTo(shooter, target); p = { x: clamp(target.x + Math.cos(a) * 185, 70, 890), y: clamp(target.y + Math.sin(a) * 185, 70, 650) }; }
  target.memory.command = { type: 'roll_cover', x: p.x, y: p.y, urgent: true, until: state.clock + 2.6 };
  target.memory.navTarget = null;
  target.diveT = Math.max(target.diveT || 0, 0.55);
  target.rollT = Math.max(target.rollT || 0, 0.65);
  target.pose = target.onObject ? 'jump_down_escape' : 'combat_dive';
  target.crouch = true;
  target.prone = false;
  if (!target.lastSuppressionLog || target.lastSuppressionLog < state.clock - 1.6) { addLog(state, `${target.name} dives for cover under fire.`); target.lastSuppressionLog = state.clock; }
  state.effects.push({ type: 'suppression', x: target.x, y: target.y - 26, x2: end.x, y2: end.y, ttl: 0.28 });
}
function isSuppressed(state, f) { return Boolean(f.suppressedUntil && f.suppressedUntil > state.clock); }
function attackSide(move) { if (move.limb?.startsWith('left')) return 'left'; if (move.limb?.startsWith('right')) return 'right'; return move.lean >= 0 ? 'left' : 'right'; }
function normalDefenseLimb(move, side) { if (['kick', 'knee', 'power'].includes(move.kind)) return side === 'left' ? 'rightLeg' : 'leftLeg'; return side === 'left' ? 'rightArm' : 'leftArm'; }
function crossDefenseLimb(move, side) { return side === 'left' ? 'leftArm' : 'rightArm'; }
function canSlip(move) { return ['punch', 'elbow', 'headbutt', 'knife', 'arrow_stab'].includes(move.kind); }
function canParry(move) { return ['punch', 'elbow', 'knife', 'arrow_stab', 'sword'].includes(move.kind); }
function maybeCounter(state, defender, attacker, probability) { if (!active(defender) || !active(attacker) || defender.cooldown > 0.18 || defender.fight < 12 || !chance(probability)) return; counter(state, defender, attacker); }
function counter(state, defender, attacker) { const move = { id: 'right_cross', limb: 'rightArm', kind: 'counter', reach: 42, damage: 10, stamina: 0, lean: -1, ttl: 0.18 }; defender.fight = clamp(defender.fight - 10, 0, 100); defender.pose = move.id; defender.currentMove = move; hit(state, defender, attacker, rand(8, 15), 'counter', angleTo(defender, attacker), move); addLog(state, `${defender.name} counters.`); }
function grapple(state, f, enemy) { f.fight -= 22; f.cooldown = 1.1; enemy.pose = 'thrown'; f.pose = 'grapple'; const a = angleTo(f, enemy); shove(enemy, a, 78); hit(state, f, enemy, 9, 'throw', a); state.effects.push({ type: 'grapple', x: enemy.x, y: enemy.y, ttl: EFFECT_TTL.grapple }); addLog(state, `${f.name} grabs and throws ${enemy.name}.`); }
function smoke(state, f, enemy) { f.resources.smoke = Math.max(0, finiteOr(f.resources.smoke, 0) - 1); f.specialCd = 7; state.effects.push({ type: 'smoke', x: f.x, y: f.y, ttl: EFFECT_TTL.smoke }); const a = angleTo(enemy, f); f.x += Math.cos(a) * 135; f.y += Math.sin(a) * 135; f.shadowHidden = true; f.crouch = true; f.memory.command = { type: 'investigate', x: f.x, y: f.y, urgent: true, until: state.clock + 1.7 }; addLog(state, `${f.name} drops smoke and disappears toward cover.`); }
function bandage(state, f) { f.bandageCd = 10; f.cooldown = 1.4; if (!startBandage(state, f)) { f.pose = 'bandage'; recoverVitality(f, 8); addLog(state, `${f.name} patches up.`); } }
function hit(state, attacker, defender, amount, type, a, move = null) { if (!active(defender)) return; const attackAngle = finiteOr(a, angleTo(attacker, defender)); const finalAmount = Math.max(0, finiteOr(amount, 0)); const armor = type === 'shot' && ['survival_commando', 'marine'].includes(defender.archetypeId) && chance(0.22); const toughness = finiteOr(defender.stats?.toughness, 60); const defense = defender.wallLean || defender.shadowHidden || defender.crouch || defender.prone ? 0.62 : isSuppressed(state, defender) ? 0.78 : 1; const final = Math.max(1.1, finalAmount * (1.04 - toughness / 240) * defense * (armor ? 0.42 : 1)); defender.hp = clamp(defender.hp - final, 0, 100); updateVitalityCap(defender); defender.memory ||= {}; defender.memory.lastHitBy = attacker.name; defender.pose = armor ? 'armor_hit_react' : type === 'shot' ? 'shot_react' : 'hit'; defender.hitLean = move?.lean || (Math.cos(attackAngle) > 0 ? 1 : -1); defender.woundT = Math.max(defender.woundT || 0, type === 'shot' ? 0.9 : 0.55); shove(defender, attackAngle, final * 0.34); if (armor) state.effects.push({ type: 'spark', x: defender.x, y: defender.y, angle: attackAngle, ttl: 0.2, material: 'armor' }); else if (['shot', 'sword', 'knife', 'arrow_stab', 'arrow', 'shuriken'].includes(type)) state.effects.push({ type: 'blood_spray', x: defender.x, y: defender.y, angle: attackAngle, ttl: 0.32, source: type }); suppressTarget(state, defender, attacker, defender); if (!armor && ['shot', 'sword', 'knife', 'arrow_stab', 'arrow', 'shuriken'].includes(type) && final > 5 && chance(type === 'shot' ? 0.42 + final / 85 : 0.16 + final / 120)) addBleed(state, defender, type === 'shot' ? 1.9 : type === 'sword' ? 1.8 : 1.15, type); if (canSuddenIncapacitate(attacker, defender, type, final)) return incapacitate(state, defender, attacker, type); if (defender.hp <= 0) defeat(state, defender, attacker); }
function shove(f, a, power) { const safeA = finiteOr(a, 0); const safePower = finiteOr(power, 0); f.x = finiteOr(f.x, 0) + Math.cos(safeA) * safePower; f.y = finiteOr(f.y, 0) + Math.sin(safeA) * safePower; }
function impact(state, x, y, kind) { state.effects.push({ type: 'impact', kind, x, y, ttl: EFFECT_TTL.impact }); }
function defeat(state, f, attacker) { f.defeated = true; f.incapacitated = false; f.hp = 1; f.pose = 'defeated_kneel'; f.finishT = 4; f.stamina = 0; f.fight = 0; state.cinematic = { phase: 'outro', t: 0, winner: attacker?.id || attacker?.name || 'opponent', loser: f.id, label: 'finish decision' }; addLog(state, `${f.name} drops to a knee. ${attacker?.name || 'Opponent'} can decide the finish.`); }
function incapacitate(state, f, attacker, type = 'critical') { f.incapacitated = true; f.defeated = false; f.hp = 0; f.pose = 'down'; state.cinematic = { phase: 'outro', t: 0, winner: attacker?.id || attacker?.name || 'opponent', loser: f.id, label: `${type} incapacitation` }; addLog(state, `${f.name} is suddenly incapacitated by ${attacker?.name || type}.`); state.matchState = 'finished'; }
function active(f) { return Boolean(f && !f.incapacitated && !f.defeated && !f.extracted && !f.extracting); }
