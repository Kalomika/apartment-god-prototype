# Female Generation Prompts

Use these prompts only for future sprite or rough reference-sheet generation. Do not generate final sprite sheets in this cleanup pass.

Global style clause for every prompt:

Realistic orthographic top-down linework, adult Black female, clothing-neutral fitted base sprite, simple tank or tee with fitted shorts or leggings, natural adult anatomy, proportional head, believable hands and feet, cyberpunk apartment life-sim sprite, readable gameplay silhouette, transparent background, consistent canvas size and scale, consistent with male and joint-state scale, no chibi, no cute toy body, no mascot proportions, no oversized head, no emoji body language, no nude body detail.

Reference clause:

Use `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/` as the primary pose and linework reference. Use environment references only for scale and mood context. Reference images are guidance only and must not be copied into final gameplay assets.

## idle

Create a labeled A/B reference sheet for female idle states: `FEMALE_IDLE_STAND_01`, `FEMALE_IDLE_BREATH_01`, `FEMALE_IDLE_LOOK_AROUND_01`, `FEMALE_IDLE_ARMS_SHIFT_01`. Use realistic orthographic top-down linework. A is neutral standing. B is subtle breathing, weight shift, look shift, or small arm shift. Keep adult proportions, grounded weight, and a clothing-neutral fitted base. Transparent background. Frame labels must be visible for review.

## walk

Create a labeled A/B/C reference sheet for `FEMALE_WALK_01`. A is left step, B is passing pose, C is right step. Use realistic top-down adult body mechanics, natural shoulders, hips, knees, arms, and feet. Do not exaggerate into a cartoon walk. Transparent background and consistent scale.

## run

Create a labeled A/B/C reference sheet for `FEMALE_RUN_01`. A is forward drive, B is passing pose, C is opposite drive. Use a slightly wider stride than walk while staying realistic and readable from top-down. No mascot motion or bounce.

## sit

Create a labeled A/B/C reference sheet for `FEMALE_SIT_CHAIR_01`, `FEMALE_SIT_COUCH_01`, `FEMALE_SIT_FLOOR_01`, and `FEMALE_SIT_EDGE_BED_01`. A is standing near the seat or floor area, B is halfway lowering or turning, C is the seated hold. Match the Art Bible seat, bed, and body anchor logic.

## sleep

Create labeled bed pose references for `FEMALE_SLEEP_BED_SOLO_BACK_01`, `FEMALE_SLEEP_BED_SOLO_SIDE_01`, `FEMALE_SLEEP_BED_SOLO_CURLED_01`, `FEMALE_SLEEP_BED_SOLO_SPRAWL_01`, `FEMALE_REST_BED_AWAKE_01`, `FEMALE_GET_IN_BED_01`, and `FEMALE_GET_OUT_OF_BED_01`. Sleep and rest holds are B-only. Do not over-animate sleep. Use sitting-on-bed as the middle transition frame for bed entry and exit.

## phone

Create labeled A/B/C references for `FEMALE_PHONE_STANDING_01`, `FEMALE_PHONE_SEATED_01`, and `FEMALE_PHONE_ON_BED_01`. A enters the phone action, B is thumb or hand shift, C is glance or posture shift. B/C should loop. Phone action should read through hand direction and head angle, not a giant emoji gesture.

## laptop

Create labeled A/B/C references for `FEMALE_LAPTOP_DESK_TYPING_01`, `FEMALE_LAPTOP_ON_LAP_01`, and `FEMALE_LAPTOP_COUCH_TYPING_01`. Use seated-chair or seated-couch logic. A enters the action, B is typing hand one, C is typing hand two. B/C should loop.

## cooking

Create labeled A/B/C references for `FEMALE_COOK_PREP_COUNTER_01`, `FEMALE_COOK_STOVE_01`, `FEMALE_COOK_PAN_STIR_01`, `FEMALE_COOK_MISTAKE_REACT_01`, and `FEMALE_COOK_SERVE_FOOD_01`. Use grounded apartment kitchen actions. Mistake reaction should be readable but restrained, not comedic or emoji-like.

## eating

Create labeled A/B/C references for `FEMALE_EAT_COUCH_01`, `FEMALE_EAT_TABLE_01`, `FEMALE_DRINK_01`, and `FEMALE_SNACK_STANDING_01`. A begins the action, B raises food or drink, C lowers hand or prop. B/C loops where appropriate.

## bathroom

Create labeled safe A/B/C references for `FEMALE_TOILET_USE_SAFE_01`, `FEMALE_SHOWER_SAFE_01`, `FEMALE_BRUSH_TEETH_01`, `FEMALE_GROOM_MIRROR_01`, and `FEMALE_HAIR_GROOM_01`. Keep everything safe and non-explicit. Use top-down blocking, towel, steam, shower wall, toilet, sink, or mirror context where needed. No nudity or explicit anatomical detail.

## reading

Create labeled A/B/C references for `FEMALE_READ_BOOK_STANDING_01`, `FEMALE_READ_BOOK_COUCH_01`, `FEMALE_READ_BOOK_BED_01`, and `FEMALE_PULL_BOOK_FROM_SHELF_01`. For reading, A opens the book, B shifts page or hand, C shifts posture. For shelf action, A stands at shelf, B reaches, C pulls the book close.

## exercise

Create labeled A/B/C references for `FEMALE_PUSHUP_01`, `FEMALE_STRETCH_YOGA_01`, `FEMALE_PLANK_01`, `FEMALE_STRENGTH_TRAIN_01`, and `FEMALE_FLOOR_STRETCH_01`. Use crouch as transition into stretching and floor poses. Use one-hand-on-floor and push-up pose logic for floor recovery. Keep anatomy realistic.

## pet dog

Create labeled A/B/C references for `FEMALE_PET_DOG_01`, `FEMALE_PLAY_FETCH_THROW_01`, `FEMALE_COMFORT_DOG_01`, and `FEMALE_DOG_EXCITED_REACT_01`. Align human contact points to future realistic dog scale and body position. No cute mascot reactions.

## social reactions

Create labeled A/B references for `FEMALE_WAIT_FOR_PARTNER_01`, `FEMALE_CALL_PARTNER_01`, `FEMALE_REACT_HAPPY_01`, `FEMALE_REACT_TIRED_01`, `FEMALE_REACT_ANNOYED_01`, `FEMALE_REACT_SAD_01`, `FEMALE_REACT_SPOOKED_01`, `FEMALE_REACT_REJECT_AFFECTION_01`, and `FEMALE_REACT_COMFORTED_01`. Acting should be subtle and adult, based on posture, shoulders, neck angle, and stance. Reject affection should read as a gentle boundary posture for relationship-memory logic.

## transitions

Create labeled A/B/C references for `FEMALE_STAND_TO_SIT_01`, `FEMALE_SIT_TO_STAND_01`, `FEMALE_STAND_TO_CROUCH_01`, `FEMALE_CROUCH_TO_STAND_01`, `FEMALE_STAND_TO_LIE_FLOOR_01`, `FEMALE_LIE_FLOOR_TO_STAND_01`, `FEMALE_STAND_TO_BED_01`, and `FEMALE_BED_TO_STAND_01`. These must be reusable across couch, bed, yoga, dog petting, and floor actions.
