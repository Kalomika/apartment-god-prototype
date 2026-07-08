# House Compound, Camera, Navigation, and Secret Ideas

## Main playable direction

Apartment God should treat the home like one connected household compound, not disconnected floors.

Main vertical movement:

- Main floor to upstairs through the stairwell.
- Main floor to basement through the basement door or stairwell.
- Upstairs back down to main floor.
- Basement back up to main floor.

Same level attached areas:

- Backyard is attached to the main floor, reached through a back door.
- Garage is attached to the main floor, reached through the foyer or entry side door.
- Front patio is attached to the main floor, reached through the front door.

Compass lock:

- Backyard is north, above Main House.
- Garage is west, left of Main House.
- Garage overhead exit faces downward, toward the front of the house.

These attached areas should use slide or pan transitions rather than feeling like arbitrary floors.

## Floating controls

The game should have three small persistent utility controls:

1. Cell phone.
2. Blueprint.
3. Character locator.

Current design direction:

- Place phone, blueprint, and character locator in the black utility strip.
- Keep Up and Down on the right edge of the play screen, not in the black strip.
- Keep utility buttons in a row with enough spacing that a thumb does not accidentally tap the wrong one.
- Keep them slightly translucent.
- Do not place utility buttons over the main swipeable play area unless there is no alternative.

## Blueprint behavior

The blueprint button should behave like the phone button but should open into a full game screen blueprint mode.

Expected behavior:

- Tap the small blueprint button.
- A full screen blueprint overlay covers the game view.
- An X button closes the blueprint and returns to the normal view.
- The overlay shows the whole household compound at once.
- It can show Main House, Upstairs, Basement, Garage, Backyard, and later Front Patio.
- Each floor or area is shown as a mini real estate style schematic.
- Small household markers show where the characters currently are.
- This becomes another way to find characters without searching every room manually.
- Tapping a room or region closes the blueprint and moves the camera view there.
- Tapping a person marker closes the blueprint and moves the camera to that person without selecting them.
- The blueprint can later become a true live shrink of the whole renderer.

Current practical implementation:

- The blueprint overlay shows schematic rooms and character heads.
- It is not yet a true live shrink of the renderer.
- Later it can become a live mini simulation view.
- The visible blueprint grid must keep Garage west and Backyard north.

## Character locator behavior

The character locator button should not change the selected character.

Expected behavior:

- Tap the locator button.
- It opens a panel with heads or icons for every visible household member in the compound.
- Tap a character icon.
- The camera moves to wherever that character currently is.
- The selected playable character remains unchanged.

This is for finding people, not selecting them.

## Camera follow rules

The camera should follow the selected character only when the player explicitly gives a command that sends that character to another area.

Examples that should follow the selected character:

- Player commands the selected character to use the pool.
- Player commands the selected character to play soccer.
- Player commands fetch in the yard.
- Player commands an object or activity in another attached area or floor.

Examples that should not force follow:

- Autonomous wandering.
- Another household member moving on their own.
- Player manually uses the blueprint to inspect another room.
- Player uses locator to find someone without selecting them.

## Same level camera movement target

Same level attached areas should feel like the camera is moving through one compound.

Pull swipe controls:

- This must feel like pulling the world into view, not pushing the camera.
- Swipe down from Main House to pull Main down and reveal Backyard from the north.
- Swipe right from Main House to pull Main right and reveal Garage from the west.
- Swipe up from Backyard to pull Yard up and reveal Main House from the south.
- Swipe left from Garage to pull Garage left and reveal Main House from the east.
- The swipe moves only the camera. Characters do not move unless commanded.

When the player uses the blueprint to move between same level areas:

- Main House to Backyard should slide with Backyard entering from the north.
- Main House to Garage should slide with Garage entering from the west.
- Garage to Backyard should eventually route visually through the correct connection, or wait until an exterior pathway is built.

When the selected character uses a connected same level door:

1. Character walks to the door.
2. Door opens.
3. Character passes through.
4. The screen slides to the attached area.
5. The character appears just outside the matching door.
6. Door closes.

Same level connected areas should feel like one large compound camera, not separate teleport floors.

## Garage layout target

The garage is a single open space, not a set of rooms.

Rules:

- All vehicles should be in one open garage area.
- The garage is west of the main house.
- The garage overhead exit faces downward toward the front of the house.
- Cars, bikes, motorbikes, and ATVs should be able to route around each other and leave through the same downward garage opening.
- Do not create side rooms that trap vehicles or make their exit path visually impossible.

## Doorway visual target

For now, doorways should be open gaps only.

Backlog target for better doors:

- A top down door can be a simple thin line with a knob.
- Door visuals should never imply a blocked doorway.
- Do not draw swing arcs or unclear doorway symbols until the top down door language is solved.

