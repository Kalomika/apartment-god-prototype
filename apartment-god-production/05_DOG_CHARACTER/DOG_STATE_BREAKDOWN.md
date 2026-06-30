# Dog State Breakdown

Production target: realistic top-down dog linework for Apartment God Prototype.

Dog identity: white/off-white initially, recolor-friendly later, natural dog anatomy, realistic pet scale.

Camera and design: orthographic top-down view, transparent PNG target, compatible with realistic human sprites and cyberpunk apartment environments.

Rejected style: cute cartoon puppy, toy mascot, chibi, oversized head, oversized eyes, oversized paws, emoji pose language.

## Frame system

- Standard states: A = enter or anticipation, B = main hold, C = exit or recovery.
- Loop states: A/B/C are loop frames.
- Simple idle: A = neutral, B = subtle shift.
- Sleep: B-only hold poses are acceptable.

## idle

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_IDLE_STAND_01` | neutral standing idle | 2 | A neutral standing top-down, B subtle body weight shift | default idle, ambient |
| `DOG_IDLE_SHIFT_01` | small living shift | 2 | A neutral standing, B one paw/body weight adjustment | idle variation |
| `DOG_IDLE_TAIL_WAG_01` | calm tail wag | 3 | A tail left, B tail center, C tail right | social idle, greeting |
| `DOG_IDLE_LOOK_AROUND_01` | quiet awareness | 3 | A standing, B head/ear left, C head/ear right | apartment ambience |

## walk

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_WALK_01` | natural dog walk cycle | 3 | A front left/rear right step, B passing pose, C front right/rear left step | navigation, follow |

## run

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_RUN_01` | natural dog run cycle | 3 | A extended stride, B gathered stride, C opposite extended stride | fetch, excitement |

## sit

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_SIT_01` | stand to seated hold | 3 | A standing, B rear lowering, C seated hold | command, rest |
| `DOG_SIT_ATTENTION_01` | seated attention | 2 | A seated neutral, B head/ear shift toward target | command response |
| `DOG_SIT_WAITING_01` | seated waiting | 2 | A seated, B tail/ear shift | door wait, calm wait |

## sleep

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_SLEEP_CURLED_01` | curled sleeping hold | 1 | B curled sleeping hold | random sleep pose |
| `DOG_SLEEP_SIDE_01` | side sleeping hold | 1 | B side sleeping hold with relaxed legs | random sleep pose |
| `DOG_SLEEP_BELLY_01` | belly-down sleeping hold | 1 | B belly-down sleep with tucked legs | random sleep pose |
| `DOG_REST_LIE_DOWN_01` | lie down transition | 3 | A standing, B lowering/crouch, C lying down | rest, sleep entry |
| `DOG_GET_UP_FROM_SLEEP_01` | wake and stand | 3 | A lying down, B front legs push up, C standing | wake, sleep exit |

## bark

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_BARK_01` | basic bark | 3 | A standing, B mouth/head raised, C return to standing | interaction sound |
| `DOG_ALERT_BARK_01` | alert bark | 3 | A ears/head alert, B bark, C alert hold | door, stranger, noise |
| `DOG_EXCITED_BARK_01` | excited bark | 3 | A tail raised, B bark with head lift, C excited shift | fetch, greeting |

## sniff

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_SNIFF_FLOOR_01` | sniff floor | 3 | A standing, B head lowered, C small step/sniff | ambient search |
| `DOG_SNIFF_OBJECT_01` | sniff object | 3 | A approach, B nose near object, C head shift | furniture/object curiosity |
| `DOG_SNIFF_NEW_PERSON_01` | sniff new person | 3 | A approach person, B sniff feet/legs, C tail/attention shift | greeting, trust check |

## fetch

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_FETCH_CHASE_01` | chase ball | 3 | A run frame 1, B run frame 2, C run frame 3 | fetch chase |
| `DOG_FETCH_PICKUP_BALL_01` | pick up ball | 3 | A approach ball, B head lowered to ball, C ball in mouth | fetch pickup |
| `DOG_FETCH_CARRY_BALL_01` | carry ball | 3 | A carry step 1, B carry step 2, C carry step 3 | fetch movement |
| `DOG_FETCH_RETURN_01` | return with ball | 3 | A return step 1, B return step 2, C return step 3 | bring ball to human |
| `DOG_FETCH_DROP_BALL_01` | drop ball | 3 | A standing with ball, B head lowered, C ball dropped | fetch complete |

