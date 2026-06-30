# Female State Breakdown

This breakdown reconciles the female sprite production states against the final Art Bible and installed Reference Library.

Character target: realistic top-down adult Black female, clothing-neutral fitted base, natural adult anatomy, readable orthographic top-down silhouette, transparent PNG final target.

Global frame rule:

- A = entry, anticipation, or transition.
- B = main hold pose or loop frame 1.
- C = exit, recovery, or loop frame 2.
- Idle uses A/B.
- Walk and run use A/B/C as a low-frame loop.
- Laptop, phone, cooking, eating, and reading enter on A, then loop or hold B/C.
- Sleep and rest use randomized held poses, not constant animation.

Reference reuse rules:

- Use crouch as the transition into and out of yoga, stretching, floor reach, and dog contact.
- Use sitting-on-bed as the middle frame between standing and lying down.
- Use seated-chair as the middle frame for laptop, desk, food, phone, and reading actions.
- Use one-hand-on-floor and push-up poses as get-up-from-floor frames.
- Use side, back, curled, and sprawl sleep references as randomized sleep holds.
- Use two-person bed and couch references later for joint state logic.

## idle

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_IDLE_STAND_01` | 2 | feet_center | A neutral standing, B subtle breathing or weight shift. | neutral idle |
| `FEMALE_IDLE_BREATH_01` | 2 | feet_center | A neutral, B torso and shoulder breath shift. | idle life loop |
| `FEMALE_IDLE_LOOK_AROUND_01` | 2 | feet_center | A neutral, B subtle top-down head and shoulder look shift. | idle awareness |
| `FEMALE_IDLE_ARMS_SHIFT_01` | 2 | feet_center | A neutral, B small grounded arm shift. | idle variation |

## walk and run

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_WALK_01` | 3 | feet_center | A left step, B passing pose, C right step. | low-frame walk loop |
| `FEMALE_RUN_01` | 3 | feet_center | A forward drive, B passing pose, C opposite drive. | low-frame run loop |

## sit

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_SIT_CHAIR_01` | 3 | seat_center | A standing near chair, B lowering or turning, C seated hold. | chair base, desk base |
| `FEMALE_SIT_COUCH_01` | 3 | seat_center | A standing near couch, B lowering or turning, C seated hold. | couch base |
| `FEMALE_SIT_FLOOR_01` | 3 | body_center | A standing or crouch start, B lowering, C floor seated hold. | floor base |
| `FEMALE_SIT_EDGE_BED_01` | 3 | bed_center | A standing beside bed, B lowering, C seated bed edge. | bed transition base |

## sleep and bed rest

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_SLEEP_BED_SOLO_BACK_01` | 1 | bed_center | B-only back sleep hold. | randomized sleep hold |
| `FEMALE_SLEEP_BED_SOLO_SIDE_01` | 1 | bed_center | B-only side sleep hold. | randomized sleep hold |
| `FEMALE_SLEEP_BED_SOLO_CURLED_01` | 1 | bed_center | B-only curled sleep hold. | randomized sleep hold |
| `FEMALE_SLEEP_BED_SOLO_SPRAWL_01` | 1 | bed_center | B-only sprawl sleep hold. | randomized sleep hold |
| `FEMALE_REST_BED_AWAKE_01` | 1 | bed_center | B-only awake rest hold. | bed rest |
| `FEMALE_GET_IN_BED_01` | 3 | bed_center | A standing beside bed, B seated on bed, C lying down. | bed entry |
| `FEMALE_GET_OUT_OF_BED_01` | 3 | bed_center | A lying down, B seated on bed, C standing beside bed. | bed exit |

