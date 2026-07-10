# Top Shot Development Log

## 2026-06-28, v0.1 branch setup

Created branch `top-shot-v0-1` inside `Kalomika/apartment-god-prototype` because the GitHub connector in this chat can create branches and files but does not expose a create-new-repository action. Top Shot is isolated under `top-shot/` so it will not break the existing Apartment God prototype.

## Current implementation target

Build a one-floor AI versus AI prototype that proves the core watchable fight loop: two fighters spawn, perceive each other, move through an arena with cover, choose ranged or close combat, dodge, block, counter, take damage, use stamina, and finish by extraction or incapacitation.

## Files created

- `top-shot/README.md`, project overview, run commands, Render notes.
- `top-shot/docs/design-log.md`, sequential capture of Kam's mechanics and future creator ideas.
- `top-shot/docs/dev-log.md`, working notes for future AI/developers.
- `top-shot/index.html`, browser shell.
- `top-shot/styles.css`, basic dark UI.
- `top-shot/package.json`, start/build/check/smoke scripts.
- `top-shot/render.yaml`, static Render Blueprint.
- `top-shot/scripts/*`, local dev, build, and syntax check scripts.
- `top-shot/src/*`, game modules.
- `top-shot/tests/simSmoke.js`, non-browser simulation smoke test.

## Important constraints

- No direct character control.
- The player is a coach/commander.
- Player actions are support drops and extraction.
- Combat should read physically: segmented limbs, recoil, dodges, blocks, throws, and damage stages.
- Default archetypes are only test stand-ins. The future is a creator where players build custom styles and weapons.

## Known v0.1 limitations

- Multiplayer is not implemented.
- Character creator is not implemented yet.
- Injury persistence after battles is documented but not saved across sessions yet.
- Two-floor arenas are not implemented yet.
- Breakable objects are stubbed in the arena structure, with full shatter and debris-as-projectile planned next.
- Projectile retrieval is only partly represented in current data flow and should be expanded.
- The initial AI is intentionally broad and simple so the prototype has room to grow.
