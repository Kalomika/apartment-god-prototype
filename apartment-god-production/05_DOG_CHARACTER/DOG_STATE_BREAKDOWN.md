# Dog State Breakdown

Department: `05_DOG_CHARACTER`

Target: realistic top-down white/off-white dog linework, recolor-friendly later, compatible with realistic human sprites and cyberpunk apartment gameplay.

Rejected style: cute puppy mascot, chibi, toy body, oversized head, oversized eyes, oversized paws, emoji expressions.

## Frame system

- A = enter, anticipation, or transition into pose.
- B = main hold pose or loop frame 1.
- C = exit, recovery, or loop frame 2.
- Simple idle can use A/B.
- Walk and run loop A/B/C.
- Sleep hold poses can be B-only, with lie-down and get-up transitions planned separately.

## idle

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_IDLE_STAND_01` | 2 | A neutral standing top-down, B subtle body weight shift | default idle |
| `DOG_IDLE_SHIFT_01` | 2 | A neutral standing, B one paw/body weight adjustment | ambient variation |
| `DOG_IDLE_TAIL_WAG_01` | 3 | A tail left, B tail center, C tail right | social idle |
| `DOG_IDLE_LOOK_AROUND_01` | 3 | A standing, B head/ear shift left, C head/ear shift right | awareness idle |

## walk

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_WALK_01` | 3 | A front left/rear right step, B passing pose, C front right/rear left step | movement and follow |

## run

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_RUN_01` | 3 | A extended stride, B gathered stride, C opposite extended stride | fetch and excitement |

## sit

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_SIT_01` | 3 | A standing, B lowering rear, C seated hold | command/rest |
| `DOG_SIT_ATTENTION_01` | 2 | A seated neutral, B head/ear shift toward target | attention |
| `DOG_SIT_WAITING_01` | 2 | A seated, B tail/ear shift | waiting |

## sleep

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_SLEEP_CURLED_01` | 1 | B curled sleeping hold | random sleep pose |
| `DOG_SLEEP_SIDE_01` | 1 | B side sleeping hold | random sleep pose |
| `DOG_SLEEP_BELLY_01` | 1 | B belly-down sleeping hold | random sleep pose |
| `DOG_REST_LIE_DOWN_01` | 3 | A standing, B lowering/crouch, C lying down | sleep entry |
| `DOG_GET_UP_FROM_SLEEP_01` | 3 | A lying down, B front legs pushing up, C standing | wake exit |

## bark

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_BARK_01` | 3 | A standing, B mouth/head raised, C return to standing | basic bark |
| `DOG_ALERT_BARK_01` | 3 | A ears/head alert, B bark, C alert hold | alert/security |
| `DOG_EXCITED_BARK_01` | 3 | A tail raised, B bark/head lift, C excited shift | greeting/play |

## sniff

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_SNIFF_FLOOR_01` | 3 | A standing, B head lowered, C small step/sniff | ambient investigation |
| `DOG_SNIFF_OBJECT_01` | 3 | A approach, B nose near object, C head shift | object curiosity |
| `DOG_SNIFF_NEW_PERSON_01` | 3 | A approach person, B sniff feet/legs, C tail/attention shift | greeting/trust |

## fetch

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_FETCH_CHASE_01` | 3 | A run frame 1, B run frame 2, C run frame 3 | chase ball |
| `DOG_FETCH_PICKUP_BALL_01` | 3 | A approach ball, B head lowered to ball, C ball in mouth | pickup |
| `DOG_FETCH_CARRY_BALL_01` | 3 | A carry step 1, B carry step 2, C carry step 3 | carrying ball |
| `DOG_FETCH_RETURN_01` | 3 | A return step 1, B return step 2, C return step 3 | return to human |
| `DOG_FETCH_DROP_BALL_01` | 3 | A standing with ball, B head lowered, C ball dropped | drop ball |

## eat_drink

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_EAT_BOWL_01` | 3 | A standing at bowl, B head down eating, C head shift eating | hunger |
| `DOG_DRINK_BOWL_01` | 3 | A standing at bowl, B head down drinking, C head shift drinking | drink action |

## play

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_PLAY_BOW_01` | 3 | A standing, B front lowered/rear up, C playful hold | play invite |
| `DOG_ROLL_OVER_01` | 3 | A lying side, B rolling, C belly up | trick/play |
| `DOG_BELLY_UP_01` | 3 | A side, B belly up hold, C side return | trust/play |
| `DOG_JUMP_EXCITED_01` | 3 | A crouch, B hop/jump, C land | greeting |
| `DOG_POUNCE_TOY_01` | 3 | A focus on toy, B front lowered toward toy, C pounce hold | toy play |

## comfort

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_COMFORT_HUMAN_01` | 3 | A approach sad/tired human, B sit/lean near human, C nuzzle/comfort hold | comfort gameplay |
| `DOG_NUZZLE_HUMAN_01` | 3 | A near human, B head press/nuzzle, C relaxed hold | affection/comfort |
| `DOG_LIE_NEAR_HUMAN_01` | 3 | A standing near human, B lowering, C lying beside human | calm companion |

## follow

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_FOLLOW_HUMAN_01` | 3 | A walk frame 1, B walk frame 2, C walk frame 3 | follow owner |
| `DOG_WAIT_AT_DOOR_01` | 3 | A standing near door, B sit/wait, C look/ear shift | waiting at door |
| `DOG_EXCITED_NEW_PERSON_01` | 3 | A alert, B tail wag/step, C excited shift | greet visitor |

## transitions

| State ID | Frame count | A/B/C logic | Gameplay use |
|---|---:|---|---|
| `DOG_STAND_TO_SIT_01` | 3 | A standing, B rear lowering, C seated | reusable transition |
| `DOG_SIT_TO_STAND_01` | 3 | A seated, B weight shift/rear lifting, C standing | reusable transition |
| `DOG_STAND_TO_LIE_01` | 3 | A standing, B front legs fold/body lowers, C lying | reusable transition |
| `DOG_LIE_TO_STAND_01` | 3 | A lying, B front legs push up, C standing | reusable transition |
| `DOG_STAND_TO_PLAY_BOW_01` | 3 | A standing, B front shoulders lower, C play bow hold | reusable transition |
| `DOG_PLAY_BOW_TO_STAND_01` | 3 | A play bow hold, B front body lifts, C standing | reusable transition |
| `DOG_PICK_UP_BALL_01` | 3 | A standing near ball, B head lowered to ball, C ball in mouth | reusable fetch transition |
| `DOG_DROP_BALL_01` | 3 | A ball in mouth, B head lowering, C ball on floor | reusable fetch transition |

## Production notes

- Keep acting readable through body mechanics, not facial detail.
- Keep props like ball, bowl, and toy separable when possible.
- Keep white/off-white fur values separate from linework so recolors can happen later.
- Maintain a practical `center_ground_shadow` anchor until a final scale/anchor guide is available.
