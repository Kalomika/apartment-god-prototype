# Phaser Migration 2 Full Visual and Runtime Audit

Date: 2026-07-19
Branch: `phaser-migration-2`
Status: NEEDS_CORRECTION
Runtime files changed by this audit: no
Main touched: no
Render settings changed: no
Manual deployment triggered: no

## Executive finding

`phaser-migration-2` is now a real Phaser-owned runtime with substantially broader asset and activity coverage than its first checkpoint. It is not, however, a completed approved visual conversion and it does not yet satisfy Kam's requirement to stop seeing procedural shape art.

The branch currently mixes:

- Native Phaser scene ownership
- Asset-backed room and object SVGs
- Directional 8 FPS SVG character sheets
- 88 generated PNG activity sheets
- 23 generated PNG object-state images
- Phaser Graphics based architecture, lighting, vehicles, gates, arcade displays, basketball, pool effects, and other dynamic visuals
- Existing simulation and DOM UI systems

The major problem is that the PNG activity and state assets were generated from code-authored SVG primitives. They remain procedural shape art that has been rasterized into PNG files. PNG is only the container format. It does not make the underlying art authored or approved.

## Branch state

At audit time, `phaser-migration-2` and `main` are heavily diverged:

- `phaser-migration-2` is 110 commits ahead of the shared merge base.
- `phaser-migration-2` is 193 commits behind current `main`.

Therefore the branch cannot currently be described as containing every current main feature. A later selective sync and feature-by-feature parity audit are required. Do not blindly merge either branch.

## What is genuinely implemented

### Native Phaser ownership

- `src/main.js` marks the canvas as Phaser owned.
- `src/main.js` boots `bootPhaserMigration2Game()`.
- `src/phaserMigration2Runtime.js` creates a Phaser scene at 960 by 720.
- The old Canvas `draw()` renderer is not used as the primary branch renderer.
- Movement, autonomy, actions, calendar, life quality, arcade, basketball, pool, offsite, gate, save, phone, camera, and tidiness systems are connected to the Phaser scene.

### Broader asset coverage

- Separate room texture paths exist for primary room categories.
- Separate object SVG paths exist for many object kinds.
- Four directional 8 FPS character sheets exist for Resident, Girlfriend, Test Subject, and Dog.
- 27 named human activity families exist for three human profiles.
- Seven dog activity families exist.
- Twenty-three object-state PNGs exist.

### Tests and build checks

- Structural tests exist for native Phaser boot, activity list coverage, object-state list coverage, PNG file existence, mobile scaling, and gameplay system imports.
- Logs report repository checks, unit tests, static build, and PNG signature checks passed.
- No browser or Render visual approval is recorded.

## Critical findings

### 1. The new PNG activity art is still procedural

`scripts/p2-reference-visual-completion.mjs` constructs human bodies, dog bodies, props, poses, activity frames, and object states from SVG paths, ellipses, circles, rectangles, and scripted offsets. Sharp then rasterizes those generated SVG sheets into PNG files.

This means the branch has real PNG files, but the art method is still procedural vector construction. This violates the intended replacement rule when treated as finished artwork.

Required correction:

- Mark all generated activity PNGs and object-state PNGs as procedural temporary assets.
- Replace them with approved authored true top-down sprites rather than claiming PNG completion.
- Preserve their file paths as fallbacks only until final assets replace them.

### 2. Human sprites are not true top-down

The directional character SVGs visibly encode front-facing eyes, mouth, torso, arms hanging down, legs below the torso, and conventional upright front-view anatomy. The activity generator uses the same frontal body construction.

The files call themselves true top-down, but the path construction does not satisfy the true top-down visual law. Titles and manifest labels do not override the actual construction.

Required correction:

- Rebuild the static character proof from crown, shoulders, upper back/chest plane, compressed limb visibility, and overhead foreshortening.
- Get Kam's static approval before rebuilding walk and activity sheets.
- Do not rotate frontal sprites as a substitute for overhead directional anatomy.

