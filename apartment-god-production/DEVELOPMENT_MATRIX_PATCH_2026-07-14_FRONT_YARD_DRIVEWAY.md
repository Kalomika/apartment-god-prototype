# Development Matrix Patch: South Front Yard Driveway

Date: 2026-07-14 CT
Branch: phaser-migration
Status: NEEDS_TESTING
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-front-yard-driveway-2026-07-14
Related log append: apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-14_FRONT_YARD_DRIVEWAY.md

This patch should be merged into `apartment-god-production/DEVELOPMENT_MATRIX.md` during the next safe canonical matrix sync.

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| South Front Yard / road slice | NEEDS_TESTING | `src/frontYardDriveway.js`, `src/canvasRuntime.js`, `src/rendering.js`, `src/ui.js`, `src/cameraNavigation.js`, `index.html`, `tests/front-yard-driveway.test.js` | First playable South section exists with front lawn, driveway, gate/fence edge, mailbox, bushes, road frontage, control button, House Map access, swipe access, and blueprint card. Installed at boot as a runtime world patch to reduce broad world rewrite risk. | Run tests/check/build, then browser verify the front screen, blueprint, map, swipes, and mobile readability. |
| Vehicle commute visibility | NEEDS_TESTING | `src/vehicleSystem.js`, `src/frontYardDriveway.js`, `src/rendering.js` | Vehicle departures now hand off from Garage to Front Yard South, move down the driveway, turn toward the road, then exit offscreen before offsite travel begins. Vehicle returns enter from the front road and hand off back to garage return. | Browser test work, errand, and return with SUV and convertible. Confirm no stuck vehicle, no hidden traveler bug, and no blank canvas. |
| Blueprint navigation | NEEDS_TESTING | `src/cameraNavigation.js` | Front Yard South is now included in the full blueprint and selectable map. This addresses Kam's reminder to map it to the blueprint. | Open blueprint and confirm Front Yard South appears, scales correctly, and clicking it moves camera there. |
| Camera swipe navigation | NEEDS_TESTING | `src/cameraNavigation.js` | Main House can swipe to Front Yard South, Garage can swipe to Front Yard South, Front Yard South can return to Main House or Garage. | Test on mobile and desktop, with no accidental room snap. |
| House map and controls | NEEDS_TESTING | `src/ui.js`, `index.html` | Added `Front South` side button and `Front Yard South` House Map row. | Confirm buttons exist, labels fit, and no control bar crowding on mobile. |

## Object Interaction Matrix Updates

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Front Yard South | Floor 6 | NEEDS_TESTING | View / future outdoor interactions | All | True top down lawn, driveway, bushes, curb, road frontage | First pass is procedural, not final art | Browser inspect scale and visual read. |
| Driveway | Front Yard South | NEEDS_TESTING | Vehicle departure / return | Vehicles | Wide pavement connected to garage mouth and road | Vehicle turning may need dedicated road-facing vehicle art | Test car departure and return. |
| Neighborhood road | Front Yard South | NEEDS_TESTING | Vehicle exit / return | Vehicles | Bottom half road with curb and lane marks | Road could read too plain until art pass | Test vehicle enters and exits road. |
| Garage driveway exit | Garage / Front Yard South | NEEDS_TESTING | Move camera / portal support | Vehicles, future pedestrians | Garage door to driveway relationship | Runtime world patch rather than canonical world file | Test garage and front portal presence. |
| Blueprint Front Yard South card | Blueprint UI | NEEDS_TESTING | Navigate to floor 6 | Player UI | Region card in whole-house map | CSS may need tuning for new card count | Test blueprint on mobile. |

## Animation Matrix Updates

| Animation Or Pose | Current Status | Required Quality Target | Needed Directions | Frame Need | Current Fallback | Test Notes |
|---|---|---|---|---|---|---|
| Garage to driveway vehicle departure | NEEDS_TESTING | Car leaves garage, appears in South driveway, moves toward road | Down then right | Transition | State movement using existing vehicle renderer | Verify camera handoff and no stuck trip. |
| Driveway turn onto road | PARTIAL | Car should back out or turn believably into road | Down/right and future backing state | Dedicated road-facing vehicle frames recommended | First-pass turn state | Test readability. Improve with production frames if weak. |
| Front road vehicle exit | NEEDS_TESTING | Vehicle drives offscreen on neighborhood street | Right | Transition | First-pass movement | Test work and errand. |
| Front road vehicle return | NEEDS_TESTING | Vehicle enters from road and returns to garage | Right then up/left | Transition | First-pass movement | Test return and traveler unhide. |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Front South boot safety | Critical | NEEDS_TESTING | Boot after reset and confirm no blank canvas or runtime error. |
| Front South control button | High | NEEDS_TESTING | Press `Front South` and confirm new front yard screen appears. |
| House Map front row | High | NEEDS_TESTING | Open House Map and confirm `Front Yard South` is listed and navigates correctly. |
| Blueprint front card | Critical | NEEDS_TESTING | Open blueprint, confirm Front Yard South card exists, and tap it. |
| Swipe front navigation | High | NEEDS_TESTING | Swipe between Main House, Garage, Backyard, Secret Lab, and Front Yard South. |
| Car departure via driveway | Critical | NEEDS_TESTING | Start a car work/errand trip and confirm garage to driveway to road to offsite sequence. |
| Car return via road | Critical | NEEDS_TESTING | Let a trip return and confirm road to driveway to garage sequence. |
| Offsite still completes | Critical | NEEDS_TESTING | Confirm work/errand still pays or applies rewards after front road exit. |
| Remaining actor playable | Critical | NEEDS_TESTING | Confirm home actor remains selectable and playable while one actor is offsite. |
| Mobile control crowding | High | NEEDS_TESTING | Confirm the added `Front South` side button and blueprint still fit on mobile. |

## Risk Matrix Updates

| Risk Area | Risk Level | Why It Is Dangerous | Required Protection |
|---|---|---|---|
| Vehicle routing handoff | High | Vehicles now cross Garage, Front Yard, offsite, return, and Garage again. Any broken phase can trap a car or traveler. | Test departure and return from every car menu and work schedule. |
| World patch install | Medium | New floor and portal objects are installed at boot instead of directly in `src/world.js`. This is safer for first pass but must be kept synchronized. | Fold into canonical world file only after browser verification. |
| Blueprint/card layout | Medium | Extra floor card may crowd blueprint UI. | Mobile blueprint test required. |
| Procedural front art | Medium | It is playable first-pass environment construction, not final production art. | Do not mark final until visual art pass and browser review. |
| Vehicle turn readability | High | Existing vehicle renderer may not fully sell road orientation. | Add dedicated top-down road-facing vehicle states if first-pass orientation is weak. |

## Branch and Render Matrix Update

| Branch Or Target | Role | Current Rule | Update Permission |
|---|---|---|---|
| `phaser-migration` | Active development branch | Front yard driveway pass committed here. | Needs tests/build and browser verification before any main update. |
| `main` | Render playable branch | Not touched by this pass. | Only update after Kam explicitly asks for Render playable access, with a fresh main backup first. |
| Render settings | Deployment configuration | Not changed. | No changes unless Kam explicitly asks and environment allows it. |
