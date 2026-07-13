# Idea Bible Coverage Audit

Status: INITIAL_COVERAGE_AUDIT
Date: 2026-07-13
Branch: phaser-migration

## Why this audit exists

Kam caught a process failure: the upstairs extension idea had to be found from chat memory because it was not searchable in the repo log, matrix, or Bible. That is a pipeline bug. Ideas should not disappear just because they were not executed yet.

## Files created or updated for the pipeline fix

- `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md`
- `apartment-god-production/IDEA_BIBLE_COVERAGE_AUDIT_2026-07-13.md`

## Current coverage result

This initial audit added a searchable source-of-truth Bible entry for the currently active and recently implemented ideas below.

| Idea/system | Current code/doc status | Bible status | Gap |
|---|---|---|---|
| Upstairs extension over living room | First runtime pass in `src/world.js`, `src/blueprint.js`, `src/upstairsExtensionLayout.js`, `src/rendering.js` | Added | Needs browser confirmation and PNG plates |
| Move upstairs stairs from primary/master side to new extension | First runtime pass in `src/world.js` | Added | Needs browser confirmation |
| Two upstairs bedrooms with closets, TVs, nightstands, full/queen beds | First runtime pass in `src/world.js` | Added | Needs object sprites and interaction anchors |
| Shared upstairs bathroom with shower/sink/toilet | First runtime pass in `src/world.js`, `src/upstairsExtensionLayout.js` | Added | Needs autonomy routing and final PNG assets |
| Primary east-facing vanity, handles west | First runtime pass in `src/world.js`, `src/upstairsExtensionLayout.js` | Added | Needs browser confirmation |
| Use upstairs/master bathroom instead of defaulting downstairs | Not fully implemented | Added | Needs AI routing pass |
| Use sink after toilet/grooming | Not fully implemented | Added | Needs action chain pass |
| Change clothes through closets | Actions exist through `closet` kind | Added | Needs AI routine pass and animation/wardrobe pass |
| Anime top-down visual quality law | Partially documented in true top-down standard | Added | Needs PNG asset production |
| Time-based anime lighting | First runtime pass in `src/animeTimeLighting.js` | Added | Needs light mask and tuning |
| Porch/couch/dining cleanup | First runtime pass in `src/mainFloorLayoutPolish.js` | Added | Needs browser confirmation and final PNGs |
| TV glow only when watching | First runtime pass in `src/mainFloorLayoutPolish.js` | Added | Needs browser confirmation |
| Chair-back layering for desk seats | First runtime pass in `src/afterEntityOverlays.js` | Added | Needs final chair/actor PNG layering |
| Sleep heads align with bed/body | First runtime pass in `src/afterEntityOverlays.js` | Added | Needs final sleep PNGs |
| Dog true top-down quality and four-leg movement | Runtime overlay in `src/afterEntityOverlays.js` | Added | Needs real dog PNG sprite sheet |
| Soccer aimed kick loop | First runtime pass in `src/soccerSystem.js` | Added | Needs browser tuning and soccer animation frames |
| Vehicle boarding sequence | Partial runtime/docs from vehicle passes | Added | Needs complete vehicle state set |
| Bug audit after AI commits | Hourly automation exists, docs added | Added | Needs repo-side tests and CI-like gate |

## Audit limitation

This was an initial coverage audit, not an exhaustive historical recovery of every Apartment God idea from every prior chat. The Bible now contains the active major ideas that were visible from current repo state and available conversation context. Further recovery should continue by searching old logs, append files, and chat-export summaries.

## Required future rule

Every future response that implements runtime work must update:

1. `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md` or a clearly named append file.
2. `apartment-god-production/ONGOING_DESIGN_LOG.md` or a safe append file.
3. `apartment-god-production/DEVELOPMENT_MATRIX.md` or a safe matrix patch file.

The Bible is not only for completed work. It must preserve planned ideas, rejected directions, and the intended final behavior.
