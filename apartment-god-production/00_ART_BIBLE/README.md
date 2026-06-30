# 00_ART_BIBLE

This folder is the source of truth for Apartment God Prototype production art.

Every other asset-production chat, image pass, reference pull, sprite cleanup pass, animation pass, and integration handoff must follow these rules before assets move forward.

## Required Reading Order

1. `VISUAL_STYLE_GUIDE.md`
2. `SPRITE_STATE_LIST.md`
3. `NAMING_CONVENTIONS.md`
4. `SCALE_AND_ANCHOR_GUIDE.md`
5. `COLOR_PALETTE.md`
6. `MANIFEST_TEMPLATE.json`
7. `STYLE_QA_CHECKLIST.md`

## Production Rule

Do not create final polished art until the state ID, naming, anchor, scale, and style requirements are clear.

Do not simplify the game into cute icons, chibi sprites, emoji acting, toy characters, or procedural placeholders. The target is realistic top-down human linework inside a dark cyberpunk apartment world.

## Integration Rule

No asset should enter the integration queue unless:

- It matches the visual style guide.
- It uses an approved state ID.
- It follows the naming convention.
- It has a filled manifest entry.
- It passes the QA checklist.
- It has an approved status.

## Repository Safety Rule

This folder does not contain runtime code. Do not edit `src/`, Render deployment settings, `main`, or `Kalomika/ai-rpg-engine` while working from this art bible unless Kam specifically gives that instruction later.
