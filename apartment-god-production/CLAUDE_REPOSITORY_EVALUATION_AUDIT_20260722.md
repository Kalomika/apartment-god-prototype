# Apartment God — Independent Repository Evaluation Audit

- Audit type: Inspection and capability evaluation only (NO runtime changes)
- Author: Claude (independent evaluation agent)
- Date: 2026-07-22
- Branch audited: `claude/repository-evaluation-20260722`
- Base: `origin/phaser-migration` HEAD `3e8722052e7dc4fbf781b11979f339327b8b6b06` ("Record successful CI for mobile scale conflict fix", 2026-07-19)
- Repository: `Kalomika/apartment-god-prototype`
- Scope guard honored: `Kalomika/ai-rpg-engine` not accessed; `main` not touched; Render not deployed or reconfigured.

> This document is documentation-only. No source, asset, config, or runtime file was
> modified during this audit. All claims are backed by file paths and line numbers from
> the checkout above. Where the audit could not verify a behavior (browser/mobile/Render),
> it says so explicitly rather than asserting completion.

---

## 0. Method and evidence base

Read in full or in substantial part: the standing rulebook set (`docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md`
and its append/update fragments, `APARTMENT_GOD_BACKUP_POLICY.md`, `APARTMENT_GOD_NO_BROAD_IMPLEMENTATION_RULE.md`,
`APARTMENT_GOD_COMMANDER_EXECUTION_RULE.md`, `APARTMENT_GOD_FULL_CODE_AUDIT_CADENCE_RULE.md`,
`APARTMENT_GOD_IDEA_LOGGING_RULE.md`, `APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md`,
`APARTMENT_GOD_TOP_SHOT_REPOSITORY_SEPARATION.md`, `docs/FEATURE_INVENTORY.md`,
`docs/IMPLEMENTATION_STATUS.md`), the canonical control docs
(`apartment-god-production/DEVELOPMENT_MATRIX.md`, `apartment-god-production/ONGOING_DESIGN_LOG.md`),
the parity/bug/regression records (`PHASER_PARITY_AUDIT_2026-07-17.md`,
`BUG_AUDIT_2026-07-13_MOVEMENT_EGRESS.md`, `BUG_AUDIT_2026-07-13_PRETEST_RELEASE_AUDIT.md`,
`BLACK_SCREEN_INVESTIGATION_2026-07-14.md`, `RENDER_CACHE_DOG_REGRESSION_2026-07-14.md`), and the
most recent 07-17 → 07-19 `DEVELOPMENT_MATRIX_PATCH_*` / `ONGOING_DESIGN_LOG_APPEND_*` /
`IDEA_BIBLE_APPEND_*` files. Traced the live and dead runtime import graphs directly in `src/`.
Confirmed CI state via GitHub Actions.

Environment constraint (stated honestly per Testing Rules): `node_modules/` is **not installed**
in this checkout (`npm ls phaser` → empty; pinned `phaser ^3.90.0`). No `npm test`, `npm run build`,
or browser/Playwright run was performed by this audit. Findings are **verified by code inspection
and documentation review**, plus the repository's own green CI on the head commit.

---

## 1. Current architecture summary

Apartment God is a browser, single-page, static-hosted 2D life-sim ("true top-down") prototype.
Render.com serves the `dist/` output of `npm run build` as a static site (`render.yaml`,
`runtime: static`, catch-all rewrite to `/index.html`). There is no backend.

**Live boot path (single, confirmed):**

```
index.html
  → <script type="module" src="./src/main.js?v=20260719-mobile-scale-conflict-fix">
    → src/main.js  (marks canvas.dataset.phaserOwned='true', then dynamic import)
      → src/phaserParityRuntime.js  → bootPhaserParityGame()
          → new Phaser.Game({ type: Phaser.CANVAS, canvas, parent:'game-wrap',
                               scale:{ mode: FIT, autoCenter: NO_CENTER, 960x720 } })
          → class ApartmentGodParityScene extends Phaser.Scene
```

Evidence: `index.html:86`, `src/main.js:1-11`, `src/phaserParityRuntime.js:40-65`.

