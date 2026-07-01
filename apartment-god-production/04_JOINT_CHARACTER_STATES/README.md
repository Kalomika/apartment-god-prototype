# Joint Character States

This folder defines the shared two-character sprite plan for Apartment God Prototype.

Joint states are used when the adult Black male and adult Black female visually interact as one combined sprite or a tightly coordinated sprite set. Most shared actions should be one combined sprite so the renderer can hide the solo sprites, draw the joint sprite at the shared anchor, then split both characters back into solo sprites when the action ends.

## Sources read

- `apartment-god-production/PRODUCTION_MANAGER_LOG.md`
- `apartment-god-production/DEPARTMENT_START_HERE.md`
- `apartment-god-production/DEPARTMENT_STATUS_BOARD.md`
- `apartment-god-production/00_ART_BIBLE/`
- `apartment-god-production/REFERENCE_LIBRARY/`
- `apartment-god-production/04_JOINT_CHARACTER_STATES/DEPARTMENT_LOG.md`
- `manifest_male.json` from `male-character-realistic-sprite-states`
- `manifest_female.json` from `female-character-realistic-sprite-states`
- `manifest_dog.json` from `dog-character-realistic-sprite-states`

## Style lock

- Realistic orthographic top-down linework.
- Adult Black male and adult Black female.
- Natural adult anatomy.
- Clothing-neutral fitted base sprites, not nude.
- Transparent PNG target for final art.
- Stable anchors and scale compatible with solo male, solo female, dog, furniture, and environment manifests.
- No chibi, no cute toy bodies, no mascot proportions, no oversized heads, no emoji body language.
- Bed and private states stay safe, clothed, implied, covered, or lights-off only.

## Folder map

- `bed_shared/`
- `couch_shared/`
- `conversation/`
- `hug/`
- `kiss/`
- `argument/`
- `dance/`
- `cook_together/`
- `eat_together/`
- `watch_tv/`
- `desk_shared/`
- `pet_dog_together/`
- `transitions/`
- `prompt_sheets/`

## Manifest files

`manifest_joint.json` is the primary Codex-consumable manifest. `manifest_joint_state_index.json` is a quick lookup index by category.

## Runtime boundary

This department creates planning files, prompts, and manifests only. It does not edit `src/`, does not deploy, does not change Render settings, and does not touch `Kalomika/ai-rpg-engine`.
