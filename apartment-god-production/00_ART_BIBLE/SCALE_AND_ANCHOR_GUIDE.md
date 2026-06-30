# Scale and Anchor Guide

This guide defines how Apartment God Prototype sprites should be scaled and anchored before they enter production review.

The goal is stable gameplay placement. Sprites can have rich linework, but they must not slide, pop, or change world scale between states.

## Anchor Labels

Use these anchor labels in manifests:

- body_center
- feet_center
- seat_center
- bed_center
- object_center
- joint_center

## General Scale Rules

- Male, female, dog, furniture, and room assets must share one apartment scale.
- Adult human heads must not be enlarged for cuteness.
- Furniture must be scaled to adult bodies.
- Dogs must be scaled against the humans, not against icon art.
- Props must be readable without becoming larger than believable real objects.
- Every animation should preserve the same anchor label across the full state unless the manifest clearly explains a state transition.

## Standing Human Sprites

Primary anchor:

`feet_center`

Use for:

- Idle standing.
- Walk.
- Run.
- Standing phone states.
- Standing conversation states.

Placement:

- The anchor sits between the feet at the ground contact point.
- The body should balance naturally over the anchor.
- The head, shoulders, torso, arms, and legs must stay adult-proportioned.
- The sprite may lean, but the anchor should not drift unless the feet actually move.

Secondary review point:

`body_center`

Use `body_center` in notes to check targeting, collision, and visual centering.

## Sitting Human Sprites

Primary anchor:

`seat_center`

Use for:

- Chair sitting.
- Desk sitting.
- Couch sitting.
- Table eating.
- Laptop desk use.

Placement:

- The anchor sits at the center of weight where the body meets the seat.
- Legs can extend beyond the anchor.
- Arms can reach to a laptop, food, phone, or table prop.
- The pose must match the scale and angle of the furniture.

## Bed Pose Sprites

Primary anchor:

`bed_center`

Use for:

- Solo sleep.
- Wake up.
- Cuddle bed.
- Sleep together.
- Private moment safe states.

Placement:

- The anchor aligns to the center of the bed interaction area.
- Human bodies must fit the bed at adult scale.
- Pillows, blankets, and body overlap must remain readable.
- Do not shrink or enlarge people just to fit the bed art.

## Couch Pose Sprites

Primary anchor:

`seat_center`

Use for:

- Couch idle.
- Couch phone.
- Couch laptop.
- Couch eating.
- Cuddle couch.
- Watch TV together.

Placement:

- The anchor aligns with the couch seating area.
- Bodies should sit into the couch, not float above it.
- Feet and knees should respect the couch front edge.
- Joint couch states must match the same couch scale as solo sitting states.

## Joint Pose Sprites

Primary anchor:

`joint_center`

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

- The anchor sits at the visual center of the shared action.
- Both characters must remain adult-proportioned.
- Bodies must overlap believably.
- The state must read as a shared action from top-down gameplay scale.
- Avoid emoji pose language and exaggerated cartoon acting.

## Dog Sprites

Primary anchors:

`body_center` for idle, sit, sleep, bark, sniff, eat, drink, play, and comfort states.

`feet_center` for walk and run states when the dog needs movement alignment.

Placement:

- The anchor should stay stable under the dog mass.
- The dog must feel like a real animal, not a mascot.
- Tail and head motion can add life, but they should not change body scale.
- Dog comfort states must align to the human pose or furniture state they touch.

## Furniture and Prop Sprites

Primary anchor:

`object_center`

Use for:

- Tables.
- Desks.
- Lamps.
- Appliances.
- Bowls.
- Clutter objects.
- Loose props.

Special anchors:

`seat_center` for chairs, couches, and stools.

`bed_center` for beds.

Placement:

- The anchor sits at the gameplay placement center.
- Objects must align to the apartment floor grid.
- Props should not hide playable characters unless intentionally layered.
- Clutter should support tone while preserving path readability.

## Anchor Data Format

Use a normalized anchor point in manifests.

Example:

```json
{
  "anchor_point": {
    "label": "feet_center",
    "normalized_xy": [0.5, 0.86]
  }
}
```

The label defines the intended gameplay anchor. The normalized values define the exact pixel placement inside the sprite canvas.

## Rejection Triggers

Send the asset to rework if:

- The anchor changes between frames without reason.
- The sprite grows or shrinks between related states.
- The character looks like a child or chibi figure.
- Furniture scale does not match adult humans.
- The action reads only from a side view.
- The top-down placement is unclear.
