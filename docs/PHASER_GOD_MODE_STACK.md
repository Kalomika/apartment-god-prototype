# Phaser Production Stack

This stack exists to push Apartment God toward a high-quality late 80s / early 90s inspired sprite game while keeping the current top-down life-sim readability.

## Runtime packages

- `phaser`: main 2D game engine, renderer, scene loop, sprites, animations, input, cameras, audio hooks.
- `easystarjs`: future A-star pathfinding for room grids, floor navigation, dog routes, and blocked movement recovery.
- `howler`: stronger audio pipeline when the project needs music, ambience, UI sounds, and apartment activity sound layers beyond the current prototype.
- `seedrandom`: deterministic random choices for routines, visual variation, NPC behavior, and repeatable tests.
- `simplex-noise`: procedural ambience, subtle light flicker, old arcade style screen effects, grime, and weather variations.
- `tinycolor2`: palette discipline, lighting passes, sprite recolor checks, and UI color consistency.
- `zod`: runtime and build-time validation for sprite manifests, animation states, and art metadata.

## Development and quality packages

- `vite`: fast local dev server for Phaser work without replacing the existing Render static build.
- `vitest`: unit tests for simulation, manifest logic, and asset lookup.
- `@playwright/test`: desktop and mobile browser QA, including the 390 x 844 phone viewport.
- `eslint`, `@eslint/js`, `globals`: code quality guardrails.
- `prettier`: formatting consistency.
- `sharp`: PNG optimization, generated atlases, preview sheets, and asset size checks.
- `pngjs`: PNG inspection and validation.
- `pixelmatch`: visual diff tests against reference screenshots.
- `fast-glob`: asset discovery for sprite batches and manifests.
- `chokidar`: asset watch mode for sprite pipeline automation.

## Current scripts

- `npm run check`: JavaScript syntax check plus sprite manifest schema validation.
- `npm run build`: static Render build.
- `npm run dev`: Vite development server.
- `npm run lint`: lint source, scripts, and tests.
- `npm run test`: run Vitest.
- `npm run qa:mobile`: run Playwright mobile smoke test.
- `npm run assets:validate`: validate sprite pipeline manifest.
- `npm run assets:atlas`: build a Phaser-friendly atlas from available sprite PNGs.
- `npm run assets:optimize`: optimize PNGs under `assets/sprites`.

## Art direction boundaries

The target is high-end late 80s / early 90s arcade and 16-bit discipline. This means strong readable silhouettes, deliberate palettes, adult proportions, and detailed top-down interiors.

Reject anything that reads as chibi, mascot, toy, emoji, oversized-head, childlike, blob, or generic programmer art.

## Important production truth

Packages do not create masterful art by themselves. They give the repo the infrastructure to load, validate, test, optimize, and ship masterful sprite art once the sprites are produced. Final quality still depends on actual art direction and real PNG assets.
