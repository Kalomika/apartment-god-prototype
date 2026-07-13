# Development Matrix Patch, Pool Emotion Animation Plan

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Pool emotion reactions | PLANNED | `src/poolActivitySystem.js`, future actor reaction renderer or sprite system | Needs made-shot, missed-shot, consecutive miss streak, joy, disappointment, and recovery reaction states. Not implemented yet. | Implement outcome tracking and short timed reaction interstitials between pool shots. |

## Animation Matrix Updates

| Animation Or Pose | Current Status | Required Quality Target | Needed Directions | Frame Need | Current Fallback | Test Notes |
|---|---|---|---|---|---|---|
| Pool made-shot joy | PLANNED | Cue lift, shoulder bounce, happy body language, short readable top-down celebration | Four table sides over time | Entry, burst, settle | None yet | Trigger when a ball is pocketed. |
| Pool single-miss disappointment | PLANNED | Cue lowers, shoulders drop, head tilt, short pause, mild frustration | Four table sides over time | Miss, slump, recover | None yet | Trigger after one missed shot. |
| Pool miss-streak disappointment | PLANNED | Bigger slump or head shake after repeated misses, not cartoonish or emoji-like | Four table sides over time | Miss streak trigger, hold, recover | None yet | Trigger after three consecutive missed shots by the same actor. |
| Pool confidence recovery | PLANNED | Relief or sharper happy beat after making a shot following a miss streak | Four table sides over time | Recover, joy, return to route | None yet | Trigger after a made shot clears a miss streak. |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Pool joy reaction | High | PLANNED | Pocket a ball during Pool practice and confirm the actor plays a short joy animation before moving to the next stance. |
| Pool disappointment reaction | High | PLANNED | Miss one shot and confirm the actor plays a mild disappointment animation, then resumes play. |
| Pool miss streak reaction | High | PLANNED | Force or observe three missed shots in a row by one actor and confirm a stronger disappointment animation plays without locking the actor. |
| Pool recovery reaction | Medium | PLANNED | After a miss streak, make a shot and confirm a relief/confidence recovery beat plays. |
