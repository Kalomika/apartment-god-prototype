# Naming Conventions

Use consistent, searchable names for every production asset. File names, manifest state IDs, folder names, and review notes must match the same vocabulary.

## Core Rule

Runtime-ready sprite files use uppercase snake case:

`CATEGORY_ACTION_CONTEXT_FRAME_VARIANT.png`

For character files, the category is also the character type:

`MALE_WALK_01_A.png`

`FEMALE_SLEEP_BED_SOLO_02_B.png`

`DOG_FETCH_CARRY_01_A.png`

`JOINT_CUDDLE_COUCH_01_B.png`

`ENV_LIVING_ROOM_NEON_BASE.png`

The planning shorthand is:

`CATEGORY_CHARACTER_ACTION_VARIANT_FRAME.png`

When exporting actual frame files, put the frame number before the variant letter so files sort correctly in folders.

## Allowed Categories

- MALE
- FEMALE
- DOG
- JOINT
- ENV
- PROP
- LIGHTING

## State ID Rule

The beginning of the file name should match the manifest `state_id` whenever possible.

Example:

State ID:

`MALE_LAPTOP_DESK_TYPING`

Frames:

- MALE_LAPTOP_DESK_TYPING_01_A.png
- MALE_LAPTOP_DESK_TYPING_02_A.png
- MALE_LAPTOP_DESK_TYPING_03_A.png
- MALE_LAPTOP_DESK_TYPING_04_A.png

## Frame Number Rule

Use two digit frame numbers for short actions.

- 01
- 02
- 03
- 04

Use three digit frame numbers only if the action needs 100 or more frames.

## Variant Rule

Use a final letter for art variants.

- A means first production attempt.
- B means revised pose or design.
- C means later alternate.
- FINAL is only allowed after QA approval.

Examples:

- MALE_WALK_E_01_A.png
- MALE_WALK_E_01_B.png
- MALE_WALK_E_01_FINAL.png

## Direction Rule

Directional states use the final direction token before the frame number.

Allowed direction tokens:

- N
- NE
- E
- SE
- S
- SW
- W
- NW

Examples:

- MALE_WALK_N_01_A.png
- FEMALE_RUN_SW_03_A.png
- DOG_WALK_E_02_B.png

## Environment Naming Rule

Environment files should name the room, object, or lighting state clearly.

Examples:

- ENV_FLOOR_1_BASE_LAYOUT.png
- ENV_LIVING_ROOM_NEON_BASE.png
- ENV_BEDROOM_NIGHT_BASE.png
- ENV_KITCHEN_COOKING_ACTIVE.png
- ENV_LIGHTING_SCREEN_GLOW.png
- ENV_PROP_CABLE_CLUSTER_01_A.png

## Folder Rule

Place files inside the folder matching their character, state, or environment type.

Examples:

- apartment-god-production/02_MALE_CHARACTER/walk/MALE_WALK_E_01_A.png
- apartment-god-production/03_FEMALE_CHARACTER/laptop/FEMALE_LAPTOP_DESK_TYPING_01_A.png
- apartment-god-production/05_DOG_CHARACTER/fetch/DOG_FETCH_CARRY_01_A.png
- apartment-god-production/01_APARTMENT_ENVIRONMENT/rooms/ENV_LIVING_ROOM_NEON_BASE.png

## Manifest Rule

Every asset file must appear in the matching manifest.

Required manifest links:

- Male assets go in `manifest_male.json`.
- Female assets go in `manifest_female.json`.
- Dog assets go in `manifest_dog.json`.
- Joint assets go in `manifest_joint.json`.
- Environment assets go in `manifest_environment.json`.
- Approved integration files also go in `06_INTEGRATION_QUEUE/asset_registry.json`.

## Do Not Use

Do not use:

- Spaces.
- Lowercase state IDs.
- Random abbreviations.
- Personal notes in filenames.
- Words like final, done, new, fixed, or latest unless QA has approved the asset.
- File names copied from downloaded references.
- Watermark source names.
- Runtime names that do not match the art bible.
