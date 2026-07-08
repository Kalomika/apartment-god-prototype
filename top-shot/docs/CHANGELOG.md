# Top Shot Change Log

All Top Shot changes must be logged here with date, time, branch, rollback reference, files changed, feature summary, and Render link/cache buster when known.

## 2026-07-08 06:36 AM CT

Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=e2c77a4`

Rollback slots created before this update:

- `backup/top-shot-rollback-1`, current pre-camera-zoom Top Shot state, commit `cc757812268a0c93b7d02c0b059d4e2c13a40fa4`
- `backup/top-shot-rollback-2`, previous pre-cover-AI/VFX state
- `backup/top-shot-rollback-3`, previous pre-mobile-layout state
- `backup/top-shot-rollback-4`, previous pre-camera-preset state

Files changed:

- `top-shot/src/cameraAngles.js`
- `top-shot/docs/CHANGELOG.md`
- `top-shot/docs/AI_DEVELOPMENT_HANDBOOK.md`
- `top-shot/docs/FEATURE_HANDBOOK.md`

Changes made:

- Added the official Top Shot rotating rollback rule. Every significant update must capture the current `top-shot-v0-1` state before edits.
- Established four rollback slots: `backup/top-shot-rollback-1` through `backup/top-shot-rollback-4`.
- Documented that Top Shot work is restricted to `top-shot/` unless Kam explicitly says otherwise.
- Added dynamic camera zoom behavior. The default top-down camera now pulls closer when fighters are close and pulls wider when fighters separate.
- Added project handbooks for future AI agents so they preserve the current tactical 3D style, defensive AI goals, visual rules, and deployment rules.

## 2026-07-08 06:33 AM CT

Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=cc757812`

Rollback created before update:

- `backup/top-shot-before-cover-ai-vfx-2026-07-08`

Files changed:

- `top-shot/src/arena.js`
- `top-shot/src/combat.js`
- `top-shot/src/main.js`
- `top-shot/src/perception.js`
- `top-shot/src/state.js`
- `top-shot/src/systems.js`
- `top-shot/src/three/effects3D.js`
- `top-shot/src/vitality.js`

Changes made:

- Added boulder cover around the desert industrial site.
- Made fighters react to gunfire by diving or moving toward cover instead of standing in open fire.
- Added suppression behavior, muzzle flashes, impact flashes, tracer effects, and landing flashes.
- Reduced gun lethality so elite fighters are harder to kill within the first seconds.
- Made sudden incapacitation much less likely except in severe conditions.
- Changed deployment from a flat slide-in to parachute-style staggered descent.
- Added match time to the HUD.

## 2026-07-08 06:24 AM CT

Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=abbb8ae`

Rollback created before update:

- `backup/top-shot-before-mobile-layout-2026-07-08`

Files changed:

- `top-shot/styles.css`

Changes made:

- Mobile layout changed so the game viewport takes roughly the top half of the phone screen.
- Menu/HUD became the scrollable section below the game viewport.
- Overlay text was constrained so it no longer consumes the full mobile screen.

## 2026-07-08 06:20 AM CT

Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=41d95ca`

Rollback created before update:

- `backup/top-shot-before-camera-2026-07-08`

Files changed:

- `top-shot/src/cameraAngles.js`
- `top-shot/src/main.js`

Changes made:

- Added camera presets.
- Default camera set to top down.
- Added keyboard camera controls: 1 Top Down, 2 High Tactical, 3 Oblique, 4 Isometric, V cycle.
- Camera control instructions added to overlay and HUD.
