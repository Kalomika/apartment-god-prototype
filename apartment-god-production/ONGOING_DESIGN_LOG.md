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
