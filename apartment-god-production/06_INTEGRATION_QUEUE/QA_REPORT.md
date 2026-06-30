# Apartment God Production QA Report

## Summary

Overall status:

- Not ready for integration

This QA pass reviewed the requested Art Bible files and department folders as available across the current repo branches. The new QA branch was created from `main`, and `main` does not currently contain `apartment-god-production/`. The Art Bible and several department folders exist only on separate production branches. Until those folders are present together in one branch, Codex does not have one reliable integration source.

Approved assets: 0

Blocked or rework items: 12

Codex integration can begin: no

## Source Branches Checked

- `asset-qa-realistic-style-review`, new QA branch created from `main`
- `art-bible-production-structure`
- `apartment-environment-cyberpunk-assets`
- `male-character-realistic-sprite-states`
- `female-character-realistic-sprite-states`
- `dog-character-realistic-sprite-states`

The likely joint branch name `joint-character-realistic-sprite-states` was checked, but the requested joint folder was not found.

## Art Bible Compliance

Status: partial pass, blocked for integration

The Art Bible files exist on `art-bible-production-structure` and define the correct target clearly:

- realistic orthographic top-down style
- adult proportions
- no chibi, cute toy, mascot, emoji, or sticker style
- controlled cyberpunk palette with dark walls and cyan or magenta accents
- transparent PNG sprite target
- consistent state IDs, frame logic, anchor data, and manifests

However, the Art Bible is not present on the new QA branch created from `main`, and multiple department branches state that the Art Bible was missing during their production pass. Because the departments were built without direct Art Bible access at creation time, all department work needs a second normalization pass before approval.

## Folder Structure Review

Required folders:

| Folder | QA branch status | Source branch status | Result |
| --- | --- | --- | --- |
| `00_ART_BIBLE` | missing | present on `art-bible-production-structure` | blocker until merged or recreated |
| `01_APARTMENT_ENVIRONMENT` | missing | present on `apartment-environment-cyberpunk-assets` | blocker until merged or recreated |
| `02_MALE_CHARACTER` | missing | present on `male-character-realistic-sprite-states` | blocker until merged or recreated |
| `03_FEMALE_CHARACTER` | missing | present on `female-character-realistic-sprite-states` | blocker until merged or recreated |
| `04_JOINT_CHARACTER_STATES` | missing | not found | blocker |
| `05_DOG_CHARACTER` | missing | present on `dog-character-realistic-sprite-states` | blocker until merged or recreated |
| `06_INTEGRATION_QUEUE` | created by this QA pass | present now | pass |
| `07_REJECTED_OR_REWORK` | created by this QA pass | present now | pass |

## Environment Review

Status: partially ready as planning material, not ready for integration

Required files checked on `apartment-environment-cyberpunk-assets`:

- `README.md`, found
- `layout/ENV_LAYOUT_PLAN.md`, found
- `walls_doors_windows/WALL_DOOR_WINDOW_LANGUAGE.md`, found
- `rooms/ROOM_STYLE_GUIDE.md`, found
- `props/PROP_ASSET_LIST.md`, found
- `lighting/LIGHTING_STYLE_GUIDE.md`, found
- `manifest_environment.json`, found
- `layout/INTEGRATION_NOTES.md`, found

Pass notes:

- Floor 1 is defined with entry, living room, kitchen, bathroom, and stairs.
- Floor 2 is defined with stairs, hall, bedroom, office, and upstairs bathroom.
- Future basement is defined as basement lounge, podcast desk area, utility wall, storage clutter, and optional studio booth.
- Future garage is defined as car bay, tool wall, storage lane, travel launch zone, and exterior roll-up door.
- Room purposes are clear.
- Collision notes exist for walls, doors, props, stairs, floor transitions, basement, and garage.
- Prop IDs map to current gameplay concepts where possible, including couch, TV, stereo, fridge, stove, sink, shower, toilet, front door, dog bowl, lights, stairs, bed, laptop desk, bookshelf, and windows.
- Wall and doorway visual rules support collision logic.
- The environment is planned as layered gameplay art, not a single flat decorative background.

Rework notes:

- `manifest_environment.json` uses `anchor_point: "center"` instead of the Art Bible anchor object with approved labels and normalized coordinates.
- `manifest_environment.json` uses `status: "current"` and `status: "future"`, but the Art Bible allows `draft`, `review`, `approved`, `rework`, and `rejected`.
- Environment frame filenames are lowercase, but the Art Bible naming rule requires uppercase snake case for runtime-ready files.
- No final transparent PNG art files were confirmed.

## Male Character Review

Status: partially ready as planning material, not ready for integration

Required files checked on `male-character-realistic-sprite-states`:

- `README.md`, found
- `MALE_STATE_BREAKDOWN.md`, found
- `manifest_male.json`, found
- `prompt_sheets/MALE_GENERATION_PROMPTS.md`, found

Pass notes:

- Visual target is realistic top-down adult Black male.
- The folder explicitly rejects chibi, cute toy, mascot, oversized head, and emoji pose language.
- Required categories are represented: idle, walk, run, sit, sleep, phone, laptop, cooking, eating, shower_bathroom, reading, exercise, pet_dog, social_solo, and transitions.
- States include frame counts and A/B/C logic or documented B-only sleep exceptions.
- Implementation notes exist in the manifest and readable breakdown.
- Runtime safety notes confirm no `src/`, Render, or deploy changes.

Rework notes:

