# Apartment God Idea Bible And Rebuild Backlog

Status: ACTIVE SOURCE OF TRUTH
Purpose: preserve Kam's feature, layout, visual, animation, and behavior ideas so future chats can search the repo and rebuild the intended game direction without relying on memory.

## Pipeline rule

Every meaningful idea Kam gives must be logged here or in an append file that is later merged here. This includes ideas that are not implemented yet. Implemented ideas stay in the Bible because rebuilds, rewrites, and future branch migrations need the original intent, not just the current code.

Each entry should preserve:

1. Kam directive or close wording.
2. Target system or room.
3. Intended behavior or visual result.
4. Current implementation status.
5. Code/doc files related to the idea.
6. Follow-up gaps.

## 2026-07-13 Upstairs extension directive

Kam directive:

- Existing master bedroom/office side is good enough for now, except the small sink/vanity room basins need correct orientation. The vanity should face east and the handles should be on the west side of the sink basins.
- Shift the current primary/master side to the area above the garage.
- Build the new upstairs extension above the living room.
- Move the upstairs stairs from the primary/master side to the new upstairs section because that is where people come up from the main room downstairs.
- Add a foyer/hall that runs through the upstairs extension and connects to the shifted primary side.
- Add two bedrooms in the new upstairs extension.
- Each new bedroom must have its own clothing closet so characters can change clothes.
- Each new bedroom should have nightstands or small bedside tables.
- Each new bedroom should have a wall-mounted TV at the foot side of the bed.
- The beds should be smaller than the primary bed. If the primary is king, one new bedroom should have a full-size bed and the other should have a queen-size bed.
- Add a shared upstairs bathroom with shower, sink, and toilet.
- Research modern bathroom layout and use real architecture logic, not random square placeholders.
- Leave room upstairs for later additions, including closet/storage space.

Status:

- FIRST RUNTIME PASS IMPLEMENTED on `phaser-migration` in `src/world.js`, `src/blueprint.js`, `src/upstairsExtensionLayout.js`, and `src/rendering.js`.
- NEEDS_BROWSER_CONFIRMATION.
- Final PNG environment plates and object sprites still needed.

Code map:

- `src/world.js`: new upstairs room and object definitions.
- `src/blueprint.js`: new upstairs doorway graph and windows.
- `src/upstairsExtensionLayout.js`: runtime polish layer for stairs, bedrooms, shared bath, and east-facing vanity.
- `tests/upstairs-extension-layout.test.js`: regression coverage for stairs, two bedrooms, shared bath, vanity orientation, and doorway connectivity.

Open gaps:

- Browser test upstairs routing.
- Bathroom and sink visuals still need final PNG assets.
- Character autonomy must prefer upstairs/master bathrooms and closets when already upstairs unless there is a deliberate reason to go downstairs.
- Future multi-screen upstairs camera support may be needed if the house grows beyond one 960x720 upper floor map.

## Bathroom architecture standard

Modern bathroom layout ideas to preserve:

- A full or three-quarter bathroom must read as a planned room with sink/vanity, toilet, and shower or bath zones.
- The toilet should not sit randomly in the walkway.
- The vanity should sit on a wall/counter and read as a basin within a counter, not a blue square or mini tub.
- A shower should read as a wet zone with a glass door/panel or proper enclosure.
- Shared bathrooms should have clear fixture zones and enough open approach space.
- Primary bathrooms may use zoning, vanity foyer, wet-room area, or separated privacy zones.
- Sinks/vanities need directional logic. If Kam says a sink faces east, the handle/counter side should support that orientation and the basin should not look like a bathtub.

Status:

- FIRST RUNTIME PASS IMPLEMENTED for shared upstairs bath and primary east-facing vanity.
- NEEDS PNG ASSET PASS.

## Upstairs bathroom and closet routing directive

Kam directive:

- Characters waking upstairs or leaving the upstairs office should not automatically ignore the nearby upstairs/master bathroom and go all the way downstairs to the same toilet unless there is a conscious reason.
- Characters should use the closest logical bathroom, sink, shower, and closet based on where they are.
- Characters should use sinks after toilet/grooming activities when hygiene logic requires it.
- Characters should use closets/change clothes, not just visually skip wardrobe behavior.

Status:

- PARTIAL. Upstairs bathroom objects exist and can be selected.
- NEEDS_AI_ROUTING_PASS. A dedicated nearest-bathroom/nearest-closet preference system is still required.

## Visual quality law

Kam directive:

- The game must move toward a clean, mature top-down anime look.
- Reject old blend placeholder style.
- No crude, toy-like, blob-like, chibi, mascot, or toilet-door-looking characters.
- No isometric contamination unless explicitly requested.
- No generic object labels as substitutes for readable construction.
- PNG assets should be used. The PNG upload workaround exists, so placeholder-only excuses are not acceptable.

