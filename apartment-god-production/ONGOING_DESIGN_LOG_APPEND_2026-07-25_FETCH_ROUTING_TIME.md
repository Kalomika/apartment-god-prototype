## 2026-07-25, Fetch Timing And Failed Route Repair

Status: NEEDS_TESTING
Branch: fix/fetch-routing-time-2026-07-25
Commit: runtime commits 71d083300722e998808c1cfe1129a512faaf1ff2 and 12239ed5b5e5fd60422c5b9674c278afe216381f, test commit 1ef938102678db9f6e58dcb5edaa2d7fa6335611
Files changed:
src/fetchSystem.js
src/autoHooks.js
tests/fetchSystem.test.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-25_FETCH_ROUTING_TIME.md
apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-25_FETCH_ROUTING_TIME.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch: not required, focused fix is isolated on a safe branch created from phaser-migration

Summary:
Repaired dog fetch so ball flight uses the actual simulation delta and failed routes cannot silently become phantom ball pickups or returns.

Implementation details:
The fetch ball now advances using the dt supplied by the active runtime instead of subtracting a hardcoded 0.016 every update. This keeps the throw duration consistent across frame rates, game slowdowns, and uneven update intervals. The target records the throw floor. Pickup and return transitions now require the dog to be physically close when its route ends. If movement produces no route, or a path disappears while the dog remains far from the ball or caller, the fetch flow cancels visibly, clears the carried ball and transient movement state, returns the dog to Idle, and records a reason in notifications. Missing actor or dog references now clear orphaned fetch state instead of leaving a permanent broken interaction. autoHooks now passes dt into updateFetch.

Testing performed:
Added three Vitest regression cases covering delta based throw timing, cleanup when a fetch participant disappears, and cancellation instead of phantom pickup when no route exists. Verified the committed source and test logic by code inspection. No local npm execution, browser test, AppDeploy test, or Render test was available in this connector run.

Testing requested:
Run npm test, npm run check, and npm run build. In browser, start fetch, throw the ball at near and distant valid floor locations, change game speed, and confirm the ball flight duration remains stable. Then throw toward an unreachable or blocked location and confirm the dog does not teleport the ball, gain fun, or report a successful return. Confirm a normal reachable fetch still completes and rewards fun only after the dog physically returns.

Known risks:
The reach thresholds are conservative procedural values and still need browser tuning against actual dog sprite scale and route endpoints. This fix does not add multi floor fetch or advanced dog decision memory.

Follow ups:
After browser verification, merge the patch into phaser-migration through the normal review path. Next mechanics target should audit together activity invitation hearing and distance without combining that broader social change into this focused fetch repair.
