# Apartment God Bug Audit: Movement Egress Regression

Status: NEEDS_BROWSER_TESTING
Branch: phaser-migration
Date: 2026-07-13

## Trigger

Live mobile QA showed the selected Resident stuck in the basement near the couch with the status `Blocked` even though the room looked visually open.

## Audit scope performed in this pass

Checked:

1. Repo identity and branch discipline.
2. Required handbook, backup policy, no broad implementation rule, ongoing log, and matrix excerpts.
3. Main versus phaser-migration sync status.
4. Movement and pathfinding logic in `src/movement.js`.
5. Basement object context from `src/world.js`.
6. Activity finish flow in `src/actions.js`.
7. Recent soccer logic and Render main sync risk from the immediately previous commits.

## Bug found

The game could place or leave a character inside a solid object footprint during an activity, especially couches and other non-enterable solid furniture.

After the activity ended, movement cleared the object allowance. The next movement tried to step out, but collision logic treated the actor's next step as blocked because the actor was still inside the solid footprint. That caused the visible `Blocked` state shown in Kam's screenshot.

This was not only a basement couch issue. It was a class of bug affecting any activity that leaves an actor inside a solid non-enterable object footprint.

## Fix committed

Runtime fix:

- `src/movement.js`

Implementation details:

1. `directBlocked` now allows a route leg that starts inside a solid object footprint to move outward from that same solid.
2. `blockedStep` now distinguishes between illegal entry into a solid and legitimate egress from a solid the actor is already inside.
3. Added `movingAwayFromSolid` so the actor can move out of a solid without gaining permission to walk through unrelated objects.
4. Added `escapeTargetFromSolid` so recovery can choose a nearby open point if an actor is stuck inside furniture.
5. Recovery now attempts an object-footprint escape before giving up to `Blocked`.

Regression test added:

- `tests/movement-solid-egress.test.js`

The test places an actor inside the basement couch footprint, commands movement out, and asserts that the actor routes out instead of remaining blocked.

## Why this got missed before

The previous audits were too targeted. They inspected the reported feature area but did not run an object-exit regression audit across activity placement, solid collision, and post-activity movement.

Required future audit addition:

Every runtime change touching objects, activities, movement, visuals, or actor placement must include this question:

`Can the actor move away after the activity ends, especially if the activity pose places them on or inside a solid object footprint?`

## Remaining risks

Browser testing is required. This connector can inspect and patch code, but it did not run a live browser session.

The current test is a first regression test for the exact class of blocked issue. More cases should be added for bed, dining table, arcade, pool table, car boarding, stairs, porch chairs, and garage vehicles.

## Exact browser test requested

After Render rebuilds:

1. Open https://apartment-god-phaser.onrender.com.
2. Go to basement.
3. Send Resident to basement couch, arcade, pool table, and open floor positions.
4. Confirm Resident can leave each area and does not remain `Blocked`.
5. Test main couch and dining table.
6. Test upstairs bed wake-up and then tap an open spot.
7. Confirm no recovery screen appears.
