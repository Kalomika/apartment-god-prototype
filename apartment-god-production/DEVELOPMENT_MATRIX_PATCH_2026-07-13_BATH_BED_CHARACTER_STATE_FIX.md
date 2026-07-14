# Development Matrix Patch: Bath Bed Character State Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-bath-bed-state-fix-2026-07-13

## Matrix rows to merge during next safe documentation sync

| System | Status | Files | Current state | Required test |
|---|---|---|---|---|
| Upstairs bathroom object selection | NEEDS_BROWSER_CONFIRMATION | `src/autonomy.js`, `src/actions.js`, `src/world.js`, `tests/bath-bed-state-regression.test.js` | Autonomy now ranks nearest toilet/shower/sink objects with current-floor priority so upstairs actors should prefer primary bathroom fixtures instead of routing downstairs. | Wake upstairs, trigger bladder/freshness, confirm primary bathroom is selected before downstairs fixtures unless blocked. |
| Shower active state | NEEDS_BROWSER_CONFIRMATION | `src/actions.js`, `src/bathBedStateOverlays.js`, `src/afterEntityOverlays.js`, `src/rendering.js` | Shower steam and sliding door overlays now require an active shower action at that specific shower. Shower object ID is tracked and cleared at completion. | Use primary shower. Confirm steam/door stop after actor leaves. Confirm inactive showers do not animate from `Going to Shower`. |
| Towel wrap | NEEDS_BROWSER_CONFIRMATION | `src/renderDynamic.js`, `src/actions.js` | Towel after shower/swim now renders as a body wrap instead of a floating carried item and persists until changing clothes. | Complete shower. Confirm towel is attached to waist/body. Change clothes and confirm it disappears. |
| Toilet action split | NEEDS_BROWSER_CONFIRMATION | `src/config.js`, `src/actions.js`, `src/renderEntities.js`, `src/bathBedStateOverlays.js`, `src/world.js` | Toilet menu now has `pee_stand` and seated `toilet`. Standing pee partially relieves bladder and draws a stream. Seated toilet fully resets bladder and queues hand washing. | Trigger both actions on resident. Confirm separate poses and need changes. |
| Bed wake/bed state | NEEDS_BROWSER_CONFIRMATION | `src/world.js`, `src/actions.js`, `src/bathBedStateOverlays.js`, `tests/bath-bed-state-regression.test.js` | Bed approach point is now side-of-bed. Sleep marks bed unmade. Make Bed marks bed made. | Sleep/wake. Confirm actor approaches side, bed remains unmade until Make Bed. Watch for walking across mattress. |
| North-facing seated and walk renderer | NEEDS_BROWSER_CONFIRMATION | `src/renderEntities.js`, `src/afterEntityOverlays.js` | Removed duplicate seated body overlay and added back-facing seated and north-walk silhouettes for immediate runtime fix. | Test desk, couch, table, and other north-facing seats for both resident and girlfriend. Confirm no two-body mash. Walk north/up and confirm back-facing silhouette. |
| Dining food state | NEEDS_BROWSER_CONFIRMATION | `src/mainFloorLayoutPolish.js`, `src/actions.js`, `src/mealCleanupSystem.js` | Dining table food now draws only from `state.meals.tablePlates`, not from generic eat/table action text. Full fridge/stove/cupboard/plate/dishwashing/tidy lifecycle is logged as planned. | Confirm table starts clean. Cook and serve meal. Confirm food appears only when plated and disappears after eating. |
| Background/minimized simulation | NEEDS_BROWSER_CONFIRMATION | `src/canvasRuntime.js` | Added hidden-tab background simulation tick and catch-up so minimizing does not pause life while the app/tab remains open. | Minimize without pausing, wait, return, confirm time/needs/actions progressed. Close tab/app and confirm it stops because runtime is gone. |
| Panic room first pass | NEEDS_BROWSER_CONFIRMATION | `src/world.js`, `src/bathBedStateOverlays.js`, Idea Bible append | Empty upstairs room near stairs is now a panic room with steel door, alarm panel, secured locker, and supplies as visual/interaction props. Full yearly hostile event protocol remains planned. | Go upstairs. Confirm panic room appears, does not block stairs, and props are visible/selectable. |
| Idea logging rule | ACTIVE | `docs/APARTMENT_GOD_IDEA_LOGGING_RULE.md`, `docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md` | Added mandatory rule that user directives and bug batches are logged before meaningful execution. | Future chats must read this and log ideas before implementation. |

## Planned rows created by this pass

| System | Status | Notes |
|---|---|---|
| Full meal lifecycle and tidy trait consequences | PLANNED | Fridge ingredients, stove cooking, cupboard plates, seat-specific plate placement, favorite seats, eating, dirty plate, sink/dishwasher, cupboard return, tidy/self-sufficient personality, partner annoyance, and delayed task cleanup are logged but not complete. |
| Yearly hostile event and danger room protocol | PLANNED | In-game year/day hostile events, family auto-wake, house alarm flash, panic room routing, and abstract defense choices are logged but not implemented. |
| Desktop drag/right-click navigation | PLANNED | Mouse drag pan and/or right-click compass navigation remain a dedicated controls pass. |
