# Development Matrix Patch: Phaser Migration 2 Full Audit

Status: NEEDS_CORRECTION
Branch: phaser-migration-2
Runtime files changed: no
Main touched: no
Render settings changed: no
Manual deployment triggered: no

## Matrix rows to merge during next safe documentation sync

| System | Status | Current audit result | Required next check |
|---|---|---|---|
| Phaser-native runtime ownership | PARTIAL, REAL | Phaser owns the scene, display list, sprite animation, Graphics, pointer input, and update loop. Legacy Canvas `draw()` is not the primary P2 renderer. | Browser boot test and runtime error test. |
| Current-main feature parity | NEEDS_SYNC_AUDIT | P2 is heavily diverged from current main and was 193 commits behind main at audit time. It cannot be called a complete clone of current main. | Selectively compare current main systems and port missing behavior without importing Canvas rendering. |
| Procedural art removal | NEEDS_CORRECTION | Activity PNGs and object states were generated from scripted SVG primitives. Phaser Graphics still draw permanent visible vehicles, gates, arcade visuals, basketball, architecture, and other systems. | Mark generated files temporary and replace permanent visible art with approved authored assets. |
| True top-down character standard | NEEDS_CORRECTION | Current directional and activity sheets use frontal upright anatomy, visible face, vertical torso, hanging arms, and legs beneath the body. | Produce one approved true top-down static Resident, Girlfriend, and Dog proof before more animation work. |
| Character activity replacement | NEEDS_CORRECTION | 27 human activity families and 7 dog families are wired, but current sheets are procedural and may duplicate the base actor sprite. | Fix exact base-actor visibility and then replace sheets with approved authored art. |
| Actor duplicate prevention | HIGH RISK | Activity visibility code does not target the actual `scene.pm2ActorVisuals` map and base actor children lack entity ID tags. | Browser and code test that exactly one actor body is visible during every activity. |
| Runtime recovery | NEEDS_CORRECTION | Recovery draws a visible screen, but normal updates continue after scene children are destroyed. Repeated errors are possible. | Add terminal recovery state and test forced runtime error. |
| Asset fallback safety | NEEDS_CORRECTION | One failed optional visual asset causes scene creation to throw because all preload failures are treated as required. | Split required boot assets from optional activity assets and fall back per missing file. |
| Mobile visual memory | NEEDS_MEASUREMENT | 88 activity sheets at 1024 by 128 are loaded at startup, roughly 44 MiB decoded before other textures and overhead. | Measure startup and memory on Kam's phone; move to grouped/on-demand loading. |
| Room art | PARTIAL TEMPORARY | Room-specific texture paths exist, but textures are stretched 128 by 128 coded gradient/tile panels rather than authored room artwork. | Replace by floor/room with approved top-down environment art. |
| Object art | PARTIAL TEMPORARY | Many object kinds have separate SVGs, but they remain code-shape vector assets and some kinds share assets. | Replace critical objects by exact object ID and approved art. |
| Object state binding | NEEDS_CORRECTION | Some active states are inferred by same-floor activity and object kind instead of exact object ID. Sleep checks `bedObjectId` instead of current `sleepObjectId`. | Standardize exact action-object bindings and test repeated object kinds. |
| Visual automated testing | PARTIAL | Tests verify arrays, imports, file existence, and source markers, not visual correctness. | Add Playwright screenshots and approved baselines after art approval. |
| Browser visual approval | NEEDS_BROWSER_CONFIRMATION | Recent logs report checks, tests, and static build only. No visual approval exists. | Test isolated P2 preview on desktop and mobile after critical runtime fixes. |

## Control ruling

Do not mark Phaser Migration 2 visually complete. Do not promote it to main based on file count, PNG format, or structural tests. Current correct overall status is `NEEDS_CORRECTION`.
