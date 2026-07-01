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
Latest commit SHA: c9958451d15ded8a35f60ff1aa7dae1431849af1
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
Branch name: environment-png-production-pass-01
Latest commit SHA: 844498d22b1948a19fd0083275bcfe6eac228c20
Files created: generated_png/pass_01/ASSET_INDEX.md, generated_png/pass_01/PNG_QA_NOTES.md, and 10 original transparent PNG assets for floor base, room base, prop-set base, wall, stair, and lighting priorities.
Folders created: apartment-god-production/01_APARTMENT_ENVIRONMENT/generated_png/pass_01/
Art Bible read: yes
Reference Library read: yes
States/assets completed: PNG pass 01 generated for ENV_FLOOR_1_BASE_LAYOUT, ENV_FLOOR_2_BASE_LAYOUT, ENV_LIVING_ROOM_BASE, ENV_KITCHEN_BASE, ENV_BATHROOM_BASE, ENV_BEDROOM_BASE, ENV_WORKSPACE_BASE, ENV_PROP_STAIRS_BASE, ENV_WALLS_DARK_BASE, and ENV_LIGHTING_NEON_CYAN. Asset index maps manifest planned uppercase frame names to stable lowercase PNG filenames.
Manifest status: manifest_environment.json was read and used as the source for state IDs and planned frame names. No manifest changes made in this pass.
Generated assets/sheets: 10 original transparent PNG files in generated_png/pass_01/. First-pass production art only, needs visual QA before approval or runtime use.
Blockers: none for PNG pass 01. Final runtime visual integration still requires visual QA approval and an approved asset registry.
Runtime files changed: no
Ready for QA: yes
Notes for game manager: Environment PNG pass 01 is generated and ready for visual QA. Assets are not integrated into runtime and Reference Library images were not reused as final assets.

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

Status: READY_FOR_QA
Branch name: qa-review-production-manifests
Latest commit SHA: 0f1a27c0b809ab0a0b648925b36f3b3500379011
Files created: QA_REVIEW_REPORT.md.
Folders created: none; used existing apartment-god-production/06_INTEGRATION_QUEUE/ from base production structure.
Art Bible read: yes
Reference Library read: yes
States/assets completed: QA reviewed planning files, manifests, prompts, department folders, status board handoffs, and branch runtime safety for Reference Library, Art Bible, Apartment Environment, Male Character, Female Character, Dog Character, and Joint Character States. No final sprites generated or required.
Manifest status: All five primary production manifests reviewed as valid JSON and PASS for planning-manifest QA: manifest_environment.json, manifest_male.json, manifest_female.json, manifest_joint.json, and manifest_dog.json.
Generated assets/sheets: none, per instruction.
Blockers: none for planning-manifest QA. Final gameplay visual integration remains blocked until original transparent PNG sprite sheets are generated and visually QA-approved.
Runtime files changed: no
Ready for QA: yes
Notes for game manager: QA_REVIEW_REPORT.md approves all departments for Codex integration-prep only. Codex may read manifests and prepare guarded mapping/fallback logic, but must not treat Reference Library images or missing final PNG sprites as gameplay-ready assets.

Production Manifest Rollup status:
Status: READY_FOR_CODEX_INTEGRATION_PREP
Branch name: production-manifest-rollup
Latest commit SHA: final branch HEAD reported after commit and push
Included departments: REFERENCE_LIBRARY, 00_ART_BIBLE, 01_APARTMENT_ENVIRONMENT, 02_MALE_CHARACTER, 03_FEMALE_CHARACTER, 04_JOINT_CHARACTER_STATES, 05_DOG_CHARACTER, 06_INTEGRATION_QUEUE
Manifest validation: all required JSON manifests valid
Runtime files changed: no
Ready for Codex integration-prep: yes
Blockers: none

---

## 07_CODEX_INTEGRATION, Runtime Integration

Status: READY_FOR_REVIEW
Branch name: codex-manifest-integration-prep
Latest commit SHA: final branch HEAD reported after commit and push
Files created: README.md, MANIFEST_INTEGRATION_PLAN.md, RUNTIME_STATE_MAPPING.md, MISSING_ASSET_REPORT.md, FALLBACK_RULES.md, CODEX_NEXT_STEPS.md.
Folders created: apartment-god-production/07_CODEX_INTEGRATION/
Art Bible read: yes
Reference Library read: yes
States/assets completed: Integration-prep documentation only. Current runtime state/action mapping prepared for future environment, male, female, dog, and joint manifest state IDs.
Manifest status: All required rollup manifests present and inspected; no runtime asset integration performed. Planned PNGs remain missing and intentionally gated.
Generated assets/sheets: none.
Blockers: none for integration-prep review. Final visual integration remains blocked until original transparent PNG sprite sheets and environment PNGs are generated, QA-approved, and registered as approved assets.
Runtime files changed: no
Ready for QA: yes
Notes for game manager: This branch prepares guarded manifest mapping and fallback rules only. It does not alter `src/`, does not use Reference Library images as runtime assets, and does not replace current prototype visuals.

Runtime integration does not begin until QA says safe to integrate.
