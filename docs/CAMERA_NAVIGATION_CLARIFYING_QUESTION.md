# Camera Navigation Clarifying Question

One item needs owner confirmation before deeper implementation:

Should the floating blueprint show only attached same level areas, or should it also include Up and Down options when stairs exist on that layer?

Current first pass behavior:

- Main compound layer blueprint shows Main House, Backyard, and Garage.
- Upstairs and basement show blueprint unavailable because there are no attached same level exterior areas there yet.
- Up and Down remain separate vertical controls.

Reason for asking:

The requested behavior said the blueprint should show only rooms attached to the current layer, and also said the button can be grayed out when the layer has no attached rooms. That supports the current first pass, but it is worth confirming before deeper camera work.
