# Grapple Gods Development Matrix

Updated: 2026-07-18

Branch: `wrestling-sim-foundation`

## Direction Matrix

| Area | Status | Source of truth | Current implementation | Next validation |
|---|---|---|---|---|
| Playable camera | IN_PROGRESS | `hard_cam_sprite_direction.md` | Side view hard cam is active. Top down is archived. | Confirm all current runtime and documentation paths agree. |
| Ring staging | IN_PROGRESS | Hard cam ring SVG frames and Studio viewer | Ring is being pushed farther back for a wider arena read. | Review scale, vertical placement, crowd overlap, and mobile crop. |
| Ring art | NEEDS_RENDER_TESTING | `web_phaser/public/assets/ring/` | Two authored approval frames exist with white canvas, black ropes, posts, pads, and apron. | Confirm the current asset is visually acceptable in browser. |
| Foreground crowd | NEEDS_RENDER_TESTING | `web_phaser/public/assets/crowd/` | Two foreground crowd frames exist for depth separation and 8 fps variation. | Confirm the ring remains readable behind the near crowd. |
| Playable ring renderer | IN_PROGRESS | `ArenaScene.js`, `HardCamRingRenderer.js`, `HardCamSpriteRingRenderer.js` | Procedural hard cam renderer remains active while a sprite renderer and authored frames have been added. | Wire the approved authored frames without overwriting concurrent work. |
| Wrestler sprites | BLOCKED | `hard_cam_sprite_direction.md` | Wrestlers intentionally hidden during ring approval. Older top down proxies remain archived code. | Begin side view sprite cycles after ring approval. |
| Match simulation | IMPLEMENTED | `matchEngine.js`, `moveCatalog.js`, `roster.js` | Autonomous match logic, suggestions, stamina, damage, and basic move states exist under the visual approval layer. | Reconnect presentation after ring approval. |
| Studio foundation | IMPLEMENTED | `wrestling_sim/studio/` | Standalone Vite internal development environment created. | Run and visually approve the GitHub build. |
| Studio ring viewer | NEEDS_LOCAL_TESTING | `studio/index.html`, `studio/app.js`, `studio/styles.css` | Shared runtime assets, 8 fps playback, frame stepping, push back, vertical staging, zoom, crowd, grid, and safe frame controls. AppDeploy interaction tests passed. | Run `npm install && npm run build`, then inspect the canonical GitHub build. |
| Studio shared asset pipeline | IMPLEMENTED | `studio/vite.config.js` | Studio public directory points to `web_phaser/public` so production art is not duplicated. | Confirm Vite copies all required assets into Studio dist. |
| Studio preview deployment | IMPLEMENTED | AppDeploy app `f4d17721dd2b55bb9c` | Public review preview is ready with desktop and mobile QA snapshots and no reported runtime or network errors. | Human visual approval of ring composition. |
| Dedicated Studio auto deployment | PLANNED | `studio/README.md` | Existing Render service does not deploy the Studio because its root is `web_phaser`. | Create a separate Studio service if ongoing auto deployment is needed. |

## Studio Module Matrix

| Module | Status | Scope |
|---|---|---|
| Hard Cam Ring Viewer | NEEDS_HUMAN_APPROVAL | Current ring, crowd, camera blocking, depth, safe frame, and 8 fps inspection. Automated preview tests passed. |
| Character Viewer | PLANNED | Sprite identity, scale, gear, pose, silhouette, and frame inspection. |
| Animation Timeline | PLANNED | Frame stepping, onion skin, cadence, loop boundaries, and state transitions. |
| Move Previewer | PLANNED | Lockups, strikes, grapples, slams, rope contact, pins, and reactions. |
| Match Sandbox | PLANNED | Adjustable stamina, damage, momentum, rules, and wrestler states. |
| AI Decision Debugger | PLANNED | Explain why a wrestler accepted, ignored, delayed, failed, or changed a suggestion. |
| Ring Designer | PLANNED | Approved parameters for canvas, ropes, posts, pads, apron, crowd, and arena blocking. |
| Collision Inspector | PLANNED | Ring bounds, ropes, corners, apron, floor, and navigation zones. |
| Performance Inspector | PLANNED | Frame timing, asset weight, draw count, texture use, and mobile performance. |

## Approval Gates

| Gate | Required evidence | Status |
|---|---|---|
| Hard cam direction accepted | Human browser review showing the correct side view camera | IN_PROGRESS |
| Ring pushed back accepted | Human browser review at desktop and mobile widths | IN_PROGRESS |
| Foreground crowd accepted | Ring remains readable with crowd layer enabled | NEEDS_HUMAN_APPROVAL |
| 8 fps ring cadence accepted | Two authored frames loop without distracting flicker | NEEDS_HUMAN_APPROVAL |
| Wrestler production unlocked | Ring, crowd, and camera approved | BLOCKED |

## Current Test Checklist

```text
open the Studio
confirm the ring is side view hard cam
confirm the default ring is smaller and farther back
pause and step between frame A and frame B
turn foreground crowd on and off
turn the composition grid on
turn the safe frame on and off
inspect at phone width
confirm runtime assets load from web_phaser/public
confirm the playable game was not replaced by the Studio
```

## Preview URL

```text
https://f4d17721dd2b55bb9c.v2.appdeploy.ai/
```