## phone

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_PHONE_STANDING_01` | 3 | feet_center | A phone held close, B thumb shift, C glance or weight shift. | standing phone loop B/C |
| `FEMALE_PHONE_SEATED_01` | 3 | seat_center | A seated phone entry, B thumb shift, C posture shift. | seated phone loop B/C |
| `FEMALE_PHONE_ON_BED_01` | 3 | bed_center | A phone on bed, B thumb shift, C torso or glance shift. | bed phone loop B/C |

## laptop

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_LAPTOP_DESK_TYPING_01` | 3 | seat_center | A standing at chair, B seated typing left hand, C seated typing right hand. | desk typing loop B/C |
| `FEMALE_LAPTOP_ON_LAP_01` | 3 | seat_center | A laptop on lap, B typing left hand, C typing right hand. | lap typing loop B/C |
| `FEMALE_LAPTOP_COUCH_TYPING_01` | 3 | seat_center | A couch laptop entry, B typing left hand, C typing right hand. | couch typing loop B/C |

## cooking

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_COOK_PREP_COUNTER_01` | 3 | feet_center | A reaching, B chopping or prep, C alternate hand prep. | counter prep loop B/C |
| `FEMALE_COOK_STOVE_01` | 3 | feet_center | A stand at stove, B hand over pan, C stir or turn. | stove loop B/C |
| `FEMALE_COOK_PAN_STIR_01` | 3 | feet_center | A hand to pan, B stir pass, C alternate stir pass. | pan stir loop B/C |
| `FEMALE_COOK_MISTAKE_REACT_01` | 3 | feet_center | A normal cooking, B grounded flinch, C recover. | kitchen event reaction |
| `FEMALE_COOK_SERVE_FOOD_01` | 3 | feet_center | A hold food, B step to serve, C present food. | serve action |

## eating

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_EAT_COUCH_01` | 3 | seat_center | A seated with food, B hand to mouth, C hand lowered. | couch eating loop B/C |
| `FEMALE_EAT_TABLE_01` | 3 | seat_center | A seated at table, B hand to mouth, C hand lowered. | table eating loop B/C |
| `FEMALE_DRINK_01` | 3 | feet_center | A hold drink, B drink raised, C drink lowered. | drink loop B/C |
| `FEMALE_SNACK_STANDING_01` | 3 | feet_center | A standing with snack, B hand to mouth, C hand lowered. | snack loop B/C |

## shower_bathroom

All bathroom states must remain safe, non-explicit, and top-down readable. Use towel, steam, door, shower wall, sink, mirror, and top-down blocking as needed. No nudity or explicit anatomy detail.

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_TOILET_USE_SAFE_01` | 3 | seat_center | A approach, B seated safe hold, C standing exit. | safe bathroom use |
| `FEMALE_SHOWER_SAFE_01` | 3 | body_center | A enter shower, B safe shower silhouette, C exit. | safe shower action |
| `FEMALE_BRUSH_TEETH_01` | 3 | feet_center | A stand at sink, B hand raised, C brush motion. | hygiene loop B/C |
| `FEMALE_GROOM_MIRROR_01` | 3 | feet_center | A stand at mirror, B hands near head or face, C alternate groom pose. | grooming loop B/C |
| `FEMALE_HAIR_GROOM_01` | 3 | feet_center | A stand at mirror, B hands near hair, C alternate hair pose. | hair grooming loop B/C |

## reading

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_READ_BOOK_STANDING_01` | 3 | feet_center | A open book, B page or hand shift, C posture shift. | standing read loop B/C |
| `FEMALE_READ_BOOK_COUCH_01` | 3 | seat_center | A open book on couch, B page shift, C posture shift. | couch read loop B/C |
| `FEMALE_READ_BOOK_BED_01` | 3 | bed_center | A open book in bed, B page shift, C posture shift. | bed read loop B/C |
| `FEMALE_PULL_BOOK_FROM_SHELF_01` | 3 | feet_center | A stand at shelf, B reach to shelf, C book pulled close. | bookshelf action |

