# Apartment God Full Phaser Parity Audit

Date: 2026-07-17
Branch: phaser-migration
Status: NEEDS_RENDER_TESTING

## Decision

`phaser-migration` is now the single complete Phaser migration source. It begins from the feature rich current game and changes the boot and actor rendering architecture without deleting existing gameplay.

The previous reduced `phaser-migration-2` prototype is not the production migration source. It remains only as historical reference and backup material.

## Runtime parity

| Current game capability | Phaser parity source | Status |
|---|---|---|
| State, actors, needs, money, wardrobe, careers, calendar, saves | `src/state.js`, existing feature modules | PRESERVED, NEEDS_TESTING |
| Guided movement, running, pathfinding, object approach, blocker recovery | `src/movement.js` | PRESERVED, NEEDS_TESTING |
| Object and social actions, cooking, bathroom, sleep, cleaning, relationships | `src/actions.js` and supporting systems | PRESERVED, NEEDS_TESTING |
| Autonomy and alternate object choices | `src/autonomy.js`, `src/autoHooks.js` | PRESERVED, NEEDS_TESTING |
| Phone, interaction menus, mobile scrolling, floor and compound controls | `src/ui.js`, `src/phoneUI.js`, `src/appMenu.js` | PRESERVED, NEEDS_TESTING |
| Refresh state, save slots, reset protection | `src/saveSystem.js` | PRESERVED, NEEDS_TESTING |
| Main house, upstairs, basement, garage, backyard, front yard, driveway, lab | Existing world and rendering modules through Phaser environment texture | PRESERVED, NEEDS_TESTING |
| Current object placement, layer corrections, room polish, bed and shower foregrounds | Existing rendering and correction modules split into Phaser environment and foreground layers | PRESERVED, NEEDS_TESTING |
| Vehicle menus, boarding, occupants, departures, returns, driveway turns, gate behavior | Existing vehicle, front yard, driveway, gate, and overlay systems | PRESERVED, NEEDS_TESTING |
| Offsite activities while the remaining household stays playable | `src/offsiteOverlay.js`, existing travel actions | PRESERVED, NEEDS_TESTING |
| Pool table game, ball motion, turns, cue effects | `src/poolActivitySystem.js`, Phaser actor and foreground layers | CORRECTED, NEEDS_TESTING |
| Arcade fighter, paddle game, racer, screen and controls | `src/arcadeSystem.js` | PRESERVED, NEEDS_TESTING |
| One on one basketball, score, shots, rebounds, interruption | `src/basketballSystem.js` | PRESERVED, NEEDS_TESTING |
| Dog systems, dog interactions, dog soccer, kennel, bowl, bath | Existing dog and activity systems plus native Phaser dog sprite | PRESERVED, NEEDS_TESTING |
| Calendar, work schedules, career HUD, life quality, time and bills | Existing calendar, career, life quality, and time systems | PRESERVED, NEEDS_TESTING |
| Visible failure recovery | `src/phaserParityRuntime.js` | IMPLEMENTED, NEEDS_TESTING |

## Phaser architecture

The browser entry point now boots `bootPhaserParityGame()`.

Phaser owns:

1. The game lifecycle and frame loop.
2. Input delivery to the current interaction system.
3. Persistent Resident, Girlfriend, Lab Subject, female fallback, and Dog sprites.
4. Directional sprite animation at 8 FPS.
5. Actor depth, selection rings, contact shadows, activity transforms, and pool cue alignment.
6. Environment and foreground texture composition.
7. Visible boot and frame recovery screens.

The complete current environment and object renderer is retained temporarily as two Phaser managed compatibility textures:

1. Environment and object layer below native actors.
2. Foreground, lighting, blanket, shower, carried item, arcade, basketball, and HUD layer above native actors.

This is intentional. It preserves the complete playable game first instead of deleting systems during conversion. Individual rooms, objects, effects, and activities can later move from the compatibility textures into native Phaser objects one audited system at a time.

## Character and animation law

All active character profiles use full 512 by 512 directional sheets with four rows and four frames per direction.

Frame rate: 8 FPS.

Directions: south, west, east, north.

Profiles:

1. Resident and adult male fallback.
2. Girlfriend, Lab Test Woman, and adult female fallback.
3. Lab Test Subject.
4. Adult shepherd mix Dog and dog fallback.

A walking label cannot start the walk cycle. The sprite must have measurable world coordinate displacement. Treadmill and swimming are explicit activity exceptions because locomotion occurs while the actor remains aligned to an object or water lane.

## Pool correction

Entry:
The current shooter receives one frozen stance and the other actor receives a separate waiting station.

Circle:
The actor moves through explicit perimeter waypoints outside the table boundary. World coordinates, velocity, heading, and sprite direction all change together.

Alignment:
The actor stops at the stance, faces the cue ball, and aligns the cue through both hands.

Shot:
The cue thrust, cue ball, target ball, pockets, rebounds, and turn ownership update.

Exit:
The previous shooter moves to a waiting station and the next shooter receives a new stance. Interrupted or completed pool state clears route, velocity, cue, and activity pose.

## Promotion blockers

Before this branch is accepted as the permanent Render build:

1. Repository check must pass.
2. Unit tests must pass.
3. Static build must pass and include Phaser vendor output.
4. The game must boot without a recovery screen.
5. Mobile input, phone menus, and interaction menus must work.
6. All floors and compound areas must remain reachable.
7. Resident, Girlfriend, Lab Test Subject, Lab Test Woman, Dog, and Lab Test Dog must display and move correctly.
8. Pool must show actual circulation, stance, cue alignment, shots, waiting positions, and turn changes.
9. Vehicles, offsite activities, arcade, basketball, saves, reset, autonomy, and basic life actions must remain functional.
10. Kam must approve the game scale, character direction, dog, movement cadence, and feature parity.
