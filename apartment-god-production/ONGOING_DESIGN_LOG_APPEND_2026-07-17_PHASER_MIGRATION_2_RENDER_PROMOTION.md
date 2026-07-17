## 2026-07-17, Phaser Migration 2 Promoted for Render Testing

Status: REVERTED FOR CORRECTION
Branch: phaser-migration-2 promoted to main, then previous main restored
Commit: source promotion commit b8c03be0b4999f19269889b3fea0c4a66d7d65b8, promotion log c8b0ce933328f8fea0c934ca7246b398b86b1fce, restore target 1ebc880bdf550faac16f6d4383ef9da18689efc4
Files changed: branch pointer for main, docs/APARTMENT_GOD_RENDER_TESTING_DEFAULT.md, apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-17_PHASER_MIGRATION_2_RENDER_TEST.md, this append file
Runtime files changed: no new runtime edits during promotion or restore
Render playable branch updated: yes, previous Canvas main restored
Backup branch: backup/main-before-phaser-render-sync-2026-07-17
Source backup branch: backup/phaser-migration-2-before-render-promotion-2026-07-17

Summary:
Kam tested the clean Phaser overhaul and reported that pool players ran in place while marked as circling the table, and the dog and character bridge sprites did not meet the grounded anime quality target. The previous Canvas main is being restored while Phaser Migration 2 is corrected on its own branch.

Implementation details:
- The clean Phaser overhaul was temporarily exposed through main for testing.
- Kam identified unacceptable pool movement and character visual quality.
- Main is restored from `backup/main-before-phaser-render-sync-2026-07-17`.
- Phaser Migration 2 remains preserved for focused correction.
- The Render testing workflow now explicitly requires immediate restoration of the previous main when Kam requests it during a migration correction cycle.
- Render settings are unchanged and no manual deployment is triggered.

Testing performed:
Kam performed a direct Render browser visual test and rejected the pool circling behavior and current bridge character art.

Testing requested:
After Render rebuilds the restored main, confirm the previous Canvas build is visible again. Phaser Migration 2 should not return to main until pool movement is spatially correct and all active characters have purposeful 8 FPS grounded true top down anime sprite animation.

Known risks:
The migration branch is not approved for Render promotion. Its static bridge character assets and actor rebuild strategy are insufficient for the intended quality bar. The pool action state currently presents movement intent without convincing movement around the table.

Follow ups:
Create a fresh migration backup, replace static bridge characters with directional animated sprite sheets, implement 8 FPS animation state control, fix pool route and arrival staging, test locally or through an isolated preview, then request Kam review before another main promotion.
