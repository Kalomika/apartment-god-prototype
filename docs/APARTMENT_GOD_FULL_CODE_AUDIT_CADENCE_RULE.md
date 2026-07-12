# Apartment God Full Code Audit Cadence Rule

Status: IMPLEMENTED
Branch: phaser-migration
Runtime files changed: no
Render playable branch updated: no

Purpose: Apartment God must not drift into a pile of disconnected systems. Regular full code audits are required so future agents catch real bugs, rule contradictions, stale implementation, broken routing, duplicate loops, missing UI paths, and gameplay regressions while the game grows.

---

## Required Audit Cadence

After every 5 meaningful runtime or gameplay code changes, perform a full code audit before continuing broad new feature work.

Meaningful runtime or gameplay code changes include changes to:

```txt
src/world.js
src/state.js
src/autonomy.js
src/movement.js
src/actions.js
src/ui.js
src/phoneUI.js
src/appMenu.js
src/vehicleSystem.js
src/travelLocations.js
src/activitySystems.js
src/soccerSystem.js
src/saveSystem.js
src/rendering.js
src/renderWorld.js
src/renderObjects.js
src/renderDynamic.js
styles.css
any runtime file that affects boot, playability, mobile controls, actor behavior, movement, visuals, saves, or travel
```

Documentation only changes do not count toward the 5 change audit trigger unless they alter rules that affect runtime work.

Small typo fixes do not count unless they affect code behavior.

If a major risky system is touched, audit sooner. Do not wait for the fifth change when the game could already be broken.

---

## What Counts As An Anomaly

An anomaly is a confirmed or strongly supported problem in the actual source, not something the agent merely does not understand.

Anomaly examples:

```txt
1. A runtime crash or likely boot breaker.
2. A duplicate update loop that makes a system run twice.
3. A broken import, missing export, or dead function path.
4. A UI path that cannot reach an implemented feature.
5. An implemented feature that is not wired into phone, menu, or object actions where required.
6. A stale save or reset path that can restore old object layouts or corrupt state.
7. Actor autonomy fighting guided commands.
8. Movement fallback teleporting when visible routing should happen.
9. Vehicle logic contradicting garage layout, direction, or parked vehicle rules.
10. Offsite travel hiding actors or blocking home playability incorrectly.
11. Dog, human, or activity permissions contradicting the object kinds in world.js.
12. Visual code violating true top down rules, no broad implementation rules, or approved matrix rules.
13. A system marked implemented when it is only partial, untested, or not reachable.
14. A branch, Render, backup, or logging rule violation.
```

Not an anomaly:

```txt
1. A system the agent has not read yet.
2. A function that looks unfamiliar but is consistent after reading the handbook, matrix, log, and source.
3. A deliberate rule documented in the handbook, matrix, or ongoing log.
4. A planned future feature that is honestly marked PLANNED or PARTIAL.
```

If the agent does not understand code, the next step is to read the relevant source and required docs, not label it anomalous.

---

## Required Audit Scope

A full audit should inspect the whole active runtime code path, especially:

```txt
1. Boot and frame loop.
2. State creation and save/load normalization.
3. Movement and pathfinding.
4. Autonomy and guided commands.
5. Action resolution and queued command behavior.
6. Phone UI, app menu, interaction menu, and mobile scroll behavior.
7. World objects, approach points, room boxes, and object actions.
8. Vehicles, garage logic, travel, offsite state, departure, return, and selected actor handoff.
9. Pool, soccer, dog play, and activity systems.
10. Rendering order, object overlays, entity renderer, dynamic props, and top down visual compliance.
11. CSS that affects mobile playability.
12. Test scripts, build scripts, and dependency assumptions.
13. Handbook, backup policy, ongoing log, no broad implementation rule, and development matrix alignment.
```

---

## Required Audit Behavior

During an audit:

```txt
1. Verify repo is Kalomika/apartment-god-prototype.
2. Verify active branch is phaser-migration unless Kam explicitly names another branch.
3. Read required docs before judging the code.
4. Inspect the actual current source, not memory from a prior run.
5. Compare systems against the handbook and matrix rules.
6. Separate confirmed bugs from risks and from unknowns.
7. Fix blatant issues when the fix is safe and in scope.
8. Do not broaden the pass into a fake mega feature sprint.
9. Do not edit main.
10. Do not deploy or change Render settings.
11. Log the audit and fixes.
```

If the audit finds a high risk runtime issue and a safe source fix is obvious, fix it before starting new feature work.

If the fix is risky, document the issue clearly, create or confirm backup needs, and report the risk instead of pretending the game is clean.

---

## Audit Report Format

Every full audit report should include:

```txt
Branch audited:
Files inspected:
Commands run:
Runtime tests performed:
Browser or Render tests performed:
Confirmed anomalies:
Risks needing testing:
Fixes committed:
Issues not fixed and why:
Next exact test request:
```

Never say a system is clean unless it was actually inspected and, where required, tested.
