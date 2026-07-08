# Apartment God Implementation Status

This file tracks what has been implemented versus what should remain backlog work so future scheduled AI work does not duplicate or undo existing changes.

## Implemented on phaser-migration

### Stable runtime direction

- Canvas runtime is still the playable fallback.
- Broken Phaser asset renderer is disabled until production sprites and runtime parity are ready.
- Refresh autosave restores test state without freezing old source layout definitions.
- Reset clears refresh autosave and starts fresh.

### Movement and room boundaries

- Movement checks room boundary crossings through doorway regions.
- Basement is one open basement room.
- Garage is now one open garage space instead of multiple garage rooms.
- Object collision padding was reduced so resident, girlfriend, and dog are less likely to snag on small obstacles.
- Selected character floor follow now uses `state.selectedId`, not hardcoded resident only.

### Doorway visuals

- Doorway gaps are drawn as open gaps only.
- Temporary swing arcs and unclear doorway symbols have been removed.
- Same level attached area doors are still functional as passage objects but are not drawn as fake stair symbols.

### Garage direction

- Garage is open space.
- Overhead garage door is at the bottom of the garage view.
- Family car, sports car, bicycle, motorbike, and ATV are placed in the same open garage space.
- Vehicle departure now drives downward through the garage exit.
- Vehicle return enters from the downward garage exit.

### Camera and navigation

- Same level camera transitions can render the old area sliding out while the new area slides in.
- Vertical floor changes use a quick scale and fade transition rather than a pure hard cut.
- Swipe navigation is installed on the canvas.
- Swipe up from Main moves camera to Backyard.
- Swipe left from Main moves camera to Garage.
- Swipe down from Backyard returns to Main.
- Swipe right from Garage returns to Main.
- Blueprint button opens a full screen whole house blueprint overlay.
- Blueprint overlay shows areas, rooms, and character markers.
- Tapping a blueprint region closes the overlay and moves the camera there.
- Character locator moves camera to a character without changing selected character.
- Phone, blueprint, and locator buttons are placed in the black utility strip instead of the gameplay area.

### Developer tools

- Developer money refill button exists in the HUD command panel as `Dev $`.
- The button raises money to at least $50000 for testing.

## Backlog, do not treat as done

### Blueprint upgrades

- Upgrade blueprint overlay from schematic rectangles to a prettier real estate blueprint look.
- Optionally make blueprint mode a true live mini simulation view.
- Add Front Patio as its own attached camera area.

### Door art

- Reintroduce doors only after the top down visual language is solved.
- Door should be a clean top down line and knob, not a swing arc or ambiguous symbol.
- Doors must never visually block the walkway.

### Camera follow and compound travel

- Camera should follow selected character only when the player explicitly commands that selected character to an object, room, or activity in another area.
- Autonomous movement should not drag the camera away.
- Character controlled same level passages should eventually animate door use and slide the camera as they cross.
- Drag or edge pan mode should support soft locking to nearby attached areas.

### Vehicle and travel expansion

- Improve vehicle pathing around other parked vehicles before exiting.
- Add clearer boarding animations for every vehicle type.
- Add trunk and luggage visuals with better character positions.
- Improve vacation plane flow.

### Plane travel future state

- Start above the plane on runway.
- Keep plane centered while runway background moves.
- Plane accelerates, takes off, scales toward camera, then fades through roof to interior.
- Interior plane scene supports seated characters, bathroom movement, seatbelt lights, and landing prep.
- Landing reverses the transition back to exterior top view.

### Long term world expansion

- Expand from house to neighborhood.
- Expand from neighborhood to town and city.
- Make destinations actual places, not abstract timers.
- Secret house discoveries, including possible hidden bunker and cultural artifact rooms, remain future story backlog.
