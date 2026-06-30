# Dog Generation Prompts

Use these prompts for rough sprite/reference sheets or hand-cleanup guidance. Final assets must be original transparent PNGs.

## Shared style block

realistic top-down dog linework, white/off-white dog initially, color-changeable later, cyberpunk life-sim sprite, transparent background, consistent scale, orthographic top-down, compatible with realistic human sprites, compatible with cyberpunk apartment environment, natural dog anatomy, readable paws and spine line, adult pet proportions, no cute mascot style, no chibi, no oversized head, no oversized eyes, no oversized paws, no toy-like proportions, no emoji expressions

## idle

Create a labeled top-down sprite sheet for `DOG_IDLE_STAND_01`, `DOG_IDLE_SHIFT_01`, `DOG_IDLE_TAIL_WAG_01`, and `DOG_IDLE_LOOK_AROUND_01`. Use A/B for simple idle and A/B/C for tail wag and look around. Keep movement subtle and realistic.

## walk

Create `DOG_WALK_01` with A front left/rear right step, B passing pose, C front right/rear left step. Natural gait only. No cartoon bounce.

## run

Create `DOG_RUN_01` with A extended stride, B gathered stride, C opposite extended stride. Keep anatomy realistic and useful for fetch.

## sit

Create `DOG_SIT_01`, `DOG_SIT_ATTENTION_01`, and `DOG_SIT_WAITING_01`. Sit uses standing to rear-lowering to seated hold. Attention and waiting use small head/ear/tail shifts.

## sleep

Create `DOG_SLEEP_CURLED_01`, `DOG_SLEEP_SIDE_01`, `DOG_SLEEP_BELLY_01`, `DOG_REST_LIE_DOWN_01`, and `DOG_GET_UP_FROM_SLEEP_01`. Sleep holds may be B-only. Do not over-animate sleep. Randomized sleep holds should feel natural.

## bark

Create `DOG_BARK_01`, `DOG_ALERT_BARK_01`, and `DOG_EXCITED_BARK_01`. Bark must read through posture, head lift, ears, and tail, not detailed facial expression.

## sniff

Create `DOG_SNIFF_FLOOR_01`, `DOG_SNIFF_OBJECT_01`, and `DOG_SNIFF_NEW_PERSON_01`. Use nose direction, lowered head, small investigative steps, and clear relationship to floor, object, or human feet/legs.

## fetch

Create `DOG_FETCH_CHASE_01`, `DOG_FETCH_PICKUP_BALL_01`, `DOG_FETCH_CARRY_BALL_01`, `DOG_FETCH_RETURN_01`, and `DOG_FETCH_DROP_BALL_01`. Ball must be visible near the mouth when carried. Keep ball as a separate prop layer if possible.

## eat_drink

Create `DOG_EAT_BOWL_01` and `DOG_DRINK_BOWL_01`. Use A standing at bowl, B head down, C head shift. B/C can loop. Bowl should be separable if possible.

## play

Create `DOG_PLAY_BOW_01`, `DOG_ROLL_OVER_01`, `DOG_BELLY_UP_01`, `DOG_JUMP_EXCITED_01`, and `DOG_POUNCE_TOY_01`. Playful but realistic canine body mechanics. No puppy mascot exaggeration.

## comfort

Create `DOG_COMFORT_HUMAN_01`, `DOG_NUZZLE_HUMAN_01`, and `DOG_LIE_NEAR_HUMAN_01`. These support sadness, stress, bad work days, bad movie reactions, and comfort moments. Dog should align to realistic human sprite anchors.

## follow

Create `DOG_FOLLOW_HUMAN_01`, `DOG_WAIT_AT_DOOR_01`, and `DOG_EXCITED_NEW_PERSON_01`. Use realistic follow distance and door collision readability.

## transitions

Create reusable transition sprites: `DOG_STAND_TO_SIT_01`, `DOG_SIT_TO_STAND_01`, `DOG_STAND_TO_LIE_01`, `DOG_LIE_TO_STAND_01`, `DOG_STAND_TO_PLAY_BOW_01`, `DOG_PLAY_BOW_TO_STAND_01`, `DOG_PICK_UP_BALL_01`, and `DOG_DROP_BALL_01`. Use A/B/C labels and keep the transitions reusable across sit, sleep, fetch, play, and comfort.
