import { describe, expect, it } from 'vitest';
import { ACTIONS } from '../src/config.js';
import { updateArcadeSystem } from '../src/arcadeSystem.js';
import { updateBasketballSystem } from '../src/basketballSystem.js';
import { captureGateTraversalState, enforceGateTraversal } from '../src/gateTraversalGuard.js';
import { updateOffsiteHomeView } from '../src/offsiteOverlay.js';
import { poolShotStanceForTest } from '../src/poolActivitySystem.js';

function person(id, floor, x, y) {
  return {
    id,
    name: id,
    type: 'person',
    floor,
    x,
    y,
    hidden: false,
    path: [],
    target: null,
    pending: null,
    pose: 'stand',
    action: 'Idle',
    actionT: 0,
    actionTotal: 0,
    currentActionId: null,
    needs: { bladder: 80, hunger: 80, energy: 80, stamina: 80 }
  };
}

describe('layer, vehicle, and game regression guards', () => {
  it('keeps a person north of a closed driveway gate', () => {
    const actor = person('resident', 7, 460, 402);
    actor.path = [{ x: 460, y: 450 }];
    const state = { entities: [actor], frontGate: { open: 0, requested: false } };
    captureGateTraversalState(state);
    actor.y = 420;
    actor.path = [];
    enforceGateTraversal(state);
    expect(actor.y).toBe(402);
    expect(actor.path).toEqual([{ x: 460, y: 450 }]);
    expect(actor.action).toBe('Waiting for driveway gate');
    expect(state.frontGate.requested).toBe(true);
  });

  it('allows the same crossing once the driveway gate is open', () => {
    const actor = person('resident', 7, 460, 402);
    actor.path = [{ x: 460, y: 450 }];
    const state = { entities: [actor], frontGate: { open: 1, requested: true } };
    captureGateTraversalState(state);
    actor.y = 420;
    enforceGateTraversal(state);
    expect(actor.y).toBe(420);
  });

  it('returns the camera to a visible home actor during an offsite trip', () => {
    const away = person('resident', 3, 300, 300);
    away.hidden = true;
    const home = person('girlfriend', 0, 180, 220);
    const state = {
      offsite: { actionId: 'errand', actors: ['resident'], progress: .4 },
      entities: [away, home],
      selectedId: 'resident',
      floor: 3,
      followSelected: false,
      viewHoldT: 8,
      viewFocus: {},
      cameraTransition: {}
    };
    updateOffsiteHomeView(state);
    expect(state.selectedId).toBe('girlfriend');
    expect(state.floor).toBe(0);
    expect(state.followSelected).toBe(true);
  });

  it('places a pool shooter outside the table on the correct aiming side', () => {
    const table = { x: 250, y: 248, w: 250, h: 122 };
    const cue = { x: 310, y: 309 };
    const target = { x: 440, y: 309 };
    const stance = poolShotStanceForTest(table, cue, target);
    expect(stance.x).toBeLessThan(table.x);
    expect(stance.y).toBeGreaterThanOrEqual(table.y - 48);
    expect(stance.y).toBeLessThanOrEqual(table.y + table.h + 48);
  });

  it('exposes three arcade choices and one on one basketball', () => {
    const arcadeIds = ACTIONS.arcade.map(([id]) => id);
    expect(arcadeIds).toContain('arcade_fighter');
    expect(arcadeIds).toContain('arcade_pong');
    expect(arcadeIds).toContain('arcade_racer');
    expect(ACTIONS.basketball_court).toEqual([['basketball_1v1', 'Play One on One Basketball']]);
    expect(typeof updateArcadeSystem).toBe('function');
    expect(typeof updateBasketballSystem).toBe('function');
  });
});
