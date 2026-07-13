# Ongoing Design Log Append, Garage Visual Revert

This append file should be merged into `apartment-god-production/ONGOING_DESIGN_LOG.md` during the next safe documentation sync.

## 2026-07-13, Garage Anime Visual Pass Disabled

Status: REVERTED
Branch: phaser-migration
Commit: 56c810b333e28af7fc4f4fedc749f4fb4131e9b2
Files changed:
- src/animeVisualAssets.js
- src/animeVisualLayer.js
- tests/anime-visuals.test.js
- assets/manifests/anime-visual-pass-01.json
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_GARAGE_VISUAL_REVERT.md
- apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-13_GARAGE_VISUAL_REVERT.md
Runtime files changed: yes
Render playable branch updated: no
Render settings changed: no
Backup branch: backup/phaser-migration-before-garage-revert-2026-07-13

Summary:
Disabled the anime garage visual pass after live mobile QA showed the garage was visually inconsistent. The default/idle garage showed the newer metallic anime underlay while interaction/open garage states fell back to the old beige garage, causing an obvious state mismatch. The garage also still read as not fully true top down.

Implementation details:
- Created a fresh backup branch from current phaser-migration before touching runtime files.
- Disabled `src/animeVisualAssets.js` so production garage PNGs no longer load at runtime.
- Disabled `src/animeVisualLayer.js` so the metallic anime garage underlay no longer draws.
- Left existing renderer imports safe so boot remains stable and the game falls back to the pre-metallic procedural garage and vehicle renderer.
- Updated `tests/anime-visuals.test.js` to assert that the rejected anime visual pass remains disabled.
- Updated `assets/manifests/anime-visual-pass-01.json` to mark the pass reverted and audit-only.
- Did not touch main.
- Did not deploy.
- Did not change Render settings.

Testing performed:
Verified by code inspection through GitHub connector. No local browser, local npm, or Render test was run in this tool state.

Testing requested:
Open https://apartment-god-phaser.onrender.com after main is updated only if Kam explicitly requests a Render playable update. On phaser-migration/local browser, test garage default, garage selected, character standing in garage, vehicle locked/unlocked, vehicle door/open interaction, departure, return, and floor switching. Confirm the metallic anime floor and production PNG vehicle overlay do not appear and the garage stays visually consistent across states.

Known risks:
The anime PNG files remain in the repo for audit history, but runtime loading is disabled. Future agents must not re-enable them without replacing every related garage state, including default, selected, open, closed, interaction, departure, return, and mobile presentation.

Follow ups:
Build a new garage replacement only when it is true top down and state complete. Use a full garage state asset matrix before integration.
