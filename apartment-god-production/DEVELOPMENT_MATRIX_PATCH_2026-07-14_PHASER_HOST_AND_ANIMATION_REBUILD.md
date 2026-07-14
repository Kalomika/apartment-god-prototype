# Development Matrix Patch: Phaser Host And Animation Rebuild

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-full-phaser-conversion-2026-07-14

## Matrix rows to merge during next safe documentation sync

| System | Status | Files | Current state | Required test |
|---|---|---|---|---|
| Phaser runtime host | NEEDS_BROWSER_CONFIRMATION | `src/main.js`, `src/phaserRuntime.js` | Active entry now boots Phaser. Phaser owns the runtime loop and displays the current Canvas frame through a Phaser CanvasTexture bridge. Emergency fallback to Canvas remains if Phaser scene fails. | Browser boot test on Render. Confirm no blank screen, HUD works, input works, simulation advances. |
| Canvas-to-Phaser bridge | PARTIAL | `src/phaserRuntime.js`, `src/rendering.js` | World rendering is still Canvas drawing, but now hosted inside Phaser as a transitional texture. This keeps playability while the native Phaser layer conversion proceeds. | Test frame refresh, camera transitions, menus, controls, hidden tab progression, save/load. |
| Static top-down human character bridge | NEEDS_BROWSER_CONFIRMATION | `src/renderEntities.js` | Old broad procedural animation stack is no longer the visual target. Humans now use a static true top-down bridge focused on top of head, shoulders, compact body mass, and temporary activity props. Sliding is accepted at this stage. | Move actors and confirm they read top-down, not side-view, crawling, or swimming. |
| Old human animation system | REJECTED_AS_TARGET | `src/renderEntities.js`, Idea Bible append | Do not keep polishing the old procedural human look. It is only historical context. Future work must rebuild animations stage by stage. | Do not add broad patches to restore old procedural poses unless Kam explicitly asks for a temporary bridge. |
| Animation approval ladder | ACTIVE | `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-14_ANIMATION_REBUILD_APPROVAL_LADDER.md` | Build order is static top-down look, then walk cycle, then sitting, then activity states. Each stage needs approval before the next stage. | After static look browser review, create isolated walk-cycle pass. |
| Dog asset bridge | NEEDS_BROWSER_CONFIRMATION | `src/dogSpriteOverlay.js`, `assets/sprites/characters/dog/top_down_dog_atlas.svg` | Dog remains asset-backed through overlay while human system is rebuilt separately. | Confirm dog remains visible and not fully reverted to blob. |

## Planned follow ups

| System | Status | Notes |
|---|---|---|
| Phaser-native room/object layers | PLANNED | Replace Canvas world draw with Phaser layers only after Phaser host bridge is verified. |
| Phaser-native actor sprites | PLANNED | Replace static Canvas top-down bridge with real Phaser sprites and PNG atlas manifest after static look approval. |
| Walk cycle | PLANNED | First approved animation stage after static top-down look is accepted. |
| Sitting poses | PLANNED | Second approved animation stage after walk cycle acceptance. |
| Activity-specific animations | PLANNED | Bed, shower, toilet, eating, computer, arcade, soccer, pool, workout, dog care, vehicle entry should each be separate approved passes. |
