# Reference Library Use

This folder is the shared reference library for the upgraded realistic cyberpunk production version of Apartment God Prototype.

The reference library is used to guide style, pose logic, anatomy, environment mood, lighting language, and gameplay readability. It is not a final asset folder.

## Required visual target

Apartment God Prototype must look like realistic top down linework inside a dark cyberpunk apartment.

The art must avoid:

- Cute character logic
- Chibi proportions
- Mascot proportions
- Toy like bodies
- Emoji body language
- Childlike adult characters
- Oversized heads
- Flat decorative apartment art that breaks gameplay

## Reference folders

Expected shared reference folders:

- `01_environment_references/`
- `02_human_realistic_topdown_linework/`
- `03_dog_references/`

The uploaded pack expected for this folder is:

- `apartment_god_shared_reference_pack.zip`

## Current pack status

The uploaded zip was not exposed to this working session, so no source reference images were committed. This folder is prepared as a safe reference use structure and manifest target. When the zip is available, unzip or place its contents here, then update `reference_manifest.json` with the actual file names, descriptions, licensing notes, and use restrictions.

## Art Bible source of truth

Every department must follow the Art Bible rules under:

- `apartment-god-production/00_ART_BIBLE/`

Required Art Bible reading order:

1. `VISUAL_STYLE_GUIDE.md`
2. `SPRITE_STATE_LIST.md`
3. `NAMING_CONVENTIONS.md`
4. `SCALE_AND_ANCHOR_GUIDE.md`
5. `COLOR_PALETTE.md`
6. `MANIFEST_TEMPLATE.json`
7. `STYLE_QA_CHECKLIST.md`
8. `README.md`

## Reference handling rules

- References are style and pose guides only.
- Do not commit watermarked source reference images as final gameplay assets.
- Do not trace a source image into production art.
- Do not bake a reference image into final sprites or environment art.
- Final gameplay assets must be original production files.
- Final gameplay assets must be named correctly and listed in the correct department manifest.
- Source references must remain separated from production assets.

## Human reference use

Use `02_human_realistic_topdown_linework/` as the primary human pose and style target.

Human sprites must use:

- Adult proportions
- Realistic top down anatomy
- Clear shoulder, hip, spine, limb, hand, and foot logic
- Restrained body acting
- Stable anchors
- Clothing neutral base treatment

For clothing, use simple fitted base clothing only, such as a minimal tee, tank, fitted shorts, leggings, or safe line art mannequin clothing. Do not draw nude characters. Do not add fashion details yet unless a later outfit system requires them.

## Dog reference use

Use `03_dog_references/` for animal pose logic.

The dog production target is:

- Realistic white or off white dog
- Natural dog anatomy
- Color changeable later
- Proportional head, legs, body, paws, ears, and tail
- No puppy mascot proportions
- No giant head
- No emoji expressions

## Environment reference use

Use `01_environment_references/` for the apartment structure, mood, and visual logic.

Environment assets must preserve:

- Dark wall masses
- Blue grey or charcoal floor materials
- Cyan and magenta neon accents
- Lit windows
- Tech clutter
- Lived in details
- Readable furniture
- Clear collision boundaries
- Clear doorways
- Gameplay object clickability

Do not create a single flat decorative AI image as the final game map unless it is sliced and mapped to logical collision, props, lighting overlays, and interaction zones.

## Shared frame logic

For production state planning:

- A means enter, anticipation, or transition into the action.
- B means main hold pose or loop frame 1.
- C means exit, recovery, or loop frame 2.

For simple idle:

- A means neutral.
- B means subtle breathing or weight shift.

For walking and running:

- A, B, and C form a low frame movement loop.

For sleeping and resting:

- Use multiple random hold poses.
- Do not over animate sleep yet.

## Smart reuse rules

Use reference logic efficiently:

- Use crouch as a transition into and out of yoga or stretching.
- Use sitting on bed as the middle frame between standing and lying down.
- Use seated chair as the middle frame for laptop, desk, food, and phone actions.
- Use one hand on floor and push up poses as get up from floor frames.
- Use side, back, curled, and sprawl sleep references as randomized sleep holds.
- Use two person bed and couch references as joint state logic.

## Department manifest requirement

Every department must create a manifest. Every state must include:

- `state_id`
- `action_name`
- `frame_count`
- `frames`
- `abc_frame_logic`
- `gameplay_tags`
- `anchor_point`
- `scale_notes`
- `implementation_notes`
- `status`

## Approval rule

A production asset can move forward only if it:

- Matches realistic top down linework.
- Avoids cute, chibi, mascot, toy, emoji, and childlike design logic.
- Uses correct naming.
- Uses stable scale and anchors.
- Has a complete manifest entry.
- Preserves gameplay readability.
- Has no watermarks.
- Has no source reference image baked into it.
- Has no anatomy artifacts or warped props.