import { describe, expect, it } from 'vitest';
import { createState } from '../src/state.js';
import { beginMoveObject, placeMoveObject, updateMoveJob } from '../src/objectMove.js';
import { updateMovement } from '../src/movement.js';
import { objects, getObject } from '../src/world.js';

function tickMoveJob(state, actor, seconds = 8) {
  const steps = Math.ceil(seconds * 30);
  for (let i = 0; i < steps && state.moveJob; i += 1) {
    updateMovement(state, actor, 1 / 30);
    updateMoveJob(state, 1 / 30);
  }
}

describe('object move workflow', () => {
  it('does not allow a selected actor on a different floor to move an object remotely', () => {
    const state = createState();
    state.floor = 2;
    const actor = state.entities.find(e => e.id === 'resident');
    const couch = getObject('basement_couch');
    const original = { x: couch.x, y: couch.y };

    actor.floor = 1;
    expect(beginMoveObject(state, actor, couch)).toBe(false);
    expect(placeMoveObject(state, actor, couch.x + 80, couch.y + 80)).toBe(false);
    expect(state.moveJob).toBe(null);
    expect(couch.x).toBe(original.x);
    expect(couch.y).toBe(original.y);
  });

  it('moves a movable object only through the actor carry job after the actor reaches it', () => {
    const state = createState();
    state.floor = 2;
    const actor = state.entities.find(e => e.id === 'resident');
    const couch = getObject('basement_couch');
    const original = { x: couch.x, y: couch.y };
    const target = { x: 92, y: 472 };

    actor.floor = couch.floor;
    actor.x = 780;
    actor.y = 590;
    actor.path = [];
    actor.target = null;
    actor.pending = null;

    expect(beginMoveObject(state, actor, couch)).toBe(true);
    expect(placeMoveObject(state, actor, target.x + couch.w / 2, target.y + couch.h / 2)).toBe(true);
    expect(couch.x).toBe(original.x);
    expect(couch.y).toBe(original.y);
    expect(state.moveJob?.phase).toBe('toObject');

    tickMoveJob(state, actor, 18);

    expect(state.moveJob).toBe(null);
    expect(couch.x).toBe(target.x);
    expect(couch.y).toBe(target.y);
    expect(actor.action).toBe('Idle');
    expect(actor.carrying).toBe(null);
  });
});
