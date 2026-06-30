# Environment Layout Plan

This plan defines the upgraded top-down apartment layout for the realistic cyberpunk production pass.

The layout is not final polished art. It is a production blueprint for later image, cleanup, QA, and Codex integration passes.

## Layout source rules

Follow the Art Bible:

- Realistic top-down apartment staging
- Dark wall masses
- Blue-grey or charcoal floors
- Cyan and magenta neon strips
- Lived-in tech clutter
- Readable furniture footprints
- Clear doorways and collision edges
- No cute dollhouse structure
- No toy-like furniture

Use the installed environment references for structure and mood, especially:

- `ENV_REF_01_TOPDOWN_APARTMENT_MAP.jpg`
- `ENV_REF_02_DARK_CYBERPUNK_APARTMENT_MAP.jpg`
- `CURRENT_GAME_CONTEXT_01_SCREENSHOT.png`

References guide layout mood only. Final production art must be original and sliced for gameplay.

## Global top-down layout rules

- Keep the apartment orthographic and grid-readable.
- Preserve current gameplay rooms.
- Keep the primary walk lanes clear.
- Keep every gameplay object approachable from at least one clear side.
- Use walls, floor transitions, and lighting to separate rooms without hiding collision logic.
- Use clutter at edges and around props, not across doorways or path lanes.
- Keep mobile readability as a constant constraint.

# Floor 1

## Required Floor 1 spaces

- Entry
- Living room
- Kitchen
- Bathroom
- Stairs

## Floor 1 layout intent

Floor 1 is the public and utility layer of the apartment. It should feel dark, cramped, lived in, and functional. The living room acts as the hub, with entry, kitchen, bathroom, and stairs clearly attached to it.

Suggested arrangement:

- Entry at the lower edge or lower left edge.
- Living room at the central hub.
- Kitchen adjacent to living room, either side or upper edge.
- Bathroom on a side branch with a clear doorway.
- Stairs along a wall or corner with one clear access side.

## Entry

Gameplay purpose:

- Arrival and exit point.
- Future work, errands, garage, exterior, and travel handoff.
- Cyberpunk security mood setter.

Major props:

- `ENV_PROP_FRONT_DOOR_BASE`
- `ENV_PROP_PHONE_DOCK_VISUAL`
- Key panel or wall access pad
- Entry mat
- Shoe clutter
- Small shelf or delivery box

Light sources:

- Cyan door seal
- Small overhead practical
- Magenta exterior spill at door edge

Interactable objects:

- Front door
- Phone dock visual concept, future
- Entry key panel, future

Collision expectations:

- Door frame and exterior wall block movement.
- Door threshold is the only exit interaction zone.
- Shoe clutter and entry mat should not block movement unless intentionally promoted to solid clutter.

Door and window notes:

- Front door must read as a door, not a window.
- Any side panel near the door must be visibly closed or glassed so it does not look walkable.

Camera and readability notes:

- Keep the entry simple and high contrast at mobile scale.
- Do not place bright clutter over the front door hit area.

## Living room

Gameplay purpose:

- Fun, rest, social action, TV, music, dog care.
- Main hub for click targets and daily life loops.

Major props:

- `ENV_PROP_COUCH_BASE`
- `ENV_PROP_TV_OFF`
- `ENV_PROP_TV_ON`
- `ENV_PROP_STEREO_BASE`
- `ENV_PROP_DOG_BOWL`
- Living light
- Living window
- Optional coffee table and clutter groups

Light sources:

- TV blue or cyan spill
- Cyan strip behind entertainment wall
- Magenta stereo or music accent
- Window glow
- Living room practical

Interactable objects:

- Couch
- TV
- Stereo
- Dog bowl
- Living light
- Window mood state, future

Collision expectations:

- Couch blocks movement and uses `seat_center` behavior for seated character alignment.
- TV console blocks if floor standing. Wall TV uses wall collision.
- Dog bowl should be clickable and preferably non-blocking.
- Coffee table future should not trap movement between couch and TV.

Door and window notes:

- Living room must connect clearly to entry, kitchen, bathroom route, and stairs.
- Window sits on an exterior wall and must not resemble an exit.

Camera and readability notes:

- Couch, TV, stereo, and dog bowl must remain readable as separate silhouettes.
- Avoid clutter across the main living room path.

## Kitchen

Gameplay purpose:

- Hunger, cooking, cleaning, water use, future dining.

