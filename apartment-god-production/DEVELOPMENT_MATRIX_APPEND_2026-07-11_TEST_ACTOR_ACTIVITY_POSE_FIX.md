# Development Matrix Append, 2026-07-11, Test Actor Activity Pose Fix

Status: PARTIAL IMPLEMENTED
Branch: phaser-migration
Commits:
- renderer fix 59be5bbaff87c49f2d6899e52cbaf057ec80746f
- manifest fix 8850e6c18e9865e87ce52d798adae999f51d09cb
Backup branch: backup/phaser-migration-before-test-actor-activity-pose-fix-2026-07-11

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Animation Matrix | Lift weights | PARTIAL generic workout family for Test Subject | PARTIAL exact Test Subject pose | Added bench press body orientation, barbell, plates, and rep motion. |
| Animation Matrix | Punch heavy bag | PARTIAL generic workout family for Test Subject | PARTIAL exact Test Subject pose | Added bag, boxing stance, extended punch, glove contact, and impact burst. |
| Animation Matrix | Treadmill | PARTIAL generic workout family for Test Subject | PARTIAL exact Test Subject pose | Added treadmill belt and running contact stride. |
| Animation Matrix | Soccer practice | PARTIAL generic workout family for Test Subject | PARTIAL exact Test Subject pose | Added plant foot, swing leg, and ball contact. |
| Test Matrix | Activity animation identity | NEEDS_TESTING | NEEDS_TESTING, corrected first pass | Contact activities should no longer display the same waddling or generic workout pose during timed actions. |
| Risk Matrix | Sprite pipeline | HIGH | HIGH, partly corrected | Still needs real PNG sprite sheet production after the vector proof is visually approved. |

## Required checks

```txt
Test Lab Weight Bench.
Test Lab Heavy Bag.
Test Lab Treadmill.
Test soccer practice if routed to the Test Subject.
Confirm path walking only appears while traveling to the object, not during timed contact activity.
Confirm no browser boot error from the renderer replacement.
```

## Note

This append should be folded into the canonical matrix during the next documentation sync pass.
