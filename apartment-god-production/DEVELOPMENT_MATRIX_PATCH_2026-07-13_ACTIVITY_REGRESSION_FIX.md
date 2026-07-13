# Development Matrix Patch, Activity Regression Fix

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Runtime regression guards | NEEDS_TESTING | `src/runtimeRegressionGuards.js`, `src/canvasRuntime.js` | Guards stale or bad actor states where cooking can be active away from the stove or actors can remain trapped inside the couch after an action. | Test stove cooking from autonomy and guided command, then test couch exit after TV or couch actions. |
| Main couch visual correction | NEEDS_TESTING | `src/visualRegressionFixes.js`, `src/rendering.js` | Correction pass clears and redraws the main L sectional with the chaise on the kitchen side. This is a temporary correction layer until the older wrong couch draw is removed or replaced by asset backed art. | Confirm couch faces TV and the chaise is on the kitchen side with walkable openings. |
| Household activity animation routing | NEEDS_TESTING | `src/renderEntities.js` | Restored specific Canvas first pass poses for normal household actors, not only lab test actor. | Test all listed activity actions on Render. |

## Object Interaction Matrix Updates

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Stove | Main kitchen | NEEDS_TESTING | Cook meal | Human | Actor must stand at stove contact and use stirring or pan loop | Bad saved state or arrival mismatch can show cooking in service hall | Guard added, needs Render test. |
| Couch | Main living room | NEEDS_TESTING | TV, rest, couch actions | Human | L sectional must face TV with chaise on kitchen side and no actor trap | Older couch overlay still exists under correction pass | Guard and corrected overlay added, needs Render test. |
| Bed | Upstairs bedroom | NEEDS_TESTING | Sleep, nap, waking | Human | Head should read as bed aligned, not sideways and backwards | Blanket overlay and actor pose can fight if not tested | Sleep pose rebuilt, needs Render test. |
| Weight bench | Basement | NEEDS_TESTING | Lift weights | Human | Barbell rep loop | First pass Canvas animation only | Restored household actor pose, needs Render test. |
| Treadmill | Basement | NEEDS_TESTING | Treadmill | Human | Running loop on belt | First pass Canvas animation only | Restored household actor pose, needs Render test. |
| Heavy bag | Basement | NEEDS_TESTING | Heavy bag | Human | Punch contact and bag sway | First pass Canvas animation only | Restored household actor pose, needs Render test. |
| Console or arcade | Basement | NEEDS_TESTING | Play game | Human | Hand/controller loop and screen facing | Needs path and facing test | Restored household actor pose, needs Render test. |
| Pool | Backyard | NEEDS_TESTING | Swim | Human | Top down swim stroke and water motion cue | First pass Canvas animation only | Restored household actor pose, needs Render test. |

## Animation Matrix Updates

| Animation Or Pose | Current Status | Required Quality Target | Needed Directions | Frame Need | Current Fallback | Test Notes |
|---|---|---|---|---|---|---|
| Sleep | NEEDS_TESTING | Bed aligned top down sleeper with readable head and blanket | Bed orientation | Breathing loop | Rebuilt Canvas first pass | Test upstairs bed on Render. |
| Lift weights | NEEDS_TESTING | Barbell movement with bench relationship | Bench orientation | Rep loop | Rebuilt Canvas first pass | Test basement and lab if applicable. |
| Treadmill run | NEEDS_TESTING | Running loop with belt and rail | Machine facing | Low frame run loop | Rebuilt Canvas first pass | Test basement treadmill. |
| Heavy bag | NEEDS_TESTING | Contact punch and bag sway | Bag facing | Impact loop | Rebuilt Canvas first pass | Test basement heavy bag. |
| Swim | NEEDS_TESTING | Water contact stroke, not standing on pool | Pool direction | Stroke loop | Rebuilt Canvas first pass | Test backyard pool. |
| Arcade or console | NEEDS_TESTING | Hands at controls and screen facing | Object facing | Button or controller loop | Rebuilt Canvas first pass | Test arcade and console. |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Cooking location guard | Critical | NEEDS_TESTING | Command Girlfriend to cook or let autonomy cook. Confirm she walks to the stove and the label does not say cooking while she is in the stair or service hall. |
| Couch trap guard | Critical | NEEDS_TESTING | Let Resident watch TV or use couch, wait for action completion, then command him elsewhere. Confirm he is not trapped inside the couch. |
| Couch L direction | Critical | NEEDS_TESTING | On main floor, confirm the L chaise is on the side closer to the kitchen and the couch still faces the wall TV. |
| Sleep head pose | High | NEEDS_TESTING | Put Resident or Girlfriend to sleep. Confirm the head reads as bed aligned and not sideways plus backwards. |
| Activity animation regression | Critical | NEEDS_TESTING | Test lift weights, treadmill, heavy bag, arcade or console, pool cue use, soccer, and swim. Confirm actors do not just stand with a progress bar. |
