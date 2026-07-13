# Top Shot Development Log

This file tracks meaningful Top Shot repo changes so future AI agents, Codex, Copilot, Grok, or human developers can continue from the repository instead of chat history.

## 2026-07-12, Full Top Shot code audit follow-up

Tool or person: ChatGPT

Branch: `top-shot-anomaly-audit-2026-07-12`

Base branch: `top-shot-smoke-invalid-state-fix`

Backup branch: `backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Summary:

- Corrected the audit scope after Kam clarified that the full Top Shot game code needed review, not only `tests/cqcSmoke.js`.
- Expanded the audit to cover Top Shot docs, scripts, tests, runtime state, systems, AI, stealth, perception, movement, CQC Lab, combat, explosives, wounds, vitality, physicality, prestige, requests, navmesh, camera controls, Three.js world/actors/effects, package scripts, index, and Render config.
- Found PR #26's relevant blocker: `stealthSmoke.js` had a stale fixed expectation that the first stealth update must remain `infiltration`, while runtime conditions can validly advance the phase immediately.
- Fixed `tests/stealthSmoke.js` so it validates legal stealth phases, awareness initialization, quiet shadow behavior, sound suspicion, hard-sight gating for alert, last-known position storage, and search-plan generation without rejecting valid immediate phase transitions.
- Fixed `tests/cqcSmoke.js` again so sweep grounding verification is deterministic instead of depending on a lucky random roll.
- Expanded `docs/AUDIT_REPORT_2026-07-12.md` to record the full code audit scope, fixed anomalies, runtime findings, deferred verification, and PR #26 relationship.
- Updated `docs/ARCHITECTURE.md` with fuller current module ownership and split smoke check commands.
- Updated `docs/COVERAGE_MATRIX.md` with the full audit branch, deterministic CQC coverage, corrected stealth smoke expectation, and PR #26 blocker/rebase note.

Files changed in this follow-up:

- `top-shot/tests/cqcSmoke.js`
- `top-shot/tests/stealthSmoke.js`
- `top-shot/docs/AUDIT_REPORT_2026-07-12.md`
- `top-shot/docs/ARCHITECTURE.md`
- `top-shot/docs/COVERAGE_MATRIX.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`

Systems affected:

- Test coverage and smoke expectations.
- Documentation and handoff accuracy.
- No gameplay runtime code was intentionally changed in this follow-up.

What was preserved:

- Stable branch untouched.
- Smoke-fix branch and PR #25 remain separate.
- Full `npm run smoke` remains the gate.
- CQC and stealth smoke coverage were made stricter/more accurate, not removed.

Testing:

- Not run in this connector environment.
- No GitHub workflow runs were found for the audit branch commits checked during this pass.

Known risks:

- `npm run smoke:cqc` may reveal real CQC issues now that the test is stricter and deterministic.
- `npm run smoke:stealth` must be run locally or in CI to confirm the corrected expectation is green.
- PR #26 may need a rebase or port of the corrected `tests/stealthSmoke.js` expectation.
- Browser behavior and live Render deployment remain unverified.

Next recommended step:

Run `npm run smoke:cqc`, `npm run smoke:stealth`, and `npm run smoke:sim` first on `top-shot-anomaly-audit-2026-07-12`. If they pass, run `npm run check`, full `npm run smoke`, and `npm run build`. If any fail, patch the exact failure rather than weakening coverage.

Playable links:

- [Top Shot live app](https://top-shot-prototype.onrender.com/)
- [Audit branch](https://github.com/Kalomika/apartment-god-prototype/tree/top-shot-anomaly-audit-2026-07-12/top-shot)
- [Smoke fix PR #25](https://github.com/Kalomika/apartment-god-prototype/pull/25)
- [Studio visual pipeline PR #26](https://github.com/Kalomika/apartment-god-prototype/pull/26)

## 2026-07-12, Anomaly audit and CQC preservation coverage

Tool or person: ChatGPT

Branch: `top-shot-anomaly-audit-2026-07-12`

Base branch: `top-shot-smoke-invalid-state-fix`

Backup branch: `backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Summary:

- Created a separate audit branch from the current smoke-fix work so the broad audit does not destabilize stable or overwrite PR #25 directly.
- Audited Top Shot repo rules, current handoff, development log, feature inventory, architecture, QA checklist, coverage matrix, open Top Shot PR state, core runtime entry points, smoke tests, CQC Lab, Three.js actor/world files, and Render config.
- Added `top-shot/docs/AUDIT_REPORT_2026-07-12.md` to record the audit scope, fixed anomalies, deferred checks, risks, and playable links.
- Fixed a process anomaly: playable clickable links are now required in Top Shot completion reports.
- Fixed stale instruction docs: `AGENTS.md` and the handbook now list split smoke commands plus the full smoke gate.
- Strengthened `tests/cqcSmoke.js` so it protects Kam's CQC preservation targets more directly: body-shot zone recording, sweep grounding attempts, mount spacing, ground attacks from mount, escape integrity, CQC numeric validity, and hitbox numeric validity.
- Updated QA and coverage matrix expectations for the stronger CQC smoke.

