# Male State Breakdown

Department: `02_MALE_CHARACTER`  
Branch: `male-character-realistic-sprite-states`  
Production target: original transparent PNG sprites, not generated in this pass

## Art Bible alignment

This breakdown follows the installed Art Bible and Reference Library.

Primary rules used:

- realistic top-down adult Black male
- clothing-neutral base sprite, not nude
- adult proportions
- no chibi, cute toy body, mascot proportions, oversized head, emoji body language, or childlike body
- A/B/C frame logic from the Art Bible
- stable anchors from `SCALE_AND_ANCHOR_GUIDE.md`
- uppercase snake case state IDs from `SPRITE_STATE_LIST.md` where available
- reference images used only for pose, style, scale, linework, and mood guidance

## Anchor plan

| Pose family | Anchor label | Normalized XY |
| --- | --- | --- |
| standing, idle, walk, run, standing phone, standing social | `feet_center` | `[0.5, 0.86]` |
| chair, couch, desk, table, seated phone, seated laptop, seated eating, seated reading | `seat_center` | `[0.5, 0.62]` |
| bed sleep, bed rest, bed reading, bed transition | `bed_center` | `[0.5, 0.5]` |
| floor, crouch, exercise, pet dog, floor transition | `body_center` | `[0.5, 0.5]` |

## Frame logic

| State type | Frame count | Logic |
| --- | ---: | --- |
| idle | 2 | A neutral, B subtle breathing, weight shift, or head/phone glance |
| walk/run | 3 | A/B/C low-frame locomotion loop |
| seated actions | 3 | A entry or transition, B main hold or loop 1, C exit, recovery, or loop 2 |
| laptop, phone, cooking, eating, reading | 3 | A enters action, B/C loop or hold after entry |
| sleep/rest holds | 1 | B-only randomized hold where appropriate |
| reusable transitions | 3 | A origin pose, B middle bridge pose, C destination pose |

## State groups

### idle

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_IDLE_STAND` | 2 | base standing idle |
| `MALE_IDLE_SHIFT_WEIGHT` | 2 | ambient idle variation |
| `MALE_IDLE_TURN_HEAD` | 2 | ambient scan or attention shift |

### walk

Directional movement uses Art Bible direction tokens and A/B/C looping.

`MALE_WALK_N`, `MALE_WALK_NE`, `MALE_WALK_E`, `MALE_WALK_SE`, `MALE_WALK_S`, `MALE_WALK_SW`, `MALE_WALK_W`, `MALE_WALK_NW`

### run

Directional running uses the same direction tokens as walking, with slightly wider stride and controlled adult body mechanics.

`MALE_RUN_N`, `MALE_RUN_NE`, `MALE_RUN_E`, `MALE_RUN_SE`, `MALE_RUN_S`, `MALE_RUN_SW`, `MALE_RUN_W`, `MALE_RUN_NW`

### sit

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_SIT_CHAIR_IDLE` | 3 | chair sitting and general seated base |
| `MALE_SIT_COUCH_IDLE` | 3 | couch sitting base |
| `MALE_SIT_FLOOR_IDLE` | 3 | floor sitting base |

### sleep

Sleep and rest should use randomized holds, not constant animation.

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_SLEEP_BED_SOLO_BACK` | 1 | bed sleep random hold |
| `MALE_SLEEP_BED_SOLO_SIDE` | 1 | bed sleep random hold |
| `MALE_SLEEP_BED_SOLO_CURLED` | 1 | bed sleep random hold |
| `MALE_SLEEP_BED_SOLO_SPRAWL` | 1 | bed sleep random hold |
| `MALE_SLEEP_COUCH_SIDE` | 1 | couch sleep random hold |
| `MALE_WAKE_BED` | 3 | bed wake transition using sitting-on-bed midpoint |

### phone

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_PHONE_STAND_TEXTING` | 3 | standing texting loop |
| `MALE_PHONE_COUCH_SCROLL` | 3 | couch phone scrolling loop |

