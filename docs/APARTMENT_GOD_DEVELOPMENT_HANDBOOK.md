# Apartment God Development Handbook

Last major handbook update: 2026-07-08 04:35 AM CT

This is the long form rulebook for Apartment God development. Every AI, scheduled agent, or developer working on the project should read this before touching the repo.

The GPT project instructions should stay short. This handbook carries the detailed rules, workflow, design direction, safety practices, and links to living logs.

---

## 1. Project Identity

Project name: Apartment God

Primary repo:

```txt
Kalomika/apartment-god-prototype
```

Never touch:

```txt
Kalomika/ai-rpg-engine
```

Playable Render link:

```txt
https://apartment-god-phaser.onrender.com
```

Active development branch:

```txt
phaser-migration
```

Render playable branch:

```txt
main
```

Important meaning:

- `phaser-migration` is where new work happens.
- `main` is the branch Kam can currently test through the Render browser link.
- Do not build new features directly on `main`.
- Only update `main` when Kam explicitly wants the Render playable version updated.
- Do not change Render settings.
- Do not manually deploy unless Kam explicitly asks and the environment allows it.

---

## 2. Required Reading Before Work

Before meaningful work, read:

```txt
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
apartment-god-production/ONGOING_DESIGN_LOG.md
```

The handbook is the standing rulebook.

The ongoing log is the dated work history. It records what was done, what was planned, what was reverted, what is risky, what still needs testing, and what another AI should not accidentally overwrite.

If the log is missing from the current branch, check whether it exists on a production or manager branch, then copy or update it safely on the active runtime branch if needed.

---

## 3. Logging Rules

Every meaningful code change, feature, bug fix, revert, blocker, design decision, or major note must be appended to:

```txt
apartment-god-production/ONGOING_DESIGN_LOG.md
```

Do not silently erase older history. Append a new timestamped entry.

Every entry should include:

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

Rules:

- Mark planned ideas as PLANNED, not implemented.
- Mark committed but untested code as NEEDS_TESTING or PARTIAL.
- Never say complete unless it was actually tested.
- If something is reverted, add a REVERTED entry with the reason.
- If a backup was made, include the branch name.
- If `main` was updated for Render access, say so clearly.

---

## 4. Backup and Restore Rules

Before any major overhaul, create a backup branch first.

Major overhaul includes:

- Actor AI
- Autonomy
- Movement
- Pathfinding
- Save system
- Phone UI
- Menus
- Vehicle system
- House layout
- Routing
- Phaser renderer
- Anything likely to affect playability

Backup branch examples:

```txt
backup/phaser-migration-before-ai-overhaul-YYYY-MM-DD
backup/phaser-migration-before-pathfinding-overhaul-YYYY-MM-DD
backup/main-before-render-update-YYYY-MM-DD
```

A backup branch is a full repo snapshot at that commit. Treat it like a restore point.

Do not force move `main` unless:

1. Kam clearly wants the Render playable branch updated.
2. Current `main` has a backup branch.
3. The source branch and target branch are verified.

---

## 5. Current Priority Order

1. Keep the game playable.
2. Make `phaser-migration` a perfect playable clone of current working behavior.
3. Fix mobile usability.
4. Fix gameplay broken by branch drift.
5. Make `phaser-migration` stable enough to replace main cleanly.
6. Only after that, deepen Phaser architecture.
7. Only after that, expand high quality sprite art.

Clone rule:

If something works on stable playable code, it should not become worse on `phaser-migration`. If drift happens, compare real source files and fix the source. Do not fake behavior with brittle runtime patch hacks.

---

## 6. Testing Rules

When asking Kam to test, always include:

```txt
https://apartment-god-phaser.onrender.com
```

Also say exactly what to test.

Do not say complete unless tested. Use these words honestly:

- Committed
- Needs testing
- Verified by code inspection
- Tested locally
- Tested on Render
- Blocked

Do not claim Render testing happened unless it actually happened.

---

## 7. Runtime Safety Standards

Do not leave the game blank if something fails.

Protect the boot path, animation frame, save loading, UI syncing, and phone/menu logic from crashing the whole game.

Preferred safety behavior:

