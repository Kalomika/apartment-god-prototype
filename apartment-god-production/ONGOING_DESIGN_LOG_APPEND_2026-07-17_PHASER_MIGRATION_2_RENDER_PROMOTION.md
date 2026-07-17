## 2026-07-17, Phaser Migration 2 Promoted for Render Testing

Status: NEEDS_TESTING
Branch: phaser-migration-2 promoted to main
Commit: source promotion commit b8c03be0b4999f19269889b3fea0c4a66d7d65b8, this log commit follows it and main is synchronized to the resulting branch head
Files changed: branch pointer for main, docs/APARTMENT_GOD_RENDER_TESTING_DEFAULT.md, apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-17_PHASER_MIGRATION_2_RENDER_TEST.md, this append file
Runtime files changed: no new runtime edits during promotion, existing Phaser Migration 2 runtime is now exposed through main
Render playable branch updated: yes
Backup branch: backup/main-before-phaser-render-sync-2026-07-17
Source backup branch: backup/phaser-migration-2-before-render-promotion-2026-07-17

Summary:
Kam confirmed that Apartment God work must be exposed through the Render watched main branch after the required backups so he can actually test it. The clean Phaser overhaul branch `phaser-migration-2` was reviewed and promoted temporarily to `main` for browser testing.

Implementation details:
- Verified the repository is `Kalomika/apartment-god-prototype`.
- Verified the intended source branch is `phaser-migration-2`.
- Verified `src/main.js` boots `bootPhaserMigration2Game()`.
- Verified the runtime loads Phaser through `/vendor/phaser.esm.js`, while `scripts/build.js` copies that file from the installed Phaser package into the built site.
- Verified `render.yaml` uses `npm install && npm run build` and publishes `dist`.
- Verified the branch has a visible recovery screen instead of a blank canvas when boot fails.
- Confirmed the branch is a clean native Phaser test candidate with static asset backed sprites, not a finished feature parity replacement.
- Preserved the previous Canvas main state before moving main.
- Preserved the Phaser Migration 2 source state before promotion.
- Updated only the GitHub main branch pointer. Render settings were not changed and no manual deployment was triggered.

Testing performed:
GitHub code inspection, branch comparison, entry point inspection, build script inspection, and Render configuration file inspection. No completed Render browser test yet. No CI status or workflow run was present on the promoted source head.

Testing requested:
Open https://apartment-god-phaser.onrender.com after Render finishes rebuilding. Confirm the native Phaser loading message appears, the game does not show a black or blank canvas, rooms and objects render, Resident, Girlfriend, and Dog appear, selection works, object menus open, actors move, floors switch, phone UI opens, save and load work, and basic food, bathroom, sleep, dog, work, and offsite actions still function.

Known risks:
`phaser-migration-2` is a native Phaser architecture preview, not a completed migration. It was 17 commits ahead of the previous main merge base and 19 commits behind the former Canvas main. Static SVG bridge sprites are present, but final PNG atlases, walk cycles, unique activity animation identities, exact object art, and full feature parity are incomplete. The purpose of this main replacement is direct Render testing and visual evaluation.

Follow ups:
Use Kam's Render test results to decide whether to continue building on `phaser-migration-2`, restore the previous Canvas main backup, or selectively port missing systems into the clean Phaser branch. Keep the previous main backup until Kam explicitly approves removal.
