# Apartment God Feature Inventory

This document is the canonical feature checklist for Apartment God Prototype. No future pass should remove, hide, or replace a feature unless Kam explicitly asks for that removal.

## Production rule

Every change must be additive or corrective. If a feature existed before, it must keep working after a refactor. If a new system changes how an older feature works, the new version must preserve the same player-facing purpose or improve it clearly.

## Baseline interaction features

- Tap empty floor to walk.
- Double tap empty floor to run.
- Clicking off an open menu closes it without moving the character.
- Floor buttons switch between Floor 1 and Floor 2.
- Speed buttons support normal and faster simulation speed.
- Pause and reset controls exist.
- Selected character is shown in the HUD.
- Current action is shown in the HUD.
- Needs are shown in the HUD.
- Notifications/logs show recent world events.

## Baseline characters

- Resident exists and is playable.
- Girlfriend exists and has social interactions with the resident.
- Dog exists and has dog-specific interactions.
- Characters have needs.
- Characters can move between floors.
- Characters can perform object actions.
- Characters can show readable mood or intent feedback.

## Baseline needs

- Hunger.
- Freshness or hygiene.
- Energy.
- Fun.
- Bladder.
- Social.
- Stamina.

## Baseline object actions

- Couch supports watching TV, relaxing, and napping.
- TV supports normal TV, comedy, horror, and sports.
- Fridge supports snack and meal/cooking behavior.
- Stove supports cooking.
- Sink supports cleaning, brushing teeth, and grooming.
- Shower supports showering, grooming, and cleaning/freshness actions.
- Toilet supports bladder relief.
- Door supports work, errand, mall, movies, and date-style offsite actions.
- Bed supports sleep and relax.
- Laptop desk supports work, games, phone, and shopping.
- Dog bowl supports feeding the dog.
- Light switches support light state changes.
- Stairs support floor travel.

## Baseline social features

- Clicking girlfriend while resident is selected must show relationship actions, not only select/self actions.
- Talk.
- Kiss.
- Cuddle.
- Tickle or playful action.
- Hold hands.
- Cozy/date/family-friendly intimate relationship flow must not be removed.
- Horror TV can trigger spooked/cuddle-style response.
- Girlfriend can request food, movie, cuddle, or shower/freshness attention.

## Baseline dog features

- Clicking dog while resident is selected must show dog actions, not only select/self actions.
- Pet dog.
- Train dog.
- Fetch.
- Fetch should start with proximity, then the dog retrieves the thrown ball and returns.
- Feed dog through dog bowl.
- Dog can wander or act autonomously.

## Baseline TV and media features

- TV can turn on visually.
- TV channel state exists.
- Comedy produces happy/fun tone.
- Horror produces spooked tone.
- Sports produces hyped tone.
- TV glow or visual feedback should be visible.

## Baseline offsite features

- Work offsite action.
- Errand offsite action.
- Mall offsite action.
- Movie theater offsite action.
- Date night offsite action.
- Offsite actions advance time and return characters.
- Work can produce income.
- Mall, movies, and dates can cost money.

## Modular v2 required systems

- `src/main.js` should stay a small bootstrap.
- Game logic should remain split into focused modules.
- Future patches should avoid giant single-file replacements.
- `npm run check` should check source modules.
- `npm run build` should build `dist` for Render.

## Required layout behavior

- The game canvas must never stretch or squash characters.
- The 1280 by 720 game buffer must preserve its 16:9 aspect ratio.
- On portrait phones, the game occupies a stable top region and the HUD scrolls beneath it.
- On tablets, the game scales up while preserving the entire playable view.
- On landscape screens, the game should sit beside the HUD.
- Future option: player can choose whether the HUD is on the left or right for handedness.

## Current regression checks

Before merging any branch, verify:

- Girlfriend social menu appears when resident is selected and girlfriend is clicked.
- Dog menu appears when resident is selected and dog is clicked.
- Kiss, cuddle, pet, train, and fetch are visible.
- Characters are not visually squashed.
- Existing object actions still appear.
- Dog fetch still works.
- Offsite door actions still work.
- TV channels still work.
- Stairs still work.

## New requested systems

### Object moving and renovation

- Object menu should include Move where appropriate.
- Light objects can be moved by one character.
- Heavy objects require strength or helpers.
- Fixed objects like shower, toilet, sink, and hookups require renovation.
- Renovation should schedule workers, not teleport objects.
- Movers/workers should enter through the door, perform work, and leave.
- Placement must reject blocked front door, blocked stairs, overlapping solids, and broken pathing.
- Fridge and similar objects should align sensibly to walls and keep usable access/door direction.

### Strength and fitness

- Not every heavy object should be hard for every character.
- Strong characters should move more items alone.
- Characters can build strength over time.
- Workout equipment can be bought through phone/laptop.
- Strength training is a visible timed activity, not an instant stat increase.

### Phone and laptop systems

- Player can open a phone app from the HUD/bottom panel.
- Character can also walk to laptop and order items there.
- Phone/laptop can order food, workout gear, furniture, parts, or services.
- Phone/laptop actions should cost money when appropriate.

### Autonomy permissions

- Player can control whether characters act freely or need intervention.
- Suggested modes: manual, guided, free.
- Manual means characters do not make major choices without player input.
- Guided means they handle basic needs but avoid major spending or risk.
- Free means they live more independently and may spend money based on traits and management skill.

### Money management and personality

- Money management skill affects automatic spending.
- Frugal characters minimize spending.
- Spender characters can burn money quickly.
- Poor management can cause characters to go broke.
- If girlfriend/wife has low cooking, she may order out instead of cooking.
- If she has no income, household money is used.

### Skill training and limits

- Skills are trained through visible activities.
- Learning speed depends on the learning attribute.
- Skill caps preserve individuality.
- A low-intellect character should not become an Einstein through grinding.
- Training costs time, fun, stamina, and player control opportunity.
- Long training can lock a character into a timed activity unless interrupted.

### Scheduling

- Player can schedule recurring routines for characters.
- Example: monthly or daily gym routine.
- Routines consume time and stamina.
- Scheduling should be visible and interruptible.

### Build request text/dialogue

- Player can type natural build requests such as: build a bookshelf.
- The game interprets simple requests into orders or tasks.
- Bookshelf can arrive through movers or delivery.
- Bookshelf becomes a usable object for reading and intellect training.
- Future objects can use the same request pipeline.

### Consequences and risk

- Low skill can produce mistakes.
- Low cooking can cause failed meals.
- Very low cooking or bad luck can eventually cause a fire risk.
- Fires can damage items and cost money to replace.
- Clumsy or low-intellect characters should sometimes fail at complex tasks.

## Required repo memory updates

Any meaningful pass must update:

- `docs/DEVELOPMENT_LOG.md`
- `docs/HANDOFF.md`
- This file if features are added, removed, or reclassified.

## Merge rule

A branch is not ready to merge unless it preserves the baseline features and passes the current regression checks above.
