# Idea Bible Append: Job Workload Tiers

Date: 2026-07-14 CT
Branch: phaser-migration
Status: PLANNED before implementation, then update execution log after code work.
Backup branch: backup/phaser-migration-before-workload-tier-correction-2026-07-14
Runtime files changed at capture time: no
Render playable branch updated: no
Render settings changed: no

## Kam Correction

Kam caught that the previous calendar/work HUD pass overcorrected by turning every career into a three day work week. That is not the right long term design.

Jobs should not all have the same workload. The workload should depend on the job type, pay, status, flexibility, and consequence weight.

## Correct Design Direction

Apartment God should support varied job workloads:

- Part time or lower pay jobs can be fewer days or shorter shifts.
- Higher pay jobs can require fuller shifts, more weekly work days, more fatigue, more missed-shift consequence, or less flexibility.
- Freelance or creative jobs can pay well but be irregular or block longer creative work sessions instead of normal clock-in shifts.
- Remote jobs can give more at-home time but may pay less or create stamina/fun/focus consequences.
- Physical higher pay jobs can demand longer shifts and more stamina/freshness cost.

The schedule should remain calendar driven and visible in HUD/phone. The phone should make it obvious whether a role is part time, full day, remote, freelance, flexible, or physical.

## Immediate Correction Needed

Undo the blanket three day rule. Replace it with job-specific workload tiers and work windows.

Do not lose the original reason for the three day pass: Apartment God should still preserve at-home life and not become a chore simulator. The fix is not every job three days. The fix is varied jobs with tradeoffs.
