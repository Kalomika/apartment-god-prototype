# 2026-07-13, Master Bath and Office Correction

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-master-bath-office-correction-2026-07-13

## Summary

Corrected the upstairs layout after live screenshot feedback. The top right guest/hall bath was removed from the current master-side upstairs section and folded into the office footprint. The primary bathroom fixtures were repositioned so the bath reads more like wall-based bathroom architecture instead of loose center-room bits.

## Files changed

```txt
src/world.js
src/blueprint.js
src/state.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_MASTER_BATH_OFFICE_CORRECTION.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-13_MASTER_BATH_OFFICE_CORRECTION.md
```

Runtime files changed: yes
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no
PNG assets committed: no

## Implementation details

- Created a backup branch before the correction.
- Removed the top right upstairs guest/hall bath room from the active current upstairs layout.
- Expanded the office across the former guest/hall bath area.
- Added an office couch in the expanded office footprint as a temporary procedural fallback object.
- Removed the retired upstairs guest/hall shower, sink, and toilet objects from the active object list.
- Moved the primary shower to the west lower corner of the Primary Suite Bath.
- Moved the bathtub onto the bathroom wall area where the shower had been sitting.
- Moved the primary sink into the Primary Suite Foyer / vanity connector area instead of keeping it inside the larger bath room.
- Left the primary toilet in the lower right bathroom area.
- Removed the suite foyer to hall doorway and the closet to suite foyer doorway so the connector is no longer an over-open pass-through.
- Preserved the bedroom to suite foyer doorway, bedroom to hall doorway, closet to primary bath doorway, and suite foyer to primary bath doorway.
- Removed the retired `bath2` room light key from default state.
- Added an extra office lounge window/light target for the expanded office side.

## Testing performed

GitHub file inspection only. No local npm build, browser test, or Render test was performed from this connector session.

## Testing requested

```txt
Open phaser-migration locally or Render after main is intentionally updated.
Go upstairs.
Confirm the top right bathroom is gone and the office extends across that area.
Confirm the office couch appears in that top right office extension.
Confirm the primary shower is in the lower west/bottom-left bathroom corner.
Confirm the bathtub sits on the bathroom wall area and not floating in the middle.
Confirm the sink appears in the Primary Suite Foyer / vanity area.
Confirm the toilet remains in the lower right of the Primary Suite Bath.
Confirm the suite foyer no longer opens into the closet or directly into the hall.
Confirm the bedroom still exits to hall, suite foyer, and closet.
Confirm closet to master bath still works.
Confirm suite foyer to master bath still works.
Confirm no boot error or blank canvas.
```

## Known risks

This is still procedural fallback structure only. Browser pathing must verify the reduced suite foyer openings do not create a trap. The top right public bathroom is intentionally removed from this current master-side upstairs area. Guest bathrooms and two smaller bedrooms belong in the future expanded upstairs wing.

## Follow ups

Plan the larger upstairs expansion separately: smaller Up/Down UI buttons, larger playable canvas or side-to-side upstairs wing navigation, east wing bedrooms/lounge, and future guest bathroom away from the primary suite.
