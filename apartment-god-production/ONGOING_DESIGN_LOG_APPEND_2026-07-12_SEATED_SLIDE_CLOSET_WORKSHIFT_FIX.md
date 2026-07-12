# 2026-07-12, Seated Slide, Closet, Shower, Table, and Four Hour Work Shift Fix

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-seated-slide-table-shower-vehicle-fix-2026-07-12

## Files changed

```txt
src/testActorPoseManifest.js
src/renderEntities.js
src/afterEntityOverlays.js
src/world.js
src/blueprint.js
src/careerSystem.js
src/travelLocations.js
```

Runtime files changed: yes
Vehicle files changed: no
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Summary

Fixed the regression where actors could slide across the house in seated, sleeping, or shower privacy poses before arrival. Movement now has priority over activity poses for main actors and Test Subject. Removed the shower censor mosaic overlay path. Moved the dining table out of the kitchen doorway route. Converted the upstairs closet from a random cabinet object into a structural walk in closet room at the left end of the upstairs hall, with a bedroom to closet doorway. Reduced regular career schedules to four hour work windows, three or four days per week, with lighter need drain. Shortened the work offsite duration so work no longer consumes the whole playable day.

## Implementation details

- Test Subject pose resolution now checks movement before current action mapping when there is no active action timer.
- Main person rendering now forces walking while the actor is pathing or has a target and no active action timer.
- Shower after entity overlay no longer draws the blocky mosaic censor and only shows clothes/towel overlays when the actor is actually at the shower and not moving.
- Seated facing overlay no longer appears while the actor is moving.
- Dining table moved upward inside the kitchen, away from the bottom doorway path.
- Upstairs rooms now include `walkin_closet` at the left end of the hall, and the hall begins to the right of it.
- Closet object is now a small bedroom closet doorway/trigger, not a freestanding cabinet or chest.
- Blueprint added a bedroom to walk in closet doorway for pathfinding.
- Career tracks changed from long five day/eight hour style schedules to four hour blocks, three or four days weekly.
- Work destination now uses a short playable offsite duration representing the four hour shift.

## Testing performed

```txt
Local syntax checks were performed on generated replacement files before write for:
world.js
blueprint.js
careerSystem.js
travelLocations.js
```

GitHub compare was run against the backup branch after the patch.

No browser test was performed.

## Testing requested

```txt
Refresh the phaser-migration preview or Render branch if it is pointed there.
Select a character and send them to the garage, dining table, shower, and closet.
Confirm walking actors walk instead of sliding in a squat or seated pose.
Confirm eating pose only appears after arrival at the dining table.
Confirm dining table no longer blocks the kitchen/entry doorway path.
Confirm shower no longer shows the blocky blur/mosaic.
Confirm closet appears as a structural room at the left end of the upstairs hall with entry from the bedroom.
Let the clock reach work time and confirm work shifts are shorter and not every weekday.
```

## Known risks

This was not browser tested. Vehicle door and remote lock timing was not changed in this pass because another active AI is working vehicle updates and the user explicitly warned not to step on that work.

The calendar can already book travel, but full autonomous same day household task planning, chores, shared movie/game/pool plans, and multi actor attendance rules still need a dedicated calendar planning pass. Do not pretend that part is complete.
