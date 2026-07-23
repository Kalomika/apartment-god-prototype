# Development Matrix Patch: Repository-Native AI Studio Protocol

Date: 2026-07-23 CT
Branch: phaser-migration
Status: NEEDS_REVIEW
Runtime files changed: no
Render playable branch updated: no

## Proposed system matrix rows

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Repository-native AI studio governance | NEEDS_REVIEW | `studio/` | Constitution, Producer routing, departments, claims, tasks, QA gates, architecture review, release rules, memory, registers, templates, state, and audit tooling are installed. | Run the audit in CI and perform Producer review. |
| Machine-readable studio state | NEEDS_REVIEW | `studio/state/studio-state.json` | Initial roles, governance tasks, decisions, and protections exist. | Populate current gameplay tasks and first real claim. |
| Studio structural audit | NEEDS_REVIEW | `tools/studio_audit.py`, `.github/workflows/studio-audit.yml` | Read-only checks protect identity, branches, unique IDs, claim integrity, dependency integrity, high-risk backup flags, and accepted-task evidence. | Confirm first GitHub Actions run passes or only reports expected warnings. |
| Department claim protocol | NEEDS_REVIEW | `studio/OPERATING_PROTOCOL.md`, `studio/TEMPLATES.md` | One valid active claim per task, stale claim handling, handoffs, and conflict rules are defined. | Use on the next assigned studio task. |

## Risk row

| Risk | Severity | Failure mode | Mitigation |
|---|---|---|---|
| Studio records drift from code, matrix, or active PRs | Medium | An agent trusts stale claims or tasks and duplicates work | Producer preflight, current GitHub inspection, sidecar reconciliation, machine-readable audit, and evidence-first status |
