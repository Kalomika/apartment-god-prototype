# Daily Build, Timed Action Progress Guard

Date: 2026-07-13
Branch: mechanics-first-timebar-guard-2026-07-13
Status: PATCHED, NEEDS_BROWSER_TESTING

## Repo Audit

The current main branch already includes the recent physical object moving, vehicle, seating, visual correction, cooking, meal cleanup, autonomy, and runtime guard work. This pass did not restore an older mechanics branch over those newer changes.

The runtime already draws action progress from `actionT` and `actionTotal`, but some systems can create or restore a timed action with a valid remaining timer and a missing or stale total. That makes the action run without a reliable visible progress bar.

## Mechanics Improvement

`applyRuntimeRegressionGuards` now repairs timed person actions when:

- `actionT` is greater than zero
- `actionTotal` is missing, zero, invalid, or lower than the remaining time

The guard sets the total to the current remaining duration. It does not reset a valid original total while an action counts down.

This keeps timed studying, watching, sleeping, cooking, bathroom use, training, and other non-walking actions visible to the player even when another subsystem forgot to initialize the total correctly.

## Regression Coverage

Added `tests/runtime-timebar-guard.test.js` covering:

- missing total restoration
- preservation of a valid original total
- stale total repair

## Safety

- Safe branch only
- Main unchanged
- Render settings unchanged
- No deployment
- `Kalomika/ai-rpg-engine` untouched

## Remaining Risk

Browser testing is still required to confirm every affected HUD and actor time bar consumes `actionTotal` consistently. This guard cannot create meaningful duration for actions that never set `actionT` at all.

## Next Mechanics Target

Upgrade invitation consent on the current main line so local requests use realistic hearing and invitees weigh busy state, urgent needs, mood, traits, preferences, routines, relationship, and recent activity memory before accepting.
