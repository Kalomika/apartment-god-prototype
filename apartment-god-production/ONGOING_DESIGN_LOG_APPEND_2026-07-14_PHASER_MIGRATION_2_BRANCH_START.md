# Ongoing Design Log Append: Phaser Migration 2 Branch Start

## 2026-07-14, Phaser Migration 2 Branch Start

Status: IN_PROGRESS
Branch: phaser-migration-2
Commit: pending
Files changed: this log append first
Runtime files changed: planned
Render playable branch updated: no
Render settings changed: no
Manual Render deploy triggered: no
Protected repo touched: no
Backup branch: backup/phaser-migration-2-start-2026-07-14

## Kam directive

Kam clarified not to freeze `main` because other agents are still working on it. Instead, create a whole new branch called `phaser-migration-2` and do the Phaser engine overhaul there.

## Branch strategy

- `main` remains active for the current playable branch and other agents.
- `phaser-migration` remains the older Phaser branch/reference branch.
- `phaser-migration-2` is the clean new overhaul branch created from the current `main` state.
- Do not blindly merge old `phaser-migration` into `phaser-migration-2` because old `phaser-migration` is already diverged and contains failed or partial Phaser bridge work mixed with other runtime changes.
- Use old `phaser-migration` as a reference source for specific good work only.
- After Kam approves `phaser-migration-2`, selectively merge/cherry-pick good old Phaser work only if it improves the approved branch and does not reintroduce black screens, procedural visual drift, or runtime regressions.

## Execution rule

Build the new Phaser-native overhaul on `phaser-migration-2`. Keep `main` untouched unless Kam explicitly asks for a Render playable update or a critical hotfix.

## First target

Establish a clean Phaser app boot on `phaser-migration-2` that does not blank, does not depend on old broad procedural art as the final visual target, and can begin replacing rooms, characters, dog, objects, lighting, and UI with asset-backed Phaser systems stage by stage.
