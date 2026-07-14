# Ongoing Design Log Append, Dining And Kitchen Layout Fix

## 2026-07-14 02:15 PM CT, Dining And Kitchen Layout Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: runtime 7e6ef7f36d89beb3ade70ffb2c4b1f33c04044ae, cache chain a6b54db39e52d63c543b51bd5f709a67d65a0573 / 5b9296c7b504f46be604182012c30978088416b5 / 77529be64d153629c3b846ba310d2bcbbaa42656 / 20bfffa0b43b6e866424e5dadac691dfc8ae69b0
Files changed:
- src/mainFloorLayoutPolish.js
- src/main.js
- src/canvasRuntime.js
- src/rendering.js
- index.html
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-dining-kitchen-layout-fix-2026-07-14

Summary:
Kam reported that the dining table and chairs looked like a stacked sprite or duplicate object layer, the Resident appeared seated on an invisible chair, the sink overlapped the coffee maker, and the kitchen should read as a continuous L countertop run from the oven around the corner toward the doorway. This pass fixes the active phaser-migration main floor polish layer instead of adding another broad overlay.

Implementation details:
- Moved the main floor dining table runtime layout to a smaller footprint that better matches the visible table.
- Rebuilt the visible dining set as separate procedural pieces: table piece plus six independent chair pieces around it, with the south chair row aligned to the current dining table approach point.
- Cleared the old dining footprint before drawing the new dining set so stale table and chair visuals do not remain underneath.
- Patched the kitchen sink, coffee maker, and trash locations in the active main floor layout polish pass so the sink no longer sits on top of the coffee maker.
- Added a continuous L shaped kitchen counter redraw that clears the old appliance layer and redraws fridge, stove, sink, coffee maker, and trash as one coherent counter run.
- Preserved object IDs and action names so existing click menus and gameplay routes keep working.
- Cache-busted the browser module chain from index to main to canvas runtime to rendering to mainFloorLayoutPolish so the layout fix is not hidden by stale modules.

Testing performed:
- Verified by GitHub source inspection only.
- No browser test and no Render test performed in this chat.

Testing requested:
Open https://apartment-god-phaser.onrender.com after the branch is deployed or mirrored for testing. Hard refresh. On the main floor, check that the sink and coffee maker no longer overlap, the kitchen reads as one L shaped counter from fridge/stove/sink around the right side, the dining table has visible separate chairs, the Resident eating lines up with a real chair, and the old table/chair shape is not visible underneath.

Known risks:
- This is still procedural Canvas fallback art, not final PNG sprite furniture.
- Since main is the current Render playable branch, this phaser-migration fix will not appear on the public Render link until the branch is used by Render or Kam explicitly asks to update main.
- Browser testing is required to confirm actor-seat alignment visually.

Follow ups:
- If the Resident is still offset while eating, adjust the dining table approach point or action anchor next, not the visual table only.
- If Kam wants this immediately visible on Render, create or confirm a fresh main backup and then mirror the fix to main without changing Render settings.
