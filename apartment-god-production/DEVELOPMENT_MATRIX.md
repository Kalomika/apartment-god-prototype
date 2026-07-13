# Apartment God Development Matrix

Last update: 2026-07-13

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
NEEDS_CORRECTION  Exists, but violates a stated design rule and must be corrected before approval.
REJECTED          Known bad direction. Do not repeat without Kam explicitly reversing the ruling.
```

---

## 1. System Matrix

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Repo rules and branch discipline | IMPLEMENTED | Handbook, Backup Policy | `phaser-migration` is the working branch. `main` is Render playable only when Kam explicitly wants it updated. | Confirm before every code change. |
| Backup policy | IMPLEMENTED | `docs/APARTMENT_GOD_BACKUP_POLICY.md` | Major overhauls need backup branches first. Keep milestone backups protected. | Confirm backup exists before risky systems. |
| Ongoing log | IMPLEMENTED | `apartment-god-production/ONGOING_DESIGN_LOG.md` | Every meaningful change needs a dated entry in the main log, not only a sidecar append file. | Append after each meaningful change. |
| Development matrix | IMPLEMENTED | This file | Tracks systems, objects, animations, tests, branches, risks, and visual law. | Keep updated after every system level change. |
| Top down visual production law | IMPLEMENTED | This matrix, Section 8, `docs/APARTMENT_GOD_TRUE_TOP_DOWN_ANIME_VISUAL_STANDARD.md` | Runtime presentation is strict overhead 2D. The new standard sets mature science fiction anime production design, painterly rooms, color and light separation, and a modular 2D sprite pipeline. Major visuals cannot be created from memory only or symbolic shortcuts. | Before visual work, inspect references and complete the top down compliance checklist. |
| Project separation, Apartment God versus Top Shot | PARTIAL | `AGENTS.md`, `docs/APARTMENT_GOD_TRUE_TOP_DOWN_ANIME_VISUAL_STANDARD.md`, `docs/APARTMENT_GOD_TOP_SHOT_REPOSITORY_SEPARATION.md` | Apartment God uses true top down 2D sprites. Top Shot uses a separate hybrid pipeline: highly rigged 3D models plus 2D effects, painterly 2D backgrounds, outline-free lighting and color separation, and anime timing. Its active and backup branches are still hosted inside this repository. Boundary rules and a safe migration plan now exist. | Kam confirms the destination Top Shot repository, then migrate and verify every branch and rule without deleting originals or simplifying Top Shot's pipeline. |
| Visual reference archive | IMPLEMENTED | `apartment-god-production/reference/` | Reference material is study material, not runtime material. Kam supplied references may be archived and studied for quality, construction, silhouette, animation, and camera rules. | Add reference notes or images before major visual passes when the category is under defined. |
| True top down character and animation quality law | IMPLEMENTED | This matrix, Section 10 | Character work must target mature true top down sprite integrity, not isometric units, bathroom sign people, blob people, mascot shapes, or generic procedural actor drawings. Activity animation must have its own identity and anime influenced timing discipline. | Before character or animation work, create or update the style bible, animation manifest, frame standards, activity inventory, and entry loop exit plan. |
| Autonomy | NEEDS_TESTING | `src/autonomy.js`, ongoing log | First intelligence upgrade exists. Actors should use needs, fallback objects, activity variety, and smarter choices. | Render test reset, idle autonomy, bathroom fallback, shower fallback, hunger fallback, fun variety, dog choices. |
| Movement and pathfinding | NEEDS_TESTING | `src/movement.js`, ongoing log | Route candidate and blocked recovery improvements exist. | Test object approach, alternate routes, blocker recovery, stairs, garage ATV area. |
| Mobile phone and menus | PARTIAL | `styles.css`, `src/appMenu.js`, `src/ui.js`, phone files | Handbook requires scrollable phone tabs and menus. Some newer menus exist. | Test every tab on mobile screen sizes. |
| Gameplay playable while someone leaves | NEEDS_TESTING | `src/travelLocations.js`, vehicle and state files | Required rule exists. Career and vehicle systems use offsite travel. | Test one actor leaves while another remains home, selection swap, small offsite indicator. |
| Vehicles and travel options | NEEDS_TESTING | `src/vehicleSystem.js`, `src/travelLocations.js`, `src/renderObjects.js`, `src/renderDynamic.js`, `src/vehicleSpriteRenderer.js`, overlays | Anime visual pass 01 adds production PNGs for the closed SUV and convertible. Facing is applied by runtime rotation. Missing assets and open door or trunk states retain the existing renderer. Bike, motorbike, ATV, and transition frames remain fallback art. | Browser test garage visuals, all vehicle menus, departure, open states, return, passenger limits, parked redraw, and duplicate trip prevention. |
| Save and reset | NEEDS_TESTING | `src/saveSystem.js`, `src/state.js` | Reset and stale save protection are critical. New wardrobe, career, and relationship systems may need normalization. | Test reset after career, relationship, wardrobe, vehicle, and soccer state exist. |
| Upstairs visual renderer | NEEDS_TESTING | `src/renderHouseStyle.js`, ongoing log | Cyberpunk upstairs visual pass exists. | Test upstairs rooms, click targets, windows, stairs. |
| Lived in activity object pass | NEEDS_TESTING | `src/world.js`, `src/config.js`, `src/renderObjects.js` | Bookshelf, coffee maker, dining table, and object animation overlays exist. Dining table was moved down and slightly right in the runtime correction pass. | Test dining table clearance, kitchen pathing, click menu, and eating route. |
| Wardrobe, clothing, and towels | NEEDS_TESTING | `src/world.js`, `src/state.js`, `src/actions.js`, `src/renderDynamic.js`, overlays | Bedroom closet, weekly outfit state, wardrobe color strips, carried towels, and shower area towel overlays exist as first pass systems. | Test closet menu, Change Clothes, day outfit display, shower towel, swim towel. |
| Shower privacy overlay containment | NEEDS_TESTING | `src/objectCorrectiveOverlays.js`, reaction and render files | Privacy blur should now appear only near an actual shower in the same room. | Test shower privacy in bathroom and confirm no garage blur. |
| Secret Lab East | NEEDS_TESTING | `src/world.js`, `src/state.js`, `src/cameraNavigation.js` | Isolated sprite test lab exists with lab button and star button. | Test boot, lab navigation, swipe return, blueprint exclusion, locator behavior. |
| Career system | NEEDS_TESTING | `src/careerSystem.js`, `src/appMenu.js`, `src/ui.js`, autonomy and travel files | First playable job slice exists with tracks, pay, XP, schedules, phone menu, HUD. | Test Career / Work menu, apply, work now, pay, XP, promotion, vehicle travel. |
| Reaction and relationship system | NEEDS_TESTING | `src/reactionSystem.js`, `src/actions.js`, `src/appMenu.js`, `src/renderEntities.js` | First additive relationship layer exists with privacy and noise reactions. | Test relationships phone menu, bathroom privacy, sleep noise, bubble rendering. |
| Dog soccer ball play | NEEDS_TESTING | `src/soccerSystem.js`, `src/autoHooks.js`, `src/actions.js` | Runtime correction pass removed dog play overlay, slowed frantic chase, removed repeated bark spam in dog chase loop, and only shifts camera to the field when the dog is the selected actor. | Test dog ball chase as ambient world behavior, no scoreboard, no overlay, no camera hijack, no boot crash. |
| Camera follow and room snapping | NEEDS_TESTING | `src/cameraNavigation.js`, `src/soccerSystem.js`, travel and auto hook files | Dog soccer no longer forces camera to backyard unless the dog is selected. Other possible snap causes still need live observation. | Let game run several minutes on mobile and confirm no unwanted room snap. |
| Sprite replacement pipeline | PARTIAL | `assets/sprite_replacement_queue/`, `assets/manifests/`, `src/animeVisualAssets.js` | Pass 01 has three approved production assets, checksums, a safe image loader, and fallbacks. Human and dog generations were rejected. Broad character replacement is not approved until the modular overhead 2D sprite pipeline passes review. | Browser review pass 01 at game scale, then build one complete overhead 2D sprite proof for one human and the dog. |
| Phaser renderer deepening | PLANNED | Phaser migration branch | Future target, but playable clone comes first. | Do not deepen before `phaser-migration` is stable enough to replace `main`. |

---

## 2. Object Interaction Matrix

Use this format for every game object that supports, blocks, animates, or visually represents an activity.

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Bed | Bedroom | NEEDS_TESTING | Sleep, rest, cuddle future | Human | Sleep pose, blanket state, shared sleep state | Time acceleration, relationship, blocked approach | Test reset and bedtime. |
| Toilet | Bathrooms | NEEDS_TESTING | Use bathroom | Human | Occupied state, privacy state | Autonomy fallback and privacy reaction | Test downstairs and upstairs fallback. |
| Shower | Bathrooms | NEEDS_TESTING | Shower, freshness | Human | Showering state, steam, privacy state, towel aftermath | Privacy reaction, blur containment, mobile click target | Test someone entering bathroom and no garage blur. |
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
| Dining table | Main floor | NEEDS_TESTING | Eat at table | Human | Plates, cups, seated eating | New placement must not block kitchen route | Moved down and slightly right. Test pathing around table. |
| Bedroom closet | Bedroom | NEEDS_TESTING | Change clothes, plan weekly outfits | Human | Closet open state, outfit visual marker | State normalization and UI action routing | Test closet menu and outfit day display. |
| Pool table | Basement or lab | NEEDS_TESTING | Play pool | Human | Rack, cue ball, active play | Object collision and animation | Test click and animation overlay. |
| Weight bench | Basement or lab | NEEDS_TESTING | Lift weights | Human | Bench, rack, barbell motion | Animation timing and approach | Test lift weights activity. |
| Heavy bag | Basement or lab | NEEDS_TESTING | Punch heavy bag | Human | Bag sway, impact arc | Noise reaction and pathing | Test action and nearby sleeper. |
| Console or arcade | Basement or lab | NEEDS_TESTING | Play game | Human | Glow pulse | Fun activity variety | Test fun autonomy. |
| Pool | Backyard | NEEDS_TESTING | Swim | Human | Larger pool, wave motion, swim cue, towel aftermath | Outdoor routing and towel state | Test backyard navigation, swim, towel carry. |
| Soccer field or ball | Backyard | NEEDS_TESTING | Soccer ball practice, dog ball play | Human, dog | Ball and chase loop only | Auto hook tick, no scoreboard, no mini game overlay | Dog overlay removed. Test ambient dog soccer. |
| Family SUV | Garage | NEEDS_TESTING | Work, errand, mall, movies, date travel | Human passengers, dog possible | Approved anime overhead PNG for closed state, existing renderer for door and trunk states or failed image load | PNG crop, facing rotation, and state switch need browser review | Test parked scale, facing, unlock, doors, trunk, departure, and return parking. |
| Sports convertible | Garage | NEEDS_TESTING | Work, errand, mall, movies, date travel | Human passengers | Approved anime overhead PNG for closed state, existing renderer for door and trunk states or failed image load | PNG crop, facing rotation, and state switch need browser review | Test parked scale, facing, unlock, doors, trunk, departure, and return parking. |
| Garage floor plate | Garage | NEEDS_TESTING | Environment underlay | All | Approved painterly industrial anime floor, clipped inside existing room walls | Must not cover click targets, walls, garage door, or actors | Test lights on and off, navigation, object readability, and mobile performance. |
| Bicycle | Garage | NEEDS_TESTING | Work, errand, mall, movies, date travel | Limited human travel, no dog | Top down frame, aligned front and rear wheels, seat, handlebars, mounted rider pose | Rider pose and travel visuals need browser review | Test menu, cost, speed, hygiene and energy effects, rider mounted on top. |
| Motorbike | Garage | NEEDS_TESTING | Work, errand, mall, movies, date travel | Limited human travel, no dog | Top down tires aligned front to back, seat, tank, handlebar, mounted rider pose | Rider pose and travel visuals need browser review | Test menu, cost, speed, hygiene and energy effects, rider mounted on top. |
| ATV | Garage | NEEDS_TESTING | Existing vehicle support | Human future | Real top down ATV body, seat, handlebars, attached tire masses | Still procedural fallback | Test garage readability and mounted rider placeholder. |
| Towel | Shower and pool aftermath | NEEDS_TESTING | Carried towel, shower area towel | Human | Towel icon and overlay | State cleanup and render overlap | Test after shower and swim. |
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
| Swim | PARTIAL | Top down swimming motion | Pool direction | Loop | Wave motion and towel aftermath | Needs actor water pose. |
| Change clothes | NEEDS_TESTING | Closet specific outfit change | Closet facing | Short transition | Wardrobe color strip update | Test weekly outfit display. |
| Carry towel | NEEDS_TESTING | Temporary post shower or swim prop | Actor direction | Short hold state | Towel icon overlay | Test towel clears or persists correctly. |
| Kiss | PARTIAL | Relationship pose | Facing partner | Short cycle | Social action state | Needs relationship consequence expansion. |
| Cuddle | PARTIAL | Shared couch or bed pose | Object dependent | Hold loop | Social action state | Needs object occupancy rules. |
| Argue or react | PARTIAL | Comic burst, body emotion | Facing source | Burst | Reaction bubbles | Needs non symbol custom emotional animation later. |
| Dog soccer chase | NEEDS_TESTING | Dog ball chasing without scoreboard, mini game overlay, or frantic arcade behavior | Yard direction | Loop | Slower dog soccer system ball chase | Test no scoring UI, no game screen, no unwanted camera snap. |
| Work shift departure | NEEDS_TESTING | Walk to vehicle, vehicle leaves | Route dependent | Transition | Travel system | Must preserve home playability. |
| Vehicle unlock and lock | NEEDS_TESTING | Remote unlock, board, lock, garage exit | Garage route | Transition | Existing garage sequence | Test timing and no ugly door lines. |
| Vehicle door open and close | NEEDS_TESTING | Character walks to door, unlock cue, door opens, character enters, door closes | Vehicle side based on parking and camera | Short transition | Door panels now render when car is open | Test visibility and timing in browser. |
| Bicycle or motorbike mounting | NEEDS_TESTING | Actor mounts on top, hands align to handlebars, body aligns to seat and frame | Bike direction | Short transition plus riding loop | Mounted rider silhouette added during active travel phases | Test rider reads as mounted, not swallowed. |
| Vehicle return | NEEDS_TESTING | Car returns, parks, actor exits, door closes, actor walks inside | Garage route | Transition | Vehicle system | Must not pop actors in. |

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
| Vehicle trip | Critical | NEEDS_TESTING | Confirm vehicle does not pop, duplicate, redraw parked after departure, or loop departure. Confirm active vehicle and parked vehicle states do not fight. |
| Vehicle top down compliance | Critical | NEEDS_TESTING | Inspect SUV, convertible, bicycle, motorbike, and ATV against Section 8. Confirm side view wheels, black side boxes, toy proportions, symbolic wheel dots, and actor disappearing into bike are gone. |
| Anime visual pass 01 | Critical | NEEDS_TESTING | Open local build on garage floor. Confirm floor plate loads, closed SUV and convertible use PNG art, front direction follows `facing`, open door and trunk states fall back without a blank frame, missing image requests do not crash, and click areas still match objects. |
| Vehicle clothing world polish | Critical | NEEDS_TESTING | On mobile, test boot, garage vehicle appearance, vehicle departure and return, bicycle menu destination options, bicycle trip cost and hygiene effect, offsite time speed when Girlfriend leaves without Resident, shower privacy overlay only inside bathroom, pool size, dining table position, closet menu, Change Clothes, towel after shower or swim, and dog soccer ball play without scoreboard. |
| Dining table placement | High | NEEDS_TESTING | Confirm dining table has moved down and slightly right from prior screenshot, with kitchen clearance and pathing. |
| Dog soccer UI containment | Critical | NEEDS_TESTING | Dog soccer must show ambient world chase only. No scoreboard, mini game overlay, invisible menu, camera hijack, or player facing game screen unless Kam explicitly enters a future mode. |
| Camera snap stability | Critical | NEEDS_TESTING | Let the game run for several minutes on mobile. Confirm the camera does not snap or shift rooms without player input, selected actor travel, or explicit navigation. |
| Mobile phone scroll | Critical | NEEDS_TESTING | On mobile, open every phone tab and confirm bottom controls stay reachable. |
| Interaction menu scroll | Critical | NEEDS_TESTING | On mobile, open object menus with many actions and confirm scrolling works. |
| Secret Lab navigation | Medium | NEEDS_TESTING | Use lab button, swipe return, star button, and locator. |
| Career phone menu | High | NEEDS_TESTING | Use Cell > Career / Work, apply, work now, pay, XP, promotion. |
| Relationship reaction | Medium | NEEDS_TESTING | Trigger shower privacy and sleep noise, confirm bubbles appear without spam. |
| Upstairs renderer | Medium | NEEDS_TESTING | Inspect upstairs objects, click targets, windows, stairs. |
| Object placement | High | NEEDS_TESTING | Confirm bookshelf, coffee maker, dining table, closet, and pool edits do not block movement. |
| Visual reference use | Critical | NEEDS_TESTING | Before any major visual change, confirm the AI inspected Section 8, the reference archive, current screenshots, and relevant approved or rejected examples. |
| Character sprite integrity | Critical | NEEDS_TESTING | Before replacing actor visuals, inspect Section 10. Confirm characters are true top down, mature, readable, not toilet door silhouettes, not blob people, and not isometric units. |
| Activity animation identity | Critical | NEEDS_TESTING | For every newly upgraded activity, confirm the action has its own pose logic, timing, entry, loop, exit plan where feasible, object alignment, and fallback behavior. |

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
| `main` | Render playable branch | Fast-forwarded to the tested anime garage pass on 2026-07-13. `main` and `phaser-migration` point to the same release commit. | Update after successful checks when Kam needs each completed pass available for browser testing. Back up current `main` first and provide the verified cache-busted link. |
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
| Vehicle and offsite travel | High | Can make household unplayable or pop actors. | Test one away, all away, return path, active vehicle hiding, duplicate guard. |
| Top down visual law | Critical | If ignored, the game becomes symbolic, toy like, side view contaminated, or crude even when features technically work. | Reference first, top down anatomy checklist, visual review before commit. |
| Visual reference discipline | Critical | Memory only asset creation causes winging it and inconsistent quality. | Inspect reference archive and current screenshots before visual work. |
| True top down character animation quality | Critical | If ignored, the cast becomes toilet door icons, blob people, isometric units, mascot stickers, or reused generic poses even if the feature technically works. | Section 10 first, style bible first, animation inventory first, activity specific entry loop exit planning, manifest based sprite pipeline. |
| Wardrobe and towel state | High | Can create stale actor overlays or broken state after shower, swim, reset, or day change. | Normalize state and test shower, swim, change clothes, reset. |
| Renderer changes | High | Can blank canvas or break click targets. | Keep fallback, test boot and clicks. |
| House layout | High | Can break routes, rooms, and object IDs. | Backup first, compare real source files. |
| Career system | Medium | Touches autonomy, phone, money, HUD, travel. | Test old save normalization and work shifts. |
| Relationship reactions | Medium | Can spam bubbles or interrupt actions. | Rate limit, test privacy and noise scenarios. |
| Dog soccer and auto hooks | Medium | Runtime tick hooks can crash, run too often, expose UI, or hijack camera if not guarded. | Test ambient dog ball play, no UI, no camera snap, and boot safety. |
| Sprite pipeline | Medium | Can make visuals worse if placeholders replace working art. | Add behind safe fallbacks, use asset manifest, validate checksums, and reject bad camera angles before runtime integration. |

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
7. Top Down Visual Production Law
8. Visual Reference Archive Rule
9. True Top Down Character And Animation Quality Law
```

