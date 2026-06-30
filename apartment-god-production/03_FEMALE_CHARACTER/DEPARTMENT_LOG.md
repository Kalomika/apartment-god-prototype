# Department Log, Female Character

Working branch:

```txt
female-character-realistic-sprite-states
```

## Mission

Create the female character realistic top-down sprite production structure, state breakdown, generation prompts, and manifest.

Do not integrate into runtime code yet.

## Must read first

```txt
apartment-god-production/PRODUCTION_MANAGER_LOG.md
apartment-god-production/DEPARTMENT_START_HERE.md
apartment-god-production/00_ART_BIBLE/
apartment-god-production/REFERENCE_LIBRARY/
```

Report a blocker if the Art Bible or Reference Library is missing.

## Required output folder

```txt
apartment-god-production/03_FEMALE_CHARACTER/
```

## Required folders and files

```txt
idle/
walk/
run/
sit/
sleep/
phone/
laptop/
cooking/
eating/
shower_bathroom/
reading/
exercise/
pet_dog/
social_solo/
transitions/
prompt_sheets/
manifest_female.json
FEMALE_STATE_BREAKDOWN.md
README.md
```

## Visual rules

- adult Black female
- realistic top-down linework
- adult proportions
- no chibi
- no cute mascot body
- no oversized head
- no emoji body language
- clothing-neutral base look, not nude
- transparent PNG target for final art
- compatible with male and joint-state scale

## Required state groups

Create planned states and A/B/C logic for:

- idle
- walk
- run
- sit chair, couch, floor, edge of bed
- sleep solo back, side, curled, sprawl, awake rest
- get in bed and get out of bed
- phone standing, seated, on bed
- laptop desk typing, on lap, couch typing
- cooking prep, stove, pan stir, mistake react, serve food
- eating couch, table, drink, snack standing
- bathroom safe states, toilet, shower, brush teeth, mirror/groom, hair groom
- reading standing, couch, bed, pull book
- exercise pushup, yoga/stretch, plank, strength, floor stretch
- pet dog, fetch throw, comfort dog, dog excited react
- social solo reactions
- reusable transitions

## Frame logic

Most states use:

```txt
A = enter or transition
B = main pose or loop 1
C = exit or loop 2
```

Idle can use A/B.

Sleep hold poses can be B-only, but entry and exit must exist.

Laptop, phone, eating, cooking, and reading should loop B/C.

Walk and run should loop A/B/C.

## Required manifest fields

`manifest_female.json` must include every planned state with:

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

Status values:

```txt
planned
prompt_ready
rough_generated
approved
needs_revision
```

## Forbidden

- Do not edit `src/`.
- Do not deploy.
- Do not make cute sprites.
- Do not use oversized heads.
- Do not make the body childlike.
- Do not create nude sprites.

## Completion checklist

- [ ] Art Bible read
- [ ] Reference Library read
- [ ] female folder created
- [ ] all required subfolders created
- [ ] `FEMALE_STATE_BREAKDOWN.md` completed
- [ ] `manifest_female.json` valid JSON
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
Female states created:
Manifest valid JSON: yes/no
Generated sheets, if any:
Runtime files changed: yes/no
Ready for QA: yes/no
Blockers:
```
