# Top Shot Coverage Matrix

| System | Status | Branch source | Owning files | Preservation target | Automated checks | Manual QA | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Outline free toon rendering | First slice | `top-shot-studio-pipeline` | `src/three/visualStyle3D.js`, `src/three/actors3D.js` | Character readability and color separation | `npm run check`, `npm run starshot-smoke` | Inspect skin, cloth, metal, shadows, no linework | Medium | Tune ramps in browser |
| Stepped character animation | First slice | `top-shot-studio-pipeline` | `src/three/visualStyle3D.js`, `src/three/actors3D.js`, `src/three/actorMotion3D.js` | Smooth simulation with 8 FPS pose sampling | `npm run starshot-smoke`, `npm run smoke` | Confirm movement stays smooth while poses step | High | Validate CQC locks and mount poses |
| 2D effects | First slice | `top-shot-studio-pipeline` | `src/three/effects3D.js` | Existing effect timing and locations | `npm run check`, `npm run smoke` | Inspect camera facing flashes and tracers | Medium | Add texture atlas importer |
| Binary asset handling | Foundation | `top-shot-studio-pipeline` | `scripts/audit-assets.js`, `asset_inbox/ASSET_MANIFEST.md` | Existing reference assets | `npm run assets:check` | Review naming exceptions | Low | Add dimension and alpha policy manifest |
| Browser automation and visual capture | Planned | pending | pending | Startup, match, CQC, debug toggles | pending | Baseline screenshots and clips | Medium | Add Playwright harness after runtime slice is stable |
| Performance diagnostics | Planned | pending | pending | 60 FPS simulation and camera | pending | CPU, GPU, memory, draw calls | Medium | Add read only telemetry collector |
| Simulation analytics | Existing baseline, expansion planned | current runtime | `tests/simSmoke.js`, future `src/sim/` | Match validity and balance evidence | `npm run smoke` | Review matchup output | High | Bring in PR 25 finite state hardening, then add batch runner |
| Deployment previews | Existing Render baseline, expansion planned | `top-shot-v0-1` | `render.yaml`, `scripts/build.js` | Static deployment remains healthy | `npm run build` | Open branch preview | Medium | Add verified PR preview workflow after smoke health |
| Anatomical production rigs | Specification only | pending | future model importer and rig contract | CQC limb zones and readable joints | pending | Shoulder, spine, wrist, hand, hip, knee, ankle deformation | High | Define GLTF rig contract and import one production model |