Then append the normal dated entry to:

```txt
apartment-god-production/ONGOING_DESIGN_LOG.md
```

Never let the matrix drift into fantasy planning. It should show the real state of the game, even when the answer is ugly.

---

## 8. Top Down Visual Production Law

Apartment God is a true top down 2D game. This is a critical production law, not a suggestion.

All visual work must obey top down construction, reference based design, and production review before commit.

No important visual asset may be built from memory alone. Memory can help interpret references, but it cannot replace references.

Every object, vehicle, character pose, animation, prop, room object, world marker, and activity state must be checked for:

```txt
1. top down anatomy,
2. camera correct construction,
3. scale,
4. material logic,
5. layered structure,
6. animation state logic,
7. mobile readability,
8. crude design contamination,
9. childish design contamination,
10. side view contamination,
11. reference support.
```

No winging it.
No symbolic shortcuts.
No side view logic inside top down assets.
No side view wheels in top down vehicles.
No toy logic.
No emoji logic.
No placeholder logic on major visuals.
No good enough procedural guesswork for major visuals.
No label dependent design where the object only reads because text says what it is.

The target is mature, disciplined, high quality top down 2D production. Think of how a serious top down 2D version of a high end stealth, tactical, survival, or anime inspired world would be constructed. The game should not feel like generic casual mobile toy art, debug art, emoji art, or programmer art.

