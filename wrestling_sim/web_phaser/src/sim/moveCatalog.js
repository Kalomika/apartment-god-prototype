export const moveCatalog = [
  {
    id: 'circle',
    label: 'Circle',
    category: 'movement',
    desiredRange: 'far',
    risk: 5,
    staminaCost: 1,
    damage: 0,
    log: 'circles and studies the opponent'
  },
  {
    id: 'close_distance',
    label: 'Close Distance',
    category: 'movement',
    desiredRange: 'mid',
    risk: 12,
    staminaCost: 2,
    damage: 0,
    log: 'steps in and tries to close distance'
  },
  {
    id: 'basic_punch',
    label: 'Basic Punch',
    category: 'strike',
    desiredRange: 'near',
    risk: 24,
    staminaCost: 4,
    damage: 5,
    log: 'throws a short punch'
  },
  {
    id: 'lockup',
    label: 'Lock Up',
    category: 'grapple_entry',
    desiredRange: 'near',
    risk: 28,
    staminaCost: 5,
    damage: 0,
    log: 'forces a collar and elbow lockup'
  },
  {
    id: 'irish_whip',
    label: 'Irish Whip',
    category: 'grapple_move',
    requiredState: 'grappleAdvantage',
    desiredRange: 'grapple',
    risk: 38,
    staminaCost: 7,
    damage: 2,
    log: 'sends the opponent running into the ropes'
  },
  {
    id: 'basic_slam',
    label: 'Basic Slam',
    category: 'grapple_move',
    requiredState: 'grappleAdvantage',
    desiredRange: 'grapple',
    risk: 46,
    staminaCost: 9,
    damage: 12,
    log: 'plants the opponent with a basic slam'
  },
  {
    id: 'pin_attempt',
    label: 'Pin Attempt',
    category: 'finish_attempt',
    requiredOpponentState: 'downed',
    desiredRange: 'near',
    risk: 18,
    staminaCost: 3,
    damage: 0,
    log: 'drops down for a cover'
  },
  {
    id: 'recover',
    label: 'Recover',
    category: 'defense',
    desiredRange: 'any',
    risk: 4,
    staminaCost: -8,
    damage: 0,
    log: 'creates space and recovers'
  }
];

export function getMoveById(id) {
  return moveCatalog.find((move) => move.id === id);
}
