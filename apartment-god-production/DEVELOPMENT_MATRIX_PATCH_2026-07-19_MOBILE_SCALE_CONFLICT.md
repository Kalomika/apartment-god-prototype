# Development Matrix Patch, Mobile Scale Conflict

Date: 2026-07-19
Branch: work/mobile-scale-conflict-fix-2026-07-19
Status: NEEDS_TESTING

## Mobile Phaser Playfield

Previous observed result:
- Android portrait screenshot showed a large dark blank area inside game-wrap.
- Only the bottom strip of the 960 by 720 scene was visible above the control bar.
- The date pill and vertical navigation buttons remained at the top while the actual game canvas was pushed downward.

Root cause by code inspection:
- Phaser Scale Manager used FIT plus CENTER_BOTH.
- fit.js also manually sized the same canvas and wrapper.
- Phaser centering margins fought the custom wrapper layout.

Repair:
- game-wrap is now the Phaser scale parent.
- Phaser uses FIT plus NO_CENTER.
- Parent expansion is disabled.
- game-wrap owns the mobile 4:3 dimensions.
- Canvas margins and transforms are cleared.
- Scale refresh runs after page show, resize, and orientation changes.

Required browser verification:
- Full 960 by 720 scene visible in the 4:3 wrapper.
- No dark blank band above the scene.
- Scene starts directly under the date pill/browser area.
- Control bar begins immediately after the complete scene.
- Touch coordinates still match visible objects.
- Portrait and landscape orientation changes do not reintroduce centering.
- Desktop layout remains usable.
