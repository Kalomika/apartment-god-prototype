# Development Matrix Append, Main Human Renderer Cache Bust

Date: 2026-07-14
Branch: main
Status: NEEDS_TESTING
Backup branch: backup/main-before-human-renderer-framework-port-2026-07-14

## Browser Cache Chain
Status: NEEDS_TESTING

Update:
- `index.html` cache-busts the module entry.
- `src/main.js` cache-busts `canvasRuntime.js`.
- `src/canvasRuntime.js` cache-busts `rendering.js`.
- `src/rendering.js` cache-busts `renderEntities.js`.

Reason:
- The human renderer source on `main` had already been corrected, but Kam reported the live playable still showed old static/no-walk/back-facing behavior. This matrix entry tracks the cache-busting support change separately from the renderer source change.

Required test:
- Hard refresh the playable page after deployment pickup.
- Confirm the human walk cycle appears.
- Confirm the girlfriend no longer shows the dropped back-of-head presentation.
- Confirm brush teeth, standing pee, seated toilet, shower, wash dog, weights, treadmill, heavy bag, and sleep still display.

Risk note:
- If the live page still shows the old renderer after this cache bust, treat the issue as a live deployment source mismatch until the served JavaScript URLs are inspected.
