# Apartment God Ongoing Design Log

Purpose: dated work history for Apartment God. The handbook is the standing rulebook. This log is where every meaningful change, fix, plan, revert, blocker, and test note gets appended.

Required reading before work:

```txt
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
docs/APARTMENT_GOD_BACKUP_POLICY.md
apartment-god-production/ONGOING_DESIGN_LOG.md
apartment-god-production/DEVELOPMENT_MATRIX.md
```

Entry format:

```txt
## YYYY-MM-DD HH:MM AM/PM CT, Short Title

Status:
Branch:
Commit:
Files changed:
Runtime files changed:
Render playable branch updated:
Backup branch:
Summary:
Implementation details:
Testing performed:
Testing requested:
Known risks:
Follow ups:
```

Status values:

```txt
IMPLEMENTED
PARTIAL
PLANNED
NEEDS_TESTING
BLOCKED
REVERTED
```

---

## 2026-07-08 04:50 AM CT, Runtime Branch Handbook and Backup Policy Added

Status: IMPLEMENTED
Branch: phaser-migration
Commit: handbook 8abe2e4e368cb174b2d5f6d7782db0f1a2cfbaed, backup policy ac170678db2118322510f6ee40d352575e79e99b
Files changed: docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md, docs/APARTMENT_GOD_BACKUP_POLICY.md, apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: no
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-autonomy-upgrade-2026-07-08

Summary:
Created the runtime branch development handbook and backup retention policy so future AIs can use repo documents instead of relying only on limited GPT project instructions.

Implementation details:
The handbook defines project identity, branch rules, Render test link, logging rules, backup rules, priority order, runtime safety standards, mobile rules, gameplay rules, actor AI direction, movement direction, sleep and routine direction, thought bubble versus speech bubble rules, activity consequence direction, vocation direction, repo map, and developer behavior standards.

The backup policy defines routine backups, protected milestone backups, a 5 routine backup retention rule per major work stream, and special rules before updating main for Render access.

Testing performed:
Documentation only. No runtime test needed.

Testing requested:
None for documentation.

Known risks:
The handbook and log need to stay synchronized across major branches if future agents work outside phaser-migration.

Follow ups:
Upgrade autonomy and movement choice behavior so actors stop wandering to pointless places, use alternate objects, vary activities, and remain functional without Kam directing every action.

---

## 2026-07-08 04:55 AM CT, Current Autonomy Upgrade Request

Status: PLANNED
Branch: phaser-migration
Commit: pending
Files changed: pending
Runtime files changed: planned
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-autonomy-upgrade-2026-07-08

Summary:
Kam reset the game and observed that the actors still behave too stupidly. Current priority is upgrading the active actor autonomy so characters function at the highest reasonable capability under the current Canvas game engine.

Implementation details:
Requested autonomy direction:

- Actors should use the whole house intelligently without needing Kam to direct every action.
- Auto mode should not be the only trigger for autonomy. Characters should generally be automatic, with guided/player commands overriding when needed for testing.
- Actors should satisfy needs, shower, eat, sleep, use bathrooms, use objects, do social actions, kiss, cuddle, interact with the dog, choose fun activities, and rotate through available activities before repeating too much.
- Actors should avoid pointless wandering to places with no activity, such as the front porch, unless there is an actual reason like food delivery, package, visitor, or future dog bone/object.
- Dog should not repeatedly go to front porch unless a real dog activity exists there.
- If an object is occupied or blocked, actors should try alternate objects or alternate rooms before giving up.
- Downstairs bathroom and upstairs bathroom should be interchangeable options when appropriate.
- Characters should not stand blocked in the middle of a room if another path, object, or fallback exists.
- Movement should use route variation and different approach points over time.
- Long activities should be interruptible by urgent needs or work.
- Movies, shows, music, reading, exercise, coffee, jobs, work schedules, vocation systems, thought bubbles, speech bubbles, and long term consequences are desired future systems. Implement current autonomy first without overbuilding the future systems prematurely.

Testing performed:
Not implemented yet.

Testing requested:
After implementation, test Reset, idle autonomy, bathroom fallback, dog behavior, fun activity choice, sleep, and guided interruption.

Known risks:
Autonomy touches core runtime behavior and can easily make the game feel worse if it spams actions, interrupts too aggressively, or fights guided commands.

Follow ups:
Implement autonomy upgrade carefully on phaser-migration, then mirror main only when Kam needs Render browser testing.

---

