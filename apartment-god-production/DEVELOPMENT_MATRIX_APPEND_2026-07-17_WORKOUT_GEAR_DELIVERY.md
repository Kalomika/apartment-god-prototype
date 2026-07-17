# Development Matrix Append, Workout Gear Delivery

## Mechanics change

Workout gear no longer appears instantly after purchase.

The purchase now creates a staged delivery job using the existing delivery system:

1. Twelve second arrival wait with a visible action timer.
2. Five second doorstep exchange with the front door open and boxes carried.
3. Fifteen second indoor setup phase with a visible action timer.
4. Workout gear is added to the living room only after setup finishes.

The flow blocks duplicate workout gear orders and blocks ordering while another delivery is active. Food delivery also keeps its arrival action timer synchronized with the courier timer.

## Safety

Branch only. Main was not changed. Render settings were not changed. No deployment was attempted.

## Verification still needed

Run the game in a browser and confirm:

1. Money is deducted once.
2. Gear is absent during arrival and exchange.
3. The delivery person and speech bubble remain visible through the expected phases.
4. The front door opens for exchange and closes for setup.
5. The action bar resets correctly for each phase.
6. Gear becomes solid and interactable only after installation completes.
7. Food delivery still completes through arrival, exchange, eating, and hunger gain.