**Rendering model — hybrid, not native-Phaser (important).** The Phaser scene is a *host/compositor*.
In `create()` it builds two offscreen canvases, draws the world into them using the legacy
immediate-mode 2D renderer (`src/rendering.js` `drawPhaserEnvironment` / `drawPhaserForeground`,
imported at `phaserParityRuntime.js:22`), then uploads them as Phaser canvas textures
(`this.textures.addCanvas(...)`, `phaserParityRuntime.js:111-115`). Character art is loaded as
**SVG** via `this.load.svg(key, path, {width:512,height:512})` (`phaserParityRuntime.js:88`).
This matches the project's own note: *"Native Phaser Status: PARTIAL — Environment and foreground
still include compatibility-canvas textures"* (`DEVELOPMENT_MATRIX_PATCH_2026-07-18_FULL_PHASER_REGRESSION_REPAIR.md`).

**Subsystems (all under `src/`, ~94 JS files, ~17k LOC).** State/save (`state.js`, `saveSystem.js`),
time/calendar (`timeSystem.js`, `calendarRuntime.js`), actor autonomy and movement
(`autonomy.js`, `movement.js`, `gateTraversalGuard.js`, `southWalkFacingGuard.js`,
`frontYardRoutingCorrection.js`), activity systems (`arcadeSystem.js`, `basketballSystem.js`,
`poolActivitySystem.js`, `tidinessSystem.js`, `lifeQualitySystem.js`), world/layout
(`world.js`, `frontYardDriveway.js`, `config.js`), rendering stack (`rendering.js`,
`renderObjects.js`, `renderEntities.js`, `renderDynamic.js`, `renderHouseStyle.js`,
`renderWorld.js`), input/camera/UI (`cameraNavigation.js`, `ui.js`, `phoneUI.js`), and a
layered correction/overlay tier applied on top of the base runtime
(`phaserParityCorrections.js`, `phaserVisualParityOverlay.js`, `runtimeObjectCorrections.js`,
`phaserCharacterAnimationSystem.js`, `requestedVisualCorrections.js`, `visualRegressionFixes.js`,
`objectCorrectiveOverlays.js`, `visualReplacementClears.js`).

**Architectural characterization:** a working base runtime with a thick, historically accreted
"corrections/overlays" layer stacked on top. Much visual behavior is achieved by post-hoc overlay
passes rather than by fixing the base draw, which is a maintainability risk (see §7) but is *not*
itself a bug.

**Governance architecture:** the repo also co-hosts a second, unrelated game ("Top Shot") on other
branches; `docs/APARTMENT_GOD_TOP_SHOT_REPOSITORY_SEPARATION.md` warns agents not to read Top Shot
history as Apartment God requirements. Extensive process rules govern contributions (§8).

---

## 2. Active builds / runtime variants

There is **one active runtime variant** on this branch, plus one dead orphan variant and one
disabled stub.

| Variant | Entry symbol | Status | Evidence |
|---|---|---|---|
| **Full Phaser Parity runtime** (LIVE) | `bootPhaserParityGame` (`phaserParityRuntime.js`) | The only path wired into `index.html`/`main.js`. CI green. | `index.html:86`, `main.js:8`, `phaserParityRuntime.js:40` |
| Pre-parity Phaser host + 2D-canvas fallback (DEAD ORPHAN) | `bootPhaserGame` (`phaserRuntime.js`) → `bootCanvasGame` (`canvasRuntime.js`) | Imported by **nothing** live. A test asserts `main.js` must NOT contain `bootCanvasGame`. ~470 LOC dead. | `grep` importers of `phaserRuntime`→∅; `canvasRuntime` imported only by `phaserRuntime.js`; `tests/phaser-full-parity.test.js:19` |
| Anime environment underlay (DISABLED STUB) | `drawAnimeEnvironmentUnderlay` (`animeVisualLayer.js`) | Live in the import graph (`rendering.js:5`) but returns `false` — intentional no-op, disabled 2026-07-13. | `src/animeVisualLayer.js` |

Build variants: a single `dist/` produced by `scripts/build.js` (`npm run build`), served statically
by Render. CI additionally verifies `dist/vendor/phaser.esm.js` exists and `dist/src/main.js`
contains `bootPhaserParityGame` (`.github/workflows/phaser-parity-ci.yml`).

`apartment-god-production/` is **not** a second code build — it contains zero `.js` files; it is a
~150-file markdown devlog/audit archive outside the build and test pipeline.

---

## 3. Playability risk assessment