Files changed:

- `top-shot/AGENTS.md`
- `top-shot/docs/TOP_SHOT_HANDBOOK.md`
- `top-shot/docs/AUDIT_REPORT_2026-07-12.md`
- `top-shot/docs/COVERAGE_MATRIX.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/tests/cqcSmoke.js`

Systems affected:

- Documentation and workflow discipline.
- CQC smoke coverage.
- No gameplay runtime code was intentionally changed in this pass.

What was preserved:

- Stable branch untouched.
- Smoke-fix branch preserved as PR #25's focused branch.
- Full `npm run smoke` remains the gate.
- Existing CQC actions remain covered, with stricter preservation assertions.

Testing:

- Not run in this connector environment.
- The audit branch must be tested in a local or CI checkout.

Known risks:

- Strengthened `npm run smoke:cqc` may reveal true CQC regressions the old test missed.
- The audit did not verify browser rendering or the live Render deployment.
- Starshot presentation quality remains planned on `top-shot-starshot-engine`, not implemented on this audit branch.

Next recommended step:

Run `npm run smoke:cqc` and `npm run smoke:sim` first on `top-shot-anomaly-audit-2026-07-12`. If both pass, run `npm run check`, full `npm run smoke`, and `npm run build`. If `smoke:cqc` fails, patch the CQC behavior rather than weakening the new preservation assertions.

Playable links:

- [Top Shot live app](https://top-shot-prototype.onrender.com/)
- [Audit branch](https://github.com/Kalomika/apartment-god-prototype/tree/top-shot-anomaly-audit-2026-07-12/top-shot)
- [Smoke fix PR #25](https://github.com/Kalomika/apartment-god-prototype/pull/25)

## 2026-07-11, Smoke suite split and invalid-state diagnostics

Tool or person: ChatGPT

Branch: `top-shot-smoke-invalid-state-fix`

Backup branch: `backup/top-shot-coverage-matrix-2026-07-11-smoke-fix`

Summary:

- Kept `npm run smoke` as the full safety gate instead of deleting or weakening it.
- Split the smoke suite into named scripts: `smoke:sim`, `smoke:cqc`, `smoke:stealth`, and `smoke:model`.
- Reworked `tests/simSmoke.js` to print detailed failure context for invalid state failures, including matchup, phase, tick, clock, match state, fighter snapshots, projectile snapshots, and recent log lines.
- Added a direct regression path for the suspected failure class: a fighter with `diveT > 0` but missing `diveVx` and `diveVy`.
- Preserved the existing matchup coverage instead of skipping the failing suit operative versus survival commando path.

Files changed:

- `top-shot/tests/simSmoke.js`
- `top-shot/package.json`
- `top-shot/docs/HANDOFF.md`
- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/QA_CHECKLIST.md`
- `top-shot/docs/COVERAGE_MATRIX.md`

Systems affected:

- Smoke-test diagnostics and test command ergonomics.
- No gameplay runtime code changed in this pass.
- The previous runtime hardening in `src/explosives.js` remains the mitigation for the invalid-state bug.

What was preserved:

- Full `npm run smoke` still runs simulation, CQC, stealth, and model smoke checks.
- All existing sim smoke matchups remain covered.
- Stable branch remains untouched.

Testing:

- Not run in this connector environment.
- The new commands need to be run from a real checkout:
  - `npm run smoke:sim`
  - `npm run smoke:cqc`
  - `npm run smoke:stealth`
  - `npm run smoke:model`
  - `npm run smoke`

Known risks:

- The diagnostics may expose a second invalid-state source after the grenade/dive hardening. If so, use the printed context instead of guessing.
- Full smoke has not been verified green yet.
- Browser behavior remains unverified.

Next recommended step:

Run `npm run smoke:sim` first on `top-shot-smoke-invalid-state-fix`. If it passes, run `npm run check`, full `npm run smoke`, and `npm run build`. If it fails, use the printed state context to patch the exact corrupt field.

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
- Checked GitHub workflow runs for the current PR head commit through the connector and found none, so there are no CI logs to inspect yet.

Known risks:

- `npm run smoke:sim`, `npm run smoke`, `npm run check`, and `npm run build` still need to be run in a real repo checkout or CI to verify the PR #5 blocker is fully resolved.
- The patch addresses the most likely invalid-state source found by inspection, but other runtime NaN paths could still exist until smoke is rerun.
- Browser behavior remains unverified.

Next recommended step:

Run `npm run check`, `npm run smoke:sim`, `npm run smoke`, and `npm run build` from `top-shot/` on `top-shot-smoke-invalid-state-fix`. If smoke passes, update PR #5 and the coverage matrix blocker status.

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
