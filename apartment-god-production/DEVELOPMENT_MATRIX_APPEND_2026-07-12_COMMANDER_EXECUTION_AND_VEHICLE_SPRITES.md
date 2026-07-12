# Development Matrix Append, Commander Execution and Vehicle Sprite Integration

Date: 2026-07-12
Branch: phaser-migration
Status: NEEDS_TESTING

## Matrix rule update

Add this to the System Matrix:

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Commander execution standard | IMPLEMENTED | `docs/APARTMENT_GOD_COMMANDER_EXECUTION_RULE.md` | Agents must solve toward Kam's stated vision instead of returning vague blockers or making Kam think through implementation details the agent can solve. | Before claiming blocked, document exact attempts and the smallest remaining blocker. |
| Production vehicle sprite integration | NEEDS_TESTING | `src/vehicleSpriteRenderer.js`, `src/vehicleSpriteOverlays.js`, `src/renderDynamic.js`, `assets/vehicles/generated_2026_07_12/VEHICLE_SPRITE_MANIFEST.md` | Garage vehicles now render through the production sprite renderer overlay and moving vehicle renderer, with type labels removed. | Browser test garage, departure, return, lock and unlock flashes, SUV readability, sports car readability, bike, motorcycle, ATV. |

## Object matrix updates

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Family SUV | Garage | NEEDS_TESTING | Travel, work, errand, mall, movies, date, vacation | Human passengers, dog possible | Production top down SUV sprite quality, no text labels, separate hood, hatch, door, light logic in renderer | Overlay must fully cover old fallback and dynamic travel must match parked sprite | Needs browser test. |
| Four door sports car | Garage | NEEDS_TESTING | Travel, work, errand, mall, movies, date | Human passengers | Production red four door sports car sprite quality, no convertible label, no text labels, separate doors, hood, trunk, light logic in renderer | World label may still need cleanup in menus if visible outside garage | Needs browser test. |
| Bicycle | Garage | NEEDS_TESTING | Solo travel | Human rider | Production colored top down bike with wheels, frame, handlebar, seat, pedal group | Rider overlay and scaling need browser review | Needs browser test. |
| Motorbike | Garage | NEEDS_TESTING | Solo or two rider travel | Human rider, passenger possible | Production top down motorcycle with wheels, handlebar, mirrors, seat, lights | Rider overlay and scaling need browser review | Needs browser test. |
| ATV | Garage | NEEDS_TESTING | Garage travel support | Human rider, passenger possible | Production top down ATV with four tires, body shell, handlebar, seat, grill, light area | Scaling and route clearance need browser review | Needs browser test. |

## Enforcement note

The prior garage vehicle look with labels such as SUV, CONV, BIKE, MOTO, and ATV is rejected. Vehicle identity should be communicated by silhouette and object construction, not text on top of the object.

## Testing requested

After main mirror, test the Render garage view and vehicle travel. Confirm the parked vehicles and moving vehicles both use the same production sprite style and that the old label based placeholder look is gone.
