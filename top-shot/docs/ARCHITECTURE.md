# Top Shot Architecture

This document describes the current Top Shot architecture and the intended direction for future systems.

## Project root

Top Shot lives in:

`top-shot/`

Do not edit Apartment God main runtime for Top Shot work.

## Runtime style

Top Shot is a lightweight browser game using JavaScript modules and Three.js. It should remain modular and static-site friendly.

## Known major modules

- `src/main.js`: bootstraps UI, world creation, mode switching, controls, and frame loop.
- `src/state.js`: creates and manages battle state and fighter state.
- `src/systems.js`: runs match simulation and fighter system updates.
- `src/cqcLab.js`: isolated CQC Lab behavior, actions, hitboxes, mounting, grounded behavior, and CQC testing.
- `src/brain.js`: high level AI intent selection.
- `src/perception.js`: line of sight, sound, movement, cover, and navigation helpers.
- `src/tactics.js`: tactical and combat choices where implemented.
- `src/combat.js`: combat resolution where implemented.
- `src/stealth.js`: stealth, detection, and search behavior.
- `src/three/topShot3D.js`: Three.js world, terrain, camera, actor sync, markers, and collision debug.
- `src/three/actors3D.js`: segmented placeholder actors, poses, weapons, limb volumes, and body zones.
- `src/three/effects3D.js`: effects, parachutes, tracers, impact visuals, CQC actor stabilization.
- `src/three/debugOverlay3D.js`: debug telemetry and Starshot snapshot display where present.
- `src/three/visualStyle3D.js`: canonical outline free toon, 8 FPS pose sampling, and 2D effects presentation policy.

## Current architecture principle

Simulation state is the source of truth. The 3D world presents that state.

Visual smoothing, animation layering, micro-motion, timing views, and debug rendering should not mutate gameplay decisions unless a system is explicitly designed to do so.

## Starshot Phase 0 Meta-System

The Starshot Meta-System is an orchestration spine, not a God controller.

Current Phase 0 files:

- `src/starshot/eventBus.js`: lightweight inspectable event bus for cross-system messages.
- `src/starshot/timingController.js`: debug-safe timing profile controller for real time, slow motion, impact pause, and cinematic slow.
- `src/starshot/actorRuntimeState.js`: derives a normalized actor runtime state from existing fighter and optional 3D actor data.
- `src/starshot/debugSnapshot.js`: converts actor runtime state into compact debug overlay/tooling snapshots.
- `src/starshot/actorUpdatePipeline.js`: scaffold for staged profile, AI, combat, motion, animation, rendering, and debug updates.

Current integration:

- `src/three/debugOverlay3D.js` reads Starshot debug snapshots and displays timing plus per-fighter animation, motion, combat, and AI telemetry.
- The Starshot timing controller is not yet the gameplay timing source.
- The Starshot actor update pipeline is not yet the main actor presentation pipeline.
- `actorMotion3D.js` is now called after simulation actor sync on the studio pipeline branch. Simulation remains authoritative while presentation position and facing ease toward it.
- Rig poses sample at 8 FPS while rendering, input, simulation, camera, and collision continue at the normal update rate.
- Impact and muzzle flashes use camera facing planes as the first 2D effects slice.

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
- Integrate Starshot systems by wrapping and deriving from existing state before replacing any working gameplay system.

## Render and build constraints

Top Shot is a static site. From `top-shot/`:

```bash
npm run check
npm run starshot-smoke
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
