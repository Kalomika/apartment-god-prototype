import { describe, expect, it } from 'vitest';
import { updatePoolActivity, poolShotStanceForTest } from '../src/poolActivitySystem.js';
import { getObject } from '../src/world.js';

describe('dynamic pool shot movement', () => {
  it('chooses the cue-ball side instead of a single fixed pool stance', () => {
    const table = getObject('pool_table');
    const cue = { x: table.x + 72, y: table.y + table.h / 2 };
    const target = { x: table.x + table.w - 78, y: table.y + table.h / 2 };
    const stance = poolShotStanceForTest(table, cue, target);

    expect(stance.x).toBeLessThan(table.x);
    expect(stance.y).toBeGreaterThanOrEqual(table.y - 48);
    expect(stance.y).toBeLessThanOrEqual(table.y + table.h + 48);
  });

  it('moves an active pool actor around the perimeter before taking a shot', () => {
    const table = getObject('pool_table');
    const actor = {
      id: 'resident',
      name: 'Resident',
      type: 'person',
      floor: table.floor,
      hidden: false,
      stopped: false,
      x: table.x + table.w / 2,
      y: table.y + table.h + 70,
      path: [],
      speed: 92,
      action: 'Pool practice',
      actionT: 120,
      actionTotal: 120,
      currentActionId: 'pool_solo',
      pose: 'pool'
    };
    const state = { floor: table.floor, selectedId: actor.id, viewHoldT: 0, entities: [actor] };
    const before = { x: actor.x, y: actor.y };

    updatePoolActivity(state, 1 / 30);

    expect(state.poolGame?.balls?.find(ball => ball.id === 'cue')).toBeTruthy();
    expect(actor.poolRoute?.points?.length).toBeGreaterThan(0);
    expect(actor.action).toBe('Pool: circling table');
    expect(Math.hypot(actor.x - before.x, actor.y - before.y)).toBeGreaterThan(0);

    for (let i = 0; i < 300 && actor.poolRoute?.points?.length; i += 1) updatePoolActivity(state, 1 / 30);

    expect(actor.x).toBeLessThan(table.x);
    expect(actor.poolRoute).toBeNull();
  });
});