## 2026-07-08 05:05 AM CT, First Autonomy Intelligence Upgrade

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: autonomy 365fd9fefef5e6792afc095aaaecd235115678d5, movement 2677312bdf2f48026fb20b280e1eb4e102082916
Files changed: src/autonomy.js, src/movement.js
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-autonomy-upgrade-2026-07-08

Summary:
Implemented the first active intelligence upgrade for the current Canvas engine. The goal is to make characters function better without player guidance, stop pointless porch style wandering, use fallback objects, vary activities, and recover from blocked paths more aggressively.

Implementation details:

Autonomy changes:

- Replaced simple resident/girlfriend/dog random idle behavior with a shared human decision driver and dog decision driver.
- Added lightweight per actor brain memory with recent actions and recent objects.
- Actors now rotate activity choices to avoid repeating the same object/action too often.
- Human actors now prioritize urgent needs first: bladder, hunger, freshness, energy, social, fun, and stamina.
- Bathroom fallback now tries same floor and alternate floor toilets.
- Shower/freshness fallback now tries same floor and alternate floor showers, with sink grooming as backup.
- Hunger fallback tries fridge snack/meal and stove meal.
- Energy fallback tries bed, couch, or basement couch.
- Social logic attempts talk, hold hands, kiss, cuddle, and tickle when partner is available.
- Fun logic rotates TV, couch, desk, console, arcade, pool, darts, swimming, soccer, treadmill, weights, and heavy bag.
- Morning logic nudges bathroom, shower, and hunger if needed.
- Bedtime logic starts a simple sleep routine when night hours and energy/stamina suggest it.
- Dog logic now prioritizes bowl, kennel, nearby people, limited yard/house travel, and avoids random pointless front porch behavior.
- Smart wander now stays inside useful rooms on the current floor instead of picking arbitrary coordinates across the whole playfield.

Movement changes:

- Route candidate generation now allows multi step obstacle routing instead of only candidates with a direct start or end connection.
- Added more candidate points around blockers.
- Filters route candidates to actual rooms and out of solid object padding.
- Block recovery now retries longer and can snap to the final waypoint after repeated recovery attempts so the actor can complete an action instead of staying blocked forever.

Testing performed:
Code inspection only through GitHub file review. No local or Render runtime test performed in this chat.

Testing requested:
Mirror to main if Render testing is needed, then test reset, idle autonomy, bathroom fallback, shower fallback, hunger fallback, fun activity variety, social actions, dog choices, and garage movement near ATV.

Known risks:
This is a broad behavior change. It may expose unsupported actions, awkward timing, or path edge cases. It intentionally avoids building the full future job/movie/coffee/vocation systems in this pass.

Follow ups:
If this pass works, continue with deeper activity duration, sleep time speedup, thought bubbles, job schedules, default bookshelf, coffee maker, movie/show metadata, and clearer visible reasons for actor choices.

---

## 2026-07-08 05:10 AM CT, Render Playable Branch Updated for Autonomy Testing

Status: NEEDS_TESTING
Branch: main updated from phaser-migration
Commit: main and phaser-migration matched at ed1bfd182e39d623878320068b724ac2870c30c0 before this log entry was appended
Files changed: branch pointer update only before this log entry
Runtime files changed: no additional runtime files beyond autonomy and movement commits
Render playable branch updated: yes
Backup branch: backup/main-before-autonomy-render-update-2026-07-08

Summary:
Updated `main` from `phaser-migration` so Kam can test the first autonomy intelligence upgrade through the Render browser link.

Implementation details:
A fresh backup of current `main` was created first. Then `main` was fast forwarded to the current `phaser-migration` state. No Render settings were changed and no manual deploy was triggered.

Testing performed:
GitHub compare verified `main` and `phaser-migration` were identical immediately after the branch update.

Testing requested:
Refresh the Render link and test Reset, idle autonomy, bathroom fallback, shower fallback, hunger fallback, social actions, dog behavior, activity variety, and garage routing near the ATV.

Known risks:
Render may take time to pick up the latest main branch state. The autonomy code still needs real browser testing.

Follow ups:
If Render behavior is broken, restore from backup/main-before-autonomy-render-update-2026-07-08 or compare against backup/phaser-migration-before-autonomy-upgrade-2026-07-08.

---

## 2026-07-08 05:35 AM CT, Upstairs Visual Renderer Upgrade

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: f75981c4d7de9c678effab48d4495a802e4d2c91
Files changed: src/renderHouseStyle.js, apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: yes
Render playable branch updated: pending main mirror
Backup branch: backup/phaser-migration-before-upstairs-visual-upgrade-2026-07-08

