# Apartment God Studio: Start Here

Status: ACTIVE GOVERNANCE SYSTEM
Canonical project: Apartment God
Repository: `Kalomika/apartment-god-prototype`
Active development branch: `phaser-migration`
Render playable branch: `main`

This folder is the coordination layer for humans and AI workers. It does not replace the Apartment God handbook, backup policy, ongoing design log, idea Bible, or development matrix. Those remain authoritative for game rules and production truth.

## One-command entry

Use this instruction for a new worker:

> Join the Apartment God studio. Read `studio/START_HERE.md`, perform preflight, select or claim one eligible unoccupied assignment, execute only that scope, submit evidence, update repo memory, and release the claim.

A worker must not interpret that sentence as permission to start coding immediately.

## Mandatory read order

1. `AGENTS.md`
2. `docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md`
3. `docs/APARTMENT_GOD_BACKUP_POLICY.md`
4. `docs/APARTMENT_GOD_NO_BROAD_IMPLEMENTATION_RULE.md`
5. `docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md`
6. `docs/APARTMENT_GOD_IDEA_LOGGING_RULE.md`
7. `apartment-god-production/ONGOING_DESIGN_LOG.md`
8. `apartment-god-production/DEVELOPMENT_MATRIX.md`
9. Recent append and patch files under `apartment-god-production/`
10. `studio/CONSTITUTION.md`
11. `studio/OPERATING_PROTOCOL.md`
12. `studio/QA_ARCHITECTURE_RELEASE.md`
13. `studio/MEMORY_AND_REGISTERS.md`
14. `studio/TEMPLATES.md`
15. `studio/state/studio-state.json`
16. The relevant specialist control section

## Preflight gate

Before meaningful work, verify all of the following:

- The repository is exactly `Kalomika/apartment-god-prototype`.
- The intended project is Apartment God, not Top Shot.
- The active development target is `phaser-migration`.
- GitHub read and write access works.
- Current branch head, recent commits, open PRs, append files, matrix state, and active claims were inspected.
- The task is not already implemented, superseded, rejected, or claimed.
- The work will not touch `Kalomika/ai-rpg-engine`.
- The work will not update `main`, deploy, or alter Render settings.
- A backup exists when the handbook or backup policy requires one.
- The user directive has been logged before execution.
- Runtime work is explicitly authorized.

If any identity or safety check fails, stop. If only a claim or dependency check fails, choose another eligible task.

## Worker lifecycle

1. Inspect.
2. Classify.
3. Claim.
4. Plan.
5. Implement.
6. Validate.
7. Record evidence.
8. Update memory and matrix status.
9. Release or hand off the claim.
10. Report exact branch, commits, files, runtime impact, backup, audit result, tests, and next step.

## Source-of-truth hierarchy

When sources disagree, use this order:

1. Kam's most recent explicit directive, once logged in the repo.
2. The development handbook and active safety policies.
3. The current development matrix and accepted architecture decisions.
4. Current code and verified tests.
5. Ongoing design log and sidecar append files.
6. Studio boards and machine-readable state.
7. Older PRs, branches, or planning documents.

Do not mistake unfamiliar newer code for a defect. An anomaly must be supported by evidence of broken behavior, policy violation, regression, duplication, or inconsistency.

## Current implementation status

The studio governance layer is implemented as documentation, templates, machine-readable state, and an audit tool. It does not create permanently running autonomous agents. Multiple AI workers can use it concurrently when each reads and writes the repository state responsibly.
