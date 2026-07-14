## 2026-07-14 Layer Ordering, Collision, Vehicle, and Lab Test Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: latest phaser-migration after layer routing lab fixes
Files changed: src/runtimeObjectCorrections.js, src/layerOrderingCorrections.js, src/vehicleOccupantOverlay.js, src/rendering.js, src/main.js, src/canvasRuntime.js, src/config.js, src/ui.js, apartment-god-production/ONGOING_DESIGN_LOG_LAYER_ROUTING_LAB_APPEND_2026-07-14.md, apartment-god-production/DEVELOPMENT_MATRIX_LAYER_ROUTING_LAB_PATCH_2026-07-14.md, apartment-god-production/IDEA_BIBLE_LAYER_ROUTING_LAB_APPEND_2026-07-14.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-layer-routing-lab-fixes-2026-07-14

Summary:
Kam reported that living room layer ordering made the coffee table look cut by floor overlays, kitchen layering and sink placement were visibly wrong, garage vehicle commands failed for bike and ATV, cars were not acting like blockers, characters were walking through objects, vehicle boarding hid characters instead of keeping them visible, and the secret lab should contain a test man, test woman, and dog for animation review.

Implementation details:
- Added runtime object corrections that run before simulation ticks so corrected collision flags are active before movement.
- Added hidden vehicle collision blocks for cars, bike, motorbike, and ATV so vehicle approach routing can still target seats without letting actors walk through vehicle bodies.
- Changed key furniture, bathroom fixtures, exercise equipment, and lab test fixtures into solid non enterable blockers for normal walking while preserving action approach points.
- Added a main floor layer correction pass that redraws the kitchen stack and living room coffee table after the older polish clear passes. This specifically addresses the coffee table being erased by the couch floor clear and the diagonal kitchen sink read.
- Added visible vehicle occupant overlays so characters are shown through glass roof zones and a retracting seat guide appears during car boarding instead of reading as a pure disappearance.
- Added ATV travel actions to the config and routed ATV travel through the same vehicle offsite system used by bike and motorbike.
- Confirmed existing lab test actors in state include Test Man, Test Woman, and Test Dog on Secret Lab East.

Testing performed:
Code inspection and GitHub patching only. Browser and Render behavior were not tested in this chat.

Testing requested:
Test on phaser-migration first, then mirror to main only if Kam wants Render playable access updated. In browser, clear stale save if needed, then test main floor living room TV area, kitchen sink and counter stack, garage click actions for Family SUV, Sports Convertible, Bicycle, Motorbike, and ATV, direct movement around cars, direct movement around bed, shower, treadmill, weight bench, and heavy bag, and Secret Lab East actor visibility.

Known risks:
Collision blockers are a targeted safety layer. Because the older renderer still uses multiple visual correction passes, there may be remaining object clears that need a follow up render order cleanup. Vehicle occupant drawing is a visible overlay pass, not the final complete retracting seat animation system. Bathroom and bed entry or exit still need a deeper entry loop exit animation pass to fully satisfy the no disappearance rule.

Follow ups:
Build a proper interaction layer model with underlay, floor decor, solid object base, use state overlay, character body, foreground object layer, privacy or blanket layer, and UI layer. Replace temporary vehicle occupant overlay with exact boarding, seated glass roof, exit, and return states per vehicle type. Add specific shower step in, steam, door slide, step out states and bed blanket over body versus nap on top of cover states.
