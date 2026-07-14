# Ongoing Design Log Append: South Walk Facing Guard

## 2026-07-14, South Walk Facing Guard

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render playable branch updated: pending main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-south-walk-facing-guard-2026-07-14

## Files changed

- src/southWalkFacingGuard.js
- src/rendering.js
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_SOUTH_WALK_FACING_GUARD.md

## Summary

Kam tested the emergency renderer revert and confirmed the remaining bug: when the character walks south/down, the game still shows the back-facing look. The bug is caused by the old renderer still rotating the human body for vertical south movement.

## Implementation details

- Added `src/southWalkFacingGuard.js` as a narrow runtime guard.
- The guard only activates for moving human actors whose current path target is south/down of their current position.
- It overlays the original front-facing walking pose over the wrong south/back rendering.
- It does not change seating, activities, shower poses, toilet poses, or other animations.
- It does not attempt another broad character look replacement.
- `src/rendering.js` now calls `drawSouthWalkFacingGuard` immediately after the normal entity renderer.

## User visual pivot preserved

Kam also clarified that the final look should not be side-view front/back. True top-down characters should mainly show the top of the head and shoulders/body mass. The current guard is only an emergency bug fix until the proper PNG character system replaces the procedural look.

## Testing performed

- Verified by code inspection through GitHub fetch/compare.
- Browser behavior is not verified from this connector environment.

## Testing requested

- Open https://apartment-god-phaser.onrender.com after Render rebuild and hard refresh.
- Walk the resident south/down in a straight vertical route.
- Confirm the body does not show the back-facing head/body while moving down.
- Walk north/up and confirm the back-facing read still appears there.
- Confirm seating and activity animations were not broadly changed by this guard.

## Known risks

- This is an overlay guard, not a final character system.
- It may slightly cover the old rendered body during south movement because it deliberately hides the wrong back-facing draw.
- Final character solution remains the planned PNG top-down sprite system.

## Follow ups

- Replace the human procedural renderer with a true top-down PNG atlas and manifest.
- Remove this guard after the final directional sprite system is active and verified.
