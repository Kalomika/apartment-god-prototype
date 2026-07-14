# Development Matrix Patch: Direction TV Desktop Tidiness Dog Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-direction-tv-desktop-tidiness-fix-2026-07-13

## Matrix rows to merge during next safe documentation sync

| System | Status | Files | Current state | Required test |
|---|---|---|---|---|
| Directional entity rendering | NEEDS_BROWSER_CONFIRMATION | `src/renderEntitiesTopDown.js`, `src/rendering.js` | Added stricter top-down entity renderer. Movement direction resolves from the active path vector, so south/down should not reuse the north/back silhouette. | Walk north, south, east, west, and diagonals. Confirm no backward moonwalk when moving down. |
| Character visual angle | PARTIAL | `src/renderEntitiesTopDown.js` | First runtime pass makes humans more compact/top-down than the prior side-view style. Final PNG directional sprites still required. | Compare actors against top-down rooms and confirm they no longer read as side-scroller bodies as strongly. |
| Dog sprite quality | PARTIAL_NEEDS_BROWSER_CONFIRMATION | `assets/sprites/characters/dog/top_down_dog_atlas.svg`, `src/renderEntitiesTopDown.js` | Added an asset-backed four-direction dog atlas with ears, head, snout, body, four legs, collar, markings, and tail. Runtime now draws dog from this atlas instead of procedural dog body shapes. | Confirm dog appears in main floor pet nook and while moving. Confirm it reads like a dog and not a blob. |
| Living room TV light | NEEDS_BROWSER_CONFIRMATION | `src/mainFloorLayoutPolish.js` | TV beam now requires an actual watcher near the living room TV and should not turn on from stale action text elsewhere. | Leave nobody watching TV and confirm beam stays off. Start TV/watch action and confirm beam appears. |
| Loose book/clutter readability | NEEDS_BROWSER_CONFIRMATION | `src/bookRender.js` | Removed the noisy loose-book label and redrew loose books as cleaner small objects so they no longer read like random wall labels/glitches. | Read and interrupt/leave a book, then inspect the room. Confirm it reads as a book, not a bug. |
| Desktop utility controls | NEEDS_BROWSER_CONFIRMATION | `styles.css` | Wide desktop/landscape layout now uses a vertical utility/control bar between the canvas and HUD instead of horizontal hidden scroller. Mobile portrait remains horizontal. | Test desktop browser and mobile. Desktop controls should be vertical and visible. Mobile should keep bottom controls. |
| House tidiness multiplier | PARTIAL_NEEDS_BROWSER_CONFIRMATION | `src/tidinessSystem.js`, `src/state.js`, `src/canvasRuntime.js`, `src/rendering.js` | House tidiness score and activity reward multiplier are active. Positive need gains scale by tidiness multiplier. Status bar shows tidy score. | Create mess/clean mess and confirm tidy score changes. Compare positive gains when tidy versus untidy. |

## Planned rows created or reaffirmed

| System | Status | Notes |
|---|---|---|
| Final PNG dog atlas and animation set | PLANNED | SVG atlas is a first runtime asset pass. Final dog PNGs, frame manifest, and animation states remain required. |
| Full human top-down PNG sprite pipeline | PLANNED | Runtime renderer is a bridge. Final true top-down directional human sprites remain required. |
| Full tidiness autonomy and relationship system | PLANNED | Tidy priority, auto-clean pressure, partner annoyance, delayed cleanup, and room-specific mood effects still need a dedicated pass. |
