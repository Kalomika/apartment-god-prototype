# Backup Manifest, Phaser Mobile Scale Runtime Safeguards

Date: 2026-07-19
Status: REPAIR BRANCH, NEEDS_CI_AND_BROWSER_TESTING

Source branch: phaser-migration
Source head: 3e8722052e7dc4fbf781b11979f339327b8b6b06
Repair branch: repair/phaser-mobile-scale-runtime-safeguards-2026-07-19

Verified regression source:
- 1c358ba8450fd78c78b15dc5d5208f7835e0349a removed unrelated runtime safeguards while changing Phaser mobile scale ownership.

Repair commits:
- 1e67f9d47e6157185f25303dbb3af978d7da7e3e, restore runtime safeguards while preserving the mobile scale configuration.
- 3f84e3d2042d7470e0e551132d2cb0968aa0cac6, add regression tests.

Protected branches changed: no
Render settings changed: no
Main changed: no
Phaser migration changed: no
Force update performed: no

Files backed by the source commit:
- src/phaserParityRuntime.js at blob 09e3656590a1b760fd13b192a2d142150f1f345c

Repair scope:
- restore old save coordinate normalization
- restore stale actor state cleanup
- restore sleeping pose orientation
- restore fixed step simulation and bounded catchup
- prevent normal movement from competing with active pool choreography
- retain Phaser FIT, NO_CENTER, game-wrap parent ownership, disabled parent expansion, and mobile scale refresh work
