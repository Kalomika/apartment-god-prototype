# Grapple Gods Game Direction

## High Level Identity

Grapple Gods is a sandbox top down automated wrestling RPG and booking sim.

The player is not a traditional direct control fighter. The player is the general manager, booker, promoter, and sometimes the coach at ringside.

Wrestlers are fully autonomous characters. They have goals, grudges, injuries, moods, ego, confidence, relationships, and career plans. They can request matches, complain, refuse ideas, demand title shots, ask for time off, get cleared or blocked by the doctor, and become a problem for management if they feel disrespected.

## Core Screen Split

### Top Half

The top half is the match presentation.

It shows:

```text
arena
crowd
entrance way during walkouts
ring
referee
wrestlers
basic match action
```

The first playable camera is absolute top down. It is not isometric and not an angled hard cam.

The wrestlers should read from above, with visible shoulders, head, arms, legs, hair color, gear, and stance. We should see left leg forward and right leg back during movement states from a direct overhead view.

### Bottom Half

The bottom half is the management and RPG layer.

Outside matches, this space becomes the GM inbox and office conversation panel. Wrestlers can appear here to complain, request matches, start feuds, report injuries, threaten to walk out, or demand better booking.

During matches, this space becomes the move suggestion and strategy panel. The player can suggest what their wrestler should attempt next.

The wrestler does not have to obey every suggestion. The wrestler evaluates the suggestion based on stamina, damage, ring position, personality, opponent state, match rules, confidence, style, and risk.

## First Playable Scope

Start with two wrestlers only so we can prove the loop.

```text
one blonde wrestler
one dark haired wrestler
one referee
one ring
one basic crowd loop
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

The goal is not animation polish yet. The goal is to make sure wrestlers move, think, accept or ignore suggestions, perform basic wrestling states, and produce a readable match.

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
2. Camera zooms out to show more arena and the entrance way.
3. Wrestler one enters and performs a short character specific walkout pose.
4. Wrestler two enters and performs a different pose.
5. Referee starts in the ring but moves around to stay out of the way.
6. Match begins.
7. Wrestlers fight autonomously.
8. Player can suggest moves or strategy from the bottom panel.
9. Referee counts pins, checks rope breaks, counts out of bounds, and enforces match rules.
10. Match result affects morale, feuds, injuries, popularity, and future booking requests.

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

The first playable style should be readable and fast to iterate.

Preferred direction:

```text
Phaser based 2.5D top down presentation
procedural vector based character parts at first
future riggable sprites or generated sprite sheets
realistic proportions rather than cartoon icons
clear hair and gear differentiation
proper ring based on approved design reference
```

If vector based wrestler rigs become too slow or visually weak, low poly 3D wrestler proxies can be generated and rendered to top down sprite sheets. The long term goal is not crude placeholder art, but a practical top down visual pipeline that lets us rig, pose, and expand quickly.

## Core Design Rule

The player should not ask, why did my button miss.

The player should ask, why did my wrestler make that choice.

Every match choice should be explainable by the wrestler's logic, personality, stamina, injury state, and relationship context.
