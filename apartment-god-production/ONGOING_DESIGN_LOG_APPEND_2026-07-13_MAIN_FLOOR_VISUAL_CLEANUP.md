# Ongoing Design Log Append: Main Floor Visual Cleanup

## 2026-07-13 05:20 AM CT, Main Floor Porch Couch Dining Cleanup

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Commit: phaser-migration head after this append file
Files changed:
- src/mainFloorLayoutPolish.js
- src/rendering.js
- tests/main-floor-layout-polish.test.js
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_MAIN_FLOOR_VISUAL_CLEANUP.md
Runtime files changed: yes
Render playable branch updated: yes after main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-main-floor-visual-cleanup-2026-07-13
- backup/main-before-render-update-2026-07-13-main-floor-visual-cleanup

Summary:
Added an actual runtime main floor polish layer to address Kam's latest live screenshot issues: porch regression, extra porch clutter, wrong-side couch L, and dining overlap/old table stack. This is not a mockup. It is wired into the game renderer.

Implementation details:
- Added `src/mainFloorLayoutPolish.js`.
- The new polish layer runs after legacy/correction layers and before entities, so it covers older procedural object artifacts while keeping characters visible above furniture.
- `applyMainFloorLayoutPolish` corrects runtime object positions for the living room couch, dining table, and coffee maker.
- Front porch is redrawn as a clean wood porch using the better prior arrangement: two chairs only, one on each side facing out, and one small center table.
- Removed the giant green porch block behavior by clearing the right-side porch/stair overlap zone and redrawing the stairwell.
- Redrew the living room L sectional with the chaise on the wall side instead of the kitchen side.
- Redrew the dining area as one four-chair dining set and clears the old dining footprint before drawing it.
- Added `tests/main-floor-layout-polish.test.js` to pin the couch and dining placement.

Testing performed:
- GitHub file inspection confirmed the renderer imports and calls `applyMainFloorLayoutPolish` and `drawMainFloorLayoutPolish`.
- Static inspection confirmed the new layer draws before entities and after old visual layers.
- Tests were added but not executed in this connector environment.

Testing requested:
- Open https://apartment-god-phaser.onrender.com after Render rebuilds and hard refresh.
- Check the front porch first: it should show two chairs only, outward-facing, with one small table, not giant green blocks over the stairs.
- Check couch: L should be on the wall side and couch should face the TV.
- Check dining: one clean table with four chairs, no old table/chair ghost stack.

Known risks:
- This is still Canvas-drawn runtime art, not final PNG asset production.
- It improves the live game immediately, but the real target remains a PNG environment/object asset pipeline matching the anime top-down reference quality.

Follow ups:
- Build actual PNG room plates and individual object assets for the main floor so this polish layer can be retired.
