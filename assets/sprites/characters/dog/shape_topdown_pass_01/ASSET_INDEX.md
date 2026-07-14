# Dog Shape Top-Down Pass 01

Status: runtime integrated through `src/dogSpriteOverlay.js`

This pass upgrades the in-game dog with a shape-built true top-down renderer. The renderer owns idle, walk, run, sit, lie, curled sleep, play bow, bark/react, eat, drink, fetch carry, happy, alert, and sad state logic.

## Runtime file

- `src/dogSpriteOverlay.js`

## Current implementation

The dog is drawn from shape sprite logic at runtime so it can respond immediately to game state without waiting on the older SVG atlas. The local PNG sheet and frame cutouts were generated in the work environment for this pass, but this commit integrates the upgraded dog into the live renderer rather than leaving the asset work as a detached folder.

## Visual rules

- true top-down body logic
- shape-built forms
- readable at mobile game scale
- no old crawling/swimming human renderer dependency
- dog-specific idle, movement, rest, fetch, eat, drink, bark, and emotion poses

## Follow-up

A later binary asset pass should replace the runtime shape renderer with separate transparent PNG files or a PNG atlas once the GitHub binary upload path is available in the active agent environment.