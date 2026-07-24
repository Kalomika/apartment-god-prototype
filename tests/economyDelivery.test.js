import { describe, expect, it } from 'vitest';
import { deliveryReceiverAvailableForTest, updateDelivery } from '../src/economy.js';

function makeState(actor, delivery) {
  return {
    entities: [actor],
    delivery,
    objectState: { doorOpen: true, workoutGear: false },
    notifications: [],
    log: [],
    time: 0,
  };
}

describe('staged delivery safety', () => {
  it('requires a visible receiver on the delivery floor', () => {
    expect(deliveryReceiverAvailableForTest({ floor: 0, hidden: false }, 0)).toBe(true);
    expect(deliveryReceiverAvailableForTest({ floor: 1, hidden: false }, 0)).toBe(false);
    expect(deliveryReceiverAvailableForTest({ floor: 0, hidden: true }, 0)).toBe(false);
  });

  it('does not start installation until the actor finishes carrying boxes to the install area', () => {
    const actor = {
      id: 'resident', name: 'Resident', floor: 0, hidden: false,
      path: [{ x: 356, y: 240 }], action: 'Carrying workout gear',
      actionT: 0, actionTotal: 0, carrying: 'workout boxes', pose: 'walk',
    };
    const state = makeState(actor, {
      type: 'workoutGear', phase: 'moving_to_install', actorId: actor.id,
      t: 0, floor: 0, x: 220, y: 646, bubble: 'MOVE',
    });

    updateDelivery(state, 1);
    expect(state.delivery.phase).toBe('moving_to_install');
    expect(actor.action).toBe('Carrying workout gear');

    actor.path = [];
    updateDelivery(state, 1);
    expect(state.delivery.phase).toBe('installing');
    expect(actor.action).toBe('Installing workout gear');
    expect(actor.actionT).toBe(15);
    expect(actor.actionTotal).toBe(15);
  });

  it('cancels safely and closes the door when the receiver becomes unavailable', () => {
    const actor = {
      id: 'resident', name: 'Resident', floor: 0, hidden: true,
      path: [], actionT: 4, actionTotal: 4, carrying: 'workout boxes',
    };
    const state = makeState(actor, {
      type: 'workoutGear', phase: 'exchange', actorId: actor.id,
      t: 2, floor: 0, x: 286, y: 622, bubble: 'GEAR',
    });

    updateDelivery(state, 1);
    expect(state.delivery).toBeNull();
    expect(state.objectState.doorOpen).toBe(false);
    expect(actor.carrying).toBeNull();
    expect(actor.actionT).toBe(0);
    expect(actor.actionTotal).toBe(0);
  });
});
