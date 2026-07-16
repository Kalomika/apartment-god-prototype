## 2026-07-16, Layering, Vehicle Motion, Arcade, Offsite, and Basketball Correction Batch

Status: PLANNED AND IN EXECUTION
Branch: phaser-migration
Commit: pending implementation commits
Files changed: this append file initially, runtime files pending
Runtime files changed: planned
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-layering-vehicles-minigames-basketball-2026-07-16

Summary:
Kam reviewed the current mobile Render build and identified overlapping main floor render passes, duplicate time display, pool table jitter, weak dog anatomy, garage and driveway misalignment, closed gate pass through, missing character grounding shadows, panic room door orientation problems, sink overlap, incomplete arcade interaction, physically incorrect vehicle departure, offsite blank screen lock, porch path misalignment, and the need for a larger continuous one on one basketball system.

Implementation details:
The implementation pass will audit the current phaser-migration source before changing it, then make bounded corrections that preserve boot and playability. Renderer ordering will be corrected at the source rather than stacked with additional broad floor clearing. Pool activity will use explicit shot stations. Arcade activity will use object aware hands and distinct mini game simulations. Vehicle motion will use staged reverse and turning paths with orientation interpolation. Offsite travel will be treated as an actor status rather than a global scene replacement. Basketball will be built as a dedicated state machine rather than a generic sports overlay.

Testing performed:
Pre implementation code and branch audit only.

Testing requested:
After implementation, test main floor layer order, duplicate time, pool activity, dog silhouette, garage and gate alignment, shadows, upstairs panic room, kitchen sink, all arcade games, all vehicle departures and returns, continued house play during errands, porch transition, and the complete one on one basketball loop.

Known risks:
This batch touches renderer order, movement, vehicle travel, offsite behavior, world geometry, sports state, and activity animation. Browser verification is required. Main remains untouched.

Follow ups:
Merge this append into the canonical ongoing log during the next safe documentation sync.
