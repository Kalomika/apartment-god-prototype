# AI Dev Notes

## 2026-06-29 - 3D Terrain Checkpoint

### What changed

- `src/main.js` now boots a Three.js terrain renderer through `createTopShot3D()` while preserving the existing simulation, command drops, commander ethos, DOM HUD, and handler-facing request portrait flow.
- `src/three/topShot3D.js` owns the first 3D scene: renderer, lights, terrain geometry, industrial cover, shadow patches, early verticality, pickup markers, collision debug geometry, pointer-to-arena projection, and camera framing.
- `vendor/three.module.js` is a pinned local browser module for Three.js `0.164.1`. The loader tries it first and falls back to jsDelivr or unpkg only if the local file is missing.
- `scripts/build.js` now copies `vendor/` into `dist/` so Render serves the same local Three.js module as development.

### Architecture notes

- Collision is intentionally data-first. `COLLISION_VOLUMES` in `src/three/topShot3D.js` is separate from the visual meshes, and the `C` key toggles wireframe debug boxes.
- The scene uses procedural browser-safe primitives only: boxes, cylinders, dodecahedron rocks, canvas-generated ground texture, and simple shadow planes.
- The tactical camera is angled top-down. When fighters exist in the simulation, it frames their arena bounds; before 3D actors exist, this still lets the camera follow the invisible simulation for early integration testing.
- Pointer clicks raycast against the ground plane and convert world coordinates back into the existing 2D arena coordinate system, so coach commands and drops still operate.
- The handler-facing request portrait is now visible in the DOM fighter card via `fighterRequest()`, keeping the upward-looking handler request system intact while the canvas is used for 3D.

### Validation notes

- `npm run check` passed after the terrain and vendor changes.
- `npm run smoke` passed after the terrain and vendor changes.
- `npm run build` passed and copied `vendor/`.
- Local browser smoke at `http://localhost:5174` verified ready state, running state, collision debug state, and mobile layout.
- Canvas pixel probing passed after setting `preserveDrawingBuffer: true`.

### Weak spots

- The terrain is readable but still first-pass. It needs stronger scale language, better cover affordances, and more tactical sightline tuning.
- No 3D actor bodies are visible yet; the DOM HUD reports the underlying simulation state.
- The Three.js dependency was vendored because `npm install` failed on local certificate verification. The vendored file should remain pinned until the repo moves to a bundler or package install path that works cleanly in this environment.

### Next recommended task

Add a reusable procedural humanoid actor system with `Actor3D`, `createPlaceholderActor()`, `loadActorModel()`, `setActorAnimationState()`, `updateActor()`, and limb/body volume hooks. Start with Suit Operative and Survival Commando.

## 2026-06-29 - First Two 3D Archetypes

### Asset inbox inspection

- `top-shot/asset_inbox/ASSET_MANIFEST.md` was requested first, but that path is not present in this checkout.
- The requested `top-shot/asset_inbox/model_candidates/`, `top-shot/asset_inbox/fx/`, `top-shot/asset_inbox/maps/`, and `top-shot/asset_inbox/reference_notes/` folders are also not present.
- Because there are no local candidate assets to verify, this checkpoint does not integrate external models, FX, or map assets.

### What changed

- Added Suit Operative and Survival Commando to the simulation archetype list with generic visible/UI names only.
- Added `src/three/actors3D.js`, a reusable procedural actor rig with `createPlaceholderActor()`, `loadActorModel()`, `setActorAnimationState()`, `updateActor()`, `getLimbHitVolumes()`, and `getBodyHurtZones()`.
- Added a Three.js actor layer to `src/three/topShot3D.js`. Ready state shows preview actors at spawn positions; running state updates actors from the existing simulation.
- Suit Operative currently reads as a dark-suited pistol fighter. Survival Commando reads as a rugged rifle/knife fighter with head-wrap/bandana color blocking.
- Default UI selection is now Suit Operative versus Survival Commando.
- Existing tactical simulation now recognizes both new archetypes for ranged combat, ammo requests, survival/cover movement, and Survival Commando grenade use.
- Simulation smoke now includes `suit_operative` versus `survival_commando`.

### Validation notes

- `npm run check` passed after the actor checkpoint changes.
- `npm run smoke` passed after adding the new matchup.
- `npm run build` passed.
- Local browser smoke verified ready preview actors, running actors, collision debug toggle, desktop layout, mobile layout, clean console, local Three.js vendor loading, and nonblank WebGL canvas pixels.

### Weak spots

- Actors are intentionally procedural placeholders. They are not imported rigged GLB/glTF models.
- The animation states are pose scaffolds driven by simulation state, not authored animation clips.
- CQC limb volumes are exposed by the actor rig, but visible 3D collision/contact resolution is still not connected to the combat system.
- The asset inbox needs to be added or synced before any Agent Mode model recommendations can be used.

### Next recommended task

Add Shadow Ninja and Field Agent as the next two visible 3D archetypes. If the asset inbox appears, verify licenses and integrate only safe GLB/glTF candidates; otherwise continue the procedural rig variant approach.

## 2026-06-30 - Shadow Ninja And Field Agent

### Asset/model decision

- `top-shot/asset_inbox/` is still not present in this checkout.
- No external GLB/glTF models, FX, or map assets were available to verify.
- This checkpoint creates browser-safe procedural variants with the existing actor rig instead of waiting on missing files.

### What changed

- Added Shadow Ninja and Field Agent to the generic simulation/UI archetype list.
- Added Shadow Ninja visual style in `src/three/actors3D.js`: black masked shinobi silhouette, hood/mask, back blade accent, hand blade, dark gear, and no fantasy colors.
- Added Field Agent visual style in `src/three/actors3D.js`: lighter formal tacticalwear, pistol, lapel/accent detail, composed suit silhouette distinct from Suit Operative.
- Added a `blade` weapon path to the procedural actor rig for sword/knife silhouettes.
- Changed the rig forearm material handling so suited characters keep covered sleeves while rugged characters can show bare arms.
- Extended brain/combat/perception/hiding/tactics/request logic so Shadow Ninja inherits stealth/shuriken/smoke/blade behavior and Field Agent inherits pistol/cover/evasion behavior.
- Added `shadow_ninja` versus `field_agent` to `tests/simSmoke.js`.

### Validation notes

- `npm run check` passed.
- `npm run smoke` passed, including Shadow Ninja versus Field Agent.
- `npm run build` passed.
- Local browser visual validation passed: default matchup still loads, Shadow Ninja and Field Agent can be selected, the WebGL canvas is nonblank, and the running HUD shows the selected archetypes.

### Weak spots

- Shadow Ninja and Field Agent are still procedural placeholder rigs, not authored GLB characters.
- Crouch/prone/roll poses are clearer than before through rig state, but still procedural.
- Weapon poses are more obvious for pistol/rifle/blade, but true 3D limb collision is intentionally deferred.

### Next recommended task

Add Jeet Fighter and Infiltration Soldier as the next visible 3D archetype pair.
