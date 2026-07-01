# Dog Character Sprite Production

Department: `05_DOG_CHARACTER`

Working branch: `dog-character-realistic-sprite-states`

This folder contains the production structure, dog state plan, prompt sheets, and primary Codex-consumable manifest for the upgraded realistic/cyberpunk version of Apartment God Prototype.

## Scope

This pass creates planning files only. It does not generate final sprite sheets, does not edit runtime `src/` files, does not deploy, does not change Render settings, does not modify `main`, and does not touch `Kalomika/ai-rpg-engine`.

## Art Bible and Reference Library

Read and followed from `art-bible-production-structure`:

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

Reference images are pose, style, scale, and mood guidance only. They are not final gameplay assets and must not be copied into final sprite exports.

## Visual target

- Realistic top-down dog linework.
- White or off-white dog initially.
- Color-changeable later.
- Natural adult dog anatomy.
- Readable spine, shoulder, hip, leg, paw, snout, and tail logic.
- Compatible with realistic adult human sprites.
- Compatible with dark cyberpunk apartment floors and furniture footprints.
- Transparent PNG target for future final art.

## Forbidden

- Cute mascot dog.
- Cartoon toy dog.
- Chibi proportions.
- Oversized head.
- Oversized eyes or paws.
- Emoji body language.
- Cartoon eyebrow acting.
- Watermarked or downloaded reference images used as final art.

## Folder structure

- `idle/`
- `walk/`
- `run/`
- `sit/`
- `sleep/`
- `eat_drink/`
- `pet_interaction/`
- `follow_human/`
- `play/`
- `bathroom/`
- `alert/`
- `transitions/`
- `prompt_sheets/`

## Key files

- `DOG_STATE_BREAKDOWN.md`, readable state plan.
- `manifest_dog.json`, primary Codex-consumable manifest.
- `manifest_dog_state_index.json`, category and filename index.
- `prompt_sheets/DOG_GENERATION_PROMPTS.md`, generation prompt source.

## Anchor rules

- Default dog states use `body_center`.
- Walk, run, and moving follow states use `feet_center`.
- Anchors follow the Art Bible format.
- Related frames must not pop in size.
- Comfort and pet interaction states must align with adult human and furniture scale.

## Status

Planning is ready for QA review. No final sheets were generated in this pass.
