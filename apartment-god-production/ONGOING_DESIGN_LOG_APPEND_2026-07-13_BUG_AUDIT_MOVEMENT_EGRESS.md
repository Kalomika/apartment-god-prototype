# Ongoing Design Log Append: Bug Audit Movement Egress

## 2026-07-13 04:40 AM CT, Bug Audit Movement Egress Fix

Status: NEEDS_TESTING
Branch: phaser-migration and main after sync
Commit: 2ffce45bbc44318b30c190f4469eda4fdc622aac, 13cfb82cd722fdbfe4fe4351bf85057faad50a11, plus this append commit
Files changed:
- src/movement.js
- tests/movement-solid-egress.test.js
- apartment-god-production/BUG_AUDIT_2026-07-13_MOVEMENT_EGRESS.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_BUG_AUDIT_MOVEMENT_EGRESS.md
Runtime files changed: yes
Render playable branch updated: yes after main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-blocked-movement-fix-2026-07-13
- backup/main-before-render-update-2026-07-13-blocked-movement-fix

Summary:
Ran an immediate bug audit after mobile QA showed the Resident stuck as `Blocked` in the basement. Found and fixed a movement/pathfinding class bug where actors could be trapped after an activity left them inside a solid furniture footprint.

Implementation details:
- Updated `src/movement.js` so route planning and per-step collision allow legitimate egress out of a solid object footprint the actor is already inside.
- The movement system still blocks illegal entry into unrelated solids.
- Added an escape target recovery path before giving up to `Blocked`.
- Added `tests/movement-solid-egress.test.js` to cover an actor starting inside the basement couch footprint and successfully routing out.
- Added `apartment-god-production/BUG_AUDIT_2026-07-13_MOVEMENT_EGRESS.md` documenting the audit finding and required future regression question.

Testing performed:
- Code inspection confirmed `directBlocked`, `blockedStep`, and recovery now handle solid-footprint egress.
- Regression test file was added, but not executed in this connector environment.

Testing requested:
- Open https://apartment-god-phaser.onrender.com after Render rebuilds.
- Go to basement and confirm Resident can leave the couch area without `Blocked`.
- Test basement couch, arcade, pool table, main couch, dining table, and upstairs bed wake-up movement.
- Confirm no recovery screen appears.

Known risks:
- Browser QA is still required.
- This fixes the movement class of bug. It does not replace the need for final per-object approach/exit audits for every activity.

Follow ups:
- Add more regression tests for bed exit, dining table exit, arcade exit, pool table exit, vehicle exit, stairs, and porch chairs.
- The hourly Apartment God Bug Audit automation is active, but repo-side regression tests must still be expanded.
