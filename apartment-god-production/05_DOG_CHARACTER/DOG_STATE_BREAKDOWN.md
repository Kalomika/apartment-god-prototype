# Dog State Breakdown

Department: `05_DOG_CHARACTER`

Production target: realistic top-down dog linework for Apartment God Prototype.

Dog identity: white or off-white initially, recolor-friendly later, natural adult dog anatomy, readable top-down animal silhouette, compatible with realistic human sprites and the cyberpunk apartment environment.

Rejected style: cute puppy mascot, chibi, cartoon toy dog, oversized head, oversized paws, oversized eyes, emoji body language, sticker acting.

## Art Bible rules applied

- Orthographic top-down staging.
- Slightly heavier outer contour with controlled interior lines.
- Dog anchor uses `body_center` for most states and `feet_center` for movement states.
- Dog scale must be believable beside adult humans and cannot pop between related states.
- Sleep/rest uses randomized holds instead of constant animation.
- Final production target is transparent PNG, but this pass creates planning files only.

## Reference Library read

- `REFERENCE_LIBRARY/README_REFERENCE_USE.md` read.
- `REFERENCE_LIBRARY/reference_manifest.json` read.
- Dog pose reference listed: `03_dog_references/DOG_REF_01_TOPDOWN_ANIMAL_POSE_SHEET.jpg`.
- Human top-down reference folder listed for scale and interaction anchors.
- Environment reference folder listed for dark cyberpunk apartment readability.

## Frame system

- A = entry, anticipation, or transition into action.
- B = main hold pose or loop frame 1.
- C = exit, recovery, or loop frame 2.
- Idle can use A/B.
- Walk and run use A/B/C as low-frame loops.
- Sleep can use B-only random held poses.

## Idle

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_IDLE_STAND` | 2 | A neutral standing top-down, B subtle breathing or weight shift | default idle | `body_center` |
| `DOG_IDLE_SIT` | 2 | A seated neutral, B small ear/head shift | sit idle | `body_center` |
| `DOG_IDLE_LIE` | 2 | A lying neutral, B small breathing shift | lying idle | `body_center` |
| `DOG_IDLE_TAIL_SHIFT` | 2 | A tail neutral/left, B tail opposite subtle shift | living idle variation | `body_center` |
| `DOG_IDLE_LOOK_UP` | 2 | A neutral, B head and ears angle toward adult human | attention idle | `body_center` |

## Walk

Directional walk states use A/B/C loops with `feet_center` anchor: `DOG_WALK_N`, `DOG_WALK_NE`, `DOG_WALK_E`, `DOG_WALK_SE`, `DOG_WALK_S`, `DOG_WALK_SW`, `DOG_WALK_W`, `DOG_WALK_NW`.

A = first natural paw step, B = passing pose with readable spine line, C = opposite paw step. No cartoon bounce.

## Run

Directional run states use A/B/C loops with `feet_center` anchor: `DOG_RUN_N`, `DOG_RUN_NE`, `DOG_RUN_E`, `DOG_RUN_SE`, `DOG_RUN_S`, `DOG_RUN_SW`, `DOG_RUN_W`, `DOG_RUN_NW`.

A = extended stride, B = gathered stride, C = opposite extended stride. Use for fetch and excitement.

## Sit

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_SIT_IDLE` | 2 | A seated neutral, B subtle seated shift | command/rest | `body_center` |
| `DOG_SIT_LOOK_UP` | 2 | A seated neutral, B head/ears up toward human | attention | `body_center` |
| `DOG_SIT_TAIL_WAG` | 3 | A tail left, B center, C right while seated | social sit | `body_center` |

## Sleep and rest

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_SLEEP_FLOOR_CURLED` | 1 | B curled sleeping hold on floor | random sleep hold | `body_center` |
| `DOG_SLEEP_FLOOR_SIDE` | 1 | B side sleeping hold on floor | random sleep hold | `body_center` |
| `DOG_SLEEP_DOG_BED_CURLED` | 1 | B curled sleeping hold in dog bed | random sleep hold | `body_center` |
| `DOG_SLEEP_DOG_BED_SIDE` | 1 | B side sleeping hold in dog bed | random sleep hold | `body_center` |
| `DOG_SLEEP_COUCH` | 1 | B small dog sleeping on couch cushion | couch sleep hold | `body_center` |
| `DOG_SLEEP_TWITCH` | 2 | B held sleep pose, C rare paw/ear twitch | optional ambient sleep variation | `body_center` |

## Eat and drink

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_EAT_BOWL` | 3 | A at bowl, B head down eating loop 1, C eating loop 2 | hunger | `body_center` |
| `DOG_DRINK_BOWL` | 3 | A at water bowl, B head down drinking loop 1, C drinking loop 2 | drink action | `body_center` |
| `DOG_BOWL_IDLE` | 2 | A standing near bowl, B small sniff/look shift | bowl idle | `body_center` |

