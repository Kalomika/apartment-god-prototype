# Top Shot Starshot Roadmap

This roadmap is for ambitious experimental work. It is not a promise that every item is implemented yet.

## Starshot rule

Starshot work must happen on an experimental branch after a backup branch exists.

Current backup:

`backup/top-shot-v0-1-2026-07-10`

Current experimental branch:

`top-shot-starshot-engine`

## Phase 1: Motion, animation, and debug visibility

Goals:

- Visual motion smoothing and inertia.
- Acceleration and deceleration feel.
- Turn smoothing.
- Animation state tracking.
- Micro-motion for idle, crouch, prone, and mount states.
- Debug overlay showing animation and motion state.

Principle:

Simulation remains the source of truth. Presentation smoothing should not mutate gameplay decisions.

## Phase 2: Combat timing and impact

Goals:

- Timing profiles: real time, slow motion, impact pause, cinematic slow.
- Hit frames.
- Impact frames.
- Recovery windows.
- Combo chain metadata.
- Counter windows.
- Debug timing display.

Principle:

Do not replace CQC all at once. Extend it with animation-driven timing first.

## Phase 3: Character profiles and power scales

Goals:

- Data driven character profiles.
- Power scales: human, enhanced, superhuman, cosmic.
- Move sets by style.
- AI styles by profile.
- Damage and movement modifiers from profiles.

Principle:

Profiles should feed existing systems before replacing them.

## Phase 4: Smarter AI coordination

Goals:

- Aggressor, flanker, tactician, sniper, assassin, brawler, and defensive AI styles.
- Cover, flank, retreat, push, regroup, and counter behavior.
- Crowd management for team fights.
- Debug overlay explaining decisions.

Principle:

AI should expose why it made a decision, not just what it did.

## Phase 5: Procedural arenas

Goals:

- Structured prompt input.
- Modular arena rules for city, industrial, forest, desert, port, rooftops, and hybrid arenas.
- Spawn point selection.
- Cover, lanes, chokepoints, vertical features, and open areas.
- Collision and navigation compatibility.

Principle:

Generated arenas must remain playable, readable, and testable.

## Phase 6: Versus and tournament simulation

Goals:

- Run repeated fights.
- Track wins, losses, match time, damage dealt, notable events, and style matchups.
- Export or display logs.
- Support team fight formats later.

Principle:

Tournament results should help balance the game and reveal AI problems.

## Phase 7: Polish and public readiness

Goals:

- Performance pass.
- Better visual effects.
- Sound hooks using safe or original audio.
- Camera drama while keeping top down clarity.
- UI clarity and accessibility.
- Public build checks.

Principle:

Polish should enhance readability, not hide weak mechanics.
