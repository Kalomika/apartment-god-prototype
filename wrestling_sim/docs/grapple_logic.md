# Grapple Logic

## Goal

The grapple system should feel inspired by Fire Pro timing and position logic, but rebuilt for a realistic 3D simulation.

The player is not pressing a grapple button. The wrestler brain chooses the attempt.

## Core Flow

```text
observe opponent
choose intent
approach
attempt contact
resolve lockup
assign advantage
choose move
play paired animation
update match context
```

## Lockup Factors

```text
range
facing
angle
stamina
strength
technique
awareness
aggression
confidence
current condition
ring zone
style matchup
random pressure
```

## Capture Zones

Each wrestler should own invisible interaction zones.

```text
front_grapple_zone
rear_grapple_zone
side_grapple_zone
ground_grapple_zone
corner_grapple_zone
rope_grapple_zone
```

A grapple can begin when the attacker has a valid intent and the defender is inside a usable zone.

## Outcomes

```text
attacker_advantage
defender_counter
neutral_clash
clean_break
rope_break
missed_contact
interrupted_contact
```

## Move Choice

Move choice should be weighted, not fully random.

A wrestler should prefer actions based on style, stamina, match time, opponent condition, ring zone, and crowd heat.

Examples:

```text
Powerhouse with high stamina near center ring prefers throws and power moves.
Technician against weakened legs prefers limb control or submission setup.
High flyer near corner with crowd heat prefers aerial setup.
Cowardly heel near ropes may stall, retreat, or force a rope break.
```

## Defensive Timing

The defender gets different options depending on the moment.

```text
before contact: sidestep, retreat, interrupt
at lockup: counter, neutral clash, clean break
during startup: counter, slip behind, block
during execution: impact reduction
on recovery: roll away, stand, crawl to ropes
```

## Design Rule

The system should not punish the viewer with awkward alignment. If the sim chooses a believable grapple and the target is close enough, the animation system should help complete the contact.
