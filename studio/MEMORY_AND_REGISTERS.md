# Studio Memory and Control Registers

## Studio Memory and Architecture Decisions

This file records durable reasoning. Logs say what happened. The matrix says current status. Studio Memory says why a consequential choice exists.

## Decision record format

### ADR-AG-XXXX: Title

- Date:
- Status: PROPOSED, ACCEPTED, SUPERSEDED, REJECTED
- Decision owner:
- Context:
- Decision:
- Alternatives considered:
- Consequences:
- Revisit trigger:
- Related tasks, claims, commits, and files:

## Accepted decisions

### ADR-AG-0001: Repository-native studio coordination

- Date: 2026-07-23 CT
- Status: ACCEPTED
- Decision owner: Kam, with Producer implementation
- Context: Multiple AI workers may inspect and modify the repository across separate chats. Chat memory is insufficient for reliable coordination.
- Decision: Use repository documents, machine-readable state, task claims, evidence, and audits as the shared coordination layer.
- Alternatives considered: one monolithic assistant, external-only spreadsheet, chat-only handoffs, immediate external multi-agent framework.
- Consequences: Workers must spend time on preflight and records, but duplicate work and destructive overwrites become easier to prevent.
- Revisit trigger: A reliable external orchestrator is introduced or GitHub supplies transactional claim locking.

### ADR-AG-0002: Review by production value, not code volume

- Date: 2026-07-23 CT
- Status: ACCEPTED
- Decision owner: Kam and Producer
- Context: Commit counts and lines of code do not measure feature value or risk.
- Decision: Use task completion, risk gates, and accepted production points for review cadence.
- Alternatives considered: review after fixed commit counts or line thresholds.
- Consequences: Task estimates require judgment, but review timing better matches actual production significance.

### ADR-AG-0003: Technical and creative approval remain separate

- Date: 2026-07-23 CT
- Status: ACCEPTED
- Decision owner: Kam
- Context: A feature can boot correctly while failing the requested visual, animation, or experiential direction.
- Decision: QA records technical evidence separately from creative approval.
- Alternatives considered: one binary complete status.
- Consequences: Some features remain technically accepted but creatively pending.

---

## Control Registers

## Technical debt register

| Debt ID | System | Description | Severity | Owner | Trigger for repair | Status |
|---|---|---|---|---|---|---|
| DEBT-AG-001 | Documentation | Canonical ongoing log and matrix have sidecar append and patch files pending reconciliation | MEDIUM | Documentation and Memory | Before milestone review | OPEN |
| DEBT-AG-002 | Studio | Older production-manager department branch is not reconciled with current governance | LOW | Producer | During STUDIO-002 | OPEN |

A debt record must distinguish intentional temporary architecture from an accidental defect. Never hide known debt inside a task note.

## Asset lifecycle

`REQUESTED -> REFERENCED -> DESIGNED -> GENERATED -> REVIEWED -> APPROVED -> MANIFESTED -> INTEGRATED -> BROWSER_TESTED -> ACCEPTED`

Rejected, superseded, and rework states remain recorded. A PNG is not integrated merely because it exists in the repository.

Each asset record needs an owner, asset ID, source references, license or provenance notes, true top-down compliance, target scale, anchor, frames, manifest path, runtime fallback, test status, and replacement criteria.

## Performance budgets

Budgets are guardrails, not permission to sacrifice correctness silently.

Track at minimum:

- boot success and visible canvas;
- mobile frame stability;
- listener and interval cleanup;
- image and texture memory;
- save and load time;
- main-thread stalls;
- UI responsiveness;
- asset dimensions and download weight;
- automated test and build time.

Any budget regression must be measured, documented, and either repaired or consciously accepted by the Producer.

## Research register

Research tasks use isolated branches or folders and must state:

- question;
- hypothesis;
- time box;
- production files prohibited;
- evidence;
- result;
- recommendation;
- integration prerequisites.

A successful experiment is not production approval.
