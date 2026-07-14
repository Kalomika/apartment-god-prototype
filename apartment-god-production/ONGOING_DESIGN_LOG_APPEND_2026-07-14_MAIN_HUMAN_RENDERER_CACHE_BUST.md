# Ongoing Design Log Append, Main Human Renderer Cache Bust

## 2026-07-14 04:50 AM CT, Main Human Renderer Cache Bust

Status: NEEDS_TESTING
Branch: main
Commits:
- 6f406e5114b71f9c64e196152ac55e3ef8961f77
- 60372c510921515337df5fb2ef12c590da84d026
- dbe232aba0288da7e091711f294e484a661d0fc5
- 9d4a229f32b9d3ecc259364a6b66dc9ab19f8c9b
Files changed:
- src/main.js
- src/canvasRuntime.js
- src/rendering.js
- index.html
Runtime files changed: yes
Render playable branch updated: yes, main is browser-facing and already had the human renderer source correction.
Backup branch: backup/main-before-human-renderer-framework-port-2026-07-14

Summary:
After Kam reported the live page still showed the previous static/no-walk behavior, the browser module chain was cache-busted on `main` so the already-corrected `src/renderEntities.js` source cannot remain hidden behind stale module URLs.

Implementation details:
- `index.html` now points to `src/main.js?v=20260714-human-renderer-framework`.
- `src/main.js` imports `canvasRuntime.js` through the same cache version.
- `src/canvasRuntime.js` imports `rendering.js` through the same cache version.
- `src/rendering.js` imports `renderEntities.js` through the same cache version.
- No Render settings were changed and no manual Render deploy was triggered.

Testing performed:
- Source inspection only. No browser or Render test performed in this chat.

Testing requested:
Open the playable link and hard refresh after Render has picked up the commit. Verify walking, front-facing girlfriend, brush teeth, standing pee, seated toilet, shower, wash dog, weights, treadmill, heavy bag, and sleep.

Known risks:
- If live still shows the old static renderer, the page is likely serving a different branch or older deployed commit.

Follow ups:
- If visual regression persists, inspect the actual live-served JavaScript files and deployment source before changing the renderer again.
