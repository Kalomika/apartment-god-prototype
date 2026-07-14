# Black Screen Investigation, 2026-07-14

## Status

PATCHING

## Symptom

Mobile Render screenshot shows the Apartment God HUD/UI still rendering, but the main playfield is black. The selected resident UI still updates, which means the app shell is not fully dead. The failure appears to be in the game canvas render path or host bridge rather than a total page load failure.

## Repository state checked

- `main` and `phaser-migration` were identical at the last checked dog scale/direction fix head.
- The latest visible commits were dog scale/direction fixes, not evidence of a new concurrent rebuild after the user reported the black screen.

## Key finding

`src/main.js` now boots through `bootPhaserGame()` from `src/phaserRuntime.js`.

The visible symptom is consistent with the Phaser hosted canvas bridge failing to display the rendered frame while the surrounding HTML UI still works. This is too risky for the Render playable branch while Phaser migration remains unstable.

## Immediate safety action

Return the live boot path to the stable Canvas runtime by changing `src/main.js` to boot `bootCanvasGame()` directly.

This does not delete Phaser runtime files. It only stops the live playable branch from using the unstable Phaser host until the bridge has a dedicated browser-tested pass.

## Follow-up

- Keep Phaser migration files for controlled future work.
- Do not route the Render playable through Phaser host again until a browser/mobile boot test proves the playfield renders reliably.
- Add a boot smoke rule: the render link is not acceptable if the HUD loads but the playfield is black.
