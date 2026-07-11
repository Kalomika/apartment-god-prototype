# Apartment God Development Matrix

Last update: 2026-07-11 04:45 AM CT

Purpose: living production tracker for Apartment God. The handbook is the rulebook. The backup policy protects restore points. The ongoing log is the history. This matrix is the control board that tells future AIs what exists, what still needs testing, what is blocked, and what should not be overwritten.

Required use:

```txt
Before meaningful work, read:
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
docs/APARTMENT_GOD_BACKUP_POLICY.md
apartment-god-production/ONGOING_DESIGN_LOG.md
apartment-god-production/DEVELOPMENT_MATRIX.md
```

Do not use this file to pretend work is implemented. If something is only planned, mark it PLANNED. If it is committed but not browser tested, mark it NEEDS_TESTING. If it is verified only by code inspection, say so.

---

## Status Values

```txt
IMPLEMENTED       Built and tested enough to trust in the stated environment.
NEEDS_TESTING     Code or doc exists, but browser or Render behavior still needs verification.
PARTIAL           Some slice exists, but the system is incomplete or uneven.
PLANNED           Design intent only, not implemented.
BLOCKED           Cannot proceed safely until a blocker is cleared.
REVERTED          Was removed or rolled back, with reason in the log.
```

---

## 1. System Matrix

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Repo rules and branch discipline | IMPLEMENTED | Handbook, Backup Policy | `phaser-migration` is the working branch. `main` is Render playable only when Kam explicitly wants it updated. | Confirm before every code change. |
| Backup policy | IMPLEMENTED | `docs/APARTMENT_GOD_BACKUP_POLICY.md` | Major overhauls need backup branches first. Keep milestone backups protected. | Confirm backup exists before risky systems. |
| Ongoing log | IMPLEMENTED | `apartment-god-production/ONGOING_DESIGN_LOG.md` | Every meaningful change needs a dated entry. | Append after each meaningful change. |
| Development matrix | IMPLEMENTED | This file | Tracks systems, objects, animations, tests, branches, and risks. | Keep updated after every system level change. |
| Autonomy | NEEDS_TESTING | `src/autonomy.js`, ongoing log | First intelligence upgrade exists. Actors should use needs, fallback objects, activity variety, and smarter choices. | Render test reset, idle autonomy, bathroom fallback, shower fallback, hunger fallback, fun variety, dog choices. |
| Movement and pathfinding | NEEDS_TESTING | `src/movement.js`, ongoing log | Route candidate and blocked recovery improvements exist. | Test object approach, alternate routes, blocker recovery, stairs, garage ATV area. |
| Mobile phone and menus | PARTIAL | `styles.css`, `src/appMenu.js`, `src/ui.js`, phone files | Handbook requires scrollable phone tabs and menus. Some newer menus exist. | Test every tab on mobile screen sizes. |
| Gameplay playable while someone leaves | NEEDS_TESTING | `src/travelLocations.js`, vehicle and state files | Required rule exists. Career system uses offsite work. | Test one actor leaves while another remains home, selection swap, small offsite indicator. |
| Vehicles | NEEDS_TESTING | `src/vehicleSystem.js`, travel files | Vehicle behavior must remain visible and logical. | Test vehicle departure, return, garage parking, no pop in or pop out. |
| Save and reset | NEEDS_TESTING | `src/saveSystem.js`, `src/state.js` | Reset and stale save protection are critical. New systems may need normalization. | Test reset after career and relationship state exist. |
| Upstairs visual renderer | NEEDS_TESTING | `src/renderHouseStyle.js`, ongoing log | Cyberpunk upstairs visual pass exists. | Test upstairs rooms, click targets, windows, stairs. |
| Lived in activity object pass | NEEDS_TESTING | `src/world.js`, `src/config.js`, `src/renderObjects.js` | Bookshelf, coffee maker, dining table, and object animation overlays were added. | Test object presence after reset, click menus, no path blocking. |
| Secret Lab East | NEEDS_TESTING | `src/world.js`, `src/state.js`, `src/cameraNavigation.js` | Isolated sprite test lab exists with lab button and star button. | Test boot, lab navigation, swipe return, blueprint exclusion, locator behavior. |
| Career system | NEEDS_TESTING | `src/careerSystem.js`, `src/appMenu.js`, `src/ui.js`, autonomy and travel files | First playable job slice exists with tracks, pay, XP, schedules, phone menu, HUD. | Test Career / Work menu, apply, work now, pay, XP, promotion, vehicle travel. |
| Reaction and relationship system | NEEDS_TESTING | `src/reactionSystem.js`, `src/actions.js`, `src/appMenu.js`, `src/renderEntities.js` | First additive relationship layer exists with privacy and noise reactions. | Test relationships phone menu, bathroom privacy, sleep noise, bubble rendering. |
| Sprite replacement pipeline | PLANNED | `assets/sprite_replacement_queue/`, `assets/manifests/` | Needed for true top down visual quality. | Create asset manifest before broad sprite replacement. |
| Phaser renderer deepening | PLANNED | Phaser migration branch | Future target, but playable clone comes first. | Do not deepen before `phaser-migration` is stable enough to replace `main`. |

