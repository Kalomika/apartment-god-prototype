# Development Matrix Patch: Front Yard Adjacency Correction

Date: 2026-07-14 CT
Branch: phaser-migration
Status: NEEDS_TESTING
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-front-yard-alignment-correction-2026-07-14
Related log append: apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_FRONT_YARD_ALIGNMENT_CORRECTION.md

This patch should be merged into `apartment-god-production/DEVELOPMENT_MATRIX.md` during the next safe canonical matrix sync.

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Front property adjacency | NEEDS_TESTING | `src/frontYardDriveway.js`, `src/cameraNavigation.js`, `src/ui.js`, `tests/front-yard-driveway.test.js` | Corrected the first crammed frontage pass. Front Yard South is now the garden/porch/play frontage directly South of Main House. Driveway West is a separate floor directly South of Garage West and West of Front Yard South. | Browser test map, blueprint, swipe, and visible screen identity. |
| Driveway West | NEEDS_TESTING | `src/frontYardDriveway.js`, `src/vehicleSystem.js` | Vehicle movement now uses floor 7, Driveway West. Garage connects South to Driveway West, and Driveway West connects East to Front Yard South. | Test car departure and return with work and errand trips. |
| Front Yard South | NEEDS_TESTING | `src/frontYardDriveway.js` | Floor 6 is now porch, garden, walkway, curb view, and a small kids basketball hoop corner. It is no longer the driveway screen. | Test scale, readability, mobile framing, and whether the hoop looks like a child-sized front-yard object. |
| Blueprint | NEEDS_TESTING | `src/cameraNavigation.js` | Blueprint now uses the corrected grid: `[Garage West][Main House][Secret Lab East]` above `[Driveway West][Front Yard South]`. | Open blueprint and confirm Driveway West sits below Garage West, not merged into Front Yard South. |
| Swipe navigation | NEEDS_TESTING | `src/cameraNavigation.js` | Front Yard South swipes West to Driveway West. Driveway West swipes East to Front Yard South. Garage West swipes South to Driveway West. | Mobile and desktop swipe test. |

## Corrected Spatial Matrix

| Position | Floor | Area | Design Intent | Status |
|---|---:|---|---|---|
| Center | 0 | Main House | Main interior and front entry source | Existing |
| West of Main | 3 | Garage West | Garage and parked vehicles | Existing |
| East of Main | 5 | Secret Lab East | Secret/test area | Existing |
| South of Main | 6 | Front Yard South | Garden, porch, front walk, curb, child hoop corner | NEEDS_TESTING |
| South of Garage / West of Front Yard | 7 | Driveway West | Driveway, garage mouth, gate edge, road entry/exit | NEEDS_TESTING |
| North of Main | 4 | Backyard North | Backyard activities | Existing |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Main front yard identity | Critical | NEEDS_TESTING | Press `Front South` and confirm it shows porch/garden/front walk/kids hoop, not the driveway. |
| Driveway West identity | Critical | NEEDS_TESTING | Use House Map or blueprint to open Driveway West and confirm it shows garage mouth, driveway, gate, and road. |
| Blueprint adjacency | Critical | NEEDS_TESTING | Open blueprint and confirm Driveway West is below Garage West while Front Yard South is below Main House. |
| Front Yard to Driveway swipe | Critical | NEEDS_TESTING | On Front Yard South, swipe toward West and confirm Driveway West comes in. |
| Driveway to Front Yard swipe | High | NEEDS_TESTING | On Driveway West, swipe toward East and confirm Front Yard South comes in. |
| Garage to Driveway swipe | Critical | NEEDS_TESTING | From Garage West, swipe South and confirm Driveway West comes in. |
| Vehicle departure route | Critical | NEEDS_TESTING | Start car trip and confirm Garage West -> Driveway West -> road -> offscreen. |
| Vehicle return route | Critical | NEEDS_TESTING | Let trip return and confirm road -> Driveway West -> Garage West. |
| Work/pay still completes | Critical | NEEDS_TESTING | Confirm offsite work completion and paycheck still fire after driveway route. |

## Risk Matrix Updates

| Risk Area | Risk Level | Why It Is Dangerous | Required Protection |
|---|---|---|---|
| Property adjacency | High | If front yard and driveway do not match the house layout, the world map feels fake and confusing. | Keep Main House -> Front Yard South and Garage West -> Driveway West as hard layout law. |
| Vehicle route | High | Moving vehicles to floor 7 adds another floor handoff before offsite travel. | Test both departure and return. |
| Runtime world patch | Medium | Floors are installed at boot rather than canonical `world.js`. | Fold into `src/world.js` after browser verification. |
| First-pass art | Medium | Porch/garden/hoop/driveway are procedural and may need polish. | Do not mark final until browser review and art pass. |

## Branch and Render Matrix Update

| Branch Or Target | Role | Current Rule | Update Permission |
|---|---|---|---|
| `phaser-migration` | Active development branch | Front yard adjacency correction committed here. | Needs tests/build and browser verification before any main update. |
| `main` | Render playable branch | Not touched by this pass. | Only update after Kam explicitly asks for Render playable access, with a fresh main backup first. |
| Render settings | Deployment configuration | Not changed. | No changes unless Kam explicitly asks and environment allows it. |
