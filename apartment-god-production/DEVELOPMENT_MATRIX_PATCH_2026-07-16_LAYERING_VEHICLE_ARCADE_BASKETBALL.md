# Development Matrix Patch, Layering, Vehicle Motion, Arcade, Offsite, and Basketball

Date: 2026-07-16
Branch: phaser-migration
Status: PLANNED AND IN EXECUTION
Canonical merge pending: yes

## System Matrix Additions

| System | Status | Source Of Truth | Current Direction | Required Test |
|---|---|---|---|---|
| Main floor render ordering | NEEDS_CORRECTION | src/rendering.js, src/mainFloorLayoutPolish.js, src/layerOrderingCorrections.js | Remove destructive floor clear overlap and enforce walls, furniture, character, foreground order. | Dining table, chairs, wall, kitchen appliances, and sink stay readable in all activity states. |
| Pool activity movement | NEEDS_CORRECTION | src/poolActivitySystem.js, src/actions.js, src/renderEntities.js | Replace jittering fixed point behavior with explicit shot stations and turn based movement around the table. | Two players circle table, line up, shoot, and do not jitter. |
| Dog visual | NEEDS_CORRECTION | src/dogSpriteOverlay.js, assets/sprites/characters/dog/top_down_dog_atlas.svg | Replace crude shape with mature true top down anatomy. | Readable head, shoulders, torso, hips, four legs, tail, and movement orientation. |
| Driveway gate and garage alignment | NEEDS_CORRECTION | src/frontYardDriveway.js, src/world.js | Align garage opening, driveway lane, gate, porch door, and south transition path. Gate must open before passage. | No character or vehicle crosses a closed gate. |
| Character grounding | PLANNED | src/renderEntities.js | Add faint overhead shadows beneath people and dogs. | Shadow separates actors from floor without isometric tilt. |
| Panic room entrance | NEEDS_CORRECTION | src/world.js, src/renderHouseStyle.js | Reorient door toward hall or explicitly define hidden bathroom entrance. | Door visually and functionally faces intended approach corridor. |
| Arcade mini games | PLANNED | new dedicated arcade system plus render integration | Add object aware hands and three distinct simulations: fighting, paddle game, racing. | Each game has visible input response, score or progress, and nearby mini screen. |
| Vehicle physical departure | NEEDS_CORRECTION | src/vehicleSystem.js, src/frontYardDriveway.js, src/renderDynamic.js | Replace sideways sliding and pivoting with reverse, steering arc, gate opening, road turn, and road aligned exit. | Cars and small vehicles rotate with their path and leave nose first. |
| Offsite non blocking play | NEEDS_CORRECTION | src/offsiteScenes.js, src/rendering.js, src/travelLocations.js | Keep house playable while away actor progresses offsite. | Another home actor can be selected and commanded during errands. |
| Basketball one on one | PLANNED | new basketball system, world court object, render and action integration | Continuous game with scoring, shot types, rebounds, loose ball pursuit, possession, end score, and interruption. | Full one on one loop runs until completion or interruption. |

## Object Matrix Additions

| Object | Area | Status | Required Behavior |
|---|---|---|---|
| Dining table and chairs | Main floor | NEEDS_CORRECTION | Must never cover walls or be erased by kitchen floor redraw. |
| Kitchen sink | Kitchen | NEEDS_CORRECTION | Must occupy one clear counter position without overlapping another appliance. |
| Garage gate | Front yard or driveway | NEEDS_CORRECTION | Opens before passage, closes after clearance, blocks while closed. |
| Arcade machine | Basement and lab | PLANNED | Hands on controls, game selection, miniature spectator screen, score state. |
| Basketball court | Compound side yard | PLANNED | Larger court, hoop, three point arc, paint, one on one play space, loose ball bounds. |

## Animation Matrix Additions

| Animation | Status | Required Identity |
|---|---|---|
| Pool shot walk around | PLANNED | Walk to table side, plant, aim, cue stroke, watch ball, reposition. |
| Arcade fight game | PLANNED | Joystick and button hands visibly drive two fighter sprites. |
| Arcade paddle game | PLANNED | Paddle responds to player input and ball physics. |
| Arcade race game | PLANNED | Steering input, track movement, lap progress, collisions. |
| Car reverse and road turn | PLANNED | Reverse path, steering angle, gate timing, arc into road, road aligned acceleration. |
| Bike and ATV reposition | PLANNED | Walk or push, front wheel steering, mount, accelerate, turn into road. |
| Basketball dribble | PLANNED | Hand to ball timing, floor bounce, locomotion. |
| Basketball shot set | PLANNED | Two point, three point, layup, dunk, miss, backboard, rim rebound. |
| Basketball rebound chase | PLANNED | Ball physics destination, pursuit, pickup, possession transfer. |