## exercise

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_PUSHUP_01` | 3 | body_center | A high plank, B lowered, C high plank. | pushup loop |
| `FEMALE_STRETCH_YOGA_01` | 3 | body_center | A standing, B crouch or hands toward floor, C stretch hold. | yoga stretch |
| `FEMALE_PLANK_01` | 3 | body_center | A enter plank, B plank hold, C micro shift or recover. | plank hold loop B/C |
| `FEMALE_STRENGTH_TRAIN_01` | 3 | feet_center | A ready, B lift or strain, C lower or recover. | strength loop B/C |
| `FEMALE_FLOOR_STRETCH_01` | 3 | body_center | A sit or crouch, B stretch forward, C stretch hold. | floor stretch |

## pet_dog

Dog interaction states must align to future realistic dog contact points and must not use cute mascot reactions.

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_PET_DOG_01` | 3 | body_center | A stand or kneel near dog, B hand down petting, C alternate petting. | dog pet loop B/C |
| `FEMALE_PLAY_FETCH_THROW_01` | 3 | feet_center | A ball ready, B arm back, C release. | fetch throw |
| `FEMALE_COMFORT_DOG_01` | 3 | body_center | A crouch, B hand on dog, C calm hold. | dog comfort |
| `FEMALE_DOG_EXCITED_REACT_01` | 3 | feet_center | A standing, B slight grounded lean, C pet or calm. | dog excitement reaction |

## social_solo

Solo social states are fallback halves for future joint sprite logic. Keep acting subtle, adult, and grounded.

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_WAIT_FOR_PARTNER_01` | 2 | feet_center | A neutral wait, B subtle look or weight shift. | partner wait |
| `FEMALE_CALL_PARTNER_01` | 2 | feet_center | A phone raised, B call hold. | partner call |
| `FEMALE_REACT_HAPPY_01` | 2 | feet_center | A neutral, B relaxed happy posture. | social reaction |
| `FEMALE_REACT_TIRED_01` | 2 | feet_center | A neutral, B lowered shoulders or tired weight. | social reaction |
| `FEMALE_REACT_ANNOYED_01` | 2 | feet_center | A neutral, B guarded or annoyed posture. | social reaction |
| `FEMALE_REACT_SAD_01` | 2 | feet_center | A neutral, B closed lowered posture. | social reaction |
| `FEMALE_REACT_SPOOKED_01` | 2 | feet_center | A neutral, B small recoil or alert stance. | social reaction |
| `FEMALE_REACT_REJECT_AFFECTION_01` | 2 | feet_center | A neutral partner-facing setup, B gentle boundary pushback. | relationship memory fallback |
| `FEMALE_REACT_COMFORTED_01` | 2 | feet_center | A closed posture, B softened comforted posture. | comfort fallback |

## transitions

Transitions are reusable and should be shared across furniture, bed, dog, exercise, and floor actions.

| State ID | Frames | Anchor | Logic | Gameplay use |
|---|---:|---|---|---|
| `FEMALE_STAND_TO_SIT_01` | 3 | seat_center | A standing, B lowering, C seated. | reusable sit transition |
| `FEMALE_SIT_TO_STAND_01` | 3 | seat_center | A seated, B rising, C standing. | reusable stand transition |
| `FEMALE_STAND_TO_CROUCH_01` | 3 | body_center | A standing, B lowering, C crouched. | floor and dog transition |
| `FEMALE_CROUCH_TO_STAND_01` | 3 | body_center | A crouched, B rising, C standing. | floor and dog recovery |
| `FEMALE_STAND_TO_LIE_FLOOR_01` | 3 | body_center | A standing, B lowering, C lying floor hold. | floor entry |
| `FEMALE_LIE_FLOOR_TO_STAND_01` | 3 | body_center | A lying, B one-hand floor recovery, C standing. | floor recovery |
| `FEMALE_STAND_TO_BED_01` | 3 | bed_center | A standing beside bed, B seated on bed, C lying in bed. | bed entry transition |
| `FEMALE_BED_TO_STAND_01` | 3 | bed_center | A lying in bed, B seated on bed, C standing beside bed. | bed exit transition |
