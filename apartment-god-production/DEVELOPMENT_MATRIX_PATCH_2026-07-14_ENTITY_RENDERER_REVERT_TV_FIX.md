# Development Matrix Patch: Entity Renderer Revert And TV Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-entity-renderer-revert-tv-fix-2026-07-14

## Matrix rows to merge during next safe documentation sync

| System | Status | Files | Current state | Required test |
|---|---|---|---|---|
| Human entity renderer emergency revert | NEEDS_BROWSER_CONFIRMATION | `src/rendering.js`, `src/renderEntities.js` | Active renderer switched back to the prior human animation system. The broken broad `renderEntitiesTopDown.js` human renderer is no longer active. | Walk north/south/east/west and confirm characters no longer look like crawling/swimming. Confirm prior seating/activity animations returned. |
| Final top-down human direction standard | PLANNED | Idea/log docs | Kam clarified the target is true top-down head/shoulder readability, not side-view front/back. Future sprites should show the top of head and shoulders with correct motion. | Dedicated sprite pass required. |
| TV screen state correction | NEEDS_BROWSER_CONFIRMATION | `src/tvStateCorrectiveOverlays.js`, `src/rendering.js` | Every TV screen is visually redrawn dark unless an awake actor is actually watching near that specific TV. This covers the upstairs primary bedroom TV as well as living room TV. | Check bedroom TV while no one watches. It should be dark, not blue. Start watching near a TV and confirm that TV appears active. |
| Dog sprite asset bridge | NEEDS_BROWSER_CONFIRMATION | `src/dogSpriteOverlay.js`, `assets/sprites/characters/dog/top_down_dog_atlas.svg`, `src/rendering.js` | Dog asset atlas remains active through a dog-only overlay while human renderer is reverted. | Check dog on main floor and during movement. Confirm asset-backed dog is visible. |

## Planned follow ups

| System | Status | Notes |
|---|---|---|
| Final character PNG sprite atlas | PLANNED | Needs true top-down head/shoulder body design, walk cycles, seated poses, object-specific actions, and no broad rotation hack. |
| Final dog PNG animation set | PLANNED | SVG overlay bridge should become real PNG atlas with manifest and animation states. |