## eat_drink

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_EAT_BOWL_01` | eat from bowl | 3 | A standing at bowl, B head down eating, C head shift eating | hunger need |
| `DOG_DRINK_BOWL_01` | drink from bowl | 3 | A standing at bowl, B head down drinking, C head shift drinking | hydration action |

## play

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_PLAY_BOW_01` | canine play bow | 3 | A standing, B front lowered/rear up, C playful hold | play invitation |
| `DOG_ROLL_OVER_01` | roll over | 3 | A lying side, B rolling, C belly up | trick, affection |
| `DOG_BELLY_UP_01` | belly up | 3 | A side, B belly up hold, C side return | trust, play |
| `DOG_JUMP_EXCITED_01` | small excited hop | 3 | A crouch, B hop/jump, C land | greeting, excitement |
| `DOG_POUNCE_TOY_01` | pounce toy | 3 | A focus on toy, B front lowered toward toy, C pounce hold | toy play |

## comfort

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_COMFORT_HUMAN_01` | comfort human | 3 | A approach sad/tired human, B sit/lean near human, C nuzzle/comfort hold | sadness, stress, bad work day, bad movie reaction |
| `DOG_NUZZLE_HUMAN_01` | nuzzle human | 3 | A near human, B head press/nuzzle, C relaxed hold | affection, comfort |
| `DOG_LIE_NEAR_HUMAN_01` | lie beside human | 3 | A standing near human, B lowering, C lying beside human | calm companion behavior |

## follow

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_FOLLOW_HUMAN_01` | follow human | 3 | A walk frame 1, B walk frame 2, C walk frame 3 | owner following |
| `DOG_WAIT_AT_DOOR_01` | wait at door | 3 | A standing near door, B sit/wait, C look/ear shift | visitors, leaving |
| `DOG_EXCITED_NEW_PERSON_01` | excited greeting | 3 | A alert, B tail wag/step, C excited shift | new person greeting |

## transitions

| State ID | Meaning | Frames | Frame logic | Gameplay use |
|---|---|---:|---|---|
| `DOG_STAND_TO_SIT_01` | stand to sit | 3 | A standing, B rear lowering, C seated | reusable sit transition |
| `DOG_SIT_TO_STAND_01` | sit to stand | 3 | A seated, B weight shift/rear lifting, C standing | reusable sit exit |
| `DOG_STAND_TO_LIE_01` | stand to lie | 3 | A standing, B front legs fold/body lowers, C lying | rest and sleep entry |
| `DOG_LIE_TO_STAND_01` | lie to stand | 3 | A lying, B front legs push up, C standing | rest and sleep exit |
| `DOG_STAND_TO_PLAY_BOW_01` | stand to play bow | 3 | A standing, B front shoulders lower, C play bow hold | play entry |
| `DOG_PLAY_BOW_TO_STAND_01` | play bow to stand | 3 | A play bow hold, B front body lifts, C standing | play exit |
| `DOG_PICK_UP_BALL_01` | reusable ball pickup | 3 | A standing near ball, B head lowered to ball, C ball in mouth | fetch pickup |
| `DOG_DROP_BALL_01` | reusable ball drop | 3 | A ball in mouth, B head lowering, C ball on floor | fetch drop |

## Production notes

- Keep the spine line, shoulders, hips, paws, head, ear placement, and tail readable from above.
- Do not use facial detail as the main acting tool. The pose must read through body mechanics.
- Keep body motion low-frame but believable.
- Keep white and off-white fur values separated from linework so the dog can be recolored.
- Keep ball, bowl, and toy props separate where possible so gameplay can attach, hide, or swap them.
- Comfort states should align to realistic human lower-body or seated anchors.
- Follow, walk, and run may share source drawings if the manifest tags stay separate for gameplay.