### What Crude Means

A visual is crude if any of these are true:

```txt
1. It is only a rectangle, circle, blob, line, or label pretending to be a finished object.
2. It communicates category but not believable construction.
3. It uses side view parts inside a top down game.
4. It has no material logic.
5. It has no layered structure.
6. It has no believable footprint.
7. It ignores what would actually be visible from above.
8. It looks like debug art, programmer art, emoji art, toy art, or placeholder art.
9. It relies on text labels because the shape does not read.
10. It pops or swaps states without visible cause when animation should exist.
11. It is too generic to tell what type of object it is without explanation.
12. It ignores scale relationships with nearby objects and actors.
```

### What Childish Means

A visual is childish if any of these are true:

```txt
1. It uses oversized toy proportions by accident.
2. It uses oversized heads, wheels, buttons, or props without an intentional style reason.
3. It uses blob shapes instead of constructed anatomy.
4. It uses sideways wheels, icon doors, emoji symbols, or cartoon shorthand.
5. It uses bright simple colors without material, light, structure, or restraint.
6. It looks like a board game piece instead of a believable top down object.
7. It looks cute because it is under built, not because the style intentionally supports cuteness.
8. Characters read as mascots, toddlers, plush toys, generic stickers, or mobile icons.
9. Effects feel like stickers pasted on top of the world instead of integrated world animation.
10. Vehicles or furniture look like toy drawings instead of designed objects viewed from above.
```