Summary:
Upgraded the upstairs visual renderer while preserving the existing upstairs room layout, object IDs, click targets, collision boxes, doorways, windows, and pathfinding behavior.

Implementation details:

- Added a darker cyberpunk upstairs room treatment for the bedroom, office, upstairs bathroom, hall, and upstairs stair room.
- Added charcoal and blue-grey floor palettes with room-specific texture treatment.
- Added cyan and magenta neon strip accents, darker wall masses, stronger room edges, window glow treatment, and doorway threshold lighting for upstairs only.
- Upgraded the upstairs bed, laptop desk, shower, toilet, stairs, and bedroom light rendering with more mature top-down line-art style shapes.
- Kept the older procedural style for other floors to limit risk.
- Did not alter `src/world.js`, `src/blueprint.js`, movement, pathfinding, object IDs, actions, or room coordinates.

Testing performed:
Code inspection only through GitHub file review. No local or Render runtime test performed in this chat.

Testing requested:
Mirror to main for Render testing if needed, then test the upstairs view at https://apartment-god-phaser.onrender.com. Use the floor navigation or stairs to inspect Bedroom, Office, Upstairs Bath, Hall, and Stairs. Confirm the game still renders, upstairs objects remain clickable, windows still toggle, stairs still transfer floors, and the look feels like a stronger adult cyberpunk top-down apartment instead of a cozy placeholder.

Known risks:
This is a Canvas renderer-only visual upgrade. If the new drawing code has a browser rendering issue, restore from the backup branch or revert the renderer commit.

Follow ups:
If Kam likes the upstairs direction, continue with a similar guarded pass for main floor objects or move toward approved PNG replacement assets through the sprite pipeline.

---

## 2026-07-08 06:05 AM CT, First Lived In Activity Object Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: world e38541a0aafb409ef75b194d12bd41bd29c4ef75, config d6148ba06cdd26ab62aa452fa37633e410b6890a, renderObjects c83ac0e58167f2e33081da7b03ea9aae56de5307
Files changed: src/world.js, src/config.js, src/renderObjects.js, apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: yes
Render playable branch updated: pending main mirror
Backup branch: backup/phaser-migration-before-lived-in-activity-pass-2026-07-08

Summary:
Started the lived in activity pass so the house feels less like people are just walking around and more like time is passing through activities that occupy space and visually does something.

Implementation details:

- Added default Bookshelf, Coffee Maker, and Dining Table objects to the house so reset does not leave core reading, coffee, and eating surfaces missing.
- Added interaction menu entries for bookshelf, coffee maker, dining table, stereo song/album actions, and basic activity times in config.
- Added object rendering overlays for a clearer pool table setup with a triangular rack and cue ball, avoiding the old crossed cue/rack visual clash.
- Upgraded the weight bench overlay with a more recognizable bench, rack, barbell, and plates.
- Added animated barbell movement when lift weights is active.
- Added heavy bag sway and impact arc when heavy bag is active.
- Added dining table plates, cups, and eating label when active.
- Added coffee maker visual with brew light, carafe, and steam when coffee is active.
- Added TV screen glow projection when TV is on.
- Added console glow pulse during game activity.
- Added stronger swim pool wave motion when swimming is active.

Testing performed:
Code inspection only. No local or Render browser test performed in this chat.

Testing requested:
After mirroring to main, test Render link. Check main floor for bookshelf, dining table, and coffee maker. Check basement pool table rack, weight bench, heavy bag, and console. Check backyard pool wave activity. Confirm nothing blanks, object clicks still open menus, and existing movement is not blocked by the new table/bookshelf placement.

Known risks:
This is still procedural Canvas fallback art, not final animation assets. Activity durations are not fully corrected yet because indoor duration handling lives in action resolution and needs a separate guarded pass. New object actions may animate without full long term stat effects until the action consequence pass.

Follow ups:
Implement true lived in time durations for movies, games, albums, reading, coffee effects, eating at the table, and sleep time acceleration in a separate activity systems pass. Add real sprites or sprite sheet animations for all major activities when the pipeline is ready.

---

## 2026-07-08 06:35 AM CT, Secret Sprite Test Lab First Slice

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: world 0b21d78194ce7dff24bc7ce71386a79b58729557, state be99da89f0c8ca2f2a0a29667c24705fc8ea0c44, camera fa84eac5d5e134834867d35e198f2167dff41093 and dfb83631d5719abc4fae9587f4ff0fb4ba23bab4
Files changed: src/world.js, src/state.js, src/cameraNavigation.js, apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-secret-lab-sprite-test-2026-07-08

