# Dog Strict Top-Down Replacement Backup Manifest

Date: 2026-07-14

## Reason

Mobile QA confirmed the active dog still reads like the wrong/old dog and not the intended brown and white top-down dog sprite. This pass replaces the dog renderer instead of tweaking the prior renderer.

## Protected runtime file before patch

- `src/dogSpriteOverlay.js`
  - blob SHA before patch: `459547fc018c4137929d341b51da9a865419798d`

## Notes

The active tool slice did not expose branch creation at this point, so this manifest records the exact pre-patch file SHA. Existing recent backup branches also exist from the dog/cache recovery work.
