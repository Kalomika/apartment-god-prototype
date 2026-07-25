# Development Matrix Patch, Fetch Timing And Route Integrity

Target canonical file: apartment-god-production/DEVELOPMENT_MATRIX.md
Branch: fix/fetch-routing-time-2026-07-25
Status: NEEDS_TESTING

## System Matrix Update

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Dog fetch | NEEDS_TESTING | `src/fetchSystem.js`, `src/autoHooks.js`, `tests/fetchSystem.test.js` | Fetch ball flight now uses runtime delta instead of a fixed frame decrement. Pickup and return require physical proximity when routes end. Missing participants and unreachable routes cancel cleanly instead of producing phantom success. | Run unit tests and browser test normal, blocked, distant, interrupted, and varied speed fetch flows. Confirm fun rewards occur only after physical return. |

## Risk Register Update

| Risk | Severity | Current Mitigation | Remaining Verification |
|---|---|---|---|
| Fetch route failure grants phantom pickup or return | High | Fetch checks dog distance before pickup and before successful return, cancels failed routes, clears carrying and transient state, and logs visible failure. | Browser tune reach distances against actual route endpoints and dog sprite scale. |
| Fetch throw speed changes with frame rate | Medium | `updateAutoHooks` passes simulation `dt`; `updateFetch` uses bounded elapsed time for the 0.35 second throw. | Test 1x, accelerated game speed, background recovery, and uneven frame pacing. |

## Test Scenario Update

1. Start a normal fetch interaction and throw to a reachable point. The ball should travel visibly, the dog should walk to it, carry it back, and only then grant fun.
2. Throw to a blocked or unreachable point. The dog must not instantly pick up the ball or report success. The flow should cancel with visible feedback.
3. Interrupt or remove either participant during fetch. Orphaned fetch state should clear without a crash.
4. Compare the ball flight at different frame rates and game speeds. Duration should be based on simulation delta, not update count.
5. Confirm the dog remains physically near the caller before the return is accepted.

Canonical merge is pending because this connector run could not safely append to the large shared matrix without risking overwriting concurrent agent changes.
