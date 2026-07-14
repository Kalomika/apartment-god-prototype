# Ongoing Design Log Append: Calendar Work HUD Audit and Implementation

## 2026-07-14 CT, Calendar Work HUD and Work Schedule Audit

Status: NEEDS_TESTING
Branch: phaser-migration
Commit:
- ce7fc4d32c3f1b1c127c2182bdc71292046b2ad3, Capture calendar work HUD and front yard directive
- 7d48cae46fd9459b801b9ce3b9bb0098e4774015, Add explicit game time scale helper
- 4c4d96a85d994f6556de877d2ed40ee23ea1d53e, Add compact calendar display helpers
- acfa4ec9b32b405695a307e532ab20ae11656c2d, Cache bust calendar work HUD runtime entry
- b83b4258d70cb0d8dfc8967dd609012b7f8a2a3e, Add compact calendar HUD overlay
- fd4d54ee472bcbfcfd51762ec3ee6116e3c8b95b, Use explicit one minute per hour game clock
- d79fa814583406979d432e81084b9f1e837d2dac, Make default careers use clearer three day work weeks
- 579c76ffffb5c952c3499e2c8bc7a0a89bad3761, Surface calendar and work status immediately in phone
- cd3b1fa95717c29fddde649cdd6149f1e4ed40f9, Prioritize compact calendar HUD readout
- 80d521bf891f48e7d1e80788b8dd8c2f589ca49e, Add calendar work HUD regression tests
Files changed:
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-14_CALENDAR_WORK_HUD_FRONT_YARD.md
- index.html
- src/main.js
- src/canvasRuntime.js
- src/timeSystem.js
- src/calendarDisplay.js
- src/careerSystem.js
- src/appMenu.js
- src/ui.js
- tests/calendar-work-hud.test.js
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-calendar-work-hud-2026-07-14

Summary:
Kam reported that residents appeared to be home constantly, household money seemed unchanged, and there was no obvious way to tell whether days, dates, work shifts, and pay were functioning. This pass audited the existing calendar and career systems, captured the directive in a repo-searchable idea append file, then implemented a compact top-left calendar HUD and phone-visible calendar/work status without building a duplicate calendar system.

Implementation details:

Audit result:

- A calendar system already existed in `src/calendarSystem.js` with Year 1 support, twelve 30 day months, weekday calculation, holidays, booking history, and phone calendar booking hooks.
- Reset already started at `state.time = 1440 + 6 * 60 + 45`, which resolves to Year 1, Month 1, Day 1, Monday, 6:45 AM because the calendar uses an epoch day offset.
- A career/work system already existed in `src/careerSystem.js` with tracks, schedules, pay, XP, promotions, last worked day, phone Career / Work menu, HUD career line, and autonomy hooks.
- Work completion already flowed through offsite travel rewards and `applyWorkCompletion`, which pays the worker and marks `lastWorkedDay`.
- The main reason Kam could not diagnose the system was visibility. The calendar was present but not prioritized in the HUD or immediately visible when opening the phone.
- A real timing mismatch was found: `canvasRuntime.js` advanced `state.time` by `dt * 0.6`, which means 36 in game minutes per real minute, not the intended 60. This was corrected through `src/timeSystem.js`.
- The default resident Storyboard Artist job was still four days per week. Several other tracks were also four day templates. These were changed to clearer three day schedules so the household has more visible at-home life without deleting work responsibility.

Runtime changes:

- Added `src/timeSystem.js` so the time scale is explicit and testable as `1 real minute = 1 in game hour`.
- Updated `src/canvasRuntime.js` to advance time through `advanceGameClock(state, dt)` instead of the old `dt * 0.6` logic.
- Added `src/calendarDisplay.js` for compact HUD and phone calendar display helpers.
- Added a compact top-left `#hud-calendar-pill` overlay to `index.html` showing the preferred style: `Y1 | Mon Jan 1 | 6:45 AM`.
- Updated `src/ui.js` so the top-left overlay updates every HUD render and the World panel now prioritizes compact calendar, money, plans, area, speed, autonomy, career, and work status.
- Updated `src/appMenu.js` so opening the Cell immediately shows compact date/time and selected actor work status before deeper phone menu options.
- Updated the Calendar phone surface with Year, long date, time, week, holiday, time scale, and work status rows.
- Updated all career templates in `src/careerSystem.js` to three day work weeks.
- Added `careerScheduleStatusLine(state, actor)` so the HUD and phone can say if work is due now, already done today, missed, later today, or off today.
- Added regression tests in `tests/calendar-work-hud.test.js` for reset date, Year 2 rollover, time scale, three day schedules, and work due status.

Testing performed:

- GitHub file inspection only.
- No local `npm test`, `npm run check`, or browser test was possible from this connector-only environment.
- Added a Vitest regression file, but the test suite still needs to be run in a real checkout.

Testing requested:

Open the playable branch after Kam explicitly requests a Render playable update and `main` is safely fast-forwarded from `phaser-migration` with a fresh main backup. Then test:

1. Boot safety and no blank canvas.
2. Confirm the top-left HUD shows `Y1 | Mon Jan 1 | 6:45 AM` after Reset.
3. Leave the game running at 1x and verify one real minute advances one in game hour.
4. Open Cell and confirm date/time and work status are immediately visible before digging into phone menus.
5. Open Cell > Calendar and confirm Year, weekday, month, date, time, week, holiday, time scale, and selected actor work status are visible.
6. Open Cell > Career / Work and confirm schedules are three day templates.
7. Let the game reach a scheduled work window and confirm resident autonomy can send the actor to work if needs are not critical.
8. Confirm work uses the vehicle departure/return flow and pay increases money after completion.
9. Confirm one actor away at work still leaves remaining home actors playable.

Known risks:

- Browser behavior is not verified yet.
- The work system existed before this pass and remains routed through vehicle/offsite travel, so any existing vehicle departure or return bug can still make work look broken even if the career scheduler is correct.
- Old refresh saves may contain prior career states, but career schedules are track based, so track schedule changes should apply after reload.
- The HUD overlay uses inline CSS in `index.html` for the compact pill to avoid a risky full stylesheet rewrite from a compressed one-line file. This should eventually be moved into `styles.css` during a safe CSS cleanup.
- The phone is still menu based, not a full custom phone app screen. This pass makes the critical data immediately visible but does not redesign the whole phone UI.

Follow ups:

- Run `npm test`, `npm run check`, and `npm run build` from a real checkout.
- Browser test the HUD pill, phone Calendar, phone Career / Work, scheduled work departure, paycheck, and return.
- If the work cycle still looks broken in browser, inspect vehicle/offsite completion first because the career system already pays on work completion.
- After calendar/work visibility and scheduler health are verified, implement the planned South Front Yard slice with driveway, front lawn, bushes, gate/property edge, road frontage, and visible vehicle departure onto the neighborhood street.
