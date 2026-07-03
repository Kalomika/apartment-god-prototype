# Daily Build Log

## 2026-07-03

Daily build branch: `apartment-god-daily-build-2026-07-03`.

Repo files studied:

- `README.md` confirms this is a standalone browser life-sim prototype, separate from `Kalomika/ai-rpg-engine`, with click-to-move, two humans, one dog, needs, time, floor switching, dog wandering, and contextual object actions.
- `src/main.js` shows the runtime loop creates state, updates movement, resolves arrivals, runs actions and autonomy, advances time, then draws every frame.
- `src/rendering.js` confirms entity drawing is routed through `src/renderEntities.js` after world, objects, dynamic props, and fetch ball drawing.
- `src/renderEntities.js` was the active sprite fallback file and still had color-dependent cyberpunk fills and continuous rotation.
- `src/state.js` defines resident, girlfriend, and dog entities and current needs, movement, pose, action, skill, and trait fields.
- `scripts/check.js` syntax-checks every file in `src/` with `node --check`.
- `scripts/build.js` copies `index.html`, `styles.css`, and `src` into `dist/` and `Dist/`.

Reference library status:

- Tried to locate `apartment-god-production/00_ART_BIBLE/VISUAL_STYLE_GUIDE.md` on `main`, but it was not present on the active branch.
- The new manifest now records the intended source of truth as `apartment-god-production/REFERENCE_LIBRARY/`, `apartment-god-production/00_ART_BIBLE/`, the human top-down linework references, and the dog references. That keeps the next pass tied to the approved library instead of inventing a new look.

Online research studied:

- Top-down sprite work should keep direction, state, frame timing, anchor point, and collision footprint separate so animation can change without breaking movement.
- Recent AI sprite pipeline research reinforces the need for reliable masks and transparent sprite boundaries before any skeleton or mesh system is trusted.
- Current life-sim discussion around The Sims points back to clear moment-to-moment needs and visible player-readable autonomy instead of hidden long-range AI planning.
- Retro action games and beat 'em ups remain useful for practical lessons around readable silhouettes, directional facing, simple collision volumes, and small animation sets that feel responsive.

Implemented today:

- Updated `src/renderEntities.js` so the procedural entity fallback now reads closer to black line art on white paper instead of color-dependent filled sprites.
- Quantized runtime facing to eight directions: down, down-right, right, up-right, up, up-left, left, and down-left.
- Preserved idle and walk timing for male resident, female resident, and dog.
- Removed the runtime text labels that were printed on the character bodies.
- Added `apartment-god-production/SPRITE_ASSET_MANIFEST.json` to lock the required male, female, and dog sprite states before PNG atlas work continues.

Build/test result:

- Could not run `npm install`, `npm run check`, or `npm run build` locally because this automation environment could not clone the repository through the container. The repo’s own scripts indicate the intended checks are `npm run check` and `npm run build`.
- The updated JavaScript was written as a direct replacement of the existing module and avoids new dependencies.

What still blocks perfection:

- The approved reference library and art bible are not visible on `main` through the available GitHub file reads, so the actual PNG generation pass should first merge or restore the reference library files onto the active production branch.
- The current entity art is still a procedural fallback, not a real PNG atlas.
- No Render deploy was triggered and Render settings were not changed.

Next target:

- Restore or merge the approved `REFERENCE_LIBRARY` and `00_ART_BIBLE` files into the active branch if they exist on another branch.
- Create the first real transparent PNG atlas for the dog or male resident, using eight directions with idle and walk frames.
- Add runtime atlas loading behind the current procedural fallback.

## 2026-07-02

First manual build run on branch `daily-sprite-pass`.

Studied repo entry points:

- `src/main.js` creates state, updates movement, actions, autonomy, and draws each frame.
- `src/rendering.js` sends entity drawing through `src/renderEntities.js`.
- `scripts/check.js` syntax-checks every JavaScript file in `src/`.
- `scripts/build.js` copies the static app into `dist/` and `Dist/`.

Studied online:

- GitHub flow favors safe branch work before default-branch merge.
- Canvas games need sprite-like internal object representation for better visual testing.
- The next sprite pipeline should use locked manifests, reference-constrained PNG sheets, and procedural fallbacks until final PNGs are committed.

Implemented today:

- Replaced rudimentary person and dog drawing with a top-down runtime sprite pass in `src/renderEntities.js`.
- Added directional facing from velocity or movement target.
- Added simple 4-step walk cycling for humans and dog.
- Added more adult body proportions, top-down head and hair masses, linework, cyberpunk accent strips, and a white dog fallback.

Next target:

- Add a formal sprite manifest for male, female, and dog states.
- Move toward actual PNG sheet generation and runtime loading.
- Add state-specific anchors for idle, walk, sit, sleep, pet, train, and fetch.