### 3. Activity sprites can duplicate the base character

`syncCharacterVisuals()` maintains the active base character records in `scene.pm2ActorVisuals`.

`setLegacyActorVisible()` in `phaserMigration2ReferenceCompletion.js` does not inspect `scene.pm2ActorVisuals`. It checks other collection names and scans actor-layer children for entity IDs. The base character visual children created by `ensureActorVisual()` are not assigned those entity ID properties.

Result by code inspection:

- The activity PNG sprite can become visible.
- The normal walk/idle sprite can remain visible underneath it.
- Duplicate body overlap is likely during activities.

Required correction:

- Hide/show the exact `scene.pm2ActorVisuals.get(entity.id)` record.
- Set explicit entity IDs on actor display objects.
- Add a browser regression test that confirms only one body is visible per actor.

### 4. Runtime recovery can enter a repeated error loop

`recoverFrame()` destroys all scene children and draws a recovery screen. The scene update loop is not disabled and no terminal recovery flag prevents later updates from using destroyed references such as room layers, actor layers, status text, or visual systems.

Result by code inspection:

- The first error should show a visible recovery screen instead of a blank canvas.
- A later update can throw again because the normal render path continues.
- The scene can repeatedly recover and pause after multiple errors rather than remaining in one stable error state.

Required correction:

- Add a terminal `runtimeFailed` state.
- Stop normal update/render work after terminal recovery.
- Keep the recovery display alive and expose the first error clearly.

### 5. Asset loading is all-or-nothing

The scene records every Phaser asset load failure and throws during `create()` if any required asset failed. The branch preloads all room SVGs, object SVGs, character sheets, 88 activity PNG sheets, 23 object states, and other visual assets.

Result:

- One corrupt, missing, or incompatible optional visual asset can stop the entire game scene.
- This conflicts with the safe-fallback rule.

Required correction:

- Separate required boot assets from optional activity and state assets.
- Fall back per missing asset.
- Do not fail the whole scene because one activity sheet is unavailable.

### 6. Mobile texture memory and startup load are high

The activity system preloads 88 sheets at 1024 by 128 pixels. At four decoded bytes per pixel, that is roughly 44 MiB before counting object-state PNGs, four 512 by 512 directional sheets, SVG textures, browser copies, Phaser texture overhead, and other game assets.

This is a substantial mobile startup and memory risk, especially because all activities for all actors are loaded before play whether they are used or not.

Required correction:

- Load activity packs on demand or by floor/activity group.
- Unload distant or unused activity textures where safe.
- Build atlases intentionally rather than loading 111 separate PNG textures at boot.
- Measure real phone memory and startup time.

### 7. Procedural graphics still exist throughout the visible game

`phaserMigration2GameplayVisuals.js` draws the front gate, temporary vehicles, bikes, riders, arcade screen games, basketball court/ball, score overlays, and offsite visuals with Phaser Graphics primitives.

`phaserMigration2ReferenceCompletion.js` draws architecture, walls, windows, foreground occlusion, lights, TV glow, steam, and pool reflections with Graphics primitives.

These are Phaser-native, but they are still procedural visible art. Therefore the branch does not meet the rule that Kam should no longer see procedural art.

Required correction:

- Procedural Graphics may remain for genuinely dynamic effects such as water ripples, steam particles, selection rings, paths, or diagnostic overlays.
- Permanent objects, architecture, vehicles, bodies, furniture, and activity poses should use approved authored assets.

### 8. Room and object assets are still code-shape SVG art

The room textures are repeated 128 by 128 gradient/tile panels stretched over room rectangles. Many object sprites are SVG paths and gradients authored as compact code shapes.

This is an improvement over one generic object for everything, but it is not a full high-quality generated visual replacement throughout the game.

Required correction:

- Replace room panels with authored full-room top-down floor and material art.
- Replace object-kind art with object-ID-specific assets where construction, orientation, size, or state differs.
- Preserve collision and click dimensions separately from visual dimensions.

