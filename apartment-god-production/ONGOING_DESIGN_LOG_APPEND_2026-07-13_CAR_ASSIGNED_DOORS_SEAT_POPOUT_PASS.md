# 2026-07-13, Car Assigned Doors and Seat Pop Out Pass

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-car-seat-popout-luggage-pass-2026-07-13

## Files changed

```txt
src/carSeatBoardingRenderer.js
src/renderDynamic.js
```

Runtime files changed: yes
Vehicle files changed: yes
Render playable branch updated: pending main sync after this log
Main updated in this specific commit: no
Deploy performed: no
Render settings changed: no
Protected repo touched: no

## Summary

Added the first real visual pass for the car boarding system Kam previously requested: only assigned doors open, and pop out seats appear outside the vehicle with the traveler visibly seated before retracting back into the car. This replaces the visual problem where any car boarding state opened broad car doors and made people simply vanish into the car.

## Implementation details

- Added `src/carSeatBoardingRenderer.js`.
- Car rendering now suppresses the old all-doors-open visual during animated trips.
- A car-specific boarding overlay draws only the doors matching assigned seat IDs.
- One traveler means one assigned door opens.
- Multiple travelers means only the doors for those travelers' assigned seats open, not every door on the car.
- Boarding phases now show an external pop out seat for each assigned seat.
- The seated traveler is drawn on that pop out seat.
- During door closing, the seat visually retracts back into the car.
- Existing luggage trunk loading remains in place and still draws luggage at/inside the trunk.

## Testing performed

Source verification by GitHub fetch/compare after commit.

No browser test was performed.

## Testing requested

```txt
Open https://apartment-god-phaser.onrender.com after main sync.
Start a one-person car trip from the garage.
Confirm only that person's assigned door opens.
Confirm a seat pops out and the person is visibly seated before the seat retracts.
Start a multi-person car trip.
Confirm only assigned occupied doors open, not every car door.
Confirm luggage still loads into the trunk for vacation trips.
Confirm bike/motorbike/ATV still use the mounted rider bike logic, not car doors.
```

## Known risks

This is a first runtime visual implementation. It does not yet add separate PNG seat/door pieces. It uses Canvas overlays matched to seat assignments. The underlying vehicle phase names still include broad labels like `door_opening` and `boarding`; a later deeper pass should rename and time these phases into fully explicit `assigned_doors_open`, `popout_seats_extend`, `travelers_sit`, and `seats_retract` steps.
