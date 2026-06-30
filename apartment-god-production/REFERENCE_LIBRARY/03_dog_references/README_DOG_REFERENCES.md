# Dog References

This folder is for realistic dog and animal pose references used by the Dog Character Department.

## Required dog style

The Apartment God dog should be a realistic white or off white dog that can be color changed later.

The production dog must use:

- Natural dog anatomy
- Realistic top down body proportions
- Proportional head, torso, legs, paws, ears, and tail
- Clean readable linework
- Grounded animal movement
- Stable body scale across frames
- Stable anchor logic

## Forbidden dog style

Do not use:

- Cute puppy mascot proportions
- Oversized head
- Tiny toy body
- Emoji expressions
- Sticker style dog face
- Cartoon bounce as the main motion
- Human like acting
- Candy colored fur
- Exaggerated paw or eye shapes

## Coat treatment

Base dog color direction:

- White
- Off white
- Cream
- Pale grey shadow accents

Production notes:

- Keep color layers simple enough to support future coat changes.
- Avoid hard coded unique markings unless a later character design requires them.
- Use muted collar colors only if needed.
- Use linework and shadow to define anatomy instead of cartoon patches.

## Pose logic

Use animal references for real dog body mechanics:

- Weight over shoulders and hips
- Head and neck following sniff, bark, look up, and alert states
- Natural paw contact
- Tail movement that does not change body scale
- Spine curve for lie down, sleep, stretch, and turn states

## A/B/C frame logic

For dog states:

- A means enter, anticipation, or transition into the action.
- B means main hold pose or loop frame 1.
- C means exit, recovery, or loop frame 2.

For simple idle:

- A means neutral.
- B means subtle breathing, head shift, or tail shift.

For walking and running:

- A, B, and C create a low frame animal movement loop.

For sleep and rest:

- Use multiple random hold poses.
- Do not over animate sleep yet.

## Dog state mapping

Idle:

- Stand
- Sit
- Lie
- Tail shift
- Look up

Movement:

- Walk in eight directions
- Run in eight directions

Sit:

- Sit idle
- Sit look up
- Sit tail wag

Sleep:

- Sleep floor
- Sleep dog bed
- Sleep couch
- Sleep twitch

Bark:

- Bark stand
- Bark sit
- Bark alert

Sniff:

- Sniff floor
- Sniff object
- Sniff person

## Anchor guidance

Use Art Bible anchor labels:

- Idle, sit, lie, bark, sniff, sleep, eat, drink, play, and comfort states: `body_center`
- Walk and run states: `feet_center`

## Production checklist

Before a dog sprite moves forward:

- Dog reads as a real animal from top down.
- Body scale matches adult human and furniture scale.
- Head is not enlarged for cuteness.
- The pose is grounded and physically possible.
- Anchor is stable.
- Frame logic is listed in the manifest.
- Coat color remains color changeable later.
- No reference image, watermark, or traced source art is present.