# Top Down Visual Style

## Updated Phase 1 Direction

The first playable visual version should use an absolute top down view.

This means the camera looks straight down at the ring and wrestlers, like a clean overhead diagram. No hard cam implementation is needed for the first visual pass.

The current look target is simple black and white line art.

```text
white background
white ring canvas
black line ring detail
black line wrestler sprites
minimal shadows if needed for readability
no color required for phase 1
no cartoon exaggeration beyond readable top down body silhouettes
```

## Ring Look

The ring should be a very simple overhead drawing.

Use the uploaded reference ring images only as layout references, not as final visual style. The first version should avoid the bright blue, red, yellow, and gray colors from the references.

Target ring style:

```text
white mat
thin black outline
three or four rope lines per side
simple corner pads drawn as black outline shapes
simple post marks at the corners
clear square interior
clean readable border
```

The ring should feel like a sketch, blueprint, or storyboard panel, not a rendered 3D object.

## Wrestler Sprite Look

The wrestler sprites should match the overhead people references.

The bodies should be simple top down line figures with:

```text
round or oval head
simplified shoulders
simple torso block
clear arm shapes
clear leg shapes
minimal facial detail or no face
gear suggested by outline shapes
body type suggested by silhouette width and proportions
```

The sprites should be black line art on a white or transparent background.

The first pass should focus on readability, not character detail.

## Body Type Readability

Because the camera is straight overhead, likeness should come from silhouette and gear, not faces.

Use:

```text
large shoulders for powerhouse wrestlers
wide torso for giants
lean narrow frame for high flyers
compact stance for technicians
stance asymmetry for brawlers
hair mass shape where useful
boots, trunks, singlets, pads, and wrist tape as simple line details
```

## Animation Sprite Requirements

The first animation set can be pose based rather than fully animated.

Minimum pose set:

```text
idle stance
walk or shuffle north
walk or shuffle south
walk or shuffle east
walk or shuffle west
circle opponent
lockup start
lockup held
grapple advantage
strike pose
recoil or sell pose
downed face up
downed face down
pin attempt
submission hold
rope contact
corner contact
recover pose
taunt pose
```

The top down references of people sitting, sleeping, working, and moving are useful because they show how much body language can be communicated from above with very few lines.

## Interaction Screen

The screen should be structured like this:

```text
top down match view
simple white ring with black line ropes
black line wrestler sprites

choice tray under the match screen
contextual manager choices
let wrestler decide option
match log or short commentary line
```

The player is still a manager or coach, not a direct action controller.

## Style Lock

For the current prototype, this replaces the earlier realistic 3D hard cam look as the active development target.

Hard cam can remain a future alternate view, but the immediate test should be:

```text
absolute top down
black and white
line art
simple ring
simple sprites
manager choice UI below the match
```

## Uploaded Reference Notes

The current planning chat included references for:

```text
overhead wrestling ring layout
simple top down ring readability
top down human pose language
black line overhead people sprites
minimal faceless figure construction
sitting and standing overhead figure examples
```

Those images should guide the visual language. The repo currently records the direction in text. Actual reference image files can be committed later in an asset reference folder if needed.