- Catch recoverable runtime errors.
- Log useful error messages.
- Clear obviously corrupted transient state.
- Keep the canvas visible.
- Preserve playability whenever possible.
- Never hide a crash under a silent failure.

For save and reset work:

- Reset must not immediately resave stale actor positions during reload.
- Refresh autosave should preserve normal play, but reset should truly start fresh.
- If a save merge can fail, catch it and avoid blanking the game.

---

## 8. Phone, Menu, and Mobile Rules

The phone should be compact when closed.

When opened, it can become a larger phone panel.

Every phone tab must be scrollable on mobile.

Every interaction menu must be scrollable on mobile.

Bottom buttons must never be hidden off screen.

The phone, blueprint, and locator should not block gameplay objects if a bottom control bar exists.

Menus should close after a selection when appropriate, especially map, room, area, and person locator selections.

---

## 9. Gameplay Rules

The house must remain playable unless everyone leaves.

If one person leaves, the remaining home character should still be playable.

If the selected person leaves, selection should switch to someone still home.

Off site time lapse should cover the screen only if the whole household is gone.

If someone remains home, show a small off site indicator only.

Vehicles must be visible and logical.

If someone drives away, use a parked garage vehicle.

If the garage exit is at the top, cars should face upward and drive upward. If the current layout uses a bottom exit, keep the vehicle logic visually consistent with that layout until the layout changes.

Returning vehicles should visibly drive back, park, then characters come inside.

Characters should not pop in and out without visible logic when a vehicle is involved.

---

## 10. Actor AI Direction

Actors should feel like beings living in a world where Kam is God.

They should not be empty pawns. They should have:

- Needs
- Routines
- Preferences
- Thoughts
- Social desires
- Activity choices
- Personal priorities
- Memories
- Consequences from actions

Testing mode needs guided commands to override immediately so Kam can debug movement, objects, doors, vehicles, bathrooms, food, sleep, and social actions.

Future normal mode can allow actors to accept, delay, refuse, or negotiate based on:

- Hunger
- Bladder urgency
- Energy
- Freshness
- Mood
- Personality
- Relationship
- Distance
- Current action
- Object availability
- Memory
- Route reachability

Core design sentence:

```txt
They are beings.
You are God.
They can resist.
But God has tools.
```

---

## 11. Movement and Pathfinding Direction

Characters should not use the exact same pixel route every time.

Use:

- Multiple approach points
- Slight destination variation
- Route memory
- Alternative objects
- Alternative rooms
- Blacklisted failed routes
- Path retry options
- Fallback behavior

Do not show Blocked until reasonable alternatives are exhausted.

Examples:

- If the downstairs toilet is occupied, try the upstairs toilet.
- If a couch approach is blocked, try another approach point around the couch.
- If a vehicle path clips the ATV, route around the ATV instead of freezing.
- If an object is not useful, do not wander there just to stand idle.

Actors may use the same activity again, but they should not look like they only know one identical path.

---

## 12. Sleep, Routine, and Time Direction

Couples should generally try to sleep around a shared assigned bedtime.

Bedtime is a goal, not a rigid script. Actors can stay up for work, movies, deadlines, personality, night owl traits, or player interference.

Lack of sleep should affect more than energy:

- Stamina
- Mood
- Patience
- Movement speed
- Mistake chance
- Social irritability
- Recovery
- Health style consequences

If the whole main household is asleep, time can speed up through the night. If only one person is asleep, time should usually remain normal unless a later design says otherwise.

Morning routine should eventually consider:

- Alarm
- Bathroom
- Shower
- Brushing teeth
- Hunger
- Coffee
- Work time
- Commute

---

## 13. Thought Bubble and Speech Bubble Rules

Speech bubbles are for things said out loud to another actor or to the household.

Thought bubbles are for private intention, personal wants, chosen activities, or information the player should consider but that is not spoken out loud.

Examples:

- Actor chooses to watch a movie alone: thought bubble.
- Actor asks partner to watch a movie: speech or invitation bubble.
- Actor wants to play with dog alone: thought bubble first, then speech if calling the dog.
- Actor warns partner it is bedtime: speech bubble.

---

## 14. Activity Consequence Direction

Every activity should eventually have a result beyond the animation.

One activity can affect multiple stats.

Examples:

