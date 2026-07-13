import { describe, expect, it } from 'vitest';
import { applyRealismRuntimeCorrections } from '../src/realismCorrectionPass.js';
import { getObject } from '../src/world.js';

describe('realism correction bookshelf floor safety', () => {
  it('does not move an upstairs bookshelf into living room coordinates', () => {
    const shelf = getObject('bookshelf');
    expect(shelf.floor).toBe(1);

    applyRealismRuntimeCorrections({});

    expect(shelf.floor).toBe(1);
    expect(shelf.room).toBe('office');
    expect(shelf.x).toBeGreaterThan(450);
  });
});
