# QA Review Report, Production Manifests

Branch: `qa-review-production-manifests`

Base branch: `art-bible-production-structure`

Department: `06_INTEGRATION_QUEUE, QA Review`

## QA summary

Overall QA result: `PARTIALLY READY FOR CODEX INTEGRATION`.

The planning departments are ready enough for Codex to begin a guarded integration-prep pass that reads manifests and prepares mapping logic, but not enough for final visual asset integration. The approved work is planning, prompts, folder structure, reference handling, manifest shape, and runtime-safety review only. No final sprite PNGs or gameplay asset integration were expected or required for this phase.

Departments passed: Reference Library, Art Bible, Apartment Environment, Male Character, Female Character, Dog Character, Joint Character States.

Departments needing rework: none for this planning-manifest QA phase.

Departments blocked: none for planning-manifest QA.

Ready for final sprite integration: no, because no final sprite PNG sheets exist yet by instruction.

Ready for Codex integration-prep: yes, with strict limits listed in the Codex instructions section below.

## Reviewed branches and reported handoff commits

| Department | Branch reviewed | Reported handoff commit | QA verdict |
| --- | --- | --- | --- |
| Reference Library | `reference-library-install` | `7484e010c191c98c77ea85e36f30344f76d393de` | PASS |
| Art Bible | `art-bible-production-structure` | `c9958451d15ded8a35f60ff1aa7dae1431849af1` | PASS |
| Apartment Environment | `apartment-environment-cyberpunk-assets` | `4a9a85eb8e776020e551175d3d39e3b36640eac2` | PASS |
| Male Character | `male-character-realistic-sprite-states` | `4d13eb5d69e7bdb6587b6c354b0f0a5e154d6dfa` | PASS |
| Female Character | `female-character-realistic-sprite-states` | `d086ed309003ed34fe6e7c84c599422c72de5681` | PASS |
| Dog Character | `dog-character-realistic-sprite-states` | `d0c74266545f3ef6c94ed37d777188222de7a9e7` | PASS |
| Joint Character States | `joint-character-realistic-sprite-states` | `fe871826cafc09ee0de878bee2a2ac1fe4e2bbb1` | PASS |

Notes on handoff commits: some reported handoff commits are status-board-only corrections after the actual department content commit. QA noted those but did not block the department when the content files and manifests were valid.

## Runtime safety check

Result: PASS.

Branch comparisons against `main` showed production documentation, production folders, manifests, prompt sheets, reference images, and `.gitkeep` placeholders only.

No changed files were found under:

- `src/`
- Render configuration paths
- deployment configuration paths
- `Kalomika/ai-rpg-engine`

No department integrated assets into gameplay. No final sprite PNGs were created by these departments as part of this QA phase.

## Reference Library compliance

Result: PASS.

The installed Reference Library branch contains the expected structure under `apartment-god-production/REFERENCE_LIBRARY/`, including:

- `00_contact_sheets/`
- `01_environment_references/`
- `02_human_realistic_topdown_linework/`
- `03_dog_references/`
- `04_legacy_simple_character_refs/`
- `05_current_game_context/`
- `06_department_reference_prompts/`
- `README_REFERENCE_USE.md`
- `reference_manifest.json`

The Reference Library manifest lists the expected environment, human top-down linework, dog, legacy, current-game-context, contact sheet, and universal prompt references. The universal reference prompt explicitly states that references are visual guidance only and must not be treated as final gameplay assets.

The current department branches carry the installed Reference Library rather than the earlier placeholder-only state. No placeholder Reference Library content remains as final department output.

## Art Bible compliance notes

Result: PASS.

The Art Bible branch defines the source-of-truth rules for:

- realistic orthographic top-down linework
- adult Black male sprite rules
- adult Black female sprite rules
- realistic white or off-white dog sprite rules
- cyberpunk apartment direction
- no chibi
- no cute toy body
- no mascot proportions
- no oversized heads
- no emoji body language
- clothing-neutral base sprites, not nude
- transparent PNG target for future generated art
- A/B/C frame logic
- randomized sleep/rest holds
- joint shared-anchor logic
- scale and anchor rules
- manifest requirements
- QA acceptance and rejection rules

All reviewed department planning files align to those rules at the planning and manifest level.

## Department-by-department verdict

### Reference Library

Verdict: PASS.

The shared reference pack is installed into the expected `REFERENCE_LIBRARY/` path. The installed manifest lists the expected folders and files. Runtime files changed: no.

