# Ongoing Design Log Append, Workout Delivery Audit

## 2026-07-24, Staged Workout Delivery Regression Audit

Status: NEEDS_TESTING
Branch: repair/workout-delivery-audit-2026-07-24
Source branch: phaser-migration
Backup branch: backup/phaser-migration-before-workout-delivery-audit-2026-07-24
Render playable branch updated: no
Render settings changed: no

New source work inspected:

- src/economy.js staged food and workout delivery flow
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-23_1900_CT_WORKOUT_DELIVERY.md
- apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-23_WORKOUT_DELIVERY.md
- current studio governance, Idea Bible, reference, matrix, backup, build, test, and Render instructions
- active PRs and other agent branches

Verified regressions:

1. Workout installation began immediately at the front door after exchange. The actor was never routed to the living room installation point, while the courier visual jumped to that point.
2. A delivery could be ordered by an actor on another floor. `commandMove` only routes on the actor's current floor, so the resident could walk to unrelated coordinates upstairs while the courier appeared on floor 0.
3. An in-progress delivery continued for a hidden or offsite receiver, allowing invisible actors to receive, carry, eat, or install items.
4. Failed front-door or installation routing did not prevent the purchase flow from continuing visibly.

Repairs:

- Delivery ordering now requires a visible receiver on the delivery floor.
- Front-door routing must produce a valid path before money is charged or delivery state is created.
- Workout delivery now enters a `moving_to_install` phase after the doorway exchange.
- The actor visibly carries boxes to the living room before installation begins.
- Installation begins only after the movement path completes.
- Failed installation routing cancels safely, closes the door, clears carrying and action timers, and does not create the workout object.
- Hidden, offsite, or wrong-floor receivers cancel the active delivery safely.
- Added behavioral regression tests for receiver availability, movement-before-installation, and cancellation cleanup.

Browser testing required:

1. Order workout gear from a visible resident on the main floor.
2. Confirm one $220 charge, front-door approach, courier arrival, door opening, exchange, door closure, box carrying, living-room movement, installation timer, then object creation.
3. Attempt ordering from upstairs and confirm no charge or delivery is created.
4. Make the receiver unavailable during arrival or exchange and confirm the delivery clears, the door closes, and no object appears.
5. Block the route to the installation point and confirm cancellation rather than teleportation.
6. Save and reload during arrival, exchange, movement, and installation, then verify exact phase continuity.
