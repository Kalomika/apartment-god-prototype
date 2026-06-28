export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const ARENA_W = 960;
export const ARENA_H = 720;
export const TAU = Math.PI * 2;

export const LIMBS = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
export const ARCHETYPE_IDS = ['marine', 'ninja', 'archer', 'martial_artist'];

export const COACH_DROPS = {
  med: { label: 'Med Kit', radius: 15, charges: 2, color: '#78e0a0' },
  ammo: { label: 'Ammo Cache', radius: 14, charges: 2, color: '#f0cf68' },
  weapon: { label: 'Weapon Refresh', radius: 14, charges: 1, color: '#93c7ff' },
  extract: { label: 'Extraction Rope', radius: 18, charges: 1, color: '#d7dff0' }
};

export const COACH_COMMANDS = {
  move: { label: 'Go There', trustCost: 3 },
  cover: { label: 'Take Cover', trustCost: 4 },
  ranged: { label: 'Stay Ranged', trustCost: 5 },
  projectile: { label: 'Use Projectile', trustCost: 5 },
  cqc: { label: 'Hand to Hand', trustCost: 5 },
  sword: { label: 'Use Blade', trustCost: 6 },
  grenade: { label: 'Grenade', trustCost: 8 },
  disarm: { label: 'Disarm', trustCost: 7 }
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
  shatter: 0.9,
  grenade: 1.35,
  explosion: 0.7,
  command: 0.65,
  dive: 0.42,
  bleed: 0.55,
  alert: 0.8,
  bandage: 0.45,
  wallLean: 0.35
};
