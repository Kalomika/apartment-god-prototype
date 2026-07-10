# Top Shot CQC Lab Plan

## Purpose

CQC Lab is a controlled combat workshop inside Top Shot. It lets Kam approve close-quarter combat moves one at a time before those moves are promoted into the full match.

## Access

The live Top Shot build should expose a Lab button. The same lab can also be opened directly with:

```text
https://top-shot-prototype.onrender.com/?mode=cqc
```

## Required flow

- Main Match button returns to normal match mode.
- CQC Lab button enters the close combat lab.
- Lab spawns two fighters face to face.
- Lab disables parachute entry and long-range arena chaos.
- Lab uses a tight overhead drone camera.
- Lab keeps both fighters framed and close enough to see body contact.

## Approval workflow

1. Build or adjust one move in CQC Lab.
2. Kam tests it in the Render link.
3. Kam reports what feels right and what feels wrong.
4. If Kam says the move is approved, promote that move behavior into the main match systems.
5. Log the promotion in `top-shot/docs/CHANGELOG.md`.

## Initial lab actions

- Guard idle
- Jab
- Cross
- Block
- Parry
- Slip left
- Slip right
- Step back
- Reset spacing

## Long-term lab actions

- Clinch
- Throw
- Low kick
- Knee
- Elbow
- Wall pin
- Grounded recovery
- Weapon retention
- Disarm
- Finisher rehearsal

## Camera target

The CQC camera should feel like a drone hovering directly above the fighters, close enough to read the exchange but high enough to keep both fighters in shot.
