# Ongoing Design Log Append, Main Floor Layout Fix

## 2026-07-13 05:20 AM CT, Main Floor Furniture, Porch, Dining Seat, And Stair Alignment Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: layout anchors 30ba0695f9307b1d67d3d459f804ef2c50ea21da, porch and couch correction 8f1a585957c614518beb567977b3f47e38260781, dining overlap guard ec481512b15e76e0ca4238c3e65fdd9e972d6f61, stair center guard 66830216b2ef2c691c3227bc5f9317f4afde5f1d
Files changed: src/world.js, src/visualRegressionFixes.js, src/runtimeRegressionGuards.js
Runtime files changed: yes
Render playable branch updated: pending main fast forward after this sidecar and matrix patch
Backup branch: backup/phaser-before-main-floor-layout-fix-2026-07-13, backup/main-before-main-floor-layout-render-2026-07-13

Summary:
Patched the main floor issues Kam caught from the latest Render screenshot: dining actors stacking on one chair, couch L placement still reading wrong, porch duplicate chair clutter, porch side ground color, garage door vertical alignment, bookshelf placement, and stair routing reading as walking past the stair asset.

Implementation details:
- Moved the main couch lower so its line is closer to the dining table line while still facing the wall TV.
- Moved the bookshelf out of the upper left living room wall and made it a smaller bookcase near the garage door area to free up the living room and remove the false doorway read on the left wall.
- Moved the main floor garage interior door down to align vertically with the garage side house door.
- Changed stair approach points to the center of stair assets so actors route to the stairs instead of walking below or past them.
- Added a runtime dining seat alignment guard so Resident and Girlfriend use separate bottom dining seats instead of occupying the exact same chair or the center of the table.
- Added a stair exit placement guard so actors recently using passages snap to the nearest stair center when the saved or transition state leaves them offset.
- Replaced the porch correction pass so the side areas are green, the porch itself is beige, and only two large porch chairs are redrawn on the porch instead of duplicate chair clutter.
- Added a first pass coffee table visual between the TV and couch.

Testing performed:
- Local syntax checks were run with `node --check` on the replacement world, visual correction, and runtime guard JavaScript content before GitHub writes.
- GitHub writes completed on phaser-migration.
- Browser and Render behavior are not yet verified in this chat.

Testing requested:
Open https://apartment-god-phaser.onrender.com after main is fast forwarded. Test Reset, then check dining table seating with Resident and Girlfriend, main couch position and L side, porch green side areas and only two porch chairs, garage door route, bookshelf placement, coffee table placement, stairs transition, and confirm no blank canvas.

Known risks:
- This pass still uses Canvas correction overlays. Full male and female sprite replacement was not done in this pass.
- The porch and couch fix deliberately overwrites prior placeholder art through the correction layer. Future cleanup should remove the older wrong draw functions rather than stacking corrective layers.
- Dining seats are snapped at runtime while the action is active. Later object occupancy should replace this with proper seat reservation before route start.

Follow ups:
- Build a true seat reservation system for dining, couch, beds, and chairs.
- Replace procedural household sprites with smaller final male and female top down sprites after the main floor mechanics stop regressing.
- Fold this sidecar into the canonical ongoing design log during the next safe documentation sync.
