# 2026-07-13, Bike Mounted Rider Pass

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-bike-mounted-rider-pass-2026-07-13

## Files changed by this pass

```txt
src/bikeMountRenderer.js
src/vehicleSpriteOverlays.js
src/renderDynamic.js
src/vehicleSystem.js
tmp_noop.txt, removed temporary verification file
```

Runtime files changed: yes
Vehicle files changed: yes
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no
Protected repo touched: no

## Summary

Separated bike type travel behavior from car door boarding behavior for bicycle, motorbike, and ATV. Added visible handlebar overlays and a mounted rider overlay so the rider appears on top of the bike instead of visually disappearing into it like a car. Car logic remains door based. Bike logic now uses bike specific mount and dismount phases.

## Implementation details

- Added `src/bikeMountRenderer.js`.
- Parked bicycles, motorbikes, and ATVs now receive visible handlebar and seat overlays.
- Animated bike trips now receive the same correction overlay.
- Dynamic vehicle rendering passes rider drawing to the bike overlay, not to the old generic mini rider layer, avoiding double rider drawing.
- Bike type departure skips car remote unlock and door opening phases.
- Bike type departure now flows through:

```txt
walking_to_vehicle
mounting
mounted_ready
garage_opening
leaving
```

- Rider entities are hidden only after the mounted rider overlay takes over visually.
- Bike type return now flows through:

```txt
arriving
parking
dismounting
walking_in
```

- Return dismount spawns the rider beside the bike, then routes them inside from the garage.
- Vacation luggage/trunk path remains car only.
- The accidental temporary `tmp_noop.txt` verification file was removed during this pass.

## Testing performed

```txt
node --check /tmp/vehicleSystem.js
node --check /tmp/bikeMountRenderer.js
node --check /tmp/renderDynamic.js
node --check /tmp/vehicleSpriteOverlays.js
```

The checks were run against generated replacement files before GitHub writes.
GitHub compare was run after writes.

No browser test was performed.

## Testing requested

```txt
Open the garage.
Confirm bicycle, motorbike, and ATV show obvious handlebars while parked.
Start a bicycle trip.
Confirm the character walks to the bike, stands beside it, then visibly mounts onto the bike.
Confirm there are no car doors or car door messages for bicycle/motorbike/ATV.
Confirm the rider appears on top of the bike during garage opening and leaving.
Let the trip return.
Confirm the rider arrives mounted, dismounts beside the bike, and walks into the house.
Confirm cars still use normal car door boarding.
Confirm no Render/main/deploy change happened.
```

## Known risks

This is a Canvas/runtime overlay and behavior correction. It does not replace the generated PNG files with new binary PNG sprites because the current GitHub connector path only writes UTF-8 text safely. The PNG upload fallback document still applies for final real PNG asset updates.

Browser testing is still needed to judge scale, overlap, and whether the mounted rider reads clearly at mobile size.

Concurrent branch activity was detected in the compare output, including main floor visual cleanup files that were not part of this pass and were not edited here.

## Follow ups

```txt
Create real updated bike/motorbike/ATV PNGs with handlebars included.
Create separate mounted rider PNG frames if using the PNG upload fallback action.
Add turn left, turn right, and idle mounted rider states.
Add separate passenger overlay for motorbike/ATV rear seat.
Add better mount/dismount animation frames instead of the first pass overlay.
```