QA note: reference images are approved as references only, not as final gameplay assets.

### Art Bible

Verdict: PASS.

The Art Bible files are present and define the required style, naming, scale, anchor, manifest, and QA rules. Runtime files changed: no.

QA note: Art Bible is documentation-only and ready for department use.

### Apartment Environment

Verdict: PASS.

Reviewed primary manifest:

`apartment-god-production/01_APARTMENT_ENVIRONMENT/manifest_environment.json`

The environment branch contains planning files for layout, integration notes, wall and doorway language, room style, prop lists, lighting language, and the environment manifest. The manifest is valid JSON and includes the required environment fields:

- `state_id`
- `category`
- `asset_type`
- `room`
- `gameplay_tags`
- `frame_count`
- `frames` or planned frame names
- `anchor_point`
- `collision_notes`
- `interaction_notes`
- `visual_notes`
- `implementation_notes`
- `status`

The environment work follows the cyberpunk apartment direction: dark wall masses, readable top-down apartment layout, lived-in tech clutter, and gameplay-scale readability. Runtime files changed: no.

### Male Character

Verdict: PASS.

Reviewed primary manifest:

`apartment-god-production/02_MALE_CHARACTER/manifest_male.json`

The male department branch includes README, state breakdown, prompt sheet, category folders, state index, and the primary Codex-consumable manifest. The status handoff says the primary manifest covers all 69 planned male states. QA inspected the manifest structure and confirmed valid JSON shape with required character fields:

- `state_id`
- `category`
- `character_type`
- `action_name`
- `frame_count`
- `frames` or planned frame names
- `frame_logic`
- `gameplay_tags`
- `loop_frames`
- `entry_frames`
- `hold_frames`
- `exit_frames`
- `anchor_point`
- `scale_notes`
- `implementation_notes`
- `status`

Planning follows adult Black male, realistic top-down linework, clothing-neutral base, no chibi/cute/mascot rules, A/B/C locomotion, B/C loop guidance for activity states, sleep/rest holds, and Art Bible anchor labels. Runtime files changed: no.

### Female Character

Verdict: PASS.

Reviewed primary manifest:

`apartment-god-production/03_FEMALE_CHARACTER/manifest_female.json`

The female department branch includes README, state breakdown, prompt sheet, category folders, state index, and the primary Codex-consumable manifest. The status handoff says the primary manifest covers all 67 planned female states and was reconciled against the final Art Bible and installed Reference Library. QA inspected the manifest structure and confirmed valid JSON shape with required character fields:

- `state_id`
- `category`
- `character_type`
- `action_name`
- `frame_count`
- `frames` or planned frame names
- `frame_logic`
- `gameplay_tags`
- `loop_frames`
- `entry_frames`
- `hold_frames`
- `exit_frames`
- `anchor_point`
- `scale_notes`
- `implementation_notes`
- `status`

Planning follows adult Black female, realistic top-down linework, clothing-neutral base, no chibi/cute/mascot rules, A/B/C logic, B-only sleep/rest holds, sitting-on-bed transitions, seated-chair reuse, and Art Bible anchor labels. Runtime files changed: no.

### Dog Character

Verdict: PASS.

Reviewed primary manifest:

`apartment-god-production/05_DOG_CHARACTER/manifest_dog.json`

The dog branch includes README, state breakdown, prompt sheet, category folders, state index, and the primary dog manifest. The manifest is valid JSON and uses the required character fields:

- `state_id`
- `category`
- `character_type`
- `action_name`
- `frame_count`
- `frames` or planned frame names
- `frame_logic`
- `gameplay_tags`
- `loop_frames`
- `entry_frames`
- `hold_frames`
- `exit_frames`
- `anchor_point`
- `scale_notes`
- `implementation_notes`
- `status`

Planning follows realistic white or off-white dog direction, natural dog anatomy, no mascot puppy body, no oversized eyes or paws, no emoji body language, dog-specific anchors, fetch/follow/play/eat/drink/rest coverage, and A/B/C or B-only hold logic. Runtime files changed: no.

### Joint Character States

Verdict: PASS.

Reviewed primary manifest:

`apartment-god-production/04_JOINT_CHARACTER_STATES/manifest_joint.json`

The joint branch includes README, state breakdown, prompt sheet, category folders, state index, and primary joint manifest. The status handoff says the primary manifest covers all 18 joint states. QA inspected the manifest structure and confirmed valid JSON shape with required joint fields:

- `state_id`
- `category`
- `joint_type`
- `included_characters`
- `action_name`
- `frame_count`
- `frames` or planned frame names
- `frame_logic`
- `gameplay_tags`
- `loop_frames`
- `entry_frames`
- `hold_frames`
- `exit_frames`
- `anchor_point`
- `character_anchor_offsets`
- `scale_notes`
- `implementation_notes`
- `status`

Planning follows combined shared sprite logic, shared anchor rendering, adult Black male and female character rules, clothing-neutral and safe bed/private staging, no nudity, no explicit pose, randomized safe sleep/rest holds, and Art Bible anchor labels. Runtime files changed: no.

## Manifest validation results

| Manifest | Valid JSON | Required fields | Result |
| --- | --- | --- | --- |
| `01_APARTMENT_ENVIRONMENT/manifest_environment.json` | yes | yes | PASS |
| `02_MALE_CHARACTER/manifest_male.json` | yes | yes | PASS |
| `03_FEMALE_CHARACTER/manifest_female.json` | yes | yes | PASS |
| `04_JOINT_CHARACTER_STATES/manifest_joint.json` | yes | yes, including `included_characters` and `character_anchor_offsets` | PASS |
| `05_DOG_CHARACTER/manifest_dog.json` | yes | yes | PASS |

QA note: Missing final sprite PNGs are not a blocker for this planning-manifest QA task because the task explicitly says not to fail departments for no final PNGs and also instructs not to create final sprite PNGs.

## Blockers

None for planning-manifest QA.

Blocking condition for final gameplay visual integration:

- No final generated, QA-approved transparent sprite PNG sheets exist yet. This is expected for this phase and should be handled by the later asset production pass before final visual integration.

## Needs-rework list

None required before Codex integration-prep.

Deferred follow-up before final art integration:

- Generate original transparent PNG sprite sheets from the approved prompts and manifests.
- Run visual style QA on actual generated art.
- Approve only original, non-watermarked, non-reference final art.
- Populate approved final asset registry only after visual QA.

## Approved-for-Codex-integration list

Approved for Codex integration-prep only:

- `REFERENCE_LIBRARY/` as reference-only input.
- `00_ART_BIBLE/` as source-of-truth style and manifest rules.
- `01_APARTMENT_ENVIRONMENT/manifest_environment.json` as planning manifest.
- `02_MALE_CHARACTER/manifest_male.json` as planning manifest.
- `03_FEMALE_CHARACTER/manifest_female.json` as planning manifest.
- `04_JOINT_CHARACTER_STATES/manifest_joint.json` as planning manifest.
- `05_DOG_CHARACTER/manifest_dog.json` as planning manifest.

Not approved for final gameplay visual asset integration yet:

- Any reference image.
- Any placeholder `.gitkeep`.
- Any non-existent final sprite PNG.
- Any generated sprite not yet created and QA-approved.

## Exact next instructions for Codex

Codex may begin a guarded integration-prep branch only after the game manager confirms the intended scope.

Codex must:

1. Use `realistic-cyberpunk-visual-integration` or another manager-approved integration branch.
2. Read the Art Bible and all five department manifests before touching runtime code.
3. Do not copy Reference Library images into gameplay assets.
4. Treat all manifests as planning state maps until final PNGs exist.
5. Preserve existing gameplay behavior, including phone UI, floor switching, movement, fetch, music, cooking, reading, save slots, windows, build placement, object clicks, floor transfer, and procedural fallback.
6. Prepare mapping logic from current procedural states to manifest `state_id`s, but keep fallbacks active where final sprites are missing.
7. Render joint states as one combined shared sprite only after both characters reach the shared anchor.
8. Use `character_anchor_offsets` from the joint manifest when later drawing combined joint sprites.
9. Use randomized sleep/rest holds when multiple approved sleep/rest sprites exist.
10. Loop A/B/C for movement and loop B/C or hold B for activity states based on each manifest.
11. Do not integrate final visual sprites until a later QA pass approves real PNG assets.

Codex must not:

- Edit `main` directly.
- Touch `Kalomika/ai-rpg-engine`.
- Change Render settings.
- Deploy.
- Replace gameplay behavior with manifest assumptions.
- Use reference images as final gameplay assets.
- Treat missing final PNGs as available assets.
