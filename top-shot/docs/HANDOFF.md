# Top Shot Handoff

## Current continuation state

Top Shot is isolated under `top-shot/`. Do not edit Apartment God main runtime for Top Shot work.

Current stabilization branch:

`top-shot-full-stabilization-2026-07-21`

Base branch:

`top-shot-studio-pipeline`

Backup branch:

`backup/top-shot-studio-pipeline-2026-07-21-stabilization`

Draft pull request:

[PR #34, Stabilize full Top Shot validation and smoke coverage](https://github.com/Kalomika/apartment-god-prototype/pull/34)

Final verified head for this pass:

`4fb979094f6d730e348b81cb15fae1a5b87430ae`

GitHub Actions run #328 passed on that head after a clean `npm ci` and the complete `npm run validate` gate. Stable `top-shot-v0-1` was not modified.

## Required reading

Read these before the next Top Shot task:

1. `top-shot/AGENTS.md`
2. `top-shot/docs/TOP_SHOT_HANDBOOK.md`
3. `top-shot/docs/HANDOFF.md`
4. `top-shot/docs/DEVELOPMENT_LOG.md`
5. `top-shot/docs/FEATURE_INVENTORY.md`
6. `top-shot/docs/ARCHITECTURE.md`
7. `top-shot/docs/QA_CHECKLIST.md`
8. `top-shot/docs/COVERAGE_MATRIX.md`
9. Recent commits on the active branch
10. Open Top Shot pull requests
11. The exact files to edit

## Implemented in the 2026-07-21 stabilization pass

- Corrected CQC Lab spawn placement so both fighters begin on legal floor space instead of Fighter B spawning inside the center boulder.
- Routed CQC movement, separation, recoil, reset placement, grounded recovery, and mount anchors through arena-aware collision correction.
- Preserved body shots, sweeps, trips, throws, mounting, mounted ground attacks, mount escape, limb grabs, disarms, hitboxes, and auto CQC.
- Fixed the stale stealth smoke expectation while retaining hard sight, sound suspicion, memory, and search-plan checks.
- Added safe archetype fallbacks and initialized finite elevation, climb, jump, and object state for match fighters.
- Strengthened simulation smoke to validate fighter and projectile state during deployment and combat, including the dive-without-velocity regression.
- Removed the effects pipeline's duplicate scene render per frame.
- Corrected deployment-height world scaling while preserving terrain elevation.
- Added `tests/renderPipelineSmoke.js` to protect one render per update and deployment-height conversion.
- Split smoke commands and added one complete `npm run validate` gate.
- Moved CI to Node 24, clean `npm ci`, read-only permissions, concurrency cancellation, and failure-log artifacts.
- Removed all temporary stabilization payload files and write-enabled workflow machinery before final verification.

## Verification completed

The following passed locally from the exact GitHub Actions source snapshot:

```bash
npm ci
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

A separate 12-match repeated stress pass completed without invalid fighter or projectile fields.

Final GitHub Actions run #328 passed on commit `4fb979094f6d730e348b81cb15fae1a5b87430ae`.

## Remaining known risks

- Browser QA has not been completed on this branch. Mount appearance, deployment height, camera-facing effects, top-down readability, `D` debug overlay, and `C` collision debug still require visual verification.
- Several AI matchups can remain active beyond the 60-second smoke horizon. This is a pacing and balance problem, not an invalid-state failure.
- The branch is experimental and remains a draft pull request. It is not approved for stable merge.
- The live Render app may still show the stable deployment rather than this branch.
- PR #23 remains relevant for debug overlay review, and PR #26 remains the studio-pipeline base for this stabilization work.

## Branch map

Stable:

`top-shot-v0-1`

Studio visual base:

`top-shot-studio-pipeline`

Current stabilization branch:

`top-shot-full-stabilization-2026-07-21`

Current stabilization backup:

`backup/top-shot-studio-pipeline-2026-07-21-stabilization`

Experimental Starshot branch:

`top-shot-starshot-engine`

Debug overlay branch:

`top-shot-debug-overlay`

## Exact next step

Perform browser QA on a preview of `top-shot-full-stabilization-2026-07-21`. Verify CQC mount geometry from more than one camera angle, parachute and terrain height, one-render effects behavior, top-down silhouette readability, and independent `D` and `C` toggles. Then make a focused AI pacing pass for matchups that stall beyond 60 seconds before considering a merge into `top-shot-studio-pipeline` or stable.

## Playable and review links

- [Top Shot live app](https://top-shot-prototype.onrender.com/)
- [Top Shot CQC Lab](https://top-shot-prototype.onrender.com/?mode=cqc)
- [Stabilization PR #34](https://github.com/Kalomika/apartment-god-prototype/pull/34)
- [Stabilization branch](https://github.com/Kalomika/apartment-god-prototype/tree/top-shot-full-stabilization-2026-07-21/top-shot)
- [Studio pipeline PR #26](https://github.com/Kalomika/apartment-god-prototype/pull/26)

## Required completion report

Every meaningful Top Shot coding pass must report:

- Branch used
- Backup branch used or created
- Commit SHA
- Files changed
- What was implemented
- What was tested
- What failed or was deferred
- Known risks
- Exact next step
- Pull request or branch link
- Clickable playable links
