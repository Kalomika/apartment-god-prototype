import { describe, expect, it } from 'vitest';
import { commandMove, updateMovement } from '../src/movement.js';
import { getObject, pointInRect, expandedRect } from '../src/world.js';

describe('movement solid footprint egress', () => {
  it('lets an actor route out after an activity leaves them inside a couch footprint', () => {
    const couch = getObject('basement_couch');
    const actor = {
      id: 'resident',
      name: 'Resident',
      type: 'person',
      floor: 2,
      hidden: false,
      stopped: false,
      x: couch.x + couch.w / 2,
      y: couch.y + couch.h / 2,
      path: [],
      speed: 92,
      action: 'Blocked',
      pose: 'stand'
    };
    const state = { floor: 2, selectedId: 'resident', viewHoldT: 0 };

    expect(pointInRect(actor.x, actor.y, expandedRect(couch, 4))).toBe(true);

    commandMove(actor, couch.x - 96, couch.y + couch.h + 76, false);

    expect(actor.action).not.toBe('No route');
    expect(actor.path.length).toBeGreaterThan(0);

    for (let i = 0; i < 160 && actor.path.length; i += 1) updateMovement(state, actor, 1 / 30);

    expect(actor.action).not.toBe('Blocked');
    expect(pointInRect(actor.x, actor.y, expandedRect(couch, 4))).toBe(false);
  });
});
