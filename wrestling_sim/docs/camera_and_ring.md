# Camera And Ring Design

## Preferred View

The preferred match view is a fixed hard cam side view.

The ring is shown like a televised match, with the crowd in the foreground at the bottom of the screen. The game can show audience silhouettes, phones, flashes, hands, and barricade movement between the viewer and the ring.

## Why Not Pure Top Down First

A true bird eye view is clean for tactics, but it can flatten the drama of wrestling. Slams, rope runs, corner spots, taunts, and near falls need body language.

The hard cam view gives more character while still keeping the match readable.

## Movement Model

The match should use real 3D positions even though the camera is mostly fixed.

```text
The camera is side broadcast.
The ring is true 3D.
The wrestlers move through true 3D lanes.
The sim uses soft capture zones to avoid tedious alignment.
```

## Ring Zones

```text
center_ring
near_rope
far_rope
left_rope
right_rope
near_left_corner
near_right_corner
far_left_corner
far_right_corner
near_apron
far_apron
floor_hard_cam_side
floor_far_side
barricade_near
entrance_lane
```

## Grapple Alignment Rule

The wrestler does not need perfect manual alignment because this is a sim.

When the AI chooses a lockup, the system checks range, angle, facing, stamina, balance, and defender state. If the attempt is valid, both bodies are corrected into position through animation warping or a short contact step.

The viewer sees a believable approach and lockup instead of a visible snap.

## Hard Cam Event Logic

The camera should usually stay still, then react only for major moments.

Possible camera events:

```text
small push for signature move
slight shake for heavy slam
crowd flash burst for comeback
closer angle for pinfall
wide reset after impact
floor brawl follow only when both wrestlers spill out
```

## Future Visual Prototype

A first visual test can use simple capsules or mannequin wrestlers. The main test is whether the match reads from the hard cam and whether the AI makes believable contact.
