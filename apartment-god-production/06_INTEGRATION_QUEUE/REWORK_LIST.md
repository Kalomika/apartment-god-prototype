# Rework List

## Blockers

- Department: Production structure
- File: `apartment-god-production/`
- Problem: `apartment-god-production/` is not present on `main` or the new QA branch except for this integration queue output.
- Required fix: Bring the Art Bible, reference library, and all department folders into one production branch before Codex integration.
- Priority: blocker

- Department: Reference Library
- File: `apartment-god-production/REFERENCE_LIBRARY/`
- Problem: The required shared reference library was not found in the repo or in the uploaded workspace during this QA pass. `apartment_god_shared_reference_pack.zip` was not accessible to inspect.
- Required fix: Add or unpack `apartment_god_shared_reference_pack.zip` into `apartment-god-production/REFERENCE_LIBRARY/`, including `01_environment_references/`, `02_human_realistic_topdown_linework/`, `03_dog_references/`, `README_REFERENCE_USE.md`, and `reference_manifest.json`.
- Priority: blocker

- Department: Art Bible
- File: `apartment-god-production/00_ART_BIBLE/`
- Problem: Art Bible exists on `art-bible-production-structure`, but is missing from the QA branch created from `main`.
- Required fix: Merge or recreate the complete Art Bible folder into the production review branch.
- Priority: blocker

- Department: Apartment Environment
- File: `apartment-god-production/01_APARTMENT_ENVIRONMENT/`
- Problem: Environment department exists on `apartment-environment-cyberpunk-assets`, but is missing from the QA branch created from `main`.
- Required fix: Merge or recreate the environment folder into the production review branch before integration review.
- Priority: blocker

- Department: Male Character
- File: `apartment-god-production/02_MALE_CHARACTER/`
- Problem: Male department exists on `male-character-realistic-sprite-states`, but is missing from the QA branch created from `main`.
- Required fix: Merge or recreate the male character folder into the production review branch before integration review.
- Priority: blocker

- Department: Female Character
- File: `apartment-god-production/03_FEMALE_CHARACTER/`
- Problem: Female department exists on `female-character-realistic-sprite-states`, but is missing from the QA branch created from `main`.
- Required fix: Merge or recreate the female character folder into the production review branch before integration review.
- Priority: blocker

- Department: Joint Character States
- File: `apartment-god-production/04_JOINT_CHARACTER_STATES/`
- Problem: Joint character state folder was not found during this QA pass.
- Required fix: Create the joint character department with `README.md`, `JOINT_STATE_BREAKDOWN.md`, `manifest_joint.json`, and `prompt_sheets/JOINT_GENERATION_PROMPTS.md`.
- Priority: blocker

- Department: Dog Character
- File: `apartment-god-production/05_DOG_CHARACTER/`
- Problem: Dog department exists on `dog-character-realistic-sprite-states`, but is missing from the QA branch created from `main`.
- Required fix: Merge or recreate the dog character folder into the production review branch before integration review.
- Priority: blocker

- Department: Rejected or Rework
- File: `apartment-god-production/07_REJECTED_OR_REWORK/`
- Problem: Required folder was not present before this QA pass.
- Required fix: Keep this folder as the holding area for failed art, failed manifests, and rejected production outputs.
- Priority: high

## Manifest and Schema Issues

- Department: Apartment Environment
- File: `apartment-god-production/01_APARTMENT_ENVIRONMENT/manifest_environment.json`
- Problem: Manifest uses `anchor_point: "center"` instead of the Art Bible anchor object with approved labels and normalized coordinates.
- Required fix: Replace every anchor with an object like `{ "label": "object_center", "normalized_xy": [0.5, 0.5] }` or the correct Art Bible label for the asset.
- Priority: high

- Department: Apartment Environment
- File: `apartment-god-production/01_APARTMENT_ENVIRONMENT/manifest_environment.json`
- Problem: Manifest uses statuses like `current` and `future`, but the Art Bible allows only `draft`, `review`, `approved`, `rework`, and `rejected`.
- Required fix: Convert status values to the Art Bible status set, and use tags or notes to mark current versus future gameplay scope.
- Priority: high

