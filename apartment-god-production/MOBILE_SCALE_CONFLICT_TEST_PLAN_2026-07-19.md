# Mobile Scale Conflict Test Plan

Branch: work/mobile-scale-conflict-fix-2026-07-19
Status: NEEDS_TESTING

Automated checks:
- Repository checks
- Unit tests
- Static build
- Phaser vendor output
- Phaser entry point

Android Render checks after explicit main update:
1. Hard refresh the Render URL.
2. Confirm the complete floor fills the game area from top to bottom.
3. Confirm there is no large black blank region between the date pill and the floor.
4. Confirm the control bar starts below the full game scene.
5. Tap objects at the top, center, and bottom of the floor to verify pointer alignment.
6. Rotate portrait to landscape and back.
7. Confirm the scene remains aligned after returning from background.
