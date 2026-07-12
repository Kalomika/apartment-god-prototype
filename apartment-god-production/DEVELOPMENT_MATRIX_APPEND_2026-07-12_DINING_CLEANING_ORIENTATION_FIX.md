# Development Matrix Append, 2026-07-12, Dining Cleaning Orientation Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-dining-cleaning-orientation-2026-07-12

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Object Interaction Matrix | Dining table | NEEDS_TESTING | NEEDS_TESTING, corrected first pass | Dining table now receives plate state from meal flow. Food should appear on the table instead of in the lap. |
| Animation Matrix | Sit | PLANNED | PARTIAL, NEEDS_TESTING | Added seated target facing overlay for table, TV, desk, reading, and game states. This is not final sprite art. |
| Animation Matrix | Eat | PARTIAL | PARTIAL, NEEDS_TESTING | Added fridge to stove to table meal flow and table plate rendering. |
| Object Interaction Matrix | Fridge | NEEDS_TESTING | NEEDS_TESTING, expanded | Cook Meal now starts with ingredient gathering at the fridge. |
| Object Interaction Matrix | Stove | NEEDS_TESTING | NEEDS_TESTING, expanded | Cook Meal now includes a stove cooking stage before eating. |
| Object Interaction Matrix | Service Cleaning Closet | PLANNED | NEEDS_TESTING | Added non blocking cleaning closet on the main floor service hall. |
| Object Interaction Matrix | Vacuum Cleaner | PLANNED | NEEDS_TESTING | Added manual vacuum object and Vacuum Crumbs action. |
| Object Interaction Matrix | Robot Vacuum | PLANNED | NEEDS_TESTING | Added robot vacuum state, render, and crumb hunting behavior. |
| Messiness Matrix | Crumbs | PLANNED | PARTIAL, NEEDS_TESTING | Snacks and dining meals can spawn floor crumbs for cleanup. |
| Risk Matrix | Runtime action chains | High | High, needs browser testing | Meal flow now queues staged object actions, so browser validation is required. |

## Required browser checks

```txt
Cook Meal from fridge routes to fridge, then stove, then dining table.
Food is visible on the table while eating.
No dining table food appears as a lap plate.
Actor faces the dining table while eating.
TV, desk, read, game, and dining seated states face the intended object.
Crumbs appear after snacks and table meals.
Vacuum Cleaner action removes nearby crumbs.
Robot Vacuum starts and removes crumbs.
Cleaning closet, vacuum, and robot vacuum do not block paths.
No boot error.
```

## Do not claim complete yet

```txt
true top down final character sprites
full north, south, east, west sprite sheets
final object specific seated animation loops
full dish system
full towel, clothes, wrapper, spill, and dog mess lifecycle
obstacle aware robot vacuum routing
browser verified mobile pathing
```

## Follow ups

Fold this append into `apartment-god-production/DEVELOPMENT_MATRIX.md` after browser validation. If browser testing fails, revert `phaser-migration` to `backup/phaser-migration-before-dining-cleaning-orientation-2026-07-12` or cherry pick out the failing commits after identifying the exact break.
