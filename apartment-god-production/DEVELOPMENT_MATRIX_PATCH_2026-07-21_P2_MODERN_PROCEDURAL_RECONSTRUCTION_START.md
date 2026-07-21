# Development Matrix Patch, P2 Modern Procedural Reconstruction

Date: 2026-07-21
Branch: phaser-migration-2
Status: IMPLEMENTATION IN PROGRESS
Backup: backup/phaser-migration-2-before-modern-procedural-reconstruction-2026-07-21

| System | Current finding | Required correction | Verification status |
|---|---|---|---|
| Overall top-down readability | Current screenshots do not immediately read as a competent modern roofless house. | Reconstruct connected architecture, floor materials, walls, thresholds, windows, and depth in native Phaser. | NEEDS_IMPLEMENTATION |
| Room visual sizing | Room SVGs are stretched across large rectangles and produce washed empty fields. | Draw rooms directly at exact world dimensions with material-specific native Graphics. | NEEDS_IMPLEMENTATION |
| Object footprint integrity | Transparent padding and generic source canvases make objects appear tiny or crushed inside their gameplay bounds. | Draw object-specific construction directly inside exact footprints, with explicit anchors for future authored sprites. | NEEDS_IMPLEMENTATION |
| Vehicle art | Cars, bike, motorcycle, and ATV do not read as credible true top-down vehicles. | Build dedicated top-down vehicle silhouettes, tires, glazing, lights, cabin, and orientation. | NEEDS_IMPLEMENTATION |
| Basement composition | Basement appears as oversized empty dark boxes with undersized objects. | Restore readable recreation and gym zoning, floors, furniture scale, and equipment anatomy. | NEEDS_IMPLEMENTATION |
| Backyard and front exterior | Outdoor areas lack believable landscaping and connected ground materials. | Add grass, deck, walkway, curb, pavement, road, kennel, pool, court, and boundary material relationships. | NEEDS_IMPLEMENTATION |
| Bed and sleeping alignment | Browser screenshots show incorrect body orientation and head placement relative to the bed. | Bind sleep position, facing, cover, and depth to exact bed headboard geometry. | NEEDS_IMPLEMENTATION |
| Actor and object scale | Characters and props are not consistently proportioned. | Preserve a common human-scale law across doors, beds, furniture, fixtures, vehicles, and activities. | NEEDS_IMPLEMENTATION |
| One-touch mobile controls | Up, Down, and other controls can require two taps. | Install pointer-up activation with click deduplication and immediate state transition. | NEEDS_IMPLEMENTATION |
| Swipe navigation | User reports extra swipes compared with earlier behavior. | Restore direct neighboring-area gesture mapping and prevent UI scroll containers from stealing game navigation gestures. | NEEDS_IMPLEMENTATION |
| Control-bar reachability | Horizontal control layout can require unnecessary thumb travel. | Keep primary Map, Up, Down, selected actor, locator, lab, and phone actions visible or directly reachable on mobile. | NEEDS_IMPLEMENTATION |
| Temporary art | Procedural SVG and generated PNG fallback art is visible as though production-ready. | Keep it behind explicit fallback and do not present it as final authored art. | ACTIVE RULE |
| Gameplay systems | Existing verified actions, autonomy, state, saves, phone, vehicles, gates, activities, and world data must survive. | Change visual and input integration only unless a browser-confirmed gameplay defect requires source correction. | PRESERVE, RE-TEST |
| main and Render | No update requested. | Do not touch main, Render, or Render settings. | PROTECTED |
