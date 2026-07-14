import { describe, expect, it } from 'vitest';
import { calendarCompactHudLine, calendarPhoneSummaryRows } from '../src/calendarDisplay.js';
import { CAREER_TRACKS, careerScheduleStatusLine } from '../src/careerSystem.js';
import { createState } from '../src/state.js';
import { advanceGameClock, GAME_MINUTES_PER_REAL_SECOND } from '../src/timeSystem.js';

describe('calendar work HUD foundation', () => {
  it('renders a compact Year 1 date from reset state', () => {
    const state = createState();

    expect(calendarCompactHudLine(state)).toBe('Y1 | Mon Jan 1 | 6:45 AM');
    expect(calendarPhoneSummaryRows(state)).toContain('Year 1');
    expect(calendarPhoneSummaryRows(state)).toContain('Mon, January 1');
  });

  it('advances to Year 2 after twelve thirty day months', () => {
    const state = { time: (1 + 360) * 1440 + 8 * 60 };

    expect(calendarCompactHudLine(state)).toContain('Y2 |');
    expect(calendarCompactHudLine(state)).toContain('Jan 1');
  });

  it('keeps one real minute equal to one in game hour', () => {
    const state = { time: 0 };

    expect(GAME_MINUTES_PER_REAL_SECOND).toBe(1);
    advanceGameClock(state, 60);

    expect(state.time).toBe(60);
  });

  it('keeps default career templates to three work days each', () => {
    expect(CAREER_TRACKS.every(track => track.days.length === 3)).toBe(true);
    expect(CAREER_TRACKS.find(track => track.id === 'storyboard_artist')?.days).toEqual([1, 3, 5]);
  });

  it('shows work status from the phone and HUD helper', () => {
    const state = createState();
    const resident = state.entities.find(entity => entity.id === 'resident');

    expect(careerScheduleStatusLine(state, resident)).toContain('Work: today');

    state.time = 1440 + 10 * 60;

    expect(careerScheduleStatusLine(state, resident)).toContain('Work: due now');

    state.time = 2 * 1440 + 8 * 60;

    expect(careerScheduleStatusLine(state, resident)).toContain('Work: off today');
  });
});
