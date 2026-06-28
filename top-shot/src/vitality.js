import { clamp } from './utils.js';

export const VITALITY_STAGES = [
  { id: 'green', label: 'Green', min: 81, cap: 100, color: '#73d98b' },
  { id: 'yellow', label: 'Yellow', min: 61, cap: 80, color: '#d5d879' },
  { id: 'orange', label: 'Orange', min: 41, cap: 60, color: '#e9a457' },
  { id: 'red', label: 'Red', min: 21, cap: 40, color: '#e85e5e' },
  { id: 'purple', label: 'Purple', min: 1, cap: 20, color: '#9b75ff' },
  { id: 'incapacitated', label: 'Incapacitated', min: 0, cap: 0, color: '#7d8795' }
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
  if (type === 'grenade' || type === 'blast') return true;
  if (type === 'shot') {
    const aim = attacker?.stats?.aim || 50;
    const toughness = defender?.stats?.toughness || 60;
    return damage > 10 && Math.random() < Math.max(0.015, (aim - toughness + 35) / 900);
  }
  if (type === 'sword' || type === 'counter') {
    return damage > 14 && Math.random() < 0.035;
  }
  return false;
}
