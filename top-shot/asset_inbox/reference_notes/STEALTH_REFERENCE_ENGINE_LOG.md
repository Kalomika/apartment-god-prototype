# Top Shot Stealth Reference Engine Log

Date: 2026-07-08
Branch: top-shot-v0-1
Purpose: Preserve the stealth engine study and implementation takeaways for any AI or human agent working on Top Shot.

## Reference direction

Do not copy proprietary Metal Gear Solid or Splinter Cell code. Their official source code is not publicly available in a clean project-safe way. Study their public design behavior and translate the design lessons into original Top Shot systems.

## Lessons translated into Top Shot

- Stealth should have phases, not a simple seen or unseen switch.
- Detection should build through suspicion before combat knowledge becomes certain.
- Light, shadow, posture, movement speed, and sound should combine into detection math.
- Loud movement should be masked by ambient noise when the environment is already noisy.
- Guards and fighters should remember last known positions, last heard positions, and evidence positions.
- Search should widen from a last known area into nearby cover, shadows, and likely exit paths.
- Environmental evidence should matter only when discovered, not magically from across the map.
- Bodies, blood, used pickups, stuck projectiles, explosions, impact flashes, and disturbance effects should feed suspicion when seen.
- Alert roles should differ by archetype, with blockers, flankers, overwatch, investigators, and searchers.

## Implementation pass committed

Added `top-shot/src/stealth.js` with:

- Global stealth phases: infiltration, suspicious, alert, evasion, recovery.
- Per fighter awareness: suspicion, stress, phase, role, last known position, last heard position, last evidence position, search radius, current search point, and evidence memory.
- Visual detection scoring that uses distance, facing cone, line of sight, posture, shadow, movement noise, and close range readability.
- Sound detection scoring that compares fighter noise against ambient noise.
- Evidence scanning for bodies, blood, stuck projectiles, used pickups, explosions, impacts, landing flashes, and combat effects.
- Search plan generation that sends fighters to last known, last heard, evidence, cover, shadow, and widening ring points.
- Global phase logging when the stealth state escalates or cools down.

Integrated with:

- `top-shot/src/perception.js`, canSee and canHear now use stealth detection scores instead of instant static checks.
- `top-shot/src/brain.js`, fighter brains can now use stealth search plans before falling back to patrol or standard combat movement.
- `top-shot/src/systems.js`, the stealth system updates every running match before fighter brains choose actions.
- `top-shot/src/state.js`, match state and fighters now initialize stealth and awareness data.
- `top-shot/tests/stealthSmoke.js`, smoke test covers stealth initialization, noise suspicion, clear sight memory, phase escalation, and search plan creation.
- `top-shot/package.json`, smoke now runs main simulation, CQC smoke, and stealth smoke.

## Next stealth priorities

- Add visual UI readout for global stealth phase, suspicion, and ambient noise.
- Add true patrol route sets instead of four point loops.
- Add camera and sensor entities later.
- Add light objects, destroyed lights, flares, and temporary reveal bursts.
- Add body discovery reactions that can trigger search or alert without ending the match instantly.
- Add squad alert roles when the project expands beyond one versus one.
- Add nonlethal takedown and conceal body mechanics.
- Add a replay/debug overlay for sight cones, sound radii, evidence points, and last known position circles.
