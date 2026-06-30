# Environment References

This folder is for cyberpunk apartment structure, mood, lighting, layout, furniture, and prop references.

## Reference purpose

Use these references to guide the future upgraded environment art for Apartment God Prototype. The target is a realistic, readable, top down cyberpunk apartment that supports gameplay.

## Required environment style

The apartment should use:

- Dark wall masses
- Thick readable interior and exterior walls
- Dark blue grey, charcoal, concrete, or worn dark floor materials
- Cyan and magenta neon strips
- Lit windows and controlled city glow
- Tech clutter
- Lived in furniture
- Cables, dishes, laundry, monitors, boxes, tools, and personal objects
- Clear room function
- Clear doorways
- Clear collision logic

## Forbidden environment direction

Do not use references to create:

- A cute dollhouse map
- A bright toy room
- A sterile sci fi showroom
- A flat decorative map that breaks gameplay
- Door gaps that do not match collision
- Wall art that makes non walkable areas look open
- Clutter that hides the player or click targets
- Neon overuse that destroys silhouettes

## Layout interpretation rules

Environment references should be translated into the current Apartment God room structure:

Floor 1:

- Entry
- Living room
- Kitchen
- Bathroom
- Stairs

Floor 2:

- Hall
- Bedroom
- Office
- Upstairs bathroom
- Stairs

Future spaces:

- Basement, man cave, podcast room
- Garage, car bay, travel launch space

Do not invent a new apartment layout that disconnects from the current gameplay rooms.

## Gameplay collision rules

Environment art must support gameplay. Visual walls, doorways, props, and path lanes should map to logical game data.

- Walls block movement.
- Doorways are visibly open when walkable.
- Windows are not exits.
- Stairs have one clear transfer side.
- Props with gameplay function should remain separate and clickable.
- Decorative clutter should not block unless it is intentionally mapped as a solid object.
- Lighting overlays should not affect collision.

## Production translation checklist

Before using an environment reference for production, confirm:

- The room still reads from top down gameplay scale.
- The furniture scale matches adult humans.
- The color direction fits the dark cyberpunk palette.
- The reference does not push the game toward toy, cute, or bright showroom design.
- The visual idea can be sliced into gameplay layers.
- Prop click targets remain clear.
- Collision does not depend on pixels from a flat image.

## Expected reference notes per file

When actual reference files are added, document each one in `reference_manifest.json` with:

- File name
- Reference folder
- Reference type
- Intended use
- Allowed use notes
- Restrictions
- Watermark or license status
- Production translation notes