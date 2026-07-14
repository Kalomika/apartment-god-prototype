# Apartment God Daily Build, 2026-07-14, Timed Action Total Repair

Status: IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: mechanics-first-timebar-repair-2026-07-14
Runtime files changed: src/runtimeRegressionGuards.js
Tests added: tests/runtime-timebar-repair.test.js
Render playable branch updated: no
Render settings changed: no
Deployment triggered: no

## Repo state reviewed

Reviewed the current main head and recent renderer commits before editing. Checked the ongoing design log requirements, current action runtime, runtime regression guards, package scripts, cooking and meal staging, bathroom action completion, together invitation flow, offsite party flow, and current timed action bookkeeping.

## Anomaly fixed

Timed actions could have a positive `actionT` while `actionTotal` was missing, invalid, zero, or lower than the remaining duration. HUD and actor progress displays need a stable total to show visible time passage. The runtime guard now restores a usable total from the remaining time only when the existing total is invalid. A valid original total is preserved while the action counts down.

## Test coverage

Added regression tests for:

1. Missing total restoration.
2. Preservation of a valid original total.
3. Repair of a stale total lower than remaining time.

## Testing status

GitHub source updates succeeded. Local dependency installation, Vitest, build, and browser testing could not run because the execution container could not resolve `github.com` for cloning. CI status should be checked on the final branch commit.

## Known limits

This guard repairs timed actions that already have `actionT`. It does not create timers for mechanics that start without a duration. Browser testing is still needed to verify every visible time bar reads `actionTotal` consistently.

## Next target

Repair together activity partner selection and hearing realism on the latest main line. Current logic still selects the first same floor person and does not account for room boundaries, distance, bathroom privacy, or phone based offsite invitations.
