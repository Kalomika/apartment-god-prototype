import { describe, expect, it } from 'vitest';
import { applyRuntimeRegressionGuards } from '../src/runtimeRegressionGuards.js';

function stateWith(entity) {
  return {
    entities: [
      {
        id: 'resident',
        type: 'person',
        hidden: false,
        floor: 1,
        x: 400,
        y: 300,
        path: [],
        target: null,
        pending: null,
        pose: 'sit',
        action: 'Studying',
        currentActionId: 'study',
        ...entity
      }
    ]
  };
}

describe('runtime timed action progress guard', () => {
  it('restores a missing action total so the UI can draw a time bar', () => {
    const state = stateWith({ actionT: 18, actionTotal: 0 });

    applyRuntimeRegressionGuards(state);

    expect(state.entities[0].actionTotal).toBe(18);
  });

  it('preserves the original total while an action counts down', () => {
    const state = stateWith({ actionT: 7, actionTotal: 20 });

    applyRuntimeRegressionGuards(state);

    expect(state.entities[0].actionTotal).toBe(20);
  });

  it('repairs a stale total that is lower than the remaining time', () => {
    const state = stateWith({ actionT: 12, actionTotal: 5 });

    applyRuntimeRegressionGuards(state);

    expect(state.entities[0].actionTotal).toBe(12);
  });
});
