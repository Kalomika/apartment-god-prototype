import { describe, expect, it } from 'vitest';
import { ACTIONS } from '../src/config.js';
import { approachPoint, getObject, objectsByKind } from '../src/world.js';

describe('bath bed state fixes', () => {
  it('keeps upstairs shower, toilet, and sink objects available as nearest usable choices', () => {
    expect(objectsByKind('shower', 1).map(o => o.id)).toContain('master_shower');
    expect(objectsByKind('toilet', 1).map(o => o.id)).toContain('master_toilet');
    expect(objectsByKind('sink', 1).map(o => o.id)).toContain('master_bath_sink');
  });

  it('does not route bed sleep actions to the middle of the mattress', () => {
    const bed = getObject('bed');
    const p = approachPoint(bed, 'sleep');

    expect(p.x).toBeGreaterThan(bed.x + bed.w);
    expect(p.y).toBeGreaterThan(bed.y);
    expect(p.y).toBeLessThan(bed.y + bed.h);
  });

  it('keeps the primary vanity east facing with west side handles', () => {
    const sink = getObject('master_bath_sink');

    expect(sink.facing).toBe('east');
    expect(sink.handleSide).toBe('west');
  });

  it('supports distinct male standing pee and seated toilet actions', () => {
    expect(ACTIONS.toilet.map(([id]) => id)).toEqual(['pee_stand', 'toilet']);
  });

  it('adds panic room objects without replacing the upstairs stairs', () => {
    expect(getObject('panic_room_door').kind).toBe('panic_room_door');
    expect(getObject('panic_defense_locker').kind).toBe('security_locker');
    expect(getObject('stairs_up').room).toBe('stairs2');
  });
});
