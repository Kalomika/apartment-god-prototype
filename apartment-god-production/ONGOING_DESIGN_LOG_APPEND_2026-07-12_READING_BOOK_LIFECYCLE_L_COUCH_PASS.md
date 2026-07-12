# 2026-07-12, Reading Book Lifecycle and L Couch Pass

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-reading-book-messiness-pass-2026-07-12

## Files changed

```txt
src/bookSystem.js
src/bookRender.js
src/actions.js
src/ui.js
src/calendarRuntime.js
src/rendering.js
src/state.js
```

Runtime files changed: yes
Vehicle files changed: no
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Summary

Added a first real book lifecycle instead of broad in place reading. Books can now be pulled from the bookshelf, carried to a reading seat, read on the L couch or porch reading chair, returned to the shelf, or left on a nearby surface when the actor is rushed or interrupted. Loose books create a tidiness issue and schedule a return book chore on the calendar.

## Implementation details

- Added `bookSystem.js` for book state, reading seat selection, book carrying, finish logic, loose book placement, tidiness hits, and calendar return chores.
- Added `bookRender.js` for first pass modern L couch overlay, front porch reading chairs, loose book visuals, and tidiness cue.
- Bookshelf `read` now routes through the book lifecycle instead of instantly reading at the shelf.
- Reading seat choice uses the L couch left seat by default, the L couch chaise when another actor is already using the couch, and porch reading seating when timing allows.
- If the actor finishes reading and has no near commitment or urgent need, they route back to the shelf with the book.
- If the actor is time pressed, low on urgent needs, or is interrupted by a player command, the book is left on a visible surface instead of the floor.
- Loose book mess raises a room tidiness issue and puts Return loose book on the calendar.
- Calendar runtime can now start the return loose book chore when due.
- Player commands call the book interruption hook before clearing actor state, so a carried or active book is left on a surface before the actor moves away.

## Testing performed

Code was verified by source inspection after GitHub writes.

No browser test was performed.

## Testing requested

```txt
Open Main House.
Use Bookshelf > Read Book or Pull Book / Read.
Confirm actor pulls a book and walks to a reading seat.
Start another actor watching TV, then make the other actor read and confirm they choose the L couch chaise instead of colliding with the TV watcher.
Let reading finish and confirm the actor either returns the book or leaves it on a surface based on timing/needs.
Interrupt a reading actor with a floor tap and confirm the book appears on the couch/chair/table rather than vanishing or landing on the floor.
Watch calendar/log for Return loose book.
Let that chore fire and confirm the actor picks up the loose book and returns it to the shelf.
Confirm no vehicle files changed.
```

## Known risks

This is still a first pass Canvas/vector implementation, not final PNG furniture or book sprites. The book return chore currently assumes the actor can reach the loose book on the same floor; cross floor loose book cleanup needs a deeper routing pass. The L couch is currently a visual and behavior overlay, not a full collision geometry replacement, to avoid breaking movement again.

## Follow ups

```txt
Add proper seat occupancy reservations per couch seat.
Add outdoor chair objects/click menus if Kam wants direct chair interaction.
Add towel mess lifecycle using the same surface/tidiness/calendar chore pattern.
Add dirty dish, clothing pile, and towel return chores under the same imperfection system.
Tie tidiness preference traits into autonomy so meticulous actors notice and clean messes sooner.
```