Major props:

- `ENV_PROP_FRIDGE_BASE`
- `ENV_PROP_STOVE_BASE`
- `ENV_PROP_KITCHEN_SINK_BASE`
- `ENV_PROP_COUNTER_BASE`
- `ENV_PROP_DINING_TABLE_FUTURE`
- Small appliances and takeout clutter

Light sources:

- Cyan under-cabinet strips
- Dirty amber kitchen practical
- Stove glow when active
- Small appliance LEDs

Interactable objects:

- Fridge
- Stove
- Sink
- Dining table future

Collision expectations:

- Counter, fridge, stove, and sink block movement.
- Interaction happens from the open kitchen side.
- Floor clutter must not block access to fridge, stove, or sink.

Door and window notes:

- Kitchen can be open to living room or separated by a partial wall.
- Any counter gaps that are not walkable should be visually closed with cabinets, appliances, or trim.

Camera and readability notes:

- Appliances must read from above by footprint, not side-view icon logic.
- Stove active state must not overpower sink and fridge silhouette.

## Bathroom

Gameplay purpose:

- Hygiene and bladder needs.
- Privacy lighting support.

Major props:

- `ENV_PROP_SHOWER_BASE`
- `ENV_PROP_TOILET_BASE`
- `ENV_PROP_BATHROOM_SINK_BASE`
- Mirror panel
- Towel and bottle clutter

Light sources:

- Cool bathroom practical
- Cyan mirror rim
- Low privacy dim strip

Interactable objects:

- Shower
- Toilet
- Bathroom sink, future or current depending runtime mapping

Collision expectations:

- Shower, toilet, and sink are solid.
- Each needs at least one clear approach tile.
- Bathroom walls must stay visually thick and closed.

Door and window notes:

- Door gap should face the hall or living path.
- Window, if used, should be frosted and non-walkable.

Camera and readability notes:

- Keep bathroom clutter minimal, because the room is small.
- Privacy lighting must not hide click targets.

## Stairs, Floor 1

Gameplay purpose:

- Floor transfer to Floor 2.
- Future basement access marker can live nearby, but must not activate until implemented.

Major props:

- `ENV_PROP_STAIRS_BASE`
- Rail masses
- Landing trim
- Future basement hatch

Light sources:

- Cyan tread strips
- Magenta underside or side strip
- Small landing practical

Interactable objects:

- Stairs
- Basement hatch future

Collision expectations:

- Rails block movement.
- Only the landing edge transfers floors.
- Non-access sides must not look walkable.

Door and window notes:

- Stairs should face the living or hall path.
- Basement future marker must look locked or inactive until a future pass enables it.

Camera and readability notes:

- Tread rhythm and rails must make the stair direction readable from top down.

# Floor 2

## Required Floor 2 spaces

- Hall
- Bedroom
- Office
- Upstairs bathroom
- Stairs

## Floor 2 layout intent

Floor 2 is the private and work layer. The hall is the navigation spine, with bedroom, office, upstairs bathroom, and stairs all visually distinct.

Suggested arrangement:

- Stairs land into hall.
- Bedroom on one side of the hall.
- Office opposite or further down hall.
- Upstairs bathroom near bedroom, but clearly separate.

## Hall

Gameplay purpose:

- Floor 2 navigation spine.
- Connects stairs, bedroom, office, and upstairs bathroom.

Major props:

- Wall panels
- Low shelf or laundry basket, optional future
- Conduit and service trim

Light sources:

- Low cyan baseboard strip
- Sparse magenta wall indicators

Interactable objects:

- None required for this pass.
- Future hallway light or wall panel possible.

Collision expectations:

- Hall walls block movement.
- Door gaps must be the only visual openings.
- Clutter cannot block room access.

Door and window notes:

- Bedroom, office, bathroom, and stairs access must all be obvious.
- Fake black gaps are forbidden.

Camera and readability notes:

- The hall should be clean enough to read as circulation, not a clutter corridor.

## Bedroom

Gameplay purpose:

- Sleep, rest, privacy, energy recovery.

Major props:

- `ENV_PROP_BED_BASE`
- Bedroom light
- Bedroom window
- Nightstand
- Clothing clutter
- Optional dresser future

Light sources:

- Bedroom practical
- Privacy dim magenta strip
- Window city glow
- Soft cyan low strip

Interactable objects:

- Bed
- Bedroom light
- Bedroom window mood or privacy future

