# Ongoing Design Log Append, Dog Shape Runtime Upgrade

Date: 2026-07-14
Status: COMMITTED, NEEDS BROWSER CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-dog-png-cutout-set-2026-07-14

## Summary

Upgraded the in-game dog renderer to a shape-built true top-down sprite system. The dog now has state-specific drawing logic for idle, walk, run, sit, lie, curled sleep, play bow, bark/react, eat, drink, fetch carry, happy, alert, and sad.

## Files changed

- src/dogSpriteOverlay.js
- assets/sprites/characters/dog/shape_topdown_pass_01/ASSET_INDEX.md
- assets/sprites/characters/dog/shape_topdown_pass_01/manifest_dog_shape_pass_01.json

## Implementation details

- Removed dependency on the old SVG atlas path for the live dog shape.
- Added a direct shape-based runtime renderer so the dog visibly upgrades in the game now.
- Added direction logic for north, south, east, and west.
- Added movement gait logic and state selection based on dog action/pose/path/fetch state.
- Kept the structure ready for future transparent PNG or PNG atlas replacement.

## Testing performed

Code inspection through GitHub connector. Browser test still required after Render rebuild.

## Testing requested

- Check the dog on the main floor.
- Send the dog walking in different directions.
- Trigger fetch or dog bowl activity if available.
- Confirm the dog is visibly upgraded and no longer reads like the old fallback dog.

## Known risks

- This pass uses runtime shape drawing for immediate visible upgrade. The final separate binary PNG frame commit remains a future binary asset pipeline pass.
- Human renderer was not touched.

## Follow ups

- Replace runtime shape frames with separate real transparent PNG files or a PNG atlas once binary upload tooling is available in the active environment.
