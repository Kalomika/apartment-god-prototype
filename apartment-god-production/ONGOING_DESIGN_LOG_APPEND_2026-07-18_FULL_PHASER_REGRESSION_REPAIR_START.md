# Ongoing Design Log Append, Full Phaser Regression Repair Start

## 2026-07-18, Full Phaser Regression Repair Start

Status: PLANNED AND IN EXECUTION
Branch: work/full-phaser-regression-repair-2026-07-18
Commit: cf72f8fca61114e54e6bd08109d96b405d36356c
Files changed:
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-18_FULL_PHASER_REGRESSION_REPAIR.md
Runtime files changed: no, planning checkpoint only
Render playable branch updated: no
Backup branches:
- backup/phaser-migration-before-full-phaser-regression-repair-2026-07-18
- backup/main-before-full-phaser-regression-repair-2026-07-18
- backup/work-full-phaser-regression-repair-start-2026-07-18

Summary:
Started a focused Phaser regression repair after Kam's mobile screenshots showed scene placement and clipping problems, duplicated character limbs, missing walking leg animation, incorrect sleep orientation, missing activity progress, duplicated object layers, mutated double dog rendering, arcade overlay obstruction, weak arcade cabinet construction, pool rack orientation errors, and reverted TV/laptop/object visuals.

Implementation plan:
1. Fix mobile canvas sizing and control-bar layout so the complete 960 by 720 playfield is visible.
2. Remove character double-draw and rebuild the current 8 FPS sheets so arms and legs animate without duplicated base limbs.
3. Correct object-aware sleeping placement and direction.
4. Restore a visible timed-action progress layer.
5. Make arcade gameplay render on the cabinet screen and reserve expanded gameplay for deliberate double tap.
6. Correct pool rack orientation and preserve shot-position choreography.
7. Remove duplicate dog and object layers by enforcing one authoritative renderer per system.
8. Improve key object construction for TV, laptop desk, arcade cabinet, bed, and layered dining/living corrections.
9. Run source-level tests/build where available, then mirror the inspected work to phaser-migration and main for Render review.

Testing performed:
- Latest commits, branch state, handbook, backup policy, no-broad-implementation rule, current Phaser runtime, character animation system, UI input, world layout, fit logic, arcade system, and screenshots reviewed.

Testing requested:
None yet. Runtime repair is still in execution.

Known risks:
- The game is in a hybrid Phaser plus compatibility-canvas architecture. This batch can repair visible regressions without honestly claiming every object has already been converted to a native Phaser sprite.
- The broad object-art conversion must continue in audited object families after parity is restored.

Follow ups:
- Update this log with exact commits, tests, risks, and Render test instructions after implementation.
