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

## 06_INTEGRATION_QUEUE, QA Review

Status: PARTIALLY_READY
Branch name: asset-qa-realistic-style-review
Latest commit SHA: pending final board commit
Files created: approved_assets_only/.gitkeep, asset_registry.json, integration_notes.md, QA_REPORT.md, REWORK_LIST.md, READY_FOR_CODEX.md, README.md, 07_REJECTED_OR_REWORK/.gitkeep, DEPARTMENT_STATUS_BOARD.md.
Folders created: apartment-god-production/06_INTEGRATION_QUEUE/, apartment-god-production/06_INTEGRATION_QUEUE/approved_assets_only/, apartment-god-production/07_REJECTED_OR_REWORK/.
Art Bible read: yes, from available Art Bible branch and manager logs, but not present on this QA branch.
Reference Library read: no, apartment-god-production/REFERENCE_LIBRARY/ was not found on the QA branch or checked production branches.
States/assets completed: 0 approved assets. QA reviewed available department planning branches and recorded blockers for missing or non-compliant departments and manifests.
Manifest status: asset_registry.json valid JSON with 0 approved assets. Source department manifests are missing or need schema normalization before asset approval.
Generated assets/sheets: none.
Blockers: Reference Library missing, Art Bible missing from QA branch, department folders split across separate branches, 04_JOINT_CHARACTER_STATES not found, female/dog/joint manifests missing, environment and male manifests need Art Bible schema normalization, no final transparent PNG assets verified.
Runtime files changed: no
Ready for QA: yes, QA handoff package is ready for game manager review. Not ready for Codex integration.
Notes for game manager: QA reports are complete and intentionally block integration until the shared production tree, reference library, compliant manifests, and approved original PNG assets are present together in one branch.

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
