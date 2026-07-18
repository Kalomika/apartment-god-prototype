import { describe, expect, it } from 'vitest';
import { startBookReadingRoute } from '../src/bookSystem.js';
import { getObject } from '../src/world.js';

describe('book reading route floor safety', () => {
  it('keeps a book reading route on the same floor as the bookshelf', () => {
    const shelf = getObject('bookshelf');
    const actor = {
      id: 'resident',
      name: 'Resident',
      type: 'person',
      floor: shelf.floor,
      hidden: false,
      stopped: false,
      x: shelf.x + shelf.w + 40,
      y: shelf.y + shelf.h / 2,
      path: [],
      speed: 92,
      action: 'Idle',
      pose: 'stand',
      skills: { intellect: 1, learning: 2 },
      skillCaps: { intellect: 6 },
      needs: { bladder: 100, hunger: 100, energy: 100 }
    };
    const state = {
      time: 480,
      entities: [actor],
      objectState: {},
      tidiness: { rooms: {} },
      calendar: { bookings: [], history: [] },
      notifications: []
    };

    expect(shelf.floor).toBe(1);
    expect(startBookReadingRoute(state, actor, shelf)).toBe(true);
    expect(actor.target.type).toBe('bookSeat');
    expect(actor.target.seatLabel).toContain('office');
    expect(actor.floor).toBe(shelf.floor);
    expect(actor.path.length).toBeGreaterThan(0);
  });
});
