# Handoff

## Current status

Apartment God Prototype is live, but the codebase needs a modular rebuild before continued feature expansion.

Live URL:

https://apartment-god-prototype.onrender.com

Repo:

Kalomika/apartment-god-prototype

Do not modify:

Kalomika/ai-rpg-engine

## Current issue

The current prototype has too much gameplay, rendering, state, UI, movement, and interaction logic concentrated in `src/main.js`. This made large connector-based patching unreliable. Future work should use real git and smaller modules.

## Current handoff source

Primary issue:

https://github.com/Kalomika/apartment-god-prototype/issues/1

## Known files or cleanup items

- `scripts/build-qol.js` may exist and should be removed if it is still present. It is unused and harmless, but clutter.
- Keep the current static Render build behavior compatible with `dist`.

## Next coding pass

1. Clone the repo using real git.
2. Create a working branch such as `modular-v2`.
3. Confirm backup branch exists or create one from current main.
4. Split `src/main.js` into focused modules.
5. Preserve current gameplay behavior.
6. Add or confirm `npm run check`.
7. Run `npm install`, `npm run check`, and `npm run build`.
8. Commit with a clear message.
9. Update this file and `docs/DEVELOPMENT_LOG.md` before ending.
10. Merge to main only when the build is verified.
11. Confirm the Render site opens.

## Required completion report

Every coding pass should report:

- Branch used
- Commit SHA
- Files changed
- What was implemented
- What was tested
- What failed or was deferred
- Exact next step
- Playable URL if deployed