Overall: **playable per automated CI and code inspection; NOT verified playable by any human/browser/
mobile/Render test anywhere in the project record.** Every 07-14 → 07-19 change is stamped
`NEEDS_TESTING` / `NEEDS_RENDER_TESTING`; no document claims Kam-verified completion.

Risk register:

- **R1 — Boot fragility (MEDIUM).** Boot depends on a dynamic `import('/vendor/phaser.esm.js')`
  (`phaserParityRuntime.js:44`) and on SVG actor assets loading; `create()` throws if any required
  actor asset fails (`phaserParityRuntime.js:97`). There is a hard-boot error draw
  (`drawHardBootError`) as a guard, which is good, but the project has a documented history of a
  full **black-screen mobile boot failure** (`BLACK_SCREEN_INVESTIGATION_2026-07-14.md`) that forced
  an emergency revert. The standing instruction "do not route Render playable through Phaser host
  again until a browser/mobile boot test proves the playfield renders" has *not* been satisfied by a
  recorded test.
- **R2 — Mobile scale unverified (MEDIUM/HIGH on mobile).** See §4. The 07-19 fix is the current
  head and is unverified on a real device; the immediately prior (07-18) fix was proven wrong by a
  live Android screenshot.
- **R3 — Movement egress class bug (LOW now, previously HIGH).** Actors could get stuck `Blocked`
  inside solid furniture footprints; fixed in `src/movement.js` per
  `BUG_AUDIT_2026-07-13_MOVEMENT_EGRESS.md`, but the fix was code-inspection-verified only.
- **R4 — Overlay-stack ordering (MEDIUM).** Multiple correction/overlay passes
  (`phaserParityCorrections`, `phaserVisualParityOverlay`, `runtimeObjectCorrections`,
  `requestedVisualCorrections`, `visualRegressionFixes`, `objectCorrectiveOverlays`) run after the
  base render. Draw-order/idempotency mistakes here caused prior duplicate-layer bugs
  (`BUG_AUDIT_2026-07-13_PRETEST_RELEASE_AUDIT.md`). Changes in this tier are high-blast-radius.
- **R5 — Stale-asset/caching dependence (LOW-MEDIUM).** The app leans on `?v=YYYYMMDD` query strings
  on every module import plus `no-store`/`Pragma`/`Expires` meta tags (`index.html:6-8`,
  `main.js:1-8`) to defeat stale caches — evidence of a recurring cache-regression class
  (`RENDER_CACHE_DOG_REGRESSION_2026-07-14.md`), not a live bug but a fragile pattern.

---

## 4. Mobile usability assessment

Mobile is the **highest-risk axis** and the most active recent work stream (the "mobile scale
conflict" saga: commits `1c358ba`, `23ed220`, `59b22cb`, `4291c09`, `b7b7e9b`, `e54bac5`, → head
`3e87220`).

**Three concurrent sizing authorities touch the same `<canvas id="game">`:**

1. **Phaser Scale Manager** — `mode: FIT`, `autoCenter: NO_CENTER`, fixed 960×720 game size
   (`phaserParityRuntime.js:55-63`). `NO_CENTER` is the deliberate 07-19 change to stop Phaser from
   vertically centering the canvas and pushing it below the fold.
2. **`fit.js` (LIVE, via `rendering.js:1`)** — sizes `#game-wrap` and `#game` via CSS on
   `resize`/`orientationchange`/`pageshow` (`fit.js:52-66`). It contains a `phaserOwned` guard
   (`fit.js:10-15,44`) that skips assigning `canvas.width/height` and the wide-mode width when
   `canvas.dataset.phaserOwned === 'true'` (set in `main.js:6`) — partial coordination, but it still
   writes `canvas.style.width/height/margin/transform` unconditionally (`fit.js:27-33,60-63`).
3. **`main.js` `refreshPhaserScale()`** — on the same events, forces
   `canvas.style.margin='0'` / `transform='none'` then calls `game.scale.refresh()`
   (`main.js:13-29`).

This is the literal "scale conflict": overlapping CSS writes from `fit.js` and `main.js` plus the
Phaser FIT manager, all racing on `resize`/`orientationchange`. The current head reflects the latest
attempt to make `#game-wrap` the sole sizing authority, but **it is unverified on a device**, and
the project has already shipped one wrong "fix" in this exact area.

