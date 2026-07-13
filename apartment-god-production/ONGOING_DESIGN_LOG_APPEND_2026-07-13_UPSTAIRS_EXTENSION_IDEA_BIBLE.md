# Ongoing Design Log Append: Upstairs Extension And Idea Bible Pass

## 2026-07-13 09:05 AM CT, Upstairs Extension And Idea Bible Pipeline Fix

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Commit: phaser-migration head after this append file
Files changed:
- src/world.js
- src/blueprint.js
- src/upstairsExtensionLayout.js
- src/rendering.js
- tests/upstairs-extension-layout.test.js
- apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md
- apartment-god-production/IDEA_BIBLE_COVERAGE_AUDIT_2026-07-13.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_UPSTAIRS_EXTENSION_IDEA_BIBLE.md
Runtime files changed: yes
Render playable branch updated: pending main backup and sync
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-upstairs-extension-2026-07-13

Summary:
Implemented the first runtime pass of Kam's upstairs extension directive and fixed the documentation pipeline gap that caused the idea not to be searchable from repo logs/Bible. The upstairs stairs now live in the new upstairs section, two bedrooms and a shared bathroom were added, and the primary/master side was shifted to the right-side upstairs zone. A project Idea Bible was created so planned and implemented ideas stay searchable for future chats and rebuilds.

Implementation details:
- Updated `src/world.js` floor 1 into an extended upstairs layout.
- Added a new upstairs landing/stair section where people come up from the main floor.
- Added two new bedrooms: one full-bed room and one queen-bed room.
- Added a closet, nightstand, and wall TV for each new bedroom.
- Added a shared upstairs bathroom with shower, sink/vanity, and toilet.
- Shifted the primary bedroom, office/library, suite foyer, walk-in closet, and primary bath to the right-side upstairs zone.
- Kept the primary suite vanity as east-facing with west-side handles.
- Updated `src/blueprint.js` with a new upstairs doorway graph and windows.
- Added `src/upstairsExtensionLayout.js` as a runtime polish layer for the new upstairs layout, bedroom built-ins, shared bath, relocated stairs, and east-facing vanity readability.
- Wired the new upstairs extension layer through `src/rendering.js` after world/object rendering and before entities.
- Added `tests/upstairs-extension-layout.test.js` to lock the stairs relocation, two new bedrooms, shared bath fixtures, vanity orientation, and upstairs connectivity.
- Created `apartment-god-production/APARTMENT_GOD_IDEA_BIBLE.md` to preserve ideas before and after implementation.
- Created `apartment-god-production/IDEA_BIBLE_COVERAGE_AUDIT_2026-07-13.md` documenting the pipeline issue and initial coverage audit.

Research basis:
- Modern bathroom layout guidance was reviewed before placing the shared upstairs bathroom. The implementation keeps fixture zones readable and preserves approach space rather than placing random square placeholders.

Testing performed:
- Static GitHub file inspection and schema review.
- Added tests, but they were not executed in this connector environment.

Testing requested:
- Open https://apartment-god-phaser.onrender.com after main sync and Render rebuild.
- Go upstairs and confirm stairs now appear in the new upstairs landing section, not in the primary/master side.
- Confirm the two new bedrooms exist with smaller beds, closets, nightstands, and wall TVs at the foot side.
- Confirm the shared upstairs bathroom has shower, sink, and toilet.
- Confirm the primary vanity faces east and reads with west-side handles.
- Confirm upstairs movement still routes between new bedrooms, shared bath, hall, office, primary bedroom, suite foyer, closet, and primary bath.

Known risks:
- This is a first runtime layout pass using Canvas/procedural fallback art. It is not final PNG room plate art.
- Browser testing is needed for exact pathfinding, scale, and collision quality.
- AI routing still needs a dedicated pass so actors choose the nearest upstairs/master bathroom, sink, shower, and closet instead of defaulting downstairs.

Follow ups:
- Add nearest-bathroom/nearest-closet AI routing.
- Create final PNG room plates and object sprites for the upstairs extension.
- Continue backfilling `APARTMENT_GOD_IDEA_BIBLE.md` with older ideas from logs and prior chat summaries.
