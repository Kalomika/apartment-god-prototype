# Development Matrix Patch: Dog Atlas Replacement

Date: 2026-07-14
Branch: main
Status: NEEDS_BROWSER_CONFIRMATION
Runtime files changed: yes
Render settings changed: no

## Dog Renderer / Dog Asset

Status: NEEDS_BROWSER_CONFIRMATION

Updated notes:

- Active dog atlas path `assets/sprites/characters/dog/top_down_dog_atlas.svg` has been replaced with the brown and white top-down dog atlas.
- `src/dogSpriteOverlay.js` now cache-busts the atlas URL with `v=20260714-brown-white-dog-atlas`.
- Dog atlas frame order is now treated as north, south, east, west.

## Required QA

- Confirm the dog visibly uses the new brown and white atlas.
- Confirm north, south, east, and west movement show the correct head/tail direction.
- Confirm no old dog appearance remains after hard refresh.
