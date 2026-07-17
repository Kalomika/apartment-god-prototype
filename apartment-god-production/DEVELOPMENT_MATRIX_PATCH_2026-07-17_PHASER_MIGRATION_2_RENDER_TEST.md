# Development Matrix Patch, Phaser Migration 2 Render Test Promotion

Date: 2026-07-17
Branch: phaser-migration-2
Status: NEEDS_RENDER_TESTING
Canonical merge pending: yes

| System | Status | Current State | Required Test |
|---|---|---|---|
| Phaser Migration 2 native boot | NEEDS_RENDER_TESTING | `src/main.js` boots `bootPhaserMigration2Game()`. Phaser is loaded from the build copied vendor module. A visible recovery screen replaces blank canvas failure. | Confirm Render builds, Phaser starts, and the canvas does not blank. |
| Native Phaser scene | NEEDS_RENDER_TESTING | Rooms, objects, people, and dog are drawn as Phaser images in separate containers. The legacy Canvas draw stack is not the primary playfield renderer. | Confirm floor rendering, depth, object visibility, actor visibility, selection, and input. |
| Feature continuity | NEEDS_RENDER_TESTING | Existing state, movement, actions, autonomy, UI, calendar, save, offsite, pool, life quality, and tidiness modules are reused. | Test movement, object menus, phone, floor switching, save and load, bathroom, food, sleep, dog, work, and offsite travel. |
| Character art and animation | PARTIAL | Static SVG bridge sprites exist. Final PNG atlases, walk cycles, and unique activity animation identities are not complete. | Judge the visual direction only. Do not treat it as final character or activity animation quality. |
| Object art | PARTIAL | Objects are mapped to grouped bridge assets by kind. Exact individual object art is incomplete. | Review whether the native Phaser structure works before exact object replacement. |
| Current main feature parity | NEEDS_CORRECTION | `phaser-migration-2` is behind the previous Canvas `main` and old `phaser-migration` feature work. It is being promoted temporarily to test the clean Phaser architecture, not because parity is complete. | Record missing or broken systems found during Render testing, then port only confirmed required behavior into the clean Phaser branch. |

## Promotion Rule

The previous `main` must remain preserved at `backup/main-before-phaser-render-sync-2026-07-17`. The source overhaul is preserved at `backup/phaser-migration-2-before-render-promotion-2026-07-17`. No Render settings or manual deployment actions are permitted.
