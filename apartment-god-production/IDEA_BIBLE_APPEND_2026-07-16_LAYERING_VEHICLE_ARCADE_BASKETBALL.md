# Apartment God Idea Bible Append, Layering, Vehicle Motion, Arcade Games, and Basketball

Date: 2026-07-16
Branch: phaser-migration
Status: PLANNED AND IN EXECUTION
Canonical merge pending: yes

## Current User Directive

Kam reviewed the Render mobile build and reported the following required corrections and additions:

1. Fix main floor layer ordering. The dining table must not cover walls, kitchen floor correction passes must not cover the dining table, and the kitchen sink must not be layered on top of another object.
2. Remove the duplicate time display. Keep the calendar and clock pill as the primary date and time display and remove the second canvas time strip.
3. Pool table play must not jitter. Players must move around the table to distinct shot positions and visibly take shots from different sides.
4. Replace the current dog shape with a more anatomically believable true top down dog, with a readable head, shoulders, torso, hips, legs, and tail. It must not look crude, mascot like, or blob like.
5. Align the garage overhead door with the driveway garage opening.
6. The driveway gate must visibly open before people or vehicles exit. Characters and vehicles must not pass through a closed gate.
7. Add a faint grounded shadow beneath characters so they separate from the floor without becoming isometric.
8. Reorient the upstairs panic room door so it faces the foyer or hall corridor, unless the bathroom entry is intentionally treated as a hidden secret door.
9. Arcade use must show hands operating the controls. Add a nearby miniature gameplay screen for spectators. Build three distinct playable simulation games: a fighting game, Pong or an equivalent paddle game, and a racing game. A Space Invaders style game is acceptable as an additional option.
10. Vehicle departure must use physically readable movement. Cars reverse from the garage, the gate opens as they approach, the car arcs into the horizontal road, rotates into road direction, and drives out nose first. It must never slide sideways while remaining vertically oriented.
11. Bike, motorbike, and ATV departure must not pivot in place. The rider should reposition or push the vehicle through an arc, front wheel or wheels steer, the vehicle faces the driveway gate, the gate opens, the rider mounts, travels to the road, turns into the road, becomes horizontal, and exits.
12. Offsite errands and other trips must not lock the player on a blank offsite screen. The activity progress may remain at the top, but the rest of the house must remain playable, selectable, and visible while a character is away.
13. Align the porch door with the path to the south porch or front yard screen.
14. Enlarge and reposition the basketball court into the side of the compound with the most usable space.
15. Build a continuous functional one on one basketball game with scoring, dribbling, three point shots, two point shots, layups, misses, dunks, backboard and rim rebounds, loose ball retrieval across the surrounding compound, possession changes, game completion, interruption by urgent life priorities, and direct player interruption.

## Production Interpretation

This batch spans renderer order, world geometry, object interaction animation, pathing, offsite state, vehicle motion, mini games, sports simulation, and character art. Work must remain on phaser-migration, preserve boot and playability, and keep main untouched unless Kam explicitly asks for the Render playable branch to be updated.

## Required Layer Model

The affected scenes should resolve in this order:

1. Floor and room underlay.
2. Permanent walls and doorway openings.
3. Furniture and solid object base.
4. Characters and activity props.
5. Foreground object parts, such as table rims, arcade controls, car glass, gates, and doors.
6. Gameplay overlays and miniature game screens.
7. Lighting.
8. HUD and phone UI.

No floor cleanup pass may be allowed to erase a wall, table, chair, appliance, character, or active prop after it has been drawn.

## Testing Requirement

All work remains NEEDS_TESTING until browser verified. The Render URL is not to be changed or redeployed in this pass.