### Top Down Anatomy Requirement

For every major visual, the AI must understand the object as a vertical stack:

```txt
1. Ground contact footprint.
2. Lowest visible base.
3. Main body mass.
4. Upper surfaces.
5. Surface details visible from above.
6. Small protrusions visible from above.
7. Shadow or contact logic.
8. Animation states.
```

If the AI cannot explain the top down anatomy, it is not ready to draw or code the object.

### Vehicle Top Down Law

Cars:

```txt
1. Do not draw large side wheels.
2. Do not draw black wheel boxes sticking out of the sides.
3. Do not draw toy wheel dots as a substitute for real construction.
4. From true top down, roof, hood, trunk, windshield, rear glass, body silhouette, mirrors, lights, and subtle tire hints matter most.
5. Side mirrors may appear as small lateral protrusions.
6. Headlights and tail lights should read as thin front or rear edge details.
7. Doors only appear open during a door animation state.
8. Boarding must show approach, unlock cue, door open, character enter, door close, then departure.
9. Exiting must show vehicle park, door open, character exit, door close, then character walk inside.
10. Parked vehicle and moving vehicle must be one coherent vehicle state, not two drawings fighting each other.
```

Bicycles and motorbikes:

```txt
1. Wheels align front to back from top down.
2. Do not draw side profile wheel circles.
3. Rider mounts on top.
4. Hands align to handlebars.
5. Body aligns to seat and frame.
6. Actor must never disappear into the bike body.
7. The ride pose must read as mounted, not swallowed by the vehicle.
```

