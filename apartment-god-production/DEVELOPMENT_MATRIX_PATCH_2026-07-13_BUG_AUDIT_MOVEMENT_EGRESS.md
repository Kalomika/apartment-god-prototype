# Development Matrix Patch: Bug Audit Movement Egress

Status: NEEDS_TESTING
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branches:
- backup/phaser-migration-before-blocked-movement-fix-2026-07-13
- backup/main-before-render-update-2026-07-13-blocked-movement-fix

## Matrix row updates to merge during next safe documentation sync

Update Movement and pathfinding row with:

| Movement and pathfinding | NEEDS_TESTING | `src/movement.js`, `tests/movement-solid-egress.test.js`, ongoing log | Solid-footprint egress fix exists. Actors who start inside a solid non-enterable object footprint should now be able to route outward instead of getting stuck as `Blocked`. Recovery attempts a nearby open escape before giving up. | Browser test couch, basement couch, arcade area, pool table, bed wake-up, dining table, stairs, and vehicle approach/exit. Run `npm test` when local environment is available. |

Add bug audit test row:

| Activity exit movement regression | NEEDS_TESTING | `tests/movement-solid-egress.test.js` | First regression test covers actor leaving basement couch footprint. This is the start of an object-exit test suite, not full coverage. | Add bed, dining table, arcade, pool table, car, stairs, and porch chair exit tests. |

Add test scenario row:

| Scenario | Priority | Status | Exact test |
|---|---|---|---|
| Actor can leave activity object footprint | Critical | NEEDS_TESTING | After every object activity, tap an open spot. Actor must route away and must not get stuck as `Blocked`. Test basement couch first because that caused the live bug. |
