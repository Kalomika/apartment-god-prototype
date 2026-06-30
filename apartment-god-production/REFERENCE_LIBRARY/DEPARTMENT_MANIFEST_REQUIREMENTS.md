# Department Manifest Requirements

Every production department must create and maintain its own manifest.

Required department manifests:

- `apartment-god-production/01_APARTMENT_ENVIRONMENT/manifest_environment.json`
- `apartment-god-production/02_MALE_CHARACTER/manifest_male.json`
- `apartment-god-production/03_FEMALE_CHARACTER/manifest_female.json`
- `apartment-god-production/05_DOG_CHARACTER/manifest_dog.json`
- Future joint or integration manifests when those departments exist

## Required fields for every state

Every state entry must include:

- `state_id`
- `action_name`
- `frame_count`
- `frames`
- `abc_frame_logic`
- `gameplay_tags`
- `anchor_point`
- `scale_notes`
- `implementation_notes`
- `status`

## State ID rule

Use Art Bible approved state IDs whenever they exist. State IDs must use uppercase snake case.

Examples:

- `MALE_IDLE_STAND`
- `FEMALE_LAPTOP_DESK_TYPING`
- `DOG_WALK_E`
- `ENV_LIVING_ROOM_NEON_BASE`
- `PROP_COUCH_01`

## Frame file rule

Runtime ready frame files should follow the Art Bible naming pattern:

`STATE_ID_FRAME_VARIANT.png`

Examples:

- `MALE_IDLE_STAND_01_A.png`
- `FEMALE_SLEEP_BED_SOLO_02_A.png`
- `DOG_WALK_E_03_A.png`
- `ENV_FLOOR_1_BASE_LAYOUT_01_A.png`
- `PROP_COUCH_01_01_A.png`

## A/B/C frame logic

Use this shared production interpretation:

- A means enter, anticipation, or transition into the action.
- B means main hold pose or loop frame 1.
- C means exit, recovery, or loop frame 2.

Simple idle:

- A means neutral.
- B means subtle breathing or weight shift.

Walking and running:

- A, B, and C form a low frame loop.

Sleeping and resting:

- Use multiple random hold poses.
- Do not over animate sleep yet.

## Anchor point rule

Use Art Bible anchor labels:

- `feet_center` for standing, walking, running, and standing phone states
- `seat_center` for chair, desk, couch, and eating states
- `bed_center` for bed states
- `body_center` for floor, dog idle, dog sleep, dog sniff, dog bark, and similar body centered states
- `object_center` for props, rooms, lights, and environment elements
- `joint_center` for two person or shared action states

## Status values

Use Art Bible status values:

- `draft`
- `review`
- `approved`
- `rework`
- `rejected`

Use a separate field such as `production_phase` for current or future planning. Do not use current or future as the QA status value.

## Required example entry

```json
{
  "state_id": "MALE_LAPTOP_DESK_TYPING",
  "action_name": "Laptop desk typing",
  "frame_count": 3,
  "frames": [
    { "frame_index": 1, "file": "MALE_LAPTOP_DESK_TYPING_01_A.png", "duration": 120 },
    { "frame_index": 2, "file": "MALE_LAPTOP_DESK_TYPING_02_A.png", "duration": 120 },
    { "frame_index": 3, "file": "MALE_LAPTOP_DESK_TYPING_03_A.png", "duration": 120 }
  ],
  "abc_frame_logic": {
    "A": "Seated chair transition into laptop posture.",
    "B": "Main typing hold, loop frame 1.",
    "C": "Typing variation or recovery, loop frame 2."
  },
  "gameplay_tags": ["male", "laptop", "desk", "work", "top_down"],
  "anchor_point": {
    "label": "seat_center",
    "normalized_xy": [0.5, 0.58]
  },
  "scale_notes": "Adult realistic top down body scale. Match laptop desk and chair scale.",
  "implementation_notes": "Use seated chair reference as transition base. Transparent PNG frames. Do not integrate until QA approved.",
  "production_phase": "current",
  "status": "draft"
}
```

## Approval checklist

A manifest entry is not complete unless it defines:

- The action name in plain language.
- The frame count and frame files.
- A/B/C frame intent.
- Gameplay tags.
- A valid anchor label and normalized anchor point.
- Scale notes tied to the apartment world.
- Implementation notes for Codex or the next art pass.
- A valid QA status.