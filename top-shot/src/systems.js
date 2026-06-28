import { COACH_DROPS } from './config.js';
import { clamp, dist } from './utils.js';
import { addLog, opponentOf } from './state.js';
import { canHear, canSee, chooseDestination, moveFighter } from './perception.js';
import { tryAttack, updateCombat } from './combat.js';

export function updateBattle(state, dt) {
  if (state.paused || state.matchState === 'finished') return;
  state.clock += dt;
  state.effects.forEach(e => { e.ttl -= dt; });
  state.effects = state.effects.filter(e => e.ttl > 0);
  updateCombat(state, dt);
  for (const f of state.fighters) updateFighter(state, f, dt);
  updatePickups(state);
  updateRetrievals(state);
  checkFinish(state);
}

function updateFighter(state, f, dt) {
  if (f.currentMove) { f.currentMove.ttl -= dt; if (f.currentMove.ttl <= 0) f.currentMove = null; }
  if (f.incapacitated || f.extracted) return;
  if (f.extracting) return updateExtraction(state, f, dt);
  const enemy = opponentOf(state, f);
  const visible = canSee(state.arena, f, enemy);
  const audible = canHear(f, enemy);
  if (visible || audible) f.memory.lastSeen = { x: enemy.x, y: enemy.y, t: state.clock };
  chooseStance(f, enemy, visible);
  tryAttack(state, f, enemy, visible);
  const destination = nearestUsefulPickup(state, f) || nearestStuckProjectile(state, f) || chooseDestination(state, f, enemy);
  moveFighter(state, f, destination, dt);
  f.anim += dt * (f.pose === 'walk' || f.pose === 'crouchWalk' ? 12 : 3);
}

function chooseStance(f, enemy, visible) {
  const d = dist(f, enemy);
  f.prone = false; f.crouch = false;
  if (f.archetypeId === 'marine' && d > 220 && f.hp < 80 && visible) f.prone = true;
  if ((f.archetypeId === 'ninja' || f.archetypeId === 'archer') && !visible && d > 110) f.crouch = true;
}

function nearestUsefulPickup(state, f) {
  const items = state.pickups.filter(p => !p.used && (p.team === f.team || p.team === 'any'));
  if (!items.length) return null;
  const sorted = [...items].sort((a, b) => dist(f, a) - dist(f, b));
  const pick = sorted[0];
  if (pick.type === 'med' && f.hp > 72) return null;
  if (pick.type === 'ammo' && f.archetypeId !== 'marine' && f.archetypeId !== 'archer' && f.archetypeId !== 'ninja') return null;
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
      if (dist(f, pick) < 28 && (pick.team === 'any' || pick.team === f.team)) {
        usePickup(state, f, pick);
        pick.used = true;
      }
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
  if (pick.type === 'med') { f.hp = clamp(f.hp + 22, 0, 82); f.bandageCd = 2; addLog(state, `${f.name} uses a coach med drop.`); }
  if (pick.type === 'ammo') { f.resources.rifle = (f.resources.rifle || 0) + 24; f.resources.pistol = (f.resources.pistol || 0) + 8; f.resources.arrows = (f.resources.arrows || 0) + 6; f.resources.shuriken = (f.resources.shuriken || 0) + 3; addLog(state, `${f.name} grabs ammunition.`); }
  if (pick.type === 'weapon') { f.heat = 0; f.fight = 100; f.dodge = Math.max(f.dodge, 65); f.block = Math.max(f.block, 65); addLog(state, `${f.name} regains weapon rhythm.`); }
  if (pick.type === 'extract') beginExtraction(state, f);
}

function beginExtraction(state, f) {
  f.extracting = true; f.actionT = 1.3; f.pose = 'extract';
  state.effects.push({ type: 'extraction', x: f.x, y: f.y, ttl: 1.3 });
  addLog(state, `${f.name} grabs the extraction rope. Match forfeited, fighter saved.`);
}

function updateExtraction(state, f, dt) {
  f.actionT -= dt; f.y -= 160 * dt; f.pose = 'extract';
  if (f.actionT <= 0) { f.extracted = true; f.extracting = false; state.matchState = 'finished'; addLog(state, `${f.name} extracted from the arena.`); }
}

export function placeCoachDrop(state, type, x, y) {
  if (!COACH_DROPS[type] || (state.dropsLeft[type] || 0) <= 0) return false;
  state.dropsLeft[type]--;
  state.pickups.push({ type, team: 'A', x, y, used: false, label: COACH_DROPS[type].label, color: COACH_DROPS[type].color });
  addLog(state, `Coach drops ${COACH_DROPS[type].label}.`);
  return true;
}

function checkFinish(state) {
  const active = state.fighters.filter(f => !f.incapacitated && !f.extracted);
  if (active.length <= 1 && state.matchState !== 'finished') state.matchState = 'finished';
}
