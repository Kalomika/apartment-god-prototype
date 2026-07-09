# AI Checklist Log

## Latest checkpoint

Branch: `top-shot-v0-1`

Commit: `e70f81e1addd4c344638ed229e262364030b59af`

Previous terrain commit: `a6c36dd311dd102f9da803eae1d03625d07eab67`

Render URL: `https://top-shot-prototype.onrender.com/?v=e70f81e`

Status: Emergency Top Shot CI failure audit completed. Automatic GitHub Actions email spam remains paused through manual-only workflow dispatch. Core simulation state, navmesh, wound handling, and battle-loop invariants were hardened against invalid fighter state and stuck finish conditions.

## Completed

- [x] Confirmed `top-shot-v0-1` PR #5 is still the active Top Shot branch.
- [x] Reviewed the latest GitHub Actions failure logs for `Top Shot Checks`.
- [x] Confirmed the previous failure was in `npm run smoke`, not install or syntax setup.
- [x] Identified the failing smoke matchup as `suit_operative` versus `survival_commando` with invalid fighter state.
- [x] Paused automatic `push` and `pull_request` CI triggers to stop repeated GitHub failure notification emails.
- [x] Kept `Top Shot Checks` available through manual `workflow_dispatch`.
- [x] Hardened shared numeric utilities against `NaN`, non-finite angles, invalid clamp inputs, empty choice arrays, and invalid rectangle checks.
- [x] Hardened navmesh waypoint and nearest-open selection against invalid destination coordinates.
- [x] Hardened wound and bleed handling against invalid severity, invalid bleed pools, invalid HP drain, and half-dead active fighters.
- [x] Reworked the battle loop to sanitize fighter coordinates, HP, elevation, resources, command targets, nav targets, and grapple targets before and after major simulation systems.
- [x] Wired `updatePhysicality` into the main battle loop so the existing contact/debris system is no longer orphaned.
- [x] Updated finish logic so defeated fighters no longer count as active fighters and cannot stall a match forever.

## Completed earlier

- [x] Confirmed local `top-shot-v0-1` matched `origin/top-shot-v0-1` before prior work began.
- [x] Inspected `top-shot/asset_inbox/ASSET_MANIFEST.md` path; it is not present in that checkout.
- [x] Inspected requested asset inbox folders; `model_candidates/`, `fx/`, `maps/`, and `reference_notes/` were not present locally at that checkpoint.
- [x] Three.js scene loads from a local vendored module with CDN fallback.
- [x] Desert industrial tactical terrain is visible in the canvas.
- [x] Dusty ochre ground, rocks, scrap, metal containers, industrial ruins, generators, tanks, pipes, debris, shadows, and cover structures are present.
- [x] Raised catwalk and stair access are present as early verticality placeholders.
- [x] Collision data is separated from visual meshes in `src/three/topShot3D.js`.
- [x] Collision debug view is hidden behind the `C` key toggle.
- [x] Top-down angled tactical camera frames the site and follows the current simulated action bounds.
- [x] Existing handler-facing request portrait system remains active in the DOM fighter cards.
- [x] Added visible procedural 3D humanoid placeholders for Suit Operative and Survival Commando.
- [x] Default matchup now uses Suit Operative versus Survival Commando.
- [x] Basic actor animation scaffolding exists for idle, walk, run, crouch, prone, roll, ranged, and CQC/reactive poses.
- [x] Simulation smoke covers Suit Operative versus Survival Commando.
- [x] Added visible procedural 3D humanoid placeholders for Shadow Ninja and Field Agent.
- [x] Shadow Ninja uses a black masked blade/projectile silhouette with stealth, crouch, smoke, and shuriken behavior.
- [x] Field Agent uses a refined pistol/formal tacticalwear silhouette with cover/evasion/patience behavior.
- [x] Simulation smoke covers Shadow Ninja versus Field Agent.

## Pending

- [ ] Manually rerun `Top Shot Checks` from GitHub Actions when ready. Automatic runs remain paused to prevent new email spam.
- [ ] Re-enable automatic CI only after the branch is stable and Kam wants GitHub failure emails back on.
- [ ] Replace procedural actors with verified permissive GLB/glTF assets if the asset inbox becomes available.
- [ ] Move existing CQC timing and request states onto visible 3D actor limb contact.
- [ ] Add the next two archetypes: Jeet Fighter and Infiltration Soldier.

## Blocked

- [ ] Local container could not clone GitHub because DNS resolution for `github.com` failed, so this audit used the GitHub connector and source inspection instead of a full local `npm run smoke` execution.

## Known bugs

- [ ] Automatic CI is intentionally disabled except manual dispatch.
- [ ] Asset inbox manifest and candidate folders may still be missing from some checkouts, so no Agent Mode assets were selected.
- [ ] The terrain art is procedural placeholder geometry and still needs material polish, scale tuning, and more cover readability.
- [ ] Procedural actors are readable placeholders, not final rigged character models.
- [ ] Shadow Ninja and Field Agent silhouettes still need authored animation clips and stronger weapon contact poses.
- [ ] Actor animations are procedural pose scaffolds, not authored clips.
- [ ] The collision debug boxes are rectangular first-pass volumes, not a finished navmesh.
- [ ] Visible 3D combat contact is not yet driven by true limb-to-body collision; the simulation still owns combat results.

## Current Archetypes Implemented

- [x] Legacy simulation archetypes remain available: Marine, Ninja, Archer, Martial Artist.
- [x] Suit Operative.
- [x] Survival Commando.
- [x] Shadow Ninja.
- [x] Field Agent.
- [ ] Jeet Fighter.
- [ ] Infiltration Soldier.
- [ ] Bride Blade.
- [ ] Red Widow.

## Model Source And Placeholder Status

- [x] Terrain uses original procedural Three.js primitives and runtime texture generation.
- [x] Three.js `0.164.1` is vendored locally under `top-shot/vendor/three.module.js`.
- [x] Suit Operative and Survival Commando use original procedural articulated placeholder rigs.
- [x] Shadow Ninja and Field Agent use original procedural articulated placeholder rigs.
- [ ] No external character models are used yet.
- [ ] No GLB files are added yet.
- [ ] Verified inbox GLB/glTF candidates are still pending.

## Animation States Working

- [x] Existing simulation state still advances and reports pose/status in the DOM HUD.
- [x] 3D actor idle, walk, run, crouch, prone, roll, pistol/rifle, and CQC pose scaffolding exists.
- [ ] Authored animation clips are not implemented yet.

## Combat States Working

- [x] Existing simulation smoke test covers battle flow, command drops, wounds, CQC/ranged decisions, and finish states.
- [x] Placeholder actor limb/body volume accessors are scaffolded.
- [x] Battle loop now has defensive invalid-state cleanup around the simulation systems.
- [ ] Visible 3D blocks, parries, slips, counters, elbows, knees, kicks, grapples, and disarms need stronger visual/contact integration.

## Latest Validation Commands

- [ ] `npm run check`, not run locally in this environment because GitHub clone DNS failed.
- [ ] `npm run smoke`, not run locally in this environment because GitHub clone DNS failed.
- [ ] `npm run build`, not run locally in this environment because GitHub clone DNS failed.
- [ ] Manual GitHub Actions run pending.

## Render URL

- [ ] `https://top-shot-prototype.onrender.com/?v=e70f81e`, pending manual verification.

## Next Recommended Task

- [ ] Manually dispatch Top Shot Checks from GitHub Actions, confirm smoke passes, then decide whether to re-enable automatic CI or keep it manual-only to avoid email noise.
