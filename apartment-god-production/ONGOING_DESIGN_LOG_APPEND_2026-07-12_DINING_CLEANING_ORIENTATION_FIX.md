# 2026-07-12, Dining Meal Cleaning and Seating Orientation Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-dining-cleaning-orientation-2026-07-12

## Commits

```txt
meal cleanup helpers 45ea2d42e0d1a8704c83f4f6511add5bfacb7202
state initialization dd114afcef8d54de209e0d17dbea6fcd179cff57
config actions d2a37aa6555220fc4ce53bef7bf00559ba607522
world cleaning objects b77ffbd873ff74b79b1b3de30435b5ff9b64e5de
actions meal flow 80d9418b5847bd0b45adf2c7d259c7ea73564a4f
render objects 294813587fbdd4a3ce7141c5477428ea3d863ea5
seated orientation c5dc589304701b228b7d8b4199f490e15f299f48
lap plate removal 732d9dd5048dc6ff3170e361f37be2151965a01f
north-facing seat guard be170e65cc4cc899bb593196ce7c87b1f4cef14e
```

## Files changed

```txt
src/mealCleanupSystem.js
src/state.js
src/config.js
src/world.js
src/actions.js
src/renderObjects.js
src/afterEntityOverlays.js
src/renderEntities.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-12_DINING_CLEANING_ORIENTATION_FIX.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-12_DINING_CLEANING_ORIENTATION_FIX.md
```

Runtime files changed: yes
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Summary

Implemented the first correction pass for dining table eating, seated object orientation, meal flow, crumbs, manual vacuum cleaning, a non blocking service cleaning closet, and a robot vacuum.

## Implementation details

- Added `src/mealCleanupSystem.js` for table meal placement, crumb spawning, manual crumb cleanup, and robot vacuum movement.
- Added default `state.meals.tablePlates` and `state.cleaning.crumbs` plus a default robot vacuum state.
- Added cleaning actions for `cleaning_closet`, `vacuum_cleaner`, and `robot_vacuum`.
- Added meal stage timings for gathering ingredients, cooking, serving, vacuuming, and starting the robot vacuum.
- Added a non blocking Service Cleaning Closet, Vacuum Cleaner, and Robot Vacuum to the main floor service and entry areas.
- Changed dining table approach to the south side so eating at the table faces the table more naturally.
- Changed fridge meal action into a simple pipeline: gather ingredients at fridge, cook meal at stove, serve meal at dining table, then eat.
- Added table plate rendering from `state.meals.tablePlates` so food appears on the dining table rather than being treated as a lap prop.
- Removed the lap plate during dining table eating in the base entity renderer.
- Added a seated orientation overlay so actors face their target object while seated, including dining table and screen facing states.
- Restricted the back facing seated overlay to north facing seats so south facing seats can still use the normal front view.
- Added crumb rendering and crumbs after snacks or meals.
- Added manual vacuum cleanup and an autonomous robot vacuum that hunts crumbs on the same floor.

## Testing performed

GitHub file inspection and compare against the backup branch were performed. No local npm build, browser test, or Render test was performed from this connector run.

## Testing requested

```txt
Open phaser-migration in browser.
Reset or start a clean state.
Tap Fridge > Cook Meal and confirm the actor gathers ingredients first.
Confirm the actor then routes to the stove and cooks.
Confirm the actor then routes to the dining table and eats.
Confirm food appears on the dining table, not in the lap.
Confirm the actor visually faces the table while eating.
Confirm seated TV, console, desk, reading, and dining poses do not face random directions.
Confirm south facing seats still show the actor front instead of a forced back view.
Confirm crumbs appear after snacks and dining meals.
Tap Vacuum Cleaner > Vacuum Crumbs and confirm nearby crumbs are removed.
Tap Robot Vacuum > Start Robot Vacuum and confirm it moves toward crumbs and clears them.
Confirm the Service Cleaning Closet, Vacuum Cleaner, and Robot Vacuum do not block pathing.
Confirm no boot error.
```

## Known risks

This is still procedural Canvas art, not the final true top down sprite system. The seating overlay improves current orientation but does not replace the needed true top down directional character sprites. The robot vacuum path is lightweight and may need obstacle aware routing later. Browser boot and mobile pathing still need verification.

Concurrent quality of life foundation append files exist after the backup point. This pass did not intentionally alter those append files, and future sync should consolidate both append trails carefully.

## Follow ups

```txt
Create real true top down directional character sprites for north, south, east, and west.
Add object specific seated sprites instead of overlays.
Extend messes from crumbs to dishes, wrappers, spilled drinks, towels, clothes, and dog mess.
Add dish washing and surface cleaning states.
Add smarter autonomy for cleaning when tidiness is low.
Fold this append into the canonical ongoing log after browser testing.
```
