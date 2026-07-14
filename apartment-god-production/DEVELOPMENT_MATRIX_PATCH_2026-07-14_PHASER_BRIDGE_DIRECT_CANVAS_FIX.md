# Development Matrix Patch: Phaser Bridge Direct Canvas Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-phaser-bridge-direct-canvas-fix-2026-07-14

## Matrix rows to merge during next safe documentation sync

| System | Status | Files | Current state | Required test |
|---|---|---|---|---|
| Phaser runtime host blank canvas fix | NEEDS_BROWSER_CONFIRMATION | `src/phaserRuntime.js`, `src/main.js` | Phaser remains the active runtime host. The visible game frame is now drawn directly to the Phaser-owned canvas context after Phaser post-render instead of depending on a CanvasTexture image that produced a blank play canvas. | Browser test on Render. Confirm the play canvas shows the house and not a black panel while HUD loads. |
| Phaser direct canvas bridge | PARTIAL | `src/phaserRuntime.js`, `src/rendering.js` | Phaser owns update/input/background tick/UI refresh while legacy draw systems still render the frame directly to the Phaser canvas. | Test movement, menus, floor navigation, pause/speed/save/load, and hidden tab progression. |
| Emergency Canvas fallback | SAFETY | `src/phaserRuntime.js`, `src/canvasRuntime.js` | Canvas fallback remains only for boot/scene failure. It is not the primary runtime path. | Confirm no fallback blanking, and if Phaser scene fails, HUD does not leave a dead canvas. |

## Follow ups

| System | Status | Notes |
|---|---|---|
| Phaser-native layer replacement | PLANNED | After host is confirmed visible, migrate rooms, objects, actors, lighting, UI, and sprite manifests into Phaser-native layers one system at a time. |
