# Daily Build, 2026-07-12, Offsite Duration Correction

Status: NEEDS_TESTING

Branch: `mechanics-first-offsite-duration-2026-07-12`

Runtime files changed: `src/travelLocations.js`

## Repo audit

Reviewed current `main`, recent commits, the ongoing design log, development matrix, current action and state logic, reaction relationships, travel runtime, and existing mechanics branches before changing code.

## Anomaly fixed

Offsite activity duration was being multiplied by the selected vehicle. A bicycle reduced a booked activity to 72 percent of its intended duration, while a motorbike reduced it to 58 percent. This meant biking to work, a movie, a date, or a vacation made the actual shift, movie, date, or vacation finish much faster.

Vehicle choice already has a separate departure and return flow. It should affect travel presentation, cost, and physical consequences, not compress the booked activity itself.

## Implementation

`createOffsiteJob` now uses the destination's booked duration directly for `t`, `baseDuration`, and `bookedDuration`. The obsolete vehicle duration multiplier was removed.

Examples after the correction:

- Work remains 60 activity units regardless of car, bike, or motorbike.
- Movie Theater remains 120 activity units regardless of vehicle.
- Date Night remains 90 activity units regardless of vehicle.
- Vacation activity durations remain tied to the destination rather than the vehicle.

Bike and motorbike still retain their different travel costs and their extra energy and freshness consequences.

## Testing performed

GitHub source inspection and branch comparison only. Local cloning and browser testing were unavailable because the execution environment could not resolve GitHub.

## Testing requested

Start the same offsite destination using a car, bicycle, and motorbike. Confirm the activity progress bar uses the same booked duration after arrival while vehicle departure, return, cost, and need effects remain distinct.

## Known risks

This correction assumes vehicle departure and return timing are handled separately by `vehicleSystem.js`, as current code indicates. Browser testing is still required.

## Next target

Bring realistic local hearing and phone invite consent onto the current development line, then add relationship, mood, trait, preference, routine, and memory weighting without weakening urgent need or busy refusals.
