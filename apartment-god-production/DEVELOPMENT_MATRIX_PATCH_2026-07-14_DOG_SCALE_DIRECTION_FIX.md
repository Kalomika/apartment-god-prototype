# Development Matrix Patch: Dog Scale And Direction Fix

Date: 2026-07-14
Branch: phaser-migration and main after sync
Status: NEEDS_BROWSER_CONFIRMATION
Runtime files changed: yes
Render settings changed: no

## Dog Renderer

Status: NEEDS_BROWSER_CONFIRMATION

Updated notes:

- Dog entity draw path is owned by `src/dogSpriteOverlay.js`.
- `src/renderEntities.js` skips dog entities so the legacy entity dog renderer does not draw underneath the upgraded dog.
- Dog shape renderer scale reduced to `.56`.
- East/west direction mapping corrected so the dog head faces travel direction and tail points opposite.
- Dog bubbles/action bars now draw in local dog coordinates.

## Required browser QA

- Move dog north, south, east, and west.
- Confirm head leads and tail trails.
- Confirm no legacy dog is visible underneath.
- Confirm size is closer to game scale.
