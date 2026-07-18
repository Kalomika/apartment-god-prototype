# Grapple Gods Hard Cam Sprite Direction

## Active Visual Pivot

The active playable graphics direction is now a side view hard cam wrestling game with a sprite based pipeline.

The previous top down graphics experiment is no longer the active playable target.

## Current Ring Approval Step

Before wrestler sprites, move animations, or character likeness work, the ring must be approved.

The current hard cam proof should show:

```text
painted side view arena
hard cam wrestling ring pushed farther from camera
background crowd layer
ring layer
foreground crowd layer
white canvas
black ropes
visible turnbuckles
corner posts
front apron
8 fps visual cadence
no wrestlers yet
```

## Visual Target

The target is closer to classic side view wrestling games in camera structure, but with Grapple Gods' own visual style:

```text
more realistic proportions
painted video game look
not arcade parody
not toy proportions
not top down symbols
sprite oriented characters later
8 fps animation cadence
```

## Crowd Direction

Crowd must not be runtime dot noise or procedural circles.

Use authored sprite plates:

```text
background crowd A frame
background crowd B frame
foreground crowd A frame
foreground crowd B frame
```

Later states should expand from this layered setup:

```text
neutral seated
clapping
standing cheer
booing
big eruption
phone lights
```

No WWE, AEW, or real world logos should be copied into the assets. Live wrestling crowds can be used only as composition reference.

## Sprite Pipeline Direction

After ring approval, characters should move to a full sprite pipeline:

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

The renderer should support authored sprite sheets first, with procedural drawing only for tooling or fallback.

## Current Implementation Note

The playable arena currently uses:

`wrestling_sim/web_phaser/src/render/HardCamSpriteRingRenderer.js`

That renderer displays layered sprite plates only. It intentionally hides wrestlers until the hard cam ring and crowd direction is accepted.
