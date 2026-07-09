# Apartment God Ongoing Log Appendix, 2026-07-08 Render Sync Cleanup

## 2026-07-08 07:22 AM CT, Render Sync Cleanup and Stale Actor Cleanup Restored

Status: NEEDS_TESTING
Branch: phaser-migration, then main mirror pending in same chat
Commit: 67f355e67e05426cf170bc73955887bf3756badd
Files changed: src/canvasRuntime.js, this appendix file
Runtime files changed: yes
Render playable branch updated: pending at time of writing
Backup branch: backup/phaser-migration-before-render-sync-cleanup-2026-07-08 and backup/main-before-force-guided-render-sync-2026-07-08

Summary:
During Render sync, main had a duplicate activity tick cleanup that phaser-migration needed to preserve, while phaser-migration had newer force guided and together action work. This patch keeps the duplicate tick cleanup shape and restores stale actor cleanup in phaser-migration before mirroring main.

Implementation details:

- `canvasRuntime.js` keeps `updateAutoHooks` as the single place for vehicle/activity hook ticks, avoiding duplicate direct `updateVehicleDeparture` and `updateGameActivities` calls.
- `canvasRuntime.js` keeps the `updateAutonomy` call so current actor AI continues to run.
- Restored `cleanupStaleActorState` so actors with no path, no target, no pending action, and no timer do not remain visually labeled Walking, Running, Going to, or sitting idle forever.
- Created backups for phaser-migration and main before the final Render branch sync.

Testing performed:
Code inspection only. No local or Render browser test performed.

Testing requested:
After main mirror, refresh Render, reset, test guided force commands, together activities, TV/movie cleanup, soccer/walking cleanup, vehicle departure/return, pool and soccer timing, and general idle autonomy.

Known risks:
The branch history had diverged because main had a runtime cleanup commit and phaser-migration had newer guided force work. The final main update should make Render mirror phaser-migration again while keeping the useful runtime cleanup behavior.

Follow ups:
Merge appendix notes into the main ongoing log when safe. Then fix thought bubbles versus speech bubbles.
