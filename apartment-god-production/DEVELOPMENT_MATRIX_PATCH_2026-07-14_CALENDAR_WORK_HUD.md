# Development Matrix Patch: Calendar Work HUD and Work Schedule Visibility

Date: 2026-07-14 CT
Branch: phaser-migration
Status: NEEDS_TESTING
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-calendar-work-hud-2026-07-14
Related log append: apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_CALENDAR_WORK_HUD.md

This patch should be merged into `apartment-god-production/DEVELOPMENT_MATRIX.md` during the next safe canonical matrix sync.

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Calendar and game clock | NEEDS_TESTING | `src/calendarSystem.js`, `src/calendarRuntime.js`, `src/calendarDisplay.js`, `src/timeSystem.js`, `src/canvasRuntime.js`, `src/ui.js`, `tests/calendar-work-hud.test.js` | Calendar already existed with Year 1, twelve 30 day months, weekday/date calculation, bookings, holidays, and phone calendar hooks. This pass made the time scale explicit as `1 real minute = 1 in game hour`, fixed the old `dt * 0.6` clock drift, added compact top-left HUD display, and added phone summary rows. | Run tests and browser verify reset date, live time progression, Year 2 rollover, phone Calendar display, and HUD visibility. |
| Career system | NEEDS_TESTING | `src/careerSystem.js`, `src/appMenu.js`, `src/autonomy.js`, `src/travelLocations.js`, `src/ui.js`, `tests/calendar-work-hud.test.js` | Career system already existed with tracks, schedules, pay, XP, promotions, last worked day, phone menu, HUD line, and autonomy work hook. This pass changed default career templates to clearer three day work weeks and added `careerScheduleStatusLine` for HUD and phone diagnosis. | Browser test scheduled work departure, work completion, paycheck, last worked day, missed shift status, phone Career / Work rows, and remaining home actor playability. |
| HUD calendar visibility | NEEDS_TESTING | `index.html`, `src/ui.js`, `src/calendarDisplay.js` | Added compact top-left overlay readout in the preferred style: `Y1 | Mon Jan 1 | 6:45 AM`. Money remains in the World panel directly below the prioritized calendar information. | Browser test on mobile and desktop that the pill is readable, not too large, does not block controls, and updates every in game minute. |
| Mobile phone and menus | PARTIAL | `src/appMenu.js`, `src/ui.js`, `styles.css` | Opening Cell now immediately shows compact date/time and selected actor work status before deeper menu options. Calendar tab adds Year, date, time, week, holiday, time scale, and work status. This is still menu based, not a full phone app redesign. | Mobile test Cell home, Calendar, Career / Work, scrolling, and bottom control reachability. |
| South Front Yard and neighborhood road slice | PLANNED | Idea append and log append | Kam wants a South front property section after calendar/work foundation is healthy. The slice should include front yard, driveway, garage exit path, bushes, gate/property edge, and bottom-half road frontage where cars back out or turn and drive off screen. | Do not implement until calendar/work visibility and work/vehicle departure are browser verified. Create layout backup before touching world layout or vehicle system. |

## Object Interaction Matrix Updates

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| HUD calendar pill | Top-left game overlay | NEEDS_TESTING | Always visible date/time/year readout | Player UI | Compact pill, not screen-flooding, top-left priority | Overlay could cover gameplay or controls on small screens | Test mobile and desktop HUD readability. |
| Cell Calendar rows | Phone menu | NEEDS_TESTING | View date, time, Year, week, holiday, bookings, time scale, work status | Player UI | Immediate text rows before deeper phone options | Phone menus can become too tall on mobile | Test Cell home and Calendar scroll. |
| Cell Career / Work rows | Phone menu | NEEDS_TESTING | View work status, schedule, work now, quit, apply | Human actors | Clear status when due, off, worked, missed, or later today | Scheduler may be correct while vehicle/offsite flow still fails | Test due shift and Work Shift Now. |

