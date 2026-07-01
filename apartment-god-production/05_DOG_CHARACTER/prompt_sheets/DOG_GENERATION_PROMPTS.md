# Dog Generation Prompts

These prompts are for a future sprite-generation or hand-cleanup pass. Do not generate or commit final art from source references directly.

## Shared style block

Realistic top-down dog linework, white or off-white dog initially, color-changeable later, natural adult dog anatomy, readable spine, shoulders, hips, legs, paws, snout, and tail logic, orthographic top-down, transparent background, consistent canvas size, compatible with realistic adult human sprites, compatible with dark cyberpunk apartment floors and furniture, slightly heavier outer contour, controlled interior linework, no cute mascot style, no cartoon toy dog, no chibi proportions, no oversized head, no emoji body language, no cartoon eyebrow acting, no watermark, original final gameplay asset only.

## Reference guidance

Use `03_dog_references/DOG_REF_01_TOPDOWN_ANIMAL_POSE_SHEET.jpg` for dog pose mechanics. Use `02_human_realistic_topdown_linework/` for adult human scale and pet interaction anchors. Use `01_environment_references/` for dark cyberpunk apartment readability. Do not copy references as final art.

## Frame rule

A = entry or anticipation. B = main hold or loop frame 1. C = exit, recovery, or loop frame 2. Idle can use A/B. Walk and run use A/B/C loops. Sleep/rest uses randomized held poses.

## Idle

Create labeled top-down dog sprite planning frames for `DOG_IDLE_STAND`, `DOG_IDLE_SIT`, `DOG_IDLE_LIE`, `DOG_IDLE_TAIL_SHIFT`, and `DOG_IDLE_LOOK_UP`. Use the shared style block. Keep the dog calm and realistic, with subtle breathing, ear, head, and tail shifts only.

## Walk

Create directional A/B/C walk loops for `DOG_WALK_N`, `DOG_WALK_NE`, `DOG_WALK_E`, `DOG_WALK_SE`, `DOG_WALK_S`, `DOG_WALK_SW`, `DOG_WALK_W`, and `DOG_WALK_NW`. Use natural dog gait, readable paws, readable spine line, stable `feet_center` anchor, and no cartoon bounce.

## Run

Create directional A/B/C run loops for `DOG_RUN_N`, `DOG_RUN_NE`, `DOG_RUN_E`, `DOG_RUN_SE`, `DOG_RUN_S`, `DOG_RUN_SW`, `DOG_RUN_W`, and `DOG_RUN_NW`. A is extended stride, B is gathered stride, C is opposite extended stride. Useful for fetch and excitement. No stretch mascot look.

## Sit

Create `DOG_SIT_IDLE`, `DOG_SIT_LOOK_UP`, and `DOG_SIT_TAIL_WAG`. Sitting must keep realistic dog proportions. `DOG_SIT_TAIL_WAG` uses A tail left, B tail center, C tail right.

## Sleep

Create randomized held poses for `DOG_SLEEP_FLOOR_CURLED`, `DOG_SLEEP_FLOOR_SIDE`, `DOG_SLEEP_DOG_BED_CURLED`, `DOG_SLEEP_DOG_BED_SIDE`, and `DOG_SLEEP_COUCH`. Use B-only hold poses. Do not over-animate sleep.

## Eat and drink

Create `DOG_EAT_BOWL`, `DOG_DRINK_BOWL`, and `DOG_BOWL_IDLE`. Use A at bowl, B head down loop frame 1, C head shift loop frame 2 where needed. Bowls should remain separable props where possible.

## Pet interaction

Create `DOG_COMFORT_NUZZLE`, `DOG_COMFORT_LIE_NEAR`, `DOG_COMFORT_PAW_TOUCH`, and `DOG_PET_STAND_LEAN`. Align dog contact to realistic adult human scale. No floating hearts, emoji shorthand, or cute mascot acting.

## Follow human

Create `DOG_FOLLOW_HUMAN`, `DOG_HEEL_FOLLOW`, and `DOG_WAIT_AT_DOOR`. Follow states use realistic movement spacing near adult human feet and clear collision/doorway readability.

## Play

Create `DOG_FETCH_WAIT`, `DOG_FETCH_RUN`, `DOG_FETCH_CARRY`, `DOG_FETCH_DROP`, `DOG_PLAY_BOW`, `DOG_PLAY_ROLL`, and `DOG_PLAY_TOY_SHAKE`. Keep play canine and realistic. Ball and toy should be separate props if possible.

## Bathroom

Create `DOG_BATHROOM_POTTY_PAD`, `DOG_BATHROOM_WAIT_DOOR`, and `DOG_BATHROOM_SNIFF_SPOT`. These must stay gameplay-safe and non-graphic while still readable as dog needs behavior.

## Alert

Create `DOG_BARK_STAND`, `DOG_BARK_SIT`, `DOG_BARK_ALERT`, `DOG_SNIFF_FLOOR`, `DOG_SNIFF_OBJECT`, and `DOG_SNIFF_PERSON`. Bark and sniff must read through posture, head angle, ear angle, tail position, and body tension, not facial cartoon acting.

## Transitions

Create reusable transition frames for `DOG_STAND_TO_SIT`, `DOG_SIT_TO_STAND`, `DOG_STAND_TO_LIE`, `DOG_LIE_TO_STAND`, `DOG_STAND_TO_PLAY_BOW`, `DOG_PLAY_BOW_TO_STAND`, `DOG_PICK_UP_BALL`, and `DOG_DROP_BALL`. These should be reusable across sit, sleep, play, fetch, pet interaction, and bathroom states.
