# Top Shot Tactical Cover Changelog

Date: 2026-07-09
Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=tactical-cover-grapple-20260709`

Rollback created before update:

- `backup/top-shot-before-tactical-cover-preservation-2026-07-09`

Files changed:

- `top-shot/src/arena.js`
- `top-shot/src/brain.js`
- `top-shot/src/perception.js`
- `top-shot/src/combat.js`
- `top-shot/src/systems.js`
- `top-shot/src/three/effects3D.js`
- `top-shot/tests/simSmoke.js`
- `top-shot/asset_inbox/reference_notes/TACTICAL_COVER_PRESERVATION_AND_GRAPPLING_LOG.md`
- `top-shot/asset_inbox/ASSET_MANIFEST.md`
- `top-shot/docs/CHANGELOG_TACTICAL_COVER_2026-07-09.md`

Changes made:

- Added preservation-first tactical behavior so ranged fighters stop endlessly orbiting and shooting in the open.
- Added pinned cover states and cover-peek firing windows.
- Added dive/roll-to-cover timing windows under suppression.
- Added material-aware projectile impacts, including metal sparks, shrapnel/chips, lodged arrows, and arrow/shuriken bounce off metal.
- Changed bullet body hits toward blood spray unless armor absorbs the hit.
- Added armor spark reactions for armor hits.
- Added a ninja/shadow ninja grappling hook ability that launches the fighter toward climbable high cover.
- Fixed ninja smoke timing so smoke can trigger while under suppression.
- Added readable pose overlays for cover, peek, dive, roll, crawl, grappling, wounded reactions, punches, kicks, and blade actions.
- Added smoke test assertions for tactical cover/evasion behavior and ninja grappling hook line effects.

Known risks or not verified:

- Browser runtime was not executed from this connector, so Kam should verify visually on Render.
- This is still procedural animation. The next pass should replace pose overlays with authored animation clips and better hit contact timing.
