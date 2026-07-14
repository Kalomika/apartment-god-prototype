# Ongoing Design Log Append: Job Workload Tier Correction

## 2026-07-14 CT, Job Workload Tier Correction

Status: NEEDS_TESTING
Branch: phaser-migration
Commit:
- 2348204fd26fa64007e0cf0ad04cb5ef69d32b0d, Capture job workload tier correction directive
- 0628efd1beb9a6e19faf5f468e35a8ac380781b2, Model job-specific workload tiers
- 04c494b9a9251cc91614437a712e18f501e05f03, Allow work trip duration to follow job workload
- a9f7ea9b811e2d4b7c7779c0a9815384014d07f1, Normalize work offsite length from career workload
- f9f476433cb3abda46a6d3814e497c8fb02a85dd, Test job workload tiers instead of blanket three day rule
Files changed:
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-14_JOB_WORKLOAD_TIERS.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_JOB_WORKLOAD_TIERS.md
- src/careerSystem.js
- src/travelLocations.js
- tests/calendar-work-hud.test.js
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-workload-tier-correction-2026-07-14

Summary:
Kam caught an important design issue in the previous calendar/work HUD pass: turning every job into a three day schedule was too blunt. Jobs should have workloads that depend on job type, pay, flexibility, and consequence weight. This correction keeps at-home life as the goal but changes the model from one universal three day rule to job-specific workload tiers.

Implementation details:

- Added `workloadLabel` and `workloadTier` to career tracks.
- Restored higher demand for high pay or physical jobs instead of forcing every role into a three day schedule.
- Storyboard Artist is now a four day, full day production schedule: Mon, Tue, Thu, Fri, 9 AM to 5 PM.
- Remote Support Lead remains shorter and more at-home friendly: Mon, Wed, Fri, 9 AM to 2 PM.
- Movie Theater Crew is an evening part time job: Fri, Sat, Sun, 6 PM to 11 PM.
- Airline Ground Crew is now a full day physical job: Tue, Wed, Fri, Sat, 7 AM to 3 PM.
- Freelance Animator is a long flexible creative block job: Tue, Thu, Sat, 11 AM to 5 PM.
- Updated `workDueText` and `careerScheduleStatusLine` so HUD/phone rows expose the workload type, not only schedule and pay.
- Updated `applyWorkCompletion` so logs and work history record the actual shift hours instead of always saying four hour shift.
- Added `workOffsiteDurationForActor` so longer workload tracks stay offsite longer than shorter remote work tracks.
- Updated `travelLocations.js` so work offsite duration is normalized from the actor's career workload when the work job begins.
- Updated regression tests to reject the blanket three day rule and verify varied workload tiers.

Testing performed:

- GitHub file inspection only.
- No local `npm test`, `npm run check`, or browser test was possible from this connector-only environment.
- Added and updated Vitest tests, but the suite must be run in a real checkout.

Testing requested:

Run:

```txt
npm test
npm run check
npm run build
```

Browser test after a safe main playable update if Kam requests it:

1. Open Cell > Career / Work.
2. Confirm career rows show varied workload labels and not every job is three days.
3. Confirm high pay or physical jobs show longer shifts and stronger tradeoffs.
4. Start Resident work and confirm the offsite work phase lasts longer than a shorter remote work shift.
5. Confirm money increases and work history logs the correct shift hours after work completes.
6. Confirm one actor can still remain home and playable while the other works.

Known risks:

- Browser behavior is not verified yet.
- Work offsite length now follows career workload. If it feels too long or too short, tune `WORK_REAL_SECONDS_PER_SHIFT_HOUR` in `src/careerSystem.js`.
- This correction changes pay, fatigue, and weekly availability balance. It needs playtest feel review, not just code inspection.
- Vehicle/offsite bugs can still make work look broken even when the career workload math is correct.

Follow ups:

- Add job consequence tiers later: late warning severity, missed-shift risk, remote work flexibility, sick day/PTO logic, commute burden, and job loss risk by track.
- Eventually make some remote/freelance work happen at desk/laptop instead of every work shift using vehicle offsite travel.
