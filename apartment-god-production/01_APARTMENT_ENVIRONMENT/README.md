# Apartment Environment Department

This folder contains the reconciled production blueprint for the upgraded Apartment God Prototype environment.

The environment target is a realistic top-down cyberpunk apartment that supports gameplay first and mood second. The apartment must remain readable, clickable, and collision-safe. It must not become a flat decorative image that breaks object interaction, room logic, or pathfinding.

## Source of truth read for this pass

This cleanup pass was reconciled against:

- `apartment-god-production/PRODUCTION_MANAGER_LOG.md`
- `apartment-god-production/DEPARTMENT_START_HERE.md`
- `apartment-god-production/DEPARTMENT_STATUS_BOARD.md`
- `apartment-god-production/00_ART_BIBLE/`
- `apartment-god-production/REFERENCE_LIBRARY/`
- `apartment-god-production/01_APARTMENT_ENVIRONMENT/DEPARTMENT_LOG.md`

## Reference Library notes

The installed Reference Library lists the environment references used for this pass:

- `01_environment_references/ENV_REF_01_TOPDOWN_APARTMENT_MAP.jpg`
- `01_environment_references/ENV_REF_02_DARK_CYBERPUNK_APARTMENT_MAP.jpg`
- `05_current_game_context/CURRENT_GAME_CONTEXT_01_SCREENSHOT.png`

These references are guidance only. They are not final game art and must not be committed as production environment assets.

## Visual target

The apartment should use:

- Dark wall masses
- Dark blue-grey or charcoal floors
- Cyan and magenta neon strip lighting
- Lit windows
- Tech clutter
- Lived-in details, including cables, laundry, takeout, tools, books, monitors, dishes, bowls, and personal mess
- Readable furniture footprints
- Clear doorway and collision logic
- Orthographic top-down staging

The apartment must avoid:

- Cute dollhouse logic
- Toy-like furniture
- Childish colors or props
- Cozy cartoon room styling
- Flat procedural rooms with no life
- A single decorative AI map used as final gameplay structure

## Department contents

Required files in this department:

- `layout/ENV_LAYOUT_PLAN.md`
- `layout/INTEGRATION_NOTES.md`
- `walls_doors_windows/WALL_DOOR_WINDOW_LANGUAGE.md`
- `rooms/ROOM_STYLE_GUIDE.md`
- `props/PROP_ASSET_LIST.md`
- `lighting/LIGHTING_STYLE_GUIDE.md`
- `manifest_environment.json`
- `README.md`

## Gameplay rules

- Visual walls must match collision walls.
- Doorways must match logical openings.
- Windows must read as non-walkable wall elements.
- Props that support gameplay must be represented as separate planned assets in the manifest.
- Clutter should support tone without hiding path readability or click targets.
- Lighting overlays must not change collision.
- Current gameplay object IDs should be preserved or mapped during future integration.
- Runtime `src/` files are not edited by this department.

## Manifest rule

`manifest_environment.json` is the primary Codex-consumable manifest for this department. It lists planned environment and prop entries with state IDs, planned frame names, anchors, gameplay tags, collision notes, interaction notes, and implementation notes.

No final polished PNG environment art is generated in this cleanup pass.