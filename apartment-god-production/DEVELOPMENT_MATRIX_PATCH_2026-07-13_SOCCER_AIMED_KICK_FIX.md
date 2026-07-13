# Development Matrix Patch: Soccer Aimed Kick Fix

Status: NEEDS_TESTING
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branches:
- backup/phaser-migration-before-soccer-aimed-kick-fix-2026-07-13
- backup/main-before-render-update-2026-07-13-soccer-aimed-kick-fix

## Matrix row updates to merge during next safe documentation sync

Update Dog soccer ball play row with:

| Dog soccer ball play | NEEDS_TESTING | `src/soccerSystem.js`, `src/autoHooks.js`, `src/actions.js` | Dog ball play no longer orbits the ball. First pass chase-and-tap behavior exists. Final dog kick/tap animation PNGs are still needed. | Test dog ball chase, tap direction, no circular orbit, no camera hijack, no boot crash. |

Add or update Human soccer row with:

| Human soccer practice | NEEDS_TESTING | `src/soccerSystem.js`, `src/actions.js`, `src/rendering.js` | First pass aimed soccer loop exists. The old circular running behavior was removed. Player now runs to the ball, plants, aims, kicks toward a goal, and resolves score or miss. This is gameplay logic only; final PNG run/kick frames are still needed. | Test soccer practice, aimed line, kick timing, goal direction, score updates, player no longer circles field. |

Update Animation Matrix with:

| Soccer run to ball | NEEDS_TESTING | True top down run toward ball, not slide or circle orbit | Up/down/left/right and field-relative | A/B run frames minimum | Pose state `soccer_run_to_ball` now exists | Needs PNG frames and browser timing. |
| Soccer plant | NEEDS_TESTING | Foot plant and body set before kick | Direction toward ball/goal | Hold frame | Pose state `soccer_plant` now exists | Needs PNG frame. |
| Soccer kick windup | NEEDS_TESTING | Clear aimed kick preparation | Direction toward goal | A frame | Pose state `soccer_kick_windup` now exists | Needs PNG frame. |
| Soccer kick follow through | NEEDS_TESTING | Clear contact and follow through | Direction toward goal | B frame | Pose state `soccer_kick_follow_through` now exists | Needs PNG frame. |
| Soccer defend goal | NEEDS_TESTING | Secondary player takes defensive/support position | Field-relative | Hold or shuffle | Pose state `soccer_defend_goal` now exists | Needs PNG frame. |

## Test scenario to add

| Scenario | Priority | Status | Exact test |
|---|---|---|---|
| Soccer aimed kick loop | Critical | NEEDS_TESTING | Start soccer practice. Confirm player runs to the ball, stops/plants, an aim line appears, player kicks toward the goal, score/miss resolves, and the player never runs in a circular orbit around the center. |
