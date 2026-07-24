## 2026-07-23 07:00 PM CT, Staged Workout Gear Delivery

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: 1e8286be2de39f30e8b446327a99c3e2dbc919f2
Files changed: src/economy.js, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-23_1900_CT_WORKOUT_DELIVERY.md, apartment-god-production/DEVELOPMENT_MATRIX_PATCH_2026-07-23_WORKOUT_DELIVERY.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch: none, narrow economy flow correction, no major overhaul

Summary:
Replaced instant workout gear installation with a visible staged delivery flow that uses arrival, doorway exchange, and installation phases before the object becomes available.

Implementation details:
- Added shared delivery timing constants and timed actor action setup.
- Workout gear now requires ordering, delivery arrival, a short front door exchange, and an installation period.
- The workout object is created only after installation completes.
- Actor action timers and carrying states expose the progression to existing time bar and renderer logic.
- Duplicate workout orders and overlapping deliveries are blocked.
- Missing actors and unknown delivery states cancel safely and close the door.
- Existing food delivery behavior was retained while using the same safer staged state structure.

Testing performed:
Verified by GitHub diff and code inspection only. No browser, local build, or Render test was available in this connector run.

Testing requested:
On phaser-migration, buy workout gear and confirm money is charged once, the actor waits, the delivery person appears at the door, the door opens during exchange, boxes are carried, installation takes visible time, the door closes, and the workout object appears only after completion. Also confirm a second delivery cannot be ordered while one is active.

Known risks:
The delivery renderer must already support the workoutGear delivery type and generic delivery bubble fields. Existing save normalization may not preserve an in-progress workout delivery across reloads.

Follow ups:
Test delivery rendering and time bars in a browser. Next mechanics target should be persistence of long delivery or construction jobs across save and reload, or fridge and cooking action timing if delivery rendering is already stable.

Note:
This append file must be merged into apartment-god-production/ONGOING_DESIGN_LOG.md during the next safe canonical documentation sync.
