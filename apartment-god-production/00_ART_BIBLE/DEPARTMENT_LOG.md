# Department Log, Art Bible and Style Supervisor

Working branch:

```txt
art-bible-production-structure
```

## Mission

Create the master visual rules and production structure for the realistic cyberpunk version of Apartment God Prototype.

This department defines the rules every other department must follow.

## Must read first

```txt
apartment-god-production/PRODUCTION_MANAGER_LOG.md
apartment-god-production/DEPARTMENT_START_HERE.md
apartment-god-production/REFERENCE_LIBRARY/
```

If `REFERENCE_LIBRARY/` is missing or only exists as a zip, extract the shared reference pack into that folder before writing the Art Bible.

## Required output folder

```txt
apartment-god-production/00_ART_BIBLE/
```

## Required files

```txt
VISUAL_STYLE_GUIDE.md
SPRITE_STATE_LIST.md
NAMING_CONVENTIONS.md
SCALE_AND_ANCHOR_GUIDE.md
COLOR_PALETTE.md
MANIFEST_TEMPLATE.json
STYLE_QA_CHECKLIST.md
README.md
```

## Required content

The Art Bible must define:

- realistic top-down linework
- cyberpunk apartment visual language
- adult Black male and female sprite rules
- realistic white/off-white dog rules
- no cute/chibi/mascot rules
- no oversized heads
- no emoji body language
- clothing-neutral base sprite rule
- A/B/C frame logic
- reusable transition logic
- sleep pose randomization rule
- joint sprite rules
- manifest requirements
- naming rules
- scale and anchor rules
- QA acceptance and rejection rules

## Reference rules

Use the shared references to define the style, but do not treat reference images as final game assets.

## Forbidden

- Do not write gameplay runtime code.
- Do not edit `src/`.
- Do not deploy.
- Do not touch `Kalomika/ai-rpg-engine`.
- Do not make the style cute, chibi, mascot-like, or toy-like.

## Completion checklist

- [ ] Reference Library inspected
- [ ] `00_ART_BIBLE/` created
- [ ] all required Art Bible files created
- [ ] state list covers environment, male, female, dog, joint, QA, and integration
- [ ] manifest template is valid JSON
- [ ] README explains this folder is the source of truth
- [ ] no runtime files changed
- [ ] branch committed

## Required report back

```txt
Branch name:
Commit SHA:
Files created:
Reference Library read: yes/no
Art Bible files complete: yes/no
Manifest template valid JSON: yes/no
Runtime files changed: yes/no
Ready for department use: yes/no
Blockers:
```
