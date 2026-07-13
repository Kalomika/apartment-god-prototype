# Ongoing Design Log Append: Soccer Aimed Kick Fix

## 2026-07-13 04:50 AM CT, Soccer Aimed Kick Fix

Status: NEEDS_TESTING
Branch: phaser-migration and main after sync
Commit: 32cc5ac3f2db8e18caf984df13d6444a35aa91d7, plus this append commit
Files changed:
- src/soccerSystem.js
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_SOCCER_AIMED_KICK_FIX.md
Runtime files changed: yes
Render playable branch updated: yes after backup and main sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-soccer-aimed-kick-fix-2026-07-13
- backup/main-before-render-update-2026-07-13-soccer-aimed-kick-fix

Summary:
Rejected and replaced the old soccer behavior where the player ran in a circular orbit around the field and the ball bounced in random directions. Soccer now uses a first pass aimed kick loop.

Implementation details:
- Removed the circular player movement logic that used trigonometric orbiting around the field center.
- Added a shot setup loop: run to the ball, plant, aim at the goal, kick, ball travels, score or miss, then reset for the next shot.
- Added an aiming line and target marker during the setup phase so soccer reads more like the pool aiming mechanic.
- Added player poses for `soccer_run_to_ball`, `soccer_plant`, `soccer_kick_windup`, `soccer_kick_follow_through`, `soccer_defend_goal`, and `soccer_ready` as runtime state names for future animation mapping.
- Updated dog ball play to chase and tap toward targets instead of circling the ball.
- Kept the existing scoreboard and goal layout but improved the message language to say aimed shots and goals.

Testing performed:
- Verified by code inspection that `updateSoccerPlayerPosition` circular movement was removed and replaced by `updateAimedSoccerTurn`.
- No local browser run was available in this tool state.

Testing requested:
- Open https://apartment-god-phaser.onrender.com after Render finishes rebuilding.
- Start soccer practice.
- Confirm the character does not run in a circle.
- Confirm the character runs to the ball, pauses/plants, kicks toward the goal, and the ball travels along an aimed line.
- Confirm goals and misses are readable.
- Test dog ball play and confirm the dog chases/taps the ball instead of orbiting in a circle.

Known risks:
- This is a first gameplay fix, not the final PNG animation set.
- The new pose names need real top down anime run and kick PNG frames.
- Browser tuning may be needed for kick timing, speed, goal accuracy, and actor scale.

Follow ups:
- Create real soccer run, plant, kick windup, kick follow through, defend, and ready animation frames.
- Add goal net reaction and ball impact animation.
- Add pass/defend logic for multi-character soccer instead of only alternating shots.
