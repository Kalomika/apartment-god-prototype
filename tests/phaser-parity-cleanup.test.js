import { describe, expect, it } from 'vitest';
import { cleanupInactivePoolChoreography } from '../src/poolActivityCleanup.js';

function actor(overrides = {}) {
  return {
    id: 'resident',
    action: 'Pool: circling table',
    actionT: 0,
    pose: 'walk',
    carrying: 'cue_stick',
    poolRoute: { key: 'station', points: [{ x: 100, y: 100 }] },
    vx: 84,
    vy: 0,
    ...overrides
  };
}

describe('Phaser parity pool interruption cleanup', () => {
  it('clears stale pool routes, cue state, and velocity after interruption', () => {
    const resident = actor();
    const state = { entities: [resident], poolGame: { activeActorIds: [] } };
    cleanupInactivePoolChoreography(state);
    expect(resident.poolRoute).toBeNull();
    expect(resident.carrying).toBeNull();
    expect(resident.vx).toBe(0);
    expect(resident.vy).toBe(0);
    expect(resident.pose).toBe('stand');
    expect(resident.action).toBe('Idle');
  });

  it('preserves an active pool actor while the timed action is still running', () => {
    const resident = actor({ actionT: 20 });
    const route = resident.poolRoute;
    const state = { entities: [resident], poolGame: { activeActorIds: ['resident'] } };
    cleanupInactivePoolChoreography(state);
    expect(resident.poolRoute).toBe(route);
    expect(resident.carrying).toBe('cue_stick');
    expect(resident.vx).toBe(84);
  });
});
