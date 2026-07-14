# Development Matrix Append, Dining And Kitchen Layout Fix

Date: 2026-07-14
Branch: phaser-migration
Status: NEEDS_TESTING
Backup branch: backup/phaser-migration-before-dining-kitchen-layout-fix-2026-07-14

## Object Interaction Matrix Updates

### Dining Table
Status: NEEDS_TESTING

Update:
- Dining set visual is now rebuilt in `src/mainFloorLayoutPolish.js` as separate table and chair pieces instead of a single flattened visible mass.
- The old visible dining footprint is cleared before drawing the new set to avoid duplicate table/chair visuals under the current table.
- Six chairs are drawn as independent pieces: two north, two south, one west, and one east.
- South chair row is aligned with the current dining table approach depth so an actor eating should no longer appear seated on an invisible chair.

Required test:
- Select Resident, choose Dining Table eat meal or sit table, and verify the actor lines up with a visible chair.
- Confirm old table or chair shadows are not visible underneath the new set.

### Kitchen Sink And Coffee Maker
Status: NEEDS_TESTING

Update:
- Sink and coffee maker layout positions were separated in the active main floor polish pass.
- Coffee maker was moved to the right side wall counter zone, away from the sink basin.
- Kitchen trash was moved lower on the right side so it no longer crowds the coffee maker.

Required test:
- Main floor kitchen should show sink and coffee maker as separate objects with no overlap.
- Brush teeth and coffee actions should still route to their expected objects.

### Main Kitchen Counter
Status: NEEDS_TESTING

Update:
- Added a continuous L shaped counter redraw in the main floor polish pass.
- Counter now runs horizontally across the top kitchen wall through fridge, stove, and sink, then turns down the right side wall toward the doorway area.
- Fridge, stove, sink, coffee maker, and trash are redrawn after clearing stale object layers.

Required test:
- Confirm kitchen reads as one continuous L countertop run and not stacked loose sprites.
- Confirm click targets remain usable.

## Branch Risk
Status: NEEDS_TESTING

Notes:
- Work is on `phaser-migration` only.
- Main was not updated in this pass.
- Public Render link may not show this until main is updated or Render is pointed at phaser-migration by existing deployment configuration.
- Do not change Render settings.
