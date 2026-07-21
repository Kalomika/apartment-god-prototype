# Top Shot QA Checklist

Run this checklist before declaring a Top Shot branch stable or merge-ready.

## Automated checks

From `top-shot/`:

```bash
npm run check
npm run assets:check
npm run starshot-smoke
npm run smoke:sim
npm run smoke:cqc
npm run smoke:stealth
npm run smoke:model
npm run smoke
npm run build
npm run validate
```

Do not claim these passed unless they were actually run.

## Startup checks

- Game loads without console errors.
- Main menu or initial screen appears.
- Match mode can start.
- CQC Lab can start.
- Canvas is not squashed.
- Top down camera is readable.

## Match mode checks

- Fighter selection works.
- Fighters spawn in correct locations.
- AI fighters move.
- AI fighters can engage each other.
- Cover behavior still works.
- Stealth and hiding still work.
- Ranged attacks still show projectiles or effects.
- Melee and CQC still resolve.
- Bleeding, stamina, block, dodge, and vitality still update.
- Fight can end or reach a clear state.

## CQC Lab checks

- CQC Lab loads.
- Manual actions trigger.
- Auto mode works.
- Slow motion works.
- Body shots work.
- Sweeps or trips can ground a fighter.
- Mounting places the top fighter on the body without clipping through it.
- Mounted fighter can attempt escape.
- Ground attacks or mounted attacks display correctly.
- Hitbox debug data remains coherent.
- CQC fighters never enter padded prop collision during spawn, movement, recoil, reset, or mount.

## 3D checks

- Actors render with readable segmented bodies.
- Facing direction updates.
- Poses change for idle, walk, crouch, prone, attack, grounded, and mount states where applicable.
- Effects render.
- Parachutes and deployment behavior still work if present.
- Pickup markers render.
- Terrain and cover remain visible.
- Camera follows the action without losing fighters.
- Actors have no drawn or geometry outline pass.
- Toon color bands separate forms through light and color.
- Character poses visibly step at 8 FPS without reducing camera, input, collision, or simulation rate.
- Muzzle and impact flashes face the camera as 2D cards.
- Effects installation causes exactly one renderer call per world update.
- Deployment height uses world scaling and preserves terrain elevation.

## Debug checks

- Collision debug toggles with `C` where implemented.
- Debug overlay toggles with `D` where implemented.
- Debug overlay does not change gameplay logic.
- Debug overlay does not create obvious frame collapse during normal use.
- AI or animation labels are readable and not misleading.
- Starshot timing line appears when debug overlay is visible.
- Per-fighter Starshot animation, motion, combat, and AI telemetry appears when debug overlay is visible.

## Starshot checks

For experimental Starshot work, also verify:

- Stable branch remains untouched or safely recoverable.
- Backup branch exists.
- Handoff and development log are updated.
- New systems are modular.
- Known broken items are listed.
- Branch is clearly marked experimental if not merge-ready.
- `npm run starshot-smoke` passes before using Starshot scaffold as a dependency for larger systems.

## Current validation note

The previous invalid-state and stale stealth-smoke blockers are mitigated on `top-shot-full-stabilization-2026-07-21`. Keep the finite-state diagnostics and direct dive regression until this work is integrated and repeatedly verified. Browser QA remains required.

## Merge rule

A branch is not ready to merge into stable unless it passes automated checks and the relevant manual checks, or Kam explicitly accepts the risk.