Summary:
Added the first isolated Secret Lab East area as a sprite and animation proving ground without replacing the normal household character renderer.

Implementation details:

- Added floor 5, Secret Lab East, as a right side same level area east of Main House.
- Added Secret Lab objects using existing known object kinds: lab bed, laptop desk, chair, motion screen, shower pod, toilet, pool table, console, dart board, treadmill, weight bench, heavy bag, and lab light.
- Added a stopped lab only Test Subject on floor 5 so sprite and pose work can be isolated from Resident, Girlfriend, and Dog.
- Added a Secret Lab utility button to the black control row using the lab flask icon.
- Added a selected character utility button using the star icon so Kam can jump back to the selected playable character quickly.
- Added swipe left from Main House to Secret Lab East and swipe right from Secret Lab East back to Main House.
- Kept Secret Lab out of the blueprint by leaving it out of the blueprint floor list and hiding lab only markers from blueprint cards.
- Added selected character follow state. Default is follow selected. Manual camera choices disable follow, and the star button resumes selected follow.

Testing performed:
Code inspection only through GitHub file review. No local or Render browser test performed in this chat.

Testing requested:
After main is updated for Render testing, check that the game boots, the black row shows star, lab, blueprint, locator, and phone controls, the lab button slides to Secret Lab East, swipe left from Main goes to the lab, swipe right from lab returns to Main, blueprint excludes the lab, locator still shows the Test Subject, lab objects open menus, and the star button returns to the selected character.

Known risks:
This is a same level camera and layout extension. It should remain isolated from normal autonomy, but it still touches world data, state initialization, and camera navigation. It has not been browser verified.

Follow ups:
Add sprite asset manifest and one Resident or Test Subject sprite fallback path inside the lab only. Add pose specific lab actions after the lab is confirmed stable.

---

## 2026-07-09 09:15 PM CT, First Playable Career System Slice

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: career system c08fc576557ab7cac27f2da34a7d671c1e434128, state ce7a1c30d63f592e56ec3008319cfe37cb5e8538, travel rewards 81acdb3d6dd37f1b7ff058e3f5f22ad353742af7, phone menu d020191d87ca82fc75d639456b389b896d33858c, autonomy b857424a4e6a29a72f60fb1d3e05f8286927a586 and trait hardening current sha 434f38f4b91581f6858ac1e745c7d88c2f1f0303, HUD ecf29d3413edfae404b5554c66403e494e36c9b3
Files changed: src/careerSystem.js, src/state.js, src/travelLocations.js, src/appMenu.js, src/autonomy.js, src/ui.js, apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-career-system-2026-07-09

Summary:
Implemented the first playable career system slice so work is no longer only a generic offsite action. Careers now have tracks, schedules, per character assignments, pay, XP, promotions, fatigue effects, perks, phone access, HUD status, and autonomy hooks that can send characters to scheduled shifts.

Implementation details:

- Added `src/careerSystem.js` with career tracks for Storyboard Artist, Remote Support Lead, Movie Theater Crew, Airline Ground Crew, and Freelance Animator.
- Added per character career state under `state.careers.people` with Resident defaulting to Storyboard Artist and Girlfriend defaulting to Remote Support Lead.
- Added career pay, XP, level, shifts worked, last worked day, last pay, and promotion thresholds.
- Added career effects on energy, stamina, fun, freshness, and social after a shift.
- Added career perks for movie tickets, airline standby vacation tickets, and creative fun relief.
- Updated work offsite rewards to call career completion instead of the old generic work perk function.
- Added phone Career / Work menu with current status, Work Shift Now, Quit Job, and Apply options for all available tracks.
- Added HUD career line for the selected person showing role, level, XP, and last pay.
- Added autonomy logic so employed people can leave for scheduled shifts if their needs are not critically low and they are not already busy.
- Hardened autonomy trait checks so existing object shaped traits still work when career scheduling runs.

Testing performed:
Code inspection through GitHub file review. Confirmed `src/autonomy.js` contains the scheduled work hook and hardened trait helper after the final write. No local or Render browser test performed in this chat.

