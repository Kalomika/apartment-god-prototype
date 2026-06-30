# Environment Layout Plan

## Layout intent

Apartment God Prototype should keep the current playable house logic while shifting the visual read toward a dark, realistic, cyberpunk apartment. The plan favors strong room silhouettes, practical furniture placement, obvious paths, and clean interaction zones.

The apartment should read from an orthographic top down camera. Walls and room edges must be more important than surface decoration. Neon should support navigation, not bury it.

## Global layout rules

- Keep rooms functional and clickable.
- Keep floors readable at mobile scale.
- Keep the primary walk path clear from entry to living room, kitchen, bathroom, and stairs.
- Keep the second floor path clear from stairs to hall, bedroom, office, and upstairs bathroom.
- Keep every doorway visually open.
- Keep non walkable wall breaks visually closed with trim, pipes, furniture, or light strips.
- Do not use dense clutter in walk lanes.
- Use dark wall masses as the main room separators.
- Use blue grey floors with subtle material shifts by room.
- Use cyan and magenta neon strips as wayfinding accents.

# Floor 1

## Floor 1 room list

- Entry
- Living room
- Kitchen
- Bathroom
- Stairs

## Floor 1 shape logic

Floor 1 should feel like a compact urban apartment with a strong entry threshold, a central living room, kitchen adjacent to the living space, bathroom off the side, and stairs clearly connected to the upstairs path.

Suggested top down arrangement:

- Entry sits at lower or lower left edge.
- Living room sits central and acts as the main hub.
- Kitchen sits upper or side adjacent to living room.
- Bathroom sits side or rear, easy to access but visually separate.
- Stairs sit along an edge or corner, with the foot of the stairs facing the living room or hall lane.

## Entry

Gameplay purpose:

- Spawn arrival point.
- Exit point for work, errands, travel, future exterior, and future garage.
- Visual mood setter for the cyberpunk apartment.

Major props:

- Front door
- Floor mat
- Wall key panel
- Shoe clutter
- Phone dock visual concept if placed near entry
- Small utility shelf

Light sources:

- Cyan door frame strip
- Small overhead panel light
- Weak magenta exterior spill at door edge

Interactable objects:

- Front door
- Phone dock, future or current visual only until wired
- Possible future coat rack or bag drop

Collision expectations:

- Door frame and wall masses block movement.
- Door interaction zone should sit inside the apartment, not outside the wall.
- Floor mat should not block movement.
- Shoe clutter should be non blocking unless added as an intentional obstacle.

Door and window placement notes:

- Front door should be a clear rectangular break in the wall mass.
- Use a bright thin trim to show it is an exit, not a decoration.
- No window required in entry unless used as exterior glow.

Player camera and readability notes:

- Entry must stay simple at small scale.
- Do not place bright props too close to the front door interaction zone.

## Living room

Gameplay purpose:

- Main leisure hub.
- TV action space.
- Stereo and music space.
- Social gathering area.
- Dog bowl may be placed nearby if current gameplay expects living room access.

Major props:

- Couch
- TV
- Stereo
- Dog bowl
- Living room light
- Coffee table, optional future
- Window
- Cyberpunk wall panels

Light sources:

- TV glow
- Cyan wall strip behind TV
- Magenta edge strip near couch or window
- Living light overhead or wall mounted
- Window glow from city exterior

Interactable objects:

- Couch
- TV
- Stereo
- Dog bowl
- Living room light
- Window, if later used for mood or view actions

Collision expectations:

- Couch blocks movement.
- TV stand blocks movement.
- Dog bowl should be clickable but not block path unless the current collision model requires it.
- Living light switch zone should not block movement.

Door and window placement notes:

- Living room should connect clearly to entry, kitchen, bathroom path, and stairs path.
- Window should sit on an exterior wall, preferably opposite or beside TV, with city light visible.

Player camera and readability notes:

- Couch, TV, and stereo should form a readable triangle of use.
- Keep space around the couch clear enough for character approach points.

## Kitchen

Gameplay purpose:

- Food and hunger actions.
- Cooking actions.
- Sink actions.
- Future dining table connection.

Major props:

- Fridge
- Stove
- Kitchen sink
- Counter run
- Upper cabinets as wall silhouettes
- Future dining table
- Trash chute or compact recycler, future

Light sources:

- Cold cyan under cabinet strip
- Stove glow when active
- Small overhead kitchen panel
- Magenta indicator LEDs on appliances

