import { describe, expect, it } from 'vitest';
import { commandMove, updateMovement } from '../src/movement.js';
import { getObject, pointInRect, expandedRect } from '../src/world.js';

describe('movement solid footprint egress', () => {
  it('lets an actor route out after a bad activity placement leaves them inside a non-enterable solid footprint', () => {
    const consoleSetup = getObject('game_console');
    const actor = {
      id: 'resident',
      name: 'Resident',
      type: 'person',
      floor: consoleSetup.floor,
      hidden: false,
      stopped: false,
      x: consoleSetup.x + consoleSetup.w / 2,
      y: consoleSetup.y + consoleSetup.h / 2,
      path: [],
      speed: 92,
      action: 'Blocked',
      pose: 'stand'
    };
    const state = { floor: consoleSetup.floor, selectedId: 'resident', viewHoldT: 0 };

    expect(consoleSetup.enterable).not.toBe(true);
    expect(pointInRect(actor.x, actor.y, expandedRect(consoleSetup, 4))).toBe(true);

    commandMove(actor, consoleSetup.x - 96, consoleSetup.y + consoleSetup.h + 76, false);

    expect(actor.action).not.toBe('No route');
    expect(actor.path.length).toBeGreaterThan(0);

    for (let i = 0; i < 180 && actor.path.length; i += 1) updateMovement(state, actor, 1 / 30);

    expect(actor.action).not.toBe('Blocked');
    expect(pointInRect(actor.x, actor.y, expandedRect(consoleSetup, 4))).toBe(false);
  });
});