Testing requested:
After main is updated for Render testing, open https://apartment-god-phaser.onrender.com. Test boot, Cell > Career / Work, Apply job, Work Shift Now, vehicle departure, offsite work completion, vehicle return, money increase, HUD career status, XP gain, promotion after repeated shifts, and that remaining home characters stay playable when one person leaves for work.

Known risks:
This touches autonomy, phone menu, offsite rewards, state shape, and HUD. Browser boot has not been verified. Reset and old saves may need normalization if saved career data is missing or stale, though `ensureCareers` is designed to normalize career state when accessed.

Follow ups:
Add missed shift warnings, job loss risk, work from laptop, interview/application consequences, job specific thoughts, work stress, remote work at desk, sick days, PTO, and clearer schedule alerts.

---

## 2026-07-09 09:45 PM CT, Animated Reaction and Relationship First Slice

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: reaction system 5cf2c744771f7729a08beb14911e40e5b75ff079, reaction lookup fix ed5e3d67cad27b95f4ea59bd3fb91dfeb38e34a0, actions e7ff6a654f49133f32d508fb1c120926bf77765f, phone relationship menu 580045e2db34978901fac6840eb63f5ee5682463, reaction renderer 82b26a500925a514e5a991ca1fabbe59b23f9219
Files changed: src/reactionSystem.js, src/actions.js, src/appMenu.js, src/renderEntities.js, apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch: backup/phaser-migration-before-reaction-relationship-system-2026-07-09

Summary:
Added the first additive reaction and relationship layer so characters can show animated emotional reactions instead of only text or emoji bubbles.

Implementation details:

- Added `src/reactionSystem.js` with relationship normalization, vibe, beef, annoyance, privacy comfort, and recent reason fields.
- Added privacy scanning for shower, toilet, and intimacy style actions when another person enters the same room.
- Added noise annoyance scanning for TV, music, stereo, treadmill, heavy bag, game, console, and arcade activity near tired or sleeping people.
- Added relationship adjustments when a character reacts to privacy intrusion or noise.
- Added speech style reaction bursts for more assertive reactions and thought bubble style reactions for timid or softer reactions.
- Added special softer privacy behavior between Resident and Girlfriend when vibe is not hostile.
- Added animated comic reaction bubbles in `renderEntities.js`, including jagged cuss burst and thought cloud versions with pulsing symbol motion.
- Added a phone Relationships menu that lists Vibing and Beefing entries with vibe, beef, annoyance, and recent reason.
- Hooked reaction updates into the existing `updateActions` tick so this layer sits on top of current actions, movement, jobs, and autonomy.

Testing performed:
Code inspection only through GitHub file review. Confirmed the renderer imports were not changed and the reaction tick is imported in `actions.js`. No local or Render browser test performed in this chat.

Testing requested:
After main is updated for Render testing, open https://apartment-god-phaser.onrender.com. Test boot, Cell > Relationships, one character showering while another enters the bathroom, someone sleeping while another uses TV or music nearby, and check whether animated burst or thought bubbles appear without breaking movement or actions.

Known risks:
This touches renderEntities and actions tick, so browser boot must be verified. Privacy detection depends on current room boxes, so bathroom reactions may need tuning if rooms are too broad or too narrow. Noise reactions are intentionally light but may need rate limiting if they feel spammy.

Follow ups:
Add more personality traits, explicit apology actions, relationship driven command resistance, dog loyalty, favorite object irritation, relationship history cards, and non symbol custom emotional animation sets.

---

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

---

## 2026-07-11 04:55 AM CT, Development Matrix Required Reading Sync

Status: IMPLEMENTED
Branch: phaser-migration
Commit: matrix creation c4f79a042bbf29a2c71a524b25fc91b2e43bb24f, handbook sync 3e8e04946b1f080fcf3e2bec1593cedfe9ec4db8, log sync 586e7da40cdef4c2de60a4220e089ce06e741a06
Files changed:
apartment-god-production/DEVELOPMENT_MATRIX.md
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: no
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-development-matrix-2026-07-11

Summary:
Added and synchronized the Apartment God development matrix as a required production control document.

Implementation details:
The matrix tracks system status, object interactions, animation needs, test scenarios, branch and Render rules, and risk areas. The handbook and ongoing log now point future agents to the matrix during required preflight reading.

Testing performed:
Documentation only. Verified file references and required reading lists.

Testing requested:
None for runtime. Future development runs should use the matrix before touching gameplay systems.

Known risks:
The matrix must be kept honest and current. If future agents update features without updating the matrix, it can drift from the real game state.

