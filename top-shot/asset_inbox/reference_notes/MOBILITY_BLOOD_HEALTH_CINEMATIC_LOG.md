# Top Shot Mobility, Blood, Health, and Cinematic Log

Date: 2026-07-09
Branch: top-shot-v0-1
Purpose: Preserve the requested mobility, damage feedback, health UI, movement pacing, and intro/outro direction for any AI or human agent working on Top Shot.

## User request

The user requested that fighters should be able to climb and jump off objects, should prioritize getting away and reaching cover quickly when under bullet fire, should show tiny blood spray instead of generic impact flashes when bullets hit bodies, should leave visible blood when bleeding, should show health percentage or the five health stages in the menu, should move at realistic human pace instead of exaggerated speed, and should finally include the intro/outro animation situation.

## Implementation completed

This pass adds:

- Climbable and elevated terrain metadata for containers, boulders, scrap stacks, tanks, the raised catwalk, and stair access.
- Fighter mobility fields for `elevation`, `onObject`, `climbT`, and `jumpT`.
- Terrain aware movement so fighters can climb onto climbable objects or jump down from them.
- Suppression priority, where fighters under bullet fire break for cover or elevation instead of continuing to attack in open space.
- Human pace tuning in movement so normal running is less exaggerated while evasive movement still has urgency.
- Bullet body hits now spawn tiny `blood_spray` effects.
- Active bleeding now spawns periodic `blood_drop` effects so trails/pools are visible.
- HUD health percentage, vitality cap, and a five stage ladder plus incapacitation slot.
- Intro cinematic state for parachute entry and outro cinematic state for victory/down finish handling.
- Smoke test coverage for intro/running cinematic states, elevation fields, and valid health percentage range.

## Runtime files changed

- `top-shot/src/arena.js`
- `top-shot/src/perception.js`
- `top-shot/src/combat.js`
- `top-shot/src/wounds.js`
- `top-shot/src/state.js`
- `top-shot/src/systems.js`
- `top-shot/src/three/effects3D.js`
- `top-shot/src/main.js`
- `top-shot/styles.css`
- `top-shot/tests/simSmoke.js`
- `top-shot/docs/CHANGELOG.md`

## Next priorities

This is a playable system pass. The next quality pass should add authored climb and jump animations, hands grabbing ledges, foot planting on raised surfaces, better jump down arcs, richer camera emphasis during intro/outro, and a clearer blood decal system that sticks to terrain without over-spawning.
