# Backup Manifest, P2 Character Unfreeze and Sprite Repair

Date: 2026-07-24
Repository: Kalomika/apartment-god-prototype
Source branch: phaser-migration-2
Source head: c63ae6f1593286c143c4c4947d644812116cb3c9
Backup branch: backup/phaser-migration-2-before-character-unfreeze-sprite-repair-2026-07-24
Repair branch: repair/phaser-migration-2-character-unfreeze-2026-07-24
Main changed: no
Render settings changed: no

## Protected source scope

- index.html
- src/main.js
- src/state.js
- src/phaserMigration2Runtime.js
- src/phaserCharacterAnimationSystem.js
- src/phaserMigration2ReferenceCompletion.js
- src/poolActivitySystem.js
- src/movement.js
- tests for Phaser Migration 2 movement and animation

## Repair scope

- Add a bounded actor motion and sprite recovery layer.
- Preserve valid pool choreography, explicit user stops, lab-only actors, current movement, current activity assets, and all unrelated Claude P2 work.
- Add regression tests and production memory.

## Safety

- The backup points to the exact AppDeploy-tested Claude source commit.
- No force move was performed.
- No branch was merged.
- Main and Render remain untouched.
- AppDeploy is updated only after automated checks succeed on the exact repair head.
