# Top Shot Handoff

## Current status

Top Shot is a top down Three.js AI arena combat prototype isolated under `top-shot/`.

The stable branch is `top-shot-v0-1`.

A backup branch was created before Starshot work:

`backup/top-shot-v0-1-2026-07-10`

The current experimental Starshot branch is:

`top-shot-starshot-engine`

## Source of truth

Read these before any Top Shot task:

1. `top-shot/AGENTS.md`
2. `top-shot/docs/TOP_SHOT_HANDBOOK.md`
3. `top-shot/docs/HANDOFF.md`
4. `top-shot/docs/DEVELOPMENT_LOG.md`
5. `top-shot/docs/FEATURE_INVENTORY.md`
6. `top-shot/docs/ARCHITECTURE.md`
7. `top-shot/docs/QA_CHECKLIST.md`
8. Recent commits on the active branch
9. Open PRs related to Top Shot
10. The exact files to edit

## Latest stable documentation pass

Branch:

`top-shot-v0-1`

Implemented:

- Added Top Shot specific agent instructions.
- Added full Top Shot handbook.
- Added repo memory docs for handoff, development log, feature inventory, architecture, QA, and Starshot roadmap.
- Preserved stable runtime. This pass is documentation only on the stable branch.

## Current Starshot state

`top-shot-starshot-engine` is intended for ambitious engine work.

It currently inherits the debug overlay branch and has begun a first motion/animation slice. Treat it as experimental and not merge ready until checks run and browser behavior is verified.

## Important branches

Stable:

`top-shot-v0-1`

Backup:

`backup/top-shot-v0-1-2026-07-10`

Experimental:

`top-shot-starshot-engine`

Debug overlay PR branch:

`top-shot-debug-overlay`

## Required checks

From `top-shot/`:

```bash
npm run check
npm run smoke
npm run build
```

## Manual QA focus

- Match mode loads.
- CQC Lab loads.
- Fighter selection works.
- Fighters move, fight, use cover, and use stealth.
- Mounting and grounded CQC still work.
- Projectiles and effects render.
- Debug overlay toggles with `D`.
- Collision debug toggles with `C`.
- No console errors on start.
- No obvious visual squashing.

## Do not touch without explicit reason

- Apartment God main runtime.
- Stable Top Shot runtime for risky changes.
- Existing working CQC behavior unless replacing it is the explicit task.

## Required completion report

Every coding pass must report:

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