Other mobile notes:
- Viewport meta is correct (`width=device-width, initial-scale=1.0`, `index.html:5`).
- Layout uses `100dvh` and a wide/narrow split at `innerWidth >= 900` (`fit.js:9,17-59`).
- On-screen controls live in `#game-control-bar` (`index.html:44`), populated at runtime; input is
  additionally driven by camera swipe navigation and the Phaser UI (`installCameraSwipeNavigation`,
  `createUi(..., {externalInput:true})`, `phaserParityRuntime.js:118-119`).
- **No mobile browser test has ever run in-agent**: Playwright could not obtain a browser binary in
  prior sessions (per `docs/HANDOFF.md` and multiple logs); `npm run qa:mobile`
  (`tests/mobile-smoke.spec.js`) exists but is unrun here. All mobile confidence rests on Kam's
  screenshots and code inspection.

---

## 5. Phaser migration status assessment

**Status: functionally the default runtime, but PARTIAL and UNVERIFIED — not "complete."**

- The live entry is Phaser (`bootPhaserParityGame`), CI green on head (unit tests + static build +
  `phaser.esm.js` vendor check + `bootPhaserParityGame` entry grep, all `success` on `3e87220`).
- The migration is **hybrid**: Phaser hosts and composites, but the world is still painted by the
  legacy 2D renderer into canvas textures, and characters are SVG, not native Phaser sprite atlases
  (§1). The project's own matrix patch says native status is PARTIAL and warns *"Do not mark every
  object as converted to a native Phaser sprite."*
- **Documentation is contradictory and stale.** The *canonical* `DEVELOPMENT_MATRIX.md` and
  `ONGOING_DESIGN_LOG.md` are frozen at **2026-07-13** and still describe Phaser deepening as
  `PLANNED`; `docs/IMPLEMENTATION_STATUS.md` even says *"Broken Phaser asset renderer is disabled."*
  The real state (Phaser-as-default) lives only in unmerged `*_PATCH_*` / `*_APPEND_*` files for
  07-14 → 07-19, most marked "canonical merge pending." This is a governance gap, not a code bug.
- **No completion claim exists.** Every recent entry is `NEEDS_TESTING` / `NEEDS_RENDER_TESTING`.
  Promotion blockers in `PHASER_PARITY_AUDIT_2026-07-17.md` (~10 unmet conditions requiring Kam's
  approval of scale, character direction, dog, movement cadence, feature parity) remain open.

Net: migration is ~"in-progress, default-on, iteratively repaired, awaiting human verification."

---

## 6. Visual and sprite pipeline assessment

- **Character art is SVG, not raster spritesheets/atlases.** Files named like
  `assets/sprites/characters/dog/dog_8fps_sheet.svg`,
  `.../girlfriend/girlfriend_8fps_sheet.svg`, `.../resident/resident_8fps_sheet.svg`,
  `.../dog/top_down_dog_atlas.svg` imply frame-sheet/atlas semantics but are vector SVG, loaded via
  Phaser's `load.svg(...)` rasterized to 512×512 at load (`phaserParityRuntime.js:88`). Animation is
  driven procedurally by `phaserCharacterAnimationSystem.js` / `registerCharacterAnimations`, locked
  to an 8 FPS anime cadence (asserted in `tests/phaser-full-parity.test.js`).
- **Raster PNG is the exception:** only ~3 PNGs under `assets/sprites` (two vehicle "anime-pass"
  renders `garage_*_anime_top_512.png` for SUV/convertible). The `docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md`
  rule exists precisely because committing valid binary PNGs is fragile in this workflow, and
  `.png.b64` text files are explicitly "emergency fallback only, never final assets."
- **Manifests / queues:** `assets/manifests/` (3 JSON) and `assets/sprite_replacement_queue/`
  (CSV/JSON/MD) track intended sprite replacements — a real pipeline exists but is partly aspirational.
- **Visual standard is strict** (`docs/APARTMENT_GOD_TRUE_TOP_DOWN_ANIME_VISUAL_STANDARD.md`,
  `..._PROCEDURAL_CHARACTER_BIBLE.md`, `SPRITE_ART_BIBLE.md`, `VISUAL_CEILING.md`): true top-down,
  realistic adult anatomy, anime flat-color with readable lighting, no isometric, no "toilet-door-sign"
  blobs, no single generic pose reused across activities.
