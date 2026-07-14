# Ongoing Design Log Append: Phaser Bridge Direct Canvas Fix

## 2026-07-14, Phaser Bridge Direct Canvas Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render playable branch updated: pending main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-phaser-bridge-direct-canvas-fix-2026-07-14

## Live failure

Kam tested the Phaser-hosted bridge and the play canvas was blank while the HUD still loaded. This proves the Phaser host scene and UI state were present, but the old CanvasTexture bridge was not painting the current game frame onto the visible Phaser canvas.

## Kam correction

Kam asked to fix the problem, not just revert.

## Implementation details

- Kept `src/main.js` booting the Phaser runtime.
- Reworked `src/phaserRuntime.js` so Phaser remains the runtime host.
- Removed reliance on the Phaser CanvasTexture frame bridge for the visible frame.
- Phaser now owns the update loop, background tick, input dispatch, state, simulation, UI refresh, and recovery path.
- The current game frame is drawn directly to the Phaser-owned canvas context on Phaser's post-render event.
- This avoids the blank-frame failure where Phaser booted but the texture image never appeared.
- Emergency fallback to `bootCanvasGame()` remains only for scene creation or host boot failure.

## What this is

This is still a Phaser-hosted transitional bridge, but now the rendered frame is written directly to the visible Phaser canvas after Phaser clears/renders.

## What this is not

This is not a full revert to the old `bootCanvasGame()` runtime. It keeps Phaser as the host while fixing the blank canvas bridge failure.

## Testing performed

- Verified by code inspection through GitHub fetch/update.
- Browser behavior is not verified from this connector environment.

## Testing requested

Open https://apartment-god-phaser.onrender.com after Render rebuild and hard refresh.

Test:

1. The play canvas should no longer be blank.
2. HUD and game canvas should both update.
3. Tap actors and objects to confirm input still works.
4. Move actors and confirm the static top-down bridge appears.
5. Change floors and confirm the world renders.
6. Watch for console/runtime recovery banners or repeated blanking.

## Known risks

- This is a direct-canvas Phaser bridge, not final Phaser-native layers.
- Browser confirmation is mandatory.
- The next true conversion step is to replace Canvas-drawn world systems with Phaser-native layers one by one after this host is stable.
