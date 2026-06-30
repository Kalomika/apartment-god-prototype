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

Status: PARTIALLY_READY
Branch name: art-bible-production-structure
Latest commit SHA: 68a3c935a2aad6ab68aa6c92f370eb4306906c09
Files created: VISUAL_STYLE_GUIDE.md, SPRITE_STATE_LIST.md, NAMING_CONVENTIONS.md, SCALE_AND_ANCHOR_GUIDE.md, COLOR_PALETTE.md, MANIFEST_TEMPLATE.json, STYLE_QA_CHECKLIST.md, README.md.
Folders created: apartment-god-production/00_ART_BIBLE/.
Art Bible read: not applicable, this department created the Art Bible source files.
Reference Library read: no, REFERENCE_LIBRARY files and shared zip were not present on production-manager-department-logs.
States/assets completed: Master state list completed for environment, male, female, dog, joint, QA records, and integration records. No final art assets generated.
Manifest status: MANIFEST_TEMPLATE.json created and structured with required fields, state_id, action_name, frame_count, frame_files, A/B/C frame logic, gameplay tags, anchors, scale notes, implementation notes, and status.
Generated assets/sheets: none.
Blockers: Shared Reference Library could not be inspected because apartment-god-production/REFERENCE_LIBRARY/README_REFERENCE_USE.md, reference_manifest.json, and apartment_god_shared_reference_pack.zip were not present on the base branch.
Runtime files changed: no
Ready for QA: no
Notes for game manager: Art Bible rules are ready for planning use, but final QA should wait until the shared Reference Library is added and inspected.

---

## 01_APARTMENT_ENVIRONMENT

Status: PARTIALLY_READY
Branch name: apartment-environment-cyberpunk-assets
Latest commit SHA: 02daa4e973cf23b243f1b22248b967a59b2ec300
Files created: README.md, layout/ENV_LAYOUT_PLAN.md, layout/INTEGRATION_NOTES.md, walls_doors_windows/WALL_DOOR_WINDOW_LANGUAGE.md, rooms/ROOM_STYLE_GUIDE.md, props/PROP_ASSET_LIST.md, lighting/LIGHTING_STYLE_GUIDE.md, manifest_environment.json.
Folders created: apartment-god-production/01_APARTMENT_ENVIRONMENT/ with layout, walls_doors_windows, rooms, props, lighting.
Art Bible read: yes, from art-bible-production-structure during production context. Missing from production-manager-department-logs at review time.
Reference Library read: no, not present on production-manager-department-logs at review time and shared reference pack was unavailable in session.
States/assets completed: Floor 1 and Floor 2 layout states, living room, kitchen, bathroom, entry, stairs, bedroom, office, upstairs bathroom, hall, basement future, garage future. Prop coverage includes couch, TV, stereo, fridge, stove, kitchen sink, shower, toilet, front door, dog bowl, living light, bedroom light, stairs, bed, laptop desk, bookshelf, living window, bedroom window, phone dock future, dining table future, car future, podcast desk future, basement couch future, garage tool rack future.
Manifest status: manifest_environment.json exists and includes required environment and prop entries with state_id, category, asset_type, room, gameplay_tags, frame_count, frames, anchor_point, collision_notes, interaction_notes, visual_notes, implementation_notes, and status. Needs later reconciliation with final Art Bible and extracted Reference Library once both exist on the manager branch.
Generated assets/sheets: none, structured blueprint and manifest only.
Blockers: Art Bible is missing from production-manager-department-logs, Reference Library is missing from production-manager-department-logs, shared reference pack was not available in session, no polished PNG art created yet.
Runtime files changed: no
Ready for QA: no
Notes for game manager: Environment planning deliverables are complete as a blueprint pass and safe for review as documentation, but not ready for final QA until Art Bible and Reference Library are present on the manager branch and the manifest is reconciled against them.

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
