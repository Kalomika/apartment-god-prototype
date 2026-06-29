# AI Checklist Log

## Latest checkpoint

Branch: `top-shot-v0-1`

Terrain checkpoint commit: `fdec5fa91855c5dd7e84e5dec62d6485d8501860`

Render URL: `https://top-shot-prototype.onrender.com/?v=fdec5fa`

Status: 3D terrain checkpoint pushed to `top-shot-v0-1` and verified on Render. The exact latest pushed log commit is reported in the handoff.

## Completed

- [x] Confirmed local `top-shot-v0-1` matched `origin/top-shot-v0-1` before work began.
- [x] Three.js scene loads from a local vendored module with CDN fallback.
- [x] Desert industrial tactical terrain is visible in the canvas.
- [x] Dusty ochre ground, rocks, scrap, metal containers, industrial ruins, generators, tanks, pipes, debris, shadows, and cover structures are present.
- [x] Raised catwalk and stair access are present as early verticality placeholders.
- [x] Collision data is separated from visual meshes in `src/three/topShot3D.js`.
- [x] Collision debug view is hidden behind the `C` key toggle.
- [x] Top-down angled tactical camera frames the site and follows the current simulated action bounds.
- [x] Existing handler-facing request portrait system remains active in the DOM fighter cards.
- [x] `npm run check` passed.
- [x] `npm run smoke` passed.
- [x] `npm run build` passed.
- [x] Local browser smoke showed nonblank WebGL canvas pixels on desktop and mobile.
- [x] Local browser smoke confirmed no console errors after adding a data favicon.
- [x] Pushed terrain checkpoint commit `fdec5fa91855c5dd7e84e5dec62d6485d8501860` to `origin/top-shot-v0-1`.
- [x] Render URL loaded with HTTP 200.
- [x] Render served `https://top-shot-prototype.onrender.com/vendor/three.module.js`.
- [x] Render browser smoke showed nonblank WebGL canvas pixels.

## Pending

- [ ] Add the first two 3D archetypes: Suit Operative and Survival Commando.
- [ ] Add GLB/glTF replacement hooks for actor models.
- [ ] Add 3D actor bodies, movement poses, and basic weapon stance readability.
- [ ] Move existing CQC timing and request states onto visible 3D actor limbs.

## Blocked

- [ ] None at this checkpoint.

## Known bugs

- [ ] 3D fighters are not rendered yet; the existing simulation runs behind the terrain and updates the DOM HUD only.
- [ ] The terrain art is procedural placeholder geometry and still needs material polish, scale tuning, and more cover readability.
- [ ] Camera follows simulated fighter positions, but those positions have no 3D actor markers until the archetype milestone.
- [ ] The collision debug boxes are rectangular first-pass volumes, not a finished navmesh.

## Current Archetypes Implemented

- [x] Legacy simulation archetypes remain available: Marine, Ninja, Archer, Martial Artist.
- [ ] Suit Operative.
- [ ] Survival Commando.
- [ ] Shadow Ninja.
- [ ] Field Agent.
- [ ] Jeet Fighter.
- [ ] Infiltration Soldier.
- [ ] Bride Blade.
- [ ] Red Widow.

## Model Source And Placeholder Status

- [x] Terrain uses original procedural Three.js primitives and runtime texture generation.
- [x] Three.js `0.164.1` is vendored locally under `top-shot/vendor/three.module.js`.
- [ ] No external character models are used yet.
- [ ] No GLB files are added yet.
- [ ] Actor placeholders are planned for the next milestone.

## Animation States Working

- [x] Existing simulation state still advances and reports pose/status in the DOM HUD.
- [ ] 3D actor idle, run, crouch, prone, attack, and hit reaction animations are not implemented yet.

## Combat States Working

- [x] Existing simulation smoke test still covers battle flow, command drops, wounds, CQC/ranged decisions, and finish states.
- [ ] Visible 3D limb hit volumes are not implemented yet.
- [ ] Visible 3D blocks, parries, slips, counters, elbows, knees, kicks, grapples, and disarms are not implemented yet.

## Next Recommended Task

- [ ] Add Suit Operative and Survival Commando as reusable procedural 3D humanoid actor placeholders, with clear human proportions and a loader path for later GLB replacement.
