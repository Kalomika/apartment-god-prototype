# Ongoing Design Log Append: Entity Renderer Revert And TV Fix

## 2026-07-14, Entity Renderer Revert And TV Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render playable branch updated: pending main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-entity-renderer-revert-tv-fix-2026-07-14

## Files changed

- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_ENTITY_RENDERER_REVERT_TV_FIX_STARTED.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_ENTITY_RENDERER_REVERT_TV_FIX.md
- src/rendering.js
- src/tvStateCorrectiveOverlays.js
- src/dogSpriteOverlay.js

## Summary

Reverted the broken broad human entity renderer that made characters look like they were crawling or swimming across the floor. Restored the prior animation renderer for human characters and kept the dog asset as a separate overlay so the dog upgrade does not require the broken human renderer. Added a TV screen corrective overlay so inactive TVs, including the upstairs primary bedroom wall TV, are redrawn dark unless a nearby actor is actually watching that specific TV.

## Implementation details

- `src/rendering.js`: switched the active human entity renderer back from `renderEntitiesTopDown.js` to `renderEntities.js`.
- `src/rendering.js`: added `drawTvStateCorrectiveOverlays` after object and room overlays so all TV screens get corrected independently of stale global TV state.
- `src/rendering.js`: added `drawDogSpriteOverlay` after normal entity drawing so the dog can use the asset-backed atlas without forcing the broken broad human renderer.
- `src/tvStateCorrectiveOverlays.js`: new targeted TV screen redraw that turns each TV dark unless an awake person with a watch/TV/movie/sports action is near that exact TV.
- `src/dogSpriteOverlay.js`: new dog-only atlas overlay using the previously committed `assets/sprites/characters/dog/top_down_dog_atlas.svg`.

## User clarification preserved

Kam clarified that the final correct character direction is not side-view front/back acting. In a true top-down game, the character should mostly show the top of the head and shoulders. The emergency fix therefore restores the functioning animation system now and avoids the incorrect crawling/swimming rotation. The final character sprite pass should be a proper true top-down head/shoulders sprite system, not a broad body rotation hack.

## Testing performed

- Verified by code inspection through GitHub file fetch/compare.
- Browser behavior is not verified from this connector environment.

## Testing requested

- Open https://apartment-god-phaser.onrender.com after Render rebuild and hard refresh.
- Walk north and south. Characters should no longer look like they are crawling or swimming.
- Confirm prior seating and activity animations are restored to the earlier behavior.
- Check the primary bedroom TV when nobody is watching. The blue screen should be dark.
- Watch TV near a TV and confirm that specific TV can still appear on.
- Check the dog. It should still draw with the asset-backed dog overlay rather than relying only on the old procedural dog.

## Known risks

- The normal `renderEntities.js` still contains old placeholder/procedural character art. This is an emergency revert, not final sprite quality.
- The dog overlay is a bridge. Final PNG dog sprites and manifest are still required.
- TV correction is visual-state enforcement. It does not yet model per-room TV power memory beyond active watching.

## Follow ups

- Build a true top-down human sprite atlas showing head, shoulders, torso mass, and direction-appropriate motion without side-view crawling.
- Replace procedural dog bridge with final PNG dog animation sheet.
- Continue fixing chair alignment and seating with real top-down assets instead of broad renderer changes.
