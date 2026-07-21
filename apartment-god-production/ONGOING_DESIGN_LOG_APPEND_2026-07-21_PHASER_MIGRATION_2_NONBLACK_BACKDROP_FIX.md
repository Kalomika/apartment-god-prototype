# Ongoing Design Log Append: Phaser Migration 2 Non-Black Backdrop Fix

## 2026-07-21, Non-Black Backdrop Safety

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration-2
Commits:
- d09b43601884320f7dc163c150e5f4e044d9536b
- f7cfafd9baa91a5a737d175a84f8998e9178d819
- a22afe88b10e15d00569c0e066708c7f85713850
- f8d1ce8b1d445c014ac619aa805fbd0ef8786c50
Files changed:
- `src/phaserMigration2BackdropSafety.js`
- `src/main.js`
- `tests/phaser-migration-2-backdrop-safety.test.js`
- `index.html`
- this log append
Runtime files changed: yes
Render playable branch updated: no
Main touched: no
Render settings changed: no
Manual deployment triggered: no
Backup branch: existing `backup/phaser-migration-2-before-perfecting-2026-07-19` and related pre-correction P2 backups remain available

## Problem

Kam reported that the Phaser Migration 2 background appeared black.

The audit confirmed two dark fallback layers:

- the HTML canvas used a dark fallback background before Phaser rendered
- the Phaser game configuration cleared the scene to a near-black color

When room textures were delayed, unavailable, missing, or not yet visible, those dark surfaces could remain exposed and make the game look black even though the HUD or scene systems were active.

## Correction

Added `src/phaserMigration2BackdropSafety.js`.

The safety system:

- sets a visible non-black canvas background before Phaser completes boot
- adds a floor-wide colored fallback surface behind all room and object art
- adds floor-specific fallback room shapes behind room textures
- updates the fallback palette when the player changes floors
- remains at very low depth so actual room artwork renders above it
- makes missing or delayed room textures expose a readable floor color rather than black
- cleans up its polling interval when the game is destroyed or the page unloads

`src/main.js` now installs this safety layer immediately after Phaser game creation.

`index.html` now includes the visible canvas fallback directly and cache-busts the updated entry module.

## Testing performed

- Verified by code inspection.
- Added structural Vitest coverage in `tests/phaser-migration-2-backdrop-safety.test.js`.
- Browser and phone confirmation were not available in this connector environment.

## Testing requested

Open the isolated Phaser Migration 2 branch preview once available and hard refresh.

Check:

1. The playfield is never black during normal loading.
2. Main, upstairs, basement, garage, backyard, front-south, and driveway each show a visible floor-colored base.
3. Loaded room textures remain above the fallback and are not hidden.
4. If a room texture fails, the room still has a visible shape and border.
5. A genuine runtime failure still shows the intentional recovery screen rather than silently continuing.

## Known risks

- This fixes black fallback exposure. It does not replace temporary room art with final authored room artwork.
- Browser testing is still required to confirm depth ordering against all current room and architecture systems.
