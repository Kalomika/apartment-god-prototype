# Apartment God Feature Backlog

This backlog captures gameplay features and systems discussed in chat so future agents and collaborators can build from the same target instead of losing scope.

## Current build priority

Mechanics first, sprite polish later. Temporary character visuals can be replaced later with better top-down sprites once the house, autonomy, memory, service NPCs, activities, and travel systems work.

## Daily development cadence

Target two reliable build passes per day:

- Morning: one bug fix or feature slice plus review/check.
- Evening: one bug fix or feature slice plus cleanup/check.

Small related fixes can be grouped, but large systems must be split into working slices.

## Bug fixes and reliability tasks

- Make fridge/snack feedback obvious again.
- Make fridge open visibly during snack and cooking prep.
- Make food delivery visible instead of instant hunger gain.
- Add delivery person at the door for ordered food.
- Add time passage/progress bars for most non-walking actions.
- Keep walking, door opening, and simple taps quick, but make activities take time.
- Audit every object action for clear visual feedback, stat changes, and logs.
- Confirm shower, toilet, TV, snack, meal, cooking, bed, desk, phone, music, dog bowl, fetch, object move, bookshelf delivery, training, and routines work.
- Fix cross-floor actions so characters can route to basement/upstairs/downstairs objects without wrong-floor coordinates.

## House expansion

The game should grow toward a maximum-feature home, then smaller versions can strip features away later.

Planned home areas:

- Main floor
- Upstairs
- Basement
- Garage
- Adjacent rooms connected to the main house, not only stacked floors
- Future exterior or neighborhood travel nodes

## Basement game room

Add a basement game room with functioning activities.

Required basement objects:

- Pool table
- Arcade machine
- Console gaming area with PlayStation/Xbox-style game setup
- Dart board
- Seating area
- Possible table tennis later
- Possible sports or exercise activity zones later

Required basement activities:

- Practice pool alone
- Play pool together
- Play arcade alone
- Play arcade together
- Play console games alone
- Play console games together
- Throw darts alone
- Play darts together
- Call girlfriend/partner to join
- Future visitors, kids, boys/girls, friends, and household members can go downstairs to play

Together activities must require characters to gather near the activity area before the activity starts. The game needs invisible shared activity zones/circles for together actions unless the real activity requires separated positions, like pool, table tennis, sports, or similar games.

## Together consent, routines, and hearing realism

Together features should not force another character to obey. Invitees need autonomy.

When the player or another character asks someone to do something together, the invitee should evaluate:

- Current action
- Hunger
- Bathroom/bladder urgency
- Shower/freshness need
- Energy/tiredness
- Work or computer task
- Personal routine
- Mood
- Relationship
- Trait priorities
- Distance and whether they can hear the request
- Whether the activity matches their favorites or dislikes

Most times a free partner may say yes, but they can say no when something more important is happening.

Important refusal rules:

- If the character is eating, cooking, showering, using the toilet, leaving for work, doing a high-priority routine, or handling an urgent need, they can refuse.
- Refusal bubble should usually be short, like `not rn`.
- Acceptance bubble can be short, like `yeah`.
- If something funny happens during an activity, bubbles like `lol` are allowed.
- If someone is in the bathroom, the calling character may need to be near the bathroom door for the request to be heard.
- The game should avoid unrealistic whole-house hearing unless the speaker is close enough, yelling, calling by phone, or in the same/open room.

Routine system:

- Meticulous characters should have invisible personal routines.
- Routines can reserve time blocks for showering, cleaning, working, studying, cooking, exercise, sleep, computer work, or other habits.
- Characters should protect high-priority routines unless the invite is more urgent or very appealing.

## Garage and vehicles

Add a garage connected to the house by its own garage door, separate from the front door.

Garage objects:

- One-car or two-car garage layout
- Car
- Bicycle
- Motorbike
- Optional second car
- Vehicle storage/maintenance state

Vehicle systems:

- Choose travel method before leaving for activities.
- Car uses gas/money and can carry more people.
- Motorbike uses less fuel and can carry fewer people.
- Bicycle uses no gas but takes longer and burns more stamina/calories.
- Vehicle choice changes trip time, cost, stamina, freshness, and who can come.
- Multiple vehicles can be selected so different characters can take different vehicles.
- Vehicles should support future school/work/errand strategy.

