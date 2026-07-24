# Ongoing Design Log Append, P2 Character Stuck Mishap Audit

Date: 2026-07-24
Status: IMPLEMENTATION IN PROGRESS
Branch: repair/phaser-migration-2-character-unfreeze-2026-07-24
Source repair head reviewed: ec4418aefbcd4f68ece7e046c2286e4c9ebdbede

## User Report

Characters remain stuck in the deployed Claude Phaser Migration 2 preview after the first emergency character recovery pass.

## Verified Mishaps

1. The first emergency repair normalized actor state through scene event listeners but left the authoritative `runSimulationStep` freeze predicate unchanged.
2. `runSimulationStep` treated any `poolRoute.points` array as active choreography, even when the route was stale and the pool timer was finished.
3. `stopEntity` did not clear `poolRoute`, `currentActionId`, `activityObjectId`, `actionTotal`, cue carrying state, or actor velocity.
4. Resume cleared only the two stop flags. A resident stopped during pool could resume with a nonempty stale pool route and remain excluded from normal movement forever.
5. New move, object, and social commands did not consistently cancel the previous timed or pool activity. A stale `pool_solo` or `pool_together` action could continue hijacking the resident after a new command.
6. The first AppDeploy QA tests verified only the launcher shell. They did not prove that actors accepted commands or changed coordinates inside the game iframe.

## Repair Direction

- Move actor normalization into the authoritative runtime path.
- Require a currently timed pool action before excluding an actor from generic movement.
- Fully cancel pool and timed activity state on Stop, Resume, direct movement, object movement, and social movement.
- Preserve active pool choreography while the timer and pool action are genuinely active.
- Add exact regression tests for Stop during pool, Resume after pool, stale nonempty pool routes, and command interruption.
- Add visible runtime diagnostics suitable for browser confirmation.

Main, Render, and the original `phaser-migration-2` branch remain unchanged.
