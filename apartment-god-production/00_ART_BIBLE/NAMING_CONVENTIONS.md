# Naming Conventions

Use consistent names for every production asset, planned frame, manifest entry, and QA note.

## Core file rule

Production sprite files use uppercase snake case.

Pattern:

```txt
CATEGORY_ACTION_CONTEXT_FRAME_VARIANT.png
```

The beginning of the filename should match the state ID whenever possible.

Examples:

```txt
MALE_WALK_E_01_A.png
FEMALE_SLEEP_BED_SOLO_SIDE_02_B.png
DOG_FETCH_CARRY_01_A.png
JOINT_CUDDLE_COUCH_01_B.png
ENV_LIVING_ROOM_NEON_BASE.png
```

## Category prefixes

Allowed primary category prefixes:

- MALE
- FEMALE
- DOG
- JOINT
- ENV
- QA
- INTEGRATION

Use `PROP` only when a standalone prop is not room-specific. Environment props should usually use `ENV_PROP`.

## State ID rule

State IDs must be uppercase snake case and must appear in the correct manifest.

Examples:

```txt
MALE_LAPTOP_DESK_TYPING
FEMALE_COOKING_COUNTER_PREP
DOG_SLEEP_DOG_BED_CURLED
JOINT_SLEEP_TOGETHER_BED_CURLED
ENV_FLOOR_1_BASE_LAYOUT
```

## Frame number rule

Use two digit frame numbers for normal A/B/C sets.

Examples:

```txt
01
02
03
```

Use three digit frame numbers only for actions with 100 or more frames.

## Variant rule

Use the final letter to track production variants.

- A = first production attempt or first planned frame role.
- B = revised frame or loop frame 1.
- C = exit, recovery, or loop frame 2.
- FINAL = QA-approved final export only.

For A/B/C frame logic, the variant letter should match the frame role unless the department manifest explains otherwise.

Examples:

```txt
MALE_IDLE_STAND_01_A.png
MALE_IDLE_STAND_02_B.png
MALE_LAPTOP_DESK_TYPING_01_A.png
MALE_LAPTOP_DESK_TYPING_02_B.png
MALE_LAPTOP_DESK_TYPING_03_C.png
```

## Direction rule

Directional movement states use direction tokens before the frame number.

Allowed tokens:

- N
- NE
- E
- SE
- S
- SW
- W
- NW

Examples:

```txt
MALE_WALK_N_01_A.png
FEMALE_RUN_SW_03_C.png
DOG_WALK_E_02_B.png
```

## Environment naming rule

Environment files must identify room, layout, prop, or lighting state.

Examples:

```txt
ENV_FLOOR_1_BASE_LAYOUT.png
ENV_LIVING_ROOM_NEON_BASE.png
ENV_BEDROOM_NIGHT_BASE.png
ENV_KITCHEN_COOKING_ACTIVE.png
ENV_LIGHTING_SCREEN_GLOW.png
ENV_PROP_CABLE_CLUSTER_01_A.png
```

## Folder placement rule

Place files inside the matching department folder.

Examples:

```txt
apartment-god-production/02_MALE_CHARACTER/walk/MALE_WALK_E_01_A.png
apartment-god-production/03_FEMALE_CHARACTER/laptop/FEMALE_LAPTOP_DESK_TYPING_01_A.png
apartment-god-production/05_DOG_CHARACTER/fetch/DOG_FETCH_CARRY_01_A.png
apartment-god-production/01_APARTMENT_ENVIRONMENT/rooms/ENV_LIVING_ROOM_NEON_BASE.png
```

## Manifest placement rule

Every production asset or planned asset must appear in the matching manifest.

- Male assets go in `manifest_male.json`.
- Female assets go in `manifest_female.json`.
- Dog assets go in `manifest_dog.json`.
- Joint assets go in `manifest_joint.json`.
- Environment assets go in `manifest_environment.json`.
- Approved assets also go in `06_INTEGRATION_QUEUE/asset_registry.json`.

## Do not use

Do not use:

- Spaces.
- Lowercase state IDs.
- Random abbreviations.
- Personal notes in filenames.
- `final`, `done`, `new`, `fixed`, or `latest` unless QA has approved the asset.
- Downloaded reference file names.
- Watermark source names.
- Runtime names that ignore the Art Bible.