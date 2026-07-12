# 2026-07-12, Manual Tap Routing and Stale Action Interruption Fix

Status: IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-manual-tap-routing-fix-2026-07-12

## Files changed

```txt
src/ui.js
src/movement.js
```

Runtime files changed: yes
Vehicle files changed: no
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Summary

Fixed the issue where the selected actor could stay visually or logically stuck in a sitting/eating/shower action after the player tapped the floor. Manual commands now interrupt old timed activity state before moving, instead of only doing that in guided mode.

## Implementation details

- Player object/social/offsite/floor click commands now clear the actor's path, target, pending task, queued task, action timer, action total, and current action id before applying the new command.
- Direct floor tap movement now also clears stale timed action state inside `commandMove` as a second safety layer.
- Direct tap movement now tries nearby open points around the requested tap if the exact tapped point is not routable.
- This should stop the resident from copping a squat and sliding while tapped to move.
- This should stop old sit/eat/shower pose logic from winning after a manual movement tap.

## Testing requested

```txt
Refresh the playable branch.
Select Resident while he is sitting, eating, showering, or in any timed action.
Tap open floor near him.
Confirm he immediately cancels the old action and walks.
Tap around the dining table and nearby door lanes.
Confirm he moves to nearby open floor instead of showing No route unless the target is truly inaccessible.
```

## Known risks

This intentionally makes direct player commands authoritative. If the player taps while an autonomous activity is running, the player command cancels that activity. That matches guided debugging and the user's expectation that taps should move the selected actor.
