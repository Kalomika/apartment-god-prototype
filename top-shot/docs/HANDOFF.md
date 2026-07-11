# Top Shot Handoff

## Current status

Top Shot is a top down Three.js AI arena combat prototype isolated under `top-shot/`.

The stable branch is `top-shot-v0-1`.

A safety branch was created for the coverage matrix documentation pass:

`backup/top-shot-v0-1-2026-07-11-coverage-matrix`

A safety branch was created before the smoke invalid-state fix:

`backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

The current focused runtime fix branch is:

`top-shot-smoke-invalid-state-fix`

The coverage matrix documentation branch is:

`top-shot-coverage-matrix`

The current experimental Starshot branch is:

`top-shot-starshot-engine`

## Source of truth

Read these before any Top Shot task:

1. `top-shot/AGENTS.md`
2. `top-shot/docs/TOP_SHOT_HANDBOOK.md`
3. `top-shot/docs/HANDOFF.md`
4. `top-shot/docs/DEVELOPMENT_LOG.md`
5. `top-shot/docs/FEATURE_INVENTORY.md`
6. `top-shot/docs/ARCHITECTURE.md`
7. `top-shot/docs/QA_CHECKLIST.md`
8. `top-shot/docs/COVERAGE_MATRIX.md`
9. Recent commits on the active branch
10. Open PRs related to Top Shot
11. The exact files to edit

## Latest runtime fix pass

Branch:

`top-shot-smoke-invalid-state-fix`

Backup branch:

`backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Implemented:

- Hardened `top-shot/src/explosives.js` against invalid fighter and grenade state.
- Root cause addressed: `updateDive()` assumed any fighter with `diveT > 0` also had finite `diveVx` and `diveVy`. Suppression and evasive pose logic can set `diveT` without grenade-dive velocity, which can produce `NaN` positions before later systems run.
- Added finite guards for grenade fuse, ttl, position, velocity, blast, and damage.
- Added finite guards for grenade dive effects and explosion midpoint math.
- Runtime code changed. This branch still needs a real `npm run smoke` run from a local or CI environment with repo access.

## Previous documentation pass

Branch:

`top-shot-coverage-matrix`

Backup branch:

`backup/top-shot-v0-1-2026-07-11-coverage-matrix`

Implemented:

- Added `top-shot/docs/COVERAGE_MATRIX.md` as the Top Shot control board.
- Wired the coverage matrix into the required reading flow.
- Updated the handbook so feature, file ownership, branch status, known issue, PR status, risk, and test expectation changes require matrix updates.
- Preserved runtime code. That pass was documentation only.

## Current Starshot state

`top-shot-starshot-engine` is intended for ambitious engine work.

It should be treated as experimental and not merge ready until checks run and browser behavior is verified.

Starshot work should use `COVERAGE_MATRIX.md` to track feature status, branch source, file ownership, test proof, risk, and next action for every slice.

## Important branches

Stable:

`top-shot-v0-1`

Backup for coverage matrix pass:

`backup/top-shot-v0-1-2026-07-11-coverage-matrix`

Backup for smoke fix pass:

`backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Focused runtime fix branch:

`top-shot-smoke-invalid-state-fix`

Coverage matrix documentation branch:

`top-shot-coverage-matrix`

Experimental:

`top-shot-starshot-engine`

Debug overlay PR branch:

`top-shot-debug-overlay`

## Required checks

From `top-shot/`:

```bash
npm run check
npm run smoke
npm run build
```

## Manual QA focus

- Match mode loads.
- CQC Lab loads.
- Fighter selection works.
- Fighters move, fight, use cover, and use stealth.
- Mounting and grounded CQC still work.
- Projectiles and effects render.
- Grenade throws and suppression dives do not create invalid fighter state.
- Debug overlay toggles with `D`.
- Collision debug toggles with `C`.
- No console errors on start.
- No obvious visual squashing.

## Coverage matrix focus

Use `top-shot/docs/COVERAGE_MATRIX.md` before runtime work to identify:

- Feature or responsibility being touched.
- Current status.
- Branch source.
- Owning files.
- Preservation target.
- Automated and manual checks.
- Risk level.
- Next action.

If the next pass changes features, file ownership, branch status, known issues, PR status, risks, or test expectations, update the matrix along with this handoff and the development log.

## Do not touch without explicit reason

- Apartment God main runtime.
- Stable Top Shot runtime for risky changes.
- Existing working CQC behavior unless replacing it is the explicit task.

## Required completion report

Every coding pass must report:

- Branch used
- Backup branch used or created
- Commit SHA
- Files changed
- What was implemented
- What was tested
- What failed or was deferred
- Known risks
- Exact next step
- PR link or branch link
