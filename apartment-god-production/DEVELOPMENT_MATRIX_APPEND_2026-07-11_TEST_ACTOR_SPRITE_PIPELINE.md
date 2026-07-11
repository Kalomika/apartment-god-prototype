# Development Matrix Append, 2026-07-11, Test Actor Top Down Sprite Pipeline

Status: PARTIAL IMPLEMENTED
Branch: phaser-migration
Implementation commit: b29e9d0664ec1d6743506b2c610429b2cb848b13
Backup branch: backup/phaser-migration-before-test-actor-sprite-pipeline-2026-07-11

## Matrix rows affected

| Matrix area | Row | Previous direction | New status | Source files | Notes |
|---|---|---|---|---|---|
| Core Systems | Sprite replacement pipeline | PLANNED / risk area | PARTIAL | `src/testActorPoseManifest.js`, `src/testActorSpriteRenderer.js`, `src/renderEntities.js` | Test Subject now has a dedicated activity pose manifest and renderer with safe fallback. |
| Actor Rendering | Procedural person body | Generic procedural body for all persons | PARTIAL | `src/renderEntities.js` | `lab_test_subject` now routes through the Test Subject renderer first. Other actors remain procedural for safety. |
| Animation Matrix | Idle | PARTIAL | PARTIAL, upgraded first pass for Test Subject | `src/testActorSpriteRenderer.js` | Full color adult top down idle with breathing motion. |
| Animation Matrix | Walk | PARTIAL | PARTIAL, upgraded first pass for Test Subject | `src/testActorSpriteRenderer.js` | Four frame low frame rate top down walk cycle logic. |
| Animation Matrix | Sit / couch / chair | PARTIAL | PARTIAL, upgraded first pass for Test Subject | `src/testActorSpriteRenderer.js` | Separate chair, couch, TV, desk, console, reading, phone, and eating poses. |
| Animation Matrix | Sleep / bed | PARTIAL | PARTIAL, upgraded first pass for Test Subject | `src/testActorSpriteRenderer.js` | Separate sleep and awake lying variants. |
| Animation Matrix | Object interaction | PARTIAL | PARTIAL, upgraded first pass for Test Subject | `src/testActorPoseManifest.js`, `src/testActorSpriteRenderer.js` | Desk, laptop, phone, food, coffee, cleaning, cooking, pool table, console, workout, and pet interaction families now map to separate pose draw calls. |
| Test Matrix | Character sprite integrity | NEEDS_TESTING | NEEDS_TESTING, first implementation exists | `src/testActorSpriteRenderer.js` | Needs browser scale review against true top down law. |
| Test Matrix | Activity animation identity | NEEDS_TESTING | NEEDS_TESTING, first implementation exists | `src/testActorPoseManifest.js` | Broad actions no longer all collapse to one Test Subject seated visual. |
| Risk Matrix | Sprite pipeline drift | HIGH | HIGH, partly mitigated | `apartment-god-production/reference/characters/test-actor-top-down-sprite-pipeline-2026-07-11.md` | Pipeline and design standard were documented so later agents can continue without losing the visual law. |

## Required second pass matrix items

```txt
Replace Canvas vector poses with approved PNG sprite sheets or an atlas once visual direction is signed off.
Add true directional sheets for locomotion and object facing.
Add object-specific shower, toilet, swim, darts, arcade, couple, and live pet alignment variants.
Add test coverage for pose resolution so new actions cannot silently fall back to generic visuals.
Keep the matrix honest when runtime activity states or pose files change.
```

## Note

This append exists because this run used the GitHub tree and commit tools, which are reliable for creating and replacing known file contents but do not offer a safe line-level append API for the existing matrix. The canonical matrix should absorb this append in the next documentation sync pass.
