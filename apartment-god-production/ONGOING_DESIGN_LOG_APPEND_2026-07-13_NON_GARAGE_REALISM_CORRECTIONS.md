# Ongoing Design Log Append, Non Garage Realism Corrections

## 2026-07-13 02:55 AM CT, Non Garage Realism Correction Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: requested overlay 27320a903688daf67a2323ec2b3e5e5b68a6ab98, renderer wiring ba86f156fe88ae87b748b589cbfcb51267a25712, layout targets 6716ddb142d07110e60fc6361e3e97470635b5c4, actor scale and activity facing aa5abd2ef0f303d864ce2dfa651ebf875800513c
Files changed: src/requestedVisualCorrections.js, src/rendering.js, src/world.js, src/renderEntities.js
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-realism-corrections-2026-07-13

Summary:
Implemented a guarded non garage correction pass responding to Kam's latest mobile screenshots and notes. Garage and vehicle boarding logic were intentionally left untouched because another AI is actively working on the garage.

Implementation details:
- Added a runtime overlay module for non garage visual corrections only. It draws the corrected main floor, upstairs, and basement cues while skipping floor 3 garage.
- Main floor now has a more realistic true top down L shaped sectional couch facing the wall TV, green land visible around the front porch sides, two porch chairs placed away from the front door and pet exit, a readable book cue during reading, a dining table with chairs around it, a wall placed coffee maker, a corrected fridge overlay with one visible open direction, active shower steam, and bathroom sink visual cues.
- Updated world object targets for the dining table, coffee maker, and new bathroom sinks so washing, brushing teeth, and grooming can target actual sinks in both downstairs and upstairs bathrooms.
- Upstairs now has visible walk in closet clothing aisles, bathroom sink cue, shower steam, and bed covers drawn over sleepers when sleep or waking actions are active.
- Basement now has architectural stair depth treatment and arcade activity lighting and hand cues for gaming.
- Slightly reduced drawn actor scale and selected ring size so humans sit closer to the furniture and object scale without changing the garage or vehicle systems.
- Added arcade, console, game, and darts facing support in character rendering so gameplay activities face the screen or object instead of keeping a wrong idle orientation.

Testing performed:
- GitHub access verified through repository metadata and file writes.
- Backup branch created before runtime work.
- Local syntax checks were performed on the edited JavaScript content before writing through the GitHub connector.
- GitHub compare confirmed phaser-migration is ahead of main and main was not updated.
- No browser, Render, or local game runtime test was performed in this chat.

Testing requested:
Open https://apartment-god-phaser.onrender.com only after phaser-migration is mirrored to main by explicit request. On the current branch, test local or branch preview if available. Check Main House couch orientation toward TV, dining table clearance, dining chairs, coffee maker wall placement, bathroom sink menus, shower steam, front porch chair placement and book visibility, Upstairs bed blanket coverage, walk in closet side aisles, stair visual depth, Basement arcade facing and gaming cues, and confirm the garage was not changed by this pass.

Known risks:
- This pass uses Canvas overlay art as an interim flat anime direction, not final PNG sprite replacement.
- Browser scale and mobile readability still need live testing.
- Bathroom sink collision and dining table pathing need real movement testing.
- Overlay corrections can cover old placeholder art visually, but the deeper sprite pipeline still needs future production assets.

Follow ups:
- Browser test the non garage floors.
- Only after approval, convert these overlay directions into asset backed flat anime production sprites or sprite sheets.
- Keep garage work reserved for the other active AI unless Kam explicitly assigns it here.

Canonical merge note:
This append file must be merged into apartment-god-production/ONGOING_DESIGN_LOG.md during the next safe documentation sync. It was created as a sidecar to avoid overwriting concurrent log edits from other active AI work.
