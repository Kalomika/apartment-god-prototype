# Development Matrix Patch: Main Floor Visual Cleanup

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branches:
- backup/phaser-migration-before-main-floor-visual-cleanup-2026-07-13
- backup/main-before-render-update-2026-07-13-main-floor-visual-cleanup

## Matrix rows to merge during next safe documentation sync

Update Main floor visual cleanup row or add if missing:

| Main floor visual cleanup | NEEDS_BROWSER_CONFIRMATION | `src/mainFloorLayoutPolish.js`, `src/rendering.js`, `tests/main-floor-layout-polish.test.js` | Runtime polish layer added after legacy/correction layers to clean the visible porch, couch, and dining overlap issues. Porch now uses the better two-chair arrangement, couch L is moved to wall side, and dining redraw is a single four-chair set. | Browser test front porch, couch orientation, dining overlap, stair visibility, and actor interaction anchors. |

Update Sprite replacement pipeline row:

| Sprite replacement pipeline | PARTIAL | `src/mainFloorLayoutPolish.js`, PNG upload fallback doc, object audit | Main floor polish is still Canvas fallback, not final PNG. It exists to make the live game less broken while real PNG room plates and object sprites are produced. | Produce actual PNG main floor environment plate and separate audited object assets for couch, dining set, porch chairs, porch table, and kitchen. |

Add test scenario:

| Scenario | Priority | Status | Exact test |
|---|---|---|---|
| Main floor porch/couch/dining cleanup | Critical | NEEDS_BROWSER_CONFIRMATION | Open main floor. Porch should show two chairs only with one small center table. No green block should cover stairs. Couch should face TV with L on wall side. Dining should show one clean four-chair table, no ghosted old table/chairs. |
