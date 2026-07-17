import { describe, expect, it } from 'vitest';
import {
  CHARACTER_ANIMATION_FPS,
  directionFromDeltaForTest,
  shouldPlayWalkForTest
} from '../src/phaserCharacterAnimationSystem.js';
import {
  poolPerimeterPathForTest,
  stepPoolRouteForTest
} from '../src/poolActivitySystem.js';

describe('Phaser Migration 2 grounded character animation and pool routing', () => {
  it('locks all directional walk animation to 8 FPS', () => {
    expect(CHARACTER_ANIMATION_FPS).toBe(8);
  });

  it('does not play a walk cycle when the actor did not move', () => {
    const actor = { action: 'Pool: circling table', pose: 'walk' };
    expect(shouldPlayWalkForTest({ x: 220, y: 220 }, { x: 220, y: 220 }, actor)).toBe(false);
  });

  it('plays a walk cycle only after measurable world movement', () => {
    const actor = { action: 'Pool: circling table', pose: 'walk' };
    expect(shouldPlayWalkForTest({ x: 220, y: 220 }, { x: 223, y: 220 }, actor)).toBe(true);
    expect(directionFromDeltaForTest(3, 0)).toBe('east');
    expect(directionFromDeltaForTest(0, -3)).toBe('north');
  });

  it('builds a perimeter route instead of crossing through the pool table', () => {
    const table = { x: 250, y: 248, w: 250, h: 122 };
    const from = { x: 192, y: 309 };
    const to = { x: 558, y: 309 };
    const route = poolPerimeterPathForTest(from, to, table);
    expect(route.length).toBeGreaterThan(1);
    expect(route.some(point => point.y < table.y || point.y > table.y + table.h)).toBe(true);
    expect(route.at(-1)).toEqual(to);
  });

  it('moves actor coordinates along the pool perimeter every simulation step', () => {
    const actor = { x: 192, y: 309, vx: 0, vy: 0 };
    const route = [{ x: 192, y: 200 }, { x: 558, y: 200 }, { x: 558, y: 309 }];
    const before = { x: actor.x, y: actor.y };
    const arrived = stepPoolRouteForTest(actor, route, 0.25);
    expect(arrived).toBe(false);
    expect(Math.hypot(actor.x - before.x, actor.y - before.y)).toBeGreaterThan(0);
    expect(Math.hypot(actor.vx, actor.vy)).toBeGreaterThan(0);
    expect(actor.spriteDirection).toBe('north');
  });
});
