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

Reference Library status: INSTALLED
Branch name: reference-library-install
Latest commit SHA: 52e5eee916e6b288a723506b142ff5e7d4d0c64b
Files/folders created: apartment-god-production/REFERENCE_LIBRARY/
Runtime files changed: no
Ready for departments: yes

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

Status: READY_FOR_QA
Branch name: art-bible-production-structure
Latest commit SHA: 77b6a77278669a327f0106700024113a79a5f5f9
Files created: VISUAL_STYLE_GUIDE.md, SPRITE_STATE_LIST.md, NAMING_CONVENTIONS.md, SCALE_AND_ANCHOR_GUIDE.md, COLOR_PALETTE.md, MANIFEST_TEMPLATE.json, STYLE_QA_CHECKLIST.md, README.md.
Folders created: apartment-god-production/00_ART_BIBLE/ completed with required Art Bible files.
Art Bible read: not applicable, this department created the Art Bible source of truth.
Reference Library read: yes, apartment-god-production/REFERENCE_LIBRARY/ inspected through README_REFERENCE_USE.md and reference_manifest.json.
States/assets completed: Master rules completed for realistic top-down linework, cyberpunk apartment visual language, adult Black male and female sprite rules, realistic white or off-white dog rules, no cute/chibi/mascot rules, clothing-neutral base sprites, A/B/C frame logic, reusable transitions, randomized sleep holds, joint sprite rules, naming rules, scale and anchors, manifest requirements, QA acceptance, and rejection rules.
Manifest status: MANIFEST_TEMPLATE.json created and valid JSON.
Generated assets/sheets: none, documentation-only Art Bible department.
Blockers: none.
Runtime files changed: no
Ready for QA: yes
Notes for game manager: Art Bible department is complete for department use. Other departments should read 00_ART_BIBLE and REFERENCE_LIBRARY before creating or reconciling production asset plans.

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

Status: READY_FOR_QA
Branch name: male-character-realistic-sprite-states
Latest commit SHA: 02c938ccfd963ce1bc05b895e3c465bc07fc3eeb
Files created: README.md, MALE_STATE_BREAKDOWN.md, manifest_male.json, manifest_male_state_index.json, prompt_sheets/MALE_GENERATION_PROMPTS.md, .gitkeep files for idle, walk, run, sit, sleep, phone, laptop, cooking, eating, shower_bathroom, reading, exercise, pet_dog, social_solo, transitions, and prompt_sheets.
Folders created: apartment-god-production/02_MALE_CHARACTER/ with idle, walk, run, sit, sleep, phone, laptop, cooking, eating, shower_bathroom, reading, exercise, pet_dog, social_solo, transitions, prompt_sheets.
Art Bible read: yes, from art-bible-production-structure branch.
Reference Library read: yes, README_REFERENCE_USE.md, reference_manifest.json, and universal reference prompt were read from apartment-god-production/REFERENCE_LIBRARY/.
States/assets completed: 69 planned male states documented and manifest-listed across idle, directional walk, directional run, sit, sleep, phone, laptop, cooking, eating, shower_bathroom, reading, exercise, pet_dog, social_solo, and transitions. All groups include A/B/C or B-only sleep logic.
Manifest status: manifest_male.json is valid JSON and is now the primary Codex-consumable manifest for all 69 planned male states. Every state entry includes state_id, category, character_type, action_name, frame_count, frame_files, frames, frame_logic, gameplay_tags, loop_frames, entry_frames, hold_frames, exit_frames, anchor_point, scale_notes, implementation_notes, and status.
Generated assets/sheets: none, per instruction. Missing PNG sprite sheets are deferred to later asset production and are not a planning-manifest QA blocker.
Blockers: none for planning-manifest QA.
Runtime files changed: no
Ready for QA: yes
Notes for game manager: Male cleanup pass expanded manifest_male.json from partial core idle/walk coverage to all 69 planned states. No runtime files, Render settings, deploy settings, main branch, or ai-rpg-engine content were touched.

---

## 03_FEMALE_CHARACTER

Status: PARTIALLY_READY
Branch name: female-character-realistic-sprite-states
Latest commit SHA: 52e1ca37bba91d5bcfd4973e1a12da25bb85fb02
Files created: README.md, FEMALE_STATE_BREAKDOWN.md, manifest_female.json, manifest_female_state_index.json, prompt_sheets/FEMALE_GENERATION_PROMPTS.md, .gitkeep files for required category folders, REFERENCE_LIBRARY placeholder files.
Folders created: apartment-god-production/03_FEMALE_CHARACTER/ with idle, walk, run, sit, sleep, phone, laptop, cooking, eating, shower_bathroom, reading, exercise, pet_dog, social_solo, transitions, prompt_sheets. REFERENCE_LIBRARY placeholders for 01_environment_references, 02_human_realistic_topdown_linework, 03_dog_references.
Art Bible read: yes, from art-bible-production-structure branch. Missing from production-manager-department-logs at cleanup time.
Reference Library read: no, missing from production-manager-department-logs and not available in current tool session.
States/assets completed: 67 female states planned and manifest-listed, all required categories covered, A/B/C or documented hold logic included.
Manifest status: manifest_female.json reconciled as the primary all-state manifest. Valid JSON. Every planned state includes state_id, category, character_type, action_name, frame_count, frames or planned frame names, frame logic, gameplay_tags, loop_frames, entry_frames, hold_frames, exit_frames, anchor_point, scale_notes, implementation_notes, and status.
Generated assets/sheets: none.
Blockers: shared reference pack apartment_god_shared_reference_pack.zip was not available to inspect, REFERENCE_LIBRARY missing on production-manager-department-logs, 00_ART_BIBLE missing on production-manager-department-logs.
Runtime files changed: no
Ready for QA: no
Notes for game manager: Department planning cleanup is complete and manifest reconciliation is done. QA should wait until the actual Art Bible and shared reference pack are present on the production manager branch or merged into the department branch.

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