Interactable objects:

- Fridge
- Stove
- Sink
- Future dining table

Collision expectations:

- Counter run, stove, fridge, and sink should block movement.
- The player should approach from the open side of the counter.
- Dining table future should have a clear chair side and walk gap.

Door and window placement notes:

- Kitchen can be open to living room or separated by a partial wall.
- Avoid creating visual gaps behind counters that look walkable.
- Small window optional if it does not confuse room boundaries.

Player camera and readability notes:

- Appliance silhouettes must read from above.
- Stove glow should not overpower the interaction indicator.

## Bathroom

Gameplay purpose:

- Hygiene, bladder, shower, toilet, sink if added.
- Privacy state support.

Major props:

- Shower
- Toilet
- Bathroom sink or vanity if current map supports it
- Mirror panel
- Floor drain
- Small medicine cabinet

Light sources:

- White blue bathroom ceiling light
- Cyan mirror rim
- Low privacy dim strip

Interactable objects:

- Shower
- Toilet
- Sink if added or mapped later
- Bathroom light if mapped later

Collision expectations:

- Shower and toilet block movement.
- Keep a clear approach tile or interaction side for each.
- Bathroom walls must be thick and obvious.

Door and window placement notes:

- Door gap should face the hall or living room path.
- Bathroom door should not appear as a wall break to nowhere.
- Window optional, small and frosted only.

Player camera and readability notes:

- Bathroom is small, so use fewer clutter details.
- Privacy states should be legible through lighting, not through extra wall occlusion that hides props.

## Stairs, Floor 1

Gameplay purpose:

- Transfer from Floor 1 to Floor 2.
- Future path to basement if hatch or split landing is added.

Major props:

- Stair block
- Railing silhouette
- Floor transition trim
- Small under stair storage or pipe cluster, future

Light sources:

- Cyan tread edge strips
- Magenta underside glow
- Small landing light

Interactable objects:

- Stairs
- Future basement hatch or access panel

Collision expectations:

- Stair side rails should block movement.
- The access point should sit at the bottom landing.
- Non access sides must not look walkable.

Door and window placement notes:

- Stair access should be a clear open side facing the apartment path.
- Future basement access can be a locked hatch below or beside stairs.

Player camera and readability notes:

- Stair direction must read instantly from top down.
- Use stepped bands or edge strips, not only texture.

# Floor 2

## Floor 2 room list

- Stairs
- Hall
- Bedroom
- Office
- Upstairs bathroom

## Floor 2 shape logic

Floor 2 should feel more private and less open than Floor 1. The hall controls room access. Bedroom and office should read as separate life zones, rest and work.

Suggested top down arrangement:

- Stairs arrive into hall.
- Bedroom sits on one side of hall.
- Office sits opposite or down the hall.
- Upstairs bathroom sits near bedroom but remains distinct.

## Hall

Gameplay purpose:

- Navigation spine for Floor 2.
- Supports future mood props, wall panels, and privacy transitions.

Major props:

- Hall trim
- Wall panels
- Small shelf or laundry basket, future
- Window or light well if needed

Light sources:

- Low cyan floor strip
- Small magenta wall indicators

Interactable objects:

- None required unless future light switch or wall panel is added.

Collision expectations:

- Hall walls block movement.
- Keep the hall clear enough for pathfinding.

Door and window placement notes:

- Doorways into bedroom, office, and bathroom should be clear.
- Avoid fake black gaps that look like extra doorways.

Player camera and readability notes:

- Hall should keep enough contrast between wall mass and floor.

## Bedroom

Gameplay purpose:

- Sleep and energy recovery.
- Privacy or relationship state support.
- Bedroom light and dim state support.

Major props:

- Bed
- Bedroom light
- Bedroom window
- Nightstand
- Clothing clutter
- Wall screen, optional future

Light sources:

- Bedroom light
- Privacy dim strip
- Window city glow
- Soft cyan under bed or wall strip

Interactable objects:

- Bed
- Bedroom light
- Bedroom window, future mood only

Collision expectations:

- Bed blocks movement.
- Nightstand blocks if mapped as solid.
- Keep at least one clear interaction side at bed edge.

Door and window placement notes:

- Door should face hall.
- Window should sit on exterior wall and not conflict with bed interaction side.

Player camera and readability notes:

- Privacy dim should not hide the bed hit area.
- Keep clutter along walls, not around the main approach side.

