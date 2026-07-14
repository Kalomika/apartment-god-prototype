# Ongoing Design Log Append: Front Yard Adjacency Correction

## 2026-07-14 CT, Correct Main Front Yard and West Driveway Alignment

Status: NEEDS_TESTING
Branch: phaser-migration
Commit:
- 428f86c043757866a15e8ee89dadb12476c12652, Capture front yard adjacency correction directive
- 713d00500fb8e0910150d3eaa48d49ec3f1195ad, Split front yard and west driveway frontage
- 69d154f4c14e5e30f3a8e48663a1303d2f14630f, Correct blueprint adjacency for front yard and driveway
- 4e2a8b27a834bd6f5348dc94ae7747eb9eeec73c, Expose driveway west in house map
- 67adf1e816ee199333e6403a14b2d686d5088826, Test corrected front yard driveway adjacency
- 78c43a724fef72a01d78e3de5a134d97a401f9b5, Cache bust front yard adjacency renderer
- 960735cf03e4b2d637d763dd846dfe5b1f7316cc, Cache bust front yard adjacency runtime
- 0be9187266ccca466baab0757b05a3dad4151f74, Cache bust page for front yard adjacency
Files changed:
- apartment-god-production/IDEA_BIBLE_APPEND_2026-07-14_FRONT_YARD_ALIGNMENT_CORRECTION.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_FRONT_YARD_ALIGNMENT_CORRECTION.md
- src/frontYardDriveway.js
- src/cameraNavigation.js
- src/ui.js
- tests/front-yard-driveway.test.js
- src/canvasRuntime.js
- src/main.js
- index.html
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-front-yard-alignment-correction-2026-07-14

Summary:
Kam corrected the first South frontage pass because it placed the main front yard, driveway, gate, and road into one crammed screen that did not line up with the actual house layout. This pass split the frontage into two adjacent South row areas: `Front Yard South` directly below the Main House, and `Driveway West` directly below Garage West. The driveway no longer occupies the main front yard screen.

Corrected spatial model:

```txt
North row: [ Garage West ] [ Main House ] [ Secret Lab East ]
South row: [ Driveway West ] [ Front Yard South ]
```

Implementation details:

- Kept `Front Yard South` as floor 6, now focused on porch, garden, front walk, curb/road view, trees, shrubs, and a small kids basketball hoop corner.
- Added `Driveway West` as floor 7, aligned West of Front Yard South and South of Garage West.
- Moved vehicle driveway behavior to floor 7 so car trips are now `Garage West -> Driveway West -> road -> offscreen`.
- Added front yard to main house portal objects and front yard to driveway edge portal objects.
- Updated garage driveway portal so Garage West connects to Driveway West instead of the main front yard.
- Updated the House Map to include Driveway West.
- Updated blueprint layout and copy so the map shows Front Yard South under Main House and Driveway West under Garage West.
- Updated swipe navigation:
  - Main House swipes South to Front Yard South.
  - Front Yard South swipes West to Driveway West.
  - Driveway West swipes East to Front Yard South.
  - Garage West swipes South to Driveway West.
  - Driveway West swipes North to Garage West.
- Updated tests so the main front yard cannot silently regress back into a driveway screen.
- Cache busted page/runtime/renderer imports so the corrected frontage should not remain stuck behind the first crammed implementation in browser cache.

Testing performed:

- GitHub file inspection only.
- No local `npm test`, `npm run check`, `npm run build`, or browser test was possible from this connector-only environment.
- Updated `tests/front-yard-driveway.test.js`, but the suite still needs to be run in a real checkout.

Testing requested:

Run:

```txt
npm test
npm run check
npm run build
```

Browser test after a safe Render playable branch update only if Kam explicitly asks:

1. Boot and confirm no blank canvas.
2. Press `Front South` and confirm the screen is now porch/garden/front walk/kids hoop, not driveway.
3. Open House Map and confirm both `Front Yard South` and `Driveway West` exist.
4. Open blueprint and confirm Driveway West appears below Garage West while Front Yard South appears below Main House.
5. From Front Yard South, swipe toward West and confirm Driveway West comes into view.
6. From Driveway West, swipe back toward Front Yard South.
7. From Garage West, swipe South and confirm it goes to Driveway West, not Front Yard South.
8. Start a car work/errand trip and confirm the car uses Driveway West, not the garden/porch front yard.
9. Let the trip return and confirm it returns Road -> Driveway West -> Garage West.

Known risks:

- Browser behavior is not verified yet.
- Driveway West is still first-pass procedural construction, not final production art.
- The front yard has a small kids basketball hoop corner as requested, but its scale and visual quality need browser review.
- Vehicle orientation/turn readability may still need production top-down road-facing vehicle frames.
- Floor 6 and floor 7 are still installed at boot as a runtime world patch. If browser testing passes, fold them into the canonical `src/world.js` during a safe world sync.

Follow ups:

- Browser verify adjacency, swipes, blueprint, and vehicle route.
- Tune porch/garden/hoop/driveway scale if it feels too crowded.
- Add production vehicle road frames if turns are weak.
- Fold corrected floors and portals into canonical world definition after verification.
