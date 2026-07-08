# Camera Navigation Checkpoint

This checkpoint records the first safe pass of the camera navigation overhaul.

Implemented in this pass:

- Floating translucent blueprint button on the left side of the game view.
- Floating translucent household locator button on the left side of the game view.
- Slightly translucent phone button and vertical buttons.
- Blueprint styled panel for same level main compound navigation.
- Character locator panel that moves the camera to a character without selecting them.
- Shared camera navigation function for view jumps.
- Quick visual transition overlay for same level slide and vertical movement.
- Documentation expanded for future full compound camera behavior.

Still pending:

- True world camera offset and actual room slide instead of first pass transition overlay.
- Door crossing driven slide when the selected character passes through attached area doors.
- Wall tap or drag to enter free roam camera mode.
- Edge pan or mouse edge camera movement.
- Front patio as an actual separate attached area.
- Garage to yard exterior route once the property boundary and fence are designed.

Important rule:

Do not treat garage or backyard as true floors. They are attached main level areas until the deeper compound camera exists.
