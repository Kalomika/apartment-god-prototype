# Development Matrix Patch: Pre-Test Bug Audit

Status: CODE_AUDITED_NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branches:
- backup/phaser-migration-before-pretest-bug-audit-2026-07-13
- backup/main-before-render-update-2026-07-13-pretest-bug-audit

## Matrix rows to merge during next safe documentation sync

Update Movement and pathfinding row with:

| Movement and pathfinding | NEEDS_TESTING | `src/movement.js`, `tests/movement-solid-egress.test.js`, bug audit docs | Movement egress fix exists and the regression test now uses a non-enterable solid object, not an enterable couch. | Run `npm test`, then browser test basement console/couch, main couch, dining table, bed wake-up, stairs, and garage vehicle areas. |

Update Lived in activity object pass row with:

| Lived in activity object pass | NEEDS_TESTING | `src/bookSystem.js`, `src/world.js`, `src/realismCorrectionPass.js`, visual layers | Bookshelf relocation bug fixed. Upstairs book library now routes to upstairs reading spots. Runtime correction pass no longer moves the upstairs bookshelf into living-room coordinates. | Browser test upstairs book library, office couch, desk, and return-book flow. |

Update Visual correction layers row or add if missing:

| Visual correction layers | NEEDS_TESTING | `src/requestedVisualCorrections.js`, `src/realismCorrectionPass.js`, `src/visualRegressionFixes.js` | Superseded requested visual correction layer is now inert to stop duplicate furniture and overlay stacking. Visual regression layer no longer redraws couch/porch over realism pass. | Browser inspect couch, porch, dining table, fridge, coffee maker, shower, stairs, bed covers, book hands, and arcade cues for duplicate/ghost overlays. |

Add test scenario:

| Scenario | Priority | Status | Exact test |
|---|---|---|---|
| Pre-test code audit handoff | Critical | NEEDS_TESTING | After Render rebuilds, hard refresh. Confirm no recovery screen, no obvious duplicate couch/porch/dining/fridge overlays, upstairs book library stays upstairs, and previously blocked movement is fixed. |
