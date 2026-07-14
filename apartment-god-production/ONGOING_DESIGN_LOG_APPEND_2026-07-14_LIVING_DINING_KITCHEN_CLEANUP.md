# Ongoing Design Log Append, Living Dining Kitchen Cleanup

## 2026-07-14, Living Dining Kitchen Cleanup

Status: NEEDS_TESTING
Branch: phaser-migration and main
Commits:
- phaser-migration backup manifest: 00a7d6319c9f40b7d123940b935d4cdfaa764351
- phaser-migration runtime: 0a07116a72680742875bc2afc99b2dedeca59ee1
- phaser-migration cache chain: fb4f51e6a7a3332d7d7df36a3df7a2e5aa88bba8 / afe9b95541cf36c8a24cbd882b36f85338ad24af / 75a364218344229bfc852a46c3b4da7ab58ca6b7 / 7b7f18710bf6f207072bdcd7c5aba2b688848ed3
- main backup manifest: 71d0c1cf1e0a98b4613753ff21b71a176ecf2859
- main runtime mirror: b3a8b3197cbe49e201d2bbbfc9cc710ccc055a3b
- main cache chain: 304d9ab618e52dfed5e58da941d732f028220f02 / 7a6c9c06238de1277b714c758aac7becec3ec854 / ba465ca6a72af9d86789cf79119302ca5d0250b9 / 311af0320ea48c934fb73a8641b52a033aff7483
Files changed:
- src/mainFloorLayoutPolish.js
- src/rendering.js
- src/canvasRuntime.js
- src/main.js
- index.html
- apartment-god-production/BACKUP_MANIFEST_2026-07-14_LIVING_DINING_KITCHEN_CLEANUP_PHASER.md
- apartment-god-production/BACKUP_MANIFEST_2026-07-14_LIVING_DINING_KITCHEN_CLEANUP_MAIN.md
Runtime files changed: yes
Render playable branch updated: yes, mirrored to main
Backup branch: none created in this session because the loaded GitHub schema did not expose create_branch. Backup manifests were created with protected file SHAs instead.

Summary:
Kam reported that the living room was missing the coffee table between couch and TV, the media shelf/stereo was being cut in half by a clear overlay, old dining residue remained buried under the new dining asset, and the kitchen sink looked unnaturally placed rather than diagonal in the corner facing into the kitchen. This pass cleans those layout issues in both phaser-migration and main.

Implementation details:
- Added a coffee table between the couch and TV in the living room correction pass.
- Re-drew the wall TV and media shelf after the TV clear/lighting pass so the media shelf is not cut in half.
- Expanded the dining clear region to cover the old table/chair residue under the new dining set.
- Kept the dining set as separate drawn chair pieces plus a separate table piece.
- Moved the kitchen sink into the counter corner and redrew it as a diagonal corner sink facing into the kitchen.
- Kept the coffee maker on the right side counter away from the corner sink.
- Cache-busted the module chain through index, main, canvasRuntime, rendering, and mainFloorLayoutPolish on both phaser-migration and main.
- An accidental placeholder append file was created and immediately deleted on phaser-migration before runtime edits; it is not part of final documentation state.

Testing performed:
- GitHub source inspection only.
- No local browser test and no Render test performed in this chat.

Testing requested:
Open https://apartment-god-phaser.onrender.com after Render picks up main. Hard refresh. On the main floor, verify: coffee table appears between couch and TV, media shelf/stereo is no longer cut in half, old dining residue is gone under the current dining set, dining chairs still appear as individual pieces, sink is diagonal in the kitchen corner facing inward, coffee maker remains separate on the right side counter.

Known risks:
- The furniture remains procedural Canvas art, not final PNG furniture.
- Browser cache or Render build timing may delay visibility.
- If the old overlay still appears, inspect served JavaScript and deployed commit before another visual rewrite.

Follow ups:
- If seating alignment still looks off after the residue cleanup, adjust the dining action anchor in the action/routing layer rather than only moving the drawn chair.
- Replace these procedural placeholders with final top-down PNG object assets when the sprite pipeline is ready.
