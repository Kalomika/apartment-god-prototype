## 2026-07-09 10:58 PM CT, Calendar Event Management, Bed Orientation, Privacy Overlay, Audit Hold

Status: NEEDS_TESTING, HOLD_MAIN_PUSH
Branch: phaser-migration
Commit: latest implementation before this append 4205e6201de7aaede0fbda56daeee31239d16045
Files changed in this unpushed Render batch: src/calendarSystem.js, src/calendarRuntime.js, src/calendarSkipSystem.js, src/appMenu.js, src/canvasRuntime.js, src/world.js, src/state.js, src/rendering.js, src/afterEntityOverlays.js, src/objectCorrectiveOverlays.js, src/travelLocations.js, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-09_CALENDAR_TIME_SKIP.md, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-09_CALENDAR_BED_PRIVACY_AUDIT_HOLD.md
Runtime files changed: yes
Render playable branch updated: no
Main updated: no
Backup branch: backup/phaser-migration-before-calendar-time-skip-2026-07-09

Summary:
Kam clarified the calendar event skip and bedroom direction rules during implementation. This batch remains on phaser-migration only and should not be mirrored to main or Render until the current branch audit is clean and Kam explicitly approves the Render branch update.

Implemented:
- Calendar event rows now open event detail instead of being passive rows.
- Event detail includes event time, cost and length, status, reschedule, update, cancel, and conditional skip.
- Cancel event asks for confirmation.
- Reschedule event supports quick time choices.
- Update event currently supports vacation events with change vacation spot and change trip length.
- Booking and updating now guard against spending below zero by checking current money minus scheduled calendar reservations.
- Skip option now points to the prep window instead of directly to the event.
- Skip option hides if the current time is already inside the one in game hour prep window.
- Skip to event now jumps to one in game hour before the event, or to the morning start window if the event is earlier than that.
- Time skip creates a visible recap overlay with day check marks and a fast activity bar style indicator.
- Events passed during a skip are marked fulfilled during skip or missed if money is insufficient.
- Time skip recap is kept outside the normalized calendar object so the HUD calendar refresh does not erase it.
- Removed the stale direct calendar skip function from calendarSystem so no menu or future caller should jump straight to the event by mistake.
- Calendar runtime now carries booked duration and extra vacation cost into a pending offsite handoff.
- When the vehicle creates the offsite job, calendar runtime applies booked duration and extra cost safely without rewriting vehicle boarding logic.
- Offsite progress now respects bookedDuration instead of always using base destination duration.
- Bedroom bed is now oriented to the west wall with headboard and pillows on the west side.
- Bedroom Wall TV was added to the east bedroom wall to support future bed TV and bed lounging features.
- Morning spawn positions now place the two people in north and south bed lanes with their heads toward the west pillows and feet toward the east.
- Runtime bed pose orientation now forces sleep, nap, waking, and bed actions to west headboard orientation.
- Added corrective bedroom bed overlay so the old north headboard bed art is covered by the correct west headboard bed art.
- Added bed making visual gesture: animated sweep lines and a TIDYING BED label when Make Bed is active.
- Added post entity shower privacy overlay with a rectangular pixelated censor mosaic drawn after actors, plus a clearer clothes pile on the floor near the shower.

Audit notes:
- Kam did not attach a video in this turn. The earlier mention of a video file was a misread of Kam's request to audit current game errors before pushing.
- GitHub compare shows phaser-migration is ahead of main and main has not been updated by this batch.
- The branch contains calendar, bedroom bed orientation, privacy overlay, render hook, state spawn, offsite duration progress, and log changes relative to main.
- The previously noted vehicle offsite duration handoff issue was patched by using a pending calendar offsite handoff in calendarRuntime and bookedDuration support in travelLocations.

Testing performed:
GitHub file inspection and branch compare only. No local npm build, no browser test, and no Render test performed in this chat.

Testing requested before main mirror:
Continue the code audit before main mirror. When eventually tested, check Cell > Calendar event detail, cancel, reschedule, update vacation spot, update trip length, skip option hiding inside the final hour, skip landing one in game hour before the event, skip recap check marks, booked vacation length, extra vacation cost, bedroom bed west headboard orientation, morning sleep positions, Make Bed visual gesture, and shower censor plus floor clothes pile.

Known risks:
This batch touches calendar menu flow, runtime skip behavior, rendering order, state reset positions, bedroom object layout, and offsite duration progress. It is not yet browser verified and should not be called complete.

Follow ups:
Verify boot, add richer bed activity menu, add true room tidiness and cleanliness scoring, connect Make Bed to room tidiness, add bathroom sinks, and continue full activity animation coverage.