- Department: Male Character
- File: `apartment-god-production/02_MALE_CHARACTER/manifest_male.json`
- Problem: Manifest uses `states` instead of the Art Bible `entries` array.
- Required fix: Convert the manifest to the Art Bible manifest template.
- Priority: high

- Department: Male Character
- File: `apartment-god-production/02_MALE_CHARACTER/manifest_male.json`
- Problem: Manifest uses `status: "prompt_ready"`, which is not an allowed Art Bible status.
- Required fix: Use `draft`, `review`, `approved`, `rework`, or `rejected` only.
- Priority: high

- Department: Male Character
- File: `apartment-god-production/02_MALE_CHARACTER/manifest_male.json`
- Problem: Manifest uses `anchor_point: "center_body_ground_projection"`, which is not an approved Art Bible anchor label.
- Required fix: Use the correct anchor labels such as `feet_center`, `seat_center`, `bed_center`, or `body_center`, plus normalized coordinates.
- Priority: high

- Department: Female Character
- File: `apartment-god-production/03_FEMALE_CHARACTER/manifest_female.json`
- Problem: Required manifest is missing.
- Required fix: Create a valid Art Bible compliant manifest for every female state.
- Priority: blocker

- Department: Dog Character
- File: `apartment-god-production/05_DOG_CHARACTER/manifest_dog.json`
- Problem: Required manifest is missing.
- Required fix: Create a valid Art Bible compliant manifest for every dog state.
- Priority: blocker

- Department: Joint Character States
- File: `apartment-god-production/04_JOINT_CHARACTER_STATES/manifest_joint.json`
- Problem: Required manifest is missing because the department folder was not found.
- Required fix: Create a valid Art Bible compliant manifest for every joint state.
- Priority: blocker

## Naming and State ID Issues

- Department: Environment
- File: `apartment-god-production/01_APARTMENT_ENVIRONMENT/manifest_environment.json`
- Problem: Planned frame filenames are lowercase, for example `env_floor_1_base_layout.png`.
- Required fix: Rename planned runtime files to uppercase snake case matching the state ID, for example `ENV_FLOOR_1_BASE_LAYOUT.png`.
- Priority: high

- Department: Male Character
- File: `apartment-god-production/02_MALE_CHARACTER/MALE_STATE_BREAKDOWN.md`
- Problem: State IDs use numbered shorthand such as `MALE_WALK_01`, while the Art Bible lists approved directional state IDs such as `MALE_WALK_N`, `MALE_WALK_NE`, and `MALE_WALK_E`.
- Required fix: Normalize movement state IDs to the Art Bible list or document and approve an intentional shorthand in the Art Bible first.
- Priority: high

- Department: Female Character
- File: `apartment-god-production/03_FEMALE_CHARACTER/FEMALE_STATE_BREAKDOWN.md`
- Problem: State IDs use numbered shorthand such as `FEMALE_WALK_01`, while the Art Bible lists approved directional state IDs.
- Required fix: Normalize movement state IDs to the Art Bible list or document and approve an intentional shorthand in the Art Bible first.
- Priority: high

- Department: Dog Character
- File: `apartment-god-production/05_DOG_CHARACTER/DOG_STATE_BREAKDOWN.md`
- Problem: State IDs use numbered shorthand such as `DOG_WALK_01`, while the Art Bible lists approved directional state IDs.
- Required fix: Normalize movement state IDs to the Art Bible list or document and approve an intentional shorthand in the Art Bible first.
- Priority: high

## Asset Approval Issues

- Department: All Departments
- File: All final sprite or environment art files
- Problem: No final transparent PNG production art was available for approval in this QA pass.
- Required fix: Generate or import original transparent PNG assets, do not commit source reference images as final gameplay art, then list each file in its department manifest.
- Priority: blocker

- Department: All Departments
- File: Department manifests
- Problem: No manifest entry was verified with `status: "approved"` and confirmed final art files.
- Required fix: Keep entries in draft or review until style QA approves the actual art.
- Priority: blocker

- Department: All Departments
- File: Reference handling
- Problem: The required shared reference pack could not be inspected, so pose reuse and style reference compliance could not be verified.
- Required fix: Inspect the environment, human, dog, README, and reference manifest files before producing final department assets.
- Priority: blocker
