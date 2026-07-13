# 2026-07-13, Egress and Couch Blocker Rescue

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-egress-blocker-rescue-2026-07-13

## Summary

Emergency correction after browser screenshot showed the upstairs primary bedroom had no believable exit path and the main resident could still become trapped on the couch by collision/pathing blockers.

## Files changed

```txt
src/world.js
src/blueprint.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_EGRESS_BLOCKER_RESCUE.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-13_EGRESS_BLOCKER_RESCUE.md
```

Runtime files changed: yes
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Implementation details

- Created a backup branch from the current `phaser-migration` state before applying the rescue.
- Reworked upstairs room boxes so the primary bedroom has an actual visible route out through the upper hall, not only a blocked-looking lower wall arrangement.
- Kept the primary bedroom, walk in closet, primary suite bath, guest room, upper hall, upstairs landing, office, guest/hall bath, and stairs.
- Added a bedroom to hall doorway in the actual upper wall/door graph.
- Added a master bath to hall doorway in addition to the closet to master bath doorway, so the bathroom does not become a dead-end trap in route logic.
- Moved upstairs lower rooms slightly to line up with the new doorway graph.
- Marked couch seating surfaces as enterable for collision/pathing purposes on the main couch, basement couch, and lab pose chair. This prevents actors from becoming trapped by the couch collider after sitting or reading on a couch.
- Kept couches as objects for clicking and rendering, but removed them from the solid blocker list by using the existing `enterable` rule in `solidObjects`.

## Testing performed

GitHub file inspection and compare preparation were performed through the connector. No local browser test, npm build, or Render test was performed.

## Testing requested

```txt
Open the test build.
Go upstairs.
Confirm the primary bedroom visibly exits into the upper hall.
Tap from the primary bedroom to the stairs and confirm the resident walks out.
Tap from the primary bedroom to the guest/hall bath and confirm route works.
Tap from the primary bedroom to the closet and primary bath and confirm route works.
On main floor, put the resident on the couch or front porch chair if possible.
Tap fridge or dining table and confirm he can leave the couch/chair area and go eat.
Confirm no invisible blocker traps the resident.
Confirm no boot error or blank canvas.
```

## Known risks

This is a fast rescue pass from connector access. Browser verification is required. Couches being enterable is a safer gameplay collision choice for now, but final PNG/object pathing should have explicit seat anchors instead of broad couch collision behavior.

## Follow ups

If browser still traps the actor, patch movement to automatically ignore the current overlapping furniture collider for the first move step. The preferred final design is explicit seat anchors plus object-specific exit points.
