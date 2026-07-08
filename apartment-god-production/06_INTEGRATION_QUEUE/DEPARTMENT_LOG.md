# Department Log, Asset QA and Codex Integration Queue

Working branch for QA:

```txt
asset-qa-realistic-style-review
```

Recommended later Codex integration branch:

```txt
realistic-cyberpunk-visual-integration
```

## Mission

Review all production asset departments, create the consolidated QA report, create the asset registry, and prepare the final handoff for Codex integration.

Do not integrate gameplay runtime code during QA.

## Must read first

```txt
apartment-god-production/PRODUCTION_MANAGER_LOG.md
apartment-god-production/DEPARTMENT_START_HERE.md
apartment-god-production/00_ART_BIBLE/
apartment-god-production/REFERENCE_LIBRARY/
apartment-god-production/01_APARTMENT_ENVIRONMENT/
apartment-god-production/02_MALE_CHARACTER/
apartment-god-production/03_FEMALE_CHARACTER/
apartment-god-production/04_JOINT_CHARACTER_STATES/
apartment-god-production/05_DOG_CHARACTER/
```

Report blockers for any missing department folder or missing manifest.

## Required output folder

```txt
apartment-god-production/06_INTEGRATION_QUEUE/
```

## Required folders and files

```txt
approved_assets_only/
asset_registry.json
integration_notes.md
QA_REPORT.md
REWORK_LIST.md
READY_FOR_CODEX.md
README.md
```

## QA mission

Review every department for:

- Art Bible compliance
- realistic top-down linework
- cyberpunk environment consistency
- non-cute, non-chibi style
- valid naming
- valid manifests
- complete A/B/C frame logic
- correct anchors
- no runtime code edits by asset departments
- no watermarked references used as final assets

## Department manifests to review

```txt
01_APARTMENT_ENVIRONMENT/manifest_environment.json
02_MALE_CHARACTER/manifest_male.json
03_FEMALE_CHARACTER/manifest_female.json
04_JOINT_CHARACTER_STATES/manifest_joint.json
05_DOG_CHARACTER/manifest_dog.json
```

## Required QA files

### QA_REPORT.md

Must include:

- overall status
- Art Bible compliance
- environment review
- male review
- female review
- dog review
- joint review
- manifest review
- naming review
- style drift review
- runtime safety review
- final decision

### REWORK_LIST.md

Use this format for each issue:

```txt
Department:
File:
Problem:
Required fix:
Priority: blocker/high/medium/low
```

### asset_registry.json

Consolidate approved entries only.

Required shape:

```json
{
  "project": "Apartment God Prototype",
  "visual_version": "realistic_cyberpunk_v1",
  "status": "qa_pending_or_approved",
  "source_folders": {
    "environment": "apartment-god-production/01_APARTMENT_ENVIRONMENT/",
    "male": "apartment-god-production/02_MALE_CHARACTER/",
    "female": "apartment-god-production/03_FEMALE_CHARACTER/",
    "joint": "apartment-god-production/04_JOINT_CHARACTER_STATES/",
    "dog": "apartment-god-production/05_DOG_CHARACTER/"
  },
  "assets": []
}
```

### integration_notes.md

Must tell Codex:

- do not integrate rejected assets
- use asset_registry.json as source of truth
- keep existing gameplay object IDs where possible
- map old procedural states to new sprite states
- use fallback procedural rendering only where sprites are missing
- render joint states as one combined sprite when both characters arrive
- randomize sleep/rest poses
- loop B/C for phone, laptop, cooking, eating, reading
- loop A/B/C for walk/run
- do not break phone UI, floor switching, movement, fetch, music, cooking, reading, save slots, windows, or build placement

### READY_FOR_CODEX.md

Must answer:

```txt
Status: READY / NOT READY / PARTIALLY READY
Approved folders:
Blocked folders:
Top blockers:
Safe to integrate now: yes/no
Recommended integration branch:
Required Codex actions:
```

## Final Codex integration, only after QA

Codex may later edit runtime files only after QA says integration can begin.

Likely runtime areas:

```txt
src/renderEntities.js
src/renderWorld.js
src/renderObjects.js
src/rendering.js
src/world.js
src/actions.js
src/sharedActions.js
src/saveSystem.js
src/blueprint.js
src/phoneUI.js
```

But QA does not edit those.

## Forbidden during QA

- Do not edit `src/`.
- Do not deploy.
- Do not merge to main.
- Do not approve cute/chibi/mascot sprites.
- Do not approve missing manifests.
- Do not approve reference images as final game assets.

## Completion checklist

- [ ] Art Bible reviewed
- [ ] Reference Library reviewed
- [ ] environment folder reviewed
- [ ] male folder reviewed
- [ ] female folder reviewed
- [ ] dog folder reviewed
- [ ] joint folder reviewed
- [ ] manifests checked for valid JSON
- [ ] QA report written
- [ ] rework list written
- [ ] approved asset registry written
- [ ] Codex readiness file written
- [ ] no runtime files changed

## Required report back

```txt
Branch name:
Commit SHA:
Overall QA status:
Approved assets count:
Blocked/rework item count:
Safe for Codex integration: yes/no
Files created:
Runtime files changed: yes/no
Blockers:
```