---

## 2. Object Interaction Matrix

Use this format for every game object that supports, blocks, animates, or visually represents an activity.

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Bed | Bedroom | NEEDS_TESTING | Sleep, rest, cuddle future | Human | Sleep pose, blanket state, shared sleep state | Time acceleration, relationship, blocked approach | Test reset and bedtime. |
| Toilet | Bathrooms | NEEDS_TESTING | Use bathroom | Human | Occupied state, privacy state | Autonomy fallback and privacy reaction | Test downstairs and upstairs fallback. |
| Shower | Bathrooms | NEEDS_TESTING | Shower, freshness | Human | Showering state, steam, privacy state | Privacy reaction and mobile click target | Test someone entering bathroom. |
| Fridge | Kitchen | NEEDS_TESTING | Snack, meal support | Human | Door open, food prep cue | Hunger fallback | Test hunger autonomy. |
| Stove | Kitchen | NEEDS_TESTING | Cook meal | Human | Cooking state, pan or burner cue | Fire or blocked path future | Test guided and autonomous meal. |
| Sink | Kitchen and bath | NEEDS_TESTING | Grooming, hygiene fallback | Human | Hand wash or grooming cue | Backup freshness route | Test when shower unavailable. |
| Couch | Living or basement | NEEDS_TESTING | Rest, TV, cuddle, social | Human | Seated pose, shared pose | Approach points and social overlap | Test multiple approach points. |
| TV | Living room | NEEDS_TESTING | Watch TV, movie future | Human | Screen glow, noise source | Noise annoyance, duration | Test nearby sleeper reaction. |
| Desk or laptop desk | Office or lab | NEEDS_TESTING | Work, computer, future remote work | Human | Seated work pose, screen glow | Career remote work future | Test click and activity start. |
| Dog bowl | House | NEEDS_TESTING | Eat or drink for dog | Dog | Bowl state | Dog autonomy loop | Test dog need behavior. |
| Dog kennel | House | NEEDS_TESTING | Rest, sleep for dog | Dog | Kennel occupied | Dog pathing | Test dog rest. |
| Bookshelf | Main floor | NEEDS_TESTING | Read | Human | Reading pose, book prop | New default object placement | Test after reset. |
| Coffee maker | Main floor | NEEDS_TESTING | Make coffee, drink coffee | Human | Brew light, carafe, steam | Coffee effects not final | Test after reset and action. |
| Dining table | Main floor | NEEDS_TESTING | Eat at table | Human | Plates, cups, seated eating | Placement may block movement | Test pathing around table. |
| Pool table | Basement or lab | NEEDS_TESTING | Play pool | Human | Rack, cue ball, active play | Object collision and animation | Test click and animation overlay. |
| Weight bench | Basement or lab | NEEDS_TESTING | Lift weights | Human | Bench, rack, barbell motion | Animation timing and approach | Test lift weights activity. |
| Heavy bag | Basement or lab | NEEDS_TESTING | Punch heavy bag | Human | Bag sway, impact arc | Noise reaction and pathing | Test action and nearby sleeper. |
| Console or arcade | Basement or lab | NEEDS_TESTING | Play game | Human | Glow pulse | Fun activity variety | Test fun autonomy. |
| Pool | Backyard | NEEDS_TESTING | Swim | Human | Wave motion, swim cue | Outdoor routing | Test backyard navigation and swim. |
| Soccer field | Backyard | PLANNED | Soccer activity | Human, dog future | Ball and movement loop | Needs object and animation definition | Add to full object audit. |
| Vehicle | Garage | NEEDS_TESTING | Leave, work travel, return | Human | Drive away, park, return | Playability when actor leaves | Test with one person home. |
| Secret Lab objects | Secret Lab East | NEEDS_TESTING | Lab test actions using existing kinds | Test Subject, Human future | Sprite test poses | Lab isolation and camera navigation | Test lab button and object menus. |

