# Ongoing Design Log Append, Dog Atlas Replacement

Date: 2026-07-14
Status: COMMITTED, NEEDS BROWSER CONFIRMATION
Branch: main
Runtime files changed: yes
Render settings changed: no
Backup branch: backup/main-before-dog-atlas-replacement-2026-07-14

## Summary

Replaced the active committed dog atlas used by the live game. This is not another procedural dog renderer tweak. The active asset at `assets/sprites/characters/dog/top_down_dog_atlas.svg` now embeds the brown and white top-down dog atlas image.

## Files changed

- assets/sprites/characters/dog/top_down_dog_atlas.svg
- src/dogSpriteOverlay.js

## Implementation details

- Replaced the old SVG dog atlas contents with an embedded 512x128 brown and white top-down PNG atlas.
- Added a cache-busted atlas URL in `src/dogSpriteOverlay.js`.
- Corrected `FRAME_MAP` to match the atlas order: north, south, east, west.

## Testing requested

After Render rebuild:

- Hard refresh the live link.
- Select the dog and move it north, south, east, and west.
- Confirm the dog is the brown and white atlas dog, not the old recent fallback.
- Confirm the head leads and the tail trails in every direction.

## Known risks

- Browser cache may keep a stale image until hard refresh.
- This pass changes the active atlas and renderer map only, not dog behavior logic.
