# Apartment God Visual Ceiling

Apartment God must not be boxed into basic placeholder visuals.

The target ceiling is a production-capable top-down life sim that could scale toward Animal Crossing level polish and systemic presentation, while also being able to support Flashback-like realism, rotoscope-informed adult motion, cinematic sprite staging, and dense apartment detail when the art direction calls for it.

This does not mean copying those games. It means the repo must be built so the art ceiling is high enough for that level of care.

## Visual ambition

The project should be able to support:

- polished top-down rooms with character and object charm
- adult realistic proportions
- nuanced idle and activity animations
- rotoscope-informed movement if desired
- detailed furniture and prop sprites
- strong silhouette readability
- rich environmental mood
- layered lighting and ambience
- expressive but not cartoonishly childish characters
- readable dog anatomy and behavior
- high quality UI icons and phone presentation
- sprite atlas driven production art
- placeholder fallback without trapping the final style at placeholder level

## What the style is not

Reject:

- crude programmer art as a final goal
- generic flat boxes pretending to be production assets
- chibi proportions
- toy-like dog designs
- mascot characters
- oversized heads
- childlike bodies
- emoji acting as final expression language
- low-effort retro blockiness
- inconsistent scale between rooms, people, pets, cars, and furniture

## Animal Crossing level lesson

The useful lesson is not the cute style. The useful lesson is the production discipline:

- every object has a clear role and readable silhouette
- furniture has charm and personality
- interaction feedback is immediate
- UI is friendly and legible
- animation states are clean and repeated with polish
- the world feels authored, not randomly boxed together
- player actions have visual payoff
- systems are readable without debug labels

Apartment God should apply that level of polish through its own adult, top-down, apartment-life tone.

## Flashback level lesson

The useful lesson is not side-scrolling or exact camera style. The useful lesson is the physical believability:

- adult human proportions
- grounded movement
- frame poses with weight
- silhouettes that feel anatomical
- cinematic restraint
- clean readable action frames
- mature world tone

Apartment God should be able to use that kind of realism from a top-down viewpoint when desired.

## Technical ceiling requirements

The repo should be capable of:

- loading sprite atlases
- loading per-state character animations
- loading object sprites by kind and id
- validating manifests before shipping
- optimizing PNGs
- building atlases from individual PNGs
- testing mobile visual boot
- diffing visual references
- falling back safely when art is missing
- showing missing sprite debug overlays
- supporting future tile maps or authored floor pieces
- supporting layered room rendering
- supporting lighting passes and ambience
- supporting animation timing per state
- supporting adult scale and anchor rules

## Production rule

The fallback layer may exist so the game never breaks, but the fallback layer is not the art target.

Do not let the project become trapped by whatever was easiest to render first.

The final target is a game that can carry real production sprites, polished interiors, adult animation, readable systems, and a strong mood without needing to be rebuilt from scratch later.
