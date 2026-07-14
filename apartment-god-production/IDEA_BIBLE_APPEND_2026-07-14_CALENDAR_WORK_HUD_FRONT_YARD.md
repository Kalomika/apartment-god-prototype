# Idea Bible Append: Calendar, Work Schedule HUD, Phone Calendar, and Front Yard Commute Slice

Date: 2026-07-14 CT
Branch: phaser-migration
Status: PLANNED before implementation, then update status in execution log after code work.
Backup branch: backup/phaser-migration-before-calendar-work-hud-2026-07-14
Runtime files changed at capture time: no
Render playable branch updated: no
Render settings changed: no

## Kam Directive

Kam reported that residents appear to be around the house constantly and the household money has seemed unchanged, raising concern that the daily work cycle, calendar, day progression, or paycheck loop may be broken or no longer visible. The prior design intent was to reduce normal resident work to fewer days per week so there is more at-home life gameplay, but the system still needs real work responsibility, departures, returns, and pay.

Kam wants the repo audited to determine what was supposed to be done, what actually got done, what regressed, and why, instead of blindly building a duplicate system.

## Calendar and HUD Intent

The game must expose the simulation date directly in the top HUD without flooding the screen. The preferred compact HUD text is:

```txt
Y1 | Mon Mar 3 | 8:42 AM
```

Calendar information must start at Year 1, not Year 0 and not a real world year like 2004. Reset should return the save to the first day of Year 1. After 12 in game months, the calendar advances to Year 2.

The top left of the HUD should prioritize the compact calendar readout. Money and other HUD items should shift across or below as needed so the calendar is the first visible simulation readout.

The cell phone should also expose the expanded calendar and work information immediately when opened or through a clear calendar/work surface, including year, weekday, month, date, time, season if available, resident work days, and whether today is a work day.

## Time Scale Intent

The existing intended scale remains:

```txt
1 real minute = 1 in game hour
```

Audit and preserve this if it already exists.

## Work Schedule Intent

Default resident jobs should usually use a 3 day work week unless the existing career system has a better grounded template. A 3 day default is preferred because Apartment God should not feel like a chore simulator where everyone is gone constantly, but work must still matter enough for money, schedule, and responsibility systems.

The work system should be driven by the calendar/day of week, not vague ad hoc timers. Residents should be able to have differing work templates eventually. The AI brain/autonomy must respect work schedules without fighting guided player commands.

## Regression Questions To Answer

- Does a calendar system already exist?
- Does a year/month/day/weekday system exist?
- Is the 1 real minute = 1 in game hour rule still active?
- Is reset returning the calendar to Year 1 Day 1?
- Does the career/work system still assign schedules?
- Are residents leaving for scheduled shifts?
- Are residents returning from scheduled shifts?
- Are paychecks still applied?
- Is the HUD hiding the calendar/time state?
- Does the phone already contain calendar/work information?

## Front Yard / South Section Future Intent

After the time/calendar/work foundation is healthy, build a South front property slice opposite the backyard. The South section should include front yard, driveway, garage exit path, bushes, front gate or property edge, and the neighborhood road taking the bottom half of that section. Vehicle departures should eventually show the car backing out or turning in the driveway, entering the road, and driving off screen instead of simply disappearing from the garage.

This front yard and road slice is planned after the calendar/work visibility and scheduler health are confirmed.

## Do Not Lose

Do not let this directive disappear as chat-only memory. If runtime implementation cannot be completed in one pass, keep the unimplemented items in the log and matrix as PLANNED, PARTIAL, or NEEDS_TESTING.