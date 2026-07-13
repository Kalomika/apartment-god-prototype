# Ongoing Design Log Append: Pre-Test Bug Audit

## 2026-07-13 05:05 AM CT, Pre-Test Bug Audit And Fixes

Status: CODE_AUDITED_NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Commit: phaser-migration head after this append file
Files changed:
- src/bookSystem.js
- src/realismCorrectionPass.js
- src/requestedVisualCorrections.js
- src/visualRegressionFixes.js
- tests/book-reading-floor-route.test.js
- tests/realism-bookshelf-floor.test.js
- tests/movement-solid-egress.test.js
- apartment-god-production/BUG_AUDIT_2026-07-13_PRETEST_RELEASE_AUDIT.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_PRETEST_BUG_AUDIT.md
Runtime files changed: yes
Render playable branch updated: yes after main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-pretest-bug-audit-2026-07-13
- backup/main-before-render-update-2026-07-13-pretest-bug-audit

Summary:
Ran a code-level pre-test release audit before asking Kam to test the Render build again. Fixed every code-provable bug found during this audit pass.

Implementation details:
- Fixed book routing after the bookshelf was moved upstairs. Reading routes now stay on the shelf floor and use the upstairs office couch or desk for the upstairs book library.
- Fixed the realism correction pass so it no longer moves the upstairs bookshelf into living-room coordinates.
- Fixed the realism correction pass so it reapplies object corrections idempotently instead of trusting a saved state version flag that could skip corrections after reload.
- Disabled the superseded requested visual correction layer that was stacking older couch/porch/dining/fridge/coffee/stair/shower/bed/book/arcade overlays with newer correction passes.
- Removed duplicate couch and porch redraws from the visual regression layer. Couch and porch ownership now belongs to the realism correction pass in this build.
- Strengthened the movement solid egress regression test to use a non-enterable solid object instead of an enterable couch.
- Added regression coverage for upstairs book reading route floor safety and bookshelf correction reload safety.

Testing performed:
- GitHub connector file inspection and static code audit.
- Compared main to phaser-migration before and after the audit.
- Inspected `src/blueprint.js`, `src/afterEntityOverlays.js`, `src/renderHouseStyle.js`, `src/soccerSystem.js`, `src/rendering.js`, and the changed visual/movement/book files for code-provable boot or routing bugs.
- Added tests, but did not execute `npm test` in this connector environment.

Testing requested:
- Open the Render link after rebuild and hard refresh.
- Confirm no recovery screen.
- Confirm upstairs book library routes to an upstairs reading spot.
- Confirm couch, porch, fridge, dining, coffee, and stairs do not show stacked ghosted overlays.
- Confirm basement blocked movement issue remains fixed.
- Confirm upstairs suite egress works through bedroom -> suite foyer -> hall.

Known risks:
- This was a static code audit and connector file inspection pass, not a live browser run.
- Visual quality still needs proper PNG production. Procedural correction layers are still temporary fallbacks.
- Browser-only layout, touch, timing, and animation bugs can still exist even when no code-provable bug was found by static audit.

Follow ups:
- Run local `npm test` and browser Playwright/mobile smoke when an environment with test execution is available.
- Continue replacing procedural fallback art with audited anime top-down PNG sets.
