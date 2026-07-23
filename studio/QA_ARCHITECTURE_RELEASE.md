# QA, Architecture, Integration, and Release Controls

## QA and Approval Protocol

## Separate gates

Every deliverable is evaluated through distinct gates:

1. Structural: files, schemas, references, and required records exist.
2. Technical: build, tests, code inspection, and runtime behavior satisfy requirements.
3. Regression: previously working behavior remains intact.
4. Creative: Kam's visual, animation, tone, and experiential direction is respected.
5. Integration: dependencies and neighboring systems remain compatible.
6. Release: branch promotion rules and evidence are satisfied.

Passing one gate does not imply another.

## Evidence levels

- `DOC_REVIEW`: documentation or schema inspection.
- `CODE_INSPECTION`: source reviewed but not executed.
- `AUTOMATED_TEST`: test suite or static checks passed.
- `LOCAL_RUNTIME`: tested in a local runtime.
- `BROWSER_RUNTIME`: tested in a browser.
- `DEVICE_RUNTIME`: tested on the target device class.
- `RENDER_RUNTIME`: tested on the Render playable build.
- `KAM_APPROVED`: Kam explicitly accepted the result.

Use the highest evidence actually obtained. Never infer a higher level.

## Feature review cadence

Review immediately after a meaningful feature or repair slice. Do not wait for an arbitrary commit count.

Department reviews occur after 25 accepted production points. Integration reviews occur after 75. Milestone reviews occur after 150. High-risk changes may force earlier reviews.

## Required QA packet

- task and claim IDs;
- branch and commit;
- files changed;
- runtime files changed;
- requirement-to-evidence mapping;
- tests performed with results;
- untested conditions;
- regression list;
- screenshots or recordings when visual behavior matters;
- creative approval status;
- known risks;
- rollback route;
- exact next test.

## Status recommendations

- `ACCEPTED`: required evidence exists at the stated level.
- `NEEDS_TESTING`: implementation exists but required runtime evidence is missing.
- `NEEDS_REWORK`: evidence proves a defect or requirement miss.
- `BLOCKED`: required environment, asset, dependency, or permission is unavailable.
- `REJECTED`: direction violates established rules or Kam's explicit decision.

## In-game QA dashboard policy

A future developer QA dashboard may provide feature-specific checklists and record pass, fail, notes, screenshot reference, device, branch, and commit. It must be dev-mode only, excluded or disabled in shipping behavior, and cannot replace automated tests or repository evidence.

---

## Architecture Review Board

Architecture Review prevents duplicate systems, conflicting state ownership, brittle patch layers, and incompatible branch work.

## Review triggers

Architecture review is required when work:

- adds a new manager, global state owner, renderer layer, event loop, interval, listener registry, save schema, navigation system, asset loader, UI shell, or simulation subsystem;
- duplicates behavior already present in another module or active PR;
- changes ownership between Canvas, Phaser, overlays, or compatibility layers;
- spans more than one department;
- changes save data or branch promotion assumptions;
- introduces a temporary compatibility layer likely to persist.

## Review questions

1. Which module owns the state?
2. Which module owns rendering?
3. Which module owns timing and cleanup?
4. What existing system already solves part of this?
5. What active branch or PR conflicts with it?
6. What is the fallback?
7. How is it removed or replaced later?
8. How does save normalization handle it?
9. How is boot protected?
10. How will the system be tested and observed?
11. What files are authorized to change?
12. Is this the smallest auditable source fix?

## Decision states

`APPROVED`, `APPROVED_WITH_CONDITIONS`, `REVISE`, `REJECTED`, `SUPERSEDED`

Record decisions in `studio/MEMORY_AND_REGISTERS.md` using a stable decision ID such as `ADR-AG-0001`.

## Anti-duplication rule

Do not solve a conflict by letting two systems run and hoping one wins. Select one owner, migrate deliberately, preserve fallbacks only where necessary, and document deletion criteria.

---

## Branch, Integration, and Promotion Protocol

## Branch roles

- `phaser-migration`: active Apartment God development.
- `main`: Render playable branch.
- `backup/...`: restore points.
- feature or work branches: isolated work when concurrent or risky changes require separation.
- Top Shot branches: separate project history and not Apartment God implementation sources.

## Development rule

New Apartment God feature work must not be authored directly on `main`.

When multiple agents are active, prefer an isolated work branch based on the latest `phaser-migration`, then open a draft PR or prepare a fast-forward-safe handoff. Do not merge merely because a PR is mergeable.

## Promotion gates to phaser-migration

- current base and head inspected;
- task and claim valid;
- required backup exists;
- architecture review complete when triggered;
- tests passed at required level;
- logs and matrix status updated;
- no unexplained runtime or asset changes;
- no conflict with newer work;
- claim released or moved to review.

## Promotion gates to main

`main` may move only when:

1. Kam explicitly requests a Render playable update.
2. Current `main` backup exists.
3. Source branch and exact commit are confirmed.
4. The package is tested at the required level.
5. Known risks and exact browser tests are recorded.
6. Render settings remain unchanged.
7. The action is logged.

Do not manually trigger Render or change its settings.

## Reversion

Every promotion packet must name a backup branch or known good commit and the exact files or systems at risk. A revert is logged as a new event. Do not erase failed history.
