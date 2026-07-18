# Development Matrix Patch, Full Phaser Regression Repair

Date: 2026-07-18
Branch: work/full-phaser-regression-repair-2026-07-18
Status: NEEDS_TESTING
CI: Phaser Parity CI run 29640067132 passed

## Mobile Playfield
Status: NEEDS_TESTING

Implemented:
- Mobile display height is calculated from the 4:3 game width.
- Canvas and wrapper align at the top instead of being centered inside a fixed half-screen container.
- HTML canvas dimensions now match the 960 by 720 Phaser playfield.

Required Render test:
- Entire floor visible.
- Bottom rooms and toilet tappable.
- Control bar does not cover the game canvas.
- No large blank band above the floor.

## Resident And Girlfriend Directional Walk
Status: NEEDS_TESTING

Implemented:
- Four directional 8 FPS rows retained.
- Each frame is a complete single body.
- Arms and legs change position between frames.
- Old complete-body plus extra-limb construction removed from the active Resident and Girlfriend sheets.

Required Render test:
- North, south, east, and west travel.
- Legs alternate rather than slide.
- No extra stiff arms remain.
- Character direction matches travel direction.

## Dog Sprite
Status: NEEDS_TESTING

Implemented:
- Active dog sheet uses one body and one set of four legs per frame.
- Additional inherited leg drawings removed.
- Directional 8 FPS rows retained.

Required Render test:
- One dog only.
- No overlapping second head/body/legs.
- Walk animation readable in four directions.

## Beds And Timed Activities
Status: NEEDS_TESTING

Implemented:
- Sleep placement uses the active bed and separate resident/girlfriend lanes.
- Sleep rotation follows the bed headboard.
- Bed making receives a specific motion override.
- Timed actions receive a Phaser progress bar driven by actionT and actionTotal.

Required Render test:
- Resident and Girlfriend face the correct bed direction.
- Bed making visibly moves and shows progress.
- Other timed activities show progress without obscuring the actor.

## Arcade
Status: NEEDS_TESTING

Implemented:
- Normal arcade gameplay renders on the cabinet's own angled screen.
- Cabinet rebuilt as a dedicated top-down form with screen hood, control deck, joystick, and buttons.
- Room-covering arcade overlay removed from normal autonomous play.
- Double tapping an active arcade cabinet opens an expanded playable view.
- Expanded view includes movement area, A/B buttons, and close control.

Required Render test:
- Cabinet screen shows selected mini-game.
- Character aligns with cabinet controls.
- Single tap retains ordinary object interaction.
- Double tap opens expanded view.
- Touch controls affect fighter, pong, or racing input.
- Close control returns to house.

## Pool Table
Status: NEEDS_TESTING

Implemented:
- Default rack outline now has apex toward the cue ball and wide base away from it.
- Ball rows follow the corrected rack direction.

Required Render test:
- Triangle and ball rack face the same direction.
- Existing pool stance, perimeter movement, cue, and ball physics remain functional.

## Main Floor Layer Cleanup
Status: NEEDS_TESTING

Implemented:
- Dining region is cleared before one authoritative table/chair set is redrawn.
- Served plates are redrawn from runtime meal state.
- Kitchen sink is restored as a diagonal inward-facing corner sink.

Required Render test:
- No old dining table or chairs remain under the current set.
- Actors align with visible chairs.
- Sink hitbox and visible position agree.

## TV And Laptop
Status: NEEDS_TESTING

Implemented:
- Wall TVs receive a perspective trapezoid frame and visible screen content.
- Vertical bedroom TV is rotated into the same wall-screen construction.
- Desk receives a tilted visible laptop screen, keyboard base, and readable screen content.

Required Render test:
- TV does not read as a plain blue block.
- Bedroom TV orientation remains correct.
- Laptop reads as an open computer rather than a rectangle.

## Native Phaser Status
Status: PARTIAL

Honest state:
- Runtime, scene lifecycle, actors, character animation, input, progress graphics, and correction overlays use Phaser.
- Environment and foreground still include compatibility-canvas textures.
- Do not mark every object as converted to a native Phaser sprite.
- Continue conversion by tested object family after parity is verified.
