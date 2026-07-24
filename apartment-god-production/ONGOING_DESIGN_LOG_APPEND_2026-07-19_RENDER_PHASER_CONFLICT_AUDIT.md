# Ongoing Design Log Append, Render Phaser Conflict Audit

## 2026-07-19, Render Phaser Character, Progress, Sink, and Input Conflicts

Status: NEEDS_TESTING
Branch: repair/render-phaser-migration-conflicts-2026-07-19
Base commit: 3e8722052e7dc4fbf781b11979f339327b8b6b06
Commits:
- 31c07a7293ffe44fcbf64a54b94b53c86870bf7d, activity progress and world space arcade input
- b4545ff1e8ce8560d43fa537f30244a523f7ddf6, render conflict correction layer
- c393ad1e8b5e1730c011bd094551c97d0337c396, install correction layer and cache bust
- c6483c29dde10d7fcdff56b730aab5beafb2f875, regression tests
- be6cffb088a02b90f767b896de895905c57e845d, idea Bible directive
Files changed:
- src/phaserParityCorrections.js
- src/phaserRenderConflictCorrections.js
- src/main.js
- tests/phaser-render-conflict-corrections.test.js
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-19_RENDER_PHASER_CHARACTER_PRIORITY.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-render-conflict-audit-2026-07-19

Summary:
Kam identified visible Render problems in the Phaser migration build. Code inspection confirmed that the kitchen sink was drawn twice, the progress bar depended on actionTotal even when the current action countdown was the better source, world object arcade hit testing used screen coordinates, and stationary activity facing was not corrected toward the used object.

Implementation details:
- Activity progress now tracks a per action starting countdown and advances from current actionT even when actionTotal is absent or stale.
- Arcade cabinet world object detection uses pointer.worldX and pointer.worldY with compatibility fallback.
- Added a bounded, once per scene correction layer that erases the older kitchen sink render and redraws only the preferred newer diagonal sink.
- Added stationary object facing correction while excluding intentional lying, sleeping, swimming, dog rest, and weight states.
- Added source regression tests for all scoped fixes.
- Logged that current character sprite quality remains an unresolved production asset problem. The present directional sheets only provide four generic walk frames per direction and cannot support high quality activity specific animation by code distortion alone.

Testing performed:
- Verified each reported conflict by source inspection.
- Automated workflow has not yet completed for the exact branch head.

Testing requested:
- Open the deployed branch preview or Render link after deployment.
- Confirm only one kitchen sink appears and that it is the newer diagonal design.
- Start several timed activities and confirm the progress bar advances beyond zero.
- Confirm stationary actors face the object they use without sideways or upside down walk sprites.
- Move or scale the camera and confirm arcade double tap still targets the visible cabinet.
- Review every current character sheet and activity state for replacement with production quality assets.

Known risks:
- Character art remains below target quality until new sprite assets and activity specific animation states are authored.
- The exact repair head still requires CI and browser testing.
- Main and Render were not updated by this audit.
