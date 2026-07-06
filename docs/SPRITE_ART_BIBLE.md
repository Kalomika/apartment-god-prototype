# Apartment God Sprite Art Bible

Apartment God is not limited to basic retro blocks. The art pipeline must be able to scale toward polished, authored, high-quality top-down sprite production.

## Quality ceiling

The ceiling is an adult top-down apartment life sim that can support Animal Crossing level production polish and Flashback-like realistic sprite discipline when desired.

Animal Crossing is a reference for polish, object personality, system readability, UI clarity, and authored world feel. It is not a reference for cute or childlike proportions.

Flashback is a reference for grounded adult movement, physical weight, clear silhouette poses, and mature restraint. It is not a reference for side-view staging.

## Camera and readability

- Primary view is top-down or near top-down.
- Every character, dog, furniture item, car, and room prop must read from the camera height used in the game.
- Sprites must prioritize silhouette and footprint clarity.
- Strong outline or value separation is allowed when needed for gameplay readability.
- Avoid tiny detail that collapses on phone screens.

## Adult human proportions

- Adult male and adult female bodies must keep believable adult scale.
- Heads cannot be oversized mascot heads.
- Shoulders, torso, arms, hips, and legs should be readable even from top-down.
- Clothing should support normal apartment life, work, errands, exercise, sleep, and safe pair activities.
- No nude production sprites in the base manifest.

## Dog anatomy

- The dog should read as a real off-white or white dog with natural anatomy.
- No toy dog proportions unless the actual breed is intentionally tiny.
- The dog needs readable trot, sit, sleep, fetch, eat, yard, and kennel states.

## Object rules

- Furniture should have charm and authored detail.
- Every object must have a consistent footprint and anchor.
- Object sprites should not fight collision boxes.
- Final object art should replace plain boxes, not decorate them lazily.

## Palette and lighting

- Use deliberate palette groups per floor and room type.
- Keep characters readable against room colors.
- Lighting can support mood, time of day, electronics, TV glow, phone glow, garage light, backyard light, and cyberpunk apartment ambience.
- Palette decisions should be documented in sprite metadata when they affect readability.

## Animation rules

- Use A/B/C frame logic where practical: entry, hold/action, exit or loop.
- Movement should support directional facing and step cycles.
- Idle states should include subtle randomized holds.
- Activity states must clearly explain what the resident, girlfriend, or dog is doing without relying only on text labels.
- Pair states must be safe, non-explicit, and top-down readable.

## Mobile readability

- Important silhouettes must read at phone size.
- Tiny props must be enlarged or simplified enough to understand.
- UI icons must read at 390 x 844 viewport.
- Avoid noisy texture that makes touch targets confusing.

## Rejection rules

Reject final assets that are:

- chibi
- mascot-like
- toy-like
- emoji-like
- oversized-head
- childlike
- blob-like
- generic box placeholders
- unreadable from top-down
- inconsistent in scale
- unclear in anchor point
- visually weaker than the current game
- not matching the adult apartment life-sim tone

## Asset acceptance checklist

A production sprite is acceptable only when:

- it reads from top-down
- it matches the manifest id and filename
- it has a clear anchor point
- it matches object or character scale
- it works on mobile
- it supports the intended animation or interaction
- it does not violate the rejection rules
- it improves the visual ceiling instead of locking the game into placeholders
