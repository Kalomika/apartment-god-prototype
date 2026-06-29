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

- [ ] No external character models are added yet.
- [ ] No GLB/glTF character files are added yet.
- [ ] Procedural actor placeholders are planned for the next checkpoint.
