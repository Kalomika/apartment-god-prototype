import { describe, expect, it } from 'vitest';
import { calendarCompactHudLine, calendarPhoneSummaryRows } from '../src/calendarDisplay.js';
import { CAREER_TRACKS, careerScheduleStatusLine, workOffsiteDurationForActor } from '../src/careerSystem.js';
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

  it('uses job-specific workload tiers instead of forcing every job to three days', () => {
    const storyboard = CAREER_TRACKS.find(track => track.id === 'storyboard_artist');
    const remote = CAREER_TRACKS.find(track => track.id === 'remote_support');
    const airline = CAREER_TRACKS.find(track => track.id === 'airline_ground');
    const freelance = CAREER_TRACKS.find(track => track.id === 'freelance_animator');

    expect(storyboard?.days.length).toBe(4);
    expect(storyboard?.endHour - storyboard?.startHour).toBe(8);
    expect(remote?.days.length).toBe(3);
    expect(remote?.endHour - remote?.startHour).toBe(5);
    expect(airline?.days.length).toBe(4);
    expect(airline?.endHour - airline?.startHour).toBe(8);
    expect(freelance?.days.length).toBe(3);
    expect(freelance?.endHour - freelance?.startHour).toBe(6);
  });

  it('shows work status from the phone and HUD helper', () => {
    const state = createState();
    const resident = state.entities.find(entity => entity.id === 'resident');

    expect(careerScheduleStatusLine(state, resident)).toContain('Work: today');
    expect(careerScheduleStatusLine(state, resident)).toContain('Full day production schedule');

    state.time = 1440 + 10 * 60;

    expect(careerScheduleStatusLine(state, resident)).toContain('Work: due now');

    state.time = 3 * 1440 + 8 * 60;

    expect(careerScheduleStatusLine(state, resident)).toContain('Work: off today');
  });

  it('makes higher workload shifts stay offsite longer than shorter remote shifts', () => {
    const state = createState();

    const residentWorkDuration = workOffsiteDurationForActor(state, 'resident');
    const girlfriendWorkDuration = workOffsiteDurationForActor(state, 'girlfriend');

    expect(residentWorkDuration).toBeGreaterThan(girlfriendWorkDuration);
  });
});
