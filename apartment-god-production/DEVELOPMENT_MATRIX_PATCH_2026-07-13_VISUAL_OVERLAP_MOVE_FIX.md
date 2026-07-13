# Development Matrix Patch, Visual Overlap And Object Move Fix

Date: 2026-07-13
Branch: phaser-migration
Status: PATCHED, NEEDS_BROWSER_TESTING

## Main Floor Visual Ownership

Status: NEEDS_BROWSER_TESTING

Updated notes:

- Clean porch pass should own the porch visual. The porch should show the deck, two outward-facing chairs, and one small table only.
- Pet/robot nook overlay removed from main floor polish because it was blocking the entry/stereo/porch zone and creating a large unwanted lower-room plate.
- Porch clear expanded to remove stale green side overlays from prior realism correction pass.
- Couch and dining set still need final PNG/object replacement, but active procedural correction now avoids the most obvious stacked overlays.

## Object Movement

Status: NEEDS_BROWSER_TESTING

Updated notes:

- Movable objects must not move remotely when the selected actor is on a different floor.
- Moving an object now requires actor and object to share the same floor.
- Move job now has explicit phases: toObject, lifting, toDest.
- Object follows the actor only during the carry phase, not immediately after placement selection.
- Move cancels safely if actor/helper/object leaves the move floor.

## Regression Tests Added

- tests/object-move-physical.test.js

Coverage:

- Remote object movement rejected when actor is on another floor.
- Physical object movement requires actor to reach object before carrying and placing it.

## Remaining Risks

- Kitchen fixture ownership still needs a focused pass if double stove/sink/coffee overlap persists after this update.
- Procedural correction layering remains temporary until production PNG/object sprites replace the placeholders.