- **Pipeline maturity: transitional.** The dominant realized technique is still procedural/overlay
  drawing and SVG; the raster anime target is only partly populated. The correction/overlay stack
  (§7) is currently doing work that a finished sprite pipeline would eventually replace.

---

## 7. Actual bugs / weak implementations (code-evidenced)

These are genuine anomalies (weak implementation, dead weight, or contradiction), not "unfamiliar
code." Per the audit rules, unfamiliar-but-documented systems are excluded.

1. **Dead orphan runtime pair (~470 LOC).** `src/phaserRuntime.js` (`bootPhaserGame`, 243 LOC) is
   imported by nothing; `src/canvasRuntime.js` (`bootCanvasGame`, pre-Phaser 2D loop, 226 LOC) is
   imported only by the already-dead `phaserRuntime.js`. `tests/phaser-full-parity.test.js:19`
   asserts `main.js` must NOT reference `bootCanvasGame`, confirming intentional deprecation — yet
   the files were never removed. *Weak implementation / dead weight; low runtime risk, real
   maintenance/confusion risk.*
2. **Triple canvas-sizing authority on mobile.** `fit.js`, `main.js` `refreshPhaserScale`, and the
   Phaser FIT manager all write to the same canvas on the same events (§4). Even with the
   `phaserOwned` guard, `fit.js` still unconditionally sets `canvas.style.width/height/margin/
   transform` (`fit.js:27-33,60-63`) while `main.js` also resets margin/transform (`main.js:16-21`).
   *Weak implementation: overlapping responsibilities, the documented root of the recurring mobile
   scale conflict.*
3. **Regression tests assert source *text*, not behavior.** `tests/phaser-canvas-ownership.test.js`
   reads `main.js`/`fit.js` as strings and checks substring presence/order (e.g. `dataset.phaserOwned
   = 'true'`, literal `canvas.width = 960`); `tests/phaser-full-parity.test.js` similarly greps
   `main.js` source for `bootPhaserParityGame`. These pass even if the surrounding logic is broken as
   long as the strings exist. *Weak test design; brittle and easily gives false confidence.*
4. **Live no-op stub in the render path.** `src/animeVisualLayer.js` `drawAnimeEnvironmentUnderlay()`
   returns `false` (disabled 2026-07-13) but is still imported and called from `rendering.js:5`.
   *Dead weight in a hot path; harmless but misleading.*
5. **Overlay-stack accretion.** At least six correction/overlay modules run after the base render
   (§3 R4). Prior duplicate-layer and idempotency bugs originated here
   (`BUG_AUDIT_2026-07-13_PRETEST_RELEASE_AUDIT.md`). *Weak architecture: post-hoc correction instead
   of base fixes; high future-bug surface.*
6. **Canonical control docs are stale/contradictory** (§5). `DEVELOPMENT_MATRIX.md` /
   `ONGOING_DESIGN_LOG.md` frozen at 07-13; `IMPLEMENTATION_STATUS.md` says Phaser renderer is
   "disabled" while it is in fact the live boot path. *Process defect that undermines the repo's own
   audit-cadence and idea-logging rules.*
7. **Lint debt (pre-existing).** Prior logs note full-repo lint fails on empty catch blocks in
   `src/calendarSkipSystem.js` and `src/canvasRuntime.js` (`docs/HANDOFF.md`, 07-13 log entries).
   Not verified live here (no `npm install`), documented as pre-existing.

---

## 8. Systems that should NOT be touched yet

Per the current development priorities (playability, boot stability, functioning Phaser build,
mobile fix) and the No-Broad-Implementation / backup rules, avoid touching these during any near-term
safe-improvement pass:

- **The live boot handshake** — `main.js` ↔ `phaserParityRuntime.js` `bootPhaserParityGame` and the
  `dataset.phaserOwned` contract. Boot has a documented black-screen history; changes here risk
  blanking the canvas.
- **The Phaser Scale Manager config + the mobile sizing trio** (`phaserParityRuntime.js` scale block,
  `fit.js`, `main.js` refresh) — actively contested, currently in `NEEDS_TESTING`; do not re-refactor
  before Kam device-tests the current head. (Consolidation is a *later* task, §9-T5, and needs backup
  + device test.)
- **Actor AI / autonomy / movement / pathfinding** (`autonomy.js`, `movement.js`, egress logic) —
  backup-policy "major overhaul" territory; the egress fix is recent and code-verified only.
