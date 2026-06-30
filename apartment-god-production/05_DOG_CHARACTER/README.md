# Dog Character Sprite Production

Department: `05_DOG_CHARACTER`

Branch: `dog-character-realistic-sprite-states-production-log`

Purpose: production planning for the upgraded realistic top-down dog sprite set for Apartment God Prototype.

## Scope

This department creates planning files only. It does not integrate dog sprites into runtime code, does not edit `src/`, does not change Render settings, does not deploy, and does not touch `Kalomika/ai-rpg-engine`.

## Required output

- `idle/`
- `walk/`
- `run/`
- `sit/`
- `sleep/`
- `bark/`
- `sniff/`
- `fetch/`
- `eat_drink/`
- `play/`
- `comfort/`
- `follow/`
- `transitions/`
- `prompt_sheets/`
- `manifest_dog.json`
- `DOG_STATE_BREAKDOWN.md`
- `README.md`

## Visual direction

- Realistic top-down dog linework.
- White/off-white dog initially.
- Color-changeable later.
- Natural dog anatomy.
- No cute puppy mascot style.
- No oversized head.
- No toy-like proportions.
- No emoji expressions.
- Readable at gameplay scale.
- Transparent PNG target for final art.
- Compatible with realistic human sprites and cyberpunk apartment environment.

## Frame logic

Most states use A/B/C:

- A = enter, anticipation, or transition into pose.
- B = main hold pose or loop frame 1.
- C = exit, recovery, or loop frame 2.

Simple idle can use A/B. Walk and run loop A/B/C. Sleep uses randomized hold poses and should not be over-animated yet.

## Reference status

Art Bible path expected: `apartment-god-production/00_ART_BIBLE/`

Reference Library path expected: `apartment-god-production/REFERENCE_LIBRARY/`

Both paths were missing or not readable on the base branch during this department pass. This is logged as a blocker on the central status board. Planning continued because the department log requests state planning, manifest structure, and generation prompts.

## Production use

Use `manifest_dog.json` as the source of truth for state IDs, frame counts, planned frame names, frame logic, tags, anchors, scale notes, implementation notes, color notes, and status.

Use `DOG_STATE_BREAKDOWN.md` for readable design review.

Use `prompt_sheets/DOG_GENERATION_PROMPTS.md` for the future sprite generation or hand-cleanup pass.
