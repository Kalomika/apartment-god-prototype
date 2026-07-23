# Apartment God Studio Operating Protocol

## Producer Protocol

The Producer is the routing and integration authority. It should not begin feature implementation until orientation is complete.

## Producer intake

For every request:

1. Restate the concrete requested outcome.
2. Identify whether the request is documentation, research, asset production, runtime implementation, audit, QA, integration, or release promotion.
3. Inspect current branch head, recent commits, open PRs, active claims, logs, matrix entries, and relevant source files.
4. Determine whether another branch or PR already contains useful or conflicting work.
5. Check dependencies, protected systems, backup requirements, and test requirements.
6. Assign exactly one primary department and any required reviewers.
7. Create or select one task ID and one claim ID.
8. Set scope exclusions before implementation.

## Assignment priority

Choose work in this order:

1. Boot, data-loss, save corruption, blank-canvas, or severe playability regressions.
2. Explicit current requests from Kam.
3. Work blocking stable `phaser-migration` parity and mobile usability.
4. Dependencies blocking multiple tasks.
5. QA and integration work that can safely promote completed slices.
6. High-value feature work.
7. Research and speculative work.

Do not choose work solely because it is interesting or easy.

## Eligibility check

A task is eligible only when:

- status is `READY`, `NEEDS_REPAIR`, or `NEEDS_REVIEW`;
- no valid active claim owns it;
- required dependencies are satisfied or the task is specifically dependency-clearing;
- the department is authorized for the files and system;
- required reference material exists;
- required backup is present;
- runtime work is allowed by the current request.

## Risk classes

- `LOW`: documentation, inventory, isolated tests, non-runtime analysis.
- `MEDIUM`: localized UI, object, asset, or module work with established fallbacks.
- `HIGH`: movement, autonomy, save, routing, renderer, vehicle, phone, menus, major layout, or broad integration.
- `CRITICAL`: branch promotion to `main`, destructive migration, data format changes, or changes that can blank or corrupt the game.

High and critical work require explicit backup evidence and an integration reviewer. Critical work requires Kam's explicit instruction.

## Production points

Use points to plan review cadence, not commits or lines of code.

- 1: tiny documentation or metadata correction.
- 3: bounded analysis, test, or small safe fix.
- 5: meaningful single-module feature or asset slice.
- 8: multi-file subsystem slice.
- 13: high-risk system change or integration package.

Review triggers:

- 25 accumulated accepted points: department review.
- 75 accumulated accepted points: integration sprint review.
- 150 accumulated accepted points: milestone review.

Any critical risk or boot regression forces immediate review regardless of points.

## Producer output

Before work begins, record:

- task ID;
- claim ID;
- department;
- exact branch;
- allowed files or folders;
- prohibited files or folders;
- dependencies;
- risk class;
- points;
- backup;
- required tests;
- required reviewers;
- acceptance criteria.

After work, record the evidence, release the claim, and update the task state. A Producer cannot mark browser-dependent work `VERIFIED` without browser evidence.

---

## Department Registry and Ownership

A worker has one primary department per task. Reviewers may come from other departments without taking ownership.