Follow ups:
During the next real gameplay review, compare src/world.js, src/config.js, src/actions.js, src/autonomy.js, src/movement.js, src/vehicleSystem.js, src/saveSystem.js, src/appMenu.js, and render files against the matrix and fill in missing objects, actions, animations, and tests.

---

## 2026-07-11 05:10 AM CT, Studio Documentation Hygiene Check

Status: IMPLEMENTED
Branch: phaser-migration
Commit: matrix refresh 95727e6cd2b63b7c930dca433046e4da72239b2e, sidecar removal 68e39fcf3e5a0c797e3878222d58f03d9cd8a27c, log sync current commit
Files changed:
apartment-god-production/DEVELOPMENT_MATRIX.md
apartment-god-production/ONGOING_DESIGN_LOG.md
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-10_VEHICLE_CLOTHING_WORLD_POLISH.md
Runtime files changed: no
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-development-matrix-2026-07-11

Summary:
Consolidated the studio documentation trail so required reading, the matrix, and the ongoing log agree with the current branch state.

Implementation details:
The July 10 vehicle, clothing, world polish append file was merged into the canonical ongoing design log. The sidecar append file was removed after consolidation. The development matrix was refreshed to track the July 10 work, including vehicle travel, wardrobe, towel state, shower overlay containment, pool and dining placement, and dog soccer ball behavior.

Testing performed:
Documentation only. Verified the repo, `phaser-migration` file access, matrix file presence, backup branch file access, required reading headers, the July 10 sidecar entry, and the current backup to branch diff.

Testing requested:
None for runtime from this documentation sync. The July 10 polish pass still needs browser testing before it can be trusted.

Known risks:
The branch contains runtime work after the development matrix backup point. This run did not modify runtime code, but the July 10 runtime polish work still needs mobile browser testing and should not be called complete.

Follow ups:
Use the matrix before the next gameplay run. Test the July 10 vehicle, clothing, world polish pass on mobile, then update the ongoing log and matrix with real browser results.

---

## 2026-07-11 05:25 AM CT, Top Down Visual Production Law Added

Status: IMPLEMENTED
Branch: phaser-migration
Commit: matrix law 600cb8c167068d997671f97ee89b4d5adfef0b4d, reference README 474a45cfbf50fb1f82859f532231ac49b5bb9852, reference index f8c6e2330f70dc21a66bdeb1cc7a84af832b64d6, log sync current commit
Files changed:
apartment-god-production/DEVELOPMENT_MATRIX.md
apartment-god-production/reference/README.md
apartment-god-production/reference/external-reference-index.md
apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: no
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-development-matrix-2026-07-11

Summary:
Added a hard visual production law to the development matrix so future agents cannot treat Apartment God visuals as memory only, symbolic, crude, childish, side view contaminated, or good enough procedural guesswork.

Implementation details:
The matrix now defines true top down 2D production as a critical law. It defines crude design, childish design, top down anatomy, vehicle top down rules, car door and boarding expectations, bicycle and motorbike mounted rider expectations, ATV construction, dog soccer UI containment, reference based visual workflow, and a visual work preflight checklist. It also marks vehicles, dog soccer, camera snapping, dining placement, and vehicle top down compliance as needing correction.

A visual reference archive folder was added under `apartment-god-production/reference/`. The archive README explains that reference material is study material, not runtime assets. The external reference index records Character Creator 2D, Modern by SmallScaleInt as an aesthetic and production reference for top down or angled top down 2D character quality, modular clothing, controllable outline, 8 direction animation discipline, vehicle and bike support, and adjustable animation frame rate.

Testing performed:
Documentation only. Verified the matrix was the right enforcement point because all future agents already read it during required preflight. No runtime files were changed and no browser test was needed.

Testing requested:
None for this documentation update. Future visual passes must use the matrix visual law and reference archive before implementation.

Known risks:
This does not fix the current runtime visual bugs by itself. It prevents the process failure from repeating, but the existing vehicle art, dog soccer UI behavior, camera snap, vehicle loop, bike rider pose, and dining placement still need a separate runtime correction pass.

Follow ups:
Run a focused runtime correction pass that moves the dining table down and right, removes or corrects side view vehicle wheel logic, restores or improves the older car readability, adds real vehicle boarding and exiting states, adds mounted bike and motorbike rider poses, hides dog soccer mini game UI, fixes camera snapping, and fixes parked vehicle redraw during departure.

---