- Watching together increases social and fun.
- Documentaries increase intellect or learning.
- Horror can create cautious night behavior for a short time.
- Classical music can improve focus or intellect.
- Reading improves intellect, learning, focus, or future decision quality.
- Exercise improves fitness and slows stamina depletion over time.
- Coffee gives a short boost, then a later sluggish dip.

Activities should have believable in game duration where practical.

Examples:

- A song is short.
- An album is longer.
- A TV episode is medium.
- A movie can take hours of game time.

Long activities should be interruptible by urgent needs, work, player guidance, or major events.

---

## 15. Work, Vocation, and Responsibility Direction

Characters should eventually have jobs with schedules, shifts, pay, and consequences.

Jobs can be remote or physical.

Remote jobs can give more freedom but less pay.

Physical jobs can pay more but take the character away from the house.

Different shifts should affect life differently:

- Morning
- Afternoon
- Evening
- Overnight

Overnight work can pay more but should harm recovery and routine because it fights the normal sleep window.

Work lateness should matter:

- Warning
- Write up
- Fired
- Rehire limits

Job search can eventually happen through the phone or computer.

Potential phone app idea:

```txt
Job Hunt
```

or a stylized professional network app.

---

## 16. World Object and Testing Direction

For testing, default objects needed for core mechanics should exist after reset.

Do not make Kam reorder core test objects every time reset happens.

Examples of objects that should exist by default when mechanics need them:

- Bed
- Toilet
- Shower
- Fridge
- Stove
- Sink
- Couch
- TV
- Desk
- Dog bowl
- Dog kennel
- Vehicles
- Bookshelf once reading and intellect are active
- Coffee maker once coffee is active

The build or shopping system can still exist later, but basic mechanics must be testable without tedious setup.

---

## 17. Visual Quality Direction

Do not trap the project in crude placeholder art long term.

The target is a readable adult top down apartment life sim with high visual ceiling.

Do not make the style:

- Chibi
- Toy like
- Mascot like
- Emoji like
- Oversized head
- Childish
- Blob like
- Crude programmer art

Phaser is the future target, but playable clone comes first. Do not replace working visuals with ugly placeholder Phaser output and call it progress.

---

## 18. Repo Map

Common runtime areas:

```txt
src/world.js              House layout, objects, floors, approach points
src/state.js              Actor state, needs, traits, time, household data
src/autonomy.js           Actor AI and automatic behavior
src/movement.js           Movement, pathfinding, routes, blocked recovery
src/actions.js            Object and social action execution
src/ui.js                 Canvas interaction menus and guided controls
src/phoneUI.js            Phone interface and phone actions
src/vehicleSystem.js      Garage, vehicles, travel boarding and return logic
src/saveSystem.js         Save, load, refresh persistence, reset safety
src/rendering.js          Main render orchestration and UI sync safety
src/renderWorld.js        World drawing
src/renderObjects.js      Object drawing
src/renderDynamic.js      Actors and dynamic visual drawing
styles.css                Layout, mobile, phone, control bar styling
```

Important documentation areas:

```txt
docs/
apartment-god-production/
assets/sprite_replacement_queue/
assets/manifests/
```

---

## 19. Developer Behavior Standards

Be careful, direct, and honest.

Before editing:

1. Verify repo.
2. Verify branch.
3. Read handbook and log.
4. Inspect relevant files.
5. Create backup for major work.

While editing:

- Prefer source fixes over hacks.
- Keep changes small enough to reason about.
- Do not break playability for architecture purity.
- Do not remove working behavior unless replacing it with tested better behavior.
- Avoid duplicate systems that fight each other.
- Make failure states visible and recoverable.

After editing:

1. Commit to the correct branch.
2. Update the log.
3. If Kam needs browser testing, update `main` only after backup and explicit intent.
4. Tell Kam what branch was edited.
5. Give the test link and exact testing instructions.

---

## 20. Current Known Direction Summary

Immediate priority is smarter autonomy and reliable movement.

Actors should use the whole house intelligently without Kam guiding every action.

They should stop wandering to pointless places, stop freezing when another option exists, use alternate objects, vary routes, satisfy needs, use social actions, play with the dog, sleep, eat, shower, use bathrooms, and choose meaningful activities.

The game should feel like a living world, not a set of dumb idle loops.
