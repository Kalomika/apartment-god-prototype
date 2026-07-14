# Ongoing Design Log Append: Entity Renderer Revert And Upstairs TV Fix Started

Status: IN_PROGRESS
Branch: phaser-migration
Runtime files changed: in progress
Render playable branch updated: no
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-entity-renderer-revert-tv-fix-2026-07-14

## Current live bug batch

Kam reported that the previous broad top-down entity renderer pass broke character presentation. The characters now look like the head points in the direction of travel with the legs trailing behind, which reads as crawling or swimming across the floor. This was not requested.

Kam clarified the actual desired scope:

- Revert character rendering back to what it was before the broad renderer change.
- Keep existing animations and seating behavior intact for now.
- The only intended walking change should be directional readability:
  - walking north/up shows the back of the head and back of the body
  - walking south/down shows the face/front of the body
- Do not rotate the entire character body into a prone/crawling orientation.

Kam also reported that the upstairs primary bedroom TV screen is still blue/on when it should not be. The last patch only narrowed the living room TV light and did not specifically fix every TV object.

## Immediate implementation scope

- Stop using the broad replacement `renderEntitiesTopDown.js` for humans.
- Return runtime rendering to the prior `renderEntities.js` animation system.
- Add a narrow TV screen corrective overlay so inactive TVs, including the bedroom wall TV, are dark unless a nearby actor is actually watching that TV.
- Keep the dog asset file and prior logs, but do not let the broken character renderer remain active.

## Deferred

- A proper final character sprite direction pass remains needed, but it must not replace functioning animation behavior with broad rotation logic.
