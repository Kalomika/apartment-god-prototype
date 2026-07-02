# Manager Choice Interaction Layer

## Core Idea

The match can run fully automatic, but the player can also act like a manager, coach, or booker by choosing suggested actions from a list under the match screen.

The wrestler still has their own brain. The player is not directly controlling footwork, timing, or exact animation. The player is influencing intent.

## Screen Layout

```text
match camera
ring and wrestlers
crowd foreground

choice tray
suggested move 1
suggested move 2
suggested move 3
suggested move 4
strategy option
let wrestler decide
```

## Interaction Modes

```text
full_auto
The wrestler makes every decision.

coach_mode
The player can suggest the next action, but the wrestler may ignore it if tired, out of position, stunned, or low confidence.

booker_mode
The player can strongly force a direction for the next beat, useful for testing fantasy matchups.
```

## Why This Works

This keeps the sim identity intact while giving the player agency.

The player does not manually line up a grab. They choose the next wrestling idea.

Examples:

```text
Work the leg
Go for a lockup
Try a power move
Create distance
Use the ropes
Go to the corner
Attempt a pin
Taunt
Recover stamina
Let wrestler decide
```

## Suggested Move List

The move list below the screen should be context aware.

The game should only offer choices that make sense for the current match state.

Example near center ring:

```text
collar tie
body slam
snapmare
short strike combo
circle away
recover
let wrestler decide
```

Example near the corner:

```text
corner strikes
buckle smash
corner throw
climb turnbuckle
drag opponent away
recover
let wrestler decide
```

Example opponent down:

```text
pin attempt
stomp
submission setup
pick opponent up
taunt
recover
let wrestler decide
```

## Suggestion Strength

A player choice should become a weighted suggestion, not always a guaranteed command.

```text
full_auto suggestion weight: 0
coach_mode suggestion weight: medium
booker_mode suggestion weight: high
```

The wrestler can still refuse if the choice is impossible.

Reasons a wrestler may ignore a suggestion:

```text
not enough stamina
wrong ring zone
opponent is not in the right state
move is not in the wrestler move set
wrestler temperament resists the idea
wrestler confidence is too low
wrestler is currently recovering
```

## Fantasy Matchup Goal

The larger game goal is to let players create slight tribute style wrestlers inspired by history, without requiring exact likenesses or licensed identities.

The system should support:

```text
custom body types
custom outfits
custom move sets
custom entrances
custom personality logic
custom eras
custom rules
custom promotions
custom tournaments
```

The promise is simple:

```text
Build anyone inspired by any era.
Put them against anyone.
Watch how the styles clash.
Choose suggestions if you want.
Let the sim run if you do not.
```
