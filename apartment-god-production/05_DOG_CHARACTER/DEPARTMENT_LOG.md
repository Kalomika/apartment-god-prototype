# Department Log, Dog Character

Working branch:

```txt
dog-character-realistic-sprite-states
```

## Mission

Create the dog character realistic top-down sprite production structure, state breakdown, generation prompts, and manifest.

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
apartment-god-production/05_DOG_CHARACTER/
```

## Required folders and files

```txt
idle/
walk/
run/
sit/
sleep/
bark/
sniff/
fetch/
eat_drink/
play/
comfort/
follow/
transitions/
prompt_sheets/
manifest_dog.json
DOG_STATE_BREAKDOWN.md
README.md
```

## Visual rules

- realistic top-down dog linework
- white/off-white dog initially
- color-changeable later
- natural dog anatomy
- no cute puppy mascot style
- no oversized head
- no toy-like proportions
- no emoji expressions
- readable at game scale
- transparent PNG target for final art
- compatible with realistic human sprites and cyberpunk apartment

## Required state groups

Create planned states and A/B/C logic for:

- idle stand, shift, tail wag, look around
- walk
- run
- sit, sit attention, sit waiting
- sleep curled, side, belly, lie down, get up
- bark, alert bark, excited bark
- sniff floor, object, new person
- fetch chase, pickup ball, carry ball, return, drop ball
- eat bowl, drink bowl
- play bow, roll over, belly up, jump excited, pounce toy
- comfort human, nuzzle human, lie near human
- follow human, wait at door, excited new person
- reusable dog transitions

## Frame logic

Most states use:

```txt
A = enter or transition
B = main pose or loop 1
C = exit or loop 2
```

Idle can use A/B.

Tail wag can use A/B/C.

Walk and run should loop A/B/C.

Eat, drink, sniff, and fetch carry should loop B/C or A/B/C.

Sleep hold poses can be B-only, but lie-down and get-up transitions must exist.

## Required manifest fields

`manifest_dog.json` must include every planned state with:

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
color_notes
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
- Do not make a cute mascot dog.
- Do not use oversized puppy head proportions.
- Do not make the dog look like a toy.
- Do not rely on emoji expressions.

## Completion checklist

- [ ] Art Bible read
- [ ] Reference Library read
- [ ] dog folder created
- [ ] all required subfolders created
- [ ] `DOG_STATE_BREAKDOWN.md` completed
- [ ] `manifest_dog.json` valid JSON
- [ ] generation prompts created
- [ ] white/off-white color-changeable rule included
- [ ] fetch states planned clearly
- [ ] bowl states planned clearly
- [ ] comfort states planned clearly
- [ ] no runtime files changed

## Required report back

```txt
Branch name:
Commit SHA:
Files created:
Art Bible read: yes/no
Reference Library read: yes/no
Dog states created:
Manifest valid JSON: yes/no
Generated sheets, if any:
Runtime files changed: yes/no
Ready for QA: yes/no
Blockers:
```
