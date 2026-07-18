## 2026-07-18, Phaser Migration 2 AppDeploy Test Preview

Status: DEPLOYED_FOR_TESTING
Branch: phaser-migration-2
Commit: runtime portability commits 06ead195d35a0750f0d4d90b9944eda572c33a77 and c8941bbe16e5725ad02eb20596ee5a07868303b8
Files changed: src/phaserMigration2Runtime.js, tests/phaser-migration-2-main-gameplay-parity.test.js, .github/workflows/p2-appdeploy-portability.yml, and this log append
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-2-before-full-main-gameplay-sync-2026-07-17
AppDeploy preview: https://31e6d4932a52c800f3.v2.appdeploy.ai/

Summary:
Kam explicitly authorized a temporary AppDeploy preview of Phaser Migration 2 without changing main or Render. The P2 runtime was made portable for static preview hosting, then deployed through an isolated AppDeploy launcher pinned to the verified native P2 commit.

Implementation details:
- Preserved the native Phaser Migration 2 scene, rooms, objects, actors, effects, depth, 8 FPS animation system, and synchronized gameplay.
- Changed the Phaser module path from an origin-root absolute import to a source-relative import so built and repository-hosted paths resolve correctly.
- Added a pinned Phaser 3.90.0 jsDelivr fallback for static hosts that do not contain the generated local vendor directory.
- Added regression assertions rejecting the old origin-root import and requiring the local relative path plus CDN fallback.
- Added a GitHub Actions portability workflow that patched, checked, tested, built, verified, and committed the runtime fix only after success.
- Deployed a separate AppDeploy launcher. It does not modify main, the Render branch, Render settings, or Render deployment behavior.

Testing performed:
- P2 portability workflow completed and committed the verified runtime changes.
- Repository checks passed in the workflow.
- Unit tests passed in the workflow.
- Static build passed in the workflow.
- Built local Phaser vendor output remained present.
- AppDeploy deployment reached READY.
- AppDeploy E2E tests passed 3 of 3.
- AppDeploy reported no frontend errors and no network errors in the final deployment run.
- Desktop launcher, mobile viewport fit, and preview reload guardrail passed.

Testing requested:
Open https://31e6d4932a52c800f3.v2.appdeploy.ai/ and test the native P2 game. Verify boot, mobile selection, interaction menus, phone scrolling, every floor, Front South, Driveway West, garage transitions, gates, every vehicle, offsite activities, arcade modes, basketball, pool turns, saves, autonomy, cooking, bathroom actions, sleeping, dog behavior, and visible recovery behavior.

Known risks:
The AppDeploy preview is a temporary testing launcher pinned to commit c8941bbe16e5725ad02eb20596ee5a07868303b8. Later P2 commits will require the preview source pin to be updated. The temporary generic P2 room and object assets and first-pass activity animation states still require visual review and replacement. AppDeploy acceptance does not replace direct gameplay review by Kam.

Follow ups:
Collect browser issues from Kam's preview session, correct them only on phaser-migration-2, keep main and Render unchanged until explicitly authorized, and update the AppDeploy preview after each verified P2 test batch.
