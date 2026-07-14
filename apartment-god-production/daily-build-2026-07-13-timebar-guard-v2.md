# Daily Build, Timed Action Progress Guard

Date: 2026-07-13
Branch: mechanics-first-timebar-guard-2026-07-13-v2
Status: IMPLEMENTED, NEEDS TEST RUN
Render settings changed: no
Deployment triggered: no

## Repo audit

The current main line already contains the latest upstairs extension repair and its documentation. Runtime inspection found that `src/runtimeRegressionGuards.js` still lacked the timed action progress repair described in an earlier mechanics branch. This meant an action could have positive `actionT` while `actionTotal` was missing, zero, invalid, or lower than the remaining time.

## Mechanics change

Added `guardTimedActionProgress` to the existing runtime regression guard pass. For every visible person with a timed action:

- A missing or invalid `actionTotal` is restored from the remaining `actionT`.
- A stale total lower than the remaining timer is repaired.
- A valid original total is preserved while the timer counts down.

This keeps visible HUD and actor time bars usable for studying, watching, sleeping, cooking, bathroom actions, training, and other timed actions that already use `actionT`.

## Test coverage

Added `tests/runtime-timebar-guard.test.js` with cases for:

- Missing total restoration
- Valid total preservation
- Stale total repair

## Validation still required

Run the repository test suite and build when a checkout environment is available. Browser test at least one timed action from each major group and confirm its progress bar starts full, decreases smoothly, and does not reset every frame.

## Next target

Repair local together invitation selection and hearing on the latest main line without overwriting the newer cooking, movement, books, vehicle, upstairs, and visual state work.
