# Apartment God Production Manager Log

Branch: `production-manager-department-logs`

Purpose: this is the central production handoff for the realistic cyberpunk visual upgrade of Apartment God Prototype. Every department chat should start by reading this file, then read its own department log, then read the Art Bible and Reference Library when those are present.

## Current manager status

The visual upgrade is planned but not complete in the repo yet.

The department folders and Art Bible still need to be created or completed by their assigned chats. Do not assume assets exist until the relevant department reports a branch name, commit SHA, files created, and any blockers.

## Repo rules

Repo: `Kalomika/apartment-god-prototype`

Do not touch: `Kalomika/ai-rpg-engine`

Do not modify `main` directly. Each department must work inside its own branch.

Do not edit gameplay runtime files in `src/` unless the department prompt explicitly says so. Asset departments should not edit `src/`.

Do not change Render settings. Do not deploy.

## Shared production structure

Target folder structure:

```txt
apartment-god-production/
  PRODUCTION_MANAGER_LOG.md
  DEPARTMENT_START_HERE.md
  REFERENCE_LIBRARY/
  00_ART_BIBLE/
  01_APARTMENT_ENVIRONMENT/
  02_MALE_CHARACTER/
  03_FEMALE_CHARACTER/
  04_JOINT_CHARACTER_STATES/
  05_DOG_CHARACTER/
  06_INTEGRATION_QUEUE/
  07_REJECTED_OR_REWORK/
```

## Required department order

1. Reference Library and Art Bible
2. Apartment Environment
3. Male Character
4. Female Character
5. Dog Character
6. Joint Character States
7. Asset QA and Style Review
8. Codex Integration

Departments 2 through 6 can work in parallel only after the Art Bible and Reference Library exist or have been provided directly to the department chat.

## Shared visual direction

The upgraded version must be realistic top-down linework inside a cyberpunk apartment.

Hard rules:

- No cute/chibi style
- No mascot bodies
- No oversized heads
- No toy-like proportions
- No emoji body language
- Adult proportions for human sprites
- Realistic top-down linework for humans and dog
- Cyberpunk apartment, dark walls, neon light strips, lived-in tech clutter
- Readable at gameplay scale
- Transparent PNG target for final production assets
- Every state needs a manifest entry

## Clothing rule

For now, use a clothing-neutral base style. Do not draw nude characters. Use simple fitted base clothing or safe mannequin-like linework with no explicit body detail. Clothing variants can be added later.

## Frame logic

Most states should use A/B/C.

```txt
A = enter, anticipation, or transition into pose
B = main hold pose or loop frame 1
C = exit, recovery, or loop frame 2
```

Simple idle can use A/B.

Sleep can use multiple randomized hold poses instead of constant animation.

Walk and run should loop A/B/C.

Laptop, phone, eating, cooking, reading, and similar actions should loop B/C after entry.

## Reference Library requirement

The shared reference pack must be extracted into:

```txt
apartment-god-production/REFERENCE_LIBRARY/
```

Every department must inspect:

```txt
apartment-god-production/REFERENCE_LIBRARY/
apartment-god-production/00_ART_BIBLE/
```

The references are for pose, style, scale, and linework guidance only. Do not use watermarked/source reference images as final game assets.

## Department logs

Each department has a task log here:

```txt
apartment-god-production/00_ART_BIBLE/DEPARTMENT_LOG.md
apartment-god-production/01_APARTMENT_ENVIRONMENT/DEPARTMENT_LOG.md
apartment-god-production/02_MALE_CHARACTER/DEPARTMENT_LOG.md
apartment-god-production/03_FEMALE_CHARACTER/DEPARTMENT_LOG.md
apartment-god-production/04_JOINT_CHARACTER_STATES/DEPARTMENT_LOG.md
apartment-god-production/05_DOG_CHARACTER/DEPARTMENT_LOG.md
apartment-god-production/06_INTEGRATION_QUEUE/DEPARTMENT_LOG.md
```

## What every department must report back

Each department must report:

```txt
Branch name:
Commit SHA:
Files created:
Folders created:
Whether Art Bible was read:
Whether Reference Library was read:
States/assets completed:
Manifest status:
Blockers:
Runtime files changed, yes/no:
Ready for QA, yes/no:
```

## Current blockers

- The reference images are not confirmed extracted into the repo yet.
- The Art Bible is not confirmed complete on `main`.
- The apartment, male, female, dog, and joint folders are not confirmed complete on `main`.
- The QA integration queue is not confirmed complete.
- Codex integration should not begin until departments are complete or intentionally scoped as placeholder-only.

## Manager decision

Status: not ready for final Codex integration.

Next move: each department should review its own `DEPARTMENT_LOG.md`, complete the assigned folder, commit to its assigned branch, and report back with the required status block.