- State IDs do not match the master Art Bible state IDs. Example, `MALE_WALK_01` should be normalized toward directional state IDs such as `MALE_WALK_N`, `MALE_WALK_E`, or a documented approved shorthand.
- `manifest_male.json` uses `states` instead of the Art Bible template field `entries`.
- `manifest_male.json` uses `status: "prompt_ready"`, which is not an allowed Art Bible status.
- `manifest_male.json` uses `anchor_point: "center_body_ground_projection"`, which is not an approved anchor label.
- No final transparent PNG sprite frames were confirmed.

## Female Character Review

Status: planning material only, not ready for integration

Required files checked on `female-character-realistic-sprite-states`:

- `README.md`, found
- `FEMALE_STATE_BREAKDOWN.md`, found
- `manifest_female.json`, missing
- `prompt_sheets/FEMALE_GENERATION_PROMPTS.md`, found

Pass notes:

- Visual target is realistic top-down adult Black female.
- The folder explicitly rejects chibi, cute mascot styling, oversized head, childish proportions, and emoji pose language.
- Required categories are represented: idle, walk, run, sit, sleep, phone, laptop, cooking, eating, shower_bathroom, reading, exercise, pet_dog, social_solo, and transitions.
- States include frame counts and A/B/C logic or documented B-only sleep exceptions.
- Runtime safety notes confirm no `src/`, Render, or deploy changes.

Rework notes:

- `manifest_female.json` is missing.
- State IDs do not match the master Art Bible state IDs and need normalization.
- No final transparent PNG sprite frames were confirmed.
- Anchor labels and normalized anchor coordinates are not manifest-ready.

## Dog Character Review

Status: planning material only, not ready for integration

Required files checked on `dog-character-realistic-sprite-states`:

- `README.md`, found
- `DOG_STATE_BREAKDOWN.md`, found
- `manifest_dog.json`, missing
- `prompt_sheets/DOG_GENERATION_PROMPTS.md`, found

Pass notes:

- Dog starts white/off-white.
- Dog is planned as recolor-friendly later.
- Dog is realistic, not a cute mascot.
- Fetch carry and drop states are clearly planned.
- Bowl interaction states exist for eating and drinking.
- Comfort states exist.
- Required categories are represented: idle, walk, run, sit, sleep, bark, sniff, fetch, eat_drink, play, comfort, follow, and transitions.

Rework notes:

- `manifest_dog.json` is missing.
- State IDs do not match the master Art Bible state IDs and need normalization.
- No final transparent PNG sprite frames were confirmed.
- Anchor labels and normalized anchor coordinates are not manifest-ready.

## Joint State Review

Status: not found, blocked

Required files were not found:

- `README.md`
- `JOINT_STATE_BREAKDOWN.md`
- `manifest_joint.json`
- `prompt_sheets/JOINT_GENERATION_PROMPTS.md`

Required joint categories could not be verified:

- hug
- kiss
- hold_hands
- cuddle_couch
- cuddle_bed
- sleep_together
- watch_tv_together
- eating_together
- comfort
- pet_dog_together
- private_moment_safe
- transitions

Required joint rules could not be verified:

- safe and non-explicit staging
- implied private moments through lights-off, blanket coverage, or privacy silhouette
- combined two-person sprites
- anchors such as `joint_center`, `couch_center`, `bed_center`, `table_center`, or `dog_interaction_center`

## Manifest Review

Status: fail for integration

- Environment manifest, found, but schema deviates from Art Bible template.
- Male manifest, found, but schema deviates from Art Bible template.
- Female manifest, missing.
- Dog manifest, missing.
- Joint manifest, missing.
- Consolidated registry, created with zero approved assets.

No entries were copied into `asset_registry.json` because no manifest entry reached a clean `approved` state with confirmed final transparent PNG files.

## Naming Review

Status: needs revision

Wrong or risky naming patterns:

- Environment frames use lowercase filenames such as `env_floor_1_base_layout.png`, should be uppercase snake case before runtime approval.
- Male states use numbered shorthand such as `MALE_WALK_01`, while the Art Bible lists directional movement states such as `MALE_WALK_N`, `MALE_WALK_NE`, `MALE_WALK_E`, and related directions.
- Female states use numbered shorthand such as `FEMALE_WALK_01`, while the Art Bible lists directional movement states.
- Dog states use numbered shorthand such as `DOG_WALK_01`, while the Art Bible lists directional movement states.
- Joint state IDs could not be reviewed because the folder was not found.

## Style Drift Review

Status: no final art available to judge visually

The planning documents strongly reject cute, chibi, mascot, toy, and emoji style. That passes as written direction. However, no actual final PNG sprites or environment art were available in the reviewed files, so visual style compliance cannot be approved yet.

Any future art must be rejected or sent to rework if it shows:

- oversized heads
- childish proportions
- cute toy silhouettes
- plush dog or puppy mascot treatment
- emoji acting
- thick cartoon outlines
- flat app-icon colors
- AI anatomy errors
- broken hands, limbs, paws, or fused forms
- side-view poses that do not read from the top-down apartment camera

## Runtime Safety Review

Status: pass for reviewed department branches

The compared department branches add only `apartment-god-production/` files. No `src/` runtime files were changed in the Art Bible, environment, male, female, or dog department branches reviewed. The QA branch output created only production QA files under `apartment-god-production/`.

## Final Decision

Decision: needs revision

The project is not ready for Codex visual integration. The planning foundation is useful, but the assets are not approved because the production folders are split across branches, the joint folder is missing, several manifests are missing or non-compliant, and no final transparent PNG assets were verified.
