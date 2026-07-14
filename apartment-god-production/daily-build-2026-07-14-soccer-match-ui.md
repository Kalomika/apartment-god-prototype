# Daily Build, Soccer Match UI

## Branch
`mechanics-first-soccer-match-ui-2026-07-14`

## Mechanics audit finding
The soccer runtime already supports both `soccer_practice` and `soccer_match`, including a dedicated match starter and a 60 unit match duration. The soccer field object menu only exposed practice, so the existing match mechanic was unreachable through normal in game object interaction.

## Change
Added `Play Soccer Match` to the soccer field action menu. Selecting it now routes through the existing arrival branch to `startMiniSoccerAtField`, keeping the current match positioning, ball logic, need changes, and visible action timing intact.

## Scope safety
No renderer, sprite, Render, deployment, vehicle, room, dog atlas, or `Kalomika/ai-rpg-engine` files were changed.

## Validation
Verified the branch version of `src/config.js` contains both soccer field options and that `ACTION_TIMES.soccer_match` remains 60. Full browser and npm checks were unavailable because the execution environment could not resolve GitHub for a local clone.

## Remaining uncertainty
The menu path and match start need an in browser click test. The current match implementation should also be checked for correct opposing positions and whether a second human or dog participant is visibly staged before play.

## Next target
Audit soccer match participant staging and consent, then fix together invitation hearing and trait driven acceptance on the latest main line without overwriting recent room and dog renderer work.
