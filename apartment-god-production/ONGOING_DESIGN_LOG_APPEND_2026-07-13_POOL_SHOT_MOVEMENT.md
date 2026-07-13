# Ongoing Design Log Append, Pool Shot Movement

## 2026-07-13 06:05 AM CT, Dynamic Pool Shot Movement

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: pool system 11af40a2a666825bda7fa85c2293bbf0cd08218d, canvas loop 7dbc825cf227b24928a5acd68d14f0dd7531662d, test 37f4a54d38541959113d8ead7e5ecad15deb27e4
Files changed: src/poolActivitySystem.js, src/canvasRuntime.js, tests/pool-shot-movement.test.js
Runtime files changed: yes
Render playable branch updated: pending main fast forward after matrix patch
Backup branch: backup/phaser-before-pool-shot-movement-2026-07-13, backup/main-before-pool-shot-render-2026-07-13

Summary:
Added a focused pool activity system so Pool practice and Pool match do not leave actors standing in one static location for the entire activity. Actors now choose a stance on the cue ball side, path around the table perimeter, line up a shot, trigger cue line/cue thrust visuals, move balls, and then reposition again for the next shot.

Implementation details:
- Added `src/poolActivitySystem.js` with a rack, cue ball, object balls, pockets, shot selection, table-side stance selection, perimeter pathing around the table, cue thrust animation state, simple ball velocity, wall bounce, and pocket detection.
- Wired `updatePoolActivity(state, dt)` into `src/canvasRuntime.js` before the movement loop so active pool actors can receive new table-side waypoints during the activity.
- The stance is based on the cue ball and target ball relationship, so actors move to the side where a pool player would stand behind the cue ball instead of using one fixed generic activity position.
- Added `tests/pool-shot-movement.test.js` to verify that the system chooses the cue-ball side and gives an active pool actor a path around the table.

Testing performed:
- Local syntax checks were run with `node --check` on the new pool system module, the updated canvas runtime content, and the new test file before GitHub writes.
- GitHub compare confirms phaser-migration is ahead of main by the pool movement commits only before this log entry.
- Browser and Render behavior are not yet verified in this chat.

Testing requested:
After main is fast forwarded, open https://apartment-god-phaser.onrender.com and hard refresh after rebuild. Go to the basement, start Pool practice or Pool match, and watch at least 20 seconds. Confirm the actor walks around the pool table to line up near the cue ball, takes shots from changing sides, and the cue ball/object balls visibly move toward pockets.

Known risks:
- This is first pass pool behavior, not a full rules-complete billiards simulation.
- Actor walk pose may still need a dedicated cue-in-hand walking animation so movement does not read as sliding during pool repositioning.
- Ball physics are intentionally lightweight and tuned for readable game behavior, not realistic spin or bank shot physics.

Follow ups:
- Add seat/turn reservation for two-person Pool match.
- Add proper cue-in-hand walking pose and shot windup/impact/exit animation frames.
- Replace the first pass ball physics with fuller table rules after playability is stable.
