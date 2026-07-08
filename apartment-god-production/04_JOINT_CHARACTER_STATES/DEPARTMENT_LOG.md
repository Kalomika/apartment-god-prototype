# Department Log, Joint Character States

Working branch:

```txt
joint-character-realistic-sprite-states
```

## Mission

Create the joint and two-person realistic top-down sprite production structure, state breakdown, generation prompts, and manifest.

This department handles moments where two human characters visually interact as one combined sprite or coordinated sprite set.

Do not integrate into runtime code yet.

## Must read first

```txt
apartment-god-production/PRODUCTION_MANAGER_LOG.md
apartment-god-production/DEPARTMENT_START_HERE.md
apartment-god-production/00_ART_BIBLE/
apartment-god-production/REFERENCE_LIBRARY/
apartment-god-production/02_MALE_CHARACTER/
apartment-god-production/03_FEMALE_CHARACTER/
```

Report a blocker if the Art Bible, Reference Library, male folder, or female folder is missing.

## Required output folder

```txt
apartment-god-production/04_JOINT_CHARACTER_STATES/
```

## Required folders and files

```txt
hug/
kiss/
hold_hands/
cuddle_couch/
cuddle_bed/
sleep_together/
watch_tv_together/
eating_together/
comfort/
pet_dog_together/
private_moment_safe/
transitions/
prompt_sheets/
manifest_joint.json
JOINT_STATE_BREAKDOWN.md
README.md
```

## Visual rules

- adult Black male and adult Black female
- realistic top-down linework
- adult proportions
- no chibi
- no cute mascot bodies
- no oversized heads
- no emoji body language
- clothing-neutral base look, not nude
- safe and non-explicit
- transparent PNG target for final art
- compatible with male and female solo sprite scale

## Required state groups

Create planned states and A/B/C logic for:

- standing hug
- comfort hug
- standing kiss
- quick kiss
- close affectionate hold
- hold hands
- couch cuddle
- bed cuddle
- sleep together variations
- watch TV together
- eating together
- comfort after bad day
- pet dog together
- private moment safe
- reusable joint transitions

## Core implementation concept

Joint states should usually be treated as one combined two-person sprite.

When a joint state starts:

1. both characters walk to the interaction point
2. once both arrive, solo sprites are hidden or visually suppressed
3. the joint sprite appears at the shared anchor
4. when the action ends, the game splits them back into individual sprites

This avoids ugly overlap and keeps the pose readable.

## Frame logic

Most joint states use:

```txt
A = enter or approach
B = main hold pose
C = separate or exit
```

Sleep-together poses can be B-only hold states, but entry and exit states must exist.

Private moment states must remain safe, implied, and non-explicit.

## Required manifest fields

`manifest_joint.json` must include every planned state with:

```txt
state_id
category
character_type
action_name
frame_count
frames
gameplay_tags
loop_frames
entry_frames
hold_frames
exit_frames
anchor_point
scale_notes
implementation_notes
status
```

Use `character_type`:

```txt
joint_male_female
```

Valid anchor examples:

```txt
joint_center
couch_center
bed_center
table_center
dog_interaction_center
```

## Forbidden

- Do not edit `src/`.
- Do not deploy.
- Do not make cute sprites.
- Do not use oversized heads.
- Do not create explicit sexual content.
- Do not create nude sprites.
- Do not make private moment graphic.

## Completion checklist

- [ ] Art Bible read
- [ ] Reference Library read
- [ ] male/female folder reviewed if available
- [ ] joint folder created
- [ ] all required subfolders created
- [ ] `JOINT_STATE_BREAKDOWN.md` completed
- [ ] `manifest_joint.json` valid JSON
- [ ] generation prompts created
- [ ] any optional image sheets placed correctly and listed
- [ ] no runtime files changed

## Required report back

```txt
Branch name:
Commit SHA:
Files created:
Art Bible read: yes/no
Reference Library read: yes/no
Male/female folders reviewed: yes/no
Joint states created:
Manifest valid JSON: yes/no
Generated sheets, if any:
Runtime files changed: yes/no
Ready for QA: yes/no
Blockers:
```
