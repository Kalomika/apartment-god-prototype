# Ongoing Design Log Append, Dog Scale And Direction Fix

Date: 2026-07-14
Status: COMMITTED, NEEDS BROWSER CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-dog-scale-cleanup-2026-07-14

## Summary

Patched the live dog shape renderer after mobile QA showed the dog was too large and could visually lead with the tail instead of the head when moving east/west.

## Files changed

- src/dogSpriteOverlay.js

## Implementation details

- Confirmed `src/renderEntities.js` now skips dog entities, so the legacy entity dog renderer is not the active dog draw path.
- Reduced the dog sprite scale from `.64` to `.56`.
- Fixed the east/west direction angle mapping so the head faces travel direction and the tail points away from travel direction.
- Moved dog UI drawing into a local dog coordinate context so bubbles/action bars stay attached correctly.
- Lowered movement bob to reduce oversized wobble.

## Testing performed

Verified by code inspection through GitHub connector. Browser QA still required after Render rebuild.

## Testing requested

- Select the dog and move it left, right, up, and down.
- Confirm the head points toward the movement direction and the tail trails behind.
- Confirm the dog no longer looks like two dog renderers are meshed.
- Confirm selected ring/action UI still appears around the dog.

## Known risks

- This is still a runtime shape renderer, not final hand-cut PNG frames.
- If a stale Render build or cached browser build is served, the old dog may remain visible until hard refresh/rebuild completes.
