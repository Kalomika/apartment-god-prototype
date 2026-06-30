# Dog Character Sprite Production

This folder holds the production plan for the realistic top-down dog sprite set for **Apartment God Prototype**.

The dog starts as a white/off-white pet, but the art must remain recolor-friendly for later customization. The target is transparent PNG sprite production with realistic linework, natural dog anatomy, and readable poses that fit the cyberpunk apartment setting and the realistic adult human sprites.

## Scope

This pass creates planning material only. It does not add runtime code, does not edit `src/`, does not change Render settings, and does not touch `Kalomika/ai-rpg-engine`.

## Shared reference library

Use the shared reference library at:

`apartment-god-production/REFERENCE_LIBRARY/`

Expected reference pack:

`apartment_god_shared_reference_pack.zip`

Reference subfolders:

- `apartment-god-production/REFERENCE_LIBRARY/01_environment_references/`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/`
- `apartment-god-production/REFERENCE_LIBRARY/03_dog_references/`
- `apartment-god-production/REFERENCE_LIBRARY/README_REFERENCE_USE.md`
- `apartment-god-production/REFERENCE_LIBRARY/reference_manifest.json`

The shared references are style and pose references only. Do not commit watermarked or source reference images as final gameplay assets. Final production dog sprites must be original transparent PNGs, named correctly, manifest-listed, and placed in this dog department folder.

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

## Reference-driven pose logic

- Use dog/animal references for canine mechanics: spine line, shoulder and hip rhythm, paw placement, head direction, ear angle, tail placement, and realistic shifts of weight.
- Use realistic top-down human references to keep scale and interaction logic compatible with existing human sprite poses.
- For dog comfort states, align to realistic seated, standing, bed, couch, and floor human anchor logic.
- For environment compatibility, check that the dog remains readable on dark blue-grey or charcoal floors, around dark wall masses, cyan/magenta neon strips, lit windows, tech clutter, furniture, doors, and collision paths.

## Frame logic

Most dog states use A/B/C frame language.

For standard action states:

- A = enter, anticipation, or transition into pose.
- B = main hold pose or loop frame 1.
- C = exit, recovery, or loop frame 2.

For loop states:

- A/B/C = low-frame loop.

For simple idle:

- A = neutral.
- B = subtle breathing, weight shift, ear shift, or tail shift.

For sleep:

- Use multiple randomized hold poses.
- Do not over-animate sleep yet.
- B-only hold poses are acceptable for curled, side, and belly-down sleep.

## Clothing/body treatment for human compatibility

Dog sprites should be designed against clothing-neutral human bases. Human reference logic should assume simple fitted base clothing such as a tank or tee with fitted shorts or leggings, or clean line-art safe mannequin anatomy with no explicit detail. Do not rely on fashion details for dog-human interaction alignment.

## Art Bible note

The expected Art Bible files under `apartment-god-production/00_ART_BIBLE/` were not found on this branch during this pass. This folder follows the user-provided visual direction and is structured so it can be QA checked against the Art Bible files once those source files are present in the repo.

## Integration notes for Codex or a future sprite pass

- Treat `manifest_dog.json` as the source of truth for state IDs and frame metadata.
- Treat `DOG_STATE_BREAKDOWN.md` as the readable design map.
- Treat `prompt_sheets/DOG_GENERATION_PROMPTS.md` as the image generation prompt source.
- Keep prop elements such as ball, bowl, and toy separable where possible.
- Use `center_ground_shadow` as the practical anchor point until the master anchor guide is available.
- Do not approve any generated dog sprite that reads as a plush toy, puppy mascot, emoji, sticker character, or childlike mascot.