| Department | Owns | Does not own | Required handoff |
|---|---|---|---|
| Producer | priorities, assignment, dependencies, claims, escalation, integration planning | feature implementation by default | task packet and final routing |
| Gameplay Systems | rules, interactions, activities, state consequences | visual asset production, branch promotion | QA plus Architecture when cross-system |
| Actor Intelligence | autonomy, needs, routines, memory, choice | renderer replacement, release promotion | Gameplay, Movement, QA |
| Movement and Routing | navigation, approach points, blockers, stairs, doors | activity design, visual art | Actor Intelligence, World, QA |
| World and Objects | room data, object definitions, collision intent, placements | character animation, release | Movement, Gameplay, QA |
| Animation | activity state identity, entry-loop-exit, direction and alignment | broad generic interaction fallback as final | Character Art, Technical Art, QA |
| Character Art | human and dog sprite design, anatomy, direction sheets | runtime wiring without integration handoff | Animation, Technical Art |
| Environment Art | rooms, furniture, props, lighting, painterly surfaces | collision or routing changes without World approval | World, Technical Art, QA |
| Technical Art | manifests, anchors, scaling, asset loaders, safe fallbacks | unilateral visual direction | Art owners, Integration, QA |
| UI and Mobile UX | phone, menus, controls, responsive layout, accessibility | gameplay rules hidden inside UI | Gameplay, QA |
| Narrative and Simulation Design | traits, careers, events, dialogue intent, consequences | direct runtime edits unless assigned jointly | Gameplay, Actor Intelligence |
| Audio | music, SFX, mixing behavior, audio triggers | unrelated gameplay logic | Gameplay, QA |
| QA | test design, evidence review, regression triage, status recommendation | product approval or unreviewed fixes | Producer and owning department |
| Architecture Review | system boundaries, ownership maps, duplicate-system prevention | routine implementation | Producer and Integration |
| Integration | safe merges, compatibility, release candidate assembly | feature invention | QA, Architecture, Producer |
| Build and Performance | build integrity, CI, budgets, diagnostics | Render settings or deployment without instruction | Integration and QA |
| Research Lab | isolated prototypes, references, feasibility studies | direct production integration | Producer and Architecture |
| Documentation and Memory | handbooks, logs, matrices, decisions, indexes | changing product scope | all departments supply evidence |

## Cross-department rule

A task may list supporting departments, but one department owns delivery. When ownership changes, close or transfer the current claim with a handoff entry. Do not create two competing implementations under different department names.

## File boundary examples

Runtime files under `src/` require an explicitly authorized runtime task.

Asset-only workers should remain under approved asset and production folders.

QA may add tests and reports, but should not quietly repair runtime code under a QA claim. Create a repair task and assign the owning department.

Research output remains isolated until Architecture Review and Producer approval.

---

## Role Board

This board describes persistent roles, not temporary task claims. Availability means a new worker may adopt the role for an eligible task.

| Role ID | Role | Department | Status | Current focus | Restrictions |
|---|---|---|---|---|---|
| ROLE-PROD-01 | Producer | Producer | AVAILABLE | Repository orientation and assignment | No feature coding by default |
| ROLE-ARCH-01 | Architecture Reviewer | Architecture Review | AVAILABLE | Duplicate-system and boundary review | Read-first, approval role |
| ROLE-GAME-01 | Gameplay Engineer | Gameplay Systems | AVAILABLE | Object and activity behavior | Runtime authorization required |
| ROLE-AI-01 | Actor Intelligence Engineer | Actor Intelligence | AVAILABLE | Autonomy and routine systems | High-risk backup required |
| ROLE-MOVE-01 | Movement Engineer | Movement and Routing | AVAILABLE | Pathfinding and object approach | High-risk backup required |
| ROLE-WORLD-01 | World Systems Designer | World and Objects | AVAILABLE | Layout, objects, collisions | Coordinate with Movement |
| ROLE-ANIM-01 | Animation Director | Animation | AVAILABLE | Unique activity identities | No generic final poses |
| ROLE-CHAR-01 | Character Art Lead | Character Art | AVAILABLE | Human and dog sprite quality | True top down only |
| ROLE-ENV-01 | Environment Art Lead | Environment Art | AVAILABLE | Rooms, props, lighting | No routing edits alone |
| ROLE-TA-01 | Technical Artist | Technical Art | AVAILABLE | Manifests, anchors, fallbacks | Preserve safe runtime fallback |
| ROLE-UI-01 | UI and Mobile Engineer | UI and Mobile UX | AVAILABLE | Phone, menus, mobile usability | Runtime authorization required |
| ROLE-QA-01 | QA Lead | QA | AVAILABLE | Acceptance tests and regression evidence | Cannot grant creative approval |
| ROLE-INT-01 | Integration Engineer | Integration | AVAILABLE | Compatible package assembly | Cannot update main without Kam |
| ROLE-BUILD-01 | Build and Performance Engineer | Build and Performance | AVAILABLE | CI, diagnostics, budgets | No Render settings |
| ROLE-RES-01 | Research Lead | Research Lab | AVAILABLE | Isolated experiments | No production integration |
| ROLE-DOC-01 | Studio Archivist | Documentation and Memory | AVAILABLE | Logs, matrix, decisions | No scope invention |

