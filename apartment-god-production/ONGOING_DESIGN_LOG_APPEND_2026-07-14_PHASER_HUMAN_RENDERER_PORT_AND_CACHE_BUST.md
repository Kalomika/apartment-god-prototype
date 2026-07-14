# Ongoing Design Log Append, Phaser Human Renderer Port And Cache Bust

## 2026-07-14 04:45 AM CT, Phaser Human Renderer Port And Cache Bust

Status: NEEDS_TESTING
Branch: phaser-migration and main cache bust parity
Commits:
- phaser-migration runtime: fe0f385d07145ac7417215ec7a6e3569212f1fcb
- phaser-migration cache: 214d3d61052fc682357e7d00bfb7365162319e50, 0e7878711de81d73e220f668e8e5f7dd90781bdf, 0996d99809384246a1b9552643f43132fc6ebc58, 1b9c1472ee690f20c5e18edc7aadb7938a5ed00c
- main cache parity: 6f406e5114b71f9c64e196152ac55e3ef8961f77, 60372c510921515337df5fb2ef12c590da84d026, dbe232aba0288da7e091711f294e484a661d0fc5, 9d4a229f32b9d3ecc259364a6b66dc9ab19f8c9b
Files changed:
- src/renderEntities.js
- src/canvasRuntime.js
- src/rendering.js
- src/main.js
- index.html
Runtime files changed: yes
Render playable branch updated: yes, both active browser-facing branches received the renderer/cache correction because Kam reported the live playable still showed the static back-facing bridge.
Backup branch: backup/phaser-migration-before-human-renderer-framework-port-2026-07-14

Summary:
Kam reported that characters were still sliding, there was still no walk cycle, and the girlfriend still showed her back. Review found that `phaser-migration` still had the static true top-down bridge renderer that explicitly had no walk cycle and relied on crown/back-of-head construction. The prior correction had been applied to `main`, but the active Phaser branch still had the broken visual behavior. This pass ported the restored animated human renderer to `phaser-migration` and cache-busted the browser module chain.

Implementation details:
- Replaced the `phaser-migration` static bridge human renderer with the animated human renderer that includes visible walk cycling.
- Removed the static top-down crown/back-of-head bridge from `phaser-migration`.
- Preserved dog rendering separation by continuing to skip dog entities in `renderEntities.js`.
- Preserved bed anchoring through `sleepObjectId` and the existing bed lane logic.
- Preserved newer activity-specific poses including standing pee, seated toilet, brush teeth, shower, wash dog, weights, treadmill, heavy bag, and sleep.
- Added cache-busting query strings through `index.html`, `src/main.js`, `src/canvasRuntime.js`, and `src/rendering.js` so the browser cannot keep serving the previous static renderer module.
- Added matching cache-busting updates on `main` because it already had the renderer file change but could still serve old modules from cache.

Testing performed:
- GitHub source inspection only. No local build, no browser test, and no manual Render deploy was performed in this chat.

Testing requested:
Open https://apartment-god-phaser.onrender.com after Render has rebuilt or after the page refreshes, then hard refresh if needed. Test Resident and Girlfriend walking, especially long movement across the main floor and basement. Confirm the girlfriend no longer displays the dropped back-of-head bridge, and confirm standing pee, seated toilet, brush teeth, shower, wash dog, weights, treadmill, heavy bag, and sleep still show distinct poses.

Known risks:
- Live Render may need time to pick up the latest branch commit.
- If the link still shows the static bridge after the cache-busted commits, the issue is likely the Render service tracking a different branch or an older deployed commit, not the current repository source.
- Browser testing remains required.

Follow ups:
- If the live page still shows the old bridge renderer, inspect the live served JavaScript URLs and deployed commit source. Do not keep rewriting the renderer until confirming which branch and commit Render is serving.
