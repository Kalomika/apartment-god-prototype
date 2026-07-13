# Top Shot Development Log

This file tracks meaningful Top Shot repo changes so future AI agents, Codex, Copilot, Grok, or human developers can continue from the repository instead of chat history.

## 2026-07-13, Studio pipeline visual foundation

Branch: `top-shot-studio-pipeline`

Backup branch: `backup/top-shot-v0-1-2026-07-11-coverage-matrix`

Implemented the first recoverable studio pipeline slice: outline free toon materials, three band lighting separation, 8 FPS stepped actor poses over smooth simulation, Starshot presentation motion integration, camera facing 2D flash cards, binary asset auditing, a visual style smoke test, and the missing coverage matrix. Applied the focused grenade and dive finite state hardening from PR 25, then added the required `finiteOr` utility support. The previously reproduced `shadow_ninja vs field_agent` invalid state did not recur after hardening.

Automated results: `npm run check`, `npm run assets:check`, and `npm run starshot-smoke` passed before finite state hardening. The first full smoke run failed on `shadow_ninja vs field_agent`. After hardening, `node tests/simSmoke.js` passed all six matchups. Full smoke and build must be rerun after final documentation edits.

Deferred: browser automation, screenshot and video comparison, performance collector, expanded batch analytics, verified PR previews, texture atlas ingestion, GLTF production rig import, and browser visual QA.

## 2026-07-11, Starshot Meta-System hardening and debug overlay snapshot wiring

Tool or person: ChatGPT

Branch: `top-shot-starshot-engine`

Backup branch: `backup/top-shot-v0-1-2026-07-10`

Summary:

- Re-read the Top Shot repo memory docs and corrected the previous connector misunderstanding: PR payloads were from PR inspection calls, while direct `fetch_file` calls for repo paths are working.
- Hardened the Phase 0 Starshot Meta-System scaffold.
- Wired the debug overlay to build and display Starshot debug snapshots without changing gameplay logic.
- Added a standalone Starshot smoke test and package script.
- Preserved stable branch and did not touch Apartment God runtime.

Files changed:

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

Implemented:

- `eventBus.js` now safely handles non-object payloads, listener errors, one-shot listeners, listener counts, and separate history clearing.
- `timingController.js` now uses safer profile validation, finite time normalization, active timing snapshots, and last profile tracking.
- `actorRuntimeState.js` now derives clearer animation states for current moves, including light, heavy, finisher, counter, mount, prone, crouch, walk, and run states.
- `actorRuntimeState.js` now avoids under-reporting movement speed when only `fighter.lastMove` exists.
- `debugSnapshot.js` now exposes timing scale, timing debug formatting, and richer actor debug lines.
- `actorUpdatePipeline.js` now stores runtime state on actor objects when used and exposes active stages.
- `debugOverlay3D.js` now imports the Starshot debug snapshot layer and shows a Starshot timing line plus per-fighter Starshot actor telemetry.
- `tests/starshotSmoke.js` exercises the event bus, timing controller, actor runtime state, debug snapshot formatting, and update pipeline.
- `package.json` adds `npm run starshot-smoke`.

Testing:

- Not run in this connector environment.
- The repo now has a dedicated command for this slice: `npm run starshot-smoke`.
- Existing `npm run smoke` still has a known issue documented by PR #5: `suit_operative vs survival_commando` can fail with `Invalid fighter state`.

Known risks:

- Debug overlay labels may need visual spacing tweaks in browser.
- Starshot timing is visible to debug snapshots but is not yet wired into the world update loop as a gameplay timing source.
- Starshot actor update pipeline is still a scaffold and not yet the main actor pipeline.
- Local syntax and browser checks still need to run.

Next recommended step:

Run `npm run check`, `npm run starshot-smoke`, `npm run smoke`, and `npm run build` from `top-shot/`. If Starshot smoke passes, continue by safely wiring `actorMotion3D.js` and `animationState3D.js` into the actor presentation layer.

## 2026-07-10, Starshot branch created and first scaffolding started

Tool or person: ChatGPT

Branch: `top-shot-starshot-engine`

Backup branch: `backup/top-shot-v0-1-2026-07-10`

Summary:

- Created the Starshot experimental branch from the debug overlay branch.
- Added first slice scaffolding for future motion and animation work.
- Paused deeper code integration so Top Shot repo memory and team workflow docs could be created first.

Files added before documentation pass:

- `top-shot/src/three/animationState3D.js`
- `top-shot/src/three/actorMotion3D.js`

Known state:

- These files are not yet fully integrated into `topShot3D.js` or `actors3D.js`.
- Treat this branch as experimental and not merge-ready.

Testing:

- Not run.

Next recommended step:

After docs are complete, integrate motion/animation scaffolding into the 3D actor presentation layer in a small recoverable commit, then run `npm run check`, `npm run smoke`, and `npm run build` from `top-shot/`.

## 2026-07-10, Repo memory and Starshot protocol scaffold

Tool or person: ChatGPT

Branch: `top-shot-starshot-engine`

Backup branch: `backup/top-shot-v0-1-2026-07-10`

Summary:

- Mirrored Top Shot repo-native agent instructions and development memory docs into the Starshot branch.
- Added `top-shot/AGENTS.md` as the short entry point for future tasks.
- Added `top-shot/docs/TOP_SHOT_HANDBOOK.md` as the full project development Bible.
- Added this development log.
- Added handoff, feature inventory, architecture, QA checklist, and Starshot roadmap docs.
- Established that Top Shot is separate from Apartment God main.
- Established stable, backup, and experimental branch rules.
- Established Starshot Mode for ambitious branches with rollback discipline.

Files added:

- `top-shot/AGENTS.md`
- `top-shot/docs/TOP_SHOT_HANDBOOK.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/FEATURE_INVENTORY.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/STARSHOT_ROADMAP.md`

Systems affected:

- Documentation and workflow.
- Starshot branch already contains first motion/animation scaffolding, but no additional runtime integration was done during this documentation pass.

Testing:

- Not run. Documentation pass.

Known risks:

- Starshot branch has unintegrated scaffolding and is not merge-ready.
- Future agents must follow the docs and keep them updated.

Next recommended step:

Continue Starshot Phase 1: integrate visual motion smoothing and animation state into the actor presentation layer without changing gameplay simulation state.
