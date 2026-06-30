export const ARCHETYPES = {
  suit_operative: {
    id: 'suit_operative', name: 'Suit Operative', color: '#202a35', accent: '#d8d1bd', weapon: 'pistol', melee: 'hands', special: 'counter',
    stats: { speed: 126, stealth: 62, sight: 84, hearing: 72, aim: 90, cqc: 82, block: 72, dodge: 76, counter: 88, grapple: 66, sneakAttack: 68, sneakDefense: 76, toughness: 64, stamina: 82, aggression: 58, recovery: 70, discipline: 90, prestige: 78, ruthlessness: 54 },
    resources: { pistol: 42, rifle: 0, grenades: 0, heat: 0, special: 2 }
  },
  survival_commando: {
    id: 'survival_commando', name: 'Survival Commando', color: '#4f633f', accent: '#8a2721', weapon: 'rifle', melee: 'knife', special: 'grenade',
    stats: { speed: 116, stealth: 54, sight: 80, hearing: 76, aim: 78, cqc: 74, block: 74, dodge: 56, counter: 58, grapple: 82, sneakAttack: 60, sneakDefense: 70, toughness: 92, stamina: 88, aggression: 72, recovery: 62, discipline: 70, prestige: 66, ruthlessness: 50 },
    resources: { rifle: 48, pistol: 10, grenades: 2, heat: 0, special: 1 }
  },
  shadow_ninja: {
    id: 'shadow_ninja', name: 'Shadow Ninja', color: '#11151b', accent: '#39414b', weapon: 'shuriken', melee: 'sword', special: 'smoke',
    stats: { speed: 154, stealth: 96, sight: 78, hearing: 84, aim: 64, cqc: 86, block: 62, dodge: 90, counter: 78, grapple: 58, sneakAttack: 94, sneakDefense: 82, toughness: 56, stamina: 94, aggression: 70, recovery: 74, discipline: 66, prestige: 54, ruthlessness: 66 },
    resources: { shuriken: 12, smoke: 3, heat: 0, special: 3 }
  },
  field_agent: {
    id: 'field_agent', name: 'Field Agent', color: '#2f3b47', accent: '#7a8fa3', weapon: 'pistol', melee: 'hands', special: 'cover',
    stats: { speed: 122, stealth: 70, sight: 88, hearing: 74, aim: 88, cqc: 68, block: 68, dodge: 80, counter: 74, grapple: 54, sneakAttack: 66, sneakDefense: 84, toughness: 60, stamina: 78, aggression: 46, recovery: 76, discipline: 94, prestige: 84, ruthlessness: 30 },
    resources: { pistol: 38, rifle: 0, grenades: 0, heat: 0, special: 2 }
  },
  marine: {
    id: 'marine', name: 'Marine', color: '#6da3ff', accent: '#253b5f', weapon: 'rifle', melee: 'knife', special: 'prone',
    stats: { speed: 108, stealth: 38, sight: 82, hearing: 65, aim: 82, cqc: 62, block: 68, dodge: 48, counter: 52, grapple: 66, sneakAttack: 58, sneakDefense: 72, toughness: 88, stamina: 84, aggression: 62, recovery: 60, discipline: 78, prestige: 70, ruthlessness: 42 },
    resources: { rifle: 54, pistol: 18, grenades: 2, heat: 0, special: 1 }
  },
  ninja: {
    id: 'ninja', name: 'Ninja', color: '#8d92a4', accent: '#262a36', weapon: 'shuriken', melee: 'sword', special: 'smoke',
    stats: { speed: 152, stealth: 94, sight: 74, hearing: 82, aim: 62, cqc: 84, block: 58, dodge: 88, counter: 76, grapple: 54, sneakAttack: 92, sneakDefense: 78, toughness: 54, stamina: 92, aggression: 76, recovery: 72, discipline: 58, prestige: 46, ruthlessness: 72 },
    resources: { shuriken: 10, smoke: 3, heat: 0, special: 3 }
  },
  archer: {
    id: 'archer', name: 'Archer', color: '#71d2a2', accent: '#284935', weapon: 'bow', melee: 'arrow_stab', special: 'roll',
    stats: { speed: 124, stealth: 62, sight: 86, hearing: 70, aim: 78, cqc: 54, block: 52, dodge: 68, counter: 48, grapple: 42, sneakAttack: 52, sneakDefense: 58, toughness: 62, stamina: 80, aggression: 50, recovery: 66, discipline: 68, prestige: 78, ruthlessness: 28 },
    resources: { arrows: 20, heat: 0, special: 2 }
  },
  martial_artist: {
    id: 'martial_artist', name: 'Martial Artist', color: '#ffb15f', accent: '#623818', weapon: 'debris', melee: 'hands', special: 'focus',
    stats: { speed: 136, stealth: 58, sight: 72, hearing: 78, aim: 48, cqc: 96, block: 88, dodge: 78, counter: 92, grapple: 84, sneakAttack: 64, sneakDefense: 90, toughness: 78, stamina: 90, aggression: 76, recovery: 78, discipline: 52, prestige: 82, ruthlessness: 30 },
    resources: { debris: 4, heat: 0, special: 2 }
  }
};

export function archetypeList() {
  return Object.values(ARCHETYPES);
}