## 2026-07-11 06:05 AM CT, Visual Runtime Correction First Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: dining 319689a42fa2e67a30019839306a6d0eb81a046c, active vehicle hiding 4258883caf77fa5cb127b3e83d2904949233c4fe, parked vehicle overlays fc3b9106775f5b27f80e3590d8d32ef601db1289, active vehicle rendering 7dedf59ba70fb064d6b327b0348931bb319afeb1, dog soccer containment 52ec2f88912dae1603c5f3ee20aec52f745bead1, duplicate vehicle guard 97cb36cdbaebb50e24e3e6a1693eea44ea170690, action guard fa4b2bc7410c2b9d7090030b1e7575c33fc94740, matrix sync 2127b825744e90630fffb0c7d1167fa4bad40cad, log sync current commit
Files changed:
src/world.js
src/renderObjects.js
src/objectCorrectiveOverlays.js
src/renderDynamic.js
src/soccerSystem.js
src/vehicleSystem.js
src/actions.js
apartment-god-production/DEVELOPMENT_MATRIX.md
apartment-god-production/ONGOING_DESIGN_LOG.md
Runtime files changed: yes
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-visual-runtime-correction-2026-07-11

Summary:
Performed the first focused runtime correction pass for Kam's mobile review notes. The pass addressed dining table placement, top down vehicle contamination, active vehicle redraw conflicts, dog soccer UI containment, dog soccer camera behavior, vehicle duplicate trip guarding, and the action layer's handling of refused vehicle departures.

Implementation details:

- Moved the dining table down and slightly right so it is less crowded against kitchen fixtures.
- Changed active vehicle hiding so parked cars, bicycles, motorbikes, and ATVs are all hidden while they are the active travel vehicle, preventing the parked object from redrawing over an active departure or return.
- Reworked parked garage vehicle corrective overlays to remove obvious side view wheel contamination and toy wheel dot logic.
- Reworked active vehicle rendering to use the same top down rules, including car door panels during open phases and mounted rider silhouettes for bike, motorbike, and ATV travel phases.
- Removed the dog soccer play label overlay so dog ball play stays ambient in the world instead of looking like a visible mini game screen.
- Slowed dog soccer chase behavior and removed repeated bark spam during the dog chase loop.
- Changed dog soccer camera behavior so the camera only moves to the soccer field when the dog is the selected actor.
- Added a duplicate vehicle trip guard so another vehicle departure cannot begin while a departure, return, or vehicle in use state is active.
- Updated `startOffsite` so a refused vehicle departure returns false and does not fake a door open or leaving log.
- Updated the development matrix so affected systems are marked NEEDS_TESTING instead of pretending browser approval has happened.

Testing performed:
GitHub code inspection only. Verified the committed source references for dining placement, active vehicle hiding, top down vehicle render changes, dog soccer containment, duplicate vehicle guard, and action level guard behavior. No local npm build, no browser test, and no Render test were performed in this chat.

Testing requested:
Do not call this complete until it is tested in browser. On a browser build of `phaser-migration`, test boot, reset, main floor dining table placement and pathing, garage parked vehicle appearance, vehicle departure and return with the SUV and red convertible, bicycle and motorbike travel with mounted rider visible, no parked vehicle redraw during active departure, no duplicate departure loop, car door open and close phases, dog soccer with no overlay or scoreboard, no camera hijack during dog soccer unless the dog is selected, and no recurring room snap after several minutes of idle play.

Known risks:
This touches render objects, corrective overlays, dynamic rendering, vehicle state, action routing, soccer runtime, and world placement. Browser boot must be verified. Vehicle visuals are still procedural fallback and should eventually be replaced by approved top down sprites or image assets. The camera snap issue may have had more than one cause; this pass removed the dog soccer camera hijack path but still needs live confirmation.

Follow ups:
If this pass behaves correctly in browser, mirror to `main` only when Kam explicitly wants Render testing. Then continue with proper reference backed vehicle sprites, deeper boarding and exiting animation states, final mounted rider poses, and a larger visual asset pipeline pass.

---

## 2026-07-13, True Top Down Anime Visual Foundation And Garage Pass 01

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-anime-visual-overhaul-2026-07-13
Runtime files changed: yes
Render playable branch updated: no
Render settings changed: no

Summary:
Reviewed current visual rules, recent project context, the active renderer, sprite manifests, prior generated branches, and recovered visual artifacts. Added a stricter anime visual standard and integrated the first three assets that passed review: a painterly garage floor, a closed family SUV, and a closed sports convertible.

Implementation details:

