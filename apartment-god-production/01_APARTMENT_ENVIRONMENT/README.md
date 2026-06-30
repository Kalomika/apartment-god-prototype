# Apartment Environment Department

This folder is the production blueprint for the upgraded cyberpunk apartment environment in Apartment God Prototype.

The purpose is to define the top down apartment as a playable space first, and a visual upgrade second. The environment must support object clicking, movement, room logic, collision, lighting states, and future prop swaps without breaking the current apartment gameplay loop.

## Scope

This department covers:

- Floor 1 and Floor 2 apartment layout planning
- Future basement, man cave, podcast room planning
- Future garage, car bay, travel launch space planning
- Room style rules
- Wall, door, window, stair, hatch, and floor transition rules
- Gameplay prop planning
- Cyberpunk lighting rules
- Environment manifest entries for Codex and later art passes

## Required production rules

- Follow the Art Bible whenever those files are available.
- Keep the apartment realistic, readable, and usable, not cute.
- Use dark wall masses, blue grey floor materials, cyan neon, magenta neon, and lived in futuristic clutter.
- Preserve top down orthographic readability at mobile scale.
- Every visual object that is gameplay relevant should map to a logical object, room, wall, doorway, or lighting state.
- Do not treat the apartment as a single flat decorative background if that breaks object clicking, collisions, or interaction logic.
- Keep wall boundaries clear and doorways obvious.
- Keep clutter readable and avoid blocking the player path unless the object is meant to collide.
- Keep existing gameplay spaces intact unless a future migration intentionally changes them.

## Art Bible status

The requested source files under `apartment-god-production/00_ART_BIBLE/` were not present in the repository when this pass was created. This folder therefore uses a conservative production blueprint based on the requested visual direction and known gameplay spaces. Once the Art Bible files are restored, this folder should be checked against:

- `VISUAL_STYLE_GUIDE.md`
- `SPRITE_STATE_LIST.md`
- `NAMING_CONVENTIONS.md`
- `SCALE_AND_ANCHOR_GUIDE.md`
- `COLOR_PALETTE.md`
- `MANIFEST_TEMPLATE.json`
- `STYLE_QA_CHECKLIST.md`
- `README.md`

## Implementation warning

The future visual pass must not replace the current apartment with one unsliced AI image. A full map image can be used as a paint reference or floor underlay only if the walls, floors, props, interaction zones, and collision objects remain separately mapped in code or data.