# Top Shot Development Log

This file tracks meaningful Top Shot repo changes so future AI agents, Codex, Copilot, Grok, or human developers can continue from the repository instead of chat history.

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
