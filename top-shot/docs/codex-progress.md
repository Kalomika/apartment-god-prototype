# Codex Progress

## 2026-06-28 17:28:40 -05:00 - Reference images unpacked

- What I attempted: Created `top-shot/docs/reference-images/`, unpacked `top_shot_codex_reference_images.zip` into it, and read the included reference manifest.
- Files touched: `top-shot/docs/reference-images/`, `top-shot/docs/reference-images/README.md`, `top-shot/docs/codex-progress.md`.
- What changed: Added the requested reference image folder contents and created a standard `README.md` from the archive manifest because `top-shot/docs/reference-images/README.md` was not present in the checkout before extraction.
- What passed or failed: Extraction succeeded. Reading the originally requested README path failed before extraction because the file did not exist; the included `README_reference_manifest.txt` was read and mirrored into `README.md`.
- What remains: Implement the handler-facing/player-facing request portrait inspired by the upward-looking man reference without copying the image.
- Visual/manual testing needed: Verify the portrait reads as a fighter looking up to the handler and does not obscure the playfield.
- Next recommended action: Add a small request-state helper, connect it to the existing help/command system, and render the request state in the HUD.

## 2026-06-28 17:34:58 -05:00 - Handler request portrait implemented

- What I attempted: Added a handler-facing/player-facing request state inspired by the upward-looking man reference, using original CSS/canvas shapes rather than copied imagery.
- Files touched: `top-shot/src/requests.js`, `top-shot/src/systems.js`, `top-shot/src/main.js`, `top-shot/src/render.js`, `top-shot/styles.css`, `top-shot/docs/codex-progress.md`.
- What changed: Added request-state logic for command, help, extraction, medical, ammo, and approval states; connected urgent requests to the existing help pulse/log; added a small upward-looking fighter portrait in the canvas side HUD and DOM fighter card.
- What passed or failed: Initial sandboxed `npm run check` and `npm run smoke` failed with `EPERM` before Node could run. Escalated reruns passed: `npm run check`, `npm run smoke`, and `npm run build`.
- What remains: The portrait is intentionally compact and symbolic; future work could add fighter-specific helmets/masks once the sprite art direction settles.
- Visual/manual testing needed: Desktop and narrow viewport screenshots were checked with system Edge through Playwright. The canvas-side handler link is visible on desktop; the DOM card version stacks without horizontal overflow on narrow viewports.
- Next recommended action: Play a few live matches manually and confirm request changes feel useful during damage, ammo depletion, extraction, and command acceptance.

## 2026-06-28 17:34:58 -05:00 - Final handoff report

- Exact files changed: `top-shot/docs/reference-images/README.md`; extracted files under `top-shot/docs/reference-images/top_shot_refs/`; `top-shot/docs/reference-images/README_reference_manifest.txt`; `top-shot/docs/codex-progress.md`; `top-shot/src/requests.js`; `top-shot/src/systems.js`; `top-shot/src/main.js`; `top-shot/src/render.js`; `top-shot/styles.css`.
- Exact commands run: `Expand-Archive -LiteralPath C:\Users\kalto\Downloads\top_shot_codex_reference_images.zip -DestinationPath top-shot\docs\reference-images -Force`; `npm run check`; `npm run smoke`; `npm run build`; local dev server via `npm run start`; browser screenshot checks against `http://localhost:5174`.
- Pass/fail result: `npm run check` passed; `npm run smoke` passed; `npm run build` passed. The first sandboxed `npm run check` and `npm run smoke` attempts failed due to environment `EPERM`, then passed when rerun with the needed local filesystem permission.
- What was manually verified: The handler-link portrait and request text render in the canvas side HUD on desktop, and the DOM fighter-card request portrait renders on a 390px-wide viewport with no horizontal overflow.
- What was not manually verified: Long interactive match feel was not manually played through after ammo depletion, med drop pickup, and extraction pressure; the non-browser smoke test covered simulation stability only.
- Known remaining weaknesses: The portrait is still a compact symbolic HUD portrait, not a full character-specific illustration; request priority is simple and may need tuning after live play.
- How to test the current build: Run `npm run start`, open `http://localhost:5174`, watch the canvas side HUD for the Handler Link, then damage or exhaust Fighter A in match play to see Medical, Ammo, Extract, Help, and Approval requests.
- What should be done next if the game still looks wrong: Tune `src/requests.js` priorities and copy first, then expand the portrait renderer with archetype-specific masks/gear once the active fighter sprites stabilize.

## 2026-06-28 17:43:04 -05:00 - Remote rebase conflict resolution

- What I attempted: Fetched remote `top-shot-v0-1`, rebased the handler request commit over 33 newer remote commits, and resolved conflicts against the newer flat-sprite renderer and tactical systems.
- Files touched: `top-shot/src/renderFlatSprite.js`, `top-shot/src/render.js`, `top-shot/src/main.js`, `top-shot/src/systems.js`, `top-shot/docs/reference-images/README.md`, `top-shot/docs/codex-progress.md`.
- What changed: Kept the remote `render.js` forwarding architecture, moved the canvas handler-link portrait into `renderFlatSprite.js`, preserved the newer stable destination/stuck recovery flow, and combined the remote reference README with the extracted archive manifest list.
- What passed or failed: `npm run check`, `npm run smoke`, and `npm run build` passed after resolving conflicts on the rebased tree.
- What remains: Finish `git rebase --continue`, push the rebased branch, and confirm the remote PR branch updates.
- Visual/manual testing needed: Re-run a browser screenshot after the rebase if time allows, because the active renderer changed from the original local base to `renderFlatSprite.js`.
- Next recommended action: After push, manually inspect the handler link in a live browser against the rebased flat-sprite HUD.

