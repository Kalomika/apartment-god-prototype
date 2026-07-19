## 2026-07-19, P2 Mobile Gameplay Parity Repair Start

Status: PLANNED
Branch: phaser-migration-2
Commit: pending
Files changed: this start log only
Runtime files changed: no
Render playable branch updated: no
Backup branch: backup/phaser-migration-2-before-mobile-gameplay-parity-repair-2026-07-19

Summary:
Kam reported that the isolated P2 visual completion build does not expose the previously implemented money, phone and utility controls, vertical Up and Down navigation, or a correctly fitted mobile gameplay viewport. The upstairs screenshot also shows excessive empty letterbox space and visually disconnected room sections.

Implementation details:
- Cross-check the last verified pre-visual P2 runtime commit c8941bbe16e5725ad02eb20596ee5a07868303b8 against the visual completion runtime.
- Restore native P2 calls to the existing phone and camera navigation UI synchronization that the prior Canvas render loop used to provide.
- Restore always-visible mobile Up and Down navigation, phone access, map and locator access, money and utility status.
- Replace the fixed 50vh portrait fit with a source-level 4:3 gameplay viewport fit that removes unused vertical letterbox space.
- Repair visual architecture treatment so room boundaries remain connected to the existing house plan instead of reading as separated floating sections.
- Preserve synchronized gameplay systems, object coordinates, routes, click targets, native Phaser ownership and improved object art.

Testing performed:
Code inspection confirmed the gameplay functions still exist in ui.js and phoneUI.js, but native P2 does not call syncPhoneUi or syncCameraNavigationUi. Code inspection also confirmed fit.js forces a centered 50vh portrait wrapper, creating unnecessary blank space.

Testing requested:
After implementation and isolated preview update, test money visibility, phone, utilities, Up, Down, map, household locator, every floor, portrait fit, landscape fit, object interactions and saved gameplay state.

Known risks:
This is a playability and mobile layout repair. It must not alter main, Render settings, world coordinates, save format or protected repositories.

Follow ups:
Implement in small auditable source changes, run checks, tests and build, then update only the isolated AppDeploy preview.
