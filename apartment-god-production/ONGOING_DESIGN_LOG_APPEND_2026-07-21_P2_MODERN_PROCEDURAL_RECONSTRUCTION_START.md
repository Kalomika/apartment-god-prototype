## 2026-07-21, P2 Modern Procedural Reconstruction Started

Status: PLANNED, IMPLEMENTATION IN PROGRESS
Branch: phaser-migration-2
Commit: pending implementation commits
Files changed: directive append, this log append, matrix patch, then native Phaser room renderer, object renderer, runtime integration, touch navigation correction, tests, and build workflow
Runtime files changed: planned
Render playable branch updated: no
Backup branch: backup/phaser-migration-2-before-modern-procedural-reconstruction-2026-07-21

Summary:
Kam browser-tested the current P2 AppDeploy preview and rejected the visible translation. The current game preserves much source data but visually fails the actual directive. Screenshots show large empty dark room boxes, tiny padded objects, washed floor imagery, toy-like or boat-like vehicles, weak outdoor construction, compressed basement staging, inconsistent character-to-object scale, incorrect bed alignment, and mobile controls that can require duplicate taps or extra swipes. A source and data parity report alone is therefore insufficient.

Implementation details:
- Preserve native Phaser ownership and the verified gameplay contract.
- Stop using stretched room SVGs and padded object images as the primary visible game.
- Reconstruct rooms and objects with native Phaser Graphics using the older coherent warm procedural build as the visual baseline, then modernize materials, depth, construction, and readability.
- Preserve exact room and object world coordinates.
- Give rooms distinct material identity and connected architecture.
- Give vehicles dedicated true top-down proportions.
- Give beds, couches, tables, fixtures, gym equipment, sports objects, yard objects, and arcade objects specific construction at their actual footprint.
- Make sleeping orientation and blanket alignment object-aware.
- Fix mobile pointer activation so Up, Down, Map, Phone, and floor controls respond to one deliberate touch.
- Keep temporary generated asset sheets documented as fallback only.

Testing performed:
User supplied ten Android screenshots across Main House, Upstairs, Basement, Garage, Backyard, Front Yard South, and Driveway West. Visual review confirms the current presentation does not meet the target despite booting successfully.

Testing requested:
After implementation, test the isolated P2 preview on Android. Confirm one-tap navigation, one-swipe neighboring-area navigation, readable room construction, correct object scale, vehicle anatomy, bed orientation, basement composition, outdoor composition, and no duplicate actor body during activities.

Known risks:
This is a major renderer and mobile-input correction. It can affect click alignment, object visibility, depth, floor switching, and actor-object relationships. Changes must remain auditable and must not touch main or Render.

Follow ups:
Run checks, tests, and build. Keep status NEEDS_BROWSER_CONFIRMATION until Kam inspects the result on Android.
