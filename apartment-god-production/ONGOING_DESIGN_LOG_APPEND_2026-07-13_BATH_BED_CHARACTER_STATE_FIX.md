# Ongoing Design Log Append: Bath Bed Character State Fix

## 2026-07-13, Bath Bed Character State Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Commit: phaser-migration head after this append file
Files changed:
- docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
- docs/APARTMENT_GOD_IDEA_LOGGING_RULE.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_BATH_BED_CHARACTER_STATE_FIX_STARTED.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_BATH_BED_CHARACTER_STATE_FIX.md
- apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-13_PANIC_ROOM_INTRUDER_SYSTEM.md
- apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-13_MEAL_LIFECYCLE_TRAITS.md
- src/world.js
- src/config.js
- src/autonomy.js
- src/actions.js
- src/bathBedStateOverlays.js
- src/rendering.js
- src/renderDynamic.js
- src/renderEntities.js
- src/afterEntityOverlays.js
- src/mainFloorLayoutPolish.js
- src/canvasRuntime.js
- tests/bath-bed-state-regression.test.js
Runtime files changed: yes
Render playable branch updated: pending main sync after backup
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-bath-bed-state-fix-2026-07-13

Summary:
Implemented a tight bug-fix pass for Kam's current live issues around upstairs bathroom selection, shower state, towel attachment, toilet pose/orientation, bed state, north-facing seating/walk rendering, table food state, hidden-tab simulation behavior, and the empty upstairs room becoming a first-pass panic room. Also added a standing idea logging rule so future directives are recorded before execution.

Implementation details:
- `src/world.js`: kept the stable pre-extension upstairs layout, added panic room metadata and props, changed master toilet and bathroom sink metadata, adjusted bed approach logic so sleep actions route to the side of the bed instead of the mattress center, added panic room approach handling.
- `src/config.js`: split toilet actions into `pee_stand` and seated `toilet`.
- `src/autonomy.js`: changed bladder and freshness object selection to prefer nearest usable objects on the current floor before considering downstairs alternatives.
- `src/actions.js`: tracked actual shower object IDs, fixed shower completion so shower state clears, added standing pee relief versus seated toilet full reset, queued hand washing after bathroom use, made bed state unmade after sleep, and kept towel wrap until changing clothes.
- `src/bathBedStateOverlays.js`: added inactive shower redraw so steam/door motion only appears for an active shower, readable sinks/toilets, unmade-bed overlay, panic room visual props, and standing pee stream overlay.
- `src/rendering.js`: wired bath/bed state overlays before and after entity drawing.
- `src/renderDynamic.js`: attached towel wrap to the actor body instead of drawing it as a floating carried item.
- `src/renderEntities.js`: removed the broken duplicated north-facing seated silhouette and added back-facing seated/north-walk silhouettes for immediate runtime readability.
- `src/afterEntityOverlays.js`: removed the duplicate seated body overlay that was mashing two bodies together, tightened shower privacy overlays to actual active shower state, retained chair-back, sleep-head, dog, vanity, and recap overlays.
- `src/mainFloorLayoutPolish.js`: stopped drawing dining food from generic eat/table actions; table food now draws only from `state.meals.tablePlates`, which are created by the served meal path.
- `src/canvasRuntime.js`: added hidden-tab simulation ticking so minimizing the browser/app does not pause the household unless the player explicitly pauses or the tab/app closes.
- `docs/APARTMENT_GOD_IDEA_LOGGING_RULE.md`: added mandatory idea logging rule.
- `docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md`: restored the full handbook and added the idea logging rule to required reading and behavior standards.
- `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-13_MEAL_LIFECYCLE_TRAITS.md`: logged the full fridge/stove/cupboard/plate/table/eat/dishwash/cupboard loop and tidy/personality consequences as planned.
- `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-13_PANIC_ROOM_INTRUDER_SYSTEM.md`: logged panic room and yearly hostile event/panic protocol as planned/partial.

Testing performed:
- Verified by code inspection through GitHub file fetches and branch compare.
- Added `tests/bath-bed-state-regression.test.js` for upstairs bathroom objects, bed side approach, vanity orientation, toilet action split, and panic room objects.
- Tests were not executed in this connector environment.

Testing requested:
- Open https://apartment-god-phaser.onrender.com after Render rebuild and hard refresh.
- Test upstairs shower: command resident to use the primary shower, wait until complete, confirm steam and sliding door stop when he leaves.
- Confirm he does not then choose the downstairs shower/bathroom if the upstairs bathroom is closer and the need was already satisfied.
- Confirm towel appears attached to his body, not floating.
- Confirm master toilet reads as usable and not wall-facing.
- Confirm resident has standing pee behavior and seated toilet behavior as separate menu options.
- Confirm bed remains unmade after wake until Make Bed occurs.
- Confirm actors route around the bed instead of walking across the mattress.
- Confirm north-facing seated bodies no longer look like two mashed characters.
- Confirm north/up walking uses a back-facing silhouette.
- Confirm dining table food only appears after someone actually prepares/serves a meal.
- Minimize the browser/app without pressing pause, wait, then return and confirm time/life progressed.
- Confirm panic room appears as a locked/secure visual room and does not block upstairs stairs.

Known risks:
- This is still Canvas runtime first-pass art, not final PNG sprites.
- Hidden-tab simulation is limited by browser throttling, but now uses a background interval and catch-up step while the tab remains open.
- The full meal lifecycle with cupboard, favorite seats, dishwashing, tidy traits, and partner annoyance is logged but not fully implemented in this pass.
- The yearly hostile event system and full danger room protocol are logged but not implemented in this pass.
- Browser confirmation is required before calling this complete.

Follow ups:
- Implement full meal lifecycle and tidy/personality consequences.
- Implement proper PNG north/south/east/west walk and seated sprite sheets.
- Implement desktop drag pan and/or right-click compass navigation as a dedicated controls pass.
- Implement panic room protocol and yearly hostile event system as a separate audited gameplay pass.
- Continue replacing Canvas placeholder art with the anime top-down PNG standard.
