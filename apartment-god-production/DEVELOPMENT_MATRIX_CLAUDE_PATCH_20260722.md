# Development Matrix — Claude Patch 2026-07-22

> Matrix patch file. The canonical `apartment-god-production/DEVELOPMENT_MATRIX.md` is frozen at
> 2026-07-13. **Canonical merge pending: yes.** Nothing below marks planned work as implemented or
> untested runtime work as complete. This patch records an inspection-only audit and its findings.

- **Branch:** `claude/repository-evaluation-20260722` (base `origin/phaser-migration@3e87220`)
- **Change class:** Documentation / audit only. No runtime, visual, sprite, object, animation, or
  architecture code changed.

## Audit control-board updates (status of what actually exists)

| Item | Prior canonical status (07-13) | Observed status (07-22, code-verified) | Notes |
|---|---|---|---|
| Live runtime | Phaser deepening `PLANNED`; canvas fallback active | `bootPhaserParityGame` is the ONLY live boot path; CI green | Canonical matrix is stale; real state lives in 07-14→07-19 patch trail |
| Phaser nativeness | n/a | PARTIAL (hybrid host + compatibility-canvas textures + SVG actors) | Do not mark objects as fully native Phaser sprites |
| Mobile scale fix (07-19 head) | n/a | `NEEDS_TESTING` — unverified on device | Predecessor 07-18 fix was proven wrong live |
| Pre-parity boot pair (`phaserRuntime.js` + `canvasRuntime.js`) | n/a | DEAD ORPHAN (~470 LOC, no live importer) | Removal candidate (task T2), backup + suite required |
| `animeVisualLayer.js` underlay | Disabled 07-13 | Confirmed live no-op (`return false`) still called from `rendering.js:5` | Cleanup candidate (task T4) |
| Regression tests (`phaser-canvas-ownership`, `phaser-full-parity`) | n/a | Assert source *text*, not behavior | Weak; behavior boot test proposed (T3) |
| Canonical docs (matrix/log/IMPLEMENTATION_STATUS) | Current | STALE/CONTRADICTORY vs. live Phaser-default | Reconciliation proposed (T1) |

## Proposed safe tasks (NOT implemented — awaiting Kam approval)

- **T1** Reconcile canonical docs (docs-only, very low risk).
- **T2** Remove dead orphan runtime pair (low risk, backup + suite first).
- **T3** Add real headless boot smoke test (low-medium risk, additive).
- **T4** Remove live no-op `animeVisualLayer.js` stub (low risk).
- **T5** Consolidate mobile canvas sizing to one authority (medium risk; backup + Kam device test
  required; defer until current head is device-verified).

All proposed tasks target the single live `phaser-migration` → `dist` build. None touch `main`,
Render settings, or `Kalomika/ai-rpg-engine`. No duplicate/parallel systems proposed.

**Status language:** inspected and documented only — not modified, not built, not browser tested, not
Render tested.
