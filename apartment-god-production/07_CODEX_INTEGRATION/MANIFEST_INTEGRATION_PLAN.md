# Manifest Integration Plan

Branch: codex-manifest-integration-prep
Base branch: production-manifest-rollup
Runtime behavior changed in this branch: no

## Objective

Prepare a safe path for future visual integration by treating all production manifests as planning contracts, not as live asset availability. Future runtime work must load only real, original, QA-approved transparent PNG assets and must keep procedural fallbacks active when an asset is missing or unapproved.

## Current Runtime Baseline

The live prototype uses procedural canvas drawing:

- `src/renderWorld.js` draws floor rooms, walls, doorways, windows, and labels.
- `src/renderObjects.js` draws furniture, props, stairs, lights, and object state variants.
- `src/renderEntities.js` draws people and dog with simple shape-based poses.
- `src/state.js` stores `resident`, `girlfriend`, and `dog`.
- `src/config.js` defines current object and social action IDs.
- `src/actions.js`, `src/movement.js`, `src/sharedActions.js`, `src/fetchSystem.js`, `src/cooking.js`, `src/music.js`, and `src/training.js` update actions and poses.

No code in `src/` was changed for this prep branch.

## Environment Manifest Integration

Source manifest: `apartment-god-production/01_APARTMENT_ENVIRONMENT/manifest_environment.json`

Inventory:

- 51 entries.
- Categories: 23 `environment`, 28 `prop`.
- Status: all entries are `review`.
- Planned PNG files: 51.
- Existing department image files: 0.

Future integration strategy:

1. Keep procedural `drawWorld` and `drawObjects` as default rendering.
2. Add an approval-gated asset registry only after final environment PNGs exist.
3. Map current floor and room structures to environment state IDs.
4. Map object kinds to `ENV_PROP_*` IDs only when an approved PNG exists.
5. Preserve existing collision, doorways, room routing, floor switching, windows, lights, object movement, and build placement.
6. Keep lighting and object state overlays procedural until matching approved environment layers exist.

Pending approval before runtime work:

- Define an environment asset registry schema.
- Define draw order for base floor, room overlays, props, lighting, and procedural fallbacks.
- Add an asset availability check that returns false unless a PNG exists and has approved QA metadata.

## Male Manifest Integration

Source manifest: `apartment-god-production/02_MALE_CHARACTER/manifest_male.json`

Inventory:

- 69 entries.
- Status: all entries are `draft`.
- Planned PNG files: 194.
- Existing department image files: 0.

Future integration strategy:

1. Map runtime entity `id: resident`, `type: person` to the male manifest.
2. Keep procedural `drawPerson` active until approved male PNG frames exist.
3. Use current runtime `pose`, `action`, and movement direction as the input to future state resolution.
4. Use directional male states for walk/run only after a direction resolver is approved.
5. Use action-specific states for phone, laptop, cooking, eating, bathroom, reading, exercise, dog interaction, and reactions only when matching approved frames exist.
6. If any frame in a selected A/B/C set is missing or unapproved, render the procedural current prototype person instead.

Pending approval before runtime work:

- Add a non-visual manifest state resolver for resident state IDs.
- Add frame availability checks for all `frame_files`.
- Add a direction resolver based on current path or velocity.

## Female Manifest Integration

Source manifest: `apartment-god-production/03_FEMALE_CHARACTER/manifest_female.json`

Inventory:

- 67 entries.
- Status: all entries are `draft`.
- Planned PNG files: 178.
- Existing department image files: 0.

Future integration strategy:

1. Map runtime entity `id: girlfriend`, `type: person` to the female manifest.
2. Keep procedural `drawPerson` active until approved female PNG frames exist.
3. Resolve current broad runtime poses to the closest female manifest state.
4. Note that the female manifest currently uses coarse locomotion states `FEMALE_WALK_01` and `FEMALE_RUN_01`, not directional N/NE/E/SE/S/SW/W/NW state IDs.
5. Use exact action states for phone, laptop, cooking, eating, bathroom, reading, exercise, dog interaction, and reactions only when approved frames exist.
6. If the male and female manifests have asymmetric state coverage, do not invent female directional states or male states. Fall back to procedural drawing.

Pending approval before runtime work:

