# Top Shot Handoff

## Current status

Top Shot is a top down Three.js AI arena combat prototype isolated under `top-shot/`.

The stable branch is `top-shot-v0-1`.

A safety branch was created for the coverage matrix documentation pass:

`backup/top-shot-v0-1-2026-07-11-coverage-matrix`

A safety branch was created before the smoke invalid-state fix:

`backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

The current broad audit branch is:

`top-shot-anomaly-audit-2026-07-12`

The focused runtime smoke fix branch is:

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

## Latest full code audit pass

Branch:

`top-shot-anomaly-audit-2026-07-12`

Base branch:

`top-shot-smoke-invalid-state-fix`

Backup branch:

`backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Implemented:

- Expanded the audit from the CQC smoke file to the full Top Shot game code surface.
- Audited docs, scripts, tests, runtime state, systems, AI, stealth, perception, movement, CQC Lab, combat, explosives, wounds, vitality, physicality, prestige, requests, navmesh, camera controls, Three.js world, actors, effects, package scripts, index, and Render config.
- Added and expanded `top-shot/docs/AUDIT_REPORT_2026-07-12.md`.
- Updated `top-shot/AGENTS.md` and `top-shot/docs/TOP_SHOT_HANDBOOK.md` so every Top Shot completion report must include clickable playable links.
- Updated top-level check expectations to include the split smoke commands plus the full smoke gate.
- Strengthened `top-shot/tests/cqcSmoke.js` to cover body-shot zone recording, deterministic sweep grounding, mount spacing, mounted ground attacks, mount escape integrity, CQC numeric validity, and hitbox numeric validity.
- Fixed `top-shot/tests/stealthSmoke.js` so it no longer fails on a valid immediate stealth phase transition. It now validates legal stealth phases, awareness initialization, quiet shadow behavior, sound suspicion, hard-sight gating for alert, last-known position storage, and search-plan generation.
- Updated `top-shot/docs/ARCHITECTURE.md`, `top-shot/docs/QA_CHECKLIST.md`, `top-shot/docs/COVERAGE_MATRIX.md`, and `top-shot/docs/DEVELOPMENT_LOG.md`.

Files changed in latest pass:

- `top-shot/AGENTS.md`
- `top-shot/docs/TOP_SHOT_HANDBOOK.md`
- `top-shot/docs/AUDIT_REPORT_2026-07-12.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/COVERAGE_MATRIX.md`
- `top-shot/tests/cqcSmoke.js`
- `top-shot/tests/stealthSmoke.js`

What changed in gameplay:

- No gameplay runtime code was intentionally changed in this audit pass.
- Smoke expectations changed to better reflect actual gameplay preservation targets.
- CQC smoke coverage is stricter and deterministic.
- Stealth smoke no longer treats a valid immediate runtime phase transition as a failure.

## Previous runtime fix pass

Branch:

`top-shot-smoke-invalid-state-fix`

Backup branch:

`backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Implemented:

- Hardened `top-shot/src/explosives.js` against invalid fighter and grenade state.
- Root cause addressed: `updateDive()` assumed any fighter with `diveT > 0` also had finite `diveVx` and `diveVy`. Suppression and evasive pose logic can set `diveT` without grenade-dive velocity, which can produce `NaN` positions before later systems run.
- Added finite guards for grenade fuse, ttl, position, velocity, blast, and damage.
- Added finite guards for grenade dive effects and explosion midpoint math.
- Upgraded `top-shot/tests/simSmoke.js` with richer invalid-state diagnostics, fighter/projectile context dumps, and a direct regression check for `diveT` without `diveVx` or `diveVy`.
- Split `top-shot/package.json` smoke scripts into `smoke:sim`, `smoke:cqc`, `smoke:stealth`, and `smoke:model` so the failing area can be rerun directly.
- Runtime and test code changed. This branch still needs a real smoke run from a local or CI environment with repo access.

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

PR #26, the studio visual pipeline PR, reports a stealth smoke blocker tied to stale test expectations. This audit branch corrects the stealth smoke expectation, but PR #26 still needs verification or a rebase/port of that correction.

## Important branches

Stable:

`top-shot-v0-1`

Backup for coverage matrix pass:

`backup/top-shot-v0-1-2026-07-11-coverage-matrix`

Backup for smoke fix pass:

`backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Audit branch:

`top-shot-anomaly-audit-2026-07-12`

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
npm run smoke:sim
npm run smoke:cqc
npm run smoke:stealth
npm run smoke:model
npm run smoke
npm run build
```

`npm run smoke` remains the full gate. Use the split scripts to isolate failures, not to bypass the full suite.

## Manual QA focus

- Match mode loads.
- CQC Lab loads.
- Fighter selection works.
- Fighters move, fight, use cover, and use stealth.
- Mounting and grounded CQC still work.
- Projectiles and effects render.
- Grenade throws and suppression dives do not create invalid fighter state.
- Body shots record proper zones.
- Sweeps, trips, mounts, mounted attacks, and mount escapes remain readable and valid.
- Stealth phases, noise suspicion, visual detection, last-known position, and search plan behavior still work.
- If `npm run smoke:sim`, `npm run smoke:cqc`, or `npm run smoke:stealth` fails, use the printed context before editing again.
- Debug overlay toggles with `D`.
- Collision debug toggles with `C`.
- No console errors on start.
- No obvious visual squashing.

## Playable links

Every Top Shot completion report must include clickable links:

- [Top Shot live app](https://top-shot-prototype.onrender.com/)
- PR link or branch link for the work
- Local playable command
- Deployment status if the live app is not verified to show the current branch

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
- Clickable playable links
