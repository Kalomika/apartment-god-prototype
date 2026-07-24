# Ongoing Design Log Append, P2 Character Unfreeze and Sprite Repair

Date: 2026-07-24
Status: NEEDS_TESTING
Branch: repair/phaser-migration-2-character-unfreeze-2026-07-24
Source branch: phaser-migration-2
Source commit: c63ae6f1593286c143c4c4947d644812116cb3c9
Backup: backup/phaser-migration-2-before-character-unfreeze-sprite-repair-2026-07-24
Main changed: no
Render settings changed: no

## User report

Characters in the Claude Phaser Migration 2 AppDeploy preview were stuck and their sprites needed an urgent repair.

## Verified source defects

- The P2 simulation excluded an actor from normal movement whenever `entity.poolRoute.points` was any array. An empty stale array from a completed or restored pool action therefore blocked normal movement forever.
- A stale `Pool:` action string could keep triggering the same exclusion after its timer and route had ended.
- Saved actors could restore with a zero, null, or invalid movement speed. `updateMovement` multiplies speed by delta time, so those actors could never advance.
- A legacy saved `stopped: true` flag was indistinguishable from an intentional player stop and could permanently suppress movement and autonomy.
- The optional activity sprite layer could continue suppressing the base directional sprite after an activity ended or while the entity had resumed movement.
- The initial or restored `Waking up` sleep pose could remain after no timer, target, or route existed.

## Repair

- Added `src/phaserMigration2CharacterRecovery.js` as a bounded P2 compatibility and recovery layer.
- Empty or malformed pool routes are cleared.
- Completed stale pool actions are normalized to Idle.
- Invalid human speed restores to 92 and invalid dog speed restores to 120.
- Legacy stopped flags are released for normal residents while explicit player stops and lab-only actors remain stopped.
- `stopEntity` and `resumeEntity` now record `manualStop` so intentional stops survive normalization.
- During movement or after an activity has ended, stale activity sprites are hidden and the live directional base sprite is restored.
- Runtime actor diagnostics are exposed at `window.__APARTMENT_GOD_P2_ACTORS__` for browser verification.
- Cache-busted the P2 entry point.

## Files changed

- index.html
- src/main.js
- src/state.js
- src/phaserMigration2CharacterRecovery.js
- tests/phaser-migration-2-character-recovery.test.js

## Automated testing

Regression tests cover empty pool routes, completed stale Pool actions, valid pool choreography, invalid speed recovery, stale stopped flags, intentional stops, lab stops, stale waking poses, and base directional sprite preference.

CI and browser status are pending on the exact repair head.

## Browser tests

1. Open the repaired AppDeploy build and hard refresh once.
2. Press Reset so the repair is also checked from fresh state.
3. Let Resident and Girlfriend wake and confirm both leave the bed area and begin moving.
4. Command both residents to multiple objects and floors. Confirm coordinates and directional walk frames advance.
5. Start and finish pool, then command the same actor elsewhere. Confirm the actor is no longer excluded from normal movement.
6. Pause and resume one actor through the available stop or resume control. Confirm intentional stop remains until resumed.
7. Confirm activity sheets disappear when an activity ends and the normal walk or idle sprite returns.
8. Refresh after movement and confirm saved actors do not return frozen.
9. Inspect `window.__APARTMENT_GOD_P2_ACTORS__` in the game frame and confirm normal residents show positive speed and `stopped: false`.

## Remaining risk

The source defects are repaired and regression tested in code, but visible movement and sprite transitions remain NEEDS_TESTING until the repaired AppDeploy preview is opened and observed.
