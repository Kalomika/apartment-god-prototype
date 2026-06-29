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
