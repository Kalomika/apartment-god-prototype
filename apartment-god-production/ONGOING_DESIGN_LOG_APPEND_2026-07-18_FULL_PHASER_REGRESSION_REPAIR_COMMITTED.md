# Ongoing Design Log Append, Full Phaser Regression Repair Committed

## 2026-07-18, Full Phaser Regression Repair Batch

Status: NEEDS_TESTING
Branch: work/full-phaser-regression-repair-2026-07-18
Commits:
- cf72f8fca61114e54e6bd08109d96b405d36356c, idea directive
- f6eb9b0add8051b8d80374c623aa4a4e247d9288, start log
- b6260b8c8f6db0f452b7b7999cc5e80c8c8cade8, mobile playfield sizing
- 9f5fc2da1517fd7dc27adb64a14156d94207a9b6, Resident walk sheet
- 36d97267407eda9784d0d808bfa6ca95ad6921e4, Girlfriend walk sheet
- 2bd5f636b615a0db6f651b79e22a9e380db3e1d2, dog walk sheet
- f5e5848aec2bdff85331c0a50d030964c828b0a7, actor progress, sleep, bed making, arcade input corrections
- 7408a4665a92c4ab7432312949d530300f080164, install correction layer
- 2e169b97e47e6529017a9b2e14c50de0a6b2e9f0, top-down arcade cabinet and expanded game
- cf03d2cf19b02cafa509a28bc5d43626421b9db6, visual parity overlay
- bc6ac267dc207309abb031451cfd074a6a69382c, install visual overlay
- 2d70d6caf25f5052195e3f9d6a3af9da1d6b13ca, cache bust and 960 by 720 canvas alignment
Files changed:
- src/fit.js
- src/main.js
- src/arcadeSystem.js
- src/phaserParityCorrections.js
- src/phaserVisualParityOverlay.js
- assets/sprites/characters/resident/resident_8fps_sheet.svg
- assets/sprites/characters/girlfriend/girlfriend_8fps_sheet.svg
- assets/sprites/characters/dog/dog_8fps_sheet.svg
- index.html
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-18_FULL_PHASER_REGRESSION_REPAIR.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-18_FULL_PHASER_REGRESSION_REPAIR_START.md
Runtime files changed: yes
Render playable branch updated: pending final branch synchronization after this documentation commit
Backup branches:
- backup/phaser-migration-before-full-phaser-regression-repair-2026-07-18
- backup/main-before-full-phaser-regression-repair-2026-07-18
- backup/work-full-phaser-regression-repair-start-2026-07-18

Summary:
Implemented the first focused repair batch for regressions exposed by the current Phaser parity build. This batch addresses the mobile viewport cutoff, duplicated character limbs, missing visible leg motion, double dog anatomy, incorrect bed direction, missing timed activity progress, arcade overlay obstruction, crude arcade construction, reversed pool rack outline, duplicated dining residue, reverted corner sink placement, and weak TV and laptop screen readability.

Implementation details:
- Mobile playfield now uses a calculated 4:3 display height based on available phone width, aligns to the top of the game area, and no longer intentionally centers inside a fixed 48 to 50 viewport-height box.
- Resident and Girlfriend sheets were rebuilt as single complete bodies per frame. Arms and legs are part of each frame rather than layering animated limbs over a complete static body.
- Four directional rows remain at 8 FPS, with east and west derived from rotated complete frames rather than independent duplicated limb groups.
- Dog sheet was rebuilt with one body and one set of legs per frame instead of inheriting a complete dog and drawing additional legs over it.
- Added Phaser-native actor progress graphics driven by actionT and actionTotal.
- Added object-aware bed positioning and headboard-based sleep rotation.
- Added a bed-making motion override and progress display.
- Arcade gameplay now displays on an angled screen built into a dedicated top-down cabinet by default.
- Double tapping the active cabinet expands the mini-game and enables touch movement and action buttons. Ordinary autonomous arcade play no longer covers the room.
- Added an authoritative environment correction pass that removes dining residue before redrawing one dining set, restores a diagonal inward-facing corner sink, improves top-down wall TV and laptop construction, and corrects the pool rack triangle so its apex faces the cue ball.
- Updated the HTML entry cache key and canvas dimensions to match the 960 by 720 Phaser playfield.

Testing performed:
- GitHub Phaser Parity CI run 29640067132 completed successfully.
- CI repository checks passed.
- CI unit tests passed.
- CI static build passed.
- CI Phaser vendor output verification passed.
- CI Phaser entry-point verification passed.
- Verified by code inspection that the work branch is a clean fast-forward from phaser-migration with no competing commits on the target branch during this batch.

Testing requested:
After main receives the batch and Render rebuilds, open https://apartment-god-phaser.onrender.com on mobile and hard refresh. Verify the whole 4:3 floor is visible above the control bar, toilets and lower-room objects remain tappable, Resident and Girlfriend legs visibly alternate while walking, no second pair of arms remains, dog appears as one dog, sleep direction follows the bed, timed actions show progress, the arcade game stays on the cabinet until double tapped, expanded arcade controls respond, the pool triangle points toward the cue ball, dining residue is gone, the sink is diagonal in the kitchen corner, and TV/laptop screens read as tilted equipment.

Known risks:
- This remains a Phaser runtime with compatibility-canvas environment layers. The batch repairs parity regressions but does not honestly complete the future conversion of every world object into an individual native Phaser sprite.
- Mobile layout must be verified on the actual Render build because browser chrome and dynamic viewport behavior vary by Android browser.
- The new SVG sheets passed build checks but still require direct visual review for animation quality and proportions.
- Arcade double-tap input must be verified on touch hardware.

Follow ups:
- Continue native Phaser conversion by object family only after this parity batch is browser verified.
- Replace compatibility-canvas object families with dedicated asset-backed Phaser sprites without removing working gameplay.
- Add specific activity sprite sheets beyond the current directional walk foundation.
