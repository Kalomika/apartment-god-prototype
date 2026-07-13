# Handoff

## Current status

Apartment God Prototype is live and has been converted into a modular codebase. Active development is on `phaser-migration`. The newest work starts the strict overhead anime visual conversion while preserving safe fallbacks and every original feature.

Live URL:

https://apartment-god-prototype.onrender.com

Repo:

Kalomika/apartment-god-prototype

Do not modify:

Kalomika/ai-rpg-engine

## Current source of truth

Feature inventory:

`docs/FEATURE_INVENTORY.md`

Development log:

`docs/DEVELOPMENT_LOG.md`

Primary handoff issue:

https://github.com/Kalomika/apartment-god-prototype/issues/1

## Latest pass

Branch:

`phaser-migration`

Backup:

`backup/phaser-migration-before-anime-visual-overhaul-2026-07-13`

Implemented:

- Active true top down anime visual standard.
- Approved painterly garage floor plate.
- Approved closed family SUV and sports convertible PNGs.
- Safe cached loading with current renderers retained on failure.
- Facing-aware vehicle PNG rotation.
- Existing renderer retained for vehicle door and trunk states.
- Static build now includes `assets/`.
- Production manifest entries, checksums, rejections, and deferred categories.
- Unit coverage for asset paths, non-browser fallback, and facing rotation.
- Vitest now collects only `*.test.js`; the mobile `*.spec.js` remains under Playwright.

## Known limitations

- `main` and Render settings were not changed.
- Browser visual approval is still required for the garage crop, scale, layering, and state transitions.
- Local syntax, unit, asset validation, and build checks pass. Full lint remains blocked by pre-existing empty catch blocks. Playwright could not obtain a browser binary in the current environment.
- Characters and dog remain procedural because the generated attempts failed the overhead camera or posture test.
- Bike, motorbike, ATV, other rooms, props, activity animation, and open vehicle PNG frames remain future work.
- The Canvas runtime remains active while an orthographic rigged model to 2D anime renderer is proven.

## Next recommended test pass

On a local browser build, verify:

1. The garage floor plate loads inside the room walls.
2. The closed SUV and convertible use the new art.
3. Both vehicles face the direction declared in `src/world.js`.
4. Unlock, door, trunk, departure, and return states never produce a blank frame.
5. Click areas and collision footprints remain aligned.
6. Missing images fall back without a blank canvas or crash.
7. Garage lights and room transitions remain readable.
8. Mobile frame rate remains acceptable.

If these pass, create one adult human orthographic rig proof and one dog quadruped rig proof. Do not mass-produce character PNGs from camera-incorrect generations.

## Required completion report

Every coding pass should report:

- Branch used
- Commit SHA
- Files changed
- What was implemented
- What was tested
- What failed or was deferred
- Exact next step
- Playable URL if deployed
