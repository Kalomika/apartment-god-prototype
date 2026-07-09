## 2026-07-09 12:20 AM CT, Living Kitchen Open Plan Correction

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: world 6d41099737176bd196bb4ed730e293355a15b6b2, blueprint 369fe101fd3411cf6519a0ea96f9fc2215999467, log append pending this commit
Files changed: src/world.js, src/blueprint.js, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-09_LIVING_KITCHEN_OPEN_PLAN.md
Runtime files changed: yes
Render playable branch updated: pending main mirror
Backup branch: backup/phaser-migration-before-living-kitchen-open-plan-fix-2026-07-09

Summary:
Applied Kam's correction to reopen the living room and kitchen connection, move the dining table into the former divider zone, and move the dog bowl out of the kitchen into the lower right foyer area.

Implementation details:
- Added a wide living to kitchen doorway in `src/blueprint.js` so navigation treats the kitchen and living room as an open plan connection again.
- Moved `dining_table` from the kitchen lower left to a smaller table placement crossing the living/kitchen divider zone.
- Moved `dog_bowl` from the kitchen to the lower right foyer area so it no longer competes with the dining table and kitchen pathing.
- Preserved the new Secret Lab East floor and lab objects added by another agent.
- Did not touch actor AI, Phaser renderer, Render settings, or deployment settings.

Testing performed:
GitHub code inspection and compare only. No browser or Render runtime test performed in this chat.

Testing requested:
After main is updated, test https://apartment-god-phaser.onrender.com. Check Main House. Confirm living and kitchen are visibly and pathing wise open again, dining table is shifted into the divider zone, dog bowl appears in the lower right foyer, the dog can reach the bowl, and characters can still route from living to kitchen, entry, bathroom, stairs, and backyard.

Known risks:
The dining table now straddles a room boundary and may need one more visual nudge based on mobile scale. The dog bowl is near the lower right foyer edge, so approach point may need a small adjustment if the dog stands too close to the boundary.

Follow ups:
Do a proper activity animation pass and desk sitting pass after this layout correction is verified.