ATV:

```txt
1. Four tires can be visible, but only as top down tire masses attached to a real ATV body.
2. No random corner dots.
3. No abstract black blocks pretending to be wheels.
4. Seat, handlebars, front mass, rear mass, and tire placement must read from above.
```

### Dog Soccer Law

Dog soccer is ambient world behavior unless Kam explicitly asks for a future playable dog mode.

```txt
1. No scoreboard.
2. No mini game overlay.
3. No invisible menu layer visible on the game screen.
4. No camera hijack.
5. No frantic arcade behavior unless intentionally designed.
6. Dog chases the ball, reacts, and plays in the world.
7. The dog does not care about points.
```

### Reference Based Visual Rule

References are allowed and expected.

References may include:

```txt
1. Kam supplied screenshots.
2. Kam supplied website images.
3. Kam supplied game screenshots.
4. External visual targets linked by Kam.
5. Prior approved Apartment God screenshots.
6. Prior rejected Apartment God screenshots.
7. Top down anatomy studies.
8. Vehicle, furniture, clothing, pose, animation, and environment references.
```

The presence of reference material in the repo does not mean it is a runtime asset. Reference material is study material. It exists to study quality, construction, silhouette, camera angle, material layering, proportions, animation direction, finish level, and what to avoid.

Kam decides what outside references are acceptable for the project archive. AI agents must not lower the visual standard because they are avoiding references.

