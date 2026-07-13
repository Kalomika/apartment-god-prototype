# Development Matrix Patch: Visual State Logic Cleanup

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup manifest:
- apartment-god-production/BACKUP_MANIFEST_2026-07-13_VISUAL_STATE_LOGIC_CLEANUP.md

## Matrix rows to merge during next safe documentation sync

Update Main floor visual cleanup row:

| Main floor visual cleanup | NEEDS_BROWSER_CONFIRMATION | `src/mainFloorLayoutPolish.js`, `src/afterEntityOverlays.js`, `tests/main-floor-layout-polish.test.js` | Added state-based TV glow, pet/robot nook, couch cushion-safe anchor, expanded dining clear zone, chair-back overlay for desk seating, and readable sink/vanity overlays. | Browser test main floor living TV state, couch sit point, dining cleanup, porch/nook, robot/dog items, and bathroom/vanity sinks. |

Update Dog visuals row or add if missing:

| Dog top-down visual identity | NEEDS_BROWSER_CONFIRMATION | `src/afterEntityOverlays.js` | Added top-down dog overlay with four visible legs, collar, head/ears/tail silhouette, and moving leg cycle. This is still a runtime overlay, not final PNG animation. | Browser test idle, walk, dog bed, dog bowl, fetch/ball, and dog bath states. Replace with real PNG sprite sheet. |

Update Sleep/bed activity row:

| Sleep under covers | NEEDS_BROWSER_CONFIRMATION | `src/afterEntityOverlays.js`, `src/renderEntities.js`, `src/realismCorrectionPass.js` | Added after-entity sleep head orientation overlay so heads align east/west with the bed while bodies are under covers. | Browser test both resident and girlfriend sleeping/waking. Confirm heads no longer read rotated 90 degrees from bodies. |

Update UI/object state lighting row:

| TV lighting state | NEEDS_BROWSER_CONFIRMATION | `src/mainFloorLayoutPolish.js`, `src/renderObjects.js` | TV glow cone is now cleared and only redrawn when a person is actively watching TV, sports, movie, or watch action. | Browser test sleeping near TV and watching TV. Glow should be off while sleeping, on while watching. |

Add test scenario:

| Scenario | Priority | Status | Exact test |
|---|---|---|---|
| Visual state logic cleanup | Critical | NEEDS_BROWSER_CONFIRMATION | Test living room TV glow, couch sit point, dining overlap, pet/robot nook, office desk chair layering, upstairs sleep head orientation, dog top-down silhouette, and upstairs vanity sink readability. |