Status:

- PARTIAL. Runtime layers improve presentation, but many assets are still Canvas fallback.
- NEEDS_PNG_ASSET_PRODUCTION.

Related files:

- `docs/APARTMENT_GOD_TRUE_TOP_DOWN_ANIME_VISUAL_STANDARD.md`
- `apartment-god-production/OBJECT_ANIME_LIGHTING_AND_ASSET_AUDIT_2026-07-13.md`

## Time-based anime lighting directive

Kam directive:

- Lighting should have logic with sun location and time programming.
- The world should not be evenly lit at all times.
- The target is anime top-down lighting quality, not heavy photo-realistic object shading.
- Global filters and area lighting are acceptable if they create mood without ruining modular sprites.

Status:

- FIRST RUNTIME PASS IMPLEMENTED in `src/animeTimeLighting.js`.
- NEEDS_BROWSER_TUNING and future PNG light masks.

## Porch, couch, and dining directive

Kam directive:

- Front porch should use the cleaner previous layout: two chairs only, one on each side, facing outward, with a small table. No giant green blocks over stairs.
- Couch should be a proper L-shaped couch facing the TV with the L on the wall side, not the kitchen side.
- Dining should be a clean four-seat table arrangement with no old/ghosted table underneath.
- Replacements must replace old assets, not stack over them.

Status:

- FIRST RUNTIME PASS IMPLEMENTED in `src/mainFloorLayoutPolish.js`.
- NEEDS_BROWSER_CONFIRMATION and final PNG object assets.

## TV and seating state directive

Kam directive:

- TV glow should only be on when someone is watching something.
- Characters at desks/chairs must read as sitting in top-down view. The chair back should layer over part of the actor when appropriate.
- Couch sit points should land actors on cushions, not over the back of the L couch.

Status:

- FIRST RUNTIME PASS IMPLEMENTED in `src/mainFloorLayoutPolish.js` and `src/afterEntityOverlays.js`.
- NEEDS_BROWSER_CONFIRMATION.

## Sleep under covers directive

Kam directive:

- Characters should be under covers when sleeping.
- Heads must align with the body/bed orientation. Do not leave heads north/south when bodies are east/west.

Status:

- FIRST RUNTIME PASS IMPLEMENTED in `src/afterEntityOverlays.js` and `src/realismCorrectionPass.js`.
- NEEDS_BROWSER_CONFIRMATION and final sleep PNG frames.

## Dog quality directive

Kam directive:

- Dog must not look like garbage or silly cartoon.
- Dog should be true top-down with four legs, visible leg movement, collar, and better proportions.
- Dog needs a full animation identity for walk, run, rest, eat, fetch, bath, and petting.

Status:

- FIRST RUNTIME OVERLAY IMPLEMENTED in `src/afterEntityOverlays.js`.
- NEEDS_REAL_DOG_PNG_SPRITE_SHEET.

## Soccer directive

Kam directive:

- Soccer should not be a character running in a circle while the ball randomly bumps away.
- It should be an aimed kick loop like pool: run to the ball, plant, aim at goal, kick, ball travels, score or miss, reset.
- Needs real run and kick animations.

Status:

- FIRST GAMEPLAY PASS IMPLEMENTED in `src/soccerSystem.js`.
- NEEDS_BROWSER_TUNING and PNG animation frames.

## Vehicle boarding directive

Kam directive:

- One person should not open both car doors.
- The door/seat sequence should depend on who is boarding.
- Futuristic vehicles can have seats that slide or pivot out, the character sits, then the chair retracts into the car.
- Family/together activities should animate all relevant doors/seats.
- Luggage should visibly load through a rear compartment that extends/retracts.
- Bike/motorbike/ATV should have proper mounting animations.

Status:

- PARTIAL. Vehicle and bike renderer work exists, but complete state coverage remains open.
- NEEDS_FULL_STATE_PNG_SET and browser-tested boarding sequences.

## Bug audit pipeline directive

Kam directive:

- After every meaningful AI commit, there must be a bug review.
- Do not wait for Kam to point out obvious blocked movement or visual glitches.
- Audit boot safety, movement, pathfinding, object collisions, activity exits, visual overlap, animation state coverage, main sync, backups, logs, and matrix compliance.

Status:

- HOURLY automation exists.
- Repo-side test coverage is still incomplete and must be expanded.
- Every runtime pass must include log and matrix updates.

## Rebuild preservation rule

Every implemented feature must still be documented as an idea and a target. Code alone is not enough. If the game is rebuilt, this Bible should preserve the intended behavior, not only the current implementation state.
