# Dog Renderer Regression Investigation, 2026-07-14

## Status

PATCHING

## Symptom

After restoring the live boot path from the unstable Phaser host to the Canvas runtime, mobile QA reported that the upgraded dog appeared reverted.

## Findings

- `main` still contains the upgraded `src/dogSpriteOverlay.js` module.
- `src/renderEntities.js` skips dog entities, so the old generic actor renderer is not supposed to draw the dog.
- The likely issue is stale browser/module cache after boot path changes, or an unversioned module graph continuing to serve older renderer code on mobile Render.

## Safety action

- Add explicit cache-busted module imports for the live Canvas boot and dog overlay path.
- Keep Canvas boot path because Phaser host produced black playfield on mobile.

## Follow up

If the dog still appears reverted after this cache-bust patch and hard refresh, the next step is a direct visual capture comparison and a full search for any remaining runtime dog draw path in the built output.
