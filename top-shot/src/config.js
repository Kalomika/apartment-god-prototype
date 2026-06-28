export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const ARENA_W = 960;
export const ARENA_H = 720;
export const TAU = Math.PI * 2;

export const DAMAGE_STAGES = [
  { id: 'ready', label: 'Ready', min: 81, speed: 1, color: '#73d98b' },
  { id: 'hurt', label: 'Hurt', min: 61, speed: 0.94, color: '#d5d879' },
  { id: 'wounded', label: 'Wounded', min: 41, speed: 0.84, color: '#e9a457' },
  { id: 'critical', label: 'Critical', min: 1, speed: 0.68, color: '#e85e5e' },
  { id: 'incapacitated', label: 'Incapacitated', min: 0, speed: 0, color: '#7d8795' }
];

export const LIMBS = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
export const ARCHETYPE_IDS = ['marine', 'ninja', 'archer', 'martial_artist'];

export const COACH_DROPS = {
  med: { label: 'Med Kit', radius: 15, charges: 2, color: '#78e0a0' },
  ammo: { label: 'Ammo Cache', radius: 14, charges: 2, color: '#f0cf68' },
  weapon: { label: 'Weapon Refresh', radius: 14, charges: 1, color: '#93c7ff' },
  extract: { label: 'Extraction Rope', radius: 18, charges: 1, color: '#d7dff0' }
};

export const EFFECT_TTL = {
  tracer: 0.08,
  impact: 0.22,
  slash: 0.18,
  block: 0.18,
  dodge: 0.22,
  smoke: 0.9,
  grapple: 0.28,
  extraction: 1.2,
  shatter: 0.9
};
