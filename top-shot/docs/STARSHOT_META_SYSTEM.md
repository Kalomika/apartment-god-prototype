# Starshot Meta-System

This document defines the Starshot Meta-System layer for Top Shot.

The Meta-System is the orchestration spine that keeps motion, animation, combat, AI, profiles, arenas, rendering, timing, and debug aligned without turning the game into one giant controller file.

## Rule

This is not a God controller.

The Meta-System coordinates modules. It does not erase modular boundaries.

Gameplay state remains the source of truth until a deliberate migration is documented.

## Why it exists

Top Shot is growing toward a monster combat and versus simulation engine. The game needs many systems to understand the same actor at the same time:

- motion
- animation
- combat
- AI
- profile
- arena/navigation
- rendering
- timing
- debug

Without a shared orchestration layer, each system drifts into its own island.

With the Meta-System, the engine can reason about Superman-scale combat, Snake-style infiltration, Arkham-style timing, procedural arenas, and 2.5D stepped visual presentation through one consistent runtime model.

## Phase 0 modules

The initial Meta-System layer lives in:

- `top-shot/src/starshot/actorRuntimeState.js`
- `top-shot/src/starshot/eventBus.js`
- `top-shot/src/starshot/timingController.js`
- `top-shot/src/starshot/actorUpdatePipeline.js`
- `top-shot/src/starshot/debugSnapshot.js`

## Unified actor runtime state

Every actor should eventually expose a normalized runtime model:

```js
{
  id,
  team,
  archetypeId,
  profile,
  powerScale,
  motion,
  animation,
  combat,
  ai,
  arena,
  rendering,
  timing,
  debug
}
```

The first implementation derives this from existing fighter data and optional 3D actor presentation data.

It must not destroy existing fighter state.

## Event bus

The event bus is a small inspectable message system for cross-system coordination.

Important events include:

- `actor_spawned`
- `actor_removed`
- `motion_started`
- `motion_stopped`
- `animation_state_changed`
- `attack_started`
- `hit_frame_opened`
- `hit_frame_closed`
- `attack_connected`
- `counter_window_opened`
- `counter_window_closed`
- `impact_pause_requested`
- `impact_pause_started`
- `impact_pause_ended`
- `ai_state_changed`
- `cover_entered`
- `cover_left`
- `arena_zone_entered`
- `arena_zone_left`
- `profile_power_scale_changed`
- `render_style_changed`

The bus should stay simple. No hidden magic.

## Timing controller

The timing controller exposes raw and scaled frame time.

Supported profiles:

- `real_time`
- `slow_mo`
- `impact_pause`
- `cinematic_slow`

Combat and animation can later request timing changes through it.

The first implementation must be debug-safe and should not corrupt simulation state.

## Actor update pipeline

Preferred high-level order:

1. profile derivation
2. AI decision
3. combat intent
4. motion target
5. animation state
6. presentation/render state
7. debug snapshot

The first implementation is a coordinator scaffold. Existing systems are not replaced in one jump.

## Debug snapshot layer

The debug snapshot is a normalized view of actor state for the debug overlay.

It should expose:

- actor id
- team
- archetype id
- profile id
- power scale
- motion state
- velocity
- speed target
- animation state
- stepped animation FPS
- combat state
- current move
- hit frame state
- counter window state
- AI intent
- target
- timing profile
- arena zone
- important flags

The overlay should gradually migrate to this snapshot instead of scraping unrelated fields forever.

## Migration discipline

Do not replace gameplay systems all at once.

First create the spine.

Then connect debug snapshots.

Then connect timing.

Then connect motion and animation presentation.

Then connect combat timing.

Then connect AI, profiles, arenas, and tournament logic.

Each migration must update:

- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md` when expectations change

## Current status

Phase 0 begins as a safe scaffold on `top-shot-starshot-engine`.

No stable branch runtime should be affected by this document or the initial scaffold files.
