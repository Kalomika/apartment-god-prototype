# Backup Manifest, P2 Movement Quality Repair

Date: 2026-07-24
Repository: `Kalomika/apartment-god-prototype`

## Protected source

Source branch state: `repair/phaser-migration-2-character-unfreeze-2026-07-24`
Source commit: `98f448f5ba18ef7624043e3be4846718434c550e`
Backup branch: `backup/phaser-migration-2-before-movement-quality-repair-2026-07-24`

## Repair

Repair branch: `repair/phaser-migration-2-movement-quality-2026-07-24`
Runtime and test verification head: `e80c935e046deb4bcee92fd721738c00a3fa906d`
CI-only pull request: `#44`
CI run: `30126641734`, SUCCESS

Changed implementation files:

- `src/phaserMigration2StalledMovementWatchdog.js`
- `tests/phaser-migration-2-stalled-movement-watchdog.test.js`

Required records:

- `apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-24_P2_MOVEMENT_QUALITY_REPAIR.md`
- `apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-24_P2_MOVEMENT_QUALITY_REPAIR.md`
- `apartment-god-production/BACKUP_MANIFEST_2026-07-24_P2_MOVEMENT_QUALITY_REPAIR.md`

## Playable verification

AppDeploy app: `2214ba9eab68fb263c`
Snapshot: `1784927337423`
QA group: `2f3fc7a09c66e453`
Result: READY, 3 of 3 tests passed
Measured maximum coordinate jump: 2.9 pixels

## Deployment boundaries

No commit was merged into `main`, `phaser-migration`, or `phaser-migration-2`.
Render settings and the Render service were not changed.
The AppDeploy preview is isolated and pinned to the verified runtime head.