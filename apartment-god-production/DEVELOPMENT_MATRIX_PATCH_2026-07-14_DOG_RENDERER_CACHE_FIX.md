# Development Matrix Patch: Dog Renderer Cache Fix

Date: 2026-07-14
Status: PATCHING, NEEDS_BROWSER_CONFIRMATION
Runtime files changed: yes
Render settings changed: no

## Dog Renderer

Updated notes:

- Upgraded dog renderer remains in `src/dogSpriteOverlay.js`.
- Generic entity renderer skips dog entities.
- Live boot should use Canvas runtime.
- Add cache-busted entry/import path so mobile Render does not continue serving stale dog renderer code after boot path changes.

## Required QA

- Confirm upgraded dog appears after hard refresh.
- Confirm no black playfield regression.
- Confirm head leads movement direction and tail trails.