### laptop

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_LAPTOP_DESK_TYPING` | 3 | desk laptop work loop |
| `MALE_LAPTOP_COUCH_TYPING` | 3 | couch laptop loop |

### cooking

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_COOKING_COUNTER_PREP` | 3 | counter prep loop |
| `MALE_COOKING_STOVE_IDLE` | 3 | stove cooking hold |
| `MALE_COOKING_STOVE_STIR` | 3 | pan or pot stir loop |
| `MALE_COOKING_MISTAKE_REACT` | 3 | grounded cooking mistake reaction |

### eating

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_EATING_COUCH_IDLE` | 3 | couch eating hold |
| `MALE_EATING_TABLE_BITE` | 3 | table bite loop |
| `MALE_DRINK` | 3 | drinking loop |

### shower_bathroom

All bathroom states are safe and non-explicit. Use fixture coverage, towel coverage, steam, curtain blocking, and top-down staging.

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_BATHROOM_TOILET_IDLE` | 3 | safe toilet state |
| `MALE_SHOWER_LOOP` | 3 | safe shower state |
| `MALE_BRUSH_TEETH` | 3 | sink hygiene loop |
| `MALE_BATHROOM_MIRROR_IDLE` | 3 | mirror grooming hold |

### reading

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_READING_COUCH` | 3 | couch reading loop |
| `MALE_READING_BED` | 3 | bed reading hold |
| `MALE_READING_DESK` | 3 | desk reading hold |
| `MALE_PULL_BOOK_FROM_SHELF` | 3 | bookshelf interaction |

### exercise

Use crouch, one-hand-on-floor, push-up, and plank pose logic from the shared human reference sheets.

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_EXERCISE_PUSHUP` | 3 | push-up loop |
| `MALE_EXERCISE_STRETCH` | 3 | stretching hold |
| `MALE_PLANK` | 3 | plank hold entry and release |
| `MALE_STRENGTH_TRAIN` | 3 | strength action loop |

### pet_dog

These are solo male halves. The dog remains a separate realistic white or off-white layer.

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_DOG_PET_CROUCH` | 3 | pet dog loop |
| `MALE_DOG_FETCH_THROW` | 3 | throw fetch object |
| `MALE_DOG_COMFORT_CROUCH` | 3 | comfort dog hold |

### social_solo

Solo reactions use adult posture changes only. No emoji faces or childish gestures.

| State ID | Frames | Gameplay use |
| --- | ---: | --- |
| `MALE_SOCIAL_WAIT_PARTNER` | 3 | wait for partner |
| `MALE_SOCIAL_CALL_PARTNER` | 3 | call partner |
| `MALE_REACT_HAPPY` | 3 | happy reaction |
| `MALE_REACT_TIRED` | 3 | tired reaction |
| `MALE_REACT_ANNOYED` | 3 | annoyed reaction |
| `MALE_REACT_SAD` | 3 | sad reaction |
| `MALE_REACT_SPOOKED` | 3 | spooked reaction |

### transitions

Reusable transitions bridge furniture, bed, yoga, dog petting, and floor actions.

| State ID | Frames | Reuse target |
| --- | ---: | --- |
| `MALE_TRANSITION_STAND_TO_SIT` | 3 | chair, couch, table, desk |
| `MALE_TRANSITION_SIT_TO_STAND` | 3 | chair, couch, table, desk |
| `MALE_TRANSITION_STAND_TO_CROUCH` | 3 | dog, yoga, floor reach |
| `MALE_TRANSITION_CROUCH_TO_STAND` | 3 | dog, yoga, floor recovery |
| `MALE_TRANSITION_STAND_TO_LIE_FLOOR` | 3 | rest, floor exercise |
| `MALE_TRANSITION_LIE_FLOOR_TO_STAND` | 3 | floor recovery using one-hand-on-floor logic |
| `MALE_TRANSITION_STAND_TO_BED` | 3 | get into bed using sitting-on-bed midpoint |
| `MALE_TRANSITION_BED_TO_STAND` | 3 | get out of bed using sitting-on-bed midpoint |

## Total planned states

Total planned male states in this pass: **69**

All planned states are listed in `manifest_male.json` and indexed in `manifest_male_state_index.json`.
