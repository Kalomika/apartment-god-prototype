# Ongoing Design Log Append, Pool Emotion Animation Plan

## 2026-07-13 06:55 AM CT, Pool Joy And Disappointment Animation Plan

Status: PLANNED
Branch: phaser-migration
Commit: this documentation append commit
Files changed: apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_POOL_EMOTION_ANIMATION_PLAN.md
Runtime files changed: no
Render playable branch updated: no
Backup branch: not required, documentation only

Summary:
Logged Kam's requested pool emotional animation direction so it is not lost. This is a planned follow-up to the dynamic pool shot movement pass. It has not been executed in runtime yet.

Implementation details:
- Add shot outcome tracking to `src/poolActivitySystem.js`, including made shot, missed shot, consecutive miss streak, and recent success state.
- Add a joy reaction after a successful pocket: brief cue lift, shoulder bounce, small foot step, happy speech bubble such as `YES`, `NICE`, or `CLEAN`, and a short celebratory pose before returning to table-side movement.
- Add a mild disappointment reaction after a single miss: cue lowers, shoulders drop, head tilt downward, small pause, and a short thought or speech bubble such as `ugh` or `almost`.
- Add an intensified disappointment reaction if the same actor misses too many in a row, for example after three misses: longer slump, cue planted on floor, hand-to-head or head shake pose, slower recovery, and a visible mood shift before the next shot.
- Add a confidence recovery beat after the next made shot following a miss streak: sharper cue lift and relieved body language rather than the same generic joy pose.
- Keep reactions top-down and readable on mobile. Avoid emoji-like, chibi, mascot, blob, crude, or side-view acting.
- The reaction system should not stop the pool game forever. Reactions should be short timed interstitials between walk, aim, shot, and next route selection.
- Future animation identity should include at minimum: entry into cue stance, aim loop, cue strike, ball watch, joy reaction, single-miss disappointment, miss-streak disappointment, and recovery back to the next shot route.

Testing performed:
- Documentation-only audit. No runtime files changed.
- Checked current pool movement log and matrix. They cover movement, cue-side stance, cue line/thrust, ball movement, and future cue-in-hand/shot windup needs, but they did not explicitly log joy/disappointment or miss-streak acting.

Testing requested:
- None for this documentation-only append.
- When implemented later, test Pool practice and Pool match for made-shot joy, one-miss disappointment, three-miss disappointment, and recovery after a made shot.

Known risks:
- Runtime pool result logic currently needs fuller made/miss outcome tracking before emotional reactions can be accurate.
- If reactions are too long, they may make the pool activity feel sluggish. Keep them short and interrupt-safe.

Follow ups:
- Implement shot outcome tracking and actor-specific miss streaks in `src/poolActivitySystem.js`.
- Add dedicated top-down reaction poses in the actor renderer or future sprite system.
- Add tests for miss streak state, reaction state expiration, and no permanent actor lock during reactions.
