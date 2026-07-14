# Ongoing Design Log Append: Main Stabilization Audit Started

Status: IN_PROGRESS
Branch: phaser-migration, to be synced to main after backup
Runtime files changed: in progress
Render playable branch updated: no
Render settings changed: no
Backup branches:
- backup/main-before-main-stabilization-audit-2026-07-14
- backup/phaser-migration-before-main-stabilization-audit-2026-07-14

## Kam directive

Kam asked to audit the entire current main branch thoroughly and surgically before the dedicated Phaser rebuild continues. The goal is to leave main in a decent playable state so Kam and/or another AI can test and work on the current playable while the new Phaser build branch is handled separately.

## Current live issues to address first

- Characters are visually sleeping on the floor between the bed and the primary bedroom TV.
- Sleep visuals must anchor to the bed, not the actor's side-of-bed approach point or random floor position.
- Characters should be programmed to use their own upstairs/private bathroom when they need a bathroom.
- They should not travel downstairs for bathroom use unless the same-floor/private bathroom is occupied or unusable.

## Audit scope

Search current main/phaser-migration for:

- black screen or Phaser bridge risk left active on main
- sleep anchoring and bed rendering defects
- bathroom routing and nearest usable bathroom selection
- sprite/asset path mismatches or expected sprite overlays not being called
- leftover broad renderer guards or obsolete visual patches that fight the current character bridge
- logs/matrix entries that need honest status updates
- any obvious runtime conflicts that can be corrected safely without starting the full native Phaser rebuild

## Execution rule

Patch main stabilization issues first. Do not start or continue the separate full Phaser rebuild branch until main is stable enough for playable testing.
