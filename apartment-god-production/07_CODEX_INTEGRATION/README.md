# 07_CODEX_INTEGRATION

Department: Codex Integration, Runtime Integration
Branch: codex-manifest-integration-prep
Base branch: production-manifest-rollup
Status: integration-prep only

This folder prepares future visual integration without changing live gameplay visuals.

## Scope

Allowed in this branch:

- Read production manifests and handoff reports.
- Inventory planned environment, character, dog, and joint states.
- Map current runtime actions and pose buckets to future manifest `state_id` values.
- Record missing transparent PNG assets.
- Define fallback rules so the current prototype keeps running.
- Propose future runtime work for approval.

Not allowed in this branch:

- No reference images as runtime assets.
- No generated placeholders marked final.
- No final art generation.
- No invented missing transparent PNG sprite sheets.
- No replacement of current procedural prototype visuals.
- No deployment.
- No Render setting changes.
- No `main` branch changes.
- No `Kalomika/ai-rpg-engine` changes.

## Source Material Read

- `apartment-god-production/PRODUCTION_MANAGER_LOG.md`
- `apartment-god-production/DEPARTMENT_START_HERE.md`
- `apartment-god-production/DEPARTMENT_STATUS_BOARD.md`
- `apartment-god-production/06_INTEGRATION_QUEUE/QA_REVIEW_REPORT.md`
- `apartment-god-production/06_INTEGRATION_QUEUE/MANIFEST_ROLLUP_REPORT.md`
- `apartment-god-production/00_ART_BIBLE/`
- `apartment-god-production/REFERENCE_LIBRARY/`
- `apartment-god-production/01_APARTMENT_ENVIRONMENT/manifest_environment.json`
- `apartment-god-production/02_MALE_CHARACTER/manifest_male.json`
- `apartment-god-production/03_FEMALE_CHARACTER/manifest_female.json`
- `apartment-god-production/04_JOINT_CHARACTER_STATES/manifest_joint.json`
- `apartment-god-production/05_DOG_CHARACTER/manifest_dog.json`

## Manifest Inventory

| Manifest | Entries | Current status values | Planned PNG files | Existing department image files | Integration status |
| --- | ---: | --- | ---: | ---: | --- |
| `01_APARTMENT_ENVIRONMENT/manifest_environment.json` | 51 | `review` | 51 | 0 | Planning manifest only |
| `02_MALE_CHARACTER/manifest_male.json` | 69 | `draft` | 194 | 0 | Planning manifest only |
| `03_FEMALE_CHARACTER/manifest_female.json` | 67 | `draft` | 178 | 0 | Planning manifest only |
| `04_JOINT_CHARACTER_STATES/manifest_joint.json` | 18 | `draft` | 50 | 0 | Planning manifest only |
| `05_DOG_CHARACTER/manifest_dog.json` | 63 | `draft` | 170 | 0 | Planning manifest only |

The dog manifest stores entries as arrays using `entry_field_order`; future parsers must map by that declared field order instead of assuming object-shaped entries.

## Current Runtime Summary

The current prototype renders the world procedurally in canvas:

- Rooms and floors are drawn in `src/renderWorld.js`.
- Objects are drawn in `src/renderObjects.js`.
- People and dog are drawn in `src/renderEntities.js`.
- Runtime entity state uses simple `pose` values such as `stand`, `walk`, `sit`, and `sleep`.
- Object and social actions come from `src/config.js`, `src/actions.js`, `src/sharedActions.js`, and related systems.

These runtime visuals are still the approved live prototype fallback and must stay active until real transparent PNG assets are generated, QA-approved, and explicitly cleared for integration.

## Files In This Prep Packet

- `MANIFEST_INTEGRATION_PLAN.md`: safe plan for integrating all five manifests later.
- `RUNTIME_STATE_MAPPING.md`: current runtime action and pose mapping to future manifest `state_id` values.
- `MISSING_ASSET_REPORT.md`: missing environment PNG and transparent sprite PNG inventory.
- `FALLBACK_RULES.md`: guardrails that preserve existing prototype visuals.
- `CODEX_NEXT_STEPS.md`: approval-gated future implementation tasks.

## Prep Result

Integration-prep docs are complete. Runtime files changed: no.
