# Ongoing Design Log Append, Mobile Scale Conflict Verified

## 2026-07-19, Android Phaser Canvas Scale Conflict Fix

Status: NEEDS_TESTING
Branch: work/mobile-scale-conflict-fix-2026-07-19 advancing to phaser-migration
Code head verified by CI: b7b7e9be1fa8bce7e9d484460aac3625da1cf3b5
Files changed:
- src/phaserParityRuntime.js
- src/fit.js
- src/main.js
- index.html
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-19_MOBILE_SCALE_CONFLICT.md
- apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-19_MOBILE_SCALE_CONFLICT.md
- apartment-god-production/MOBILE_SCALE_CONFLICT_TEST_PLAN_2026-07-19.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-19_MOBILE_SCALE_CONFLICT_FIX.md
Runtime files changed: yes
Render playable branch updated: no
Backup branches:
- backup/phaser-migration-before-mobile-scale-conflict-fix-2026-07-19
- backup/main-before-mobile-scale-conflict-fix-2026-07-19

Summary:
The live Android screenshot confirmed that the previous mobile layout patch was not successful. The actual Phaser canvas was being vertically centered by Phaser Scale Manager inside a wrapper already sized by custom JavaScript and CSS. This pushed most of the 960 by 720 scene below the visible game area and left a large dark blank region above it.

Implementation details:
- game-wrap is now the Phaser scale parent.
- Phaser keeps FIT scaling but uses NO_CENTER instead of CENTER_BOTH.
- Phaser parent expansion is disabled.
- game-wrap is the single mobile 4:3 sizing authority.
- Canvas margins, transforms, and positioning are reset.
- Phaser scale refresh runs after load, resize, page show, and orientation changes.
- Entry files were cache-busted.
- The original canvas ownership guard remains intact.

Testing performed:
- Phaser Parity CI run 29681027415 identified one test failure because the ownership guard test expected the original explicit guard expression.
- The guard expression was restored without removing the new scale fix.
- Phaser Parity CI run 29681106298 completed successfully.
- Repository checks passed.
- Unit tests passed.
- Static build passed.
- Phaser vendor verification passed.
- Phaser entry point verification passed.
- Work branch is a clean fast-forward from phaser-migration.

Testing requested:
Browser testing is still required on the actual Samsung Android viewport. The full floor should fill the 4:3 game region directly under the date pill, with no large blank band and no scene strip hidden behind the control bar.

Known risks:
- The Render playable branch main remains on the broken live layout until Kam explicitly requests the Render playable branch update.
- Browser chrome and dynamic viewport changes still require direct device verification.
