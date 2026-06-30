# Wall, Door, Window, and Access Language

## Purpose

This file defines how the upgraded cyberpunk apartment should communicate room boundaries, access, collision, and future expansion points from a top down orthographic camera.

The visual language must support gameplay logic. Players should understand what blocks movement, what can be entered, what can be clicked, and what is only visual dressing.

## Thick cyberpunk walls

Visual rule:

- Exterior walls are heavy dark masses, nearly black with blue grey edge highlights.
- Interior walls are slightly thinner but still clearly solid.
- Wall caps can include pipes, embedded panels, vents, cable troughs, and neon trim.
- Walls should never disappear into floor texture.
- Use a strong contrast edge between wall mass and floor.

Collision rule:

- Every wall mass should map to a logical wall blocker or room boundary.
- Do not paint decorative gaps in wall masses unless they are real openings.
- Do not use thin decorative lines as primary collision walls.

Readability rule:

- At mobile scale, walls should read as black structural shapes first.
- Neon trim is secondary and should not make walls look walkable.

## Interior wall outlines

Visual rule:

- Interior walls use dark graphite fill with a slightly lighter top edge.
- Corners should be squared and clean.
- Pipes and trim can sit on top of the wall shape, but must not obscure door gaps.
- Interior wall outlines can use subtle cyan rim light facing active rooms.

Collision rule:

- Interior wall outlines must align with movement blockers.
- Avoid visual wall offsets that make the player think a path is open when collision is closed.

## Door gaps

Visual rule:

- Doorways are clean breaks in the wall mass.
- Use a short floor threshold strip to mark walkable access.
- Cyan threshold strips can mark active room access.
- Magenta caution strips can mark locked or future access.

Collision rule:

- A visual door gap means walkable access unless the door is locked, blocked, or future only.
- If a gap is not walkable, cover it visually with a closed door panel, locked hatch, barrier, or caution trim.

Gameplay rule:

- Door interaction points should sit on the interior approach side.
- Do not place clutter inside door collision openings.

## Sliding doors

Visual rule:

- Sliding doors use a flat panel tucked into a wall rail.
- Use a bright top rail and side pocket to make the opening direction readable.
- Closed sliding doors should cover the full doorway, with a clear seam line.
- Open sliding doors should expose a full rectangular walk gap.

Collision rule:

- Closed state blocks movement.
- Open state clears the doorway.
- Partial decorative glass should not be used as a fake open path.

Best use:

- Bedroom privacy door, bathroom door, office door, future garage connector.

## Hinged doors

Visual rule:

- Hinged doors use a narrow dark panel and a visible swing arc only when needed.
- In top down view, a hinged door can be shown open against a wall to avoid blocking the path.
- Use a small glowing handle or access pad.

Collision rule:

- Door panels should not create confusing extra collision unless a door opening mechanic is added.
- Prefer open door visuals for current always accessible rooms.

Best use:

- Front door, bathroom doors, possible closet or utility doors.

## Windows

Visual rule:

- Windows sit only on exterior walls.
- They should read as horizontal or vertical blue grey glass cuts in a thick wall.
- Use cyan city glow and occasional magenta reflections.
- Windows may show blinds, condensation, grime, or rain streaks, but keep it subtle.

Collision rule:

- Windows are not walkable.
- Do not create full wall breaks that resemble doors.
- Window glow must stay inside the wall or just spill onto adjacent floor.

Gameplay rule:

- Windows can support mood, exterior view, privacy, or ambient light states later.

## Light strips along walls

Visual rule:

- Use cyan light strips for clean navigation, utility, and active paths.
- Use magenta light strips for mood, leisure, danger, or nightlife energy.
- Place strips along wall bases, door thresholds, stairs, counters, and major prop backs.
- Keep strips thin and readable, not thick decorative ribbons.

Collision rule:

- Light strips should sit on non interactive trim unless they are tied to a light switch or room state.
- Avoid placing strips where they look like walk lanes through walls.

## Floor transitions

Visual rule:

- Living room floor is dark blue grey composite tile.
- Kitchen floor uses darker slate panels or reinforced rubberized tile.
- Bathroom floors use colder blue grey wet room tile.
- Bedroom floors use dark matte material with softer edge glow.
- Office floors use dark tech panels with cable raceway markings.
- Basement future floors use concrete, stains, and service grates.
- Garage future floors use dark concrete, tire marks, and lane markings.

Collision rule:

- Floor transitions should not imply walls.
- Transitions can guide rooms but should not create fake barriers.

Readability rule:

- Floor material changes must be subtle. Walls and props carry the primary read.

## Stairs

Visual rule:

- Stairs use repeated dark bands with cyan tread edge strips.
- Railings are visible dark side masses.
- The active landing should have a brighter threshold and clear interaction side.
- Direction can be shown with slight value gradient or numbered tread rhythm.

Collision rule:

- Rail sides block movement.
- Only the landing access tile should be walkable and interactive.
- Do not let the stair art imply access from every side.

Gameplay rule:

- Stair object ID should remain tied to floor transfer logic.
- If stairs later connect basement and Floor 2, use separate access states or separate interaction zones.

## Basement hatch and future access

Visual rule:

- Basement access can be a heavy floor hatch near stairs or a locked stair continuation.
- Use magenta warning trim and small cyan access panel.
- Closed future state should look locked, not walkable.
- Open future state should reveal a dark stairwell or ladder shape.

Collision rule:

- Closed hatch blocks transfer and should not be treated as a current doorway.
- Open hatch becomes an intentional transfer zone only when implemented.

Gameplay rule:

- Mark as future access until basement gameplay exists.

## Garage door and future access

Visual rule:

- Garage access can be an interior reinforced door or future connector at the entry side.
- Garage roll up door should appear as a wide segmented exterior barrier.
- Use larger industrial forms than apartment doors.
- Car bay floor markings should point toward the roll up door.

Collision rule:

- Roll up garage door blocks movement unless a travel mechanic is active.
- Interior garage connector should be obvious and separate from front door logic.

Gameplay rule:

- Future car and travel launch interactions should not override the current front door exit until intentionally migrated.

## Non room gaps

Visual rule:

- Any black gap, service slit, vent, broken panel, or decorative cutout that is not walkable must include a visible blocker: grille, pipe, glass, rail, closed panel, or caution edge.

Collision rule:

- Never paint empty negative spaces along wall edges unless the player can pass through them.

## QA checklist for walls and access

- Can the player tell walls from floors at a glance?
- Are all real doorways obvious?
- Are fake gaps blocked visually?
- Are stairs readable as transfer points?
- Are windows clearly non walkable?
- Does neon guide the eye without hiding collision boundaries?
- Does every visual access point match actual movement logic?