Add new objects here before or during implementation. If an object exists in `src/world.js` but not here, update this matrix.

---

## 3. Animation Matrix

This is the bridge between the current procedural Canvas fallback and the future high quality top down sprite system.

| Animation Or Pose | Current Status | Required Quality Target | Needed Directions | Frame Need | Current Fallback | Test Notes |
|---|---|---|---|---|---|---|
| Idle | PARTIAL | Adult top down, not chibi, not blob like | Up, down, left, right | Low frame count with breathing or subtle motion | Procedural actor drawing | Needed for all actors. |
| Walk | PARTIAL | True top down movement with weight | Up, down, left, right, diagonals if possible | Smooth but low enough for anime style timing | Procedural movement | Must not slide like pawns. |
| Sit | PLANNED | Object specific seated pose | Facing object direction | Short transition plus hold | Usually standing near object | Needed for couch, desk, table. |
| Sleep | PARTIAL | Bed aligned pose | Bed orientation | Entry, sleep loop, wake | Basic action state | Needs shared sleep and time acceleration test. |
| Shower | PARTIAL | Privacy readable without crude detail | Bathroom orientation | Loop plus steam | Action state and object cue | Must trigger privacy reactions safely. |
| Eat | PARTIAL | Table or standing snack variants | Object facing | Short loop | Dining table overlay | Needs hunger result verification. |
| Drink coffee | PARTIAL | Cup pickup, sip, boost cue | Counter or table facing | Short loop | Coffee maker steam | Needs stat effect pass. |
| Read | PARTIAL | Book held, seated or standing | Object facing | Loop | Bookshelf action | Needs intellect or focus consequence. |
| Watch TV | PARTIAL | Seated viewing | TV facing | Long loop | TV glow | Duration and noise reaction needed. |
| Play game | PARTIAL | Seated or standing controller pose | Screen facing | Loop | Console glow | Needs fun variety testing. |
| Lift weights | PARTIAL | Barbell movement | Bench orientation | Loop | Barbell overlay | Needs actor pose replacement. |
| Punch heavy bag | PARTIAL | Punch cycle and bag impact | Bag facing | Loop | Bag sway and impact arc | Needs noise reaction test. |
| Swim | PARTIAL | Top down swimming motion | Pool direction | Loop | Wave motion | Needs actor water pose. |
| Kiss | PARTIAL | Relationship pose | Facing partner | Short cycle | Social action state | Needs relationship consequence expansion. |
| Cuddle | PARTIAL | Shared couch or bed pose | Object dependent | Hold loop | Social action state | Needs object occupancy rules. |
| Argue or react | PARTIAL | Comic burst, body emotion | Facing source | Burst | Reaction bubbles | Needs non symbol custom emotional animation later. |
| Work shift departure | NEEDS_TESTING | Walk to vehicle, vehicle leaves | Route dependent | Transition | Travel system | Must preserve home playability. |
| Vehicle return | NEEDS_TESTING | Car returns, parks, actor enters home | Garage route | Transition | Vehicle system | Must not pop actors in. |

---

