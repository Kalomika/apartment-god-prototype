# Apartment God Gameplay Vision Log

This log preserves gameplay ideas discussed for Apartment God so they stay attached to the repo and can be turned into build tasks.

## Core principle

Apartment God should not be a list of written outcomes only. Characters should visibly move through places, use objects, remember what they like, repeat preferred activities, and develop personality through routine and memory.

## Trait-driven autonomy

Characters should not all try to keep every stat above the same number.

Each character needs trait-based standards:

- Meticulous or disciplined characters try to keep important needs close to 90 or 100.
- Clean or organized characters prioritize freshness, cleaning, order, and maintenance before other people would.
- Lazy characters may wait longer, drift toward passive actions, or need instruction from another character before handling chores.
- Social characters seek people, dates, shared TV, conversations, and affection sooner.
- Frugal characters care more about bills, saving money, cooking, and avoiding waste.
- Spender or comfort-driven characters repeat shopping, ordering food, going out, and entertainment when they can afford it.
- Dog-bonded characters prioritize feeding, petting, walking, training, and playing fetch with the dog.

Autonomy should score activities by trait priority, current stat gap, urgency, initiative, mood, memory, and environment access.

## Memory and preferences

Each character should build a memory list of favorite things and repeated preferences.

Memory examples:

- Favorite movies
- Favorite movie genres
- Favorite foods
- Favorite restaurants
- Favorite activities
- Favorite games
- Favorite TV channels
- Favorite places
- Favorite people to spend time with
- Activities they disliked
- Activities they repeat often

If a character likes a movie, food, place, or activity, they can choose it again later. If they dislike it, they should avoid it unless instructed or unless another trait overrides that dislike.

## Garage and car

The apartment should eventually include a garage and car system.

Planned elements:

- Garage room or exterior garage location
- Parked car object
- Car entry and exit animation
- Character walks to garage
- Character enters car
- Car leaves apartment location
- Car returns from offsite location
- Car state, fuel or charge, cleanliness, maintenance, storage
- Possible car-related expenses
- Possible drive-to-location transition

The garage and car should turn offsite travel into visible game actions instead of only written messages.

## Expanded locations beyond the apartment

Offsite locations should eventually become playable or semi-playable scenes instead of only time-lapse text.

Important locations discussed:

- Movie theater
- Mall
- Work
- Date location
- Errand location
- Restaurants or food places
- Dog-related outdoor location
- Possible stores

## Movie theater system

Going to the theater should become a visible sequence.

Desired flow:

1. Character decides to go to movie theater based on fun, social, traits, money, memory, or date plans.
2. Character walks to garage or exit.
3. Character travels by car or offsite transition.
4. Scene switches to movie theater.
5. Character walks into theater.
6. Character chooses a movie.
7. Character sits down.
8. Time transparently passes while they watch the movie.
9. Fun, social, mood, and memory update afterward.
10. Character returns home.

Movie names should be generated randomly each theater visit unless the character wants to repeat a movie they liked.

Characters can remember favorite movies and choose to rewatch them. This makes their personalities feel specific instead of everyone doing the same thing.

Movie memory should include:

- Movie title
- Genre
- Date watched
- Who watched it with them
- Rating or like score
- Mood after watching
- Whether they want to rewatch it
- Whether it became a favorite

## Random movie generation

Movie titles can be generated from genre templates.

Possible genre groups:

- Sci-fi
- Cyberpunk
- Horror
- Comedy
- Romance
- Action
- Drama
- Animated feature
- Documentary
- Weird art film

Each generated movie should have:

- Title
- Genre
- Runtime
- Mood effect
- Price
- Repeat appeal
- Character preference hooks

If a character likes the movie enough, it enters memory and can be chosen again later.

## Personality through repetition

The game should let characters become themselves through repeated choices.

Examples:

- One person always replays a favorite movie.
- One person keeps ordering the same meal.
- One person always goes to the mall when bored.
- One person stays home and watches TV.
- One person cleans before relaxing.
- One person delays chores unless someone else tells them.
- One person bonds with the dog through repeated training or fetch.

The point is not pure randomness. Randomness should create options, while traits and memory determine what becomes habit.

## Instruction and influence system

Some characters, especially lazy or low-initiative characters, may wait to be instructed before they act.

Possible influence types:

- Player instruction
- Partner reminder
- Dog request or need
- Low stat discomfort
- Habit trigger
- Scheduled routine
- Memory-based desire

Characters should be able to nudge each other:

- Remind someone to shower
- Ask someone to clean
- Suggest a movie
- Ask for food
- Ask to go out
- Ask to walk or feed the dog

## Implementation targets

Near-term:

- Add trait-based target thresholds per character.
- Add a memory object to each character.
- Add favorite and disliked activity lists.
- Add generated movie titles to the existing movie theater action.
- Log watched movies in character memory.
- Let repeated movies appear as options.

Mid-term:

- Add garage and car objects to world data.
- Add visible walk-to-car and return-home sequences.
- Add theater as a second playable or semi-playable scene.
- Add sitting in theater and transparent time passage.

Long-term:

- Add multiple offsite locations with real object interaction.
- Add location-specific sprites and props.
- Add character-specific habits, routines, preferences, and relationship memories.

## Current concern

Do not let these features collapse into simple notification text. Written logs can support the simulation, but the intended game should increasingly show the action through movement, scene changes, object use, memory, and visible behavior.
