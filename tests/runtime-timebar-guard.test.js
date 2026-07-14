import { describe, expect, it } from 'vitest';
import { applyRuntimeRegressionGuards } from '../src/runtimeRegressionGuards.js';

function makeState(overrides = {}) {
  return {
    entities: [{
      id: 'resident',
      type: 'person',
      hidden: false,
      floor: 3,
      x: 500,
      y: 500,
      action: 'Studying',
      actionT: 12,
      actionTotal: 0,
      path: [],
      target: null,
      pending: null,
      ...overrides
    }]
  };
}

describe('timed action progress guard', () => {
  it('restores a missing progress total from remaining action time', () => {
    const state = makeState();
    applyRuntimeRegressionGuards(state);
    expect(state.entities[0].actionTotal).toBe(12);
  });

  it('preserves a valid original total while the timer counts down', () => {
    const state = makeState({ actionT: 7, actionTotal: 20 });
    applyRuntimeRegressionGuards(state);
    expect(state.entities[0].actionTotal).toBe(20);
  });

  it('repairs a stale total that is lower than remaining time', () => {
    const state = makeState({ actionT: 15, actionTotal: 4 });
    applyRuntimeRegressionGuards(state);
    expect(state.entities[0].actionTotal).toBe(15);
  });
});