Do not copy references blindly into final runtime art. Study why the reference works, then build an Apartment God version. The workflow is:

```txt
1. Start with a high quality visual target.
2. Study why it works.
3. Break down its top down construction.
4. Build an Apartment God version.
5. Strip away direct copying.
6. Keep the quality.
```

### Visual Work Preflight Checklist

Before committing a visual change, answer yes to every item:

```txt
1. Did I read this matrix section?
2. Did I inspect relevant reference material or current screenshots?
3. Did I identify the object footprint?
4. Did I identify what is visible from above?
5. Did I avoid side view contamination?
6. Did I avoid crude or childish shortcuts?
7. Did I define animation states if the object changes state?
8. Did I check mobile readability?
9. Did I compare against prior approved or rejected examples?
10. Did I update this matrix and the ongoing log after the change?
```

If any answer is no, do not call the visual work approved.

---

## 9. Visual Reference Archive Rule

Reference material belongs under:

```txt
apartment-god-production/reference/
```

Recommended folders:

```txt
apartment-god-production/reference/approved-style-targets/
apartment-god-production/reference/rejected-visuals/
apartment-god-production/reference/top-down-anatomy/
apartment-god-production/reference/vehicles/
apartment-god-production/reference/characters/
apartment-god-production/reference/furniture/
apartment-god-production/reference/animation/
apartment-god-production/reference/screenshots/
```