- **The overlay/correction stack** (`phaserParityCorrections`, `phaserVisualParityOverlay`,
  `requestedVisualCorrections`, `visualRegressionFixes`, `objectCorrectiveOverlays`,
  `runtimeObjectCorrections`) — high blast radius; source of prior duplicate-layer regressions.
- **The old procedural human animation system** — explicitly `REJECTED_AS_TARGET`;
  *"Do not add broad patches to restore old procedural poses unless Kam explicitly asks"*
  (`DEVELOPMENT_MATRIX_PATCH_2026-07-14_PHASER_HOST_AND_ANIMATION_REBUILD.md`).
- **`main`, Render settings/deploys, and `Kalomika/ai-rpg-engine`** — hard-prohibited.
- **Any broad sprite/PNG replacement** — gated behind runtime stability per priorities 8–9 and the
  PNG upload fallback rule.

Note: the dead orphan pair (§7-1) is a *candidate* for removal but must be treated carefully
(`canvasRuntime.js` still carries the lint-debt catch blocks and a test references `bootCanvasGame`);
see §9-T2.

---

## 9. Five highest-value tasks I could implement safely

Ranked by (value ÷ risk), all compatible with "keep it playable, small enough to audit, no broad
replacement." Details in §10.

- **T1 — Reconcile the canonical control docs** (docs-only): merge the 07-14 → 07-19
  `*_PATCH_*`/`*_APPEND_*` trail into `DEVELOPMENT_MATRIX.md` and `ONGOING_DESIGN_LOG.md`, and fix
  `IMPLEMENTATION_STATUS.md`'s "Phaser disabled" contradiction. Highest value, near-zero risk.
- **T2 — Remove the dead orphan runtime pair** (`phaserRuntime.js` + `canvasRuntime.js`) behind a
  test update. Removes ~470 LOC of confusing dead weight and part of the lint debt.
- **T3 — Add a real boot smoke test** (headless) that asserts `bootPhaserParityGame` actually
  constructs a game object / the canvas gets a non-empty frame, replacing string-grep assertions
  with behavior. Directly attacks the black-screen risk class.
- **T4 — Delete/inline the live no-op `animeVisualLayer.js` stub** and its call site. Tiny, safe
  cleanup that removes a misleading hot-path no-op.
- **T5 — Consolidate mobile canvas sizing to a single authority** (make `fit.js` fully defer to the
  Phaser-owned path so only Phaser FIT + one CSS wrapper rule the canvas). Highest user-visible
  upside on mobile, but medium risk — requires backup branch + Kam device test.

---

## 10. Per-task detail (files, risk, testing, expected improvement)

### T1 — Reconcile canonical control docs (docs-only)
- **Files:** `apartment-god-production/DEVELOPMENT_MATRIX.md`, `apartment-god-production/ONGOING_DESIGN_LOG.md`,
  `docs/IMPLEMENTATION_STATUS.md`; inputs = all `*_PATCH_2026-07-1[4-9]_*`, `*_APPEND_2026-07-1[4-9]_*`.
- **Risk:** VERY LOW (no runtime files). Only risk is clobbering an entry — mitigate by append-merge,
  never overwrite.
- **Testing:** doc review / diff review; no build needed.
- **User-visible improvement:** none directly to players; large improvement to contributor safety and
  accuracy — future agents stop acting on the false "Phaser disabled / planned" state.

### T2 — Remove dead orphan runtime pair
- **Files:** delete `src/phaserRuntime.js`, `src/canvasRuntime.js`; update
  `tests/phaser-full-parity.test.js` (the `not.toContain('bootCanvasGame')` guard still passes, but
  confirm no import references remain); grep-verify no other importer.
- **Risk:** LOW. Confirmed zero live importers; but treat as backup-policy-adjacent (renderer files)
  → create a backup branch/manifest first, and run the suite.
- **Testing:** `npm run lint`, `npm test`, `npm run build`; confirm `dist` unchanged in boot behavior.
- **User-visible improvement:** none visible; removes ~470 LOC dead weight + some lint debt, lowers
  future-agent confusion (prevents accidental revival of the pre-parity canvas boot).

### T3 — Real headless boot smoke test
- **Files:** new `tests/phaser-boot-smoke.test.js` (Vitest, jsdom or a Phaser HEADLESS game);
  possibly a tiny testability seam in `phaserParityRuntime.js` (export the scene factory — already
  exported paths exist). No behavior change to shipping code.
