# AI Checklist Log

## Latest checkpoint

Branch: `top-shot-v0-1`

Previous terrain commit: `fdec5fa91855c5dd7e84e5dec62d6485d8501860`

Render URL: `https://top-shot-prototype.onrender.com/?v=<latest-checkpoint-sha>`

Status: Terrain plus four procedural 3D archetypes are implemented locally and ready for live-branch validation/push. The exact pushed commit is reported in the handoff.

## Completed

- [x] Confirmed local `top-shot-v0-1` matched `origin/top-shot-v0-1` before work began.
- [x] Inspected `top-shot/asset_inbox/ASSET_MANIFEST.md` path; it is not present in this checkout.
- [x] Inspected requested asset inbox folders; `model_candidates/`, `fx/`, `maps/`, and `reference_notes/` are not present locally.
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
- [x] `npm run check` passed for this checkpoint.
- [x] `npm run smoke` passed for this checkpoint.
- [x] `npm run build` passed for this checkpoint.
- [x] Local browser smoke showed nonblank WebGL canvas pixels on desktop and mobile.
- [x] Local browser smoke confirmed no console errors.

## Pending

- [ ] Push and verify this archetype checkpoint on Render.
- [ ] Replace procedural actors with verified permissive GLB/glTF assets if the asset inbox becomes available.
- [ ] Move existing CQC timing and request states onto visible 3D actor limb contact.
- [ ] Add the next two archetypes: Jeet Fighter and Infiltration Soldier.

## Blocked

- [ ] None at this checkpoint.

## Known bugs

- [ ] Asset inbox manifest and candidate folders are missing from this checkout, so no Agent Mode assets were selected.
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

- [x] Existing simulation smoke test still covers battle flow, command drops, wounds, CQC/ranged decisions, and finish states.
- [x] Placeholder actor limb/body volume accessors are scaffolded.
- [ ] Visible 3D blocks, parries, slips, counters, elbows, knees, kicks, grapples, and disarms need stronger visual/contact integration.

## Latest Validation Commands

- [x] `npm run check`
- [x] `npm run smoke`
- [x] `npm run build`

## Render URL

- [ ] Render URL will be updated in the handoff after this checkpoint is pushed.

## Next Recommended Task

- [ ] Add Jeet Fighter and Infiltration Soldier as the next pair, using verified assets if available or procedural placeholders if not.
