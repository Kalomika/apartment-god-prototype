# Apartment God Ongoing Design Log

Purpose: dated work history for Apartment God. The handbook is the standing rulebook. This log is where every meaningful change, fix, plan, revert, blocker, and test note gets appended.

Required reading before work:

```txt
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
docs/APARTMENT_GOD_BACKUP_POLICY.md
apartment-god-production/ONGOING_DESIGN_LOG.md
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
Started the lived in activity pass so the house feels less like people are just walking around and more like time is passing through activities that occupy space and visually do something.

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