- **Risk:** LOW-MEDIUM (Phaser under jsdom/HEADLESS can be finicky; may need a minimal WebGL/canvas
  stub). Additive only.
- **Testing:** the test itself + full suite + CI.
- **User-visible improvement:** indirect but high — converts the black-screen risk from
  "hope + screenshots" to an automated gate; replaces brittle source-string assertions (§7-3).

### T4 — Remove live no-op `animeVisualLayer.js` stub
- **Files:** `src/animeVisualLayer.js` (delete or keep as documented intentional stub), `src/rendering.js:5`
  (remove import + call site).
- **Risk:** LOW. Function returns `false` and draws nothing; removing the call cannot change output.
  Verify no other importer.
- **Testing:** `npm test`, `npm run build`, visual spot-check that environment render is unchanged.
- **User-visible improvement:** none visible; cleaner hot path, removes a misleading no-op.

### T5 — Consolidate mobile canvas sizing (medium risk, gated)
- **Files:** `src/fit.js` (have it fully no-op canvas styling when `phaserOwned`, leaving only the
  wrapper), `src/main.js` (keep a single `scale.refresh()` on orientation, drop redundant style
  resets), `src/phaserParityRuntime.js` (scale block unchanged unless needed). No new files, no new
  managers (honors "no parallel/duplicate systems").
- **Risk:** MEDIUM — this is the actively contested mobile area with a documented failed prior fix.
  **Requires** a backup branch (`backup/phaser-migration-before-mobile-sizing-consolidation-YYYY-MM-DD`)
  and explicit Kam device testing before any claim of done. Do NOT touch until Kam has first
  device-verified the current 07-19 head, so the baseline is known.
- **Testing:** `npm test`, `npm run build`, `npm run qa:mobile` if a browser binary is available, and
  mandatory Kam test on a real phone in portrait + landscape (canvas fully visible, no below-fold cut,
  controls reachable).
- **User-visible improvement:** HIGH on mobile — the single most-reported problem class; a clean
  single sizing authority should end the recurring "canvas below the fold / margin fight" regressions.

**Cross-build note (required by Cross Build Requirement):** all five tasks target the single live
build (`phaser-migration` → `dist`). The dead orphan pair (T2) is explicitly *excluded* from any
behavior change other than deletion. No separate build/engine variant requires a parallel
implementation. No task touches `main`, Render, or `ai-rpg-engine`.

---

## 11. Comparison plan — evaluating my results vs. another AI agent without merging into `main`

Goal: judge two independent implementations against each other with zero risk to the Render playable
branch (`main`) and without merging either candidate.

**Setup (isolation).**
- Each agent works on its own `claude/...` (or agent-specific) branch off the *same* base commit
  (`origin/phaser-migration@3e87220`). Record each branch + head SHA.
- Neither branch is merged into `main` or into `phaser-migration` during evaluation. Comparison is
  branch-to-branch only.

**Objective, reproducible signals (no deploy needed).**
1. **CI parity:** run the existing `.github/workflows/phaser-parity-ci.yml` on each branch (push CI or
   a PR *targeting `phaser-migration`*, not `main`). Compare: unit-test pass count, `npm run check`,
   static build success, `dist/vendor/phaser.esm.js` present, `bootPhaserParityGame` entry present.
   A candidate that regresses any gate loses on that axis.
2. **Scope/diff hygiene:** `git diff --stat base..branch` for each. Compare LOC touched, number of
   runtime files changed, whether the change stayed within the requested task (the repo's
   No-Broad-Implementation and Scope-Control rules are the rubric). Smaller, task-scoped diffs score
   higher.
3. **Dead-code / duplication delta:** re-run the import-graph trace (orphan detection) on each branch;
   a candidate that removes dead weight without creating new duplicate systems scores higher; one that
   adds a parallel manager/renderer scores lower (explicit rule violation).
4. **Test-quality delta:** count behavior assertions vs. source-string assertions added; behavior
   tests score higher (addresses §7-3).
5. **Lint/format:** `npm run lint` warning/error delta vs. base.

