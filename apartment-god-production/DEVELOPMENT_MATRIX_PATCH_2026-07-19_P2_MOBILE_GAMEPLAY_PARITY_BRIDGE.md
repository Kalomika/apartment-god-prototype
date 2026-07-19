# Development Matrix Patch, P2 Mobile Gameplay Parity Bridge

Date: 2026-07-19
Branch: phaser-migration-2
Status: NEEDS_USER_BROWSER_CONFIRMATION
Backup: backup/phaser-migration-2-before-mobile-gameplay-parity-repair-2026-07-19
Runtime head tested: ce220672bb54499db0cdf07973794da6b4c6319c

| System | Status | Repair | Required confirmation |
|---|---|---|---|
| Mobile gameplay viewport | TESTED_IN_APPDEPLOY | Portrait display now uses a top-aligned width-derived 4:3 region instead of a centered fixed 50vh wrapper. | Confirm on Kam's Android browser that the large blank band is gone. |
| Money visibility | TESTED_IN_APPDEPLOY | A live money pill and a Money, Utilities and Navigation panel are restored without removing the existing world-state economy output. | Spend and add money and confirm both displays update. |
| Utility visibility | TESTED_IN_APPDEPLOY | Electric bill, tidiness and autonomy are surfaced in the restored utility panel. | Confirm values remain readable while scrolling the HUD. |
| Up and Down navigation | TESTED_IN_APPDEPLOY | Native P2 now runs the existing phone UI synchronizer that creates the vertical Up and Down dock. | Move Upstairs to Main, Main to Basement and Basement to Main. |
| Phone | TESTED_IN_APPDEPLOY | Native P2 runs the existing complete phone UI synchronizer. | Open every phone tab and close it. |
| Map and household locator | TESTED_IN_APPDEPLOY | Native P2 runs the existing camera navigation synchronizer, restoring selected-character, Secret Lab, Map and locator controls. | Open each control and browse the full house. |
| Object orientation | NEEDS_VISUAL_CONFIRMATION | Facing and headboard metadata now rotate visual sprites while display dimensions are swapped to preserve original world footprints and click targets. | Inspect bed, vanity, toilets, couch, television, closets and vehicles. |
| Connected architecture | NEEDS_VISUAL_CONFIRMATION | Room texture inset borders are cropped and one connected straight-wall architecture layer replaces the detached room-island reading. | Inspect Main and Upstairs against the original house plan. |
| Gameplay code parity | VERIFIED_BY_REPOSITORY_TESTS | Existing actions, autonomy, movement, economy, calendar, careers, saves, camera navigation and phone systems remain present. Latest automated run passed 32 suites and 56 tests plus static build. | Perform an end-to-end play session. |
| Native Phaser ownership | VERIFIED_BY_CODE_AND_BUILD | Bridge uses the native Phaser scene, sprites, Graphics and existing DOM UI systems. No legacy Canvas renderer or offscreen Canvas texture bridge was restored. | Confirm native P2 boot banner and interaction behavior. |
