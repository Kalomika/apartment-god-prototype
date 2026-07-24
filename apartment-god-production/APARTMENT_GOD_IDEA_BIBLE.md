# Apartment God Idea Bible

Status: ACTIVE CANONICAL INDEX
Restored: 2026-07-21

This file is the canonical searchable index for Apartment God directives. Historical directives remain preserved in dated `IDEA_BIBLE_APPEND_*.md` files under `apartment-god-production/`. Do not delete or silently rewrite those append files.

## Current Nonnegotiable Direction

- Apartment God is a true top down 2D life simulation game.
- The active development branch is `phaser-migration`.
- `main` is the Render playable branch and must not be force moved or updated without the required backup, checks, and user authorization.
- Keep the game playable before deepening the renderer.
- Do not replace working systems with broad placeholders or unfamiliar generic code.
- New visual work must use the reference archive and the true top down visual rules.

## Character Quality and Outfit Direction

- Characters must reach the mature, polished sprite quality represented by the approved references and current user supplied target sheet.
- Human movement requires eight directions: north, northeast, east, southeast, south, southwest, west, and northwest.
- Every direction needs a real walk cycle at the intended anime timing, currently targeted around 8 FPS.
- Do not fake final activity animation by rotating, squashing, or stretching generic walk frames.
- Character rendering must support modular outfit changes. Body, hair, top, bottom, shoes, outerwear, and accessories should be compatible animation layers or equivalent synchronized atlas parts.
- Outfit changes must preserve direction, frame timing, body alignment, and activity state.
- Toon rendering should not depend on black outlines. Color, value, material, and lighting separation should define forms.
- Activity states need their own pose and animation planning, including entry, loop, exit, object alignment, and safe fallback.

## Current Character Limitation

The Phaser parity branch currently uses four generic walk frames in four cardinal directions for each resident profile. This is a temporary playable fallback and does not satisfy the final eight direction modular outfit standard.

## Active Audit Directives

- Prevent duplicate Phaser scene timers, global listeners, and stale swipe handlers after scene shutdown or restart.
- Keep visible object art and collision geometry synchronized.
- Preserve the active object while a timed activity is running so stationary characters face the object they are using.
- Clear stale activity IDs when an activity ends or travel replaces it.
- Activity progress must move even when older saves do not contain `actionTotal`.
- Old saves must merge with current defaults instead of deleting newly added systems, entities, nested fields, or world objects.
- Preserve correct vehicle and offsite cleanup. Do not rewrite it without a verified regression.

## Historical Append Files

At minimum, consult all matching files in `apartment-god-production/`, including:

- `IDEA_BIBLE_APPEND_2026-07-19_MOBILE_SCALE_CONFLICT.md`
- `IDEA_BIBLE_APPEND_2026-07-19_RENDER_PHASER_CHARACTER_PRIORITY.md` when reviewing repair PR 33
- any newer `IDEA_BIBLE_APPEND_*.md` file present on the active branch

Future agents must update this canonical index when a new directive changes project law, while keeping detailed dated evidence in an append file.
