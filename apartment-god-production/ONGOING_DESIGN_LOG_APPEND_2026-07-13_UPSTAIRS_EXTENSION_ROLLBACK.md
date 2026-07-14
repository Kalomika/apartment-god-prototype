# Ongoing Design Log Append: Upstairs Extension Rollback

## 2026-07-13, Emergency Upstairs Extension Rollback

Status: ROLLED_BACK_TO_STABLE_RUNTIME
Branch: phaser-migration and main after sync
Runtime restored to: e09fa7bfb4fd11ababcdf5fc83bd19f4a2ccbedc
Runtime files changed: yes by branch rollback
Render playable branch updated: yes after main sync
Render settings changed: no
Backups created before rollback:
- backup/main-before-upstairs-rollback-2026-07-13
- backup/phaser-migration-before-upstairs-rollback-2026-07-13

Summary:
Kam tested the upstairs extension/repair result and found the live upstairs view was a broken, cluttered maze that did not meet the master-over-garage extension intent and did not provide a readable master-section connection. The live runtime was rolled back to the last stable pre-extension head instead of adding another visual patch over the failure.

What was reverted from live runtime:
- The crammed upstairs extension layout.
- The temporary direct connector overlay.
- The broken master/office/bedroom/suite placement that produced the unreadable maze screenshot.
- The premature claim that the upstairs extension was implemented.

Current live runtime truth:
- Upstairs extension is not live.
- Master-over-garage/multi-screen upstairs remains planned.
- Any future upstairs extension must be designed as a proper navigation/camera/layout pass before runtime integration.

Required future acceptance criteria before reattempt:
- Browser screenshot must show a readable upstairs plan.
- Stairs must land in the correct new section.
- Master section must be reachable and visually obvious.
- Foyer extension must read like architecture, not a blocking patch.
- If the upstairs exceeds one screen, camera/slide/pull/navigation must be implemented first.
- Do not mark complete from object IDs or import checks alone. Audit must compare live browser view against Kam's design intent.

Testing performed:
- Branch refs for phaser-migration and main were reset to the stable runtime head.
- Branch compare confirmed main and phaser-migration are identical after rollback.

Testing requested:
- Open https://apartment-god-phaser.onrender.com after Render rebuild and hard refresh.
- Confirm the broken extended upstairs maze is gone.
- Confirm upstairs has returned to the prior stable layout.

Known risks:
- This removes the failed live upstairs extension from runtime, but the planning docs from the failed extension may need to be reintroduced separately in a clean Idea Bible without reintroducing the broken code.

Follow ups:
- Recreate or preserve the upstairs extension idea as planning only.
- Design the multi-screen upstairs/master-over-garage architecture before touching runtime again.
