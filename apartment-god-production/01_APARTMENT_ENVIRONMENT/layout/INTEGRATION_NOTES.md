# Future Codex Integration Notes

## Scope for the future integration pass

These notes are for the later Codex pass that connects the cyberpunk apartment art plan to the playable prototype. This production folder is a blueprint and manifest pass only. It should not be treated as gameplay implementation.

## Do not break current gameplay

- Keep existing gameplay object IDs unless there is an intentional migration plan.
- Keep current Floor 1 and Floor 2 room coverage.
- Keep stairs compatible with the existing floor transfer behavior.
- Keep existing click to move and object interaction behavior intact.
- Keep current doorway logic compatible with existing blueprint data.
- Do not change Render settings as part of this asset pass.
- Do not deploy from this branch unless explicitly instructed.

## Do not use a single flat background as final gameplay structure

A single AI generated apartment image can be useful as a paint reference, mood board, or floor underlay. It should not become the final gameplay map unless it is sliced or mapped into separate systems.

Required separation:

- Floor base art
- Wall masses
- Door and opening masks
- Window visuals
- Prop sprites
- Lighting overlays
- Click targets
- Movement collision
- Room zones

Why:

- A flat image breaks object clicking if hit zones do not match the art.
- A flat image can make collision impossible to maintain.
- A flat image makes future prop state animation harder.
- A flat image can hide current gameplay logic under decoration.

## Recommended renderer upgrade order

Phase 1, visual foundation:

1. Dark blue grey floor materials.
2. Black or near black wall masses.
3. Clean room boundaries.
4. Readable door gaps and stair access.
5. Basic cyan and magenta neon accents.

Phase 2, prop silhouettes:

1. Couch.
2. TV.
3. Stereo.
4. Kitchen appliances.
5. Bathroom props.
6. Bed.
7. Laptop desk.
8. Bookshelf.
9. Dog bowl.
10. Windows.

Phase 3, lighting states:

1. Lights on.
2. Lights dim.
3. Lights off or privacy.
4. TV glow only.
5. Laptop glow.
6. Stove glow.
7. Music and dance lighting.

Phase 4, future spaces:

1. Basement placeholder access.
2. Garage placeholder access.
3. Basement props.
4. Garage props.
5. Travel launch and car state.

## Existing data mapping guidance

Use the current gameplay data as the source of truth for object identity.

Known mapping targets:

- Existing `world.js` object IDs should map to new art asset IDs.
- Existing `blueprint.js` doorways should remain compatible.
- Existing stair transfer should map to `PROP_STAIRS_01`.
- Existing room names should remain recognizable to gameplay.

Do not rename live IDs during the asset art pass unless a migration table is created.

Suggested mapping layer:

- `object_id`, existing gameplay ID.
- `asset_id`, new manifest prop or environment ID.
- `room_id`, existing room name or logical room.
- `collision_shape`, data shape, not pixel derived.
- `interaction_side`, side or approach point from prop list.
- `lighting_state`, optional overlay ID.

## Collision guidance

Movement collision should remain tied to logical objects, room boundaries, and wall geometry, not pixels.

Recommended approach:

- Walls are logical blockers.
- Doors are logical openings.
- Props have simple boxes or polygons.
- Decorative clutter is non blocking unless promoted to a gameplay prop.
- Floor textures do not affect collision.
- Lighting overlays do not affect collision.

Avoid:

- Pixel color based collision.
- Collision drawn only by matching the art image.
- Doorways that look open but are blocked.
- Wall gaps that look walkable but are decoration.

## Room readability at mobile scale

Mobile scale rules:

- Strong room shapes before small details.
- Props should have clear silhouettes.
- Neon strips should guide room identity, not create noise.
- Clutter stays at edges.
- Clickable objects should not overlap visually.
- Avoid tiny labels as required gameplay information.

## Art slicing guidance

Each floor can use layered art:

1. Floor material layer.
2. Wall mass layer.
3. Static large prop layer.
4. Interactive prop sprites.
5. Lighting overlay layer.
6. State overlay layer.
7. UI or debug interaction overlay, if needed.

Interactive props should remain addressable as separate assets when possible.

## Manifest usage

`manifest_environment.json` should be used as the reference for:

- Environment state IDs.
- Prop asset IDs.
- Room assignment.
- Gameplay tags.
- Anchor points.
- Collision notes.
- Interaction notes.
- Current versus future status.

If a future Art Bible manifest template is restored, update the manifest without changing asset IDs unless required.

## Future basement and garage notes

Basement and garage are listed as future spaces. Do not wire them into current navigation until:

- Room logic exists.
- Access point exists.
- Collision zones exist.
- Camera framing exists.
- At least placeholder props exist.
- Gameplay actions exist.

Until then, basement hatch and garage connector should be visual future markers only.

## QA before integration merge

- No live runtime files were changed by this asset planning pass.
- New art assets map cleanly to existing object IDs.
- Doorways match collision openings.
- Wall masses match collision blockers.
- Stairs still transfer floors.
- Lighting states do not alter collision.
- Object click targets still match visible props.
- Mobile readability is checked.
- Basement and garage remain future unless intentionally enabled.