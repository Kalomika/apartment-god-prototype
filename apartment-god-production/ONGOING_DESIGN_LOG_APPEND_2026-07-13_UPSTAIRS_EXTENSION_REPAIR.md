# Ongoing Design Log Append: Upstairs Extension Repair

## 2026-07-13 09:30 AM CT, Upstairs Extension Repair

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Commit: phaser-migration head after this append file
Files changed:
- apartment-god-production/BACKUP_MANIFEST_2026-07-13_UPSTAIRS_EXTENSION_REPAIR.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_UPSTAIRS_EXTENSION_REPAIR_STARTED.md
- src/blueprint.js
- src/upstairsExtensionLayout.js
- tests/upstairs-extension-layout.test.js
- apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-13_UPSTAIRS_EXTENSION_REPAIR.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_UPSTAIRS_EXTENSION_REPAIR.md
Runtime files changed: yes
Render playable branch updated: pending main backup and sync
Render settings changed: no
Backup manifest:
- apartment-god-production/BACKUP_MANIFEST_2026-07-13_UPSTAIRS_EXTENSION_REPAIR.md

Summary:
Repaired the immediate upstairs extension playability issue after Kam's browser test showed the master side did not read as reachable and the layout looked like a maze. The previous audit failed because it checked code existence rather than visual intent and playable access.

Implementation details:
- Added a direct door graph connector from `hall` to `suite_foyer` in `src/blueprint.js`.
- Updated `src/upstairsExtensionLayout.js` to draw a clear vertical upper foyer connector between the new upstairs section and the primary suite side.
- Added visible labels and open doorway gaps for `TO OFFICE`, `TO MASTER SUITE`, and `MASTER FOYER` so the path no longer reads like a blocked maze.
- Updated `tests/upstairs-extension-layout.test.js` to require the direct hall-to-suite-foyer connector and a route from the upstairs stairs to the primary master bath.
- Added an Idea Bible append that marks the previous pass as a failed intent-match implementation and preserves the true final multi-screen master-over-garage goal as planned.

Testing performed:
- GitHub static inspection and code-level connector update.
- Added tests, but tests were not executed in this connector environment.

Testing requested:
- Open https://apartment-god-phaser.onrender.com after Render rebuild and hard refresh.
- Go upstairs.
- Confirm the upper foyer connector is visible between the new section and the primary side.
- Confirm Resident can reach office/library, primary bedroom, suite foyer, walk-in closet, and master bath from the stairs/new bedroom side.
- Confirm the view does not read as a dead-end maze anymore.

Known risks:
- This is still an emergency playable-map repair, not the final multi-screen master-over-garage implementation.
- True camera slide/pull access for the master section remains planned.
- Browser confirmation is required because the previous failure was only visible in live game testing.

Follow ups:
- Implement real multi-screen upstairs navigation or a larger/scrollable upstairs view so the master section can sit above the garage cleanly without cramming.
- Replace procedural layout patches with PNG room plates and object assets.
