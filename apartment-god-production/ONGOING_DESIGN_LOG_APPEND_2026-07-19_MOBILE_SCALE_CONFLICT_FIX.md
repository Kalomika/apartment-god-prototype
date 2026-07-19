# Ongoing Design Log Append, Mobile Scale Conflict Fix

## 2026-07-19, Android Phaser Canvas Centering Regression

Status: NEEDS_TESTING
Branch: work/mobile-scale-conflict-fix-2026-07-19
Commits:
- 4291c09469afe4d0f21a1592064a3f7ff0a4f21c, bug directive
- 1c358ba8450fd78c78b15dc5d5208f7835e0349a, Phaser scale ownership fix
- 23ed2205bfb0db2bcdec05266c2b8891c1467eed, wrapper sizing authority fix
- 59b22cbae70bfa1b0a15d8e92a536ec317761218, scale refresh and margin reset
- e54bac5795cb1f25ad2a5d81af568bffe4c66240, cache bust
Files changed:
- src/phaserParityRuntime.js
- src/fit.js
- src/main.js
- index.html
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-19_MOBILE_SCALE_CONFLICT.md
Runtime files changed: yes
Render playable branch updated: no
Backup branches:
- backup/phaser-migration-before-mobile-scale-conflict-fix-2026-07-19
- backup/main-before-mobile-scale-conflict-fix-2026-07-19

Summary:
Kam's live Android screenshot proved the prior mobile sizing patch was not successful. The screenshot showed the 960 by 720 game scene pushed to the bottom of a large dark wrapper, with only a narrow strip visible above the control bar.

Implementation details:
- Removed Phaser.Scale.CENTER_BOTH from the parity runtime.
- Assigned game-wrap as the Phaser scale parent.
- Retained Phaser.Scale.FIT but changed centering to Phaser.Scale.NO_CENTER.
- Disabled parent expansion so Phaser does not resize the application shell.
- Made game-wrap the authoritative mobile 4:3 sizing container.
- Explicitly clears Phaser canvas margins and transforms.
- Refreshes the Phaser scale manager after page show, resizing, and orientation changes.
- Cache-busted the HTML, CSS, runtime entry, and Phaser parity import.

Testing performed:
- Verified by code inspection that the screenshot behavior matches a conflict between Phaser Scale Manager auto-centering and custom wrapper sizing.
- CI pending on the work branch.

Testing requested:
After CI succeeds and Kam explicitly approves a Render playable update, hard refresh https://apartment-god-phaser.onrender.com on Android. Confirm that the full floor begins at the top of the game wrapper and fills the entire 4:3 area with no large blank region.

Known risks:
- Actual Samsung browser behavior still requires direct Render testing.
- Main remains unchanged until Kam explicitly requests the Render playable branch update.
