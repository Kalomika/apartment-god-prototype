# Full Throttle Test Notes

Branch: `house-mechanics-expansion`
PR: #17

## Checkpoint 1, merged test slice

Added or fixed:

- Cell Phone Shop and Acts tabs now render full button lists in the phone panel instead of looking like a single-option screen.
- Cell Phone Travel tab now has a party picker: choose an outing, invite individuals or all household members, then press Done.
- Floating down-floor button now cycles from Main to Basement to Garage to Backyard instead of only returning to main.
- HUD floor buttons now include Main, Upstairs, Basement, Garage, and Backyard.
- Garage area added with car, second car slot, bicycle, and motorbike.
- Backyard added with pool, outdoor trash bin, and dog kennel.
- Basement gym equipment added: treadmill, weight bench, heavy bag.
- Garbage mechanics added: food delivery, snacks, meals, TV/movie popcorn can create trash.
- Kitchen trash level is tracked and shown in HUD/status.
- Trash odor can reduce freshness when trash gets high.
- Characters can take kitchen trash outside to the backyard outdoor bin.
- Characters now visibly carry food bags, wrappers/dishes, trash bags, and dog ball.
- Fetch ball now visibly leaves the character before the dog chases it.
- More build items are recognized: treadmill, weight bench, heavy bag, trash can, kennel.
- Doorways/pathing expanded for basement, garage, and backyard.

## Manual test pass

1. Open Cell Phone, then Shop. Confirm multiple options appear.
2. Open Cell Phone, then Acts. Confirm multiple options appear.
3. Open Travel, choose Movie Theater, invite someone, then press Done.
4. Use floating Down Floor from main and confirm it cycles to Basement, Garage, Backyard.
5. Use HUD buttons for Garage and Backyard.
6. Order food and confirm trash increases after eating.
7. Use Acts, Take trash out. Confirm character carries a trash bag to the outdoor bin.
8. Try treadmill, weight bench, heavy bag, pool, and kennel actions.
9. Start fetch and confirm the ball appears before the dog chases it.

## Known risk

This was a large runtime patch and needs browser testing on Render.
