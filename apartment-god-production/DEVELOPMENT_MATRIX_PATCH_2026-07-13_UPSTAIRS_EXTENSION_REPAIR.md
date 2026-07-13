# Development Matrix Patch: Upstairs Extension Repair

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Runtime files changed: yes
Render settings changed: no
Backup manifest:
- apartment-god-production/BACKUP_MANIFEST_2026-07-13_UPSTAIRS_EXTENSION_REPAIR.md

## Matrix rows to merge during next safe documentation sync

Update Upstairs extension layout row:

| Upstairs extension layout | NEEDS_BROWSER_CONFIRMATION | `src/blueprint.js`, `src/upstairsExtensionLayout.js`, `tests/upstairs-extension-layout.test.js` | Emergency repair added a direct hall-to-suite-foyer connector and a visible upper foyer connector so the primary/master side is reachable from the new upstairs section. Previous pass failed intent-match audit and should not be treated as final. | Browser test upstairs stairs to office, primary bedroom, suite foyer, closet, and master bath. Confirm it no longer reads as a dead-end maze. |

Add Multi-screen upstairs/master expansion row:

| Multi-screen upstairs master-over-garage expansion | PLANNED | `APARTMENT_GOD_IDEA_BIBLE_APPEND_2026-07-13_UPSTAIRS_EXTENSION_REPAIR.md` | True final direction remains a larger or multi-screen upstairs where the master section sits above the garage and can slide/pull into shot or otherwise be navigated cleanly. | Design camera/navigation model before implementing. Do not mark complete until master side is reachable and architecturally clear in-browser. |

Update Audit process row:

| Intent-match visual/playability audit | ACTIVE_REQUIRED | Idea Bible append, ongoing log repair entry | The previous audit missed the layout failure because it checked imports/object IDs rather than the live design intent. Future layout audits must compare browser view and route usability to Kam's exact directive. | Add acceptance checklist to future layout PRs/commits before main sync. |

Add test scenario:

| Scenario | Priority | Status | Exact test |
|---|---|---|---|
| Upstairs master access repair | Critical | NEEDS_BROWSER_CONFIRMATION | Start upstairs. From stairs/new section, tap office, primary bedroom, suite foyer, walk-in closet, and master bath. Actor must route there and the connector should be visually obvious. |
