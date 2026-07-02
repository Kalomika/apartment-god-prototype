# Wrestling Sim Architecture

## Game Identity

This project is not a direct control wrestling game. It is a custom wrestler simulation game.

The player creates a wrestler, assigns stats, builds a move set, tunes personality, and enters that wrestler into matches. The match is then watched through a broadcast inspired hard cam.

## Main Systems

```text
WrestlerProfile
Permanent identity, stats, style, move set, personality, visual direction, and growth data.

DecisionBrain
Live AI decision maker during a match.

MatchContext
Shared match state, ring zones, legal targets, timers, crowd heat, and match rules.

GrappleResolver
Determines lockup outcomes, reversals, escapes, rope breaks, and move selection.

RingZones
Defines center ring, ropes, corners, apron, floor, barricade, and entrance side areas.

MatchReport
Explains why a wrestler won or lost.
```

## First Loop

```text
Create wrestler
Set style and tendencies
Run match simulation
Generate performance report
Adjust strategy
Run another match
```

## Design Law

The player should never ask, why did my input miss.

The player should ask, why did my wrestler choose that.

That means every simulated choice needs a readable reason. Stamina, ego, aggression, discipline, ring position, damage, and style should all be visible in the post match report.

## Simulation Flow

```text
Match starts
Wrestlers evaluate distance and ring zone
Brain selects intent
Body executes intent
Resolver checks outcome
Context updates damage, stamina, momentum, crowd heat, and positioning
Drama score influences future choices
Match ends by pin, submission, count out, disqualification, time limit, or stoppage
Report explains the result
```

## Render Direction

The current module is pure Node and has no visual runtime dependency. Later, we can map it to a Render hosted build or a browser based match viewer by wrapping the sim loop with a visual layer.

Nothing here should touch the existing apartment game runtime until we explicitly create a visual integration branch.
