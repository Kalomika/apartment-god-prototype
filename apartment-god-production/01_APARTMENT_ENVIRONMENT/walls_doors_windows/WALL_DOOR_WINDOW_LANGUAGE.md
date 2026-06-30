# Wall, Door, Window, and Access Language

This file defines the visual and gameplay language for walls, doors, windows, stairs, and future access points.

The goal is to make the apartment readable from an orthographic top-down camera while preserving movement and interaction logic.

## Core rules

- Walls must be clearly visible and collision readable.
- Doorways must be obvious and must match logical walk openings.
- Windows must read as non-walkable wall elements.
- Stairs must have one clear transfer side.
- Non-room gaps must not look walkable.
- Neon strips must support navigation and mood without hiding structure.
- No cute dollhouse walls, toy-like doors, or cozy cartoon trim.

## Thick cyberpunk walls

Visual language:

- Exterior walls use heavy dark masses.
- Interior walls are slightly thinner but still clearly solid.
- Wall colors stay near Night Charcoal, Blue Black, and Soft Black.
- Wall planes can show damage, panels, vents, conduit, and embedded strips.
- Corners must read cleanly at gameplay scale.

Collision language:

- Every wall mass should map to logical collision.
- A visual wall should never be passable unless a doorway state explicitly opens it.
- Decorative slits, vents, and broken panels need grilles, glass, pipes, or barriers so they do not read as doors.

## Interior wall outlines

Visual language:

- Use dark graphite fills with subtle blue-grey top edges.
- Use controlled cyan rim strips only where they support room separation or path readability.
- Keep outlines practical and architectural, not cartoon rounded.

Collision language:

- The drawn wall footprint must match the gameplay blocker footprint.
- Avoid offset wall art that causes collision mismatch.

## Door gaps

Visual language:

- Doorways are clean rectangular breaks in wall mass.
- Active doorway thresholds can use thin cyan floor strips.
- Locked or future access uses closed panels and magenta or amber caution trim.

Collision language:

- A clear open doorway means walkable access.
- A closed door panel means blocked movement unless runtime opens it.
- Do not paint open black gaps that are not usable.

## Sliding doors

Visual language:

- Sliding doors use flat dark panels in wall rails.
- Open state shows a full rectangular gap.
- Closed state covers the gap with a visible seam.
- Cyan rail accents can mark active open routes.

Collision language:

- Closed sliding door blocks movement.
- Open sliding door clears movement.
- Partial glass should never look like a walkable gap.

Best use:

- Bedroom privacy
- Office access
- Bathroom access
- Future garage connector

## Hinged doors

Visual language:

- Hinged doors use a narrow dark panel and small access pad.
- Use open-against-wall poses if a static open state is needed.
- Avoid huge swing arcs unless runtime needs them.

Collision language:

- Open hinged door states should keep the doorway clear.
- Closed hinged door states block movement.

Best use:

- Front door
- Bathroom door
- Utility or storage doors

## Windows

Visual language:

- Windows live only on exterior walls.
- They are dark glass cuts inside thick walls.
- Use cyan city glow, violet window spill, or magenta reflection sparingly.
- Blinds, rain streaks, grime, and reflections can be state overlays.

Collision language:

- Windows are never walkable.
- A window must not be drawn as a full wall break.
- Window glow should not erase wall boundaries.

Planned states:

- `ENV_WINDOWS_NEON_NIGHT`
- `ENV_WINDOWS_RAIN_STREAKS`
- `ENV_WINDOWS_BLINDS_CLOSED`
- `ENV_WINDOWS_BLINDS_OPEN`

## Light strips along walls

Visual language:

- Cyan indicates utility, route, clean path, or active access.
- Magenta indicates mood, music, entertainment, privacy, or future warning.
- Amber indicates kitchen practical or caution.
- Red is reserved for future alarm states.

Placement rules:

- Use thin strips along wall bases, door thresholds, stairs, counters, and major prop backs.
- Do not turn neon into thick decorative ribbons.
- Do not flood the room with glow.

Collision language:

- Light strips do not affect collision.
- Light strips should never imply a path through a wall.

## Floor transitions

Visual language:

- Living room: Worn Concrete or dark industrial flooring.
- Kitchen: darker slate or painted industrial tile.
- Bathroom: cold blue-grey wet room tile.
- Bedroom: softer dark matte floor.
- Office: dark tech panels with cable raceway detail.
- Basement future: dark concrete and utility grates.
- Garage future: dark concrete, lane marks, tire scuffs.

Collision language:

- Floor transitions do not block movement.
- Do not draw floor seams as wall lines.

## Stairs

Visual language:

- Stairs use repeated dark tread bands.
- Cyan edge strips mark tread rhythm.
- Rails are black side masses.
- Landing has a clear access strip.

Collision language:

- Rail sides block movement.
- Only the landing edge triggers transfer.
- Stair art must not imply access from all sides.

Planned state:

- `ENV_PROP_STAIRS_BASE`

## Basement future access

Visual language:

- Use a heavy hatch near stairs or a closed stair continuation.
- Closed future state uses dark panel, magenta caution trim, and a small cyan lock pad.
- Open state is not drawn as active until basement gameplay exists.

Collision language:

- Closed hatch blocks movement.
- Open hatch becomes a transfer zone only after runtime support exists.

## Garage future access

Visual language:

- Interior garage connector should be reinforced and distinct from the front door.
- Garage roll-up door is wide, segmented, and industrial.
- Lane markers should point toward vehicle and travel launch logic.

Collision language:

- Roll-up door blocks movement unless a future travel state opens it.
- Travel launch marker is a trigger zone, not a wall.

## QA checklist

Before QA, confirm:

- Walls read as solid blockers.
- Doorways read as intentional openings.
- Windows read as non-walkable wall elements.
- Stairs have one clear transfer side.
- Future basement and garage access look inactive until implemented.
- Neon supports space and mood without hiding collision.
- No environment element reads as cute, toy-like, or dollhouse-like.