# Development Matrix Patch: Upstairs Extension And Idea Bible

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-upstairs-extension-2026-07-13

## Matrix rows to merge during next safe documentation sync

Update Upstairs layout row or add if missing:

| Upstairs extension layout | NEEDS_BROWSER_CONFIRMATION | `src/world.js`, `src/blueprint.js`, `src/upstairsExtensionLayout.js`, `src/rendering.js`, `tests/upstairs-extension-layout.test.js` | First runtime pass added. Existing primary/master side shifted to right-side upstairs zone. New upstairs section contains relocated stairs, hall, two bedrooms, closets, wall TVs, nightstands, a shared bathroom with shower/sink/toilet, and storage/closet room. | Browser test upstairs routing, room readability, stairs relocation, bathroom placement, bedroom TVs, closets, and movement between new/primary sections. |

Update Primary bath / vanity row:

| Primary vanity orientation | NEEDS_BROWSER_CONFIRMATION | `src/world.js`, `src/upstairsExtensionLayout.js`, `tests/upstairs-extension-layout.test.js` | Primary suite vanity is defined as east-facing with west-side handles and receives a runtime readability overlay. | Browser inspect vanity room. Sink basins should read as basins in a vanity, not mini tubs, and should not face south. |

Update Bathroom behavior row:

| Bathroom and closet routing intelligence | PLANNED | `src/world.js`, `src/actions.js`, `src/movement.js`, future AI routing pass | Upstairs bathroom and closet objects exist, but autonomous routing still needs to prefer nearest logical bathroom/sink/shower/closet based on actor location. | Add nearest-bathroom/nearest-closet selection so upstairs actors do not randomly go downstairs unless intentionally doing so. |

Add Idea Bible row:

| Idea Bible / rebuild backlog | ACTIVE | `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md`, `apartment-god-production/IDEA_BIBLE_COVERAGE_AUDIT_2026-07-13.md` | New source-of-truth Bible created. Current major ideas and their code status are documented so future chats can search the repo instead of relying on memory. | Continue backfilling older ideas from previous logs and chat summaries. Every future meaningful idea must be added here or in a Bible append file. |

Add test scenario:

| Scenario | Priority | Status | Exact test |
|---|---|---|---|
| Upstairs extension first pass | Critical | NEEDS_BROWSER_CONFIRMATION | Go upstairs. Confirm stairs are in the new landing section, not the primary suite side. Confirm full and queen bedrooms, closets, TVs, shared bath, storage/closet room, and shifted primary suite side are present and connected. |
