# Top Shot Development Log

This file tracks meaningful Top Shot repo changes so future AI agents, Codex, Copilot, Grok, or human developers can continue from the repository instead of chat history.

## 2026-07-11, Smoke invalid-state hardening

Tool or person: ChatGPT

Branch: `top-shot-smoke-invalid-state-fix`

Backup branch: `backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Summary:

- Investigated the PR #5 known smoke blocker: `suit_operative vs survival_commando` failing with `Invalid fighter state`, likely from NaN position, health, or elevation.
- Inspected `tests/simSmoke.js`, `src/state.js`, `src/systems.js`, `src/explosives.js`, `src/combat.js`, `src/perception.js`, `src/navmesh.js`, `src/stealth.js`, `src/arena.js`, `src/physicality.js`, and `src/prestige.js`.
- Identified the most likely root cause in `src/explosives.js`: `updateDive()` assumed `diveVx` and `diveVy` were finite whenever `diveT > 0`.
- Suppression and evasive pose logic can set `diveT` without grenade-dive velocity, so `f.x + f.diveVx * dt` and `f.y + f.diveVy * dt` can produce `NaN` before later systems run.
- Hardened dive movement to finite-safe velocity and position math.
- Hardened grenade update and explosion math to sanitize fuse, ttl, velocity, position, blast, and damage.

Files changed:

- `top-shot/src/explosives.js`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/COVERAGE_MATRIX.md`

Systems affected:

- Grenade and dive movement simulation.
- Smoke-test state integrity path.
- Documentation and matrix tracking.

What was preserved:

- Existing Top Shot runtime structure.
- Existing CQC, AI, match, grenade, and dive behavior intent.
- Existing branch isolation.

Testing:

- Local full repo tests were not run because the local container could not resolve GitHub and could not clone the repository.
- Performed a local syntax check on the patched `explosives.js` content with `node --check`, which passed.

Known risks:

- `npm run smoke` still needs to be run in a real repo checkout or CI to verify the PR #5 blocker is fully resolved.
- The patch addresses the most likely invalid-state source found by inspection, but other runtime NaN paths could still exist until smoke is rerun.
- Browser behavior remains unverified.

Next recommended step:

Run `npm run check`, `npm run smoke`, and `npm run build` from `top-shot/` on `top-shot-smoke-invalid-state-fix`. If smoke passes, update PR #5 and the coverage matrix blocker status.

## 2026-07-11, Coverage matrix control board

Tool or person: ChatGPT

Branch: `top-shot-coverage-matrix`

Backup branch: `backup/top-shot-v0-1-2026-07-11-coverage-matrix`

Summary:

- Added `top-shot/docs/COVERAGE_MATRIX.md` as the Top Shot feature, file, test, branch, risk, and next-action control board.
- Wired the matrix into the required reading order in `top-shot/AGENTS.md`.
- Updated the handbook to make matrix updates required when feature status, file ownership, branch status, known issues, PR status, risk, or test expectations change.
- Updated the handoff so future agents know the matrix is now part of continuation protocol.
- Updated the QA checklist so matrix freshness is part of stability and merge readiness.

Files changed:

- `top-shot/AGENTS.md`
- `top-shot/docs/TOP_SHOT_HANDBOOK.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/COVERAGE_MATRIX.md`

Systems affected:

- Documentation and workflow only.
- No runtime gameplay code changed.

What was preserved:

- Existing Top Shot runtime.
- Stable branch workflow.
- Starshot branch isolation.
- Existing run, smoke, check, and build command expectations.

Testing:

- Not run. Documentation-only pass through GitHub file edits.

Known risks:

- The matrix is only useful if future agents keep it updated.
- The matrix records current known status from docs and open PR metadata, but runtime behavior still needs local or browser verification.
- PR #5 still documents a known `npm run smoke` failure with `Invalid fighter state`.

Next recommended step:

Use `COVERAGE_MATRIX.md` as the first stop before the next runtime change, then investigate the PR #5 smoke failure before declaring the stable branch merge ready.

## 2026-07-10, Repo memory and Starshot protocol scaffold

Tool or person: ChatGPT

Branch: `top-shot-v0-1`

Backup branch: `backup/top-shot-v0-1-2026-07-10`

Summary:

- Added Top Shot repo-native agent instructions and development memory docs.
- Added `top-shot/AGENTS.md` as the short entry point for future tasks.
- Added `top-shot/docs/TOP_SHOT_HANDBOOK.md` as the full project development Bible.
- Added this development log.
- Added handoff, feature inventory, architecture, QA checklist, and Starshot roadmap docs.
- Established that Top Shot is separate from Apartment God main.
- Established stable, backup, and experimental branch rules.
- Established Starshot Mode for ambitious branches with rollback discipline.

Files added:

- `top-shot/AGENTS.md`
- `top-shot/docs/TOP_SHOT_HANDBOOK.md`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/FEATURE_INVENTORY.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/STARSHOT_ROADMAP.md`

Systems affected:

- Documentation and workflow only.
- No runtime gameplay code changed on the stable branch in this pass.

What was preserved:

- Existing Top Shot runtime.
- Existing branch `top-shot-v0-1` as the stable base.
- Existing run, smoke, check, and build commands.

Testing:

- Not run. Documentation-only pass.

Known risks:

- Future agents must actually follow these docs; the docs alone do not enforce behavior.
- The experimental Starshot branch may diverge quickly and must keep its own handoff current.

Next recommended step:

Mirror these docs into `top-shot-starshot-engine`, then continue Starshot work in recoverable slices beginning with motion, animation state, timing, and debug visibility.
