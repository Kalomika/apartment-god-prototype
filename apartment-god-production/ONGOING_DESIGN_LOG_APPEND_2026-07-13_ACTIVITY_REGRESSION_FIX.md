# Ongoing Design Log Append, Activity Regression Fix

## 2026-07-13 04:55 AM CT, Couch, Stove, Sleep, And Activity Animation Regression Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: visual couch fix 10d4bbf1c0599f7d963d525acafb846c17e6fe5a, runtime guards e9d694004aafdefdfdb6f8879a517cd0b4fa06d3, renderer wiring 96e9d0a6469b0262ec649542f7379991710d99f5, guard loop 00d29e9613d29e8a677934b3dfbe348c0b15e53b, activity animation restore 3af4e8d63b416e4731ccc8070d96300788275ca7
Files changed: src/visualRegressionFixes.js, src/runtimeRegressionGuards.js, src/rendering.js, src/canvasRuntime.js, src/renderEntities.js
Runtime files changed: yes
Render playable branch updated: pending main fast forward after this sidecar and matrix patch
Backup branch: backup/phaser-before-activity-regression-fix-2026-07-13, backup/main-before-activity-regression-render-2026-07-13

Summary:
Patched the regressions Kam caught on Render: cooking state starting while Girlfriend was physically in the stair or service hall, the Resident getting trapped on the couch collision area, the main couch L chaise being on the wrong side, sleep rendering showing a bad head and body relationship, and activity animations reverting to standing with only the progress bar.

Implementation details:
- Added `src/runtimeRegressionGuards.js` to reroute any active stove or cooking action back to the stove if the actor is too far from the stove contact point.
- Added an idle couch trap guard so actors who finish inside the couch collision area are moved to a walkable position in front of the couch instead of staying trapped inside the solid object.
- Added `src/visualRegressionFixes.js` and wired it after the previous requested visual overlay. It clears the couch patch and redraws the L sectional with the chaise on the kitchen side, while keeping the TV facing side open.
- Rebuilt `src/renderEntities.js` activity pose routing for normal household actors, not only the lab test actor. Restored first pass animated poses for lift weights, treadmill, heavy bag, swimming, soccer, pool cue use, arcade or console play, cooking, cleaning, and a corrected bed sleep pose.
- Wired the runtime guards into `src/canvasRuntime.js` so stale saved positions can be corrected on mobile without requiring a reset.

Testing performed:
- Local `node --check` was run against the edited `renderEntities.js`, `visualRegressionFixes.js`, `runtimeRegressionGuards.js`, `rendering.js`, and `canvasRuntime.js` before GitHub writes.
- GitHub fetch verified the new imports and the activity pose routing are present on `phaser-migration`.
- Browser and Render behavior are not yet verified in this chat.

Testing requested:
Open https://apartment-god-phaser.onrender.com after main is fast forwarded by this pass. Hard refresh if needed. Test Reset, then check Girlfriend cooking at the stove, Resident leaving the couch after TV or couch actions, couch L chaise on the kitchen side, sleep pose head and blanket relationship, lift weights animation, treadmill run animation, heavy bag animation, arcade or console hand motion, pool cue use, and swimming motion.

Known risks:
- These are Canvas first pass animation restorations, not final PNG sprite sheets.
- Couch correction still layers a correction pass over the earlier wrong couch overlay, but the new pass clears first, then redraws the corrected couch. Future cleanup should replace the older wrong draw instead of needing a correction layer.
- Browser scale and mobile performance need real Render testing.

Follow ups:
- If Render still shows old cached code, hard refresh or wait for Render to finish rebuilding from main.
- Replace temporary Canvas first pass activity poses with final flat anime sprite sheets after core playability is stable.
- Fold this sidecar into the canonical ongoing design log during the next safe documentation sync.