## Office

Gameplay purpose:

- Work from home, laptop use, creative tasks, future job actions.
- Supports laptop glow and bookshelf interaction.

Major props:

- Laptop desk
- Chair
- Bookshelf
- Cable clutter
- Wall display panels
- Phone dock visual concept if entry does not use it

Light sources:

- Laptop glow
- Cyan desk strip
- Magenta wall panel LEDs
- Small overhead task light

Interactable objects:

- Laptop desk
- Bookshelf
- Phone dock if placed here
- Office light future

Collision expectations:

- Desk, chair, and bookshelf block movement if mapped as solids.
- Laptop interaction should occur from chair side or desk front.
- Bookshelf interaction should occur from open room side.

Door and window placement notes:

- Door should face hall.
- Window optional, keep it behind desk or side wall only.

Player camera and readability notes:

- Desk silhouette must not merge with bookshelf silhouette.
- Laptop glow should make work zone obvious.

## Upstairs bathroom

Gameplay purpose:

- Secondary hygiene and bladder space.
- Reduces Floor 2 travel friction.

Major props:

- Shower or compact bath
- Toilet
- Sink or vanity
- Mirror panel
- Towel clutter

Light sources:

- White blue bathroom light
- Cyan mirror trim
- Low magenta service LEDs

Interactable objects:

- Shower
- Toilet
- Sink if later supported
- Bathroom light future

Collision expectations:

- Same rules as Floor 1 bathroom.
- Keep props separated enough to avoid overlapping click zones.

Door and window placement notes:

- Door should be off hall.
- Window should be small or omitted.

Player camera and readability notes:

- Smaller than bedroom and office, fewer decorative props.

## Stairs, Floor 2

Gameplay purpose:

- Transfer from Floor 2 to Floor 1.

Major props:

- Stair top landing
- Railing silhouette
- Edge light strips

Light sources:

- Cyan tread strips
- Magenta underside or side glow

Interactable objects:

- Stairs

Collision expectations:

- Only the intended landing side should be walkable.
- Rail sides block movement.

Door and window placement notes:

- The top landing must face the hall.

Player camera and readability notes:

- The player should instantly read the staircase as a floor transfer, not decoration.

# Future Basement, Man Cave, Podcast Room

## Basement future room list

- Basement lounge
- Podcast desk area
- Utility wall
- Storage clutter
- Optional studio booth zone

Gameplay purpose:

- Future social, podcast, media, work, creative, and hidden event space.
- Man cave upgrade space.
- Possible bad event or emergency lighting space.

Major props:

- Podcast desk
- Basement couch
- Wall monitors
- Audio gear
- Utility pipes
- Storage racks
- Neon sign or show logo panel

Light sources:

- Low cyan strip lights along floor edge
- Magenta audio gear LEDs
- Warm monitor glow
- Emergency red future state

Interactable objects:

- Podcast desk
- Basement couch
- Audio mixer future
- Wall monitors future
- Utility panel future

Collision expectations:

- Basement must not become a decorative clutter field.
- Keep a clear route from stairs or hatch to couch and podcast desk.
- Storage walls block movement.

Door and window placement notes:

- Access starts through future basement hatch or stair continuation.
- No normal windows unless small high window wells are added.

Player camera and readability notes:

- Basement should read darker and denser than main apartment, but interaction objects must remain clear.

# Future Garage, Car Bay, Travel Launch Space

## Garage future room list

- Car bay
- Tool wall
- Storage lane
- Travel launch zone
- Exterior roll up door

Gameplay purpose:

- Future car interaction.
- Future travel launch.
- Future repair, storage, and event space.

Major props:

- Car
- Garage tool rack
- Workbench
- Charging cable
- Storage bins
- Roll up garage door
- Exterior exit marker

Light sources:

- Overhead garage strips
- Cyan floor lane guide
- Magenta car bay LEDs
- Vehicle head or underbody glow future

Interactable objects:

- Car
- Tool rack
- Garage door
- Travel launch marker future

Collision expectations:

- Car is a large blocker with clear approach points.
- Tool rack and workbench block movement.
- Travel launch zone should be a visible but walkable trigger area.

Door and window placement notes:

- Interior access can come from entry, hallway, or future exterior connector.
- Roll up garage door should not look like a room doorway.

Player camera and readability notes:

- The car bay must read at small scale, so avoid excessive part detail.
- Use lane markings and light strips for orientation.