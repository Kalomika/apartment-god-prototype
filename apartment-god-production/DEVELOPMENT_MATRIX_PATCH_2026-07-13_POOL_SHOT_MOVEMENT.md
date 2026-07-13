# Development Matrix Patch, Pool Shot Movement

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Pool activity system | NEEDS_TESTING | `src/poolActivitySystem.js`, `src/canvasRuntime.js`, `tests/pool-shot-movement.test.js` | Active Pool practice and Pool match now create a lightweight pool game state, move actors around the pool table to cue-side stances, animate cue lines/thrust, move balls, and pocket object balls. | Browser test basement pool for at least 20 seconds on Render. |

## Object Interaction Matrix Updates

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Pool table | Basement | NEEDS_TESTING | Pool practice, Pool match | Human | Actor should move around the table to the cue ball side, line up shots, cue ball and object balls should move toward pockets | Lightweight first pass, not full billiards rules; cue-in-hand walking animation still needed | Test guided Pool practice and Pool match on Render. |

## Animation Matrix Updates

| Animation Or Pose | Current Status | Required Quality Target | Needed Directions | Frame Need | Current Fallback | Test Notes |
|---|---|---|---|---|---|---|
| Pool movement and shot cycle | NEEDS_TESTING | Actor walks around table, settles into cue stance, cue thrust happens from the chosen side, balls move after impact | Four table sides plus diagonals over time | Walk, aim, thrust, recovery | First pass Canvas movement and cue overlay | Confirm actor does not remain static for the whole action. |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Pool actor repositioning | Critical | NEEDS_TESTING | Start Pool practice. Confirm the actor moves around the pool table to the side closest to the cue ball before each shot, instead of standing in one fixed location. |
| Pool ball movement | High | NEEDS_TESTING | Watch Pool practice for at least 20 seconds. Confirm cue line/thrust appears and the cue ball/object balls move toward pockets. |
| Pool match two-person spacing | High | NEEDS_TESTING | Start Pool match with two humans. Confirm they do not occupy the same stance and both use offset cue-side positions when active. |
