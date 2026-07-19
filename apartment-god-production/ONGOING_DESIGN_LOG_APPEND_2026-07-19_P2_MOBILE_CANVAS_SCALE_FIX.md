## 2026-07-19, P2 Mobile Canvas Scale Fix

Status: NEEDS_USER_BROWSER_CONFIRMATION
Branch: phaser-migration-2
Runtime commit: 1b5667d3bb8f2a8056e5c41f9e968bbc96bc9a14
Test commit: 27cbff72a6969baac89b450c73a2d73ce3975561
Verification commit: 54a7d5bf9bab3577af2e625bc744971e9ec4a2fe
Files changed: src/phaserMigration2Runtime.js, tests/phaser-migration-2-mobile-canvas-scale.test.js, .github/workflows/p2-mobile-canvas-scale-verify.yml, automated verification record, matrix patch and this log append
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-2-before-mobile-canvas-scale-fix-2026-07-19
AppDeploy preview: https://31e6d4932a52c800f3.v2.appdeploy.ai/

Summary:
Kam's second Android screenshot confirmed that the restored money, utilities and navigation controls were present, but the actual Phaser world was compressed into a thin strip at the bottom of a mostly empty gameplay region. The prior automated mobile test was too weak because it checked control presence and the outer 4 by 3 region without verifying that the native Phaser scene filled that region.

Root cause:
The responsive page and Phaser Scale Manager were both attempting to own display sizing. src/fit.js calculated the mobile 4 by 3 canvas box, then Phaser.Scale.FIT with Phaser.Scale.CENTER_BOTH could recalculate and reposition the same canvas from the parent dimensions available during iframe startup. In AppDeploy's nested mobile iframe, that produced a small centered Phaser display surface inside a later-expanded game wrapper. The dark wrapper remained full size while the real world rendered only near the bottom.

Implementation details:
- Changed native P2 from Phaser.Scale.FIT to Phaser.Scale.NONE.
- Changed auto centering from Phaser.Scale.CENTER_BOTH to Phaser.Scale.NO_CENTER.
- Kept the internal game coordinate space at PLAY_W by PLAY_H, 960 by 720.
- Left responsive CSS display sizing to src/fit.js only.
- Preserved all gameplay coordinates, click conversion, rooms, objects, actors, actions, autonomy, saves, economy, utilities, phone and camera navigation systems.
- Added a regression test forbidding FIT and CENTER_BOTH in the native P2 runtime and requiring the responsive 4 by 3 fit.
- Strengthened the AppDeploy mobile test to require the Phaser status line near the top and rooms, objects and actors across most of the canvas height. A thin strip can no longer satisfy the written acceptance criteria.

Testing performed:
- Automated repository workflow passed repository checks.
- Unit tests passed, including the new mobile canvas scale regression test.
- Static build passed.
- Built runtime was inspected for Scale.NONE and NO_CENTER.
- Legacy drawPhaserEnvironment renderer remains absent.
- textures.addCanvas offscreen frame bridge remains absent.
- AppDeploy was updated to verified commit 54a7d5bf9bab3577af2e625bc744971e9ec4a2fe.
- AppDeploy reached READY and passed 3 of 3 E2E tests with no reported frontend or backend errors.

Testing requested:
Hard refresh https://31e6d4932a52c800f3.v2.appdeploy.ai/ and reopen full screen. Confirm the Phaser status line now appears near the top of the gameplay canvas, the house or selected floor fills the 4 by 3 region vertically instead of occupying a thin bottom strip, object taps still align, and money, utilities, Up, Down, Phone and Map remain accessible.

Known risks:
The Android browser screenshot remains the authoritative test because nested browser and iframe viewport behavior can differ from automated desktop emulation. The PWA install banner visible in the screenshot is browser or AppDeploy platform UI, not Apartment God HUD code, and may need to be dismissed with its close control while testing the lower HUD.

Follow ups:
Use the next Android screenshot to correct only any remaining device-specific sizing or control placement. Do not alter main or Render without explicit authorization.
