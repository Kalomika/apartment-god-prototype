# Engine Upgrade Log

Branch: `phaser-engine-upgrade`

## Current code rating

Current mainline prototype rating: **3 out of 10 as a game engine**, **5 out of 10 as a fast playable prototype**.

The existing code proves interactions, rooms, needs, floors, movement, chores, and activity loops. It is useful for testing ideas. It is not the right final foundation for high quality sprite animation, modular character art, polished hitboxes, combat style state machines, or a Streets of Rage, Street Fighter 2, Sonic, Mario, Flashback, Viewtiful Joe style sprite pipeline.

## Why it needed an upgrade

The previous entry point was a direct canvas loop in `src/main.js`. Rendering was immediate canvas drawing, entity bodies were hard-coded shapes, and animation was controlled by simple trigonometry and action text. That makes it fast to sketch, but it makes it hard to drop in real sprite sheets, atlases, layered character limbs, animation clips, frame events, attack boxes, hurt boxes, VFX, particles, camera work, and asset streaming.

## Upgrade performed

1. Created `src/legacyMain.js` as an exact rollback entry for the previous canvas prototype.
2. Updated `index.html` to load Phaser 3.90.0 from jsDelivr before the game module.
3. Replaced `src/main.js` with a Phaser boot path.
4. Added `src/engine/topShotGame.js`, a Phaser scene that keeps the existing simulation state but moves rendering and interaction into a real game framework layer.
5. Added a no blank screen safety path. If Phaser is unavailable, `src/main.js` imports `src/legacyMain.js`.

## What this gives us now

The game now has a Phaser scene structure, Phaser display list, layered world drawing, depth sorted entity containers, procedural temporary character rigs, pointer input, DOM HUD sync, floor switching, object menus, movement, fetch, activity overlays, and current apartment systems preserved.

This is not the final art pass. It is the correct direction for a final art pipeline, because placeholder shapes can now be replaced with sprite atlases, skeletal limb pieces, frame animations, particles, camera effects, hitboxes, and collision layers without rewriting the game loop again.

## Asset pipeline target

Final character pipeline should support:

- Sprite atlases for full body animations.
- Optional layered rigs for head, torso, upper arm, forearm, hand, thigh, shin, foot, hair, clothing, props, and held objects.
- Per action animation states such as idle, walk, run, sit, sleep, cook, clean, talk, play, carry, enter vehicle, swim, fight, dodge, attack, hurt, and recover.
- Frame event hooks for footsteps, hand contact, item pickup, hitbox active frames, sound triggers, and VFX.
- Real object collision layers and navigation data instead of single rectangle guesses.

## Rollback

The current branch preserves the old entry at `src/legacyMain.js`. If the Phaser layer fails to load, startup automatically imports that file.

For a full repo rollback, revert this branch or restore the previous `src/main.js` and `index.html` from `main`.
