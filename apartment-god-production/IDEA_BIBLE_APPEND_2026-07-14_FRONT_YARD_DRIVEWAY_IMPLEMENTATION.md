# Idea Bible Append: South Front Yard Driveway Implementation

Date: 2026-07-14 CT
Branch: phaser-migration
Status: PLANNED before implementation, then update execution log after code work.
Backup branch: backup/phaser-migration-before-front-yard-driveway-2026-07-14
Runtime files changed at capture time: no
Render playable branch updated: no
Render settings changed: no

## Kam Directive

Kam asked to implement the South front yard / driveway / road slice that was previously discussed and logged.

## Exact Intent

Add a new South front property section opposite the backyard. The section should let the player view the front of the property instead of keeping car travel hidden inside the garage only.

The front section should include:

- Front yard / front lawn.
- Driveway connected to the garage exit direction.
- Pavement wide enough to imply a car can reverse out or turn.
- Bushes / front yard detail.
- Front gate or property edge.
- Road / neighborhood street across the bottom half of the new screen.
- Road markings / curb detail so the area reads as a street and not random pavement.
- Navigation path from the front section back to the garage.

## Vehicle Intent

Vehicle departures should eventually read as:

1. Exit garage.
2. Enter driveway/front property view.
3. Back out or turn into driveway.
4. Enter the road.
5. Drive offscreen.

This first implementation should create the front yard screen and make work/travel vehicles transition through it instead of only disappearing downward from the garage. If full turning animation cannot be safely implemented in one pass, document the current state as first pass, not final.

## Rules

- True top down only.
- No isometric view.
- No toy road or crude placeholder objects presented as final.
- Keep the game playable.
- Keep this on `phaser-migration` only.
- Do not update `main` or Render settings.
- If browser behavior is not tested, mark NEEDS_TESTING.
