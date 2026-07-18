# Phaser Migration 2 Visual Gap Audit

Status: OPEN
Date: 2026-07-17

The branch is architecturally closer to native Phaser, but it is not at the final visual target.

Current blockers:

1. Room visuals rely on repeated generic panels rather than room specific authored environment art.
2. Furniture and fixtures rely on broad category SVGs rather than object specific sprites.
3. Several sprite assets are minimal or compressed one line SVGs and should not be treated as finished production art.
4. Many activity states reuse walking frames with scale, rotation, alpha, or frame swaps instead of dedicated activity animation sheets.
5. Character proportions, contact shadows, depth anchors, interaction alignment, and object occlusion still need browser review at actual game scale.
6. Painterly backgrounds, no outline object separation, grounded MGS style proportions, Wind Waker like color and lighting separation, and highly articulated human movement are not yet fully authored.
7. Native Phaser ownership is necessary for the target, but it does not generate high quality art automatically.

Required direction:

Preserve native Phaser layers and 8 FPS timing. Replace generic room and object stand ins with authored true top down sprites. Add dedicated sheets for sleep, sit, eat, shower, toilet, stairs, arcade, basketball, pool, exercise, vehicle entry, and other visible activities. Keep effects 2D and character presentation grounded, with no black outlines and depth separated through form, color, light, shadow, and occlusion.