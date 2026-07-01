# Lighting Style Guide

This guide defines lighting rules for the upgraded Apartment God cyberpunk apartment.

Lighting must support gameplay readability first and mood second. Neon should accent structure, not replace drawing structure.

## Art Bible lighting rules

Use:

- Cyan edge glow
- Magenta wall strips
- Dirty amber kitchen practicals
- Cool bathroom light
- Monitor glow
- Window light
- Controlled red alert lighting only for special states

Avoid:

- Flooding the entire asset with neon
- Hiding gameplay silhouettes in darkness
- Baked glow that runtime cannot control
- Cute party colors or rainbow gradients
- Neon that makes walls look walkable

## Global lighting states

### ENV_LIGHTING_BASE_DARK

Purpose:

- Default dark apartment base.
- Keeps walls and floors readable without heavy bloom.

Rules:

- Walls remain dark but visible.
- Floors stay blue-grey or charcoal.
- Prop silhouettes remain clear.
- No runtime collision changes.

### ENV_LIGHTING_NEON_CYAN

Purpose:

- Utility, path guidance, active edges, screen-adjacent cool glow.

Placement:

- Door thresholds.
- Wall bases.
- Stair treads.
- Under kitchen cabinets.
- Desk and laptop zone.
- Bathroom mirror trim.

Rules:

- Thin and controlled.
- Should never imply a path through a wall.

### ENV_LIGHTING_NEON_MAGENTA

Purpose:

- Mood, privacy, entertainment, music, nightlife, and warning support.

Placement:

- Stereo side.
- Bedroom privacy edge.
- Living room accent wall.
- Future basement audio gear.
- Future garage bay accent.

Rules:

- Keep magenta secondary to structure.
- Avoid bubblegum or cute pink dominance.

### ENV_LIGHTING_SCREEN_GLOW

Purpose:

- TV, laptop, monitors, and wall display glow.

Placement:

- TV wall and couch spill.
- Office desk and chair spill.
- Basement podcast monitors future.

Rules:

- Screen glow can identify active objects.
- Do not cover click targets or prop silhouettes.

### ENV_LIGHTING_WINDOW_RAIN

Purpose:

- Window mood state with rain streaks or exterior city glow.

Placement:

- Living room and bedroom exterior windows.

Rules:

- Window remains non-walkable.
- Rain streaks must not hide wall boundary.

### ENV_LIGHTING_KITCHEN_PRACTICAL

Purpose:

- Kitchen work and cooking readability.

Placement:

- Dirty amber practical above counter.
- Cyan under-cabinet strip.
- Stove active glow.

Rules:

- Keep fridge, stove, sink, and counters visually separated.

### ENV_LIGHTING_BATHROOM_PRACTICAL

Purpose:

- Hygiene and bathroom object readability.

Placement:

- Cool white overhead or mirror-side practical.
- Cyan mirror rim.

Rules:

- Shower, toilet, and sink remain readable.
- Privacy dim must not hide click targets.

### ENV_LIGHTING_ALARM_RED

Purpose:

- Future emergency or bad event lighting.

Placement:

- Door edges.
- Stair landing.
- Utility panels.
- Future basement and garage warning strips.

Rules:

- Red is future only.
- Keep exits and stairs readable.
- Do not alter collision or room logic.

## Room lighting notes

## Living room

States:

- Base dark.
- TV glow only.
- Cyan entertainment wall strip.
- Magenta stereo music pulse future.
- Window neon night.

Gameplay notes:

- Couch, TV, stereo, dog bowl, and path lanes must remain readable.
- TV glow must not hide couch interaction side.

## Kitchen

States:

- Kitchen practical.
- Under-cabinet cyan.
- Stove active glow.
- Low appliance LEDs.

Gameplay notes:

- Stove glow must not overpower fridge and sink.
- Counters remain collision readable.

## Bathroom

States:

- Bathroom practical.
- Mirror rim dim.
- Steam future.
- Privacy dim.

Gameplay notes:

- Shower, toilet, and sink approach sides remain clear.
- Door gap remains readable.

## Entry

States:

- Door seal cyan.
- Exterior magenta spill.
- Entry practical.
- Lock panel future.

Gameplay notes:

- Front door threshold remains the main exit hit area.

## Stairs

States:

- Cyan tread edges.
- Landing practical.
- Future basement hatch caution.

Gameplay notes:

- Stair direction and landing transfer side must read immediately.

## Bedroom

States:

- Bedroom base.
- Bedroom night.
- Privacy dim.
- Window city glow.

Gameplay notes:

- Bed hit area remains clear.
- Character bed states must read against dark bedding.

## Office

States:

- Workspace base.
- Screen glow.
- Laptop active.
- Equipment LED dim.

Gameplay notes:

- Laptop desk and bookshelf must stay separate in silhouette.
- Cable clusters must not hide walk lanes.

## Upstairs bathroom

States:

- Bathroom practical.
- Mirror rim dim.
- Steam future.

Gameplay notes:

- Same as Floor 1 bathroom, with lower clutter density.

## Hall

States:

- Low cyan baseboard strip.
- Room spill from adjacent spaces.

Gameplay notes:

- Hall must remain navigation-readable.

## Basement future

States:

- Dark utility base.
- Podcast recording glow.
- Lounge monitor glow.
- Emergency red future.

Gameplay notes:

- Do not activate until basement gameplay exists.

## Garage future

States:

- Overhead industrial practical.
- Cyan lane guide.
- Travel ready glow.
- Repair mode workbench light.

Gameplay notes:

- Do not activate until garage gameplay exists.

## Lighting QA checklist

- Walls still read as walls.
- Doorways still read as doorways.
- Windows still read as windows, not exits.
- Props remain readable at gameplay scale.
- Click targets remain visible.
- Clutter does not disappear into darkness.
- Neon accents do not turn the game cute, toy-like, or sticker-like.
- Lighting overlays do not affect collision.