# Apartment God True Top Down Procedural Character Bible

Status: active test lab visual rule
Branch: phaser-migration
Created: 2026-07-14

## Purpose

This Bible defines the temporary but approved Canvas/procedural character style used to test a flat true top down look before broad sprite replacement. It is for the Secret Sprite Test Lab proof first. It is not permission to call procedural art final production art across the whole game.

## Target look

The target is a clean flat vector style similar in construction to overhead office worker sprite sheets, translated into Apartment God's mature anime/cyberpunk direction.

The look should read as:

- true overhead camera
- adult human proportions
- clean simple shape language
- flat anime color blocking
- small cel shadow accents only
- subtle soft ground shadow
- readable hair silhouette
- readable shoulders and torso mass
- simple prop silhouettes
- mobile readable at actual game scale

## What this style is allowed to use

Procedural Canvas primitives are allowed here:

- ellipses
- rounded rectangles
- capsules
- simple paths
- flat fills
- small highlight wedges
- soft alpha shadows
- restrained cyan or magenta accent seams
- minimal face wedge or glasses hints
- simple prop shapes such as phone, paper, book, cup, laptop, ball, or leash

## What this style must not do

Rejected immediately:

- chibi proportions
- toddler body language
- mascot bodies
- oversized heads
- emoji acting
- toilet door silhouettes
- side view shoes
- side view torsos
- front facing pasted bodies
- isometric tilt
- heavy generic cartoon outlines
- labels baked into character art
- copied reference images
- nude or explicit body detail

## Human construction grammar

### Head

The head is an overhead oval or rounded dome, slightly smaller than the shoulders. It should show crown and hair mass first, not a front face.

Use:

- hair cap or bun shape
- small lower face wedge only when needed
- no big eyes
- no full front face
- optional tiny glasses line for character identity

### Torso

The torso is a rounded wedge or capsule mass from shoulders to waist. Shoulders are wider than hips for the male test actor and slightly softer for the female test actor. The body should not become a square icon.

### Arms

Arms are capsule strokes attached to shoulders. Hands are small simple ellipses. Hands may hold props, but props should never become oversized icons.

### Legs

Legs are vertical or angled capsules from hip to shoe. Shoes are small dark ovals or tapered capsules. Feet must read as top down placement, not side view shoes.

### Clothing

Clothing is neutral and non-explicit. Use fitted tops, pants, leggings, shoes, and simple cyberpunk trim. Clothing is shape identity, not fashion detail overload.

### Shading

Keep it flat. Use one subtle cel shade or small highlight only. The silhouette and color blocking should carry the read.

## Dog construction grammar

The dog must be a real overhead quadruped silhouette, not a puppy mascot.

Use:

- long body oval
- smaller chest/head oval
- four small leg capsules visible from above
- ear shapes from the top
- tail curve
- off-white coat with subtle shade
- no giant head
- no emoji face
- no side profile dog

## Pose grammar

### Idle

A neutral held pose with tiny breathing. Should feel alive but not bouncy.

### Walk

Low frame procedural timing using alternating leg and arm offsets. Do not let the actor slide like a pawn. Direction should come from heading rotation and lead body angle.

### Standing prop poses

Phone, cup, paper, or bag can be held with one arm lowered or raised. The prop must sit naturally in hand scale.

### Seated poses

Bend legs outward or forward depending on chair, couch, table, or laptop relation. Anchor is seat center.

### Sleep and shower

Sleep must use blanket coverage. Shower must use safe stall, towel, steam, and curtain or glass blocking. Never render nude detail.

## Test lab scope

The first implementation may apply this style only to entities with `labOnly: true` in Secret Sprite Test Lab.

Required proof entities:

- male test actor
- female test actor
- dog test actor

The real Resident, Girlfriend, and Dog should stay on their current renderer until Kam visually approves this test lab proof.

## Expansion rule

If Kam approves the Secret Lab look, then expand through a separate committed pass:

1. Resident
2. Girlfriend
3. Dog
4. activity-specific poses
5. modular clothing and prop layers
6. future PNG/SVG sprite asset extraction

Do not broaden this proof into the whole game in the same pass.