## Animation Matrix Updates

| Animation Or Pose | Current Status | Required Quality Target | Needed Directions | Frame Need | Current Fallback | Test Notes |
|---|---|---|---|---|---|---|
| Work shift departure | NEEDS_TESTING | Walk to vehicle, vehicle leaves, calendar driven | Route dependent | Transition | Existing vehicle departure system | Test scheduled work during work window after clock fix. |
| Work shift return and paycheck | NEEDS_TESTING | Vehicle returns, actor exits, money increases | Route dependent | Transition | Existing offsite job and vehicle return | Test money increases after work completion and last pay updates. |
| Future front driveway departure | PLANNED | Car backs out or turns through driveway then road | South frontage | Transition plus road drive-off | Not built | Requires South Front Yard slice after foundation verification. |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Calendar reset HUD | Critical | NEEDS_TESTING | Press Reset and confirm the top-left pill reads Year 1, Monday, first month/day, and 6:45 AM equivalent. |
| Clock scale | Critical | NEEDS_TESTING | At 1x, run for one real minute and confirm one in game hour passes. At 3x, confirm speed multiplier still behaves proportionally. |
| Year rollover | High | NEEDS_TESTING | Use tests or debug time to advance past twelve 30 day months and confirm Year 2, Month 1, Day 1 display. |
| Phone immediate calendar status | Critical | NEEDS_TESTING | Open Cell and confirm date/time and selected actor work status are visible immediately before selecting deeper apps. |
| Phone Calendar details | High | NEEDS_TESTING | Open Cell > Calendar and confirm Year, weekday, month, date, time, week, holiday, time scale, bookings, and work status rows. |
| Career three day schedules | Critical | NEEDS_TESTING | Open Cell > Career / Work and confirm all available jobs show three day schedules. |
| Scheduled work autonomy | Critical | NEEDS_TESTING | Let time reach a work window with needs not critical and confirm autonomy can send the actor to work. |
| Work paycheck | Critical | NEEDS_TESTING | Complete a work shift and confirm money increases, last pay updates, and actor returns. |
| One actor leaves | Critical | NEEDS_TESTING | Send one actor to work and confirm remaining home actor stays playable. |
| South Front Yard slice | Medium | PLANNED | After foundation passes, build and test driveway/road vehicle departure. |

## Risk Matrix Updates

| Risk Area | Risk Level | Why It Is Dangerous | Required Protection |
|---|---|---|---|
| Calendar and game clock | Critical | If time scale or calendar day math is wrong, work, pay, bills, holidays, aging, and bookings all become unreliable. | Keep clock math centralized in `src/timeSystem.js`; keep calendar display tested; browser test live progression. |
| Work scheduler | High | Scheduler can appear broken if calendar, autonomy, vehicle departure, offsite completion, or pay completion breaks anywhere in the chain. | Test each stage separately: due status, autonomy decision, startOffsite, vehicle departure, offsite completion, paycheck, return. |
| HUD overlay | Medium | A persistent overlay can reduce playable space or hide screen content if too large. | Keep pill compact, pointer-events none, mobile reviewed. |
| Phone menu visibility | Medium | Menu based phones can become tall and hard to use on mobile. | Test scroll and bottom control reachability after adding rows. |
| Front yard expansion | High | New South section touches world layout, camera navigation, vehicle routing, and future road behavior. | Do not begin until calendar/work/vehicle foundation passes. Create backup before layout/vehicle changes. |

## Branch and Render Matrix Update

| Branch Or Target | Role | Current Rule | Update Permission |
|---|---|---|---|
| `phaser-migration` | Active development branch | Calendar/work HUD pass committed here. | Needs test/check/build and browser verification before any main update. |
| `main` | Render playable branch | Not touched by this pass. | Only update after Kam explicitly asks for Render playable access, with a fresh main backup first. |
| Render settings | Deployment configuration | Not changed. | No changes unless Kam explicitly asks and environment allows it. |
