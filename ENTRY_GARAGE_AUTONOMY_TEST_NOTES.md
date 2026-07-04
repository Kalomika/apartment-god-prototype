# Entry, Garage, Dog, and Autonomy Test Notes

Branch: `entry-garage-autonomy-fix`

## Added or fixed

- Main floor entry was expanded into a larger Entry / Foyer instead of leaving the lower-left area as dead empty space.
- Front door moved to the bottom edge of the foyer so it reads more like a real front exit.
- Front porch area added as a visible staging zone for future guests, packages, and delivery handoffs.
- Debug-looking travel chips were replaced with more architectural door placements where possible.
- Added pet flaps between the foyer and backyard so the dog can leave through a small pet route.
- Dog can now use stair/door transition objects, not only the bowl and kennel.
- Dog autonomy can randomly go to the backyard or kennel.
- Girlfriend autonomy is now much broader: bathroom, shower, food, TV, desk, couch, pool, arcade, console, treadmill, weights, swimming, kennel/dog, errands, mall, and rare work outings.
- Offsite travel now triggers a first visible garage departure sequence.
- Garage view is shown briefly when a character leaves for an offsite activity.
- Garage overhead door state opens during departure.
- A car visibly moves out of the garage during the departure sequence.
- Returning from offsite now places characters back near the foyer/front door area instead of the old left-wall door position.

## Manual test targets

1. Open Main House and inspect lower-left Entry / Foyer. It should feel less like dead blank space.
2. Confirm the front door is at the bottom edge of the foyer.
3. Wait in free/guided mode and check that Girlfriend eventually does more than hover around the fridge.
4. Watch for Dog using the pet route/backyard/kennel.
5. Use Cell Phone -> Travel and start an outing.
6. Confirm the view jumps to Garage and the garage door opens.
7. Confirm a car visibly moves out before the time-lapse finishes.
8. Confirm characters return near the foyer/front door area.

## Still not complete

- Full vehicle picker with car/bike/motorbike selection.
- Real front porch package queue.
- Real guest visitor arrival system.
- True movie theater scene.
- More polished car art.
