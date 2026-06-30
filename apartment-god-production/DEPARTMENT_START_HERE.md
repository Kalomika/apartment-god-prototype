# Department Start Here

Every Apartment God production department should read this file first.

## Step 1, read the manager log

Read:

```txt
apartment-god-production/PRODUCTION_MANAGER_LOG.md
```

## Step 2, read your department log

Read only the log for your assigned department:

```txt
00_ART_BIBLE/DEPARTMENT_LOG.md
01_APARTMENT_ENVIRONMENT/DEPARTMENT_LOG.md
02_MALE_CHARACTER/DEPARTMENT_LOG.md
03_FEMALE_CHARACTER/DEPARTMENT_LOG.md
04_JOINT_CHARACTER_STATES/DEPARTMENT_LOG.md
05_DOG_CHARACTER/DEPARTMENT_LOG.md
06_INTEGRATION_QUEUE/DEPARTMENT_LOG.md
```

## Step 3, read the Art Bible and Reference Library

If present, read:

```txt
apartment-god-production/00_ART_BIBLE/
apartment-god-production/REFERENCE_LIBRARY/
```

If they are missing, report that as a blocker and continue only if your prompt allows planning work without final references.

## Step 4, do not touch runtime code unless assigned

Asset departments should not edit `src/`.

The only department allowed to integrate runtime code is the final Codex Integration department.

## Step 5, report back cleanly

Use this exact report format:

```txt
Branch name:
Commit SHA:
Files created:
Folders created:
Art Bible read: yes/no
Reference Library read: yes/no
States/assets completed:
Manifest status:
Blockers:
Runtime files changed: yes/no
Ready for QA: yes/no
```

## Core art rule

Realistic top-down linework. Cyberpunk apartment. No cute/chibi/mascot style.
