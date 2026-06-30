# Ready For Codex Integration

Status:
NOT READY

Branch reviewed:

`asset-qa-realistic-style-review`

Approved folders:

None.

Blocked folders:

- `apartment-god-production/REFERENCE_LIBRARY/`
- `apartment-god-production/00_ART_BIBLE/`
- `apartment-god-production/01_APARTMENT_ENVIRONMENT/`
- `apartment-god-production/02_MALE_CHARACTER/`
- `apartment-god-production/03_FEMALE_CHARACTER/`
- `apartment-god-production/04_JOINT_CHARACTER_STATES/`
- `apartment-god-production/05_DOG_CHARACTER/`

Top blockers:

- The shared reference pack was not accessible in the repo or uploaded workspace during this QA pass.
- `REFERENCE_LIBRARY` is missing from the QA branch.
- The Art Bible is only on a separate branch, not this QA branch.
- Department folders are split across separate branches.
- `04_JOINT_CHARACTER_STATES` was not found.
- Female, dog, and joint manifests are missing.
- Environment and male manifests need Art Bible schema normalization.
- No final transparent PNG assets were verified.

Safe to integrate now:

no

Recommended next branch for Codex:

`realistic-cyberpunk-visual-integration`

Required Codex actions:

1. Wait until `asset_registry.json` contains approved assets.
2. Preserve current gameplay behavior and object IDs.
3. Map old procedural rendering to approved sprite states only after QA approval.
4. Keep fallback procedural rendering where sprites are missing.
5. Render joint states as one combined sprite only after both characters reach the correct interaction anchor.
6. Keep dog states separate from human states.
7. Do not integrate source reference images as gameplay assets.
