# Top Shot Change Log

All Top Shot changes must be logged here with date, time, branch, rollback reference, files changed, feature summary, and Render link/cache buster when known.

## 2026-07-08 07:04 AM CT

Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=9e9add4`

Files changed:

- `top-shot/src/three/effects3D.js`
- `top-shot/docs/BUG_NOTES_2026-07-08_CQC_RUNNING_CROTCH_ARTIFACT.md`
- `top-shot/docs/CHANGELOG.md`

Changes made:

- Investigated CQC Lab running-in-place and crotch artifact report.
- Confirmed the likely visual artifact was the survival commando rifle mesh being held across the body during unarmed CQC idle, not an invisible hitbox marker.
- Hid/holstered weapons in CQC Lab unless the current action is a weapon-specific action.
- Hid the survival commando tie/gear strip in CQC Lab because it could read as a strange protrusion from the top-down angle.
- Forced neutral CQC idle guard to use a static idle pose after actor sync, preventing the lab face-off from looking like jogging in place.

Known risks or not verified:

- Browser runtime was not executed from this connector, so Kam should verify visually on Render.

## 2026-07-08 06:55 AM CT

Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=afcd5c8`

Rollback created before update:

- `backup/top-shot-before-combat-cover-models-2026-07-08`
- `backup/top-shot-rollback-1-2026-07-08-combat-models`

Files changed:

- `top-shot/index.html`
- `top-shot/styles.css`
- `top-shot/src/main.js`
- `top-shot/src/cameraAngles.js`
- `top-shot/src/cqcLab.js`
- `top-shot/src/physicality.js`
- `top-shot/src/state.js`
- `top-shot/docs/CQC_LAB_PLAN.md`
- `top-shot/docs/CHANGELOG.md`

Changes made:

- Added CQC Lab access from the main Top Shot panel with a Main Match button and a CQC Lab button.
- Added direct CQC Lab URL support with `?mode=cqc`.
- Added a controlled CQC Lab state where two fighters stand face to face without parachute entry or full-match chaos.
- Added CQC Lab buttons for Guard, Jab, Cross, Block, Parry, Slip Left, Slip Right, Step Back, Slow Mo, and Reset.
- Added a tighter overhead drone camera behavior for CQC Lab, so the camera sits much closer above the fighters.
- Added live fighter status labels, such as Guarding, Crawling, Crouching, Blocking, Parrying, Slipping, Hit Stun, Hiding, and Pinned to Cover.
- Added a Fight Commentary card that mirrors recent fight events so Kam can look away and still read what happened.
- Added a local browser Records card that saves completed match results, winner, loser, match length, method, and short highlights.
- Added initial persistent debris/body-collision support files and state fields, but the full debris throwing and body collision loop still needs the next integration pass.

Known risks or not verified:

- Browser runtime was not executed from this connector, so the Render build needs live testing.
- CQC Lab is intentionally button-driven first. Approved moves still need to be promoted into the main match combat system after review.
- Persistent records are stored in browser localStorage, so they are per-device until a backend/save system is added.

## 2026-07-08 06:36 AM CT

Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=4e2e26d`

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
