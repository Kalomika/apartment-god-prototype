# Shared Reference Library Use

Canonical location: `apartment-god-production/REFERENCE_LIBRARY/`

Expected source pack: `apartment_god_shared_reference_pack.zip`

This library is for style and pose reference only. Reference images must not be treated as final gameplay assets, and watermarked/source reference images must not be committed as production sprites. Final production assets must be original, named correctly, manifest-listed, and placed in the appropriate department production folder.

## Required subfolders

- `01_environment_references/`
- `02_human_realistic_topdown_linework/`
- `03_dog_references/`

## Primary visual direction

The upgraded version of Apartment God Prototype must read as realistic top-down linework inside a cyberpunk apartment. It must not look cute, chibi, mascot-like, toy-like, emoji-like, or childlike.

## Human reference usage

Use the realistic top-down human pose references as the primary visual target for human sprite logic. Replicate existing pose logic closely where references exist. For missing A/B/C frames, create realistic transition frames using nearby reference logic.

Reuse rules:

- Use crouch as a transition into and out of yoga/stretching.
- Use sitting-on-bed as the middle frame between standing and lying down.
- Use seated-chair as the middle frame for laptop, desk, food, and phone actions.
- Use one-hand-on-floor or push-up poses as get-up-from-floor frames.
- Use side, back, curled, and sprawl sleep references as randomized sleep holds.
- Use two-person bed and couch references as joint state logic.

## Dog reference usage

Use the dog and animal references for pose logic only. Produce a realistic white/off-white dog that can be recolored later. Do not make the dog a cute puppy mascot. Do not exaggerate the head, paws, eyes, or tail. Do not rely on emoji expressions.

Dog acting must read through body mechanics from an orthographic top-down camera: spine line, shoulder/hip rhythm, paw placement, head angle, ears, tail position, and relationship to props or humans.

## Environment reference usage

Use environment references for cyberpunk apartment structure and mood while preserving gameplay readability.

Required mood and structure:

- Dark wall masses.
- Dark blue-grey or charcoal floors.
- Cyan and magenta neon wall strips.
- Lit windows.
- Tech clutter.
- Lived-in apartment details.
- Readable furniture.
- Clear collision and doorway logic.

Do not turn the apartment into a decorative flat illustration that breaks gameplay navigation or object interaction.

## Frame logic

- A = enter, anticipation, or transition into the action.
- B = main hold pose or loop frame 1.
- C = exit, recovery, or loop frame 2.
- Simple idle: A = neutral, B = subtle breathing or weight shift.
- Walking/running: A/B/C = low-frame loop.
- Sleeping/resting: use multiple random hold poses. Do not over-animate sleep yet.

## Clothing and body treatment

Use clothing-neutral base characters for now. Do not draw nude characters. Use simple fitted base clothing such as a minimal tank or tee with fitted shorts or leggings, or clean line-art safe mannequin anatomy with no explicit detail. Avoid fashion detail for now so clothing overlays and outfit variants can be added later.

## Department manifest rule

Every department must create a manifest. Every state must include:

- `state_id`
- `action_name`
- `frame_count`
- `frame_files` or planned frame names
- `frame_logic`
- `gameplay_tags`
- `anchor_point`
- `scale_notes`
- `implementation_notes`
- `status`

## Current ingestion status

The zip file was referenced by the production prompt, but it was not available to this tool session as a readable upload or committed repo file during this pass. This folder is therefore prepared as a safe canonical location and usage contract. Once the zip is available, extract only approved reference material into the subfolders and update `reference_manifest.json` with source notes and usage status.
