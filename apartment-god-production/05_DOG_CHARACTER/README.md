# Dog Character Sprite Production

This folder holds the production plan for the realistic top-down dog sprite set for **Apartment God Prototype**.

The dog starts as a white/off-white pet, but the art must remain recolor-friendly for later customization. The target is transparent PNG sprite production with realistic linework, natural dog anatomy, and readable poses that fit the cyberpunk apartment setting and the realistic adult human sprites.

## Scope

This pass creates planning material only. It does not add runtime code, does not edit `src/`, does not change Render settings, and does not touch `Kalomika/ai-rpg-engine`.

## Required structure

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

## Style rules

- Realistic top-down dog linework.
- White/off-white dog initially.
- Fur color must be changeable later.
- Natural adult dog anatomy.
- No cute mascot design.
- No chibi proportions.
- No oversized head, eyes, paws, or tail.
- No emoji-style expressions.
- Orthographic top-down camera language.
- Transparent PNG target.
- Compatible with realistic human sprites.
- Compatible with cyberpunk apartment interiors.

## Frame logic

Most dog states use A/B/C frame language.

For standard action states:

- A = enter, anticipation, or transition into pose.
- B = main hold pose.
- C = exit, recovery, or transition out.

For loop states:

- A = loop frame 1.
- B = loop frame 2.
- C = loop frame 3.

For simple idle:

- A = idle neutral.
- B = subtle weight shift or tail shift.

For sleep:

- Sleep may use B-only hold poses.
- The game can later randomize between curled, side, and belly sleep poses.

## Art Bible note

The expected Art Bible files under `apartment-god-production/00_ART_BIBLE/` were not found on this branch during this pass. This folder follows the user-provided visual direction and is structured so it can be QA checked against the Art Bible files once those source files are present in the repo.

## Integration notes for Codex or a future sprite pass

- Treat `manifest_dog.json` as the source of truth for state IDs and frame metadata.
- Treat `DOG_STATE_BREAKDOWN.md` as the readable design map.
- Treat `prompt_sheets/DOG_GENERATION_PROMPTS.md` as the image generation prompt source.
- Keep prop elements such as ball, bowl, and toy separable where possible.
- Use `center_ground_shadow` as the practical anchor point until the master anchor guide is available.
- Do not approve any generated dog sprite that reads as a plush toy, puppy mascot, emoji, or sticker character.
