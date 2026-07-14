# Ongoing Design Log Append: Direction TV Desktop Tidiness Dog Fix

## 2026-07-13, Direction TV Desktop Tidiness Dog Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Commit: phaser-migration head after this append file
Runtime files changed: yes
Render playable branch updated: pending main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-direction-tv-desktop-tidiness-fix-2026-07-13

## Files changed

- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_DIRECTION_TV_DESKTOP_TIDINESS_FIX_STARTED.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_DIRECTION_TV_DESKTOP_TIDINESS_DOG_FIX.md
- apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-13_DOG_SPRITE_ASSET_UPGRADE.md
- assets/sprites/characters/dog/top_down_dog_atlas.svg
- src/renderEntitiesTopDown.js
- src/rendering.js
- src/tidinessSystem.js
- src/state.js
- src/canvasRuntime.js
- src/mainFloorLayoutPolish.js
- src/bookRender.js
- styles.css

## Summary

Patched the live issues Kam identified after testing the prior batch: directional moonwalking, ghost TV light, unclear loose book clutter, desktop utility bar orientation, house tidiness as a real gameplay multiplier, and the dog still looking like a crude procedural shape.

## Implementation details

- Added `assets/sprites/characters/dog/top_down_dog_atlas.svg`, a designed four-direction top-down dog atlas with ears, head, snout, body, four legs, collar, markings, and tail.
- Added `src/renderEntitiesTopDown.js` and switched `src/rendering.js` to use it for entity drawing.
- Direction now resolves from the current path vector so walking south/down should no longer reuse the north/back silhouette.
- Human renderer was tightened toward compact top-down silhouettes instead of the older tall side-view body logic.
- Dog rendering now draws from the asset atlas instead of procedural dog body shapes.
- Living room TV light now requires an actual watcher near the living room TV, not merely stale generic action text elsewhere.
- Loose book rendering no longer labels the book or makes it look like a wall glitch.
- Added `src/tidinessSystem.js` with a house tidiness score and activity reward multiplier.
- Positive need gains now scale through the actor's `houseTidinessMultiplier`, so clean houses reward recovery/fun/food-style gains more and messy houses reduce effectiveness.
- The status bar now includes the house tidiness score.
- Desktop/wide landscape layout now puts the utility/control bar vertically between the game canvas and HUD so the icons do not disappear into a horizontal scroller.

## Testing performed

- Verified by GitHub file inspection and branch commit review.
- Browser behavior has not been verified from this connector environment.

## Testing requested

- Open https://apartment-god-phaser.onrender.com after Render rebuild and hard refresh.
- Walk north, south, east, and west. South/down should not show a back-facing moonwalk.
- Watch the living room TV only when someone is actually using it. The TV light should stay off otherwise.
- Check the upstairs loose book/clutter. It should read as a book, not a random labeled wall bug.
- Check desktop/wide browser. The utility controls should be vertical and visible instead of hidden behind a tiny horizontal slider.
- Check the dog in the pet/robot nook and moving around. It should use the new asset-backed dog silhouette instead of the previous crude procedural blob.
- Make the house messier and cleaner through normal gameplay. The status bar should show tidiness and positive need gains should scale with house tidiness.

## Known risks

- This is an asset-backed SVG atlas first pass for the dog, not the final binary PNG sprite sheet. The PNG atlas and manifest still need a dedicated asset pipeline pass when binary upload is available and audited.
- The human top-down renderer is still a runtime drawing pass, not final character PNG sprites.
- Browser confirmation is required because the previous issues were only obvious live.
- The tidiness system is a first-pass multiplier. Full personality/autonomy cleanup pressure and partner annoyance are still planned.

## Follow ups

- Convert dog atlas into final PNG frames and manifest.
- Create real top-down human PNG directional walk and seated sprites.
- Add desktop right-click compass and mouse-drag pan in a dedicated controls pass.
- Add full tidiness behavior loop: characters auto-clean based on tidy priority, partner annoyance, delayed task cleanup, and room-specific mood effects.