## 2026-06-29 00:43:17 -05:00 - Navigation wall-grinding WIP checkpoint

- What I attempted: Started WIP branch `codex-wip/top-shot-nav-movement-cqc-pass` from clean `top-shot-v0-1`, pushed it, and implemented the first navigation/wall-grinding milestone.
- Files touched: `top-shot/src/arena.js`, `top-shot/src/brain.js`, `top-shot/src/navmesh.js`, `top-shot/src/perception.js`, `top-shot/src/systems.js`, `top-shot/docs/codex-progress.md`.
- What changed: Cover selection now avoids boundary walls and scores usable cover by distance/size; hurt fighters move to open points beside cover instead of cover centers; blocked destinations are normalized with `nearestOpen`; route caches live slightly longer but reset when truly stuck; steering now scores alternate angles for progress instead of taking the first open nudge; stuck recovery picks a safe escape point away from the failed destination.
- What passed or failed: `npm run check` passed before committing. Commit `bb4a400` was pushed to `origin/codex-wip/top-shot-nav-movement-cqc-pass`.
- What remains: Movement animation, sprite anatomy, side-aware CQC/defense, full smoke/build validation, and visual browser inspection.
- Visual/manual testing needed: Watch live matches for reduced cover-edge grinding and confirm fighters still route naturally around the center cover cluster.
- Next recommended action: Implement crisp planted 2 to 4 frame movement poses in the active flat-sprite renderer.

## 2026-06-29 00:46:36 -05:00 - Planted run-cycle WIP checkpoint

- What I attempted: Replaced the parameterized stride sway with authored four-frame run poses and fixed the animation clock for the `run` pose.
- Files touched: `top-shot/src/renderFlatSprite.js`, `top-shot/src/systems.js`, `top-shot/docs/codex-progress.md`.
- What changed: `run` now counts as a moving pose in the simulation animation timer; the flat renderer now uses explicit left-step, contact, right-step, contact limb coordinates so arms and legs alternate in a planted top-down cycle.
- What passed or failed: `npm run check` passed before committing. Commit `4f8df61` was pushed to `origin/codex-wip/top-shot-nav-movement-cqc-pass`.
- What remains: Sprite anatomy refinement, side-aware CQC/defense, full smoke/build validation, and visual browser inspection.
- Visual/manual testing needed: Confirm in-browser that running reads as planted alternating limbs instead of slow or swimming motion.
- Next recommended action: Improve the flat sprite body silhouette so head, shoulder shelf, torso, pelvis, hands, and feet read more human at small size.

## 2026-06-29 00:49:45 -05:00 - Flat sprite anatomy WIP checkpoint

- What I attempted: Improved the active flat-sprite fighter silhouette without changing the handler-facing request portrait.
- Files touched: `top-shot/src/renderFlatSprite.js`, `top-shot/docs/codex-progress.md`.
- What changed: Added a broader shoulder shelf, kept pelvis visually separated from the torso, tucked the head into the shoulder mass, clarified face/hair pixels, and made hands/feet more distinct at small size.
- What passed or failed: `npm run check` passed before committing. Commit `ad0f629` was pushed to `origin/codex-wip/top-shot-nav-movement-cqc-pass`.
- What remains: Side-aware CQC/defense, full smoke/build validation, and visual browser inspection.
- Visual/manual testing needed: Confirm in browser that fighters read as top-down humans at game scale and that the wider shoulder shelf does not create extra-limb illusions during CQC.
- Next recommended action: Expand CQC defense resolution and renderer poses for side-aware blocks, cross blocks, parries, slips, counters, elbows, knees, kicks, grapples, and disarms.

## 2026-06-29 00:55:24 -05:00 - Side-aware CQC defense WIP checkpoint

- What I attempted: Improved close-combat defense logic and readable flat-sprite defense poses.
- Files touched: `top-shot/src/combat.js`, `top-shot/src/config.js`, `top-shot/src/renderFlatSprite.js`, `top-shot/docs/codex-progress.md`.
- What changed: Defense now derives incoming left/right side from the attacking limb, uses opposite-side normal blocks, costlier same-side cross blocks, parries, slips, and counter opportunities. Counter poses now use a visible right cross. The renderer now distinguishes side blocks, leg checks, cross blocks, parries, slips, disarms, and blade/knife thrust poses. Effect colors now differentiate block, cross block, parry, slip, and counter feedback.
- What passed or failed: `npm run check` and `npm run smoke` passed before committing. Commit `82c9b90` was pushed to `origin/codex-wip/top-shot-nav-movement-cqc-pass`.
- What remains: Final validation cleanup, browser screenshot/playtest, and any small fixes from that visual inspection.
- Visual/manual testing needed: Verify that CQC exchanges visibly show the correct defending limb and that parry/slip/counter feedback is readable at game scale.
- Next recommended action: Run final check/smoke/build, launch the game, capture screenshots, and inspect navigation, running, sprite anatomy, CQC readability, and handler portrait preservation.
