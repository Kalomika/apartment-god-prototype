# Development Matrix Patch: Dog Shape Runtime Upgrade

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no

## Matrix rows to merge during next safe documentation sync

| System | Status | Files | Current state | Required test |
|---|---|---|---|---|
| Dog renderer | NEEDS_BROWSER_CONFIRMATION | `src/dogSpriteOverlay.js` | Dog now uses a shape-built top-down renderer with dog-specific state logic instead of depending on the old fallback atlas look. | Check dog idle, walking direction, fetch/ball state, eating/drinking, rest/sleep if triggered. |
| Dog final PNG asset pass | PLANNED | `assets/sprites/characters/dog/shape_topdown_pass_01/` | Manifest and index added for the shape-based pass. Final binary transparent PNG frame files remain a future binary asset pipeline task. | Commit and wire actual PNG frames or atlas once binary upload tooling is available in the active environment. |

## Notes

This pass prioritizes visible live-game dog upgrade and state logic. It does not touch human renderer or gameplay movement systems.
