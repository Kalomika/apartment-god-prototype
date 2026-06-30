# Dog Generation Prompts

These prompts are for rough labeled sprite/reference sheets. They are meant for a future sprite-generation or cleanup pass and should be checked against the master Art Bible once it is available in the repo.

## Shared style block

realistic top-down dog linework, white/off-white dog initially, color-changeable later, cyberpunk life-sim sprite, no cute mascot style, no chibi, no oversized head, no oversized eyes, no oversized paws, transparent background, consistent scale, orthographic top-down view, compatible with realistic human sprites, compatible with cyberpunk apartment environment, natural dog anatomy, adult pet proportions, clean readable silhouette, transparent PNG production target

## Group prompts

### idle

Create a labeled sprite reference sheet for idle dog states: `DOG_IDLE_STAND_01`, `DOG_IDLE_SHIFT_01`, `DOG_IDLE_TAIL_WAG_01`, `DOG_IDLE_LOOK_AROUND_01`. Include frame labels A/B/C where used. For `DOG_IDLE_STAND_01` use A neutral standing top-down and B subtle weight shift. For `DOG_IDLE_TAIL_WAG_01` use A tail left, B tail center, C tail right. Keep the dog alive but calm, no cartoon bounce. Use the shared style block above.

### walk

Create a labeled sprite reference sheet for `DOG_WALK_01`. Use A front left and rear right step, B passing pose, C front right and rear left step. Natural dog gait, readable paws, readable spine line, no exaggerated bounce. Use the shared style block above.

### run

Create a labeled sprite reference sheet for `DOG_RUN_01`. Use A extended stride, B gathered stride, C opposite extended stride. Useful for fetch and excitement. Keep anatomy realistic, no stretch mascot look. Use the shared style block above.

### sit

Create a labeled sprite reference sheet for `DOG_SIT_01`, `DOG_SIT_ATTENTION_01`, and `DOG_SIT_WAITING_01`. `DOG_SIT_01` uses A standing, B lowering rear, C seated hold. Attention and waiting states use small head, ear, and tail shifts while seated. Use the shared style block above.

### sleep

Create a labeled sprite reference sheet for `DOG_SLEEP_CURLED_01`, `DOG_SLEEP_SIDE_01`, `DOG_SLEEP_BELLY_01`, `DOG_REST_LIE_DOWN_01`, and `DOG_GET_UP_FROM_SLEEP_01`. Sleep holds may be B-only. Lie down uses A standing, B lowering/crouch, C lying down. Get up uses A lying down, B front legs pushing up, C standing. Use the shared style block above.

### bark

Create a labeled sprite reference sheet for `DOG_BARK_01`, `DOG_ALERT_BARK_01`, and `DOG_EXCITED_BARK_01`. `DOG_BARK_01` uses A standing, B mouth/head raised, C return to standing. Make barking readable from body posture and raised head, not facial detail. Use the shared style block above.

### sniff

Create a labeled sprite reference sheet for `DOG_SNIFF_FLOOR_01`, `DOG_SNIFF_OBJECT_01`, and `DOG_SNIFF_NEW_PERSON_01`. Use lowered head, nose direction, small investigation steps, and clear relationship to floor, object, or human feet/legs. Use the shared style block above.

### fetch

Create a labeled sprite reference sheet for `DOG_FETCH_CHASE_01`, `DOG_FETCH_PICKUP_BALL_01`, `DOG_FETCH_CARRY_BALL_01`, `DOG_FETCH_RETURN_01`, and `DOG_FETCH_DROP_BALL_01`. Ball must be visible near mouth when carried. Keep ball as a separate prop layer if possible. Use the shared style block above.

### eat/drink

Create a labeled sprite reference sheet for `DOG_EAT_BOWL_01` and `DOG_DRINK_BOWL_01`. Use A standing at bowl, B head down, C head shift. B/C are loop frames. Bowl should be a separate prop if possible. Use the shared style block above.

### play

Create a labeled sprite reference sheet for `DOG_PLAY_BOW_01`, `DOG_ROLL_OVER_01`, `DOG_BELLY_UP_01`, `DOG_JUMP_EXCITED_01`, and `DOG_POUNCE_TOY_01`. Keep playful poses real and canine, no puppy mascot exaggeration. Use the shared style block above.

### comfort

Create a labeled sprite reference sheet for `DOG_COMFORT_HUMAN_01`, `DOG_NUZZLE_HUMAN_01`, and `DOG_LIE_NEAR_HUMAN_01`. Show dog approaching, sitting/leaning, nuzzling, or lying near a realistic human sprite anchor. Supports sadness, stress, bad work days, bad movie reactions, and comfort moments. Use the shared style block above.

### follow

Create a labeled sprite reference sheet for `DOG_FOLLOW_HUMAN_01`, `DOG_WAIT_AT_DOOR_01`, and `DOG_EXCITED_NEW_PERSON_01`. Use walk loop frames for following, door waiting with sit/look shift, and realistic excited greeting without cute mascot proportions. Use the shared style block above.

### transitions

Create a labeled sprite reference sheet for reusable transition states: `DOG_STAND_TO_SIT_01`, `DOG_SIT_TO_STAND_01`, `DOG_STAND_TO_LIE_01`, `DOG_LIE_TO_STAND_01`, `DOG_STAND_TO_PLAY_BOW_01`, `DOG_PLAY_BOW_TO_STAND_01`, `DOG_PICK_UP_BALL_01`, and `DOG_DROP_BALL_01`. Use A/B/C frame labels and keep each transition reusable across sit, sleep, fetch, play, and comfort. Use the shared style block above.
