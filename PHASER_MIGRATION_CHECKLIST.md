# Phaser Migration Checklist

Branch: `phaser-migration`
Base: `main`

## Current checkpoint

Phaser is now the normal game entry point. `src/main.js` boots `src/phaserRuntime.js` instead of the old Canvas render loop.

The old Canvas render files remain in the repo as reference/fallback material, but normal play no longer calls the old `draw(ctx, state)` runtime.

## Migrated in checkpoint 1

- Phaser installed as a dependency in `package.json`.
- Dev server serves Phaser from `/vendor/phaser.esm.js` through `node_modules/phaser/dist/phaser.esm.js`.
- Build script copies the Phaser ESM build into `dist/vendor/phaser.esm.js` and `Dist/vendor/phaser.esm.js`.
- Main game loop replaced with a Phaser Scene update loop.
- Phaser pointer input now routes click/tap coordinates into the existing interaction system.
- DOM HUD is preserved.
- Interaction menu is preserved.
- Command buttons are preserved.
- Phone UI is preserved.
- Save/load system is preserved.
- Existing simulation modules are reused: movement, actions, autonomy, auto hooks, object actions, delivery, cooking, training, garbage, fetch, build requests, object moving, lights/windows.
- Phaser Graphics now renders the world, rooms, doors, windows, objects, entities, carried items, fetch ball, delivery courier, garage departure, status overlay, and offsite overlay.

## Minimum parity checklist still requiring browser verification

- Game boots in browser.
- Desktop view works.
- Mobile viewport works around 390 x 844.
- Main, upstairs, basement, garage, and backyard render.
- Characters move by click/tap.
- Collision still prevents walking through walls.
- Door/floor transitions still work.
- Cell Phone opens.
- Cell Phone tabs work.
- Shop shows multiple options.
- Acts shows multiple options.
- Travel shows party invite selection.
- Offsite outing can start after Done.
- Garage departure is visible.
- Front foyer/porch staging exists.
- Dog can use pet flap/backyard/kennel route.
- Girlfriend autonomy uses multiple rooms/activities.
- Save/load works.
- Garbage system still works.
- Food, delivery, snacks, and popcorn generate trash.
- Characters can carry visible items.
- Dog fetch has a visible thrown ball.
- Activity states/animations are represented.
- No console errors.
- Build succeeds after `npm install`.

## Known limitations at this checkpoint

- Browser execution has not been verified in this ChatGPT tool session.
- Static object art is first-pass Phaser Graphics parity, not polished sprites.
- The old Canvas render files remain as reference, but they are not the normal entry path.
- Further QA should use the provided parity checklist before opening a final PR.
