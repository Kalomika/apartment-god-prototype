## 2026-07-17, Previous Canvas Main Restored After Phaser Review

Status: NEEDS_TESTING
Branch: main
Commit: runtime restored to 1ebc880bdf550faac16f6d4383ef9da18689efc4 before this documentation commit
Files changed: branch pointer restore and this append file
Runtime files changed: no
Render playable branch updated: yes
Backup branch: backup/main-before-phaser-render-sync-2026-07-17

Summary:
Kam reviewed the temporary Phaser Migration 2 Render build and rejected the pool running in place and current character visuals. The Render watched main branch was restored to the previous Canvas runtime while migration corrections continue separately.

Implementation details:
- Restored the exact runtime state preserved by `backup/main-before-phaser-render-sync-2026-07-17`.
- Did not copy the rejected Phaser Migration 2 runtime or character assets into main.
- Did not change Render settings.
- Did not manually trigger Render.
- Continued the 8 FPS character and pool corrections only on `phaser-migration-2`.

Testing performed:
GitHub branch pointer restore completed. Browser confirmation is still required after Render rebuilds main.

Testing requested:
Open https://apartment-god-phaser.onrender.com and confirm the previous Canvas game is visible again rather than the Phaser Migration 2 bridge build.

Known risks:
Render may take time to rebuild from the restored main branch. Cached browser modules may require a hard refresh after the deployment finishes.

Follow ups:
Keep main on the restored Canvas build until the isolated Phaser branch passes character, dog, 8 FPS, pool route, build, and browser review.
