# Development Matrix Patch, Phaser Mobile Scale Runtime Safeguards

Date: 2026-07-19
Branch: repair/phaser-mobile-scale-runtime-safeguards-2026-07-19
Status: NEEDS_CI_AND_BROWSER_TESTING

## Mobile Phaser Scaling

State: PRESERVED

- game-wrap is the Phaser scale parent.
- FIT scaling remains active.
- NO_CENTER remains active.
- Parent expansion remains disabled.
- CSS and JavaScript wrapper sizing remain in place.
- Resize, page show, and orientation refresh remain in place.

## Runtime Simulation Safety

State: REPAIRED ON SAFE BRANCH

Verified regression source:
- 1c358ba8450fd78c78b15dc5d5208f7835e0349a

Restored:
- finite x and y normalization for loaded entities
- stale walking, running, recovery, and going-to state cleanup
- sleeping actor orientation correction
- fixed simulation steps with bounded foreground and background catchup
- pool choreography exclusion from ordinary movement updates
- arrival resolution only after actual movement arrival
- prior update ordering for gate, pool, activity, offsite, calendar, autonomy, clock, life quality, and tidiness systems

Repair code commit:
- 1e67f9d47e6157185f25303dbb3af978d7da7e3e

Regression test commit:
- 3f84e3d2042d7470e0e551132d2cb0968aa0cac6

Required acceptance:
- CI tests and static build pass on the exact repair head.
- Android portrait shows the full 4:3 scene with accurate touch coordinates.
- Desktop and landscape remain correctly sized.
- Pool actors do not receive ordinary movement during pool choreography.
- Old saves with missing or invalid coordinates boot with finite positions.
- Interrupted movement state returns to idle when no path, target, timer, pool route, or hidden state remains.
