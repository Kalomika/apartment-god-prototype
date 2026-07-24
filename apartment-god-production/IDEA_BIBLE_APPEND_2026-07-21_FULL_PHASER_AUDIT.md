# Idea Bible Append, Full Phaser Audit

Date: 2026-07-21
Status: ACTIVE BUG AND PRODUCTION DIRECTIVE
Branch: repair/phaser-full-audit-2026-07-21
Source head: phaser-migration at 3e8722052e7dc4fbf781b11979f339327b8b6b06

## Audit Direction

- Work from the latest live branch state and preserve newer work from other agents.
- Treat unfamiliar code as new work, not automatically as a regression.
- Repair only defects proven by code, tests, CI, branch comparison, or reproducible repository evidence.
- Keep Render settings and `main` unchanged unless separately authorized.

## Verified Defects

- Phaser scene shutdown did not remove global `beforeunload` and `visibilitychange` listeners or its hidden simulation interval.
- Camera swipe listeners captured the first scene state forever and could not rebind safely after a scene restart.
- Timed activity object identity disappeared when arrival cleared the movement target, preventing reliable object facing.
- Stale `currentActionId`, `activityObjectId`, and `actionTotal` values could remain after travel or non timed state replacement.
- Activity progress rendering required a valid `actionTotal`, so older or incomplete saves could show a bar stuck at its beginning or no bar.
- Arcade cabinet world hit testing used screen coordinates instead of Phaser world coordinates.
- The kitchen sink had two conflicting authoritative positions, one in runtime object corrections and another in the Phaser visual overlay. This separated visible art from collision and produced duplicate rendering.
- Regular version 2 save loading replaced the entire modern state and world object list, deleting newer nested fields, entities, and objects that were absent from older saves.

## Required Character Direction

- Preserve current playable fallback sprites until replacement assets pass review.
- Replace them through a modular eight direction system with synchronized body and outfit layers.
- Do not call character quality complete while only four cardinal walk directions and generic activity distortions exist.