Reference archive rules:

```txt
1. Reference files are study material, not runtime assets.
2. Runtime game assets belong under asset/runtime paths, not this archive.
3. If Kam supplies a website, screenshot, game image, or uploaded reference, archive it or index it when useful.
4. Every archived reference should have a note explaining what to study from it.
5. Every rejected screenshot should explain what must not be repeated.
6. Every approved style target should explain what quality bar it represents.
7. Do not let the reference archive become a junk drawer. Name files clearly and write notes.
```

Current external style target:

```txt
Character Creator 2D - Modern by SmallScaleInt
Source: https://smallscaleint.itch.io/character-creator-2d-modern
Use: aesthetic and production reference for top down or angled top down 2D character quality, modular clothing, controllable outline, 8 direction animation discipline, vehicle and bike support, and adjustable animation frame rate.
Do not use as excuse to make Apartment God isometric if the target is true top down.
Do not use as memory only shorthand. Study construction, then build an Apartment God version.
```

---

## 10. True Top Down Character And Animation Quality Law

Apartment God character work must achieve mature true top down sprite integrity. The target is not isometric, not side view, not pseudo 3D, not bathroom sign people, not toilet door looking characters, not blob people, not mascot stickers, and not generic procedural actor drawings.

The quality bar may study Character Creator 2D, Modern by SmallScaleInt for polish, modular clothing discipline, outline control, animation organization, and frame rate control, but Apartment God must translate that standard into true top down presentation.

### Character Visual Law

Every upgraded character sprite, pose, clothing layer, and actor fallback must obey:

