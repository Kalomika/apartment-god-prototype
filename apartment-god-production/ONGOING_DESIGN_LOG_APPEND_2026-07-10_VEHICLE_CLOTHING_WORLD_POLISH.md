## 2026-07-10 06:15 AM CT, Vehicle Clothing World Polish Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: world 51d52e45e23704632313151f59a21a0007ec6e4a, config 1942daac4b28fe092d99b6059acd9cab3040df46, state 631daec4fa9a968344c1ed79725085ffe3ee5734, travel 28ac985e1c4d5567beea98f62fc0c3e9a79d6e79, actions 047a04a47e76197d948e8a9e3f2a890044c0cda2, ui d6f209c52ddde85a165c37a13a01f12896ec82e1, object overlays 9424b68052e23f1fc9e550ca799d4293f4e5489d, after entity overlays de1c91d3cdc74b020ea1868464bb1cb7f47a21f0, render dynamic 23f5c7d72e02a4e418bc072ba056c5b0c2f2f1fe, soccer 5bd5491e01ef78ba2364a8b964fefea4a90a7ebb, auto hooks 37edb3471c506d00f86ea73f4aa59497626cc545
Files changed: src/world.js, src/config.js, src/state.js, src/travelLocations.js, src/actions.js, src/ui.js, src/objectCorrectiveOverlays.js, src/afterEntityOverlays.js, src/renderDynamic.js, src/soccerSystem.js, src/autoHooks.js, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-10_VEHICLE_CLOTHING_WORLD_POLISH.md
Runtime files changed: yes
Render playable branch updated: pending main mirror after compare
Backup branch: backup/phaser-migration-before-vehicle-clothing-world-polish-2026-07-10

Summary:
Implemented a guarded polish pass based on Kam's live mobile screenshot notes. The pass focuses on garage vehicle readability, bike trip options, offsite time behavior, wardrobe and towel foundations, pool and dining placement, shower privacy overlay containment, and dog soccer behavior.

Implementation details:

- Enlarged the backyard pool so it fills more of the top right pool deck area.
- Moved the dining table farther into the kitchen and made it horizontal instead of cramped near the living room.
- Added a Bedroom Closet object and closet actions for changing clothes and planning weekly outfits.
- Added weekly wardrobe state for Resident and Girlfriend, with one outfit name and color per day of the week.
- Added wardrobe color overlay strips on characters so different outfit days have a visible first pass.
- Added towels after showering and swimming through carried towel icons and shower area towel overlay.
- Restricted the shower privacy/censor overlay so it only appears when an actor is actually near a shower in the same room, preventing the blur from appearing in the garage or other non restroom scenes.
- Changed garage car labels and intended forms to Family SUV and Sports Convertible.
- Added corrective garage vehicle overlays for SUV, sports convertible, bicycle, motorbike, and ATV so parked vehicles read more like their intended vehicle types.
- Reworked moving vehicle render art so active departures and returns use improved vehicle bodies and removed the ugly long black open door lines.
- Kept vehicle remote unlock/lock phases in the existing garage sequence. Current timing already triggers unlock when travelers reach the vehicle and lock before the garage opens for departure.
- Changed bicycle and motorbike menus so they offer the same daily destinations as cars: Work, Quick Errand, Mall, Movies, and Date.
- Added vehicle based travel cost and duration adjustments: bicycle costs less and completes faster, motorbike costs less and completes faster than car.
- Added bike and motorbike exposure consequences to hygiene and energy.
- Added passenger constraints so bicycle and motorbike trips have limited space and cannot carry the dog.
- Changed offsite fast forward so the time speed boost only happens if Resident is among the people offsite.
- Changed soccer field menu to simple soccer ball practice instead of exposing a full mini match from the object menu.
- Added dog soccer ball play mode with no scoring system, no scoreboard, and simple dog ball chasing.
- Hooked soccer ball play into the runtime tick through auto hooks.

Testing performed:
GitHub file inspection only. No local npm build, no browser test, and no Render test performed in this chat.

Testing requested:
After main is mirrored, test https://apartment-god-phaser.onrender.com on mobile. Check boot, garage vehicle appearance, vehicle departure and return, bicycle menu destination options, bicycle trip cost and hygiene effect, offsite time speed when Girlfriend leaves without Resident, shower privacy overlay only inside the bathroom, pool size, dining table position, closet menu, Change Clothes action, towel after shower or swim, and dog soccer ball play without scoreboard.

Known risks:
This pass touches render overlays, dynamic vehicle rendering, object layout, offsite rewards, UI object routing, action finishing, and soccer runtime. Browser boot must be verified. The wardrobe system is a first pass visual marker and does not yet replace full character sprites. Vehicle art is still procedural fallback, not final PNG production art.

Follow ups:
Replace procedural vehicle fallback with real PNG or sprite assets, deepen weekly outfit art beyond color strips, add true closet inventory, add towels drying over time, add bike passenger choice menus, add fuel tracking, tune pool furniture, and eventually replace all major objects through the proper asset pipeline.
