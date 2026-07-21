# Development Matrix Patch, Full Phaser Audit

Date: 2026-07-21
Branch: repair/phaser-full-audit-2026-07-21
Status: NEEDS_TESTING

## Branch and Render State

- `main`: ad80f363422778e1e700045a75273854bc32a30b
- `phaser-migration`: 3e8722052e7dc4fbf781b11979f339327b8b6b06
- Relationship: `phaser-migration` is 10 commits ahead and 0 behind `main`.
- The canonical matrix statement that both branches point to the same release commit is stale and must not be used for deployment decisions.
- Render still follows `main` and does not contain the July 19 mobile scale conflict fix or this audit repair.
- Render settings changed: no.
- Main updated: no.

## Boot and Lifecycle

- Scene global listener cleanup: IMPLEMENTED, NEEDS CI AND BROWSER TESTING
- Hidden simulation interval cleanup: IMPLEMENTED, NEEDS SCENE RESTART TEST
- Camera swipe state rebinding: IMPLEMENTED, NEEDS MOBILE TEST
- Duplicate initialization risk: REPAIRED BY CODE

## Activity State

- Preserve approached object during timed activity: IMPLEMENTED
- Clear inactive stale action IDs and totals: IMPLEMENTED
- Stationary object facing: IMPLEMENTED FOR CURRENT FOUR DIRECTION FALLBACK, NEEDS BROWSER TESTING
- Activity progress without legacy `actionTotal`: IMPLEMENTED
- Activity progress reset when action changes: IMPLEMENTED

## Input

- Arcade cabinet world coordinate hit testing: IMPLEMENTED
- Scale and camera pointer alignment: NEEDS BROWSER TESTING

## Kitchen Sink

- Preferred visual: newer diagonal sink
- Runtime collision anchor: aligned to x 665, y 88, width 62, height 52
- Visual overlay anchor: same coordinates and footprint
- Duplicate visual and collision conflict: REPAIRED AT AUTHORITATIVE SOURCE
- Browser residue and click test: NEEDS_TESTING

## Save Compatibility

- Version 2 save acceptance: PRESERVED
- Current save version: 3
- Nested default merge: IMPLEMENTED
- Entity merge by ID: IMPLEMENTED
- New entity preservation: IMPLEMENTED
- World object merge by ID: IMPLEMENTED
- New world object preservation: IMPLEMENTED
- Corrupt save handling: PRESERVED
- Real browser version 2 migration: NEEDS_TESTING

## Vehicle and Offsite

- Departure duplicate guard: VERIFIED BY CODE INSPECTION
- Return actor visibility cleanup: VERIFIED BY CODE INSPECTION
- `vehicleTrip` cleanup: VERIFIED BY CODE INSPECTION
- Parked vehicle state cleanup: VERIFIED BY CODE INSPECTION
- Garage door cleanup: VERIFIED BY CODE INSPECTION
- Selection and follow restoration: VERIFIED BY CODE INSPECTION
- No vehicle rewrite performed because no regression was proven.
- Browser departure and return sequence: NEEDS_TESTING

## Character Art and Animation

- Current walk coverage: four cardinal directions, four generic frames per direction
- Requested final coverage: eight directions with a walk cycle for north, northeast, east, southeast, south, southwest, west, and northwest
- Modular outfit system: REQUIRED, NOT IMPLEMENTED
- Activity specific production animation: REQUIRED, NOT IMPLEMENTED
- Current fallback must remain until replacement assets pass review.

## Documentation

- Canonical Idea Bible path was missing: REPAIRED by restoring `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md`
- Main ongoing log remains older than several sidecar append files: DOCUMENTATION DEBT
- Daily build log remains stale at July 2: updated through a dated append for this run
- Reference archive and external reference index: VERIFIED PRESENT
- Backup branch: backup/phaser-migration-before-full-audit-repair-2026-07-21
