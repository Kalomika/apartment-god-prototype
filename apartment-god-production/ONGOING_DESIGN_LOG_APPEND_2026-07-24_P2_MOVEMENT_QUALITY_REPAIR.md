# Ongoing Design Log Append, P2 Movement Quality Repair

Date: 2026-07-24
Status: PLAYABLE_VERIFIED on isolated AppDeploy preview
Branch: `repair/phaser-migration-2-movement-quality-2026-07-24`
Source head: `98f448f5ba18ef7624043e3be4846718434c550e`
Runtime verification head: `e80c935e046deb4bcee92fd721738c00a3fa906d`
Backup branch: `backup/phaser-migration-2-before-movement-quality-repair-2026-07-24`

## User Report

Character movement was functioning after the emergency unfreeze repair but looked delayed, jerky, and spatially wrong.

## Verified Mishaps

1. The first fallback waited 350 milliseconds before intervening.
2. It advanced movement on a 100 millisecond interval, creating a visible 10 FPS movement cadence.
3. At accelerated game speed, one fallback step could move a person roughly 18 pixels, while the native simulation caps a substep at 0.05 seconds.
4. The fallback called `resolveArrival` after every movement step instead of only when `updateMovement` reported arrival. That could clear a route or begin an object action before the actor reached the destination.
5. A requestAnimationFrame replacement stopped reliably advancing after the outer AppDeploy launcher took focus away from the iframe.
6. Earlier QA only proved that coordinates changed at least once. It did not reject delayed or oversized jumps.

## Repair

- Reduced the bounded stall window to 120 milliseconds.
- Replaced the old 100 millisecond cadence with a 16 millisecond visible-iframe interval.
- Preserved the native 0.05 second maximum simulation step.
- Removed forced Phaser loop ticks and unsafe manual animation-clock updates.
- Calls `resolveArrival` only when `updateMovement` returns true.
- Contains rendering errors without terminating future movement ticks.
- Added regression tests for cadence, step caps, route completion, render failure containment, and movement guards.
- Strengthened AppDeploy QA to require multiple changed coordinate samples and a bounded maximum jump.

## Verification

GitHub Actions workflow: `P2 Character Recovery CI`
Run: `30126641734`
Conclusion: SUCCESS

AppDeploy app: `2214ba9eab68fb263c`
Snapshot: `1784927337423`
QA group: `2f3fc7a09c66e453`
Result: 3 of 3 tests passed
Measured movement: resident, multiple live coordinate samples, 2.9 pixel maximum jump
Frontend errors: none
Network errors: none

## Safety

`main`, `phaser-migration`, `phaser-migration-2`, and Render settings were not modified. The repair remains isolated and unmerged. Natural movement through doors, stairs, tight collision corners, object approaches, pool interruption, and 3x speed remain browser acceptance tests.