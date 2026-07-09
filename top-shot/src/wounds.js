import { EFFECT_TTL } from './config.js';
import { addLog } from './state.js';
import { clamp } from './utils.js';
import { recoverVitality, updateVitalityCap } from './vitality.js';

export function addBleed(state, fighter, severity, source = 'wound') {
  if (fighter.incapacitated || fighter.extracted) return;
  const current = fighter.bleed || { rate: 0, pool: 0, bandaging: false, progress: 0, trailT: 0 };
  fighter.bleed = { rate: clamp(current.rate + severity, 0, 12), pool: clamp((current.pool || 0) + severity * 12, 0, 100), bandaging: false, progress: 0, source, trailT: 0 };
  fighter.helpT = Math.max(fighter.helpT || 0, 1.4);
  fighter.helpIcon = 'bleed';
  state.effects.push({ type: 'blood_spray', x: fighter.x, y: fighter.y, ttl: 0.28, source });
  state.effects.push({ type: 'bleed', x: fighter.x, y: fighter.y, ttl: EFFECT_TTL.bleed || 0.5 });
  addLog(state, `${fighter.name} is bleeding from ${source}.`);
}

export function updateWounds(state, dt) {
  for (const f of state.fighters) {
    if (!f.bleed || f.incapacitated || f.extracted) continue;
    if (f.bleed.rate > 0) {
      const drain = f.bleed.rate * dt * (f.prone || f.wallLean ? 0.55 : 1);
      f.hp = clamp(f.hp - drain, 0, 100);
      f.bleed.pool = clamp((f.bleed.pool || 0) - drain * 1.8, 0, 100);
      f.bleed.trailT = (f.bleed.trailT || 0) - dt;
      if (f.bleed.trailT <= 0) {
        f.bleed.trailT = Math.max(0.12, 0.42 - f.bleed.rate * 0.025);
        state.effects.push({ type: 'blood_drop', x: f.x, y: f.y, ttl: 4.8, rate: f.bleed.rate });
      }
      updateVitalityCap(f);
      if (f.hp <= 0) { f.defeated = true; f.pose = 'blood_loss_kneel'; f.hp = 1; f.stamina = 0; state.cinematic = { phase: 'outro', t: 0, loser: f.id, label: 'blood loss' }; addLog(state, `${f.name} drops from blood loss.`); }
      if (f.bleed.pool <= 0) stopBleed(state, f, 'clotted');
    }
    if (f.bleed?.bandaging) updateBandage(state, f, dt);
  }
}

export function shouldBandage(fighter) {
  return Boolean(fighter.bleed?.rate > 0 && !fighter.bleed.bandaging && (fighter.hidden || fighter.wallLean || fighter.hp < 42 || fighter.bleed.rate > 6));
}

export function startBandage(state, fighter) {
  if (!fighter.bleed?.rate || fighter.bleed.bandaging || fighter.cooldown > 0) return false;
  fighter.bleed.bandaging = true;
  fighter.bleed.progress = 0;
  fighter.cooldown = 0.8;
  fighter.pose = 'bandage_wound';
  addLog(state, `${fighter.name} starts bandaging.`);
  return true;
}

function updateBandage(state, fighter, dt) {
  fighter.pose = 'bandage_wound';
  const pace = fighter.hidden ? 0.45 : fighter.wallLean ? 0.34 : 0.24;
  fighter.bleed.progress = clamp(fighter.bleed.progress + dt * pace, 0, 1);
  fighter.stamina = clamp(fighter.stamina + dt * 3, 0, 100);
  state.effects.push({ type: 'bandage', x: fighter.x, y: fighter.y, progress: fighter.bleed.progress, ttl: EFFECT_TTL.bandage || 0.45 });
  if (fighter.bleed.progress >= 1) { stopBleed(state, fighter, 'bandaged'); recoverVitality(fighter, 2); }
}

function stopBleed(state, fighter, reason) {
  if (!fighter.bleed) return;
  fighter.bleed.rate = 0;
  fighter.bleed.pool = 0;
  fighter.bleed.bandaging = false;
  fighter.bleed.progress = 0;
  fighter.helpIcon = null;
  addLog(state, `${fighter.name}'s bleeding is ${reason}.`);
}
