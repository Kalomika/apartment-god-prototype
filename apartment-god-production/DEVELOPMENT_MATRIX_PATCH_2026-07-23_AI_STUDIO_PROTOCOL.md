# Development Matrix Patch: Repository-Native AI Studio Protocol

Date: 2026-07-23 CT
Updated: 2026-07-24 CT
Branch: phaser-migration
Status: IMPLEMENTED, OPERATIONAL USE NEEDS_TESTING
Runtime files changed: no
Render playable branch updated: no

## System matrix rows

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Repository-native AI studio governance | IMPLEMENTED | `studio/` | Constitution, Producer routing, departments, claims, tasks, QA gates, architecture review, release rules, memory, registers, templates, state, and audit tooling were installed by `a2ecddfd3a7fafe296a7eac6efe9f1bb53751efc`. | Use the protocol on a real bounded task and record the complete claim lifecycle. |
| Machine-readable studio state | IMPLEMENTED, NEEDS LIVE USE | `studio/state/studio-state.json` | Initial roles, governance tasks, decisions, protections, accepted installation evidence, and the first recorded audit exist. | Populate the current gameplay task inventory and record the first real claim. |
| Studio structural audit | IMPLEMENTED, CI VERIFICATION REQUIRED | `tools/studio_audit.py`, `.github/workflows/studio-audit.yml` | Read-only checks protect identity, branches, unique IDs, claim integrity, dependency integrity, high-risk backup flags, and accepted-task evidence. The installation was validated against a local fixture. | Confirm the workflow on the exact documentation repair head and retain the run result. |
| Department claim protocol | IMPLEMENTED, NEEDS LIVE USE | `studio/OPERATING_PROTOCOL.md`, `studio/TEMPLATES.md` | One valid active claim per task, stale claim handling, handoffs, and conflict rules are defined. | Exercise the protocol on STUDIO-002 or STUDIO-003. |

## Risk row

| Risk | Severity | Failure mode | Mitigation |
|---|---|---|---|
| Studio records drift from code, matrix, or active PRs | Medium | An agent trusts stale claims or tasks and duplicates work | Producer preflight, current GitHub inspection, sidecar reconciliation, machine-readable audit, and evidence-first status |
| Documentation status labels disagree | Medium | The log and machine state say accepted while the matrix or Bible still says planned | Update all affected memory layers in the same pass and audit status labels before handoff |
| Claims are not transactional | Medium | Simultaneous workers can claim the same task before either sees the other's update | Re-read current state immediately before committing a claim, keep work bounded, and resolve conflicts using the earlier valid repository claim |
