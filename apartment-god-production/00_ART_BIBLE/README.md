# 00_ART_BIBLE

This folder is the source of truth for Apartment God Prototype production art.

Every asset-production chat, image pass, reference pull, sprite cleanup pass, animation pass, QA pass, and integration handoff must follow these rules before assets move forward.

## Required reading order

1. `VISUAL_STYLE_GUIDE.md`
2. `SPRITE_STATE_LIST.md`
3. `NAMING_CONVENTIONS.md`
4. `SCALE_AND_ANCHOR_GUIDE.md`
5. `COLOR_PALETTE.md`
6. `MANIFEST_TEMPLATE.json`
7. `STYLE_QA_CHECKLIST.md`

## Production rule

Do not create final polished art until state ID, naming, anchor, scale, frame logic, and style requirements are clear.

Do not simplify the game into cute icons, chibi sprites, emoji acting, toy characters, mascot bodies, or procedural placeholders. The target is realistic top-down linework inside a dark cyberpunk apartment world.

## Reference rule

The shared reference library is for pose, style, linework, scale, and mood guidance only. Reference images are not final gameplay assets and must not be committed as final art.

If the shared reference library is missing, departments should log it as a blocker and avoid claiming final visual approval.

## Integration rule

No asset should enter the integration queue unless:

- It matches the visual style guide.
- It uses an approved state ID.
- It follows the naming convention.
- It has a filled manifest entry.
- It passes the QA checklist.
- It has an approved status.

## Repository safety rule

This folder does not contain runtime code. Do not edit `src/`, Render deployment settings, `main`, or `Kalomika/ai-rpg-engine` while working from this Art Bible unless Kam specifically gives that instruction later.