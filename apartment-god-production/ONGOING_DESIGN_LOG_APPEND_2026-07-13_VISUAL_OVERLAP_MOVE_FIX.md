# Ongoing Design Log Append, Visual Overlap And Object Move Fix

Date: 2026-07-13
Status: PATCHED, NEEDS BROWSER TESTING
Branch: phaser-migration
Commit range: bda9bd9061a2ea4b152b8fbaa46346ba2f2ed110 through 43b7afd4b755a07175008802933a548f62da4918
Runtime files changed: yes
Render playable branch updated: pending main sync after main backup
Backup branch: backup/phaser-migration-before-visual-and-move-fix-2026-07-13

## Summary

Patched two live regressions reported from mobile testing.

1. Main floor visual replacement layers were still fighting each other. The porch had extra greenery and pet/robot nook geometry drawn over the clean porch area, the stereo/entry area could be cut off by the large nook plate, and the dining replacement could visually clash with older object rendering. The main floor polish pass now owns the clean porch, couch, and dining set and clears stale side overlays before drawing the porch.

2. Object movement could be started while the selected actor was on a different floor from the object. That allowed a move plan to appear to move or lift an object without the actor physically going to the object. Object moves now require the mover to be on the same floor, update every frame through the move job system, lift first, then carry the object to the destination.

## Files changed

- src/canvasRuntime.js
- src/objectMove.js
- src/mainFloorLayoutPolish.js
- tests/object-move-physical.test.js

## Implementation details

- Imported and called updateMoveJob during the main frame update loop.
- Added same floor checks to beginMoveObject and placeMoveObject.
- Added move job floor tracking, source restoration, lift phase, carry phase, and cancellation if movers leave the floor.
- Removed the pet/robot nook drawing from the main floor polish pass.
- Stopped main floor polish from moving dog bed, dog bowl, and robot vacuum as part of the porch correction.
- Expanded the porch clear plate so stale green side overlays do not remain around the porch or stairs.
- Added regression tests for remote object move rejection and physical carried object movement.

## Testing performed

Verified by code inspection through GitHub connector. Browser and local npm test were not available in this environment.

## Testing requested

- Main floor porch should show only the clean porch deck, two chairs, and small table.
- No giant green block should cover the porch or stairs.
- Dining table should not show ghosted older chairs.
- Media shelf/stereo should not be cut off by the lower entry/porch replacement.
- Moving a movable object should require the selected actor to be on the same floor as the object.
- The object should not teleport by itself. Actor should go to the object, lift, carry, then place.

## Known risks

- This is still a procedural correction pass, not final PNG object replacement.
- The remaining kitchen double-object report may need a dedicated kitchen fixture ownership pass if it persists after this patch.

## Follow ups

- Replace porch, couch, dining, and kitchen fixtures with real PNG/object sprites in a single Main Floor Visual Replacement Pass.
- Add a broader automated visual ownership audit so multiple draw systems cannot own the same object area.
