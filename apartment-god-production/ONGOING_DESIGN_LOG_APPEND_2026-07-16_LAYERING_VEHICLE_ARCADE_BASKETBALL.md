## 2026-07-16, Layering, Vehicle Motion, Arcade, Offsite, and Basketball Correction Batch

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: runtime implementation range 3aadba5d1d34c20c937fdacdf874792c2e2ae42f through 76f2a3aadcf1b9f393c1c351f90f71ad55223275, regression test 1c76ea83720075f94434f9f4eab6f340c515069f
Files changed: src/mainFloorLayoutPolish.js, src/poolActivitySystem.js, src/arcadeSystem.js, src/basketballSystem.js, src/frontYardDriveway.js, src/frontYardRoutingCorrection.js, src/gateTraversalGuard.js, src/offsiteOverlay.js, src/panicRoomCorrection.js, src/garageDoorAlignmentOverlay.js, src/runtimeObjectCorrections.js, src/rendering.js, src/canvasRuntime.js, src/main.js, src/config.js, src/dogSpriteOverlay.js, src/vehicleOccupantOverlay.js, assets/sprites/characters/dog/top_down_dog_atlas.svg, tests/layer-vehicle-games-regression.test.js, and production append files
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-layering-vehicles-minigames-basketball-2026-07-16

Summary:
Implemented a bounded correction pass for the main floor layer collisions, duplicate time display, pool table jitter, dog anatomy, garage and driveway alignment, driveway gate behavior, panic room door orientation, arcade interaction and mini games, vehicle departure motion, offsite play continuity, porch routing, and one on one basketball.

Implementation details:
- Removed destructive main floor cleanup rectangles that were painting floor over the dining table, chairs, wall boundaries, and kitchen objects. Repositioned the dining table above the room boundary and moved the sink to a dedicated right counter position.
- Removed the second canvas clock so the calendar pill remains the single date and time display.
- Reworked pool turns around frozen shot stations. The shooter walks around the table to line up, the opponent waits at a separate station, and the next turn does not begin until balls settle.
- Replaced the dog atlas with a four direction vector dog that has a readable head, ears, shoulders, chest, torso, hips, four feet, and tail. Added a faint dog ground shadow and reduced the old bobbing effect.
- Added a faint existing human grounding shadow audit and retained the top down shadow layer in the human renderer.
- Aligned the garage overhead opening and driveway lane around the same center. Added staged car reversing, steering arcs, road alignment, and nose first road departure. Added small vehicle push out, front wheel steering cue, mount, gate passage, road turn, and horizontal exit.
- Added an animated driveway gate. Vehicle phases wait for the gate to open. A traversal guard restores pedestrian movement when a person tries to cross a closed gate, then allows the same path after the gate opens.
- Connected the main porch, front yard, court, driveway, and road route graph and moved the main front yard transition inside the porch room so it can be reached.
- Reoriented the panic room door to the upper hall boundary and added the hall to panic room doorway connection.
- Added three arcade simulations, Neon Fighter, Orbit Pong, and Night Racer. The arcade overlay shows a nearby game screen and actor arms and hands following joystick and button input.
- Replaced the global blank offsite scene with a compact progress bar. When the selected traveler is hidden, selection and camera return to a visible home actor so the house remains playable.
- Added a larger one on one basketball court and a dedicated basketball state machine with score, dribbling, two point shots, three point shots, layups, dunks, misses, backboard and rim rebounds, loose ball pursuit, possession changes, win conditions, urgent need interruption, and manual interruption.
- Added distinct basketball action overlays for dribbling, defensive stance, shot contests, two point and three point releases, layups, dunks, and rebound reaches. Player headings now follow the drive, opponent, and hoop direction.
- Added regression tests covering closed and open gate crossing, offsite home selection, pool shot stance, arcade actions, and basketball action registration.

Testing performed:
Verified by code inspection and GitHub branch comparison. Local syntax checks were performed on key renderer and driveway drafts before commit. A Vitest regression file was added, but the full repository test, build, mobile browser, and Render behavior were not executed in this chat.

Testing requested:
On phaser-migration, test boot and Reset first. Then test the main floor dining table, chairs, room wall, and sink at several activity states; pool solo and together for several turns; dog movement in four directions; human and dog shadows; upstairs panic room approach; all three arcade games; SUV, convertible, bicycle, motorbike, and ATV departures and returns; closed gate pedestrian crossing; porch and driveway transitions; a full errand while controlling the remaining home actor; and a full one on one basketball game through makes, misses, rebounds, loose balls, scoring, completion, and interruption.

Known risks:
This is committed runtime work without browser verification. The basketball opponent currently enters the isolated front yard test floor through a controlled placement fallback because the broader compound transition animation is not yet a complete walk through every screen. Arcade games are playable simulation loops inside the existing activity system, not standalone player controlled commercial games. The new vector dog still needs visual approval at mobile scale. Main remains untouched, so the current Render URL will not show this branch until Kam explicitly requests a main update.

Follow ups:
Run npm check, Vitest, build, and mobile browser testing in an environment with repository execution access. Correct any live path, scale, or render ordering issues found. Merge this append into the canonical ongoing log during the next safe documentation sync.
