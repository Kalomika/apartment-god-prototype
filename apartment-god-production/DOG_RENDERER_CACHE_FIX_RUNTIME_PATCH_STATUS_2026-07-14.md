# Dog Renderer Cache Fix Runtime Patch Status

Date: 2026-07-14
Status: RUNTIME PATCH COMMITTED, MAIN SYNC PENDING

## Runtime patches committed

- `index.html` now adds no-cache meta tags and cache-busted `styles.css` and `src/main.js` URLs.
- `src/rendering.js` imports `src/dogSpriteOverlay.js` with a cache-busted query so mobile browsers do not reuse the stale dog module after the Canvas boot recovery.

## Notes

This patch does not change Render settings. It keeps the stable Canvas boot path.
