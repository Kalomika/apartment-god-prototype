import { describe, expect, it } from 'vitest';
import { startFetchThrow, updateFetch } from '../src/fetchSystem.js';

function actor(id, type, x, y, floor = 0) {
  return {
    id,
    name: id,
    type,
    x,
    y,
    floor,
    path: [],
    target: null,
    pending: null,
    action: 'Idle',
    actionT: 0,
    actionTotal: 0,
    pose: 'stand',
    carrying: null,
    bubble: '',
    bubbleT: 0,
    mood: type === 'dog' ? 'dog' : 'neutral',
    needs: { fun: 50 }
  };
}

function stateWith(...entities) {
  return { entities, notifications: [], fetch: null };
}

describe('fetch system', () => {
  it('uses simulation delta for ball flight instead of a fixed frame step', () => {
    const resident = actor('resident', 'person', 100, 100);
    const dog = actor('dog', 'dog', 120, 110);
    const state = stateWith(resident, dog);

    startFetchThrow(state, resident, dog, 240, 180);
    updateFetch(state, 0.1);

    expect(state.fetch.phase).toBe('thrown');
    expect(state.fetch.t).toBeCloseTo(0.25, 5);
    expect(state.fetch.ball.x).toBeGreaterThan(118);
    expect(state.fetch.ball.x).toBeLessThan(240);
  });

  it('clears an orphaned fetch flow when an actor disappears', () => {
    const resident = actor('resident', 'person', 100, 100);
    const state = stateWith(resident);
    state.fetch = { phase: 'toBall', actorId: 'resident', dogId: 'dog', target: { x: 300, y: 300 } };

    updateFetch(state, 0.05);

    expect(state.fetch).toBeNull();
  });

  it('cancels instead of granting a phantom pickup when the dog has no route', () => {
    const resident = actor('resident', 'person', 100, 100, 99);
    const dog = actor('dog', 'dog', 120, 100, 99);
    const state = stateWith(resident, dog);
    state.fetch = {
      phase: 'toBall',
      actorId: 'resident',
      dogId: 'dog',
      ball: { x: 700, y: 600, floor: 99 },
      target: { x: 700, y: 600, floor: 99 }
    };

    updateFetch(state, 0.05);

    expect(state.fetch).toBeNull();
    expect(dog.carrying).toBeNull();
    expect(dog.action).toBe('Idle');
    expect(state.notifications[0]).toContain('lost the route');
  });
});
