# Phaser Migration 2, 8 FPS Character and Pool Animation Specification

Status: NEEDS_TESTING
Branch: phaser-migration-2
Date: 2026-07-17

## Visual law

All active actors use mature, true top down silhouettes with readable anatomy, intentional clothing masses, contact shadows, and directional movement. The walk presentation runs at 8 FPS while simulation and position updates remain continuous. A character cannot animate as walking unless the world coordinates actually change.

## Active sprite profiles

| Profile | Directional rows | Frames per direction | Runtime use |
|---|---:|---:|---|
| Resident | South, west, east, north | 4 | Resident and default adult male fallback |
| Girlfriend | South, west, east, north | 4 | Girlfriend and adult female fallback |
| Lab Subject | South, west, east, north | 4 | Lab Test Subject |
| Dog | South, west, east, north | 4 | Adult shepherd mix dog |

## Standard walk identity

Entry:
The actor receives a valid route and begins changing world coordinates.

Loop:
The renderer measures actual movement between frames, resolves the dominant direction, and plays the matching four frame loop at 8 FPS.

Exit:
When displacement stops, the walk animation stops immediately and the actor settles on the directional contact frame.

Fallback:
No action label may force a walk loop. A label such as Circling Table without coordinate movement must display a stationary frame, never running in place.

## Pool activity identity

Entry:
The game freezes one shot stance for the current shooter. The shooter receives explicit waypoints outside the table collision boundary. Other players receive separate waiting stations.

Circling loop:
The actor walks through perimeter corners at the simulation movement rate while the sprite plays at 8 FPS. The route cannot cross the table. Facing follows each route leg.

Shot alignment:
At the final stance, velocity becomes zero, the walk cycle stops, the actor faces the cue ball, the cue aligns through both hands, and the line of action points toward the intended target.

Shot loop:
A short two frame 8 FPS cue thrust plays while the cue ball and target ball receive motion. This is distinct from the walk loop.

Exit:
The shooter watches the balls settle. After the shot, turn ownership advances, the previous shooter moves to a waiting station, and the next shooter receives a new frozen stance.

Interruption:
When the activity ends or is interrupted, the pool route, cue state, velocity, and activity pose are cleared before normal movement resumes.

## Test plan

1. Start pool together with both actors on the same side of the table.
2. Confirm only the current shooter walks to the shot stance.
3. Confirm every foot cycle corresponds to visible world displacement.
4. Confirm neither actor crosses through the pool table.
5. Confirm the waiting actor reaches a different station and stops.
6. Confirm the shooter stops walking, faces the cue ball, and visibly holds the cue with both hands.
7. Confirm the cue and balls move during the shot.
8. Confirm the next turn causes purposeful station changes rather than jitter or running in place.
9. Repeat at mobile Render scale and inspect all four directions.
10. Inspect Resident, Girlfriend, Lab Subject, and Dog movement for adult proportions, readable silhouettes, contact shadows, and no mascot or bathroom sign appearance.
