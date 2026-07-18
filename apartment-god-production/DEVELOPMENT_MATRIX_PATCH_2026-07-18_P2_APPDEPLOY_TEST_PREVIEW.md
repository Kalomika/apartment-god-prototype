# Development Matrix Patch, P2 AppDeploy Test Preview

Date: 2026-07-18
Branch: phaser-migration-2
Status: APPDEPLOY_TEST_READY
Canonical merge pending: yes

| System | Status | Implementation | Required test |
|---|---|---|---|
| Native P2 AppDeploy preview | APPDEPLOY_TEST_READY | Temporary isolated preview is live at `https://31e6d4932a52c800f3.v2.appdeploy.ai/`, pinned to native P2 runtime commit `c8941bbe16e5725ad02eb20596ee5a07868303b8`. Main and Render remain unchanged. | Kam must test the complete gameplay and visual checklist in the browser. |
| Phaser module portability | VERIFIED_BY_AUTOMATION | P2 loads the generated local `../vendor/phaser.esm.js` when available and falls back to pinned Phaser 3.90.0 from jsDelivr for static preview hosting. The old origin-root import is prohibited by regression tests. | Confirm no boot recovery screen in the AppDeploy preview. |
| AppDeploy desktop shell | TESTED | AppDeploy E2E passed launcher visibility, live game canvas, and isolation notice. | Inspect actual gameplay scale and interactions. |
| AppDeploy mobile shell | TESTED | AppDeploy E2E passed mobile viewport fit without page scrolling. | Test touch selection, phone scrolling, menus, movement, and orientation on Kam's device. |
| Preview reload guardrail | TESTED | Reloading the embedded P2 frame leaves the launcher and isolation notice intact. | Confirm save and refresh state behave correctly across reloads. |
| Native gameplay parity | NEEDS_BROWSER_TESTING | Automated P2 gameplay parity, tests, and build pass. Preview is now available for direct review. | Test every floor, yard, driveway, vehicles, gate, offsite, arcade, basketball, pool, careers, saves, autonomy, cooking, bathroom, sleep, and dog systems. |
| Native visual parity | NEEDS_VISUAL_REVIEW | Generic room panels, category object sprites, and first-pass activity states remain temporary. | Record missing objects, incorrect layout, depth, scale, direction, animation, and visual quality issues from the preview. |

Promotion rule:
Do not update main or Render from this preview automatically. Keep `phaser-migration-2` as the correction branch until Kam approves gameplay parity, mobile usability, character and dog scale, object alignment, activity animation, and visual stability.