### 9. Object-state detection is not fully object-specific

The reference completion system can infer an active object from the first actor on the same floor whose activity supports that object kind. It does not always bind the actor to the exact object ID.

Also, sleep explicit IDs check `bedObjectId`, while the action system has used `sleepObjectId` in recent stabilization work.

Result:

- Repeated object kinds can show the wrong active state.
- Sleep may depend on nearest-object fallback instead of the recorded bed ID.

Required correction:

- Use explicit action object IDs consistently.
- Prefer `sleepObjectId`, `showerObjectId`, `toiletObjectId`, target, or pending object ID.
- Never activate every matching object on the floor because one actor is using one of them.

### 10. Automated tests do not validate visual quality

The current reference visual tests primarily confirm:

- Arrays contain expected activity names.
- Runtime source contains expected function names.
- PNG files exist.
- CSS contains a marker.

They do not confirm:

- true top-down anatomy
- no duplicate actor bodies
- correct object alignment
- correct rotation
- blanket coverage
- steam containment
- foreground occlusion
- visual quality
- mobile readability
- no blank screen in a real browser

Required correction:

- Add Playwright browser screenshots for representative floors and activities.
- Add pixel or image-diff checks only after approved visual baselines exist.
- Keep human visual approval as the final quality gate.

## Severity summary

| Finding | Severity | Status |
|---|---:|---|
| Generated PNGs remain procedural shape art | Critical | NEEDS_CORRECTION |
| Human sprites are frontal rather than true top-down | Critical | NEEDS_CORRECTION |
| Branch is 193 commits behind current main | Critical for full feature parity | NEEDS_SYNC_AUDIT |
| Activity/base actor duplication risk | High | NEEDS_CORRECTION |
| Recovery loop after scene destruction | High | NEEDS_CORRECTION |
| One optional asset can stop scene boot | High | NEEDS_CORRECTION |
| Preload memory/startup burden | High on mobile | NEEDS_MEASUREMENT |
| Procedural Phaser Graphics remain visible | High against Kam's art rule | NEEDS_REPLACEMENT |
| Room and object art remain vector-shape stand-ins | High | NEEDS_REPLACEMENT |
| Object state binding can select wrong object | Medium to high | NEEDS_CORRECTION |
| Tests are structural rather than visual | Medium | NEEDS_BROWSER_TESTING |

## Honest current status

### Engine conversion

PARTIAL BUT REAL

Phaser owns the scene, display list, textures, sprite animation, Graphics systems, pointer input, and update loop. This is more than the earlier Canvas bridge.

### Feature parity

NOT CURRENT

The branch has many synchronized gameplay systems, but it is 193 commits behind current `main`. Full parity must be re-audited against the latest main source.

### Visual replacement throughout

NO

Many categories now have individual files, but much of the art is still scripted SVG/Graphics construction. The generated PNG activity sheets are rasterized procedural art, not approved final sprites.

### Browser readiness

NEEDS_BROWSER_CONFIRMATION

Build and structural tests are reported as passing. No browser visual approval is recorded.

## Correct next execution order

1. Fix the duplicate actor visibility path and terminal recovery behavior.
2. Make optional visual assets use per-asset fallbacks instead of blocking the entire scene.
3. Audit and selectively reconcile current `main` feature changes into `phaser-migration-2` without importing Canvas rendering.
4. Replace the static Resident, Girlfriend, and Dog visuals with one approved true top-down proof each.
5. After static approval, rebuild walk cycles.
6. After walk approval, rebuild sitting.
7. Then replace each activity family with authored asset sheets, preserving the current activity/state wiring only where it is sound.
8. Replace permanent procedural architecture, furniture, vehicles, and object shapes with authored assets.
9. Keep Phaser Graphics only for effects that genuinely need to be dynamic.
10. Browser-test desktop and phone before any promotion to `main`.
