# Development Matrix — Claude Patch 2026-07-23 — Modular Character Foundation

> Matrix patch. Canonical `DEVELOPMENT_MATRIX.md` frozen at 2026-07-13. **Canonical merge pending: yes.**
> Nothing here is marked implemented/complete; runtime integration has NOT happened.

- **Branch:** `claude/true-topdown-20260723` (base `phaser-migration@3e87220`).
- **Backup:** `backup/phaser-migration-pre-claude-character-system-20260723` (created + pushed).

## Control-board entries

| Item | Status | Notes |
|---|---|---|
| Visual target + pose reference library | COMMITTED (docs) | `apartment-god-production/reference/visual_targets/` — activity-adjacent taxonomy + README + licensing caveat. Reference only, not runtime assets. |
| Modular character system (swappable body/hair/top/bottom/shoes/skin) | COMMITTED — NEEDS_REVIEW | `src/character/modularCharacter.js`. Pure SVG generation, 4 dirs, 5 pose states, safe fallbacks. First-pass art. |
| Character Lab preview | COMMITTED — proving slice | `character-lab.html` + `src/characterLab.js`. Standalone; renders dirs×poses + wardrobe swaps. NOT in game runtime. |
| Integration into `phaserParityRuntime.js` | NOT STARTED | Deliberately deferred until art baseline approved; will go behind a safe fallback. |
| Isometric sibling branch `claude/iso-20260723` | PLANNED | Port after true-topdown foundation reviewed. |
| Full pose set (yoga/cook/guitar/read/shower) | PLANNED | Author from `reference/visual_targets/character_poses/`. |
| Dog/pet modular pass | PLANNED | From `reference/visual_targets/pets/`. |

## Standing directives added 2026-07-23 (were missing from the matrix)

| Directive | Status |
|---|---|
| **8 directions** for ALL characters (current + future) | DIRECTIVE — implemented in character system, NEEDS_REVIEW |
| **Faceless** sprites (facial hair only) | DIRECTIVE — implemented |
| **Fire Pro-style deep layering** (every part swappable) | DIRECTIVE — foundation implemented, deeper per-segment articulation roadmapped |
| **Always-present base body layer** (never nude; male briefs+socks / female two-piece) | DIRECTIVE — implemented |
| Nudity handling: implied-only, steam/towel/blur/covered dressing | DIRECTIVE — logged, runtime handling TBD |
| Render modes: color / noir / B&W outline | color+noir OK; lineart = rough concept, NEEDS_REFINEMENT |
| Two interpretation branches (true-topdown + iso) | true-topdown built; iso PLANNED next |

## Cross-build note
Targets the single live build via a NEW isolated module; live boot path unchanged. No duplicate/parallel
runtime system created. No `main`, Render, or `ai-rpg-engine` involvement.

**Status language:** committed + rendered in an isolated lab (headless browser, 0 errors); NOT yet
integrated, NOT browser-tested in-game, NOT Render-tested.
