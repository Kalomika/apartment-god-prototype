# Code Review Notes, 2026-07-04

## Reviewed areas

- `world.js`, floors, rooms, objects, approach points, stair exits.
- `movement.js`, cross-floor routing and floor-travel continuation.
- `actions.js`, object actions, social/together actions, stat completion.
- `economy.js`, phone food order and courier flow.
- `cooking.js`, fridge prep and stove cooking flow.
- `renderObjects.js`, fridge and basement object rendering.
- `renderDynamic.js`, courier rendering.
- `ui.js`, basement button and HUD delivery status.
- `state.js`, basement room lights and memory seed.

## Main risk points

- Browser testing is still required.
- Basement stairs and route-through-doors should be manually tested.
- Together consent is a first pass only and needs deeper routine/personality logic later.
- The courier flow is a first visible slice and should later become a reusable service NPC system.

## Local build result

Local build was not possible in this environment because GitHub clone failed due DNS resolution for `github.com`.
