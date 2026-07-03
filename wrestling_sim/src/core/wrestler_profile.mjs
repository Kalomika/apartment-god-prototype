export const WrestlingStyle = Object.freeze({
  POWERHOUSE: 'powerhouse',
  TECHNICIAN: 'technician',
  HIGH_FLYER: 'high_flyer',
  BRAWLER: 'brawler',
  SHOWMAN: 'showman',
  STRIKER: 'striker',
  SUBMISSION: 'submission',
  GIANT: 'giant',
  BALANCED: 'balanced'
});

export const Temperament = Object.freeze({
  CALM: 'calm',
  AGGRESSIVE: 'aggressive',
  COCKY: 'cocky',
  COWARDLY: 'cowardly',
  RESILIENT: 'resilient',
  RECKLESS: 'reckless',
  METHODICAL: 'methodical'
});

export function createWrestlerProfile(overrides = {}) {
  return {
    id: overrides.id ?? cryptoSafeId(),
    displayName: overrides.displayName ?? 'Unnamed Wrestler',
    inspirationNotes: overrides.inspirationNotes ?? '',
    style: overrides.style ?? WrestlingStyle.BALANCED,
    secondaryStyle: overrides.secondaryStyle ?? WrestlingStyle.BRAWLER,
    temperament: overrides.temperament ?? Temperament.CALM,
    stats: {
      strength: clamp01(overrides.stats?.strength ?? 0.5),
      speed: clamp01(overrides.stats?.speed ?? 0.5),
      stamina: clamp01(overrides.stats?.stamina ?? 0.5),
      toughness: clamp01(overrides.stats?.toughness ?? 0.5),
      technique: clamp01(overrides.stats?.technique ?? 0.5),
      charisma: clamp01(overrides.stats?.charisma ?? 0.5),
      awareness: clamp01(overrides.stats?.awareness ?? 0.5),
      aggression: clamp01(overrides.stats?.aggression ?? 0.5),
      discipline: clamp01(overrides.stats?.discipline ?? 0.5),
      counterSkill: clamp01(overrides.stats?.counterSkill ?? 0.5)
    },
    tendencies: {
      riskTolerance: clamp01(overrides.tendencies?.riskTolerance ?? 0.5),
      showboatChance: clamp01(overrides.tendencies?.showboatChance ?? 0.25),
      grapplePreference: clamp01(overrides.tendencies?.grapplePreference ?? 0.5),
      strikePreference: clamp01(overrides.tendencies?.strikePreference ?? 0.5),
      aerialPreference: clamp01(overrides.tendencies?.aerialPreference ?? 0.25),
      submissionPreference: clamp01(overrides.tendencies?.submissionPreference ?? 0.25),
      staminaDiscipline: clamp01(overrides.tendencies?.staminaDiscipline ?? 0.5),
      pinUrgency: clamp01(overrides.tendencies?.pinUrgency ?? 0.5)
    },
    moveSet: overrides.moveSet ?? defaultMoveSet()
  };
}

export function defaultMoveSet() {
  return [
    {
      id: 'collar_tie',
      label: 'Collar tie',
      category: 'grapple',
      zoneTags: ['center_ring'],
      staminaCost: 0.04,
      damage: 0.02,
      risk: 0.1,
      crowd: 0.05
    },
    {
      id: 'body_slam',
      label: 'Body slam',
      category: 'grapple',
      zoneTags: ['center_ring'],
      staminaCost: 0.14,
      damage: 0.16,
      risk: 0.35,
      crowd: 0.25
    },
    {
      id: 'short_strikes',
      label: 'Short strike combo',
      category: 'strike',
      zoneTags: ['center_ring', 'rope'],
      staminaCost: 0.08,
      damage: 0.08,
      risk: 0.18,
      crowd: 0.12
    },
    {
      id: 'leg_work',
      label: 'Work the leg',
      category: 'technical',
      zoneTags: ['center_ring', 'ground'],
      staminaCost: 0.08,
      damage: 0.07,
      risk: 0.16,
      crowd: 0.1
    },
    {
      id: 'pin_attempt',
      label: 'Pin attempt',
      category: 'finish_check',
      zoneTags: ['ground'],
      staminaCost: 0.03,
      damage: 0,
      risk: 0.12,
      crowd: 0.3
    },
    {
      id: 'recover',
      label: 'Recover stamina',
      category: 'strategy',
      zoneTags: ['any'],
      staminaCost: -0.12,
      damage: 0,
      risk: 0.05,
      crowd: -0.03
    }
  ];
}

export function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value)));
}

function cryptoSafeId() {
  return `wrestler_${Math.random().toString(36).slice(2, 10)}`;
}
