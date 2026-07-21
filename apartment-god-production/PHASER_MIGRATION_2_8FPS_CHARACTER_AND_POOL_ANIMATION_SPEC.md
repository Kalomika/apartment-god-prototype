# Phaser Migration 2, 8 FPS Character and Pool Animation Specification

Status: NEEDS_BROWSER_TESTING
Branch: phaser-migration-2
Updated: 2026-07-21

## Visual law

All active actors use mature top-down silhouettes with readable anatomy, intentional clothing masses, contact shadows, and directional movement. Walk presentation runs at 8 FPS while simulation and position updates remain continuous. A character cannot animate as walking unless world coordinates actually change.

`8 FPS` describes playback speed. It does not mean that eight frames exist. The current walk loop uses four frames per direction.

## Active sprite profiles

| Profile | Vertical directions | Side direction asset | Frames per direction | Runtime use |
|---|---:|---:|---:|---|
| Resident | South and north rows | Complete east body, mirrored for west | 4 | Resident and default adult male fallback |
| Girlfriend | South and north rows | Complete east body, mirrored for west | 4 | Girlfriend and adult female fallback |
| Lab Subject | South and north rows | Complete east body, mirrored for west | 4 | Lab Test Subject |
| Dog | South, west, east and north rows | Existing dog directional sheet | 4 | Adult shepherd mix dog |

## Directional walk identity

Entry:
The actor receives a valid route and begins changing world coordinates.

Vertical loop:
North and south movement use the corresponding directional row from the profile sheet. Frames advance at 8 FPS only while coordinates change.

Side loop:
East and west movement use a separate complete side-body sheet. The whole body axis, head, shoulders, arms, legs and shoes turn toward movement. West mirrors the east sheet. Moving only the head while leaving the body facing forward is prohibited.

Exit:
When displacement stops, the walk animation stops immediately and the actor settles on the current directional contact frame.

Fallback:
No action label may force a walk loop. If an optional side sheet is unavailable, the runtime remains playable, but that fallback is not considered visually approved.

## Wardrobe layering

The human renderer now keeps clothing color outside the baked character profile through synchronized sprite layers:

- vertical top layer
- vertical bottom layer
- side top layer
- side bottom layer

The layer color comes from `entity.wardrobe.colors[entity.wardrobe.currentDay]`. The bottom layer derives a darker coordinated color.

This is the first wardrobe layer implementation, not the final clothing system. Future authored layers remain required for:

- garment silhouette swaps
- hair styles
- hats and accessories
- shoes
- coats and outerwear
- activity-specific clothing
- sleepwear, swimwear and workout clothing

Every visible layer must share frame index, direction, position, origin, scale, depth and west/east mirroring.

## Pool activity identity

Entry:
The game freezes one shot stance for the current shooter. The shooter receives explicit waypoints outside the table collision boundary. Other players receive separate waiting stations.

Circling loop:
The actor walks through perimeter corners at the simulation movement rate while the sprite plays at 8 FPS. The route cannot cross the table. Facing follows each route leg.

Shot alignment:
At the final stance, velocity becomes zero, the walk cycle stops, the actor faces the cue ball, the cue aligns through both hands, and the line of action points toward the intended target.

Shot loop:
A short two-frame 8 FPS cue thrust plays while the cue ball and target ball receive motion. This is distinct from the walk loop.

Exit:
The shooter watches the balls settle. After the shot, turn ownership advances, the previous shooter moves to a waiting station, and the next shooter receives a new frozen stance.

Interruption:
When the activity ends or is interrupted, the pool route, cue state, velocity and activity pose are cleared before normal movement resumes.

## Test plan

1. Walk Resident east and west. Confirm the entire body turns and the west frame is a clean mirror of east.
2. Repeat with Girlfriend and Lab Subject.
3. Confirm the head does not simply lean while the torso remains forward.
4. Change wardrobe day and confirm top and bottom layer colors update while direction and animation remain synchronized.
5. Walk north and south and confirm overlays stay aligned with the base profile sheet.
6. Stop movement in every direction and confirm the walk loop stops.
7. Start pool together and confirm only the current shooter walks to the shot stance.
8. Confirm neither actor crosses through the pool table.
9. Confirm the shooter stops, faces the cue ball and visibly holds the cue before the shot.
10. Repeat at mobile scale and inspect all directions for crop, depth, flicker, duplicate bodies and layer drift.

## Approval status

The architecture and assets are committed but remain `NEEDS_BROWSER_TESTING`. They are not approved final character artwork until Kam tests them at actual game scale.
