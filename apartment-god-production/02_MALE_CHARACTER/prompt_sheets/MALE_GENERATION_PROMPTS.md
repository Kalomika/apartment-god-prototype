# Male Generation Prompts

Use these prompts for a future image or sprite production pass. Do not generate final sprite sheets during this planning pass.

## Required global prompt language

Every male sprite generation prompt must include:

- realistic top-down linework
- adult Black male
- clothing-neutral base sprite, not nude
- simple fitted tank, tee, fitted shorts, fitted leggings, sleepwear, or safe mannequin line-art with no explicit body detail
- cyberpunk apartment life-sim sprite
- orthographic top-down view
- transparent background
- consistent scale
- consistent Art Bible anchor
- A/B/C frame labels where applicable
- no chibi
- no cute style
- no toy body
- no mascot proportions
- no oversized head
- no emoji body language
- no watermarks or source reference images in final art

## Reference Library instruction

Before generating, inspect:

- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_01_MIXED_TOPDOWN_POSES_FULL_SHEET.png`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_02_SLEEP_BED_POSE_SHEET.jpg`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_03_BED_SOCIAL_REST_POSE_SHEET.jpg`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_04_DESK_WORK_GROUP_TOPDOWN.jpg`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_05_DESK_SEATED_YOGA_LINEWORK.jpg`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_06_DAILY_ACTION_LINEWORK.jpg`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_07_STOCK_TOPDOWN_MOVEMENT_SHEET.jpg`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_09_DESK_PHONE_YOGA_SELECTED_POSES.jpg`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/HUMAN_REF_10_STANDING_CROUCH_DOG_POSE_SHEET.jpg`

Use the reference library for pose construction, linework, scale, and top-down logic only. Final sprites must be original production art.

## Idle prompt

Create a labeled sprite sheet for `MALE_IDLE_STAND`, `MALE_IDLE_SHIFT_WEIGHT`, and `MALE_IDLE_TURN_HEAD`. Use realistic top-down linework, adult Black male, clothing-neutral base sprite, transparent background, consistent `feet_center` anchor, no chibi, no cute style, no mascot proportions. Use A/B frame labels. A is neutral. B is subtle breathing, weight shift, or head turn.

## Walk prompt

Create a labeled directional walk sheet for `MALE_WALK_N`, `MALE_WALK_NE`, `MALE_WALK_E`, `MALE_WALK_SE`, `MALE_WALK_S`, `MALE_WALK_SW`, `MALE_WALK_W`, and `MALE_WALK_NW`. Use A/B/C as a low-frame locomotion loop. Keep adult stride, realistic shoulder counter-swing, believable limb overlap, consistent `feet_center` anchor, and readable top-down silhouette.

## Run prompt

Create a labeled directional run sheet for `MALE_RUN_N`, `MALE_RUN_NE`, `MALE_RUN_E`, `MALE_RUN_SE`, `MALE_RUN_S`, `MALE_RUN_SW`, `MALE_RUN_W`, and `MALE_RUN_NW`. Use A/B/C as a low-frame loop. The stride is wider than walk but still grounded and realistic. No cartoon bounce or squash.

## Sit prompt

Create a labeled sheet for `MALE_SIT_CHAIR_IDLE`, `MALE_SIT_COUCH_IDLE`, and `MALE_SIT_FLOOR_IDLE`. Use A/B/C. A is standing near the seat or floor target. B is lowering, turning, or crouching. C is the seated hold. Use `seat_center` for chair/couch and `body_center` for floor sitting.

## Sleep prompt

Create held sleep poses for `MALE_SLEEP_BED_SOLO_BACK`, `MALE_SLEEP_BED_SOLO_SIDE`, `MALE_SLEEP_BED_SOLO_CURLED`, `MALE_SLEEP_BED_SOLO_SPRAWL`, and `MALE_SLEEP_COUCH_SIDE`. Use B-only hold frames for sleep holds. Also create `MALE_WAKE_BED` as A lying, B sitting on bed edge, C standing beside bed. Use `bed_center` for bed and `seat_center` for couch.

## Phone prompt

Create a labeled sheet for `MALE_PHONE_STAND_TEXTING` and `MALE_PHONE_COUCH_SCROLL`. Use A/B/C. A enters phone use. B/C loop. Keep hands realistically scaled, phone readable but not oversized, and body language adult. Use `feet_center` for standing and `seat_center` for couch.

## Laptop prompt

Create a labeled sheet for `MALE_LAPTOP_DESK_TYPING` and `MALE_LAPTOP_COUCH_TYPING`. Use seated-chair or seated-couch reference logic. A enters laptop pose. B/C loop typing with small left/right hand shifts. Use `seat_center` anchor and preserve furniture scale.

## Cooking prompt

Create a labeled sheet for `MALE_COOKING_COUNTER_PREP`, `MALE_COOKING_STOVE_IDLE`, `MALE_COOKING_STOVE_STIR`, and `MALE_COOKING_MISTAKE_REACT`. Use A/B/C. Cooking motion must be realistic, functional, and readable from above. Mistake reaction is a grounded recoil, not a cartoon flail.

## Eating prompt

Create a labeled sheet for `MALE_EATING_COUCH_IDLE`, `MALE_EATING_TABLE_BITE`, and `MALE_DRINK`. Use A/B/C. A enters the action, B is food or drink to mouth, C lowers the hand. Use seated-chair and couch reference logic.

## Bathroom prompt

Create safe, non-explicit top-down states for `MALE_BATHROOM_TOILET_IDLE`, `MALE_SHOWER_LOOP`, `MALE_BRUSH_TEETH`, and `MALE_BATHROOM_MIRROR_IDLE`. Use towel, fixture coverage, steam, shower curtain, mirror/sink blocking, and top-down staging. No nudity, no explicit detail.

## Reading prompt

Create a labeled sheet for `MALE_READING_COUCH`, `MALE_READING_BED`, `MALE_READING_DESK`, and `MALE_PULL_BOOK_FROM_SHELF`. Use seated couch, bed, desk, and standing shelf reference logic. A enters, B is main hold, C is page, hand, or posture shift.

## Exercise prompt

Create a labeled sheet for `MALE_EXERCISE_PUSHUP`, `MALE_EXERCISE_STRETCH`, `MALE_PLANK`, and `MALE_STRENGTH_TRAIN`. Use crouch as a transition into stretching. Use push-up, plank, and one-hand-on-floor reference logic. Maintain believable floor contact and adult anatomy.

## Pet dog prompt

Create solo male half sprites for `MALE_DOG_PET_CROUCH`, `MALE_DOG_FETCH_THROW`, and `MALE_DOG_COMFORT_CROUCH`. Use the human crouch references and the dog reference sheet for spacing. The dog remains a separate realistic white or off-white layer. No cute mascot behavior.

## Social solo prompt

Create subtle adult top-down reaction states for `MALE_SOCIAL_WAIT_PARTNER`, `MALE_SOCIAL_CALL_PARTNER`, `MALE_REACT_HAPPY`, `MALE_REACT_TIRED`, `MALE_REACT_ANNOYED`, `MALE_REACT_SAD`, and `MALE_REACT_SPOOKED`. Emotions read through shoulders, head angle, weight shift, and hand placement. No emoji faces or comedy poses.

## Transitions prompt

Create reusable transition sheets for `MALE_TRANSITION_STAND_TO_SIT`, `MALE_TRANSITION_SIT_TO_STAND`, `MALE_TRANSITION_STAND_TO_CROUCH`, `MALE_TRANSITION_CROUCH_TO_STAND`, `MALE_TRANSITION_STAND_TO_LIE_FLOOR`, `MALE_TRANSITION_LIE_FLOOR_TO_STAND`, `MALE_TRANSITION_STAND_TO_BED`, and `MALE_TRANSITION_BED_TO_STAND`. Use A as origin, B as midpoint, C as destination. Use sitting-on-bed as the middle bed frame and one-hand-on-floor as the floor recovery midpoint.

## QA reminder

Any output that looks cute, chibi, toy-like, mascot-like, oversized-headed, emoji-like, childlike, nude, explicit, watermarked, or broken in anatomy must be rejected or sent to rework.
