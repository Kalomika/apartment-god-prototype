# Development Matrix Patch, Layer Ordering, Collision, Vehicle, and Lab Test Pass

Date: 2026-07-14
Branch: phaser-migration
Status: NEEDS_TESTING
Canonical merge pending: yes

## System Matrix Updates

| System | Updated Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Movement and pathfinding | NEEDS_TESTING | src/movement.js, src/runtimeObjectCorrections.js | Added object collision correction layer and hidden vehicle collision blockers so vehicle approach routing does not permit walking through car bodies. | Browser test direct movement around every garage vehicle, bed, shower, treadmill, weight bench, heavy bag, and lab fixtures. |
| Mobile phone and menus | PARTIAL | src/ui.js | ATV travel actions were added to object routing. | Test ATV, bike, motorbike, and cars from object menus on mobile. |
| Vehicles and travel options | NEEDS_TESTING | src/config.js, src/ui.js, src/vehicleOccupantOverlay.js, src/vehicleSystem.js | ATV now has travel menu actions and routes through the offsite vehicle system. Visible occupant overlay shows seated people through vehicle glass and a retracting seat cue during car boarding. | Test SUV, convertible, bike, motorbike, and ATV travel start, boarding, leaving, return, and no walking through parked vehicles. |
| Main floor visual layer ordering | NEEDS_TESTING | src/layerOrderingCorrections.js, src/rendering.js | Added an after polish correction pass for the living room coffee table and kitchen sink or counter stack. | Test TV watch state, coffee table not being cut by couch floor clears, sink not floating or rotating wrong, and dining table not erasing kitchen objects. |
| Secret Lab East | NEEDS_TESTING | src/state.js, src/world.js | Lab already contains Test Man, Test Woman, and Test Dog. Current pass preserves them and logs the lab as the future animation review room. | Test lab navigation and object menus for all three lab actors. |

## Object Matrix Updates

| Object | Area Or Floor | Updated Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Coffee table | Main living room | NEEDS_TESTING | Visual support for TV and couch area | Human nearby | Must draw after couch floor clear and read as separate furniture | Older couch polish clear can erase it if correction pass fails | Test while Watch TV is active. |
| Kitchen sink | Main kitchen | NEEDS_TESTING | Groom, brush teeth, wash dishes | Human | Straight wall counter sink, not diagonal floating unit | Conflicts with older kitchen polish pass | Test guided sink action and kitchen read. |
| Family SUV | Garage | NEEDS_TESTING | Travel | Human, dog as allowed | Solid vehicle blocker, glass roof occupants, boarding cue | Hidden collision blocker must not block click target | Test approach and travel. |
| Sports Convertible | Garage | NEEDS_TESTING | Travel | Human | Solid vehicle blocker, visible passenger position | Same as SUV | Test approach and travel. |
| Bicycle | Garage | NEEDS_TESTING | Travel | Human rider | Solid object, mounted rider visible | Bike approach must not ignore body collision | Test bike travel. |
| Motorbike | Garage | NEEDS_TESTING | Travel | Human rider and passenger | Solid object, mounted rider visible | Same as bike | Test motorbike travel. |
| ATV | Garage | NEEDS_TESTING | Travel | Human rider and passenger | Solid object, mounted rider visible | Newly added menu action path needs browser test | Test ATV menu and travel. |
| Shower | Bathrooms and lab | NEEDS_CORRECTION | Shower | Human | Needs full step in, steam, sliding door, step out, foreground shower layer | Current pass only blocks normal walking, full entry exit animation is still pending | Test no casual walk through. |
| Bed | Bedroom and lab | NEEDS_CORRECTION | Sleep, nap, relax | Human | Blanket over sleeping body, nap on top of covers | Current pass only blocks normal walking, final sleep layer still pending | Test no casual walk through. |

## Animation Matrix Updates

| Animation Or Pose | Updated Status | Current Fallback | Needed Correction |
|---|---|---|---|
| Vehicle boarding | PARTIAL | Visible glass occupant and retracting seat cue overlay | Build exact chair slide or pivot, seated orientation, door close, exit, return per vehicle. |
| Shower entry exit | PLANNED | Collision guard only | Add step in, steam, door slide, shower foreground layer, step out. |
| Bed sleep layer | PLANNED | Existing bed overlays | Add under blanket sleep and on cover nap distinction. |
| Lab test actors | NEEDS_TESTING | Test Man, Test Woman, Test Dog exist as labOnly entities | Use lab to review final man, woman, and dog walk, sit, activity, and dog motion sprites. |
