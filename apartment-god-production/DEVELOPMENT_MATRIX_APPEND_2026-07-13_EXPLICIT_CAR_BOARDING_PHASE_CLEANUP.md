# Development Matrix Append, 2026-07-13, Explicit Car Boarding Phase Cleanup

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-explicit-car-boarding-phase-cleanup-2026-07-13

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Vehicle Matrix | Car boarding phase names | BROAD | PARTIAL, NEEDS_BROWSER_TESTING | Generic phases were replaced with explicit assigned-door, pop-out-seat, seated-traveler, retract, and lock phases. |
| Vehicle Matrix | Car departure sequence | PARTIAL | PARTIAL, NEEDS_BROWSER_TESTING | Departure now uses explicit phases from unlock through assigned doors, pop out seats, retraction, lock, garage opening, and leaving. |
| Vehicle Matrix | Car return sequence | PARTIAL | PARTIAL, NEEDS_BROWSER_TESTING | Return now has explicit assigned-door opening, return pop-out seat extension, traveler step-out, retraction, closing, and return lock phases. |
| Vehicle Matrix | Vacation luggage | PARTIAL | PARTIAL, NEEDS_BROWSER_TESTING | Luggage phases were renamed explicitly and preserved. |
| Visual Matrix | Pop out seats | PARTIAL | PARTIAL, NEEDS_BROWSER_TESTING | Renderer now keys off explicit phase names, not broad `boarding` or `door_opening` state labels. |
| Asset Matrix | Modular vehicle PNG pieces | STILL_NEEDED | STILL_NEEDED | Runtime cleanup does not replace the need for final modular PNG doors, seats, trunk, luggage, and passenger pieces. |

## Required browser checks

```txt
Single traveler car trip.
Multi traveler car trip.
Vacation luggage trip.
Return from car trip.
Door count equals occupied assigned seats.
Seats extend and retract visibly.
Bike/motorbike/ATV still mount correctly and do not use car phase logic.
```
