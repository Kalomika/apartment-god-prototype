# 06_INTEGRATION_QUEUE

This folder is the production handoff area for Codex.

`asset_registry.json` is the main integration contract. Codex should treat it as the source of truth for approved realistic cyberpunk assets.

At this QA checkpoint, the registry contains zero approved assets because the required reference library could not be inspected, the production departments are split across branches, some required manifests are missing, and no final transparent PNG production art was confirmed.

## Folder contents

- `approved_assets_only/`, reserved for approved final assets only.
- `asset_registry.json`, consolidated registry for Codex.
- `integration_notes.md`, Codex-facing implementation guardrails.
- `QA_REPORT.md`, full production review.
- `REWORK_LIST.md`, all known blockers and required fixes.
- `READY_FOR_CODEX.md`, final readiness summary.
- `README.md`, this handoff explanation.

## Approval rules

Do not approve assets that violate the Art Bible.

Do not approve cute, chibi, mascot, toy, emoji-like, or childlike sprites.

Do not approve missing manifests.

Do not approve source reference images as gameplay assets.

Do not approve planning notes as final art.

Do not approve assets that lack transparent PNG production files where final sprite art is required.

## Required reference library

The shared reference library must be present before final asset approval:

- `apartment-god-production/REFERENCE_LIBRARY/01_environment_references/`
- `apartment-god-production/REFERENCE_LIBRARY/02_human_realistic_topdown_linework/`
- `apartment-god-production/REFERENCE_LIBRARY/03_dog_references/`
- `apartment-god-production/REFERENCE_LIBRARY/README_REFERENCE_USE.md`
- `apartment-god-production/REFERENCE_LIBRARY/reference_manifest.json`

The reference library is for pose logic and style guidance only. It must not be committed as final gameplay art.

## Runtime boundary

Do not create gameplay runtime code from this folder.

Do not edit `src/`.

Do not change Render settings.

Do not merge to `main` from this QA pass.

Do not deploy.
