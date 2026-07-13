# Development Matrix Append, 2026-07-13, Car Assigned Doors and Seat Pop Out Pass

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-car-seat-popout-luggage-pass-2026-07-13

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Vehicle Matrix | Car doors | BROAD | PARTIAL, NEEDS_BROWSER_TESTING | Runtime trip rendering now opens only doors for assigned occupied seats. |
| Vehicle Matrix | One-person car boarding | BROAD | PARTIAL, NEEDS_BROWSER_TESTING | One traveler should visually open one assigned door, not every door. |
| Vehicle Matrix | Multi-person car boarding | BROAD | PARTIAL, NEEDS_BROWSER_TESTING | Multiple travelers should open only their assigned occupied doors. |
| Vehicle Matrix | Pop out car seats | PLANNED | PARTIAL, NEEDS_BROWSER_TESTING | Assigned seats now visually pop out with seated travelers before retracting. |
| Vehicle Matrix | Vacation luggage | PARTIAL | PRESERVED, NEEDS_BROWSER_TESTING | Existing trunk open/load/close and luggage visuals remain in place. |
| Asset Matrix | Modular car parts | PLANNED | STILL_NEEDED | Final PNG doors, seats, and luggage pieces still need real modular sprite assets. |
| Animation Matrix | Explicit seat phase names | BROAD | STILL_NEEDED | Underlying phases still need explicit named timing states in a deeper vehicleSystem pass. |

## Required browser checks

```txt
Single traveler car trip, one door only.
Multi traveler car trip, only assigned occupied doors.
Pop out seat visual during boarding.
Seat retract visual during door closing.
Vacation luggage still goes into trunk.
Bikes still use bike mount logic.
Cars still leave and return without breaking garage flow.
```
