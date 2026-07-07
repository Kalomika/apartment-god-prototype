import { createMachine } from 'xstate';

export const wrestlerMachine = createMachine({
  id: 'wrestlerSprite',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CIRCLE: 'circling',
        CLOSE: 'closingDistance',
        LOCKUP: 'lockup',
        STRIKE: 'striking',
        SELL: 'selling',
        DOWN: 'downed',
        TAUNT: 'taunting'
      }
    },
    circling: {
      on: {
        IDLE: 'idle',
        CLOSE: 'closingDistance',
        LOCKUP: 'lockup'
      }
    },
    closingDistance: {
      on: {
        IDLE: 'idle',
        LOCKUP: 'lockup',
        STRIKE: 'striking'
      }
    },
    lockup: {
      on: {
        ADVANTAGE: 'grappleAdvantage',
        REVERSED: 'selling',
        BREAK: 'idle'
      }
    },
    grappleAdvantage: {
      on: {
        MOVE: 'executingMove',
        BREAK: 'idle'
      }
    },
    striking: {
      on: {
        IDLE: 'idle',
        SELL: 'selling'
      }
    },
    executingMove: {
      on: {
        IMPACT: 'recovering',
        COUNTERED: 'selling'
      }
    },
    selling: {
      on: {
        IDLE: 'idle',
        DOWN: 'downed',
        RECOVER: 'recovering'
      }
    },
    downed: {
      on: {
        PINNED: 'pinned',
        RECOVER: 'recovering'
      }
    },
    pinned: {
      on: {
        KICKOUT: 'recovering',
        FINISH: 'finished'
      }
    },
    taunting: {
      on: {
        IDLE: 'idle',
        HIT: 'selling'
      }
    },
    recovering: {
      on: {
        IDLE: 'idle',
        DOWN: 'downed'
      }
    },
    finished: {
      type: 'final'
    }
  }
});
