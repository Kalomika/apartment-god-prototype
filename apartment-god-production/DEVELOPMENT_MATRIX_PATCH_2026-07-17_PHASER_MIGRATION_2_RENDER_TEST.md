# Development Matrix Patch, Phaser Migration 2 Render Test Promotion

Date: 2026-07-17
Branch: phaser-migration-2
Status: REVERTED FOR CORRECTION
Canonical merge pending: yes

| System | Status | Current State | Required Test |
|---|---|---|---|
| Phaser Migration 2 native boot | NEEDS_CORRECTION | Native Phaser boot worked well enough for Kam to inspect the branch, but it is not approved for continued main exposure. | Retest only after pool routing and character sprite overhaul. |
| Native Phaser scene | NEEDS_CORRECTION | Rooms and objects render through Phaser containers, but actor presentation is visually insufficient. | Confirm persistent actors, correct depth, movement, and animation without rebuilding crude static sprites every frame. |
| Pool circling | NEEDS_CORRECTION | Actors show a circling or walking state but run in place instead of visibly changing stations around the table. | Shooter must walk around the table perimeter, reach a specific stance, stop the walk cycle, aim, shoot, and yield the turn. |
| Character art and animation | REJECTED | Current static SVG bridge sprites, especially the dog, do not meet the grounded anime quality target. | Replace Resident, Girlfriend, Dog, and future active actors with purposeful true top down directional sprite sheets playing at 8 FPS. |
| Feature continuity | NEEDS_TESTING | Existing systems are reused, but the migration branch is behind the previous Canvas main and cannot be treated as feature complete. | Recheck movement, menus, phone, floors, save, bathroom, food, sleep, dog, work, and offsite after visual and pool corrections. |
| Current main | RESTORED | Previous Canvas main is restored from `backup/main-before-phaser-render-sync-2026-07-17`. | Confirm the Render service returns to the previous playable Canvas build. |

## Promotion Rule

Do not promote Phaser Migration 2 to main again until pool movement is spatially correct and the active character set has approved 8 FPS grounded true top down anime animation. Keep `backup/main-before-phaser-render-sync-2026-07-17` and the migration backups.
