# Top Shot Agent Instructions

Top Shot lives in `top-shot/` inside `Kalomika/apartment-god-prototype`.

Do not confuse Top Shot with Apartment God main. Do not edit the Apartment God runtime unless Kam explicitly asks for it.

## Source of truth

The repo is the source of truth. Do not rely on chat history alone.

Before every Top Shot task, read these in order:

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
11. The exact files you will edit

If any required doc is missing, create or update it before or during the task.

## Branch rules

Stable base branch: `top-shot-v0-1`

Current backup branch for this matrix pass: `backup/top-shot-v0-1-2026-07-11-coverage-matrix`

Current experimental Starshot branch: `top-shot-starshot-engine`

For risky changes, create or confirm a backup branch first. For large changes, work on a development or experimental branch. Keep the stable branch safe and deployable.

## Coverage matrix rule

Before editing runtime code, check `top-shot/docs/COVERAGE_MATRIX.md` for the feature, file ownership, test expectations, risk level, and next action.

If a task touches a feature, system, branch status, known issue, PR status, or test expectation that is not covered by the matrix, update the matrix during the same pass.

## Starshot Mode

When Kam says to shoot for the stars, build the monster version, go big, or similar, ambitious systems and deep refactors are allowed only after confirming a backup branch and working on an experimental branch.

Starshot Mode means maximum ambition with rollback discipline, not careless overwriting.

## Required checks

From `top-shot/`, run when possible:

```bash
npm run check
npm run smoke
npm run build
```

Never claim tests passed unless they were actually run.

## Required documentation updates

Every meaningful coding pass must update:

- `top-shot/docs/DEVELOPMENT_LOG.md`
- `top-shot/docs/HANDOFF.md`

If features, file ownership, branch status, known issues, PR status, risk, or test expectations changed, update:

- `top-shot/docs/COVERAGE_MATRIX.md`

If features changed, update:

- `top-shot/docs/FEATURE_INVENTORY.md`

If architecture changed, update:

- `top-shot/docs/ARCHITECTURE.md`

If test expectations changed, update:

- `top-shot/docs/QA_CHECKLIST.md`

## Completion report

Every completion report must include:

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

Do not end with only "done."