## Status values

`AVAILABLE`, `RESERVED`, `ACTIVE`, `BLOCKED`, `REVIEW_ONLY`, `RETIRED`

Task ownership is recorded in the Active Claims Ledger below and `studio/state/studio-state.json`. Changing a role to `ACTIVE` without a claim does not reserve work.

---

## Task Board

This file is the human-readable task index. Machine-readable records live in `studio/state/studio-state.json`.

## Status values

`BACKLOG`, `BLOCKED`, `READY`, `CLAIMED`, `IN_PROGRESS`, `NEEDS_REVIEW`, `NEEDS_TESTING`, `ACCEPTED`, `REJECTED`, `SUPERSEDED`

## Initial governance tasks

| Task ID | Title | Department | Status | Risk | Points | Dependencies | Acceptance |
|---|---|---|---|---|---:|---|---|
| STUDIO-001 | Install repository-native studio governance | Documentation and Memory | NEEDS_REVIEW | LOW | 8 | none | Core files, templates, state, audit tool, and workflow exist |
| STUDIO-002 | Reconcile older production-manager department branch | Producer | READY | LOW | 3 | STUDIO-001 | Useful department records mapped without overwriting current production truth |
| STUDIO-003 | Populate current gameplay task inventory from matrix and active PRs | Producer | READY | LOW | 5 | STUDIO-001 | No duplicate tasks, current branch evidence attached |
| STUDIO-004 | Run first Architecture Review of active Apartment God systems | Architecture Review | READY | MEDIUM | 8 | STUDIO-003 | Ownership map and duplicate-system findings recorded |
| STUDIO-005 | Define browser QA dashboard requirements | QA | BACKLOG | MEDIUM | 5 | STUDIO-003 | Developer-only checklist design, no shipping UI contamination |
| STUDIO-006 | Implement optional developer QA dashboard | UI and Mobile UX | BLOCKED | MEDIUM | 8 | STUDIO-005, explicit runtime authorization | Safe dev-mode UI with persisted evidence |
| STUDIO-007 | Establish department and milestone point ledger | Producer | READY | LOW | 3 | STUDIO-001 | Accepted points and review triggers recorded |
| STUDIO-008 | Audit canonical log and matrix sidecar merge debt | Documentation and Memory | READY | LOW | 5 | STUDIO-001 | Pending append and patch files indexed, merge plan recorded |

## Adding a task

Use the task template in `studio/TEMPLATES.md`. Every task must name the source directive, current evidence, scope, exclusions, owner department, dependencies, risk, points, backup rule, acceptance criteria, and required tests.

---

## Active Claims Ledger

A valid claim is the exclusive temporary ownership record for one task. Claims must also be represented in `studio/state/studio-state.json`.

## Claim states

`ACTIVE`, `BLOCKED`, `HANDOFF_PENDING`, `RELEASED`, `EXPIRED`, `CANCELLED`

## Active claims

No active implementation claim is recorded at installation time.

## Claim rules

1. Read recent commits, open PRs, task status, and this ledger immediately before claiming.
2. Use one claim per task. A coordinated pair shares one claim with named primary and reviewer.
3. Record branch, starting commit, exact scope, allowed paths, prohibited paths, and expected evidence.
4. Do not use a claim to reserve a broad department indefinitely.
5. Refresh the claim after meaningful progress by committing evidence or updating the record.
6. A claim with no repository activity for 24 hours may be marked `EXPIRED` by the Producer after checking open PRs and branches.
7. A blocked worker must record the blocker rather than silently holding the task.
8. Release after handoff, rejection, supersession, or cancellation.
9. Never delete claim history.

## Claim record format

Use the claim template in `studio/TEMPLATES.md`.

## Conflict resolution

The first valid repository claim wins. If another worker has already implemented the same outcome without a claim, the Producer must inspect it before assigning duplicate work. Existing implementation evidence outranks an empty claim.
