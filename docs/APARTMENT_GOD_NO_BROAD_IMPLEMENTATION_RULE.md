# Apartment God No Broad Implementation Rule

Status: ACTIVE PRODUCTION RULE
Branch introduced: phaser-migration
Date introduced: 2026-07-12

## Rule

Apartment God must not use broad, generic, or shared placeholder logic for visuals, poses, animations, object interactions, room layouts, or activity states when a specific state is required.

Every meaningful activity must resolve to:

```txt
1. a specific activity state
2. an object aware pose or animation
3. a visually correct relationship to the object or environment
4. a true top down presentation
5. a clearly named temporary fallback only when the final state is not yet built
```

Generic buckets like `interact`, `sit`, `workout`, `use object`, `act`, or broad sleep and shower shortcuts are not acceptable as final implementations when distinct activities exist beneath them.

## Hard examples

```txt
Lifting weights cannot share the same pose as punching a heavy bag.
Treadmill cannot share the same pose as walking to an object.
Desk laptop use cannot share the same pose as reading or phone use.
Bed sleeping under covers cannot share the same visual as lying awake.
Showering cannot rely on blurry censorship overlays.
Dog washing cannot share generic petting or shower logic.
Closets, baths, beds, and furniture must reflect their actual intended physical structure and gameplay use.
```

## Fallback rules

A fallback is allowed only when it is explicitly temporary.

Every fallback must be:

```txt
1. documented
2. visually or structurally named as temporary in development tracking
3. scheduled for replacement
4. never represented as final quality
```

## Current enforcement note

This rule was added because broad pose families and generic visual shortcuts caused the game to show repeated waddling, reused activity poses, shower blur, weak bed blanket logic, and object layouts that did not match the intended physical design.

Future agents must reject broad implementation before committing runtime changes.
