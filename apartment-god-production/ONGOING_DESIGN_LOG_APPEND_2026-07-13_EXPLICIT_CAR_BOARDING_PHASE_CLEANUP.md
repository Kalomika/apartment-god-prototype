# 2026-07-13, Explicit Car Boarding Phase Cleanup

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-explicit-car-boarding-phase-cleanup-2026-07-13

## Files changed

```txt
src/carSeatBoardingRenderer.js
src/vehicleSystem.js
```

Runtime files changed: yes
Vehicle files changed: yes
Render playable branch updated: pending main sync after this log
Main updated in this specific commit: no
Deploy performed: no
Render settings changed: no
Protected repo touched: no

## Summary

Cleaned up the broad car boarding phase names immediately instead of leaving them for a later pass. The car system now uses explicit phases for assigned occupied doors, pop out seat extension, travelers sitting on pop out seats, seat retraction, assigned door closing, and return exit phases.

## Implementation details

- Replaced generic car departure phase names such as `remote_unlock`, `door_opening`, `boarding`, `door_closing`, and `remote_lock` with explicit car phase names.
- New departure phases include:

```txt
car_remote_unlock_before_boarding
car_trunk_opening_for_luggage
car_luggage_loading_into_trunk
car_trunk_closing_after_luggage
car_assigned_doors_opening
car_popout_seats_extending
car_travelers_sitting_on_popout_seats
car_popout_seats_retracting
car_assigned_doors_closing
car_remote_lock_after_boarding
```

- New return phases include:

```txt
car_return_remote_unlock_before_exit
car_return_assigned_doors_opening
car_return_popout_seats_extending
car_return_travelers_step_out
car_return_popout_seats_retracting
car_return_luggage_unloading_from_trunk
car_return_trunk_closing_after_unload
car_return_assigned_doors_closing
car_return_remote_lock_after_exit
```

- Updated `carSeatBoardingRenderer.js` so it listens to these explicit phases instead of broad generic phase names.
- Bike, motorbike, and ATV mount/dismount phases were left separate from car logic.

## Testing performed

GitHub source verification and compare were performed.
No browser test was performed.

## Testing requested

```txt
Open https://apartment-god-phaser.onrender.com after main sync.
Start one-person car trip.
Confirm only assigned occupied door opens.
Confirm seat extends, traveler sits, seat retracts, assigned door closes, lock flashes.
Start multi-person car trip.
Confirm only occupied assigned doors open.
Start vacation car trip.
Confirm trunk luggage still opens, loads, closes, then assigned door/seat sequence runs.
Let car return.
Confirm return assigned doors and return pop out seats read correctly.
Confirm bike/motorbike/ATV still use bike mount logic.
```

## Known risks

This is still a Canvas/runtime implementation, not final modular PNG car door and seat pieces. Browser testing is needed to verify timing, visibility, and overlap.

Concurrent branch activity was detected, including an idea capture rule documentation update from another agent. This pass did not edit those files.
