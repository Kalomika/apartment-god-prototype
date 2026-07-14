# Ongoing Design Log Append, Dog Strict Top-Down Replacement

Date: 2026-07-14
Status: COMMITTED, NEEDS BROWSER CONFIRMATION
Branch: phaser-migration, then main content patch
Runtime files changed: yes
Render settings changed: no

## Summary

Mobile QA confirmed the active dog still did not read like the intended brown and white top-down dog sprite. This pass replaces the previous dog renderer with a stricter top-down brown and white dog silhouette instead of trying to tweak the prior renderer.

## Files changed

- src/dogSpriteOverlay.js
- src/rendering.js

## Implementation details

- Rebuilt dog renderer around a base pose facing east: head at positive X, tail at negative X.
- Direction rotation now maps from that base pose so head leads and tail trails in all four directions.
- Added a clearer white body, brown head, brown body patch, visible ears, snout, four short legs, and tail.
- Simplified sleep/rest to avoid the previous sideways blob/bug look.
- Cache-busted the dog renderer import again with `v=20260714-dog-strict-topdown`.

## Testing requested

- Hard refresh after Render rebuild.
- Move dog east, west, north, and south.
- Confirm the brown head points in the movement direction and the white/brown body trails behind.
- Confirm the dog no longer looks like the previous recent renderer.
- Confirm Canvas playfield still renders.

## Known risks

- This is still a runtime shape renderer, not final PNG atlas integration.
- If browser/Render cache persists, verify the new import query in network/devtools or hard refresh again.
