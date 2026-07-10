# Top Shot Handbook

This handbook is the full development Bible for Top Shot. Every AI agent, developer, or reviewer must read this before changing Top Shot.

## 1. Project identity

Top Shot is a custom Three.js top down AI arena combat and versus simulation game.

Top Shot lives in:

`Kalomika/apartment-god-prototype/top-shot/`

Top Shot is not Apartment God main. Apartment God can be used as a development-method reference, but Top Shot has its own runtime, branches, docs, checks, and design goals.

## 2. Core vision

Top Shot should grow into a top down combat and versus simulation engine with:

- PS2 and early PS3 era motion readability and physical presence.
- Intentional body language inspired by Metal Gear Solid 2/3, ICO, Shadow of the Colossus, Enter the Matrix, and Batman: Arkham Asylum.
- Arkham inspired combat flow adapted to a top down view.
- Strong CQC, counters, hit frames, impact pauses, mounting, grounded combat, disarms, sweeps, body shots, throws, and readable reactions.
- Character profiles for tactical soldiers, martial artists, gun kata fighters, ninjas, superheroes, monsters, X-Men style teams, Avengers style teams, anime scale fighters, and original archetypes.
- AI that can take cover, flank, retreat, push, counter, use powers, use weapons, and act with purpose.
- Procedural or prompt driven arenas using modular rules.
- Tournament and repeated simulation modes that log winners, match length, damage, styles, and notable events.
- Debug tools that reveal AI decisions, motion state, combat timing, hitboxes, targets, and animation state.

## 3. Current branches

Stable base branch:

`top-shot-v0-1`

Current backup branch:

`backup/top-shot-v0-1-2026-07-10`

Current experimental branch:

`top-shot-starshot-engine`

Experimental branches may break temporarily. Stable branches must stay deployable.

## 4. Source of truth workflow

The repository is the source of truth. Chat history is not enough.

Before each Top Shot task, read:

1. `top-shot/AGENTS.md`
2. `top-shot/docs/TOP_SHOT_HANDBOOK.md`
3. `top-shot/docs/HANDOFF.md`
4. `top-shot/docs/DEVELOPMENT_LOG.md`
5. `top-shot/docs/FEATURE_INVENTORY.md`
6. `top-shot/docs/ARCHITECTURE.md`
7. `top-shot/docs/QA_CHECKLIST.md`
8. Recent commits on the active branch
9. Open PRs related to Top Shot
10. The exact files to edit

Always check the latest repo state before coding because other AI agents or humans may have changed the code.

## 5. Branch discipline

Small fixes can use a focused branch.

Risky changes require a backup branch first.

Large changes require a development or experimental branch.

Do not merge experimental work until it passes checks and regression testing.

Do not force push or overwrite another agent's work unless Kam explicitly asks for a bigger replacement.

## 6. Starshot Mode

Starshot Mode activates when Kam says shoot for the stars, build the monster version, go big, or similar.

Starshot Mode means:

1. Confirm or create a backup branch.
2. Create or use an experimental branch.
3. Build ambitious systems in recoverable slices.
4. Preserve the stable branch.
5. Document each meaningful pass.
6. Run checks when possible.
7. Be honest about what is tested and untested.
8. Merge only when the monster becomes stable.

Starshot Mode allows deep refactors, but not careless overwriting.

## 7. Current technical foundation

Top Shot uses:

- JavaScript modules.
- Three.js.
- A `world` object with scene, camera, renderer, actors, marker roots, update, and sync systems.
- `top-shot/src/three/topShot3D.js` for the 3D runtime.
- `top-shot/src/three/actors3D.js` for actor rigs, poses, and placeholder character rendering.
- `top-shot/src/three/effects3D.js` for muzzle flashes, tracers, impact flashes, landing flashes, parachutes, and CQC pose stabilization.
- `top-shot/src/three/debugOverlay3D.js` for debug visualization.
- Existing CQC systems.
- Existing AI, perception, tactics, combat, stealth, and state modules.
- Existing smoke tests.

## 8. Important files to inspect before major work

Always inspect relevant current files before editing, especially:

- `top-shot/src/main.js`
- `top-shot/src/state.js`
- `top-shot/src/systems.js`
- `top-shot/src/cqcLab.js`
- `top-shot/src/three/topShot3D.js`
- `top-shot/src/three/actors3D.js`
- `top-shot/src/three/effects3D.js`
- `top-shot/src/three/debugOverlay3D.js`

Prefer modular new files instead of making giant controller files.

## 9. Build and test commands

From `top-shot/`:

```bash
npm run check
npm run smoke
npm run build
```

Never claim tests passed unless they were actually run.

## 10. Baseline preservation rule

Existing working gameplay must be preserved unless Kam explicitly asks for replacement.

If replacing a system, document:

- What the old system did.
- What the new system does.
- Why replacement was necessary.
- How to test that the gameplay purpose still works.
- How to roll back if needed.

## 11. Required repo memory files

Top Shot must maintain:

- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/FEATURE_INVENTORY.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md`

Optional but encouraged:

- `top-shot/docs/STARSHOT_ROADMAP.md`
- `top-shot/docs/COMBAT_DESIGN.md`
- `top-shot/docs/AI_DESIGN.md`
- `top-shot/docs/ANIMATION_DESIGN.md`
- `top-shot/docs/ARENA_GENERATION.md`

Every meaningful coding pass updates `DEVELOPMENT_LOG.md` and `HANDOFF.md`.

Feature changes update `FEATURE_INVENTORY.md`.

Architecture changes update `ARCHITECTURE.md`.

Test expectation changes update `QA_CHECKLIST.md`.

## 12. Required completion report

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

## 13. Preferred Starshot implementation order

Phase 1: Motion, animation state, visual inertia, micro-motion, and debug visibility.

Phase 2: Combat timing profiles, hit frames, impact pause, combo windows, and counter windows.

Phase 3: Character profiles, power scales, move sets, and AI style profiles.

Phase 4: AI coordination, cover/flank/retreat/push logic, behavior scoring, and explainable AI overlay.

Phase 5: Procedural arena generation, modular stage rules, prompt structures, and spawn logic.

Phase 6: Tournament mode, simulation logs, repeated fight stats, and balance diagnostics.

Phase 7: Polish pass, sound hooks, camera drama, performance, UI clarity, and public build readiness.

## 14. No fake confidence

Do not say tests passed if they were not run.

Do not say a branch is merge ready if it has not been checked.

Do not say a file exists if it was not verified.

Do not dismiss another AI's work without inspecting it.

Do not call scaffolding a complete system.

Acceptable language:

- Implemented first slice.
- Unverified in browser.
- Smoke tests not run in this environment.
- Experimental branch, not merge ready.
- Needs local run.

## 15. Final principle

Top Shot is allowed to become a monster.

The correct workflow is:

Back up the stable game.
Create a wild experimental branch.
Build ambitious systems in recoverable slices.
Document every pass.
Keep the live branch safe.
Test aggressively.
Merge only when the monster becomes stable.