Collision expectations:

- Bed is solid and uses `bed_center` behavior for bed-pose alignment.
- Nightstand and dresser are solid if mapped.
- Clothing clutter stays at edges and should be non-blocking unless mapped.

Door and window notes:

- Door faces hall.
- Window sits on exterior wall and must not conflict with bed interaction side.

Camera and readability notes:

- Bed silhouette must stay readable in privacy dim.
- Do not hide bed hit area under dark overlays.

## Office

Gameplay purpose:

- Work from home, laptop use, reading, phone, creative tasks.

Major props:

- `ENV_PROP_DESK_BASE`
- `ENV_PROP_LAPTOP_OPEN`
- Bookshelf
- Chair
- Wall display panels
- Cable cluster
- Phone dock visual concept if not used at entry

Light sources:

- Laptop cyan glow
- Desk task strip
- Magenta equipment LEDs
- Small overhead task practical

Interactable objects:

- Laptop desk
- Bookshelf
- Phone dock future

Collision expectations:

- Desk, chair, and bookshelf block if mapped.
- Laptop interaction uses chair side or desk front.
- Bookshelf interaction uses open room side.

Door and window notes:

- Door faces hall.
- Window, if used, should stay behind desk or along exterior wall.

Camera and readability notes:

- Desk, chair, laptop, and bookshelf must not merge into one black block.
- Cable clusters should sit at wall or desk edge, not in path.

## Upstairs bathroom

Gameplay purpose:

- Secondary hygiene and bladder space.

Major props:

- Shower or compact bath
- Toilet
- Sink or vanity
- Mirror
- Towel or basket clutter

Light sources:

- Cool bathroom light
- Cyan mirror rim
- Low magenta service LEDs

Interactable objects:

- Shower
- Toilet
- Sink future or current depending runtime mapping

Collision expectations:

- Same as Floor 1 bathroom.
- Keep hit zones separated.

Door and window notes:

- Door faces hall.
- Window should be small, frosted, or omitted.

Camera and readability notes:

- Keep the upstairs bathroom simpler than the living and office spaces.

## Stairs, Floor 2

Gameplay purpose:

- Transfer back to Floor 1.

Major props:

- Stair top landing
- Rails
- Edge light strips

Light sources:

- Cyan tread edge strips
- Landing practical

Interactable objects:

- Stairs

Collision expectations:

- Only the landing edge triggers transfer.
- Rails block side movement.

Door and window notes:

- Top landing must face the hall.

Camera and readability notes:

- The stair landing must read as a floor transfer at gameplay scale.

# Future basement

## Future spaces

- Basement lounge
- Man cave
- Podcast room
- Utility wall
- Storage zone

Gameplay purpose:

- Future podcast, media creation, lounge, social, work, bad event, and hidden utility states.

Major props:

- `ENV_PROP_PODCAST_DESK_FUTURE`
- `ENV_PROP_BASEMENT_COUCH_FUTURE`
- Audio rack
- Wall monitors
- Utility pipes
- Storage racks

Light sources:

- Cyan low edge strips
- Magenta audio LEDs
- Monitor glow
- Future alarm red

Interactable objects:

- Podcast desk future
- Basement couch future
- Audio rack future
- Utility panel future

Collision expectations:

- Keep a clear route from access point to couch and podcast desk.
- Storage blocks should define edges, not fill the room.

Door and window notes:

- Access via future basement hatch or stair continuation.
- Future access marker must not read as current unless implemented.

# Future garage

## Future spaces

- Car bay
- Tool wall
- Storage lane
- Travel launch zone
- Roll-up door

Gameplay purpose:

- Future vehicle, travel, repair, storage, and outside transition actions.

Major props:

- `ENV_PROP_CAR_FUTURE`
- `ENV_PROP_GARAGE_TOOL_RACK_FUTURE`
- Workbench
- Charging cable
- Storage bins
- Garage door

Light sources:

- Cool overhead strips
- Cyan lane guides
- Magenta bay accents
- Workbench task light

Interactable objects:

- Car future
- Tool rack future
- Garage door future
- Travel launch marker future

Collision expectations:

- Car is a large solid blocker with a clear driver-side approach.
- Tool rack and workbench sit along walls.
- Travel launch marker is a visible trigger zone, not a clutter object.

Door and window notes:

- Interior garage access should not be confused with the current front door.
- Roll-up door is a wide exterior barrier, not a normal room doorway.