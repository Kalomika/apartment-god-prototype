# Environment Integration Notes

These notes are for the future Codex integration pass. This department does not modify runtime code.

## Integration source of truth

Use `manifest_environment.json` as the primary Codex-consumable manifest for environment and prop planning.

Use the Art Bible for:

- State ID logic
- File naming
- Anchor labels
- Scale rules
- QA status values
- Cyberpunk apartment tone
- No cute, chibi, toy, mascot, sticker, or dollhouse look

Use the Reference Library for:

- Environment structure and mood
- Top-down apartment reference logic
- Current game context screenshot

References are guidance only. Do not use reference images as final gameplay assets.

## Keep current gameplay object IDs

During integration, keep existing gameplay object IDs unless an intentional migration plan exists.

Recommended mapping layer:

- `existing_object_id`, current runtime object ID
- `state_id`, environment manifest state ID
- `room`, logical room
- `collision_shape`, rectangle or polygon from gameplay data
- `interaction_side`, approach side from prop list
- `anchor_point`, Art Bible anchor label and normalized XY
- `lighting_state`, optional overlay state

## Do not use one flat final map

A single AI or painted map may be used as a temporary concept underlay only. Final integration should keep playable structure separate:

- Floor material layer
- Wall mass layer
- Door and window layer
- Static prop layer
- Interactive prop sprites
- Lighting overlay layer
- Room zone data
- Movement collision data
- Object click targets

Why this matters:

- Click targets must match visible props.
- Collision must remain logical and debuggable.
- Doorways must match walkable openings.
- Lighting states must be swappable.
- Future prop animations need separate assets.

## Collision integration rules

- Walls are logical blockers.
- Doors are logical openings or closed blockers.
- Windows are non-walkable wall elements.
- Stairs use one clear transfer interaction side.
- Furniture uses simple solid footprints.
- Decorative clutter is non-blocking unless promoted to a gameplay object.
- Lighting overlays never affect collision.
- Pixel-color collision is not approved for this pass.

## Recommended renderer upgrade order

Phase 1, room structure:

1. Dark wall masses.
2. Dark blue-grey or charcoal floor materials.
3. Clear doorway openings.
4. Stair access visual.
5. Window cuts and basic exterior glow.

Phase 2, current gameplay props:

1. Couch.
2. TV.
3. Stereo.
4. Fridge.
5. Stove.
6. Kitchen sink.
7. Shower.
8. Toilet.
9. Front door.
10. Dog bowl.
11. Living light.
12. Bedroom light.
13. Stairs.
14. Bed.
15. Laptop desk.
16. Bookshelf.
17. Windows.

Phase 3, lighting overlays:

1. Base dark lighting.
2. Cyan neon strips.
3. Magenta neon strips.
4. Screen glow.
5. Window rain or city glow.
6. Kitchen practical.
7. Bathroom practical.
8. Alarm red future.

Phase 4, future spaces:

1. Basement access marker.
2. Basement plan and podcast desk.
3. Garage access marker.
4. Garage car bay and tool rack.
5. Travel launch marker.

## Mobile readability rules

- Test room silhouettes at small scale.
- Keep walls stronger than decorative texture.
- Keep prop click targets separate.
- Avoid clutter in walk lanes.
- Avoid neon bloom that hides linework.
- Avoid tiny labels as required gameplay information.

## Environment state implementation notes

Layout states:

- `ENV_FLOOR_1_BASE_LAYOUT`
- `ENV_FLOOR_2_BASE_LAYOUT`
- `ENV_FLOOR_1_NIGHT_LAYOUT`
- `ENV_FLOOR_1_CLUTTER_LIGHT`
- `ENV_FLOOR_1_CLUTTER_HEAVY`
- `ENV_FLOOR_1_CLEANED`

Room states:

- `ENV_LIVING_ROOM_BASE`
- `ENV_LIVING_ROOM_NEON_BASE`
- `ENV_KITCHEN_BASE`
- `ENV_KITCHEN_COOKING_ACTIVE`
- `ENV_BATHROOM_BASE`
- `ENV_BATHROOM_STEAM`
- `ENV_BEDROOM_BASE`
- `ENV_BEDROOM_NIGHT`
- `ENV_WORKSPACE_BASE`
- `ENV_WORKSPACE_SCREEN_GLOW`

Lighting states:

- `ENV_LIGHTING_BASE_DARK`
- `ENV_LIGHTING_NEON_CYAN`
- `ENV_LIGHTING_NEON_MAGENTA`
- `ENV_LIGHTING_SCREEN_GLOW`
- `ENV_LIGHTING_WINDOW_RAIN`
- `ENV_LIGHTING_KITCHEN_PRACTICAL`
- `ENV_LIGHTING_BATHROOM_PRACTICAL`
- `ENV_LIGHTING_ALARM_RED`

Prop states should use `ENV_PROP` naming when room-specific or environment-owned.

## QA gate before runtime integration

Do not integrate until QA confirms:

- Manifest JSON is valid.
- Every entry has required fields.
- Anchor labels match Art Bible allowed labels.
- Status values are valid Art Bible values.
- No source reference images are used as final assets.
- No runtime files were changed by the environment department.
- Door, wall, window, stair, and prop collision notes are clear.
- The apartment reads as realistic top-down cyberpunk, not cute or dollhouse-like.