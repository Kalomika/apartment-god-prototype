# 2026-07-13, Upstairs Structure Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-upstairs-structure-2026-07-13

## Summary

Committed the structural upstairs layout pass before asset generation so future anime PNG assets have stable room and object targets.

## Files changed

```txt
src/world.js
src/blueprint.js
src/state.js
src/config.js
src/renderHouseStyle.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_UPSTAIRS_STRUCTURE.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-13_UPSTAIRS_STRUCTURE.md
```

Runtime files changed: yes
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Implementation details

- Reworked upstairs room boxes into Primary Bedroom, Office, Guest/Hall Bath, Primary Walk In Closet, Primary Suite Bath, Upper Hall, Guest Bedroom, Upstairs Landing, and Stairs.
- Preserved existing public upstairs bathroom purpose as guest/hall bath.
- Added a closet-connected primary suite bathroom containing bathtub, shower, sink, and toilet.
- Filled the lower empty upstairs cream area with a guest bedroom and landing instead of dead space.
- Shrunk the primary bed footprint to better match character scale.
- Added nightstands and lamp fallback footprints beside the primary bed and guest bed.
- Added guest bed, guest study desk, guest light, and guest bedroom window.
- Updated the upstairs doorway graph so hall, bedroom, closet, master bath, guest room, landing, and stairs are connected by valid doorways.
- Added new upstairs room lights for closet, master bath, guest room, and landing.
- Added bathtub interaction fallback using current shower action id, so the tub can be tested without creating an untested bath action pipeline.
- Added procedural fallback drawings for bathtub and nightstand only. No PNG assets were added.

## Testing performed

- Read required handbook, backup policy, no broad implementation rule, PNG fallback doc, ongoing log, and development matrix.
- Created backup branch first.
- Ran local syntax checks with `node --check` on prepared replacement versions of world.js, blueprint.js, state.js, config.js, and renderHouseStyle.js.
- No browser, local npm, or Render test was performed.

## Testing requested

```txt
Open https://apartment-god-phaser.onrender.com after the branch is mirrored for testing, or test phaser-migration locally if available.
Boot/reset.
Go upstairs.
Confirm Primary Bedroom, Primary Walk In Closet, Primary Suite Bath, Guest Bedroom, Upper Hall, Upstairs Landing, Stairs, Office, and Guest/Hall Bath all render.
Confirm Resident/Girlfriend still wake on the primary bed and are selectable.
Confirm bedroom TV, closet menu, office desk, public bath shower/toilet/sink, master bathtub, master shower, master toilet, guest bed, guest desk, guest room light, and stairs are clickable where expected.
Confirm pathing from stairs to hall, office, public bath, bedroom, closet, primary bath, guest bedroom, and back.
Confirm the lower upstairs area is no longer dead empty space.
Confirm no boot error or blank canvas.
```

## Known risks

Connector pass only. Browser pathing and object click targets still need verification. The bathtub and nightstands are procedural fallback objects, not final PNG asset art. The master bath currently reuses the existing shower action id until a dedicated bath action pipeline is built.

## Follow ups

After browser pass, use this room/object set as the target inventory for anime top down PNG assets. Do not commit PNGs until audited. Add dedicated bath action/animation later instead of relying permanently on shower action fallback.
