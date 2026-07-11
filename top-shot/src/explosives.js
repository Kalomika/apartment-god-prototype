import { EFFECT_TTL } from './config.js';
import { blocked, slide } from './arena.js';
import { addLog } from './state.js';
import { angleTo, chance, clamp, dist, finiteOr } from './utils.js';
import { updateVitalityCap } from './vitality.js';

export function trySuperMove(state, f, enemy, visible) {
  if (!visible || !['marine', 'survival_commando'].includes(f.archetypeId) || f.resources.grenades <= 0 || f.rangedCd > 0) return false;
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
  state.projectiles.push({ type: 'grenade', team: f.team, owner: f.name, x: finiteOr(f.x, 0), y: finiteOr(f.y, 0), vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, fuse: 1.25, ttl: 1.35, blast: 118, damage: 82 });
  addLog(state, `${f.name} throws a grenade.`);
  return true;
}

export function updateExplosives(state, dt) {
  const safeDt = Math.max(0, finiteOr(dt, 0));
  for (const f of state.fighters) updateDive(state, f, safeDt);
  for (const p of state.projectiles.filter(p => p.type === 'grenade')) {
    p.fuse = finiteOr(p.fuse, 0) - safeDt;
    p.ttl = finiteOr(p.ttl, 0) - safeDt;
    p.vx = finiteOr(p.vx, 0);
    p.vy = finiteOr(p.vy, 0);
    p.x = finiteOr(p.x, 0) + p.vx * safeDt;
    p.y = finiteOr(p.y, 0) + p.vy * safeDt;
    p.blast = finiteOr(p.blast, 118);
    p.damage = finiteOr(p.damage, 82);
    if (blocked(state.arena, p, 5)) { p.vx *= -0.28; p.vy *= -0.28; }
    for (const f of state.fighters) reactToGrenade(state, f, p);
    if (p.fuse <= 0) explode(state, p);
  }
  state.projectiles = state.projectiles.filter(p => p.type !== 'grenade' || finiteOr(p.ttl, 0) > 0);
}

function reactToGrenade(state, f, grenade) {
  if (f.incapacitated || f.extracted || f.extracting || f.diveT > 0 || f.team === grenade.team && dist(f, grenade) > 70) return;
  const d = dist(f, grenade);
  if (d > 155 || grenade.fuse > 0.95) return;
  const diveSkill = (finiteOr(f.stats?.dodge, 50) + finiteOr(f.stats?.stamina, 50) + finiteOr(f.stats?.discipline, 50)) / 3;
  if (!chance(clamp(diveSkill / 115, 0.35, 0.94))) return;
  const away = angleTo(grenade, f);
  const agile = f.archetypeId === 'ninja' || f.archetypeId === 'shadow_ninja';
  f.diveT = agile ? 0.7 : 0.48;
  f.diveVx = Math.cos(away) * (agile ? 250 : 190);
  f.diveVy = Math.sin(away) * (agile ? 250 : 190);
  f.pose = agile ? 'somersault_dive' : chance(0.5) ? 'dive_roll' : 'flat_dive';
  state.effects.push({ type: 'dive', x: finiteOr(f.x, 0), y: finiteOr(f.y, 0), ttl: EFFECT_TTL.dive });
  addLog(state, `${f.name} dives away from the grenade.`);
}

function updateDive(state, f, dt) {
  if (!f.diveT || f.diveT <= 0) return;
  const safeDt = Math.max(0, finiteOr(dt, 0));
  f.diveT = Math.max(0, finiteOr(f.diveT, 0) - safeDt);
  const vx = finiteOr(f.diveVx, 0);
  const vy = finiteOr(f.diveVy, 0);
  const next = { x: finiteOr(f.x, 0) + vx * safeDt, y: finiteOr(f.y, 0) + vy * safeDt };
  const moved = slide(state.arena, f, next);
  f.x = finiteOr(moved.x, f.x);
  f.y = finiteOr(moved.y, f.y);
  f.diveVx = vx;
  f.diveVy = vy;
  f.stamina = clamp(f.stamina - safeDt * 16, 0, 100);
  if (f.diveT <= 0) { f.diveVx = 0; f.diveVy = 0; f.pose = 'recover_dive'; }
}

function explode(state, grenade) {
  grenade.ttl = 0;
  grenade.x = finiteOr(grenade.x, 0);
  grenade.y = finiteOr(grenade.y, 0);
  grenade.blast = finiteOr(grenade.blast, 118);
  grenade.damage = finiteOr(grenade.damage, 82);
  state.effects.push({ type: 'explosion', x: grenade.x, y: grenade.y, radius: grenade.blast, ttl: EFFECT_TTL.explosion });
  addLog(state, `Grenade detonates.`);
  for (const f of state.fighters) {
    if (f.incapacitated || f.extracted) continue;
    const d = dist(f, grenade);
    if (d > grenade.blast) continue;
    const coverCut = blocked(state.arena, { x: (finiteOr(f.x, 0) + grenade.x) / 2, y: (finiteOr(f.y, 0) + grenade.y) / 2 }, 3) ? 0.55 : 1;
    const dodgeCut = f.diveT > 0 ? 0.38 : 1;
    const damage = Math.max(4, grenade.damage * (1 - d / grenade.blast) * coverCut * dodgeCut);
    f.hp = clamp(f.hp - damage, 0, 100);
    updateVitalityCap(f);
    f.pose = f.diveT > 0 ? f.pose : 'blast_hit';
    if (f.hp <= 0 || d < 36 && dodgeCut > 0.5) { f.hp = 0; f.incapacitated = true; f.defeated = false; f.pose = 'down'; state.matchState = 'finished'; addLog(state, `${f.name} is suddenly incapacitated by the blast.`); }
  }
}
