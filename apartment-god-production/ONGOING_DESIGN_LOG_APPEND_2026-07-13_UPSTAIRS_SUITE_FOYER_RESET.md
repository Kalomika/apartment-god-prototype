# 2026-07-13, Upstairs Suite Foyer Reset

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-upstairs-suite-foyer-reset-2026-07-13

## Summary

Corrected the upstairs structure after Kam rejected the temporary second bedroom in the current cramped upstairs section. This pass removes the lower guest bedroom from the current upstairs layout and repurposes that space as the larger primary suite bathroom. The previous small bathroom zone becomes a primary suite foyer/connector instead of pretending to be the full bathroom.

## Files changed

```txt
src/world.js
src/blueprint.js
src/state.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_UPSTAIRS_SUITE_FOYER_RESET.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-13_UPSTAIRS_SUITE_FOYER_RESET.md
```

Runtime files changed: yes
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no
PNG assets committed: no

## Implementation details

- Created a backup branch before changing structure.
- Removed the temporary lower upstairs guest bedroom from the current upstairs section.
- Replaced the small former primary bath rectangle with `suite_foyer`, a connector space between the primary bedroom, closet, hall, and larger bath zone.
- Moved `master_bath` into the lower left area where the temporary guest bedroom had been.
- Moved the primary bathtub, primary shower, primary bath sink, and primary toilet into the larger lower master bath room.
- Removed the temporary guest bed, guest nightstand, guest desk, and guest room light from the active object list.
- Updated the doorway graph so the bedroom can route to the closet, suite foyer, and hall.
- Updated the doorway graph so the suite foyer routes to the master bath and hall.
- Updated the doorway graph so the closet routes to both the suite foyer and the master bath.
- Updated window state from the removed guest room window to a primary bath window.
- Updated room light defaults to include `suite_foyer` and remove the temporary `guest_room` key.

## Testing performed

GitHub file inspection only. No local npm build, browser test, or Render test was performed from this connector session.

## Testing requested

```txt
Open the phaser-migration test build or Render after main is intentionally updated.
Go upstairs.
Confirm there is no temporary second bedroom in the lower left current upstairs section.
Confirm the lower left room is now Primary Suite Bath.
Confirm the small middle room reads as Primary Suite Foyer, not a bathroom.
Confirm Primary Bedroom routes to Hall, Suite Foyer, and Closet.
Confirm Closet routes to Suite Foyer and Primary Suite Bath.
Confirm Suite Foyer routes to Primary Suite Bath and Hall.
Confirm Primary Suite Bath fixtures are clickable.
Confirm stairs and hall movement still work.
Confirm no boot error or blank canvas.
```

## Known risks

This is still a current-screen upstairs layout correction, not the larger east/west upstairs expansion. The larger upstairs wing, smaller arrow UI, and expanded play canvas should be handled in a separate backed up pass because it touches camera, floor navigation UI, and play area dimensions.

## Follow ups

Plan the expanded upstairs map system separately: east wing above the main living area with two smaller bedrooms and a lounge, west wing above the garage for the primary suite, and a longer upstairs hallway between them. Do not create final anime PNGs for upstairs rooms until the expanded structure is stable and audited.
