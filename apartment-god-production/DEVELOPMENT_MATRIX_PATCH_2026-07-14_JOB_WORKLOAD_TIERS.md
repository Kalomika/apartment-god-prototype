# Development Matrix Patch: Job Workload Tiers

Date: 2026-07-14 CT
Branch: phaser-migration
Status: NEEDS_TESTING
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-workload-tier-correction-2026-07-14
Related log append: apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_JOB_WORKLOAD_TIERS.md

This patch should be merged into `apartment-god-production/DEVELOPMENT_MATRIX.md` during the next safe canonical matrix sync.

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Career workload tiers | NEEDS_TESTING | `src/careerSystem.js`, `src/travelLocations.js`, `src/appMenu.js`, `src/ui.js`, `tests/calendar-work-hud.test.js` | Replaced the blanket three day job assumption with job-specific workload tiers. Higher demand jobs can have longer shifts, more work days, higher pay, and stronger need costs. Lower pay or remote jobs can preserve more at-home life. | Run tests, then browser test phone Career / Work rows, scheduled work departure, offsite duration, paycheck, and return. |
| Career system | NEEDS_TESTING | `src/careerSystem.js`, `src/travelLocations.js`, `src/autonomy.js`, `src/appMenu.js` | Career rows now expose workload labels like full day production schedule, shorter remote steady shifts, evening part time shifts, full day physical shifts, and long flexible creative blocks. | Verify the workload labels are readable on mobile and the schedule tradeoffs feel right. |
| Work offsite duration | NEEDS_TESTING | `src/careerSystem.js`, `src/travelLocations.js` | Work offsite duration now normalizes from actor career workload. Longer/full day jobs stay away longer than shorter remote jobs. | Test Resident work versus Girlfriend work and confirm longer shifts feel visible but not tedious. |

## Career Track Snapshot

| Career | Status | Weekly Pattern | Shift Length | Workload Label | Balance Intent |
|---|---|---|---|---|---|
| Storyboard Artist | NEEDS_TESTING | Mon, Tue, Thu, Fri | 8h | Full day production schedule | Higher pay, more time cost, higher fatigue, less at-home time. |
| Remote Support Lead | NEEDS_TESTING | Mon, Wed, Fri | 5h | Shorter remote steady shifts | More at-home life, lower pay, lighter fatigue. |
| Movie Theater Crew | NEEDS_TESTING | Fri, Sat, Sun | 5h | Evening part time shifts | Lower pay, evening disruption, social/fun perks. |
| Airline Ground Crew | NEEDS_TESTING | Tue, Wed, Fri, Sat | 8h | Full day physical shifts | Higher pay, physical fatigue, freshness cost, travel perk. |
| Freelance Animator | NEEDS_TESTING | Tue, Thu, Sat | 6h | Long flexible creative blocks | Good pay, fewer days, creative relief, stronger isolation/focus cost. |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Job workload variety | Critical | NEEDS_TESTING | Open Cell > Career / Work and confirm every job does not have the same three day workload. |
| High demand job tradeoff | Critical | NEEDS_TESTING | Confirm Storyboard Artist and Airline Ground Crew have longer shifts/more days than Remote Support Lead. |
| Work status labels | High | NEEDS_TESTING | Confirm HUD and phone show workload label next to work status. |
| Work offsite duration by job | High | NEEDS_TESTING | Compare Resident Storyboard Artist shift duration against Girlfriend Remote Support Lead shift duration and confirm Resident remains away longer. |
| Pay and fatigue by workload | High | NEEDS_TESTING | Complete shifts for different jobs and confirm pay, energy, stamina, fun, social, and freshness effects reflect the track. |
| One actor still playable | Critical | NEEDS_TESTING | Send one actor to a longer work shift and confirm the other home actor remains playable without forced full-house time skip. |

## Risk Matrix Updates

| Risk Area | Risk Level | Why It Is Dangerous | Required Protection |
|---|---|---|---|
| Career balance | High | Pay, time away, fatigue, and at-home life can become unbalanced quickly. | Keep jobs varied and playtest the feel. Do not force every role into the same schedule. |
| Work offsite duration | Medium | Longer full day shifts can feel tedious if real-time absence is too long, while short shifts can make work look fake. | Tune `WORK_REAL_SECONDS_PER_SHIFT_HOUR` after browser testing. |
| Remote and freelance work | Medium | Current implementation still sends work through offsite travel even when some jobs should eventually happen at a desk or laptop. | Later split remote/freelance into home desk work where appropriate. |

## Branch and Render Matrix Update

| Branch Or Target | Role | Current Rule | Update Permission |
|---|---|---|---|
| `phaser-migration` | Active development branch | Job workload correction committed here. | Needs tests/build and browser verification before any main update. |
| `main` | Render playable branch | Not touched by this pass. | Only update after Kam explicitly asks for Render playable access, with a fresh main backup first. |
| Render settings | Deployment configuration | Not changed. | No changes unless Kam explicitly asks and environment allows it. |
