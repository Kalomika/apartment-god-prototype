# 2026-07-13, Suite Door Vanity and Office Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-suite-door-vanity-office-fix-2026-07-13

## Summary

Correction pass after browser screenshot feedback. Fixed the wrong bedroom wall opening, restored the old suite foyer egress, moved the vanity out of the center of the room onto a wall counter, removed the seated cyan debug cone that looked like a TV beam, moved the book library upstairs into the office, and rotated the office couch toward the computer area.

## Files changed

```txt
src/world.js
src/blueprint.js
src/afterEntityOverlays.js
src/renderHouseStyle.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_SUITE_DOOR_VANITY_OFFICE_FIX.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-13_SUITE_DOOR_VANITY_OFFICE_FIX.md
```

Runtime files changed: yes
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no
PNG assets committed: no

## Implementation details

- Created backup branch before changes.
- Removed the incorrect direct Primary Bedroom to Upper Hall gap that was beside the suite foyer opening.
- Restored the Suite Foyer to Upper Hall doorway so bedroom egress works through the private sink/vanity connector.
- Preserved Primary Bedroom to Suite Foyer, Primary Bedroom to Walk In Closet, Suite Foyer to Primary Suite Bath, and Walk In Closet to Primary Suite Bath.
- Moved the vanity/sink out of the middle of the suite foyer and onto the west wall as a counter-style double vanity fallback.
- Updated the sink renderer so `vanity: 'double'` draws as a counter with two basins instead of an old-style standalone sink.
- Removed the visible seated facing guide triangle, which was reading as a TV flashing beam.
- Moved the book library out of the downstairs living/entry area and into the upstairs office.
- Rotated the upstairs office couch to face west toward the computer desk area.
- Added vertical couch fallback drawing support for west/east-facing couches.

## Testing performed

GitHub connector file edits and file inspection only. No local browser test, npm build, or Render test was performed.

## Testing requested

```txt
Go upstairs.
Confirm the direct bedroom-to-hall gap beside the suite foyer is closed.
Confirm the bedroom still enters the suite foyer.
Confirm the suite foyer opens to the upper hall.
Confirm the resident can leave the bedroom through bedroom -> suite foyer -> hall.
Confirm the vanity is on the wall and reads as a counter/double vanity, not a loose sink in the center.
Confirm the suite foyer does not open into the closet.
Confirm the office couch faces the computer/desk area.
Confirm the book library is upstairs in the office and no longer downstairs.
Confirm the TV no longer throws a second cyan guide beam.
Confirm no boot error or blank canvas.
```

## Known risks

Procedural fallback art still cannot fully solve the final visual direction. The double vanity and vertical couch are temporary Canvas fallback objects until audited anime top-down PNGs exist. Browser pathing must verify the restored foyer egress works with the new vanity collision.

## Follow ups

If the vanity blocks movement in browser, make the vanity non-solid or add a facing-aware approach point for wall-mounted vanities. Final design should use real top-down bathroom counter PNGs with mirrors, counter clutter, and clear walkable space.
