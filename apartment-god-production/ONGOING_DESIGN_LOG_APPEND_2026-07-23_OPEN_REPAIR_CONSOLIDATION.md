# Ongoing Design Log Append: Current Phaser Repair Consolidation

## 2026-07-23 10:50 PM CT, Consolidate Verified Open Repairs Onto Current Head

Status: NEEDS_TESTING
Branch: repair/consolidate-open-phaser-repairs-2026-07-23
Source branch: phaser-migration
Source head: 10e2bbc5bdb170e37f2039c1a0d45b48641921b0
Main head: ad80f363422778e1e700045a75273854bc32a30b
Pre-documentation integration head: 70fd85c53e71a866b84b8907c555670841cf9726
Runtime files changed: yes
Render playable branch updated: no
Render settings changed: no
Backup branch: backup/phaser-migration-before-open-repair-consolidation-2026-07-23
Studio task: STUDIO-009
Studio claim: CLAIM-STUDIO-009-2026-07-23

## Audit result

The recorded branch heads from the previous successful run had not moved. Both comparisons were identical, with no force move or divergent replacement.

The required current-state audit found a meaningful unresolved risk even though no new branch commits existed: two previously verified repair sets remained only in draft pull requests and were not present on the active `phaser-migration` branch.

The current runtime still contained the defects repaired by draft PR 35, including unmanaged Phaser scene listeners and hidden timers, stale first-scene camera swipe closures, lost timed-activity object identity, stale activity metadata, incomplete progress compatibility, screen-coordinate arcade cabinet hit testing, conflicting kitchen sink visual and collision authority, and destructive older-save replacement behavior.

The current workout delivery feature also still contained the defects repaired by draft PR 38, including invalid receiver floor or visibility handling, missing installation travel, installation before route completion, and incomplete cancellation cleanup.

## Integration performed

- Created the exact current-head backup branch before runtime integration.
- Created the isolated consolidation branch from `phaser-migration` at `10e2bbc5bdb170e37f2039c1a0d45b48641921b0`.
- Merged the verified PR 35 repair history into the consolidation branch through temporary integration PR 39, producing merge commit `eed7c0a9f45759dc1504d5d42d4c9b29d1600521`.
- Merged the verified PR 38 workout delivery repair history through temporary integration PR 40, producing merge commit `70fd85c53e71a866b84b8907c555670841cf9726`.
- Preserved the later governance commits and the intended workout delivery feature.
- Did not modify `main`, Render settings, or deployment configuration.

## Runtime repairs now present on the consolidation branch

- Managed Phaser scene shutdown and destroy cleanup for global listeners, hidden simulation interval, pointer handler, and swipe listeners.
- Camera swipe navigation can rebind safely to the current scene state.
- Timed activities preserve their active object through arrival and clear stale inactive metadata.
- Activity progress advances when older saves lack a valid `actionTotal` and resets when actions change.
- Arcade cabinet hit testing uses world coordinates.
- Preferred diagonal kitchen sink visual and collision coordinates are synchronized.
- Version 2 and later saves merge into current nested defaults, entities, and world objects instead of deleting newer systems.
- Workout delivery requires a visible receiver on the correct floor and a valid route before charging.
- The receiver visibly carries boxes to installation, and installation begins only after route completion.
- Delivery cancellation clears carried items, action timers, and the opened door.

## Tests included

- `tests/phaser-full-audit-regressions.test.js`
- `tests/economyDelivery.test.js`

The exact combined branch head still requires current GitHub Actions verification. Browser-only behavior remains NEEDS_TESTING.

## Required browser tests

1. Restart the Phaser scene and confirm swipes, background simulation, and autosave do not duplicate.
2. Background and return after at least ten seconds and confirm elapsed time is not doubled.
3. Run timed activities and confirm progress advances, resets, and actors face used objects without breaking sleep or swim poses.
4. Confirm one diagonal kitchen sink appears and collision matches its visible footprint.
5. Load a real version 2 save missing newer systems and confirm saved values plus current defaults survive.
6. Order workout equipment with a visible main-floor resident and confirm one charge, door exchange, box carrying, route completion, installation, and object appearance.
7. Attempt workout delivery from another floor or with a hidden or offsite receiver and confirm no charge or unsafe delivery state.
8. Interrupt or block delivery routing and confirm safe cancellation and cleanup.
9. Test vehicle departure, all-away state, return, actor visibility, parked vehicle restoration, garage closure, and selection recovery.
10. Rotate Android portrait to landscape and back and confirm scene and pointer alignment.

## Remaining limitations

Current character assets remain a four-cardinal-direction fallback and do not satisfy the required eight-direction modular outfit and activity-animation production standard.
