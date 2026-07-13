# Ongoing Design Log Append: Visual State Logic Cleanup

## 2026-07-13 06:40 AM CT, Visual State Logic Cleanup

Status: NEEDS_BROWSER_CONFIRMATION
Branch: phaser-migration and main after sync
Commit: phaser-migration head after this append file
Files changed:
- apartment-god-production/BACKUP_MANIFEST_2026-07-13_VISUAL_STATE_LOGIC_CLEANUP.md
- src/mainFloorLayoutPolish.js
- src/afterEntityOverlays.js
- tests/main-floor-layout-polish.test.js
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_VISUAL_STATE_LOGIC_CLEANUP.md
Runtime files changed: yes
Render playable branch updated: pending main sync after this commit
Render settings changed: no
Backup branch: not available in this tool state
Backup manifest: apartment-god-production/BACKUP_MANIFEST_2026-07-13_VISUAL_STATE_LOGIC_CLEANUP.md

Summary:
Addressed Kam's live visual/state complaints as runtime fixes instead of mockups: TV glow state, desk chair layering, couch seating anchor, dining cleanup, porch/pet nook layout, sink readability, sleep head orientation, and dog top-down readability.

Implementation details:
- Created a committed backup manifest because this tool state did not expose real branch creation.
- Updated `src/mainFloorLayoutPolish.js` so the TV light cone is cleared and only redrawn when a person is actually watching TV, sports, movies, or another watch action.
- Moved dog bed, dog bowl, and robot vacuum into a defined pet/robot nook between the porch and stairs instead of the main walkway.
- Redrew the nook with walls so the cream section reads as an intentional utility/pet room instead of a glitchy extension.
- Adjusted the couch object height/anchor so couch interactions land closer to the cushion and not over the back edge of the L couch.
- Expanded the dining clear zone so the four-chair dining set is not stacked over old material.
- Updated `src/afterEntityOverlays.js` to draw an office desk chair back over seated desk actors so the actor reads as sitting in a chair from top-down view.
- Added sleeping head correction overlays so heads read east/west with the bed instead of north/south while the bodies are under covers.
- Added a higher-readability top-down dog overlay with four legs, collar, more adult proportions, and a moving leg cycle so the dog no longer reads as a crude silly cartoon.
- Added readable vanity/sink overlays so upstairs and bathroom sinks read as basins/vanities rather than mini tubs.
- Updated `tests/main-floor-layout-polish.test.js` to cover couch cushion-safe anchor and pet/robot nook placement.

Testing performed:
- GitHub file inspection confirmed updated modules and exported function calls remain present.
- Added or updated tests, but tests were not executed in this connector environment.

Testing requested:
- Open https://apartment-god-phaser.onrender.com after main sync and Render rebuild.
- Confirm TV glow is off unless someone is actually watching TV/sports/movie content.
- Confirm desk worker reads as sitting in a chair with the chair back layered over the lower body.
- Confirm couch sitting lands on the cushion, not over the back of the L couch.
- Confirm dining table no longer looks stacked over old material.
- Confirm dog bed, dog bowl, and robot vacuum are in the pet/robot nook.
- Confirm upstairs sleeping heads align east/west with the bed, not north/south.
- Confirm dog silhouette reads as top-down four-legged dog with collar.
- Confirm vanity sinks look like sinks/vanities, not tubs.

Known risks:
- These are still Canvas runtime overlays, not final PNG assets.
- The dog is improved as a top-down runtime overlay, but final dog animation should still become a real audited PNG sprite sheet.
- Browser confirmation is required for exact placement and mobile readability.

Follow ups:
- Replace this runtime polish with real PNG room plates and audited object sprites once the PNG pipeline is used for the main floor and dog.
- Add dedicated PNG animation frames for dog walk, run, rest, eat, fetch, bath, and pet states.
