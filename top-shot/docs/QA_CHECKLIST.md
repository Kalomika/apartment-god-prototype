# Top Shot QA Checklist

Run this checklist before declaring a Top Shot branch stable or merge-ready.

## Automated checks

From `top-shot/`:

```bash
npm run check
npm run smoke:sim
npm run smoke:cqc
npm run smoke:stealth
npm run smoke:model
npm run smoke
npm run build
```

`npm run smoke` remains the full safety gate. The split smoke scripts exist so a failure can be isolated quickly without deleting or weakening the complete smoke suite.

Do not claim these passed unless they were actually run.

## Documentation freshness checks

- `top-shot/docs/HANDOFF.md` reflects the current branch state.
- `top-shot/docs/DEVELOPMENT_LOG.md` has a dated entry for the pass.
- `top-shot/docs/COVERAGE_MATRIX.md` reflects changed features, file ownership, branch status, known issues, PR status, risks, and test expectations.
- `top-shot/docs/FEATURE_INVENTORY.md` is updated if player-facing feature behavior changed.
- `top-shot/docs/ARCHITECTURE.md` is updated if module ownership or architecture changed.
- This QA checklist is updated if test expectations changed.

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

## 3D checks

- Actors render with readable segmented bodies.
- Facing direction updates.
- Poses change for idle, walk, crouch, prone, attack, grounded, and mount states where applicable.
- Effects render.
- Parachutes and deployment behavior still work if present.
- Pickup markers render.
- Terrain and cover remain visible.
- Camera follows the action without losing fighters.

## Debug checks

- Collision debug toggles with `C` where implemented.
- Debug overlay toggles with `D` where implemented.
- Debug overlay does not change gameplay logic.
- Debug overlay does not create obvious frame collapse during normal use.
- AI or animation labels are readable and not misleading.

## Smoke diagnostics checks

- If `npm run smoke:sim` fails, read the printed smoke context before patching.
- The smoke context should include matchup, phase, tick, clock, match state, cinematic phase, fighter snapshots, projectile snapshots, and recent log lines.
- The direct regression for `diveT` without `diveVx` or `diveVy` must stay in `tests/simSmoke.js` until the invalid-state blocker is fully closed.
- Do not remove or skip matchups just to make smoke green.

## Coverage matrix checks

- Every touched runtime feature has a matching matrix row or a new row added.
- Every new module has file ownership represented in the matrix or architecture doc.
- Known issues discovered during testing are added to the matrix blocker section.
- Open PR or branch status changes are reflected in the matrix.
- Risk level is updated if the change becomes safer or more dangerous than before.

## Starshot checks

For experimental Starshot work, also verify:

- Stable branch remains untouched or safely recoverable.
- Backup branch exists.
- Handoff and development log are updated.
- Coverage matrix is updated.
- New systems are modular.
- Known broken items are listed.
- Branch is clearly marked experimental if not merge-ready.

## Merge rule

A branch is not ready to merge into stable unless it passes automated checks and the relevant manual checks, or Kam explicitly accepts the risk.

Matrix freshness is part of merge readiness. If the matrix does not match the branch, the branch is not ready.