- Added a strict overhead anime visual standard with upright-object checks, adult anatomy rules, no heavy-outline direction, painterly environment guidance, anime timing guidance, and a long-term modular 2D sprite pipeline for characters and animals.
- Generated and inspected multiple Photoshop assets.
- Rejected human attempts because they retained front-facing face and torso construction.
- Rejected the dog attempt because it read as lying on its back instead of standing from above.
- Added a browser-safe image cache. A missing or failed image leaves the current renderer active.
- Added the approved painterly garage floor as an underlay inside the existing room boundary.
- Added approved PNG rendering for the closed SUV and convertible, including object-facing rotation.
- Kept current door and trunk render states as fallbacks until matching production frames pass review.
- Updated the static build so `assets/` ships with `dist/` and `Dist/`.
- Added production manifest records, checksums, rejection reasons, and deferred categories.

Testing performed:

- `npm run check` passed, 64 source files and sprite schema.
- `npm run assets:validate` passed, including all three production files.
- `npm test` passed, 3 unit tests.
- `npm run build` passed and copied `assets/` into both static output directories.
- Focused lint on the changed JavaScript files passed.
- Full repo lint still fails on three pre-existing empty catch blocks in `src/calendarSkipSystem.js` and `src/canvasRuntime.js`, plus existing warnings.
- Playwright browser smoke could not start because the environment has no browser binary. The browser download endpoint returned an invalid empty archive. No Render test was run.

Known limits:
This is a garage vertical slice, not an across-the-game conversion. Bikes, motorbike, ATV, characters, dog, objects, other rooms, activity-specific animation, and open vehicle frames remain on safe fallbacks. The existing Canvas runtime remains active while the production 2D sprite foundation is designed and proven.

Exact next step:
Run local checks and browser review of the garage. If it passes, create one complete true top down 2D sprite proof for an adult human and one for the dog before any broad character replacement.

Correction recorded 2026-07-13: Apartment God and Top Shot are separate projects. Apartment God is the true top down 2D sprite game. Top Shot is the hybrid game with highly rigged 3D models and intentional 2D presentation elements. Do not mix their model, rig, renderer, asset, or animation pipeline instructions, and do not weaken Top Shot's 2D rules.

Repository audit follow up: the project mix-up was enabled by Top Shot active, development, diagnostic, and backup branches being hosted inside `Kalomika/apartment-god-prototype`. Added a root `AGENTS.md` boundary rule and `docs/APARTMENT_GOD_TOP_SHOT_REPOSITORY_SEPARATION.md`. Top Shot remains a hybrid pipeline with highly rigged 3D models, intentional 2D effects, painterly 2D backgrounds, outline-free color and lighting separation, and anime timing. No Top Shot rule was removed or weakened. No branch was moved, rewritten, or deleted. Safe separation is blocked only on confirmation of the destination Top Shot repository and explicit migration authorization.

---

## 2026-07-13, Main Browser Testing Publication Correction

Status: DEPLOYED_NEEDS_VISUAL_REVIEW
Source branch: phaser-migration
Playable branch: main
Release source commit: f39079b63e8965306b43725006ee4c4364d6e1b3
Main backup: backup/main-before-anime-visual-test-update-2026-07-13
Render settings changed: no

Kam corrected the handoff rule: a completed pass must be available through the playable link so it can actually be tested. Confirmed `main` was the direct ancestor of `phaser-migration`, created the required backup, reran tests and build, then safely fast-forwarded `main` without force.

Checks passed:

- `npm test`, 3 tests.
- `npm run check`, 64 source files and sprite schema.
- `npm run assets:validate`, 13 sprite specifications and all production files.
- `npm run build`, both static output directories.
- Live page HTTP 200.
- Live environment and vehicle source imports present.
- Live SUV SHA-256 matched `d1591c2f61174c71ed3c392dac15fdc5d82d1491d7e06ee6df644dbf19dcdc44`.
- Live convertible SHA-256 matched `eff3c81dad2fb33980ca8552b607f893e0fcfe5da4bd8b6499d05200ee7da503`.
- Live garage floor SHA-256 matched `396ac75281602727d00284209ec73ad4bfc963425f25889211145812611b5362`.

Playable test link:

`https://apartment-god-prototype.onrender.com/?v=f39079b6`

Kam should inspect the garage floor, closed SUV, closed convertible, facing direction, collision and click alignment, door and trunk fallback states, vehicle departure and return, lighting, mobile readability, and frame rate. Browser visual approval remains required.
