# Ongoing Design Log Append, Human Renderer Framework Port

## 2026-07-14 04:25 AM CT, Human Renderer Framework Port

Status: NEEDS_TESTING
Branch: main
Commit: 9a075860520fe121a09f557a356a21528d8e5ed9
Files changed:
- src/renderEntities.js
Runtime files changed: yes
Render playable branch updated: yes, main was edited directly because Kam is reviewing the playable Render branch and requested the current character regression fixed there.
Backup branch: backup/main-before-human-renderer-framework-port-2026-07-14

Summary:
Kam clarified that the goal is not a full rollback. The correct target is the older working human animation framework from roughly three days ago, while preserving newer activity states such as standing pee and brushing teeth. This pass surgically revised the current human renderer only.

Implementation details:
- Dropped the back-facing human rendering behavior from the current playable renderer.
- Removed person canvas rotation for the normal human renderer so the girlfriend no longer turns into a back-of-head presentation during walking or seated actions.
- Preserved bed anchoring through `sleepObjectId` and the existing bed lane logic.
- Preserved the dog separation guard so dog rendering remains handled outside the human renderer.
- Strengthened walk animation detection by combining path/target/pose checks with a frame-to-frame position delta check through a WeakMap.
- Enlarged and sped up the walk cycle slightly and added subtle motion ticks so walking reads as walking instead of sliding.
- Kept specific newer activity poses in the restored framework, including `pee_stand`, seated toilet, brush teeth, wash dog, shower, treadmill, weights, heavy bag, and sleep.
- Added visible eyes to the human head rendering so the characters read front-facing instead of hair/back-of-head only.

Testing performed:
- GitHub source inspection after commit confirmed `src/renderEntities.js` now contains the no-dog human loop, WeakMap movement detection, preserved bed anchoring, stronger walk pose, pee pose, toilet pose, brush teeth pose, and visible face details.
- Local browser and Render visual testing were not performed in this chat.

Testing requested:
Open https://apartment-god-phaser.onrender.com and test Resident and Girlfriend walking across rooms, going to the sink to brush teeth, using the toilet standing and seated, showering, washing the dog, lifting weights, treadmill, heavy bag, and sleeping in bed. Confirm walking no longer looks like sliding and the girlfriend no longer shows the dropped back-of-head feature.

Known risks:
- This is a source-level renderer fix and still needs live browser visual confirmation.
- The movement system itself was not changed. If sliding persists after this, the issue is outside the human renderer and likely in the game loop, frame timing, or movement/render update relationship.
- Main and phaser-migration are still diverged, so this should not be blindly branch-synced.

Follow ups:
- If browser testing confirms the human renderer is correct, carefully port the same surgical change to phaser-migration without overwriting the newer Phaser/stabilization work.
- If sliding persists, inspect the runtime tick loop and movement/render order rather than stacking another broad renderer rewrite.
