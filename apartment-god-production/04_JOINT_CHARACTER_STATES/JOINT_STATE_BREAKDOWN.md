# Joint State Breakdown

This breakdown defines the first Codex-consumable planning pass for shared adult male/female interactions. The visual target is realistic top-down linework, adult Black male and adult Black female, safe clothing-neutral base sprites, and stable anchors.

## Core runtime concept

Most joint states should be treated as one combined shared sprite. Both solo characters walk to the interaction point. When both arrive, the renderer hides or visually suppresses solo sprites, draws the joint sprite at the shared anchor, then returns to solo sprites after the exit frame.

## Frame logic

- A = entry, anticipation, or transition.
- B = main hold or loop frame 1.
- C = exit, recovery, or loop frame 2.
- Bed/rest states may use B-only randomized held poses.

## Planned states

| Category | State ID | Frames | Anchor | Character positions | Frame logic |
| --- | --- | ---: | --- | --- | --- |
| bed_shared | `JOINT_CUDDLE_BED_SIDE_01` | 3 | bed_center | male left bed lane, female right bed lane | A seated on bed edge; B safe side cuddle hold; C separate or sit up. |
| bed_shared | `JOINT_SLEEP_TOGETHER_BED_BACK_SIDE` | 1 | bed_center | male left sleep lane, female right sleep lane | B-only randomized safe sleep hold. |
| bed_shared | `JOINT_PRIVATE_MOMENT_SAFE_BED` | 1 | bed_center | covered left and right silhouettes | B-only safe privacy silhouette using blanket or darkness only, no nudity or explicit pose. |
| couch_shared | `JOINT_CUDDLE_COUCH_01` | 3 | seat_center | male left couch seat, female right couch seat | A both stand at couch; B seated close; C relaxed cuddle hold. |
| conversation | `JOINT_CONVERSATION_STAND` | 3 | joint_center | male left talk stance, female right talk stance | A step into spacing; B grounded face-to-face talk; C step apart. |
| hug | `JOINT_HUG_STAND` | 3 | joint_center | male left hug stance, female right hug stance | A step close; B natural standing hug; C release and step apart. |
| kiss | `JOINT_KISS_STAND` | 3 | joint_center | male left close stance, female right close stance | A step close; B tasteful kiss hold; C separate. |
| argument | `JOINT_ARGUMENT_LOW_INTENSITY` | 3 | joint_center | male left argument stance, female right argument stance | A conversation tightens; B tense grounded disagreement; C de-escalate or turn away. |
| dance | `JOINT_DANCE_SLOW_01` | 3 | joint_center | male left dance lane, female right dance lane | A step together; B close slow dance hold; C gentle weight shift. |
| cook_together | `JOINT_COOKING_TOGETHER_COUNTER` | 3 | joint_center | male left counter, female right counter | A both take kitchen positions; B prep and stir; C exchange task or serve. |
| eat_together | `JOINT_EATING_TOGETHER_TABLE` | 3 | joint_center | male left table seat, female right table seat | A both seated with food; B eating loop 1; C eating loop 2. |
| watch_tv | `JOINT_WATCH_TV_TOGETHER_COUCH` | 3 | seat_center | male left viewer, female right viewer | A both sit; B watching hold; C posture shift loop frame. |
| desk_shared | `JOINT_DESK_SHARED_REVIEW_01` | 3 | seat_center | male left desk position, female right desk position | A both approach desk; B lean to screen; C one points while other watches. |
| pet_dog_together | `JOINT_PET_DOG_TOGETHER_01` | 3 | joint_center | male left petting position, female right petting position, dog center | A both kneel or stand near dog; B both pet dog; C dog relaxes. |
| transitions | `JOINT_STEP_TOGETHER_01` | 3 | joint_center | male left approach, female right approach | A solo spacing; B shared step inward; C close shared stance. |
| transitions | `JOINT_STAND_TO_COUCH_SIT_01` | 3 | seat_center | male left couch entry, female right couch entry | A standing at couch; B lowering; C seated couch-ready. |
| transitions | `JOINT_STAND_TO_BED_SIT_01` | 3 | bed_center | male left bed edge, female right bed edge | A standing beside bed; B sitting on bed edge; C bed-sit ready. |
| transitions | `JOINT_STAND_TO_DESK_SHARED_01` | 3 | seat_center | male left desk lane, female right desk lane | A both near desk; B one sits or leans; C shared desk-ready. |

## Compatibility notes

- Standing joint states use `joint_center` unless furniture placement requires `seat_center` or `bed_center`.
- Couch states use `seat_center` to match solo couch and Art Bible couch placement.
- Bed states use `bed_center` to match solo bed and shared sleep placement.
- Dog states include the dog in `included_characters` and document the dog offset in `character_anchor_offsets`.
- All planned art remains `draft` until generated and QA-reviewed.
