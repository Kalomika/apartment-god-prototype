# Daily Build Log

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
