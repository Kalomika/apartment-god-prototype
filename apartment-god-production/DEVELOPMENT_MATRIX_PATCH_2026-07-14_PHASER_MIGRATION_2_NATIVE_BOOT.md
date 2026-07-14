# Development Matrix Patch: Phaser Migration 2 Native Boot

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration-2
Runtime files changed: yes
Render settings changed: no
Manual Render deploy triggered: no
Backup branch: backup/phaser-migration-2-start-2026-07-14

## Matrix rows to merge during next safe documentation sync

| System | Status | Files | Current state | Required test |
|---|---|---|---|---|
| Phaser Migration 2 branch | NEEDS_BROWSER_CONFIRMATION | Branch `phaser-migration-2` | New clean overhaul branch created from current `main`. `main` remains active for other agents. Old `phaser-migration` is reference only, not blindly merged. | Verify branch exists and future preview/deploy path can target it without changing Render settings unexpectedly. |
| Phaser-native boot | NEEDS_BROWSER_CONFIRMATION | `src/main.js`, `src/phaserMigration2Runtime.js`, `index.html` | Branch now boots `bootPhaserMigration2Game()`. Runtime dynamically imports Phaser and displays a visible recovery screen instead of blanking if Phaser cannot start. | Branch preview or temporary Render test: confirm no black canvas and visible recovery on failure. |
| Canvas renderer dependency | PARTIAL | `src/phaserMigration2Runtime.js` | New branch does not call legacy Canvas `draw()` as the primary visual renderer. Existing simulation systems are reused for continuity. | Confirm scene renders through Phaser and no Canvas draw stack is invoked for main playfield. |
| Asset-backed top-down bridge | NEEDS_BROWSER_CONFIRMATION | `assets/phaser-migration-2/sprites/**`, `src/phaserMigration2Runtime.js` | First branch-safe SVG assets now drive rooms, humans, dog, and generic objects. This is an asset-backed bridge, not final PNG atlas quality. | Browser check at game scale for readability, no blanking, and no old procedural human/dog draw path. |
| Character animation ladder | PLANNED | Future PNG/atlas pass | Static top-down assets exist as first bridge. Walk cycle is not built yet by design. | Kam approves or rejects static asset-backed top-down read before walk cycle work starts. |
| Object art replacement | PARTIAL | `assets/phaser-migration-2/sprites/objects/**` | Objects are currently mapped by kind to bridge assets. Individual object art is not complete. | Replace high-priority objects by exact object ID: couch, bed, dining table/chairs, TV, shower, toilet, vanity, fridge, stove, dog bed, vehicles. |
| Feature preservation | NEEDS_BROWSER_CONFIRMATION | `src/phaserMigration2Runtime.js` plus existing simulation modules | Existing movement, autonomy, actions, UI, save/load, calendar, life quality, offsite, and tidiness systems are reused under Phaser. | Test actor/object menus, movement, floor switching, save/load, work/offsite, sleep, bathroom, eating, dog, and phone/cell. |

## Notes

This is the first clean Phaser-native branch checkpoint. It should not be promoted to `main` until browser tested and approved by Kam.