## Vertical camera transition target

Vertical floor changes should not feel like a hard teleport.

Going upstairs:

- The next floor appears slightly large and transparent.
- It quickly shrinks into position while becoming solid.
- This suggests the camera moved through the floor and settled upstairs.

Going downstairs:

- The current layer pushes closer, fades, or dematerializes.
- The lower layer becomes visible and solid.

This transition should be quick, more like a snap with visual continuity than a slow cinematic.

## Future pan and edge movement

Later, tapping or holding a wall, dragging, or moving the mouse to an edge can enter a free roam camera mode.

Target behavior:

- Drag or edge pan to slide across attached same level areas.
- Soft lock to the nearest room or area when the drag stops.
- Do not make the lock so harsh that it fights the player.
- Preserve direct tap controls for testing.

## Vehicle and travel camera future

Long term, the camera itself should feel like a character in the game.

Future driving target:

- Once a character enters a car, the camera can lock to the car.
- The world can move underneath the car in a top down old school Grand Theft Auto style.
- The house can eventually expand to a neighborhood, then a town, then a city.
- Destinations like the mall, theater, jobs, and other buildings should become actual spaces over time.

Future plane travel target:

- Vacation should feel like a major event.
- Start above the plane on the runway.
- Keep the plane centered while the runway background moves.
- The plane accelerates and takes off upward.
- As it rises, it scales closer to the camera, fades, and transitions through the roof into the plane interior.
- Inside the plane, characters sit in seats, can potentially move to the bathroom, and later return to seats for landing.
- Seatbelt lights can turn on before landing.
- Landing reverses the move, transitioning from the interior back to the top view of the plane landing on the runway.

This is future state. House mechanics remain the current priority.

## Health collapse and ambulance future

Needs at zero should have consequence in the real game.

Future target:

- If a character stays at zero on critical needs for a defined amount of time, they collapse.
- If the condition persists, an ambulance sequence begins.
- Two paramedics arrive through the front door.
- The paramedics pick the character up, put them on a stretcher, and carry them out.
- The character is removed from the house for a recovery period.
- In a normal realism mode, recovery can take days or a week.
- If other household members remain, the player can continue as them.
- If the entire household is gone, the house becomes unplayable until someone returns, unless the player starts a new household or chooses a less punishing mode.

Current priority:

- Developer Reset must always restore a fresh playable test state immediately.
- Health collapse and ambulance are not active yet.

## Developer testing tools

Developer or test mode should include a money refill button so expensive actions can be tested without grinding.

Rules:

- Do not make normal money infinite.
- Keep a manual developer refill button for testing only.
- The real game should not expose that button in production.

## Current implemented checkpoint

Implemented on `phaser-migration` so scheduled follow up work should not redo these as new work:

- Refresh test autosave keeps character positions across refresh.
- Reset now arms a reset guard so beforeunload cannot re-save the depleted refresh state during reload.
- Garage and backyard are attached main level areas in the navigation model, not true vertical floors.
- Garage layout is now one open garage area.
- Garage is treated as west of the main house in the camera and blueprint model.
- Backyard is treated as north of the main house in the camera and blueprint model.
- Pull swipe camera mapping is active: down to yard, right to garage, up from yard to main, left from garage to main.
- Garage overhead exit and parked vehicles face downward.
- Camera transitions now draw both source and target areas during slides.
- Full screen blueprint mode exists with schematic floors and character markers.
- Character locator moves the camera to a character without changing selection.
- Doorway rendering currently uses open gaps and does not draw swing symbols.
- Vehicle flow has staged luggage, trunk, remote lock or unlock flashes, seat assignment, and return parking logic.
- Movement routing no longer accepts unverified detour to final legs, which caused back and forth line oscillation.

## Current pending checkpoint

Pending or still rough:

- Convert blueprint into a true live mini renderer instead of schematic boxes.
- Make selected character door crossing trigger camera slide exactly at the doorway moment.
- Add proper simple top down door art, thin line and knob only.
- Add a front patio as its own navigable same level area.
- Add a developer money refill button for test mode.
- Finish plane runway, takeoff, plane interior, landing, and seatbelt sequence.
- Add health collapse, paramedic stretcher, ambulance, and recovery absence systems.
- Build real city, neighborhood, driving route, and destination spaces.
- Continue reducing object edge blocking without letting characters pass through walls.

## Secret house story ideas

Long term, each house can have a unique secret.

Possible example:

- A hidden bunker or secret room found through a concealed door.
- The room contains ancient African artifacts.
- The discovery teaches the player about the culture through objects, notes, environmental storytelling, and small story events.
- Different houses can have different secrets, cultures, histories, myths, or hidden rooms.

This is an idea backlog item only for now. Current priority is still making the playable mechanics stable first.
