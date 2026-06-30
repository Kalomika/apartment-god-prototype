# Apartment God Department Status Board

Purpose: every production department updates this one file when finished so the game manager can review one source instead of chasing updates across chats.

Rules:

- Each department must update only its assigned section.
- Do not delete another department's update.
- Do not edit runtime `src/` files unless your department is explicitly the Codex Integration department.
- Do not modify `main` directly.
- Do not deploy.
- Do not touch `Kalomika/ai-rpg-engine`.
- Keep status honest. If a blocker exists, write it.

Status values:

```txt
NOT_STARTED
IN_PROGRESS
PARTIALLY_READY
READY_FOR_QA
NEEDS_REWORK
BLOCKED
```

Required update format per department:

```txt
Status:
Branch name:
Latest commit SHA:
Files created:
Folders created:
Art Bible read: yes/no
Reference Library read: yes/no
States/assets completed:
Manifest status:
Generated assets/sheets:
Blockers:
Runtime files changed: yes/no
Ready for QA: yes/no
Notes for game manager:
```

---

## 00_ART_BIBLE, Style Supervisor

Status: NOT_STARTED
Branch name:
Latest commit SHA:
Files created:
Folders created:
Art Bible read: not applicable
Reference Library read:
States/assets completed:
Manifest status:
Generated assets/sheets:
Blockers:
Runtime files changed:
Ready for QA:
Notes for game manager:

---

## 01_APARTMENT_ENVIRONMENT

Status: NOT_STARTED
Branch name:
Latest commit SHA:
Files created:
Folders created:
Art Bible read:
Reference Library read:
States/assets completed:
Manifest status:
Generated assets/sheets:
Blockers:
Runtime files changed:
Ready for QA:
Notes for game manager:

---

## 02_MALE_CHARACTER

Status: NOT_STARTED
Branch name:
Latest commit SHA:
Files created:
Folders created:
Art Bible read:
Reference Library read:
States/assets completed:
Manifest status:
Generated assets/sheets:
Blockers:
Runtime files changed:
Ready for QA:
Notes for game manager:

---

## 03_FEMALE_CHARACTER

Status: PARTIALLY_READY
Branch name: female-character-realistic-sprite-states
Latest commit SHA: b4bb070c4e5b9b51a88ba60fab319735b89e7049
Files created: README.md, FEMALE_STATE_BREAKDOWN.md, manifest_female.json, manifest_female_state_index.json, prompt_sheets/FEMALE_GENERATION_PROMPTS.md, .gitkeep files for required category folders.
Folders created: apartment-god-production/03_FEMALE_CHARACTER/ with idle, walk, run, sit, sleep, phone, laptop, cooking, eating, shower_bathroom, reading, exercise, pet_dog, social_solo, transitions, prompt_sheets.
Art Bible read: yes, from art-bible-production-structure, not from main at time of pass.
Reference Library read: no, reference pack unavailable in branch/session.
States/assets completed: 67 female states listed, all required categories covered, A/B/C logic documented.
Manifest status: manifest_female.json valid JSON, but full all-state coverage is split across manifest_female.json, manifest_female_state_index.json, and FEMALE_STATE_BREAKDOWN.md. Needs reconciliation so manifest_female.json is primary Codex-consumable manifest.
Generated assets/sheets: none.
Blockers: shared reference pack not available, reference library did not exist on branch so placeholders were created, Art Bible was not on main.
Runtime files changed: no
Ready for QA: no, cleanup pass required first.
Notes for game manager: Good planning/state-definition pass. Needs manifest cleanup and reference-library reconciliation before QA.

---

## 04_JOINT_CHARACTER_STATES

Status: NOT_STARTED
Branch name:
Latest commit SHA:
Files created:
Folders created:
Art Bible read:
Reference Library read:
States/assets completed:
Manifest status:
Generated assets/sheets:
Blockers:
Runtime files changed:
Ready for QA:
Notes for game manager:

---

## 05_DOG_CHARACTER

Status: PARTIALLY_READY
Branch name: dog-character-realistic-sprite-states-production-log
Latest commit SHA: 2389895cd6d1ac21c4c0d4244263fb83803bf724
Files created: apartment-god-production/05_DOG_CHARACTER/README.md, apartment-god-production/05_DOG_CHARACTER/DOG_STATE_BREAKDOWN.md, apartment-god-production/05_DOG_CHARACTER/manifest_dog.json, apartment-god-production/05_DOG_CHARACTER/prompt_sheets/DOG_GENERATION_PROMPTS.md, .gitkeep files for required category folders.
Folders created: apartment-god-production/05_DOG_CHARACTER/ with idle, walk, run, sit, sleep, bark, sniff, fetch, eat_drink, play, comfort, follow, transitions, prompt_sheets.
Art Bible read: no
Reference Library read: no
States/assets completed: 46 dog states planned across idle, walk, run, sit, sleep, bark, sniff, fetch, eat_drink, play, comfort, follow, and reusable transitions. A/B/C or B-only sleep frame logic documented.
Manifest status: manifest_dog.json valid JSON, includes every required state with required manifest fields using field_order row schema. Status values set to prompt_ready.
Generated assets/sheets: none.
Blockers: apartment-god-production/00_ART_BIBLE/ was missing or unreadable on the base branch. apartment-god-production/REFERENCE_LIBRARY/ was missing or unreadable on the base branch. No actual reference images were available for inspection in this pass.
Runtime files changed: no
Ready for QA: no
Notes for game manager: Dog department planning is ready for Art Bible and reference-library reconciliation, then QA. No runtime integration was attempted.

---

## 06_INTEGRATION_QUEUE, QA Review

Status: NOT_STARTED
Branch name:
Latest commit SHA:
Files created:
Folders created:
Art Bible read:
Reference Library read:
States/assets completed:
Manifest status:
Generated assets/sheets:
Blockers:
Runtime files changed:
Ready for QA:
Notes for game manager:

---

## 07_CODEX_INTEGRATION, Runtime Integration

Status: NOT_STARTED
Branch name:
Latest commit SHA:
Files created:
Folders created:
Art Bible read:
Reference Library read:
States/assets completed:
Manifest status:
Generated assets/sheets:
Blockers:
Runtime files changed:
Ready for QA:
Notes for game manager:

Runtime integration does not begin until QA says safe to integrate.
