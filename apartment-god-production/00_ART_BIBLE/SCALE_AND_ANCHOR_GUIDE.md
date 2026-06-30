# Scale and Anchor Guide

This guide defines how sprites and environment assets should be anchored for stable gameplay placement.

## Anchor labels

Allowed anchor labels:

- body_center
- feet_center
- seat_center
- bed_center
- object_center
- joint_center

## Global scale rules

- Male, female, dog, furniture, rooms, and props must share one apartment scale.
- Adult human heads must not be enlarged for cuteness.
- Furniture must be scaled to adult bodies.
- Dog scale must be believable next to adult humans.
- Props must be readable without becoming larger than real objects.
- Related states must not pop in size.
- Anchor points should stay stable across A/B/C frames unless the state intentionally moves through space.

## Standing human sprites

Primary anchor:

```txt
feet_center
```

Use for:

- Idle standing.
- Walking.
- Running.
- Standing phone.
- Standing conversation.
- Standing joint states when feet placement matters.

Placement:

- Anchor sits between the feet at the ground contact point.
- Body mass should balance naturally over the anchor.
- Head, shoulders, torso, arms, legs, hands, and feet must stay adult-proportioned.
- The body may lean, but the anchor should not drift unless foot placement changes.

## Sitting human sprites

Primary anchor:

```txt
seat_center
```

Use for:

- Chair sitting.
- Desk sitting.
- Couch sitting.
- Table eating.
- Laptop desk use.
- Phone on couch.
- Reading while seated.

Placement:

- Anchor sits where body weight meets the seat.
- Legs may extend forward from the seat.
- Arms may reach to laptop, food, phone, book, table, or desk.
- Pose must match furniture scale and angle.

## Bed pose sprites

Primary anchor:

```txt
bed_center
```

Use for:

- Solo sleep.
- Wake bed.
- Sitting-on-bed transition.
- Cuddle bed.
- Sleep together.
- Private moment safe bed states.

Placement:

- Anchor aligns to the bed interaction center.
- Bodies must fit the bed at adult scale.
- Pillows, blankets, and body overlap must remain readable.
- Do not shrink or enlarge people to fit a bed drawing.

## Couch pose sprites

Primary anchor:

```txt
seat_center
```

Use for:

- Couch idle.
- Couch phone.
- Couch laptop.
- Couch eating.
- Cuddle couch.
- Watch TV together.

Placement:

- Anchor aligns with the couch seating area.
- Bodies should sit into the couch, not float above it.
- Knees and feet should respect the couch front edge.
- Joint couch states must match solo couch scale.

## Joint sprites

Primary anchor:

```txt
joint_center
```

Use for:

- Hug.
- Kiss.
- Cuddle couch.
- Cuddle bed.
- Sleep together.
- Watch TV together.
- Eating together.
- Comfort states.

Placement:

- Anchor sits at the visual center of the shared action.
- Both characters must remain adult-proportioned.
- Body overlap must feel believable from top-down.
- Shared action must read at gameplay scale.
- Do not use emoji shorthand or floating symbols to explain the action.

## Dog sprites

Primary anchor:

```txt
body_center
```

Use for:

- Idle.
- Sit.
- Sleep.
- Bark.
- Sniff.
- Eat.
- Drink.
- Play.
- Comfort.

Movement anchor:

```txt
feet_center
```

Use for walk and run cycles if runtime placement needs foot contact consistency.

Placement:

- Anchor should sit under the dog body mass.
- The dog must use realistic animal proportions.
- Tail and head movement can add life without changing body scale.
- Comfort states must align with the human or furniture pose being touched.

## Furniture and props

Primary anchor:

```txt
object_center
```

Use for:

- Tables.
- Desks.
- Appliances.
- Lamps.
- Bowls.
- Loose clutter.
- Screens.

Special anchors:

- `seat_center` for chairs, couches, and stools.
- `bed_center` for beds.

Placement:

- Anchor sits at gameplay placement center.
- Objects must align to apartment floor grid.
- Furniture footprints must support collision logic.
- Doorways must remain visually and mechanically clear.
- Clutter should support tone without hiding path readability.

## Manifest anchor format

Use this structure in manifests:

```json
{
  "anchor_point": {
    "label": "feet_center",
    "normalized_xy": [0.5, 0.86]
  }
}
```

The label defines gameplay intent. The normalized values define exact placement in the sprite canvas.

## Rejection triggers

Send an asset to rework if:

- Anchor changes between frames without reason.
- Sprite grows or shrinks between related states.
- Human sprite looks childlike, chibi, or toy-like.
- Dog sprite looks like a mascot or puppy icon.
- Furniture scale does not match adult humans.
- Action reads only from a side view.
- Top-down placement is unclear.
- Collision footprint cannot be understood.