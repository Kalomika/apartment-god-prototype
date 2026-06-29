# Asset Manifest

## Runtime Libraries

### Three.js

- Source: `https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.min.js`
- Local path: `top-shot/vendor/three.module.js`
- Version: `0.164.1`
- License: MIT
- Format: browser ES module JavaScript
- Size: 674,422 bytes
- Rigged: not applicable
- Animated: not applicable
- Modifications made: none; downloaded as a pinned minified module
- Usage: WebGL scene rendering for the 3D terrain checkpoint
- Build behavior: copied into `dist/vendor/three.module.js`

## Procedural Assets

### Desert Industrial Terrain

- Source: original procedural Three.js geometry in `top-shot/src/three/topShot3D.js`
- License: project-owned procedural placeholder
- Format: runtime primitives and generated `CanvasTexture`
- Rigged: no
- Animated: no
- Polygon count: low-poly browser-safe primitives; exact count depends on runtime scene construction
- Texture size: 256 x 256 generated ground texture, repeated across the terrain
- Modifications made: not applicable
- Usage: first 3D terrain checkpoint

### Cover And Industrial Props

- Source: original procedural Three.js geometry in `top-shot/src/three/topShot3D.js`
- Includes: containers, ruined walls, generator bank, scrap stack, water tank, pipes, rocks, raised platform, stairs, perimeter rails, shadow patches, road marks, pickup markers
- License: project-owned procedural placeholder
- Format: runtime primitives
- Rigged: no
- Animated: no
- Texture size: no external textures
- Usage: tactical cover, silhouette, shadow pockets, and early verticality

## Reference Images

- Source path: `top-shot/docs/reference-images/`
- Usage: art-direction references only
- Runtime usage: none
- Notes: These images are not copied, traced, or reproduced in runtime assets. The handler-facing portrait remains an original CSS/DOM construction inspired by the upward-looking request reference.

## Character Models

### Suit Operative Placeholder

- Source: original procedural Three.js articulated placeholder in `top-shot/src/three/actors3D.js`
- License: project-owned procedural placeholder
- Format: runtime Three.js primitives
- Rigged: procedural part rig, not a skinned mesh
- Animated: procedural pose scaffolding for idle, walk, run, crouch, prone, roll, pistol, and CQC reactions
- Polygon count: low-poly browser-safe primitives; exact runtime count depends on generated geometry
- Texture size: no external textures
- Modifications made: not applicable
- Usage: first 3D archetype checkpoint
- Visible/UI name: Suit Operative

### Survival Commando Placeholder

- Source: original procedural Three.js articulated placeholder in `top-shot/src/three/actors3D.js`
- License: project-owned procedural placeholder
- Format: runtime Three.js primitives
- Rigged: procedural part rig, not a skinned mesh
- Animated: procedural pose scaffolding for idle, walk, run, crouch, prone, roll, rifle, knife/CQC reactions, and grenade throw stance
- Polygon count: low-poly browser-safe primitives; exact runtime count depends on generated geometry
- Texture size: no external textures
- Modifications made: not applicable
- Usage: first 3D archetype checkpoint
- Visible/UI name: Survival Commando

## Asset Inbox

- Requested manifest path: `top-shot/asset_inbox/ASSET_MANIFEST.md`
- Status: not present in this checkout during this checkpoint
- Requested candidate folders: `model_candidates/`, `fx/`, `maps/`, `reference_notes/`
- Status: not present in this checkout during this checkpoint
- Integration decision: no inbox assets were moved or selected; procedural placeholders were used instead

## Character Models Pending

- [ ] No external character models are added yet.
- [ ] No GLB/glTF character files are added yet.
- [ ] Verify any future asset inbox candidates before integration.
