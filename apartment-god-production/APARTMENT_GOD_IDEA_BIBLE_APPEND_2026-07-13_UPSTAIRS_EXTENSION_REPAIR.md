# Idea Bible Append: Upstairs Extension Repair And Audit Failure

Status: ACTIVE_APPEND_PENDING_CANONICAL_MERGE
Date: 2026-07-13

## Audit failure admission

The previous upstairs extension pass was incorrectly marked as implemented from a code checklist perspective. It was not a successful intent-match implementation.

What failed:

- The master section was crammed into the same visible map instead of being treated as a shifted master section above the garage.
- The foyer extension into the master side did not read clearly.
- The player view made the upstairs feel like a maze.
- A direct readable path into the primary/master side was not obvious to Kam while testing.
- The true multi-screen slide/pull master-over-garage behavior was not implemented.

New rule from this failure:

An upstairs extension audit must verify the actual game view against Kam's design intent, not only that rooms, objects, and doorways exist in code.

## Immediate repair definition

The emergency repair pass must restore playability and readable access:

- Stairs stay in the new upstairs section.
- Full and queen bedrooms remain in the new extension section.
- Shared bath remains in the new section.
- A direct upper foyer connector must visibly and pathing-wise connect the extension side to the primary suite side.
- Primary bedroom, office/library, suite foyer, walk-in closet, and master bath must be reachable from the new section.

Status:

- FIRST REPAIR PASS IMPLEMENTED in `src/blueprint.js`, `src/upstairsExtensionLayout.js`, and `tests/upstairs-extension-layout.test.js`.
- NEEDS_BROWSER_CONFIRMATION.

## True final design remains pending

The intended final version is still:

- A real extension above the living-room side.
- A shifted master section above the garage side.
- A proper foyer/hall extension that connects both sections like actual house architecture.
- Potential multi-screen camera support where the master side can slide/pull into shot or otherwise be accessed cleanly without cramming the entire upstairs into one cramped screen.
- Final PNG room plates/object assets, not procedural patches.

Status:

- PLANNED.
- Not complete until browser view, camera/navigation, and movement prove the master side is reachable and architecturally clear.