```txt
1. True overhead construction, not isometric posing.
2. Mature readable proportions, not toy, toddler, emoji, or bathroom sign proportions.
3. Clear head direction through hair shape, neckline, shoulders, ears, face wedge hints, accessory placement, and arm lead.
4. Torso mass with shoulder shape, waist logic, clothing breakup, and believable top surfaces.
5. Arm separation, hand placement, and pose clarity from above.
6. Leg and footwear shapes designed for overhead readability, not side view shoe logic.
7. Character identity readable through hair, outfit, silhouette, body type, accessories, and palette.
8. Mobile readability at actual game scale.
9. Consistent origin, scale, shadow, and depth rules across all actors.
10. No toilet door silhouettes, no flat icon bodies, no chibi fallback unless Kam explicitly approves a chibi style reversal.
```

### Motion Quality Law

Anime influenced motion means better timing and appeal, not random exaggeration.

All character animation upgrades must consider:

```txt
1. anticipation,
2. clean arcs,
3. overlap,
4. follow through,
5. contact timing,
6. weight shifts,
7. settle,
8. pose readability,
9. emotional state,
10. object alignment.
```

Locomotion must not slide like pawns. Idles must not feel dead. Activity loops must not be generic arm waving. Characters must feel like people living in a space, not markers moving across a board.

### Unique Activity Animation Law

Every major activity must have its own animation identity. Do not reuse a generic interact pose when the activity should read differently.

Examples that must not share the same generic motion:

```txt
1. eating,
2. drinking coffee,
3. cooking,
4. cleaning,
5. showering,
6. toilet use,
7. grooming,
8. sitting,
9. sleeping,
10. waking,
11. watching TV,
12. computer work,
13. phone use,
14. reading,
15. playing games,
16. playing pool,
17. lifting weights,
18. punching the heavy bag,
19. swimming,
20. changing clothes,
21. carrying towels,
22. socializing,
23. arguing,
24. kissing,
25. cuddling,
26. petting animals,
27. dog ball play,
28. opening doors,
29. entering vehicles,
30. exiting vehicles,
31. bicycle or motorbike mounting,
32. driving or riding,
33. emotional reactions.
```

Before adding or replacing an activity animation, define whether it needs:

```txt
1. approach pose,
2. entry animation,
3. loop animation,
4. exit animation,
5. object specific held prop,
6. directional variants,
7. emotional variants,
8. fallback if the upgraded sprite is missing.
```

### Frame And Sprite Sheet Guidance

Frame rate should serve motion appeal and readability.

Use these as starting targets, then adjust per animation:

```txt
1. calm idle: 6 to 10 fps effective feel,
2. active idle or emotional idle: 8 to 12 fps effective feel,
3. walk: 10 to 14 fps effective feel,
4. urgent walk or run: 14 to 20 fps effective feel,
5. snappy contact or reaction moment: timing based on action impact,
6. long activity loop: enough frames to avoid robotic repetition,
7. entry and exit actions: short, readable, and object aligned.
```

Do not increase frame rate to hide weak posing. Better pose design comes first. Smoother playback should support strong animation, not replace it.

### Required Character Sprite Pipeline Before Broad Replacement

Before replacing broad actor rendering, the work must produce or update:

```txt
1. a character style bible,
2. top down anatomy rules,
3. character scale and origin standards,
4. frame dimensions,
5. animation naming conventions,
6. directional rules,
7. activity animation inventory,
8. manifest structure,
9. fallback behavior,
10. Phaser loading and animation mapping plan,
11. depth sorting and object overlap rules,
12. mobile readability checks.
```

If this pipeline does not exist, broad character replacement stays PLANNED or PARTIAL, not IMPLEMENTED.

### Approval Rule

A character or animation pass is not approved if any of these are true:

```txt
1. It looks like a toilet door sign.
2. It reads as isometric when the target is true top down.
3. It is only a label, blob, rectangle, circle, or icon pretending to be a person.
4. It uses one generic interact pose for unrelated activities.
5. It has no activity specific animation plan.
6. It ignores the SmallScaleInt reference quality bar.
7. It copies the reference directly instead of translating the standard into Apartment God.
8. It does not preserve playability through safe fallbacks.
9. It was not checked at actual game scale.
10. It was not logged in this matrix and the ongoing log.
```
