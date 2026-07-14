# Ongoing Design Log Append: Phaser Migration 2 Native Boot Pass

## 2026-07-14, Phaser Migration 2 Native Boot Pass

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration-2
Commit: pending branch head after this pass
Files changed: `src/main.js`, `src/phaserMigration2Runtime.js`, `index.html`, `assets/phaser-migration-2/sprites/**`, this log append
Runtime files changed: yes
Render playable branch updated: no
Render settings changed: no
Manual Render deploy triggered: no
Protected repo touched: no
Backup branch: backup/phaser-migration-2-start-2026-07-14

## Summary

Started the clean `phaser-migration-2` overhaul branch from current `main` and made it Phaser-first. This is not the failed old Phaser bridge. It boots a new Phaser-native scene and does not call the legacy Canvas renderer as the primary visual engine.

## Implementation details

- Created `phaser-migration-2` from current `main` so `main` can keep moving independently.
- Created `backup/phaser-migration-2-start-2026-07-14` before runtime overhaul work.
- Added `src/phaserMigration2Runtime.js`.
- Updated `src/main.js` to boot `bootPhaserMigration2Game()`.
- Updated `index.html` cache bust text and runtime entry version for the branch.
- Added first asset-backed SVG bridge assets under `assets/phaser-migration-2/sprites/`:
  - Resident top-down body
  - Girlfriend top-down body
  - Dog top-down body
  - Room panel
  - Generic object
  - Furniture object
  - Bed
  - TV
  - Bathroom fixture
  - Kitchen fixture
  - Stairs

## Important architectural change

The new runtime imports Phaser dynamically from `/vendor/phaser.esm.js` and catches boot failure with a visible error screen instead of leaving the canvas blank. This avoids repeating the prior failure mode where the HUD loaded but the play canvas was black.

The current branch uses existing simulation systems for continuity:

- `createState`
- movement update
- action lifecycle
- autonomy
- auto hooks
- calendar runtime
- life quality runtime
- save/load/autosave
- UI DOM controls and interaction menu
- camera navigation state hooks
- tidiness updates

But it renders through a Phaser scene with asset-backed images, not the old Canvas `draw()` renderer.

## What is intentionally not complete yet

This is the first Phaser-native boot and asset-backed bridge, not the final game art pass.

Still planned:

- replace SVG bridge assets with approved PNG atlases
- add true walk cycles
- add sitting poses
- add activity-specific Phaser animations
- migrate object-specific art by object ID, not only by generic kind
- add Phaser-native lighting layers
- add Phaser-native room/object layering polish
- add Phaser-native UI integration after gameplay parity is protected

## Testing performed

- Code inspection only through GitHub connector.
- No local `npm run build`, `npm test`, or browser run was available here.

## Testing requested when branch is deployed or previewed

Test `phaser-migration-2` directly, not `main`, once a preview or branch deployment path exists.

Test:

1. No blank play canvas.
2. If Phaser import or scene boot fails, a visible error screen appears instead of a black canvas.
3. Resident, Girlfriend, Dog render as asset-backed top-down images.
4. Floors switch through the existing HUD buttons.
5. Tapping actors and objects opens menus.
6. Movement works and actors slide using the new top-down assets.
7. Sleep appears anchored to the bed.
8. Upstairs bathroom routing still uses current simulation logic.
9. Save, load, pause, speed, map, up/down, and cell controls still respond.

## Known risks

- Branch has not been browser tested.
- SVG assets are a branch-safe asset-backed bridge, not the final PNG sprite atlas system.
- Object rendering is currently mapped by object kind, not individual final object art.
- Some current UI code still assumes 960x720 play coordinates while the canvas is 1280x720, matching existing project behavior but needing browser confirmation.

## Follow ups

- Confirm branch can be previewed through a link or later temporarily attached to Render after backup.
- If it boots, next pass should add the approved top-down static character art as real PNG or higher-fidelity SVG/atlas assets.
- Then add walk cycle only after static read is approved.