Garage flow:

1. Character receives travel task.
2. Player selects invitees.
3. Player selects vehicle(s).
4. Character walks to garage door, not front door.
5. Character enters selected vehicle.
6. Vehicle departs.
7. World/game time passes.
8. Character returns and exits vehicle.

## Invite and party selection system

When starting an activity like movie theater, shopping, trip, restaurant, mall, travel, or outing, the game should show a selection list.

Options:

- Go alone by pressing Done without selecting anyone else.
- Invite girlfriend/partner.
- Invite dog.
- Invite all household members.
- Select individual household members.
- Press Done to execute with the chosen group.

The dog should not automatically go everywhere. Dog joins only when selected or when the activity is household-wide or dog-appropriate.

## Travel and offsite scenes

Offsite actions should not remain simple text-only skips.

Required destination types:

- Movie theater
- Mall
- Work
- Errand locations
- Restaurants or food places
- Date locations
- Dog-friendly locations
- Airport and plane travel in the long term

Travel should affect:

- Time
- Money
- Gas/fuel
- Stamina
- Calories
- Freshness/dirtiness
- Hunger
- Fun
- Social
- Memories

## Movie theater system

Movie theater should become visible.

Flow:

1. Choose to go to theater.
2. Select invitees.
3. Select vehicle/travel method.
4. Characters travel.
5. Theater scene loads.
6. Characters walk in.
7. Characters select movie.
8. Characters sit down.
9. Transparent time bar/time passage while movie plays.
10. Characters rate/remember the movie.
11. Characters return home.

Movie titles should be generated randomly unless a character chooses to rewatch a movie they liked.

## Character memory and favorites

Each character needs memory lists.

Memory types:

- Favorite movies
- Rewatched movies
- Favorite genres
- Favorite foods
- Favorite restaurants
- Favorite games
- Favorite activities
- Favorite people
- Favorite places
- Disliked movies/foods/activities
- Repeated habits

Characters should repeat things they like and avoid things they dislike unless instructed or overridden by traits.

## Trait-driven autonomy

Characters should not all try to maintain the same universal stat threshold.

Examples:

- Meticulous characters maintain selected needs near 90 or 100.
- Clean characters prioritize showering, cleaning, dishes, freshness, and order.
- Lazy characters delay chores, drift toward passive actions, or wait for instruction.
- Social characters seek together activities sooner.
- Frugal characters avoid waste and expensive activities.
- Spenders chase comfort, shopping, delivery, entertainment, and outings.
- Dog-bonded characters prioritize the dog.

Autonomy should score actions using traits, need gaps, urgency, initiative, memory, mood, time, location, and access.

## Service NPCs and deliveries

The game should show service interactions.

Examples:

- Food delivery person comes to the door.
- Fake dialogue/exchange occurs.
- Time passes while food is received.
- Delivery person leaves.
- Character eats or stores food.
- Future contractors deliver furniture, build rooms, renovate, move objects, install garage/basement upgrades.

## Construction and persistent world time

Building things should take meaningful time.

World-time and real-time concepts must be separated:

- Game world time determines how long construction takes in the simulation.
- Real time determines what happens while the player is away or returns later.
- Big builds can continue while the player leaves the game and comes back.

Durations should scale by realism and gameplay:

- Small furniture delivery: short in-game delay.
- Table/pool table install: moderate delivery and setup delay.
- Object move: short to moderate depending on weight and helpers.
- Room renovation: long delay.
- Basement/garage addition: extensive construction delay.
- Car/bike delivery: scheduled delivery delay.

## Calories and life-management stats

Add calories or a related energy/body-management layer later.

Walking, biking, stairs, chores, exercise, and travel should affect stamina, hunger, freshness, and possibly calories. The game can become a life manager where players learn household planning, time management, money management, travel planning, and family logistics through play.

## Long-term ambition

Apartment God can grow toward a bird's-eye life-management game with the openness of a large systemic life sim, focused on living life rather than crime. The future player should be able to type reasonable requests, and an internal AI should decide whether they can be built into that player's version of the game. If reasonable, the AI should generate or schedule the needed custom code/content update safely.

Working idea: Apartment God now, possible future broader title direction like Lifing.