## Pet interaction

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_COMFORT_NUZZLE` | 3 | A approach human, B head press/nuzzle, C relaxed hold | comfort | `body_center` |
| `DOG_COMFORT_LIE_NEAR` | 3 | A stand near human, B lower down, C lie near human | comfort/rest | `body_center` |
| `DOG_COMFORT_PAW_TOUCH` | 3 | A sit near human, B paw reaches naturally, C hold paw touch | sadness/stress comfort | `body_center` |
| `DOG_PET_STAND_LEAN` | 3 | A stand by human, B natural lean into petting, C relaxed hold | petting | `body_center` |
| `DOG_PET_SIT_RECEIVE` | 3 | A sit under hand area, B head/ear lowers, C relaxed hold | petting | `body_center` |

## Follow human

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_FOLLOW_HUMAN` | 3 | A/B/C walk follow loop | owner following | `feet_center` |
| `DOG_HEEL_FOLLOW` | 3 | A/B/C close follow loop beside human feet | heel behavior | `feet_center` |
| `DOG_WAIT_AT_DOOR` | 3 | A stand near door, B sit/wait, C look/ear shift | waiting | `body_center` |
| `DOG_EXCITED_GREETING` | 3 | A alert, B tail wag/step, C excited realistic shift | visitor greeting | `body_center` |

## Play

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_FETCH_WAIT` | 2 | A focused wait, B anticipation shift | fetch start | `body_center` |
| `DOG_FETCH_RUN` | 3 | A/B/C run loop toward ball | fetch chase | `feet_center` |
| `DOG_FETCH_CARRY` | 3 | A/B/C carry-ball movement loop | fetch return | `feet_center` |
| `DOG_FETCH_DROP` | 3 | A ball in mouth, B lower head, C ball dropped | fetch complete | `body_center` |
| `DOG_PLAY_BOW` | 3 | A standing, B front lowers, C play bow hold | play invite | `body_center` |
| `DOG_PLAY_ROLL` | 3 | A side, B rolling, C belly/side recovery | play/trust | `body_center` |
| `DOG_PLAY_TOY_SHAKE` | 3 | A toy held, B/C toy shake loop | toy play | `body_center` |

## Bathroom

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_BATHROOM_POTTY_PAD` | 3 | A approach spot, B non-graphic bathroom posture, C step away | dog needs | `body_center` |
| `DOG_BATHROOM_WAIT_DOOR` | 3 | A stand near door, B sit/alert wait, C look back | asking to go out | `body_center` |
| `DOG_BATHROOM_SNIFF_SPOT` | 3 | A approach, B sniff, C small reposition step | needs cue | `body_center` |

## Alert, bark, and sniff

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_BARK_STAND` | 3 | A standing alert, B head raised bark, C return | bark | `body_center` |
| `DOG_BARK_SIT` | 3 | A seated alert, B seated bark, C return | bark | `body_center` |
| `DOG_BARK_ALERT` | 3 | A ears/head alert, B bark with tension, C alert hold | security | `body_center` |
| `DOG_SNIFF_FLOOR` | 3 | A stand, B head down, C small sniff step | ambient sniff | `body_center` |
| `DOG_SNIFF_OBJECT` | 3 | A approach object, B nose near object, C head shift | object sniff | `body_center` |
| `DOG_SNIFF_PERSON` | 3 | A approach person, B sniff feet/legs, C tail/attention shift | social sniff | `body_center` |
| `DOG_ALERT_DOOR` | 3 | A notice door, B point toward door, C alert hold | doorway alert | `body_center` |

## Reusable transitions

| State ID | Frames | A/B/C logic | Gameplay use | Anchor |
|---|---:|---|---|---|
| `DOG_STAND_TO_SIT` | 3 | A standing, B rear lowers, C seated | sit transition | `body_center` |
| `DOG_SIT_TO_STAND` | 3 | A seated, B weight shift, C standing | sit exit | `body_center` |
| `DOG_STAND_TO_LIE` | 3 | A standing, B front legs fold, C lying | sleep/rest entry | `body_center` |
| `DOG_LIE_TO_STAND` | 3 | A lying, B front legs push up, C standing | get-up transition | `body_center` |
| `DOG_STAND_TO_PLAY_BOW` | 3 | A standing, B shoulders lower, C bow hold | play entry | `body_center` |
| `DOG_PLAY_BOW_TO_STAND` | 3 | A bow hold, B body lifts, C standing | play exit | `body_center` |
| `DOG_PICK_UP_BALL` | 3 | A near ball, B head lowers, C ball in mouth | fetch transition | `body_center` |
| `DOG_DROP_BALL` | 3 | A ball in mouth, B head lowers, C ball on floor | fetch transition | `body_center` |

## Production notes

- Ball, bowl, toy, potty pad, and dog bed should remain separable prop layers where possible.
- Pet interaction states must align with adult human scale and avoid cartoon shorthand symbols.
- Bathroom states must remain non-graphic, gameplay-safe, and readable from top-down.
- Final art should be checked with `STYLE_QA_CHECKLIST.md` before any integration queue move.
