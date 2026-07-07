# Grapple Gods Top Down Line Art Direction

## Current Visual Target

The working visual target is clean top down line art, similar to architectural people symbols and hand drawn overhead pose sheets.

This is not photorealistic and not isometric.

The characters should read like real human bodies seen from directly above:

```text
faceless head shapes
visible shoulders
rounded torso silhouettes
thin arms with elbows and wrists
visible hands
staggered legs and small feet
simple gear shapes
small internal line details
thin gray or black outline
white or very light body fill
```

## What To Avoid

```text
chunky capsule toys
thick mechanical outlines
rubbery water wobble
isometric camera angle
side view faces
round stick figures
high contrast cartoon icons
```

## Phaser Implementation Rule

Until sprite sheets are generated, the Phaser prototype should draw wrestlers as procedural vector rigs using thin line work.

Each wrestler should be constructed from poseable parts:

```text
head
hair mass
torso
trunks
left upper arm
left forearm
left hand
right upper arm
right forearm
right hand
left thigh
left shin
left foot
right thigh
right shin
right foot
```

The renderer should use simple curved strokes and closed filled shapes instead of heavy capsule geometry.

## Motion Rule

Do not fake life with scale pulsing.

Movement should come from actual position changes, rotation, limb pose changes, and state specific silhouettes.

## State Silhouettes

```text
idle: arms down, slight athletic stance
closing distance: one leg forward, shoulders leaning
striking: one arm extends forward
lockup: both arms lift forward toward the opponent
grapple advantage: arms lifted, torso close, control ring marker if needed
selling: smaller reset stance or bent shape
downed: side lying top down silhouette
pinned: side lying or flat controlled silhouette
rope run: longer stride with feet offset
```
