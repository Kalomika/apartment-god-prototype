## 2026-07-08 01:45 PM CT, Pool Routing and Activity State Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: 911b7e8162e955b1383a29972800260c95bc6c60 before this log append
Files changed: src/world.js, src/activitySystems.js, src/actions.js, src/blueprint.js, src/renderObjects.js
Runtime files changed: yes
Render playable branch updated: pending main mirror
Backup branch: backup/phaser-migration-before-pool-routing-pass-2026-07-08

Summary:
Patched the pool activity, basement pool table layout, kitchen and living routing, dining table placement, visible garage door issue, and stale Recovered activity state issue.

Implementation details:
- Rotated and moved the pool table into a more open basement position so players have room to stand around the table.
- Changed pool practice and pool matches so they persist as real pool activities rather than actors grabbing a cue and wandering away.
- Pool practice now continues until the rack is cleared.
- Pool matches now continue until all balls are sunk instead of ending from a time or shot cap.
- Added shot states for sink, miss, and position play.
- Added active pool table rendering for live balls, score, remaining ball count, aim line, cue thrust, and current pool message.
- Moved the dining table to the kitchen side near the living/kitchen boundary instead of the foyer walking path.
- Removed direct kitchen/living room doorway routing to restore the wall and force navigation through proper room connections.
- Made the main floor garage door visible as a portal object instead of an invisible stairs style doorway.
- Relaxed coupled activity invite rejection so partners accept if they are available and not actually preoccupied by a timed activity, route, bathroom, shower, severe hunger, or exhaustion.
- Added cleanup for stale Recovered action labels so recovery text does not remain as a player-facing current activity.

Testing performed:
Code inspection and GitHub compare only. No local or Render browser test performed in this chat.

Testing requested:
After main is updated, test https://apartment-god-phaser.onrender.com. Test arcade recovery, current action labels after activity completion, pool solo practice until balls clear, pool together match until balls clear, movement around the rotated pool table, dining table placement, route from living to kitchen through proper connections, visible garage/main door, and coupled activity acceptance when the partner is free.

Known risks:
This changes routing geometry and pool state persistence. The pool table is intentionally rotated and may need one more layout adjustment after visual testing. The schedule and personal day planning system is planned separately and not implemented in this pass.

Follow ups:
Implement personal day logs and time budgeting so characters estimate whether long activities fit before work, errands, hunger, bladder, sleep, or scheduled obligations.
