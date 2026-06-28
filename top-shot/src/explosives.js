import { EFFECT_TTL } from './config.js';
import { blocked, slide } from './arena.js';
import { addLog } from './state.js';
import { angleTo, chance, clamp, dist } from './utils.js';
import { updateVitalityCap } from './vitality.js';

export function trySuperMove(state, f, enemy, visible) {
  if (!visible || f.archetypeId !== 'marine' || f.resources.grenades <= 0 || f.rangedCd > 0) return false;
  const d = dist(f, enemy);
  if (d < 140 || d > 420) return false;
  const commanded = f.memory.command?.type === 'grenade';
  if (!commanded && !chance(0.012 + (100 - enemy.hp) / 2500)) return false;
  f.resources.grenades--;
  f.rangedCd = 2.8;
  f.cooldown = 0.65;
  f.pose = 'grenade_throw';
  if (commanded) f.memory.command = null;
  const a = angleTo(f, enemy);
  const speed = 275;
  state.projectiles.push({ type: 'grenade', team: f.team, owner: f.name, x: f.x, y: f.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, fuse: 1.25, ttl: 1.35, blast: 118, damage: 82 });
  addLog(state, `${f.name} throws a grenade.`);
  return true;
}

export function updateExplosives(state, dt) {
  for (const f of state.fighters) updateDive(state, f, dt);
  for (const p of state.projectiles.filter(p => p.type === 'grenade')) {
    p.fuse -= dt;
    p.ttl -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (blocked(state.arena, p, 5)) { p.vx *= -0.28; p.vy *= -0.28; }
    for (const f of state.fighters) reactToGrenade(state, f, p);
    if (p.fuse <= 0) explode(state, p);
  }
  state.projectiles = state.projectiles.filter(p => p.type !== 'grenade' || p.ttl > 0);
}

function reactToGrenade(state, f, grenade) {
  if (f.incapacitated || f.extracted || f.extracting || f.diveT > 0 || f.team === grenade.team && dist(f, grenade) > 70) return;
  const d = dist(f, grenade);
  if (d > 155 || grenade.fuse > 0.95) return;
  const diveSkill = (f.stats.dodge + f.stats.stamina + f.stats.discipline) / 3;
  if (!chance(clamp(diveSkill / 115, 0.35, 0.94))) return;
  const away = angleTo(grenade, f);
  f.diveT = f.archetypeId === 'ninja' ? 0.7 : 0.48;
  f.diveVx = Math.cos(away) * (f.archetypeId === 'ninja' ? 250 : 190);
  f.diveVy = Math.sin(away) * (f.archetypeId === 'ninja' ? 250 : 190);
  f.pose = f.archetypeId === 'ninja' ? 'somersault_dive' : chance(0.5) ? 'dive_roll' : 'flat_dive';
  state.effects.push({ type: 'dive', x: f.x, y: f.y, ttl: EFFECT_TTL.dive });
  addLog(state, `${f.name} dives away from the grenade.`);
}

function updateDive(state, f, dt) {
  if (!f.diveT || f.diveT <= 0) return;
  f.diveT -= dt;
  const next = { x: f.x + f.diveVx * dt, y: f.y + f.diveVy * dt };
  const moved = slide(state.arena, f, next);
  f.x = moved.x;
  f.y = moved.y;
  f.stamina = clamp(f.stamina - dt * 16, 0, 100);
  if (f.diveT <= 0) { f.diveVx = 0; f.diveVy = 0; f.pose = 'recover_dive'; }
}

function explode(state, grenade) {
  grenade.ttl = 0;
  state.effects.push({ type: 'explosion', x: grenade.x, y: grenade.y, radius: grenade.blast, ttl: EFFECT_TTL.explosion });
  addLog(state, `Grenade detonates.`);
  for (const f of state.fighters) {
    if (f.incapacitated || f.extracted) continue;
    const d = dist(f, grenade);
    if (d > grenade.blast) continue;
    const coverCut = blocked(state.arena, { x: (f.x + grenade.x) / 2, y: (f.y + grenade.y) / 2 }, 3) ? 0.55 : 1;
    const dodgeCut = f.diveT > 0 ? 0.38 : 1;
    const damage = Math.max(4, grenade.damage * (1 - d / grenade.blast) * coverCut * dodgeCut);
    f.hp = clamp(f.hp - damage, 0, 100);
    updateVitalityCap(f);
    f.pose = f.diveT > 0 ? f.pose : 'blast_hit';
    if (f.hp <= 0 || d < 36 && dodgeCut > 0.5) { f.hp = 0; f.incapacitated = true; f.defeated = false; f.pose = 'down'; state.matchState = 'finished'; addLog(state, `${f.name} is suddenly incapacitated by the blast.`); }
  }
}
