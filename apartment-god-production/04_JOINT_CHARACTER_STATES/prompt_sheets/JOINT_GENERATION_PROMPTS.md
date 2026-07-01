# Joint Generation Prompts

Use these prompts only for future rough sprite/reference generation or production sprite passes. Do not generate final sprite sheets in this planning pass.

Universal prompt requirements for every group:

Realistic orthographic top-down linework, adult Black male and adult Black female, clothing-neutral fitted base sprites, not nude, natural adult anatomy, cyberpunk apartment life-sim sprite style, transparent background, stable shared anchors, frame labels A/B/C where applicable, consistent scale with male/female solo sprites, dog, furniture, couch, bed, chair, table, desk, and apartment prop scale. No chibi, no cute toy bodies, no mascot proportions, no oversized heads, no emoji body language, no explicit sexual detail, no watermarks, no copied source reference images.

## bed_shared

Create safe shared bed sprites using Art Bible `bed_center` logic. Use two-person bed/rest references from `02_human_realistic_topdown_linework/`. Bed and private states must remain clothed, implied, blanket-covered, or darkness-based.

States: `JOINT_CUDDLE_BED_SIDE_01`, `JOINT_SLEEP_TOGETHER_BED_BACK_SIDE`, `JOINT_PRIVATE_MOMENT_SAFE_BED`.

## couch_shared

Create shared couch sprites using `seat_center`. Bodies should sit into the couch, not float. Keep knees, shoulders, and arm contact readable from top-down.

State: `JOINT_CUDDLE_COUCH_01`.

## conversation

Create grounded adult conversational body language without emoji gestures. Use subtle shoulder angles, head direction, and stance weight.

State: `JOINT_CONVERSATION_STAND`.

## hug

Create a natural standing hug with believable top-down arm overlap. No cartoon squeeze or cute pose shorthand.

State: `JOINT_HUG_STAND`.

## kiss

Create a tasteful, safe standing kiss. Keep proportions adult and natural. No explicit detail.

State: `JOINT_KISS_STAND`.

## argument

Create a low-intensity disagreement using grounded adult posture. No screaming emoji pose, no cartoon flailing.

State: `JOINT_ARGUMENT_LOW_INTENSITY`.

## dance

Create an adult slow dance hold using stable `joint_center`. The motion is small and readable at life-sim scale.

State: `JOINT_DANCE_SLOW_01`.

## cook_together

Create shared counter cooking sprites. Keep both characters at adult scale around kitchen furniture. One can prep while the other stirs or passes food.

State: `JOINT_COOKING_TOGETHER_COUNTER`.

## eat_together

Create shared table eating sprites. Use seated-chair and eating reference logic. B/C can loop as low-frame hand motion.

State: `JOINT_EATING_TOGETHER_TABLE`.

## watch_tv

Create shared couch TV sprites. Use `seat_center`, relaxed viewing posture, and low-frame B/C shift.

State: `JOINT_WATCH_TV_TOGETHER_COUCH`.

## desk_shared

Create a shared desk review sprite. Both characters lean toward the same screen/tablet while staying adult-scaled and readable.

State: `JOINT_DESK_SHARED_REVIEW_01`.

## pet_dog_together

Create a couple-and-dog shared sprite. Dog should be realistic white/off-white, color-changeable later, with natural animal proportions and no puppy mascot look.

State: `JOINT_PET_DOG_TOGETHER_01`.

## transitions

Create reusable entry/exit bridge sprites. Keep anchors stable and match solo sprite scale.

States: `JOINT_STEP_TOGETHER_01`, `JOINT_STAND_TO_COUCH_SIT_01`, `JOINT_STAND_TO_BED_SIT_01`, `JOINT_STAND_TO_DESK_SHARED_01`.
