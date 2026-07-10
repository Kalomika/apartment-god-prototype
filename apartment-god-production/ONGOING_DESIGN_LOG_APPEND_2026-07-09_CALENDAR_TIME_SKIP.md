## 2026-07-09 10:32 PM CT, Calendar Event Time Skip

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: latest implementation before this append 9b39754b7a9eb9aed7433468c83ed15d8a6e7886
Files changed: src/calendarSystem.js, src/appMenu.js, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-09_CALENDAR_TIME_SKIP.md
Runtime files changed: yes
Render playable branch updated: pending main mirror
Backup branch: backup/phaser-migration-before-calendar-time-skip-2026-07-09

Summary:
Added a calendar event selection flow so Kam can tap an upcoming event in the phone calendar, view the event details, and choose whether to skip game time directly to that event.

Implementation details:
- Updated Cell > Calendar upcoming event rows so tapping an event opens an event detail menu instead of doing nothing.
- Added event detail menu rows for event time, status, Skip to this event, and Back to Calendar.
- Added a confirmation menu that asks before time skip: Yes, skip to the event, or No, stay here.
- Added `skipToBooking` in `src/calendarSystem.js`.
- Time skip refuses to run if the household is already offsite or in a vehicle departure or return transition.
- Time skip advances the game clock to the event start minute.
- Time skip applies light passive need changes for skipped time, including hunger, bladder, freshness, fun, energy, and stamina changes.
- Sleepish actors recover energy and stamina during skipped time.
- After a skip, stale paths, targets, action timers, queued tasks, and temporary carried items are cleared so actors do not remain frozen in a previous activity after the time jump.
- The booked actor gets an action label that the event is due, so the existing calendar runtime can start the due event on the next tick.

Testing performed:
GitHub file inspection only. No local npm build or Render browser test was performed in this chat.

Testing requested:
After main is updated, test https://apartment-god-phaser.onrender.com. Reset, open Cell > Calendar, book Movie Ticket in 10 minutes, tap the upcoming Movie Theater entry, confirm the detail menu opens, tap Skip to this event, confirm Yes, and verify the clock jumps to the event time and the event attempts to start. Also test No, stay here, and confirm it returns to the event detail without jumping time.

Known risks:
This is a runtime time jump feature. It intentionally clears current household action state so the event can start cleanly, but it has not been browser verified. The passive need drain is deliberately light and will need balancing after testing.

Follow ups:
If this works, add richer calendar event cards, cancel or reschedule event, partner invitation on booked events, recurring work and chore blocks, PTO and missed work consequences, and optional skip to morning or skip to next scheduled household event.
