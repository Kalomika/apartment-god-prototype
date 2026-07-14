# Development Matrix Append, Phaser Human Renderer Port And Cache Bust

Date: 2026-07-14
Branch: phaser-migration, plus main cache bust parity
Status: NEEDS_TESTING
Backup branch: backup/phaser-migration-before-human-renderer-framework-port-2026-07-14

## Human Renderer
Status: NEEDS_TESTING

Update:
- `phaser-migration` no longer uses the static bridge renderer that had no walk cycle.
- The static crown/back-of-head presentation has been removed from the active human renderer source on `phaser-migration`.
- Human walking now uses an animated procedural walk cycle with visible leg and arm motion.
- Movement detection now considers path, target, walk pose, walk/heading/going text, and frame-to-frame movement.
- Dog rendering remains outside this human renderer path.

## Activity Animation Identity
Status: NEEDS_TESTING

Preserved in the renderer:
- Walking
- Lift weights
- Treadmill
- Heavy bag
- Shower
- Wash dog
- Sleep anchored to bed
- Standing pee
- Seated toilet
- Brush teeth

## Browser Cache Chain
Status: NEEDS_TESTING

Update:
- `index.html` module entry was cache-busted.
- `src/main.js` imports `canvasRuntime.js` through a cache-busted URL.
- `src/canvasRuntime.js` imports `rendering.js` through a cache-busted URL.
- `src/rendering.js` imports `renderEntities.js` through a cache-busted URL.

Reason:
- Kam reported the live browser still showed the old static bridge behavior after a renderer source patch. The cache chain needed to be broken so the browser would load the corrected renderer module.

## Required Test
Status: PENDING

Test at:
https://apartment-god-phaser.onrender.com

Required checks:
- Resident walking should show arm and leg movement.
- Girlfriend walking should show arm and leg movement.
- Girlfriend should not show the dropped back-of-head bridge.
- Standing pee should show a standing bathroom pose.
- Seated toilet should show a seated bathroom pose.
- Brush teeth should show a sink/grooming pose.
- Shower, wash dog, lift weights, treadmill, heavy bag, and sleep should still display.
- Heads should remain visible during sleep.

Risk note:
If live Render still shows the old static bridge after these commits are deployed, the matrix should treat the problem as a deployment/served-branch mismatch until proven otherwise.
