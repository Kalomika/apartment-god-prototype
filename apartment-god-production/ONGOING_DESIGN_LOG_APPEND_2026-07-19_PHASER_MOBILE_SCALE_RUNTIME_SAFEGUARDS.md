# Ongoing Design Log Append, Phaser Mobile Scale Runtime Safeguards

Date: 2026-07-19
Status: NEEDS_CI_AND_BROWSER_TESTING
Branch: repair/phaser-mobile-scale-runtime-safeguards-2026-07-19
Base head: 3e8722052e7dc4fbf781b11979f339327b8b6b06

New branch state audited:
- main remained at ad80f363422778e1e700045a75273854bc32a30b.
- phaser-migration advanced from ad80f363422778e1e700045a75273854bc32a30b to 3e8722052e7dc4fbf781b11979f339327b8b6b06.
- Branch history is a clean ten commit fast-forward from the previously synchronized head.

Verified regression:
Commit 1c358ba8450fd78c78b15dc5d5208f7835e0349a correctly changed Phaser scaling from CENTER_BOTH to NO_CENTER, but the same commit also removed unrelated runtime protections that existed at the previous synchronized head. Removed behavior included fixed step simulation, bounded catchup, old save coordinate normalization, stale actor cleanup, sleeping pose orientation, and the guard that prevents normal movement from competing with pool choreography.

Repair:
- 1e67f9d47e6157185f25303dbb3af978d7da7e3e restored the lost runtime protections without reverting the intended mobile scale configuration.
- 3f84e3d2042d7470e0e551132d2cb0968aa0cac6 added source regression tests for both the mobile scale settings and preserved runtime safeguards.
- 199cb40e1d8d5476f723f7e910dd051c58b12868 added the backup manifest.

Files changed:
- src/phaserParityRuntime.js
- tests/phaser-mobile-scale-runtime-safeguards.test.js
- apartment-god-production/BACKUP_MANIFEST_2026-07-19_PHASER_MOBILE_SCALE_RUNTIME_SAFEGUARDS.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-19_PHASER_MOBILE_SCALE_RUNTIME_SAFEGUARDS.md

Preserved new behavior:
- game-wrap remains the Phaser parent.
- Phaser Scale FIT remains enabled.
- Phaser Scale NO_CENTER remains enabled.
- parent expansion remains disabled.
- mobile wrapper sizing, margin reset, scale refresh, and cache bust changes remain intact.

Testing:
- Prior source code head b7b7e9be1fa8bce7e9d484460aac3625da1cf3b5 passed Phaser Parity CI run 29681106298.
- The repair branch requires its own CI and build result before merge.
- Browser verification remains required on Samsung Android, desktop, resize, page show, and orientation changes.

Render and branch safety:
- Render settings were not changed.
- main was not changed.
- phaser-migration was not changed.
- No force movement or merge was performed.
