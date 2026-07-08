import { clamp } from './utils.js';

export const VITALITY_STAGES = [
  { id: 'green', label: 'Green', min: 81, cap: 100, speed: 1, color: '#73d98b', saturation: 1 },
  { id: 'yellow', label: 'Yellow', min: 61, cap: 80, speed: 0.94, color: '#d5d879', saturation: 0.82 },
  { id: 'orange', label: 'Orange', min: 41, cap: 60, speed: 0.84, color: '#e9a457', saturation: 0.62 },
  { id: 'red', label: 'Red', min: 21, cap: 40, speed: 0.68, color: '#e85e5e', saturation: 0.42 },
  { id: 'purple', label: 'Purple', min: 1, cap: 20, speed: 0.48, color: '#9b75ff', saturation: 0.25 },
  { id: 'incapacitated', label: 'Incapacitated', min: 0, cap: 0, speed: 0, color: '#7d8795', saturation: 0 }
];

export function vitalityStageFor(fighter) {
  return VITALITY_STAGES.find(stage => fighter.hp >= stage.min) || VITALITY_STAGES[VITALITY_STAGES.length - 1];
}

export function updateVitalityCap(fighter) {
  const stage = vitalityStageFor(fighter);
  if (stage.cap === 0) return;
  fighter.vitalityCap = Math.min(fighter.vitalityCap ?? 100, stage.cap);
  fighter.painStage = stage.id;
}

export function recoverVitality(fighter, amount) {
  const cap = fighter.vitalityCap ?? 100;
  fighter.hp = clamp(fighter.hp + amount, 0, cap);
}

export function canSuddenIncapacitate(attacker, defender, type, damage) {
  if (type === 'grenade' || type === 'blast') return damage > 22;
  if (type === 'shot') {
    const aim = attacker?.stats?.aim || 50;
    const toughness = defender?.stats?.toughness || 60;
    const disciplined = (defender?.stats?.discipline || 60) / 100;
    const chance = Math.max(0.002, (aim - toughness + 18) / 1900) * (1 - disciplined * 0.42);
    return damage > 14 && defender.hp < 18 && Math.random() < chance;
  }
  if (type === 'sword' || type === 'counter') {
    return damage > 18 && defender.hp < 14 && Math.random() < 0.015;
  }
  return false;
}
