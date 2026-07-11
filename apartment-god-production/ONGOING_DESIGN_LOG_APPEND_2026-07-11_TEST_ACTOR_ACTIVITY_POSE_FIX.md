# 2026-07-11 03:42 PM CT, Test Actor activity pose correction

Status: PARTIAL IMPLEMENTED
Branch: phaser-migration
Commits:
- renderer fix 59be5bbaff87c49f2d6899e52cbaf057ec80746f
- manifest fix 8850e6c18e9865e87ce52d798adae999f51d09cb
Runtime files changed: yes
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-test-actor-activity-pose-fix-2026-07-11

## Files changed

```txt
src/testActorSpriteRenderer.js
src/testActorPoseManifest.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-11_TEST_ACTOR_ACTIVITY_POSE_FIX.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-11_TEST_ACTOR_ACTIVITY_POSE_FIX.md
```

## Summary

Corrected the Test Subject first pass so gym and contact activities no longer collapse into the same broad workout or walking visual. This directly addresses the issue where the Test Subject appeared to waddle or use the same motion instead of lifting weights or punching the heavy bag.

## Implementation details

`src/testActorPoseManifest.js` now maps `lift_weights`, `heavy_bag`, `treadmill`, `soccer_practice`, and `soccer_match` to exact pose IDs: `lift_weights`, `heavy_bag`, `treadmill_run`, and `soccer_kick`.

`src/testActorSpriteRenderer.js` now has an `exactContactPose` guard that takes priority during timed activities, so contact activities do not get overridden by path movement or the generic pose family.

Added separate renderer functions:

```txt
drawLiftWeights
drawHeavyBag
drawTreadmillRun
drawSoccerKick
```

The heavy bag pose includes a bag body, extended punch, glove contact, and impact burst. The lifting pose includes a bench, lying body orientation, barbell, plates, and rep motion. Treadmill has belt and stride motion. Soccer has plant foot, swing leg, and ball contact.

## Testing performed

```txt
node --check /mnt/data/ag_fix_manifest.js
node --check /mnt/data/ag_fix_renderer.js
GitHub commit verification after update
```

No browser test was performed in this run.

## Testing requested

On a local or browser build of `phaser-migration`, go to Secret Lab East and trigger Lab Weight Bench, Lab Heavy Bag, Lab Treadmill, and soccer if available. Confirm Test Subject no longer shows the same waddling animation during these timed actions.

## Known risks

This is still Canvas vector sprite work, not final painted PNG sprite sheets. The correction fixes activity identity and contact posing for the named actions, but the final visual quality still needs the actual sprite sheet production pass.

## Follow ups

```txt
Add a visual pose cycler for Test Subject.
Create actual PNG sprite sheets for approved exact poses.
Split shower, toilet, swim, darts, arcade, couple, and live dog petting into exact contact poses.
Consolidate this append into the canonical ongoing log during the next documentation sync.
```
