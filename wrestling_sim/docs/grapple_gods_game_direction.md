# Grapple Gods Game Direction

## High Level Identity

Grapple Gods is a sandbox automated wrestling RPG and booking sim.

The player is not a traditional direct control fighter. The player is the general manager, booker, promoter, and sometimes the coach at ringside.

Wrestlers are autonomous characters. They have goals, grudges, injuries, moods, ego, confidence, relationships, and career plans. They can request matches, complain, refuse ideas, demand title shots, ask for time off, get cleared or blocked by the doctor, and become a problem for management if they feel disrespected.

## Active Camera Direction

The active playable camera is a side view hard cam.

The previous absolute top down experiment is archived. It should not drive new playable art, ring composition, or wrestler production.

The current ring should be staged farther back in the arena so the presentation has stronger venue scale, clearer foreground crowd depth, and enough space for future side view wrestler sprites.

Current approval image:

```text
painted side view arena
hard cam wrestling ring pushed farther back
white canvas
black ropes
visible turnbuckles
corner posts
front apron
foreground crowd depth
8 fps authored visual cadence
no wrestlers until ring approval
```

## Core Screen Split

### Top Half

The top half is the match presentation.

It shows:

```text
arena
crowd
entrance way during walkouts
hard cam ring
referee
wrestlers
basic match action
```

The active match view should read like a side view wrestling broadcast game, not an overhead map and not an isometric room.

Wrestlers should eventually use authored side view sprites with realistic proportions, readable gear, clear silhouettes, and 8 fps animation cycles.

### Bottom Half

The bottom half is the management and RPG layer.

Outside matches, this space becomes the GM inbox and office conversation panel. Wrestlers can appear here to complain, request matches, start feuds, report injuries, threaten to walk out, or demand better booking.

During matches, this space becomes the move suggestion and strategy panel. The player can suggest what their wrestler should attempt next.

The wrestler does not have to obey every suggestion. The wrestler evaluates the suggestion based on stamina, damage, ring position, personality, opponent state, match rules, confidence, style, and risk.

## First Playable Scope

Start with two wrestlers only after the ring approval gate is cleared.

```text
Rex Sterling
Dante Crowe
one moving referee
one approved hard cam ring
one foreground and background crowd loop
a small move list
a match log
bottom half suggestion buttons
```

The first moves should include:

```text
circle
close distance
basic punch
lockup
grapple advantage
Irish whip
rope run
basic slam
pin attempt
recover
```

The gameplay goal is to make sure wrestlers move, think, accept or ignore suggestions, perform basic wrestling states, and produce a readable match.

The visual goal is not temporary programmer art. Ring, crowd, and wrestler sprite production should be good enough to approve before expanding scope.

## Sprite Pipeline

After ring approval, the first wrestler sprite set should include:

```text
idle cycle
walk cycle
run cycle
strike cycle
lockup cycle
grapple move cycles
hit reactions
fall and downed cycles
pin and kickout cycles
rope contact cycle
corner contact cycle
```

The authored sprite pipeline is the primary direction. Procedural drawing may remain in internal tools or as a failure fallback, but it should not define the active visual target.

## Future Roster Scope

After the two wrestler prototype works, build an initial roster of ten unique wrestlers covering core archetypes.

Suggested archetypes:

```text
technical wrestler
powerhouse
high flyer
brawler
submission specialist
monster heel
cowardly heel
hardcore wild card
charismatic showman
veteran ring general
```

Each wrestler should be a unique individual entity, not just a stat block. They should have:

```text
name
look
hair color
gear palette
body type
entrance behavior
style
signature moves
personality
risk tolerance
pain tolerance
ego
loyalty
feuds
friends
enemies
injury status
morale
contract status
complaint tendency
booking preference
```

## Match Flow

A booked match should follow this basic loop:

1. GM books a match.
2. Camera reveals more of the arena and entrance way.
3. Wrestler one enters and performs a short character specific walkout pose.
4. Wrestler two enters and performs a different pose.
5. Camera settles into the approved hard cam match framing.
6. Referee starts in the ring but moves around to stay out of the way.
7. Match begins.
8. Wrestlers fight autonomously.
9. Player can suggest moves or strategy from the bottom panel.
10. Referee counts pins, checks rope breaks, counts out of bounds, and enforces match rules.
11. Match result affects morale, feuds, injuries, popularity, and future booking requests.

## Referee Behavior

The referee should not be frozen in the middle.

The referee should:

```text
move around the ring
stay out of the wrestlers way
approach pin attempts
check submissions
start count outs when wrestlers are outside
react to rule settings
```

Default rule set for now:

```text
10 count outside the ring
pinfall on
submission on
rope break on
DQ off for first prototype unless needed later
```

Later, different promotions can use different count out rules and match customs.

## Visual Direction

Preferred direction:

```text
Phaser based side view hard cam presentation
authored sprite sheets
8 fps animation cadence
painted video game arena and ring
realistic proportions rather than arcade parody
clear hair and gear differentiation
ring pushed farther back for stronger arena scale
foreground crowd used to establish depth
```

Avoid:

```text
top down symbols
isometric camera
chibi or toy proportions
procedural capsule people
rubbery scale pulsing
placeholder art presented as final direction
```

## Development Studio

The internal Studio lives in:

```text
wrestling_sim/studio/
```

It should be used to inspect camera blocking, ring placement, foreground crowd depth, sprite frames, animation timing, move states, AI logic, collision, and performance before changes enter the playable runtime.

## Core Design Rule

The player should not ask, why did my button miss.

The player should ask, why did my wrestler make that choice.

Every match choice should be explainable by the wrestler's logic, personality, stamina, injury state, relationship context, ring position, and match rules.
