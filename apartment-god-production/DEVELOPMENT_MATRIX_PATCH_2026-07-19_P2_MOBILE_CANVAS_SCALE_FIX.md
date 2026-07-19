# Development Matrix Patch, P2 Mobile Canvas Scale Fix

Date: 2026-07-19
Branch: phaser-migration-2
Status: NEEDS_USER_BROWSER_CONFIRMATION
Backup: backup/phaser-migration-2-before-mobile-canvas-scale-fix-2026-07-19
Runtime commit: 1b5667d3bb8f2a8056e5c41f9e968bbc96bc9a14
Verification commit: 54a7d5bf9bab3577af2e625bc744971e9ec4a2fe

| System | Status | Correction | Required confirmation |
|---|---|---|---|
| Phaser canvas ownership | VERIFIED_BY_CODE_AND_BUILD | Phaser Scale Manager changed from FIT with CENTER_BOTH to NONE with NO_CENTER. Phaser no longer resizes or repositions the canvas after src/fit.js calculates its responsive display box. | Confirm the world occupies the full visible canvas on Android. |
| Internal game coordinates | VERIFIED_BY_CODE_AND_BUILD | Native Phaser remains fixed at 960 by 720. World coordinates, object positions, routes, hit targets and simulation data were not rescaled. | Tap objects near every canvas edge and verify alignment. |
| Portrait playfield | TESTED_IN_APPDEPLOY, NEEDS_DEVICE_CONFIRMATION | The responsive page owns the 4 by 3 display dimensions and top alignment. This specifically targets the screenshot where the world rendered as a thin strip at the bottom. | Confirm status line is near the canvas top and the house fills most of the canvas height. |
| Money and utility overlay | TESTED_IN_APPDEPLOY | Existing restored money and power pills remain in place. | Confirm they do not displace or compress the world. |
| Up and Down navigation | TESTED_IN_APPDEPLOY | Existing controls remain unchanged by the scale correction. | Confirm both controls work and do not cover an incorrectly scaled world. |
| Phone and camera controls | TESTED_IN_APPDEPLOY | Existing Phone, selected resident, Secret Lab, Map and locator controls remain available. | Open each control after the viewport fix. |
| Automated coverage | PASSED | Repository checks, unit tests and static build passed. AppDeploy passed 3 of 3 E2E tests with the strengthened mobile expectation. | Kam's screenshot remains authoritative for visual acceptance. |
| Legacy Canvas renderer | NOT_PRESENT | No drawPhaserEnvironment compatibility renderer was restored. | None. |
| Offscreen Canvas bridge | NOT_PRESENT | No textures.addCanvas frame-upload bridge was restored. | None. |
