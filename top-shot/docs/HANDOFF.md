# Top Shot Handoff

## 2026-07-21 full stabilization pass

Active branch: `top-shot-full-stabilization-2026-07-21`, based on `top-shot-studio-pipeline`.

Backup branch: `backup/top-shot-studio-pipeline-2026-07-21-stabilization`.

Draft PR: [PR #34, Stabilize full Top Shot validation and smoke coverage](https://github.com/Kalomika/apartment-god-prototype/pull/34).

Implemented in this pass:

- Corrected CQC Lab spawn placement so both full body radii begin on legal floor space instead of Fighter B spawning inside the center boulder.
- Routed CQC movement, separation, recoil, reset placement, grounded recovery, and mount anchors through arena-aware collision correction.
- Preserved body shots, sweeps, trips, throws, mounting, mounted attacks, mount escape, limb grabs, disarms, hitboxes, and auto CQC.
- Fixed the stale stealth smoke expectation while retaining hard sight, sound suspicion, memory, and search-plan checks.
- Added safe archetype fallbacks and initialized finite elevation, climb, jump, and object state on every match fighter.
- Strengthened simulation smoke to check finite fighter and projectile state during deployment and combat, including the dive-without-velocity regression.
- Removed the effects pipeline's second scene render per frame.
- Corrected deployment and terrain height conversion in the Three.js effects presentation layer.
- Added a render pipeline smoke test and a complete `npm run validate` gate.

Verified locally from the exact CI source snapshot:

- `npm run check`
- `npm run assets:check`
- `npm run starshot-smoke`
- `npm run smoke:sim`
- `npm run smoke:cqc`
- `npm run smoke:stealth`
- `npm run smoke:model`
- `npm run smoke`
- `npm run build`
- `npm run validate`

The branch remains experimental until the final GitHub Actions run and browser QA are complete. Stable remains untouched.

## Current status

Top Shot is a top down Three.js AI arena combat prototype isolated under `top-shot/`.

The stable branch is `top-shot-v0-1`.

A backup branch was created before Starshot work:

`backup/top-shot-v0-1-2026-07-10`

The current experimental Starshot branch is:

`top-shot-starshot-engine`

## Source of truth

Read these before any Top Shot task:

1. `top-shot/AGENTS.md`
2. `top-shot/docs/TOP_SHOT_HANDBOOK.md`
3. `top-shot/docs/HANDOFF.md`
4. `top-shot/docs/DEVELOPMENT_LOG.md`
5. `top-shot/docs/FEATURE_INVENTORY.md`
6. `top-shot/docs/ARCHITECTURE.md`
7. `top-shot/docs/QA_CHECKLIST.md`
8. `top-shot/docs/COVERAGE_MATRIX.md`
9. Recent commits on the active branch
10. Open PRs related to Top Shot
11. The exact files to edit

## Latest Starshot pass

### 2026-07-13 studio pipeline slice

Active branch: `top-shot-studio-pipeline`, based on `top-shot-starshot-engine`.

Visual direction is now explicit in code: no outlines, color and lighting separate forms, 8 FPS stepped character poses, smooth simulation and camera, 2D camera facing effects, detailed human proportioned 3D characters, painterly environment target, and future anatomically rich GLTF rigs. This pass is experimental and requires browser QA before any stable merge.

The asset audit and visual smoke are implemented. Browser capture, profiling, batch analytics, verified preview automation, texture atlas support, and production rig importing remain next slices.

Remote publishing: `top-shot-studio-pipeline` was published through the authenticated GitHub connector after ordinary HTTPS push failed for lack of checkout credentials. Backup branch: `backup/top-shot-studio-pipeline-2026-07-13`. This branch is intended for a separate Render preview, not replacement of stable.

Branch:

`top-shot-starshot-engine`

Implemented:

- Hardened the Starshot Phase 0 Meta-System scaffold.
- Corrected the earlier connector confusion and used direct file fetches before patching.
- Wired `debugOverlay3D.js` to the Starshot debug snapshot layer.
- Added `npm run starshot-smoke` and `top-shot/tests/starshotSmoke.js`.
- Updated the canonical `top-shot/docs/DEVELOPMENT_LOG.md` with the Starshot hardening pass.

Files changed in latest pass:

- `top-shot/src/starshot/eventBus.js`
- `top-shot/src/starshot/timingController.js`
- `top-shot/src/starshot/actorRuntimeState.js`
- `top-shot/src/starshot/debugSnapshot.js`
- `top-shot/src/starshot/actorUpdatePipeline.js`
- `top-shot/src/three/debugOverlay3D.js`
- `top-shot/tests/starshotSmoke.js`
- `top-shot/package.json`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/FEATURE_INVENTORY.md`

What changed in gameplay:

- No core gameplay decisions were intentionally changed.
- The debug overlay now builds and displays Starshot snapshot telemetry when toggled with `D`.
- Match logic and CQC Lab were preserved.

## Current Starshot state

`top-shot-starshot-engine` is intended for ambitious engine work.

It now has two foundations:

1. Phase 0 Meta-System scaffold and debug visibility.
2. First motion/animation scaffold files.

Existing first Starshot slice files:

- `top-shot/src/three/animationState3D.js`
- `top-shot/src/three/actorMotion3D.js`

Current Meta-System scaffold files:

- `top-shot/src/starshot/eventBus.js`
- `top-shot/src/starshot/timingController.js`
- `top-shot/src/starshot/actorRuntimeState.js`
- `top-shot/src/starshot/debugSnapshot.js`
- `top-shot/src/starshot/actorUpdatePipeline.js`

Treat this branch as experimental and not merge ready until checks run and browser behavior is verified.

## Important branches

Stable:

`top-shot-v0-1`

Backup:

`backup/top-shot-v0-1-2026-07-10`

Experimental:

`top-shot-starshot-engine`

Debug overlay PR branch:

`top-shot-debug-overlay`

## Required checks

From `top-shot/`:

```bash
npm run check
npm run starshot-smoke
npm run smoke
npm run build
```

## Manual QA focus

- Match mode loads.
- CQC Lab loads.
- Fighter selection works.
- Fighters move, fight, use cover, and use stealth.
- Mounting and grounded CQC still work.
- Projectiles and effects render.
- Debug overlay toggles with `D`.
- Collision debug toggles with `C`.
- Starshot debug line appears in the overlay.
- Per-fighter Starshot animation/motion/combat telemetry is readable.
- No console errors on start.
- No obvious visual squashing.

## Known current constraints

- PR #5 notes a known smoke issue: `suit_operative vs survival_commando` can fail with `Invalid fighter state`.
- PR #23, the debug overlay PR, remains open.
- This environment did not run local `npm` checks.
- Starshot timing is visible in debug snapshots but is not yet a gameplay timing source.
- Starshot actor update pipeline is scaffolded but is not yet the main actor presentation pipeline.

## Do not touch without explicit reason

- Apartment God main runtime.
- Stable Top Shot runtime for risky changes.
- Existing working CQC behavior unless replacing it is the explicit task.

## Required completion report

Every coding pass must report:

- Branch used
- Backup branch used or created
- Commit SHA
- Files changed
- What was implemented
- What was tested
- What failed or was deferred
- Known risks
- Exact next step
- PR link or branch link
