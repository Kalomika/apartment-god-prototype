# Human Realistic Top Down Linework References

This folder is the primary visual style target for male, female, and joint human sprite production.

## Required human style

Human production sprites must use:

- Realistic adult proportions
- Orthographic top down body logic
- Controlled linework
- Slightly heavier exterior silhouette lines
- Thinner interior lines for clothing, folds, limbs, hair, and overlap
- Believable weight, balance, reach, and contact points
- Stable scale across related states
- Stable anchors across frames

## Forbidden human style

Do not use:

- Chibi bodies
- Cute toy proportions
- Oversized heads
- Mascot acting
- Emoji acting
- Childlike adult proportions
- Fashion doll poses
- Overly bouncy movement
- Nude character drawings
- Explicit body detail

## Clothing neutral base rule

For this production stage, use a clothing neutral base look.

Allowed base treatment:

- Minimal tee
- Minimal tank
- Fitted shorts
- Fitted leggings
- Clean safe mannequin line art with simple clothing coverage
- Simple shoes or bare safe foot shapes only where appropriate for sleep or indoor states

Avoid:

- Nude anatomy
- Fashion heavy outfits
- Costume details
- Character specific clothing variants
- Decorative accessories that break state reuse

The purpose is to keep base animation usable for future clothing overlays and outfit variants.

## A/B/C frame logic

For all human states:

- A means enter, anticipation, or transition into the action.
- B means main hold pose or loop frame 1.
- C means exit, recovery, or loop frame 2.

For simple idle:

- A means neutral.
- B means subtle breathing or weight shift.

For walking and running:

- A, B, and C create a low frame loop.

For sleep and rest:

- Use several random hold poses.
- Do not over animate sleep yet.

## Smart reuse rules

Use references efficiently:

- Crouch is the transition into and out of yoga or stretching.
- Sitting on bed is the middle frame between standing and lying down.
- Seated chair is the middle frame for laptop, desk, food, and phone actions.
- One hand on floor and push up poses are get up from floor frames.
- Side sleep, back sleep, curled sleep, and sprawl sleep are randomized sleep holds.
- Two person bed and couch references define joint state logic.

## Pose categories to map

Standing and idle:

- Neutral standing
- Relaxed standing
- Tired standing
- Head turn
- Look phone
- Shift weight

Movement:

- Walk in eight directions
- Run in eight directions

Seated:

- Chair idle
- Desk idle
- Couch idle
- Couch lean back
- Table idle

Bed and sleep:

- Bed solo sleep
- Bed turn
- Couch sleep
- Wake bed
- Sitting on bed transition
- Lying down transition

Phone:

- Standing texting
- Standing call
- Couch scroll
- Desk check

Laptop:

- Desk typing
- Desk idle
- Couch typing
- Couch idle

Cooking and eating:

- Stove idle
- Stove stir
- Counter prep
- Fridge reach
- Table eating
- Couch eating
- Counter eating

Bathroom:

- Shower enter
- Shower loop
- Shower exit
- Sink wash
- Mirror idle
- Toilet idle

Exercise:

- Pushup
- Stretch
- Squat
- Floor rest
- Crouch transition
- Get up from floor

Joint human states:

- Couch together
- Bed together
- Watch TV together
- Eat together
- Comfort pose

## Anchor guidance

Use Art Bible anchor labels:

- Standing and movement: `feet_center`
- Sitting and couch states: `seat_center`
- Bed states: `bed_center`
- Joint states: `joint_center`
- Floor poses: `body_center` unless state handoff says otherwise

## Production checklist

Before a human sprite moves forward:

- Pose reads from top down.
- Character looks adult.
- Head, hands, feet, shoulders, hips, and limbs are believable.
- Anchor is stable.
- Scale matches furniture.
- Clothing is safe and simple.
- Frame logic is listed in the manifest.
- No reference image, watermark, or traced source art is present.