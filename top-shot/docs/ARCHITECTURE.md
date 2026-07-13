# Top Shot Architecture

This document describes the current Top Shot architecture and the intended direction for future systems.

## Project root

Top Shot lives in:

`top-shot/`

Do not edit Apartment God main runtime for Top Shot work.

## Runtime style

Top Shot is a lightweight browser game using JavaScript modules and Three.js. It should remain modular and static-site friendly.

## Known major modules

- `src/main.js`: bootstraps UI, world creation, mode switching, controls, clickable map commands, local records, HUD rendering, and the frame loop.
- `src/state.js`: creates and manages battle state and fighter state.
- `src/systems.js`: runs match simulation, deployment, fighter updates, pickups, retrievals, state sanitization, and finish checks.
- `src/cqcLab.js`: isolated CQC Lab behavior, actions, hitboxes, mounting, grounded behavior, and CQC testing.
- `src/brain.js`: high level AI intent selection.
- `src/perception.js`: line of sight, sound, movement, cover, stealth interaction, route caching, and navigation helpers.
- `src/navmesh.js`: grid/node pathing fallback over the arena collision layout.
- `src/tactics.js`: tactical posture choices such as ducking, bracing, strafing, and tactical rolls.
- `src/combat.js`: ranged fire, melee, counters, disarms, projectile updates, suppression, hits, finishes, and incapacitation.
- `src/explosives.js`: grenades, grenade reactions, dive movement safety, and blast damage.
- `src/stealth.js`: global stealth phase, fighter awareness, visual/sound/evidence detection, and search planning.
- `src/hiding.js`: shadow hiding timers and last-seen investigation behavior.
- `src/wounds.js`: bleeding, blood trails, bandaging, and bleed incapacitation.
- `src/vitality.js`: vitality stages, cap updates, recovery, and sudden incapacitation chances.
- `src/physicality.js`: match-mode body separation, impact debris, throwable debris, and debris physics.
- `src/prestige.js`: sleeper holds, finish decisions, respectful/ruthless finish behavior.
- `src/requests.js`: fighter request cards for coach help, medical, ammo, extraction, and command prompts.
- `src/cameraAngles.js`: camera modes and keyboard camera controls.
- `src/three/topShot3D.js`: Three.js world, terrain, camera, actor sync, markers, and collision debug.
- `src/three/actors3D.js`: segmented placeholder actors, poses, weapons, limb volumes, and body zones.
- `src/three/effects3D.js`: effects, parachutes, tracers, impact visuals, CQC actor stabilization.
- `src/three/debugOverlay3D.js`: debug telemetry where present on overlay branches.

## Current architecture principle

Simulation state is the source of truth. The 3D world presents that state.

Visual smoothing, animation layering, micro-motion, and debug rendering should not mutate gameplay decisions unless a system is explicitly designed to do so.

Tests should encode preservation targets without depending on random luck. When a smoke path needs to verify a specific branch, it should set up deterministic conditions instead of hoping a random roll hits the desired behavior.

## Starshot architecture target

Future systems should prefer modular additions:

- `src/three/actorMotion3D.js` for visual presentation motion.
- `src/three/animationState3D.js` for animation state derivation and micro-motion.
- `src/combat/combatTiming.js` for timing profiles and impact pause rules.
- `src/combat/comboCore.js` for combo chains and counter windows.
- `src/profiles/characterProfiles.js` for character stats, abilities, styles, and power scales.
- `src/ai/aiStyles.js` for AI profile behavior.
- `src/arena/generateArenaFromPrompt.js` for procedural arena generation.
- `src/sim/tournamentRunner.js` for repeated simulations and match logs.

## Integration guidance

- Add new modules instead of bloating `main.js`.
- Preserve `state.js` as the gameplay source of truth unless an explicit state refactor is the task.
- Keep CQC Lab isolated and testable.
- Keep debug overlays read-only.
- Keep stable branch runtime safe.
- Do risky rewrites only on experimental branches.
- Keep smoke tests as safety gates. Split smoke scripts can isolate failures, but full `npm run smoke` remains the regression gate.

## Render and build constraints

Top Shot is a static site. From `top-shot/`:

```bash
npm run check
npm run smoke:sim
npm run smoke:cqc
npm run smoke:stealth
npm run smoke:model
npm run smoke
npm run build
```

The Render Blueprint should use `top-shot/render.yaml` and publish `dist`.

## Refactor rule

If a system is replaced, the handoff must document:

- The old system's role.
- The new system's role.
- Migration path.
- How to test equivalence.
- Rollback path.
