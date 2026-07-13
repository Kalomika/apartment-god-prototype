# Development Matrix Patch: Anime Lighting And Object Audit

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-anime-lighting-object-audit-2026-07-13
Runtime files changed: yes
Render playable branch updated: no
Render settings changed: no

## Matrix rows to merge during next safe documentation sync

Replace or update the existing top down visual production law row with:

| Top down visual production law | IMPLEMENTED | This matrix, Section 8, `docs/APARTMENT_GOD_TRUE_TOP_DOWN_ANIME_VISUAL_STANDARD.md`, `apartment-god-production/OBJECT_ANIME_LIGHTING_AND_ASSET_AUDIT_2026-07-13.md` | Runtime presentation is strict overhead 2D. Old blend placeholder style is rejected as a quality target. Anime lighting now has a source and time contract. Every object must pass an object-by-object audit before production approval. | Browser test the first lighting foundation and start replacing audited objects with PNG sets. |

Add a new system row:

| Time based anime lighting | NEEDS_TESTING | `src/animeTimeLighting.js`, `src/rendering.js`, `docs/APARTMENT_GOD_TRUE_TOP_DOWN_ANIME_VISUAL_STANDARD.md` | First runtime foundation added: daylight, night, dawn/dusk warmth, sun patches, room fixture pools, and mood vignette. This is a scene filter and lighting logic foundation, not final per-object painted lighting. | Browser test morning, noon, evening, and night on every floor. Tune strength for mobile readability. |

Update Sprite replacement pipeline row with:

| Sprite replacement pipeline | PARTIAL | `assets/sprite_replacement_queue/`, `assets/manifests/`, `src/animeVisualAssets.js`, `apartment-god-production/OBJECT_ANIME_LIGHTING_AND_ASSET_AUDIT_2026-07-13.md` | Old blend placeholders are rejected as production quality. The first full object audit exists. Every current runtime object now has an identified PNG or state-set requirement. The previous garage PNG slice is disabled until a complete state set exists. | Start with main house couch, main house room plate and light masks, upstairs layout plate, and complete garage vehicle state set. |

Update Lived in activity object pass row with:

| Lived in activity object pass | NEEDS_TESTING | `src/world.js`, `src/config.js`, `src/renderObjects.js`, `src/requestedVisualCorrections.js`, `src/visualReplacementClears.js` | Corrected overlays exist for several requested objects. Clear plates now prevent known corrected overlays from visibly stacking over old procedural objects. This is not final asset quality. | Test couch, fridge, coffee maker, dining set, stairs, upstairs closet, and bathroom sink for duplicate visual remnants. |

Add risk row:

| Visual replacement clear plates | Medium | Can hide old procedural artifacts but may flatten floor texture until final PNG plates exist. | Keep clear plates temporary, use them only before corrected overlays, and replace with real room/object PNGs as soon as audited assets are ready. |

## Test scenarios to add

| Scenario | Priority | Status | Exact test |
|---|---|---|---|
| Time of day lighting | Critical | NEEDS_TESTING | Test 6 AM, noon, 6 PM, and night on every floor. Confirm lighting direction and mood change without hiding click targets. |
| Old/new overlay cleanup | Critical | NEEDS_TESTING | Inspect couch, fridge, dining table, coffee maker, bathroom sinks, stairs, and upstairs closet. Confirm old procedural remnants are not visibly fighting the corrected overlay. |
| Anime visual standard gate | Critical | NEEDS_TESTING | Reject any new runtime object that does not pass true top down, object scale, lighting source, PNG path, and complete state coverage requirements. |