- Add a non-visual manifest state resolver for girlfriend state IDs.
- Decide whether future female locomotion should remain coarse or add directional state IDs through a later asset department update.

## Dog Manifest Integration

Source manifest: `apartment-god-production/05_DOG_CHARACTER/manifest_dog.json`

Inventory:

- 63 entries.
- Status: all entries are `draft`.
- Planned PNG files: 170.
- Existing department image files: 0.
- Entry shape: array records using manifest `entry_field_order`.

Future integration strategy:

1. Map runtime entity `id: dog`, `type: dog` to the dog manifest.
2. Keep procedural `drawDog` active until approved dog PNG frames exist.
3. Use movement direction for `DOG_WALK_*` and `DOG_RUN_*` only after a direction resolver is approved.
4. Map fetch phases to `DOG_FETCH_WAIT`, `DOG_FETCH_RUN`, `DOG_FETCH_CARRY`, and `DOG_FETCH_DROP` only when assets exist.
5. Map dog bowl use to `DOG_EAT_BOWL` and `DOG_BOWL_IDLE`.
6. Map pet/train/follow behavior to closest dog manifest IDs only when runtime intent is clear and approved assets exist.
7. If parser support for array entries is missing, do not attempt runtime dog manifest loading.

Pending approval before runtime work:

- Add parser support for dog array entries by `entry_field_order`.
- Add dog-specific direction and fetch phase state resolution.

## Joint Manifest Integration

Source manifest: `apartment-god-production/04_JOINT_CHARACTER_STATES/manifest_joint.json`

Inventory:

- 18 entries.
- Status: all entries are `draft`.
- Planned PNG files: 50.
- Existing department image files: 0.

Future integration strategy:

1. Treat joint states as combined shared sprites only after both characters are at the correct shared anchor.
2. Preserve current separate procedural character drawing until a complete joint PNG set is approved.
3. Map current shared actions to joint state IDs:
   - `watch_together` to `JOINT_WATCH_TV_TOGETHER_COUCH`.
   - `bed_together` to `JOINT_SLEEP_TOGETHER_BED_BACK_SIDE` or `JOINT_CUDDLE_BED_SIDE_01` based on final design approval.
   - `intimacy` to `JOINT_PRIVATE_MOMENT_SAFE_BED`.
   - `kiss` to `JOINT_KISS_STAND`.
   - `cuddle` to `JOINT_CUDDLE_COUCH_01` or `JOINT_CUDDLE_BED_SIDE_01` based on room/object context.
   - `talk` to `JOINT_CONVERSATION_STAND`.
4. Do not hide solo sprites unless the joint state has all required approved frames.
5. Use `character_anchor_offsets` from the joint manifest when drawing combined shared sprites later.
6. Keep safe/private states non-explicit and gameplay-safe.

Pending approval before runtime work:

- Add a joint state resolver that checks both actor positions, target object, room, and action ID.
- Add an atomic fallback: if the combined joint sprite cannot render, both solo procedural sprites remain visible.

## Safety Gates

These gates must pass before any future visual replacement:

- No reference images as runtime assets.
- No generated placeholders marked final.
- No deployment.
- No Render changes.
- No `main` branch modification.
- No `Kalomika/ai-rpg-engine` changes.
- No visual replacement until asset QA passes.
- No final art integration until transparent PNG files exist in production asset folders.
- No use of `.gitkeep` placeholder folders as asset availability.
- No invented sprite files or environment PNGs.
- No runtime behavior changes without explicit approval.

## Proposed Runtime Changes Pending Approval

No runtime changes were made in this branch. If approved later, implement in small guarded steps:

1. Add a read-only manifest inventory loader that can parse object-shaped manifests and dog array-shaped manifests.
2. Add an asset registry that requires file existence and approved QA status.
3. Add state resolvers that return future manifest state IDs but do not render PNGs unless assets are approved.
4. Add rendering fallback paths that preserve the current procedural visuals when any asset gate fails.
5. Add tests or validation scripts that check manifest shape and missing assets without altering gameplay behavior.

## Ready State

Ready for QA review of integration-prep documentation: yes.

Ready for final gameplay visual integration: no. Final integration remains blocked until original transparent PNG assets are generated and visually QA-approved.
