import { readFileSync } from 'node:fs';
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

const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const runtimeSource = readFileSync(new URL('../src/phaserParityRuntime.js', import.meta.url), 'utf8');

describe('full Phaser parity integration', () => {
  it('boots the Phaser parity runtime instead of the Canvas runtime', () => {
    expect(mainSource).toContain('bootPhaserParityGame');
    expect(mainSource).not.toContain('bootCanvasGame');
  });

  it('keeps the feature rich simulation systems wired into Phaser', () => {
    for (const system of [
      'updateFrontYardEnvironment',
      'requestGateForApproachingEntities',
      'updatePoolActivity',
      'updateArcadeSystem',
      'updateBasketballSystem',
      'updateOffsiteHomeView',
      'updateCalendarRuntime',
      'updateAutoHooks',
      'updateAutonomy',
      'advanceGameClock',
      'updateLifeQualitySystem'
    ]) expect(runtimeSource).toContain(system);
  });

  it('locks directional character movement to 8 FPS', () => {
    expect(CHARACTER_ANIMATION_FPS).toBe(8);
  });

  it('does not animate walking when world coordinates do not change', () => {
    const actor = { action: 'Pool: circling table', pose: 'walk' };
    expect(shouldPlayWalkForTest({ x: 220, y: 220 }, { x: 220, y: 220 }, actor)).toBe(false);
  });

  it('uses actual displacement to choose a direction', () => {
    expect(shouldPlayWalkForTest({ x: 220, y: 220 }, { x: 223, y: 220 }, {})).toBe(true);
    expect(directionFromDeltaForTest(3, 0)).toBe('east');
    expect(directionFromDeltaForTest(0, -3)).toBe('north');
  });

  it('routes pool players around the table perimeter', () => {
    const table = { x: 250, y: 248, w: 250, h: 122 };
    const from = { x: 192, y: 309 };
    const to = { x: 558, y: 309 };
    const route = poolPerimeterPathForTest(from, to, table);
    expect(route.length).toBeGreaterThan(1);
    expect(route.some(point => point.y < table.y || point.y > table.y + table.h)).toBe(true);
    expect(route.at(-1)).toEqual(to);
  });

  it('changes actor coordinates during pool circulation', () => {
    const actor = { x: 192, y: 309, vx: 0, vy: 0 };
    const route = [{ x: 192, y: 200 }, { x: 558, y: 200 }, { x: 558, y: 309 }];
    const before = { x: actor.x, y: actor.y };
    const arrived = stepPoolRouteForTest(actor, route, .25);
    expect(arrived).toBe(false);
    expect(Math.hypot(actor.x - before.x, actor.y - before.y)).toBeGreaterThan(0);
    expect(Math.hypot(actor.vx, actor.vy)).toBeGreaterThan(0);
    expect(actor.spriteDirection).toBe('north');
  });
});
