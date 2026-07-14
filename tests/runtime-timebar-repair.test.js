import { describe, expect, it } from 'vitest';
import { applyRuntimeRegressionGuards } from '../src/runtimeRegressionGuards.js';

function stateWith(entity) {
  return { entities: [{ type: 'person', hidden: false, floor: 0, action: 'Study', pose: 'sit', ...entity }] };
}

describe('runtime timed action total repair', () => {
  it('restores a missing action total from remaining time', () => {
    const state = stateWith({ actionT: 12, actionTotal: 0 });
    applyRuntimeRegressionGuards(state);
    expect(state.entities[0].actionTotal).toBe(12);
  });

  it('preserves a valid original total while time counts down', () => {
    const state = stateWith({ actionT: 7, actionTotal: 20 });
    applyRuntimeRegressionGuards(state);
    expect(state.entities[0].actionTotal).toBe(20);
  });

  it('repairs a stale total that is lower than remaining time', () => {
    const state = stateWith({ actionT: 15, actionTotal: 4 });
    applyRuntimeRegressionGuards(state);
    expect(state.entities[0].actionTotal).toBe(15);
  });
});
