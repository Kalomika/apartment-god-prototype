# Development Matrix Patch, Layering, Vehicle Motion, Arcade, Offsite, and Basketball

Date: 2026-07-16
Branch: phaser-migration
Status: NEEDS_TESTING
Canonical merge pending: yes

## System Matrix Additions

| System | Status | Source Of Truth | Current Direction | Required Test |
|---|---|---|---|---|
| Main floor render ordering | NEEDS_TESTING | src/rendering.js, src/mainFloorLayoutPolish.js | Destructive floor clears were removed. Dining table and sink geometry were moved to non overlapping positions. The old layer correction overlay is no longer called. | Dining table, chairs, wall, kitchen appliances, coffee table, and sink stay readable in all activity states. |
| Duplicate time display | NEEDS_TESTING | src/rendering.js, calendar HUD | Canvas status no longer prints time. Calendar pill remains the single date and time display. | Confirm only one clock is visible on mobile and desktop. |
| Pool activity movement | NEEDS_TESTING | src/poolActivitySystem.js, src/actions.js, src/renderEntities.js | Frozen turn stance, separate waiting station, table corner paths, ball settle check, and one shooter per turn are committed. | Two players circle table, line up, shoot, wait, and do not jitter. |
| Dog visual | NEEDS_TESTING | src/dogSpriteOverlay.js, assets/sprites/characters/dog/top_down_dog_atlas.svg | Four direction vector dog with head, ears, shoulders, torso, hips, feet, tail, and faint ground shadow is committed. | Review anatomy, scale, orientation, and mobile readability. |
| Driveway gate and garage alignment | NEEDS_TESTING | src/frontYardDriveway.js, src/frontYardRoutingCorrection.js, src/gateTraversalGuard.js, src/garageDoorAlignmentOverlay.js | Garage opening and driveway share a center. Gate animates. Vehicles wait for opening. Pedestrian crossing is restored until open. Porch, yard, driveway, and road route links are added. | No person, dog, car, bike, motorbike, or ATV crosses a closed gate. Test both directions. |
| Character grounding | NEEDS_TESTING | src/renderEntities.js, src/dogSpriteOverlay.js | Human top down shadows were retained and dog shadow added. | Shadow separates actors from floor without isometric tilt or excessive darkness. |
| Panic room entrance | NEEDS_TESTING | src/panicRoomCorrection.js, src/runtimeObjectCorrections.js | Door moved to upper hall boundary and hall to panic room doorway added. | Door reads from hall, remains clickable, and actor reaches it from corridor. |
| Arcade mini games | NEEDS_TESTING | src/arcadeSystem.js, src/config.js, src/rendering.js | Neon Fighter, Orbit Pong, and Night Racer simulations are committed with score or progress, visible controls, actor hands, and spectator screen. | Test each menu choice, hands, controls, game loop, score reset, and mobile screen placement. |
| Vehicle physical departure | NEEDS_TESTING | src/vehicleSystem.js, src/frontYardDriveway.js, src/vehicleOccupantOverlay.js | Cars reverse, wait for gate, steer into road, rotate horizontal, and exit nose first. Small vehicles push out, steer, mount, ride through gate, turn into road, and exit. Car occupants remain visible on driveway. | Test every vehicle leaving and returning without sideways sliding, in place pivoting, or invisible occupants. |
| Offsite non blocking play | NEEDS_TESTING | src/offsiteOverlay.js, src/rendering.js, src/travelLocations.js, src/canvasRuntime.js | Fullscreen offsite scene is removed from the main draw path. Compact progress overlay and visible home actor selection are committed. | Start an errand and continue selecting, moving, and assigning the person at home until return. |
| Basketball one on one | NEEDS_TESTING | src/basketballSystem.js, src/frontYardDriveway.js, src/config.js, src/canvasRuntime.js | Court, score, dribble, shot selection, two and three point scoring, layup, dunk, misses, rebound destinations, loose ball pursuit, possession, win condition, and interruption are committed. | Play a full game through makes, misses, backboard and rim rebounds, loose balls, completion, urgent need interruption, and manual interruption. |
| Regression test coverage | NEEDS_TESTING | tests/layer-vehicle-games-regression.test.js | Tests were added for gate blocking, gate opening, offsite home selection, pool shot stance, arcade registration, and basketball registration. | Run npm test and npm check. |

## Object Matrix Additions

| Object | Area | Status | Current Behavior | Required Test |
|---|---|---|---|---|
| Dining table and chairs | Main floor | NEEDS_TESTING | Moved above room wall boundary and redrawn without floor erasure. | Test idle, meal, TV glow, and room changes. |
| Kitchen sink | Kitchen | NEEDS_TESTING | Dedicated right counter position and west facing approach. | Test sink menu, route, appliance separation, and no duplicate sink image. |
| Garage overhead door | Garage and driveway | NEEDS_TESTING | Width and center aligned with driveway lane through final overlay and runtime geometry correction. | Compare garage view and driveway mouth at mobile scale. |
| Driveway gate | Driveway | NEEDS_TESTING | Animated opening request, vehicle wait, pedestrian traversal guard. | Test closed collision, opening delay, crossing, and close after clearance. |
| Arcade machine | Basement and lab | NEEDS_TESTING | Hands on controls, three game choices, miniature screen, score and progress. | Test solo and together actions. |
| Basketball court | Front yard side | NEEDS_TESTING | Larger one on one court with hoop, paint, arc, scoring system, and loose ball bounds. | Test click target, actor arrival, full court use, and nearby compound rebound retrieval. |
| Panic room door | Upstairs hall | NEEDS_TESTING | Horizontal steel door at hall boundary. | Test approach, click menu, and visual orientation. |

## Animation Matrix Additions

| Animation | Status | Current Implementation | Required Test |
|---|---|---|---|
| Pool shot walk around | NEEDS_TESTING | Shooter paths around table corners to frozen stance, aims, shoots, watches balls, and yields turn. | Confirm no jitter, overlap, or instant side switching. |
| Arcade fight game | NEEDS_TESTING | Health, rounds, attacks, joystick and button hand motion. | Confirm visible hit and health changes. |
| Arcade paddle game | NEEDS_TESTING | Paddle tracking, ball collision, score to five, reset. | Confirm ball stays in mini screen and score changes. |
| Arcade race game | NEEDS_TESTING | Track motion, steering input, two cars, laps, race reset. | Confirm orientation and lap progression. |
| Car reverse and road turn | NEEDS_TESTING | Reverse straight, gate wait, curved road merge, horizontal road acceleration. | Confirm body rotation follows path and car never slides sideways. |
| Bike and ATV reposition | NEEDS_TESTING | Push out, steering cue, mount, ride, gate passage, road turn. | Confirm movement is an arc, not a pivot in place. |
| Basketball dribble | NEEDS_TESTING | Timed ball bounce follows offensive player during drives and reset. | Confirm hand and ball timing reads at game scale. |
| Basketball shot set | NEEDS_TESTING | Two, three, layup, dunk, make, miss, backboard and rim result states. | Confirm all shot types appear across a full game. |
| Basketball rebound chase | NEEDS_TESTING | Ball lands in surrounding compound bounds and both players pursue it. | Confirm ball can leave court area and possession changes after pickup. |
