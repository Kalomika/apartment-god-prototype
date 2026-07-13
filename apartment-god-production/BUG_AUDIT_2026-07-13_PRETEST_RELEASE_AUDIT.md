# Apartment God Bug Audit: Pre-Test Release Audit

Status: CODE_AUDITED_NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration
Date: 2026-07-13

## Purpose

Run a code-level pre-test release audit before asking Kam to test the Render build again. The goal was to identify and fix code-provable bugs before syncing to main.

## Scope inspected

- Branch state between `main` and `phaser-migration`.
- Recent movement solid egress fix and regression test.
- Suite door, vanity, office, and bookshelf relocation pass from another GPT.
- Book routing after bookshelf moved upstairs.
- Runtime object mutation in `realismCorrectionPass.js`.
- Duplicate visual correction layers that were stacking furniture and overlays.
- Rendering imports and active render stack.
- Soccer aimed kick pass for boot-level defects.
- Blueprint/doorway logic related to the upstairs suite pass.
- After-entity overlays for import/export and obvious crash risk.
- Render house style fallback for import/export and obvious crash risk.

## Bugs found and fixed

### 1. Bookshelf moved upstairs but reading route still used downstairs seats

Finding:
`src/world.js` moved the `bookshelf` to the upstairs office, but `src/bookSystem.js` still always routed reading to the floor 0 living couch or porch chairs. That could send an actor to wrong-floor coordinates after selecting the upstairs book library.

Fix:
`src/bookSystem.js` now chooses reading seats based on the shelf floor. Upstairs bookshelf routes now stay upstairs, preferring the office couch or office desk.

Regression test:
`tests/book-reading-floor-route.test.js`

### 2. Realism correction pass moved upstairs bookshelf into living-room coordinates

Finding:
`src/realismCorrectionPass.js` patched the `bookshelf` to living room coordinates without checking the bookshelf floor. After the suite/office pass moved the bookshelf upstairs, that created a floor 1 object with living-room coordinates and a living-room room tag.

Fix:
`src/realismCorrectionPass.js` now preserves the bookshelf floor. Floor 1 bookshelf stays in the office with office coordinates and label.

Regression test:
`tests/realism-bookshelf-floor.test.js`

### 3. Realism correction pass could skip required runtime object corrections after reload

Finding:
`applyRealismRuntimeCorrections` used `state.realismCorrectionPassVersion` as a skip flag. The objects being patched are module-level world objects, not saved state. A saved state could carry the version flag while the module objects reset to source defaults, causing corrections to be skipped after reload.

Fix:
`applyRealismRuntimeCorrections` is now idempotent and reapplies object corrections every draw instead of skipping based on saved state.

Regression test strengthened:
`tests/realism-bookshelf-floor.test.js`

### 4. Legacy requested visual corrections were stacking with newer correction layers

Finding:
`src/requestedVisualCorrections.js` drew older couch, porch, dining, fridge, coffee, stairs, shower, bed, book, and arcade corrections. The newer `realismCorrectionPass.js` and `visualRegressionFixes.js` also drew several of the same areas. This caused the kind of stacked/ghosted furniture Kam called out.

Fix:
`src/requestedVisualCorrections.js` is now an intentionally inert compatibility layer that keeps the same exports so imports do not break, but does not draw the superseded visuals.

### 5. Visual regression layer duplicated couch and porch after realism pass

Finding:
`src/visualRegressionFixes.js` still redrew the couch and porch after `realismCorrectionPass.js`, causing duplicate visual ownership.

Fix:
`src/visualRegressionFixes.js` now only draws the remaining coffee table patch. Couch and porch are owned by `realismCorrectionPass.js` for this build.

### 6. Movement egress regression test was too weak

Finding:
The earlier movement solid-egress test used the basement couch, but that object is marked enterable and is excluded from `solidObjects`. It did not fully protect the dangerous non-enterable solid trap case.

Fix:
`tests/movement-solid-egress.test.js` now uses `game_console`, a non-enterable solid object, to test that a bad activity placement inside a solid can route outward instead of staying blocked.

## Inspected with no additional code-provable bugs found

- `src/blueprint.js`: upstairs door graph from the suite pass appears connected by code inspection.
- `src/afterEntityOverlays.js`: exports and referenced helpers are present. No missing import/export crash found.
- `src/renderHouseStyle.js`: exports are present and suite/vanity fallback code has no missing function reference found by inspection.
- `src/soccerSystem.js`: no boot-level undefined reference found after the aimed kick pass.
- `src/rendering.js`: active imports resolved by file inspection, and `drawStatus` remains defined.

## Not performed

- No local `npm test` run was available in this connector environment.
- No browser automation or Render runtime execution was performed in this connector environment.

## Release recommendation

After the fixes above, no further code-provable bugs were found in the changed runtime files inspected during this pass. The build should be synced to `main` after creating a current main backup so Render can rebuild from the audited head.

Browser testing is still needed to confirm visual behavior and live interaction timing, but this audit does not knowingly hand off any unfixed code-level bug found in the inspected files.
