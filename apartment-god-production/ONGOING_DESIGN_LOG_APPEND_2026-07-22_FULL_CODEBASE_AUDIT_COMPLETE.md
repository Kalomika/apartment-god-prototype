# Ongoing Design Log Append: Full Codebase Audit Complete

Date: 2026-07-22
Status: AUDIT COMPLETE, REPAIR REQUIRED
Branch: phaser-migration-2
Audit directive commit: `0be7492660887d6de7ec4937327cce8641f48e5a`
Audit start commit: `a03d11a4ee87d3f96e25778ee242891b6af71e16`
Audit report commit: `e9fc503998294bad9a41f7266eac5f737359089c`
Matrix patch commit: `8484c6dd0e618020a98ce3bc6d833665388395c7`
Files changed: documentation only
Runtime files changed: no
Render playable branch updated: no
Main touched: no
Render settings changed: no
Manual deployment triggered: no
Protected repository touched: no
Backup branch: not required for documentation-only audit

## Summary

Kam reported major issues across the project and requested a serious whole-codebase audit. The audit confirms systemic defects rather than isolated visual complaints.

The branch is not safe for main promotion. It is deeply diverged from main, has no single renderer or UI owner, uses correction overlays and coordinate reassignment to mask source problems, contains simulation defects, and relies on verification scripts that do not prove browser gameplay.

The full ranked report is:

`apartment-god-production/PHASER_MIGRATION_2_FULL_CODEBASE_AUDIT_2026-07-22.md`

The corresponding matrix patch is:

`apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-22_FULL_CODEBASE_AUDIT.md`

## Highest-severity confirmed findings

- P2 is approximately 184 commits ahead and 193 commits behind main.
- Handbook and canonical matrix branch declarations are stale.
- Eight overlapping visual, HUD, fallback, and parity systems modify shared presentation state.
- Needs drain only while actors are idle.
- Resident going offsite can accelerate time while others remain home.
- Action consequences and visual identity rely on display text and broad regex matching.
- General movement teleports actors to a final waypoint after repeated block recovery.
- Runtime regression guards teleport diners, stair users, and couch-trapped actors.
- Vehicle routing can force travelers to seat coordinates.
- Pool uses a separate coordinate movement system outside general collision routing.
- Object display rotation and collision footprints can disagree.
- Save loading replaces the canonical global object array with saved objects.
- Refresh restore lacks strict schema migration enforcement.
- Clothing tint overlays are not a true modular garment system.
- Activity sprites use generic category placement, whole-pose rotation, nearest-object fallback, and lazy replacement.
- Room visuals are stretched 128-by-128 panels combined with multiple architecture layers.
- Time and money were moved, but permanent navigation still overlays the playfield.
- CSS, inline fit code, and the preview iframe compete for mobile layout authority.
- `npm run check` is mainly syntax validation.
- `npm run build` is a static copy process, not an application compilation or browser verification.
- Many tests validate source strings rather than actual behavior.
- The latest broad modern procedural reconstruction report failed and did not reach build.
- Broad direct-push rewrite workflows create overwrite and branch-race risk.

## Implementation details

No runtime changes were made. This preserved the exact branch state for inspection and obeyed the no-broad-implementation rule.

The audit inspected branch lineage, required project rules, canonical production documents, boot and scene lifecycle, simulation order, movement, actions, autonomy, save/refresh state, world layout and corrections, regression guards, vehicles, travel, pool, arcade, native gameplay visuals, character animation, clothing layers, activity and state sprites, room assets, UI and mobile sizing, phone and camera lifecycle, tests, checks, build, workflows, CI reports, manifests, representative assets, and preview architecture.

## Testing performed

- GitHub repository access verified.
- Latest P2 branch state checked before and after inspection.
- Main-versus-P2 branch comparison completed.
- Required handbook and policies read.
- Active runtime dependency paths inspected by source.
- Representative assets and manifests inspected.
- Test, build, check, workflow, and CI contracts inspected.
- No runtime test suite was executed in this documentation-only connector pass.
- No browser gameplay claim was made.

## Testing requested

Do not use browser testing as a substitute for source repair yet. After the first blocker repair commit series, run:

- `npm run lint`
- the renamed syntax check
- full unit tests
- a real bundled or import-validated build
- Playwright against the built output
- deterministic one-day simulation tests
- blocked-route tests with no teleport allowance
- partial-household offsite tests
- old/corrupt save migration tests
- portrait and landscape mobile obstruction tests

## Known risks

Other GPTs may continue changing P2. Before beginning repairs, re-check branch head and all audit-targeted files. Direct-push rewrite workflows are a specific concurrency risk.

The AppDeploy preview is commit-pinned and can become stale relative to the branch. Its passing launcher tests do not establish deep gameplay correctness.

## Exact next step

Create or confirm a fresh backup from the exact repair-start SHA, then begin a narrow blocker stabilization sprint with no visual expansion:

1. Add failing tests for continuous needs, household-aware time scale, and no route teleport.
2. Fix those three defects in source.
3. Add built-browser verification.
4. Only after those pass, consolidate presentation ownership in a separate backed-up phase.

Main and Render must remain unchanged unless Kam explicitly authorizes promotion later.