## 4. Test Matrix

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Boot safety | Critical | NEEDS_TESTING | Open Render or local build and confirm canvas does not blank. |
| Reset safety | Critical | NEEDS_TESTING | Reset, confirm default household and core objects exist. |
| Save load safety | Critical | NEEDS_TESTING | Load existing save with missing newer fields, confirm no blank screen. |
| Idle autonomy | High | NEEDS_TESTING | Let actors run without commands, confirm useful activities and no porch looping. |
| Guided override | High | NEEDS_TESTING | Send a command while autonomy is active, confirm it overrides immediately. |
| Bathroom fallback | High | NEEDS_TESTING | Occupy one bathroom, confirm alternate bathroom or sink fallback. |
| Hunger fallback | High | NEEDS_TESTING | Lower hunger, confirm fridge, stove, or eating route. |
| Sleep routine | High | NEEDS_TESTING | Advance to night, confirm sleep choices and no forced broken loop. |
| One actor leaves | Critical | NEEDS_TESTING | Send one actor to work, confirm remaining home actor stays playable. |
| Everyone leaves | High | NEEDS_TESTING | Send whole household away, confirm full offsite time lapse only then. |
| Vehicle trip | Critical | NEEDS_TESTING | Confirm vehicle drives away, returns, parks, and actor comes inside. |
| Mobile phone scroll | Critical | NEEDS_TESTING | On mobile, open every phone tab and confirm bottom controls stay reachable. |
| Interaction menu scroll | Critical | NEEDS_TESTING | On mobile, open object menus with many actions and confirm scrolling works. |
| Secret Lab navigation | Medium | NEEDS_TESTING | Use lab button, swipe return, star button, and locator. |
| Career phone menu | High | NEEDS_TESTING | Use Cell > Career / Work, apply, work now, pay, XP, promotion. |
| Relationship reaction | Medium | NEEDS_TESTING | Trigger shower privacy and sleep noise, confirm bubbles appear without spam. |
| Upstairs renderer | Medium | NEEDS_TESTING | Inspect upstairs objects, click targets, windows, stairs. |
| Object placement | High | NEEDS_TESTING | Confirm bookshelf, coffee maker, dining table do not block movement. |

When asking Kam to test through browser, include:

```txt
https://apartment-god-phaser.onrender.com
```

Also say exactly what to test. Do not say complete unless the thing was actually tested.

---

## 5. Branch And Render Matrix

| Branch Or Target | Role | Current Rule | Update Permission |
|---|---|---|---|
| `phaser-migration` | Active development branch | New work starts here. | Safe for normal development after required reading. |
| `main` | Render playable branch | Browser playable currently follows main. | Update only when Kam explicitly wants Render access updated. |
| Backup branches | Restore points | Create before major overhauls. | Do not delete milestone backups without Kam approval. |
| Render settings | Deployment configuration | Do not touch. | No changes unless Kam explicitly asks and environment allows it. |
| `Kalomika/ai-rpg-engine` | Protected separate repo | Never touch. | No permission. |

---

## 6. Risk Matrix

| Risk Area | Risk Level | Why It Is Dangerous | Required Protection |
|---|---|---|---|
| Save and reset | Critical | Can corrupt play state or blank the game. | Backup first, normalize old saves, test reset. |
| Movement and pathfinding | Critical | Can make actors freeze or objects unreachable. | Backup first, test core routes and blocked recovery. |
| Autonomy | Critical | Can fight player commands or spam bad actions. | Backup first, keep guided override strong. |
| Phone and menus | High | Can block mobile play or hide bottom controls. | Mobile scroll test required. |
| Vehicle and offsite travel | High | Can make household unplayable or pop actors. | Test one away, all away, return path. |
| Renderer changes | High | Can blank canvas or break click targets. | Keep fallback, test boot and clicks. |
| House layout | High | Can break routes, rooms, and object IDs. | Backup first, compare real source files. |
| Career system | Medium | Touches autonomy, phone, money, HUD, travel. | Test old save normalization and work shifts. |
| Relationship reactions | Medium | Can spam bubbles or interrupt actions. | Rate limit, test privacy and noise scenarios. |
| Sprite pipeline | Medium | Can make visuals worse if placeholders replace working art. | Add behind safe fallbacks, use asset manifest. |

---

## 7. Update Rule

After every meaningful change, update whichever rows are affected:

```txt
1. System Matrix
2. Object Interaction Matrix
3. Animation Matrix
4. Test Matrix
5. Branch And Render Matrix
6. Risk Matrix
```

Then append the normal dated entry to:

```txt
apartment-god-production/ONGOING_DESIGN_LOG.md
```

Never let the matrix drift into fantasy planning. It should show the real state of the game, even when the answer is ugly.
