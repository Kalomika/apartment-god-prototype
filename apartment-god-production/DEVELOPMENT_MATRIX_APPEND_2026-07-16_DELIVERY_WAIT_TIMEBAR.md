# Development Matrix Append, Delivery Wait Time Bar

Date: 2026-07-16
Branch: mechanics/delivery-wait-timebar-20260716
Status: NEEDS_TESTING

## Mechanics Update

Food delivery now keeps the ordering actor on a visible timed action during the full courier arrival phase.

Before this change, the delivery job had a seven second arrival timer, but the actor did not receive matching action time values. The visible action bar could therefore disappear while the courier was still traveling.

The arriving phase now synchronizes the actor action timer to the delivery job timer every update. The handoff phase also resets to an exact four second receiving timer before the existing six second eating phase begins.

Hunger still changes only after the eating phase finishes.

## Required Test

1. Order food from an actor with reduced hunger.
2. Confirm a visible Waiting for food delivery time bar remains active until the courier reaches the porch.
3. Confirm the action switches to Receiving food delivery with a fresh four second bar.
4. Confirm the door opens during the exchange and closes before eating.
5. Confirm Eating delivered food runs for six seconds.
6. Confirm hunger does not increase during waiting or receiving.
7. Confirm hunger increases only after eating completes.
8. Confirm the food bag is cleared and delivery state ends after the meal.

## Safety Notes

Render settings were not changed.
Main was not modified.
No deployment was triggered.
