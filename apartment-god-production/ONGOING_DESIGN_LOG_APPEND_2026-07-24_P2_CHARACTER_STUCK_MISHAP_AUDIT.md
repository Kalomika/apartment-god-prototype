# Ongoing Design Log Append, P2 Character Stuck Mishap Audit

Date: 2026-07-24
Status: DEPLOYED VERIFIED, NEEDS USER ACCEPTANCE
Branch: repair/phaser-migration-2-character-unfreeze-2026-07-24
Original Claude source: c63ae6f1593286c143c4c4947d644812116cb3c9
Previous emergency repair reviewed: ec4418aefbcd4f68ece7e046c2286e4c9ebdbede
Verified runtime and test head: c7b2694498c0d019ff73443e87b6011c41765a68
CI workflow run: 30103053951
AppDeploy app: 2214ba9eab68fb263c
AppDeploy snapshot: 1784904974395
AppDeploy QA group: e14a2afe024373dd

## User Report

Characters remained stuck in the deployed Claude Phaser Migration 2 preview after the first emergency character recovery pass.

## Verified Mishaps

1. The first emergency repair normalized actor state through optional scene event listeners while the P2 simulation still contained the original broad pool-route exclusion.
2. Any stale `poolRoute.points` array could exclude an actor from normal movement even after the pool timer had ended.
3. `stopEntity` did not clear pool route state, action identifiers, activity object state, action totals, cue carrying, or actor velocity.
4. Resume cleared only stop flags. A resident stopped during pool could resume with a nonempty stale pool route and remain excluded from normal movement.
5. Old saves could contain zero or invalid actor speed and zero global simulation speed.
6. Optional activity sprites could continue hiding the live directional sprite after movement resumed.
7. The first AppDeploy QA suite verified only the launcher and iframe load. It did not prove that a resident accepted a route or changed coordinates.
8. Several later deployment attempts correctly created a route but proved that the live actor coordinates still did not change. Focus restoration, loop wake, direct-state polling, and global-speed recovery were individually insufficient.
9. The embedded P2 runtime can therefore enter a state where a visible, unpaused actor has a valid path but the normal scene update does not advance that path.

## Verified Repairs

- Empty and completed stale pool routes are cleared unless a timed pool action is genuinely active.
- Stop and Resume fully clear interrupted pool and timed-activity state.
- Legacy stop flags, invalid actor speeds, zero global simulation speed, stale poses, and stale activity-sprite visibility are normalized safely.
- Phaser focus, loop wake, pause state, and direct live actor diagnostics are exposed for reproducible browser testing.
- A bounded stalled-path watchdog now activates only when a playable actor has a real path and unchanged coordinates for at least 350 milliseconds.
- The watchdog uses the existing collision-aware `updateMovement` implementation and `resolveArrival`, then resynchronizes the native actor sprite and HUD.
- Healthy actors that already changed coordinates are explicitly excluded so the watchdog does not duplicate normal movement.
- Hidden actors, lab-only actors, stopped actors, paused state, hidden tabs, terminal runtime failure, and pathless actors remain protected.

## Verification

P2 Character Recovery CI run 30103053951 passed on exact head c7b2694498c0d019ff73443e87b6011c41765a68:

- repository checks passed
- focused recovery and watchdog tests passed
- every regression test except the separately reproduced pre-existing procedural reconstruction debt passed
- static build passed
- P2 output verification passed

AppDeploy snapshot 1784904974395 passed all three QA tests. The third test created a route for the selected resident and directly verified that the resident's live coordinates changed. No frontend or network errors were reported.

## Remaining Acceptance Tests

1. Hard refresh the AppDeploy preview and click Test movement. Confirm the status reports Movement confirmed.
2. Command Resident and Girlfriend to several ordinary objects and confirm natural routing and directional sprite animation.
3. Start pool, press Stop, press Resume, then command the resident elsewhere.
4. Confirm active pool choreography still works while its timer is active.
5. Confirm hidden, offsite, and lab-only actors remain protected.
6. Confirm no visible double-speed movement when the normal scene loop is healthy.
7. Test mobile portrait and landscape touch controls.

Main, Render, and the original `phaser-migration-2` branch remain unchanged. The repair remains isolated and unmerged.
