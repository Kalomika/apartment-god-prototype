# Female Character Sprite Department

This folder contains the reconciled production plan for the realistic top-down adult Black female sprite set for Apartment God Prototype.

This is a planning and manifest-readiness department only. It does not contain runtime integration code and must not be wired into `src/` until QA and integration explicitly approve it.

## Sources read

Required manager and department files were read from `art-bible-production-structure`:

- `apartment-god-production/PRODUCTION_MANAGER_LOG.md`
- `apartment-god-production/DEPARTMENT_START_HERE.md`
- `apartment-god-production/DEPARTMENT_STATUS_BOARD.md`
- `apartment-god-production/03_FEMALE_CHARACTER/DEPARTMENT_LOG.md`

Final Art Bible files were read:

- `00_ART_BIBLE/README.md`
- `00_ART_BIBLE/VISUAL_STYLE_GUIDE.md`
- `00_ART_BIBLE/SPRITE_STATE_LIST.md`
- `00_ART_BIBLE/NAMING_CONVENTIONS.md`
- `00_ART_BIBLE/SCALE_AND_ANCHOR_GUIDE.md`
- `00_ART_BIBLE/COLOR_PALETTE.md`
- `00_ART_BIBLE/MANIFEST_TEMPLATE.json`
- `00_ART_BIBLE/STYLE_QA_CHECKLIST.md`

Installed Reference Library files were read:

- `REFERENCE_LIBRARY/README_REFERENCE_USE.md`
- `REFERENCE_LIBRARY/reference_manifest.json`
- `REFERENCE_LIBRARY/06_department_reference_prompts/UNIVERSAL_REFERENCE_PROMPT.md`

## Reference Library guidance

Use the shared reference library as visual and pose guidance only. Do not treat reference images as final gameplay assets. Do not copy watermarks, source image filenames, or reference images into final sprite exports.

Primary human reference targets:

- `02_human_realistic_topdown_linework/HUMAN_REF_01_MIXED_TOPDOWN_POSES_FULL_SHEET.png`
- `02_human_realistic_topdown_linework/HUMAN_REF_02_SLEEP_BED_POSE_SHEET.jpg`
- `02_human_realistic_topdown_linework/HUMAN_REF_03_BED_SOCIAL_REST_POSE_SHEET.jpg`
- `02_human_realistic_topdown_linework/HUMAN_REF_04_DESK_WORK_GROUP_TOPDOWN.jpg`
- `02_human_realistic_topdown_linework/HUMAN_REF_05_DESK_SEATED_YOGA_LINEWORK.jpg`
- `02_human_realistic_topdown_linework/HUMAN_REF_06_DAILY_ACTION_LINEWORK.jpg`
- `02_human_realistic_topdown_linework/HUMAN_REF_07_STOCK_TOPDOWN_MOVEMENT_SHEET.jpg`
- `02_human_realistic_topdown_linework/HUMAN_REF_08_SITTING_FEMALE_DIMENSIONS_GUIDE.jpg`
- `02_human_realistic_topdown_linework/HUMAN_REF_09_DESK_PHONE_YOGA_SELECTED_POSES.jpg`
- `02_human_realistic_topdown_linework/HUMAN_REF_10_STANDING_CROUCH_DOG_POSE_SHEET.jpg`

Supporting references:

- `01_environment_references/` for cyberpunk apartment mood, furniture scale, and floor-grid readability.
- `03_dog_references/` for future pet interaction contact logic.
- `05_current_game_context/` for current prototype context.

## Visual target

- Realistic top-down adult Black female.
- Adult proportions.
- Clothing-neutral fitted base look, not nude.
- Natural anatomy, believable head, shoulders, torso, hips, elbows, wrists, knees, hands, and feet.
- Readable silhouette from an orthographic top-down camera.
- Compatible with male and joint-state scale.
- Transparent PNG final sprite target.

## Forbidden style

Do not create chibi sprites, cute toy bodies, mascot proportions, oversized heads, emoji acting, sticker art, rounded mobile-game dolls, childlike adult proportions, or front-view character icons.

## Folder structure

- `idle/`
- `walk/`
- `run/`
- `sit/`
- `sleep/`
- `phone/`
- `laptop/`
- `cooking/`
- `eating/`
- `shower_bathroom/`
- `reading/`
- `exercise/`
- `pet_dog/`
- `social_solo/`
- `transitions/`
- `prompt_sheets/`

## Frame logic

Most states use A/B/C max.

- A means entry, anticipation, or transition into the action.
- B means main hold pose or loop frame 1.
- C means exit, recovery, or loop frame 2.

Simple idle states use A/B. Walk and run loop A/B/C. Laptop, phone, cooking, eating, and reading enter on A, then loop or hold B/C. Sleep and rest use randomized hold poses instead of constant animation.

## Anchors

Use Art Bible anchor labels and normalized values:

- `feet_center`, `[0.5, 0.86]` for standing, walk, run, and standing reactions.
- `seat_center`, `[0.5, 0.62]` for chair, couch, table, desk, and seated actions.
- `bed_center`, `[0.5, 0.5]` for bed, sleep, rest, and bed transitions.
- `body_center`, `[0.5, 0.5]` for floor actions, crouch, pushup, plank, floor recovery, and dog contact states.

## Current production status

This pass reconciles documentation, prompts, and the primary Codex-consumable manifest. No final sprite sheets were generated.
