# Visual Style Guide

This guide defines the master visual rules for the upgraded realistic cyberpunk version of Apartment God Prototype. Every department must follow this before creating final gameplay assets.

## Core visual target

Apartment God Prototype should look like a realistic top-down life simulation set inside a dark cyberpunk apartment. The upgraded art should move away from cute procedural placeholders and toward adult, grounded, readable linework.

The target is:

- Realistic top-down human linework.
- Adult Black male and female character sprites.
- Realistic white or off-white dog sprite base, color-changeable later.
- Cyberpunk apartment interiors with dark wall masses, blue-grey floors, neon cyan and magenta accents, tech clutter, and lived-in details.
- Orthographic top-down staging with gameplay clarity.
- Clear collision logic, doorway logic, furniture footprint logic, and prop readability.

## Forbidden style rules

Do not make the game look like:

- Chibi sprites.
- Cute toy characters.
- Mascot bodies.
- Emoji acting.
- Sticker art.
- Oversized-head character icons.
- Childlike adult proportions.
- Rounded mobile-game dolls.
- Generic cute apartment icons.
- Watermarked reference images used as final art.
- AI images with broken anatomy used as final art.

Any asset that feels cute, toy-like, mascot-like, emoji-like, or childlike must be rejected or sent to rework.

## Camera and projection

The game view is orthographic top-down.

Required:

- Characters and furniture must feel viewed from above.
- Top planes, shoulders, head masses, torso angles, beds, couches, desks, and floors must all agree with the camera.
- Standing characters should show top plane logic through head, shoulders, torso, arms, and feet placement.
- Sitting, sleeping, couch, bed, laptop, eating, and phone states must align with the furniture footprint.
- No side-scroller camera logic unless a pose naturally exposes a side plane while still reading from top-down.

Avoid:

- Portrait angle sprites.
- Front-view character stickers.
- Isometric furniture mixed with flat top-down bodies.
- Decorative room paintings that break gameplay collision readability.

## Linework rules

Linework should be clean, realistic, and readable at gameplay scale.

Required:

- Slightly heavier outer contour lines.
- Controlled interior lines for clothing folds, joints, hair, fingers, paws, furniture edges, and clutter.
- Clear limb overlap.
- Strong silhouettes.
- No unnecessary scratch noise.
- No muddy black blobs.
- Transparent PNG target for final sprites.
- Consistent canvas size and anchor point per state.

Do not use heavy cartoon outlines, cute icon outlines, or painterly smears that remove the drawing structure.

## Human sprite rules

Human characters must use adult proportions and realistic top-down pose construction.

Required:

- Adult Black male sprite base.
- Adult Black female sprite base.
- Clothing-neutral base look.
- Simple fitted base clothing, such as tank, tee, fitted shorts, fitted leggings, simple sleepwear, or clean safe mannequin line-art with no explicit body detail.
- No nude characters.
- No explicit anatomical detail.
- Head scale must be realistic.
- Hands and feet must be believable.
- Shoulders, hips, spine, elbows, knees, and wrists must follow natural pose mechanics.

Pose language must be natural, not emoji acting. A tired pose should read through weight, shoulder angle, neck angle, and stance. A phone pose should read through hand and head direction, not a giant emoji gesture.

## Reusable human pose logic

Use nearby realistic top-down references to create missing A/B/C frames.

Required reuse rules:

- Crouch can transition into and out of yoga, stretching, floor reach, and floor recovery.
- Sitting-on-bed can be the middle frame between standing and lying down.
- Seated-chair can be the middle frame for laptop, desk, food, phone, and reading actions.
- One-hand-on-floor and push-up poses can be get-up-from-floor frames.
- Side, back, curled, and sprawl sleep poses can be randomized sleep holds.
- Two-person bed and couch references define joint state logic.

## A/B/C frame logic

Most states use A/B/C planning.

- A means enter, anticipation, or transition into the action.
- B means main hold pose or loop frame 1.
- C means exit, recovery, or loop frame 2.

Simple idle can use A/B.

- A means neutral.
- B means subtle breathing, weight shift, head turn, or tail shift.

Walk and run use A/B/C as a low-frame loop.

Laptop, phone, cooking, eating, reading, and similar actions should enter on A, then loop or hold B/C.

Sleep and rest should use multiple randomized hold poses. Do not over-animate sleep yet.

## Joint sprite rules

Joint states must feel like two adult bodies sharing one action from a top-down view.

Required:

- Use `joint_center` anchor logic.
- Keep both characters adult-proportioned.
- Match couch, bed, chair, table, and floor scale.
- Use believable overlap, contact, and weight.
- Avoid cute shorthand symbols, floating hearts, emoji gestures, or mascot acting.
- Private moment safe states must stay non-explicit and gameplay-safe.

## Dog sprite rules

The dog should be a realistic white or off-white dog base that can be recolored later.

Required:

- Natural adult dog anatomy.
- Realistic head-to-body ratio.
- Readable spine, shoulder, hip, leg, paw, snout, and tail logic.
- No giant head.
- No cute puppy mascot proportions.
- No emoji expressions.
- No cartoon eyebrow acting.
- Use natural dog body language for bark, sniff, comfort, fetch, sleep, and play.

The dog should read as a real animal living in the apartment, not a mascot sidekick.

## Apartment environment rules

The apartment must support gameplay first, mood second.

Required:

- Dark wall masses.
- Dark blue-grey or charcoal floors.
- Cyan and magenta neon strips.
- Lit windows.
- Tech clutter.
- Cables, screens, small appliances, bowls, laundry, takeout, tools, books, and personal mess.
- Readable furniture footprints.
- Clear doorways and collision edges.
- Props that show life without blocking pathfinding readability.

Avoid flat decorative images that look nice but cannot be understood as gameplay spaces.

## Lighting rules

Lighting should separate space and mood without destroying readability.

Use:

- Cyan edge glow.
- Magenta wall strips.
- Dim amber practicals.
- Cool bathroom light.
- Monitor glow.
- Window light.
- Controlled red alert lighting only for special states.

Avoid flooding the entire asset with neon. Linework and silhouettes must stay readable.

## Approval standard

A finished asset must be:

- Realistic top-down.
- Adult in proportion for humans.
- Natural in anatomy for the dog.
- Cyberpunk apartment appropriate.
- Readable at gameplay scale.
- Correctly named.
- Manifest-listed.
- Anchored correctly.
- Free of watermarks and source references.
- Safe for future runtime integration.