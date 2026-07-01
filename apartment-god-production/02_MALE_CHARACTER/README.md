# 02_MALE_CHARACTER

This department contains the production plan for the upgraded male character sprite set for Apartment God Prototype.

Branch: `male-character-realistic-sprite-states`

## Purpose

Create the realistic top-down adult Black male sprite structure for the cyberpunk apartment life-sim upgrade. This pass is planning, prompts, state logic, and manifests only. It does not create final sprite sheets and does not integrate runtime code.

## Required sources read

- `apartment-god-production/PRODUCTION_MANAGER_LOG.md`
- `apartment-god-production/DEPARTMENT_START_HERE.md`
- `apartment-god-production/DEPARTMENT_STATUS_BOARD.md`
- `apartment-god-production/00_ART_BIBLE/README.md`
- `apartment-god-production/00_ART_BIBLE/VISUAL_STYLE_GUIDE.md`
- `apartment-god-production/00_ART_BIBLE/SPRITE_STATE_LIST.md`
- `apartment-god-production/00_ART_BIBLE/NAMING_CONVENTIONS.md`
- `apartment-god-production/00_ART_BIBLE/SCALE_AND_ANCHOR_GUIDE.md`
- `apartment-god-production/00_ART_BIBLE/COLOR_PALETTE.md`
- `apartment-god-production/00_ART_BIBLE/MANIFEST_TEMPLATE.json`
- `apartment-god-production/00_ART_BIBLE/STYLE_QA_CHECKLIST.md`
- `apartment-god-production/REFERENCE_LIBRARY/README_REFERENCE_USE.md`
- `apartment-god-production/REFERENCE_LIBRARY/reference_manifest.json`
- `apartment-god-production/02_MALE_CHARACTER/DEPARTMENT_LOG.md`

## Visual target

All male sprite work must follow the Art Bible:

- realistic orthographic top-down linework
- adult Black male character base
- adult proportions
- clothing-neutral base look, not nude
- simple fitted tank, tee, fitted shorts, fitted leggings, sleepwear, or safe mannequin line-art with no explicit detail
- realistic head size
- natural shoulders, hips, spine, elbows, knees, wrists, hands, and feet
- readable top-down silhouette at gameplay scale
- compatible with female, dog, joint state, furniture, bed, couch, and chair scale

Rejected immediately:

- chibi
- cute toy body
- mascot proportions
- oversized head
- emoji body language
- sticker style
- childlike adult body
- nude or explicit body detail
- source references used as final assets

## Reference Library use

Primary human pose source:

`apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/`

Relevant files listed in the installed manifest include:

- `HUMAN_REF_01_MIXED_TOPDOWN_POSES_FULL_SHEET.png`
- `HUMAN_REF_02_SLEEP_BED_POSE_SHEET.jpg`
- `HUMAN_REF_03_BED_SOCIAL_REST_POSE_SHEET.jpg`
- `HUMAN_REF_04_DESK_WORK_GROUP_TOPDOWN.jpg`
- `HUMAN_REF_05_DESK_SEATED_YOGA_LINEWORK.jpg`
- `HUMAN_REF_06_DAILY_ACTION_LINEWORK.jpg`
- `HUMAN_REF_07_STOCK_TOPDOWN_MOVEMENT_SHEET.jpg`
- `HUMAN_REF_09_DESK_PHONE_YOGA_SELECTED_POSES.jpg`
- `HUMAN_REF_10_STANDING_CROUCH_DOG_POSE_SHEET.jpg`

Dog interaction spacing source:

- `03_dog_references/DOG_REF_01_TOPDOWN_ANIMAL_POSE_SHEET.jpg`

Environment scale and mood source:

- `01_environment_references/ENV_REF_01_TOPDOWN_APARTMENT_MAP.jpg`
- `01_environment_references/ENV_REF_02_DARK_CYBERPUNK_APARTMENT_MAP.jpg`

Reference images are visual guidance only. They are not final gameplay assets.

## Frame logic

Most states use A/B/C.

```txt
A = entry, anticipation, transition, or low-frame loop pose
B = main hold pose or loop frame 1
C = exit, recovery, or loop frame 2
```

Idle uses A/B.

Sleep and rest use randomized holds instead of constant animation.

Laptop, phone, eating, cooking, bathroom, and reading states usually enter on A and loop B/C.

Walk and run use A/B/C loops.

## Anchor rules

The manifest follows `SCALE_AND_ANCHOR_GUIDE.md`:

- standing, walk, run, standing phone, standing reactions: `feet_center`, normalized `[0.5, 0.86]`
- seated chair, couch, table, desk, phone couch, laptop desk, eating: `seat_center`, normalized `[0.5, 0.62]`
- bed sleep and bed transitions: `bed_center`, normalized `[0.5, 0.5]`
- floor, crouch, exercise, dog interaction, floor transitions: `body_center`, normalized `[0.5, 0.5]`

## Files in this department

- `README.md`
- `MALE_STATE_BREAKDOWN.md`
- `manifest_male.json`
- `manifest_male_state_index.json`
- `prompt_sheets/MALE_GENERATION_PROMPTS.md`
- category folders with `.gitkeep` placeholders until original transparent PNG assets are produced

## Runtime safety

This department does not edit `src/`, does not deploy, does not change Render settings, and does not touch `Kalomika/ai-rpg-engine`.