**Behavioral / visual comparison (the part CI can't judge) without touching `main`.**
6. **Ephemeral preview per branch:** build each branch locally (`npm run build`) and serve `dist/`
   from a *temporary* Render preview service or any throwaway static host — **never** the production
   `main` service, and **without changing Render settings on the existing service**. Alternatively,
   Kam opens each branch's `dist/` via a local static server. Provide Kam a fixed **test script**
   (identical for both candidates): which room to enter, which actor/object to use, which controls to
   press, expected behavior, and specifically the mobile portrait/landscape canvas-fit check and a
   cold-boot (black-screen) check. Kam scores each candidate on the same checklist.
7. **Screenshot/state diffing:** if a Playwright/browser binary is available, capture the same set of
   canvas screenshots per branch at fixed viewport sizes (desktop + a phone profile) and pixel-diff
   them against an agreed reference using the repo's already-present `pixelmatch`/`pngjs` tooling.
   Report regressions per candidate.

**Decision.**
- Produce a single comparison table: {CI gates, diff size, files touched, dead-code delta,
  duplicate-system count, test-quality delta, lint delta, Kam behavioral checklist score, mobile-fit
  result, boot-stability result} for each branch.
- The winner is chosen on that table; only *then*, and only on Kam's explicit request, is the winning
  branch promoted toward `phaser-migration` (and separately, later, toward `main` under the backup
  policy). The losing branch is retained, not deleted, per the branch-deletion rule.

This keeps both candidates fully isolated, uses the repo's own CI and rubric documents as the scoring
authority, and never merges or deploys either branch to reach a verdict.

---

## FINAL REPORT (required format)

1. **Branch edited:** `claude/repository-evaluation-20260722` (created from `origin/phaser-migration@3e8722052e7dc4fbf781b11979f339327b8b6b06`).
2. **Commits created:** documentation-only commit(s) adding this audit report plus the design-log
   append and matrix patch listed under "Files changed." (SHA recorded in the design-log append after commit.)
3. **Files changed (all documentation, under `apartment-god-production/`):**
   - `CLAUDE_REPOSITORY_EVALUATION_AUDIT_20260722.md` (this file)
   - `ONGOING_DESIGN_LOG_CLAUDE_APPEND_20260722.md`
   - `DEVELOPMENT_MATRIX_CLAUDE_PATCH_20260722.md`
4. **Runtime files changed:** NO.
5. **Main touched:** NO.
6. **Render settings changed:** NO. (No deploy triggered.)
7. **Backup created or confirmed:** Not required — this is an inspection-only, documentation-only pass
   with no runtime/overhaul changes (backup policy triggers on major overhauls, not doc audits). Base
   commit SHA recorded above serves as the restore reference.
8. **Audit result:** `phaser-migration` head is the single live Phaser (hybrid host/compositor)
   runtime; CI green; **no human/browser/mobile/Render verification exists**. Confirmed anomalies:
   dead orphan runtime pair (~470 LOC), triple mobile canvas-sizing authority (root of the recurring
   scale conflict), source-string regression tests, a live no-op render stub, an over-accreted
   overlay/correction stack, and stale/contradictory canonical control docs. No unfamiliar system was
   classified as broken; no duplicate system was created; nothing was deployed.
9. **Testing performed:** Code inspection + import-graph tracing (live vs. dead paths verified);
   documentation review; CI state confirmed via GitHub Actions (head `3e87220` = success). No
   `npm install`/`npm test`/`npm run build`/browser run — `node_modules` absent in this checkout.
10. **What still needs testing:** Real device mobile fit (portrait + landscape), cold-boot black-screen
    check, and full `npm test`/`build`/`qa:mobile` in an environment with dependencies installed —
    none of which this audit could execute.
11. **Known risks:** Mobile scale fix on head is unverified and its predecessor was proven wrong;
    boot has a black-screen history; overlay stack is high-blast-radius; canonical docs are misleading
    to future agents.
12. **Exact next step:** Commit these three documentation files to
    `claude/repository-evaluation-20260722` and push (`git push -u origin
    claude/repository-evaluation-20260722`). Then await Kam's direction on which of the five proposed
    tasks (§9) to implement — recommended first is **T1 (docs reconciliation)** as zero-runtime-risk,
    with **T5 (mobile sizing consolidation)** deferred until Kam device-tests the current head so a
    known-good baseline exists.

*Status language:* This work was **inspected and documented only** — not modified at runtime, not
locally built, not browser tested, not Render tested.
