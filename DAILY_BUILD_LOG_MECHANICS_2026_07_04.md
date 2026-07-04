# Daily Build Log, 2026-07-04 Mechanics Test

## Focus

Mechanics first. Sprites are temporarily deprioritized until interactions, house systems, service NPCs, autonomy, memory, and activity flows are reliable.

## Changes

- Added visible courier flow for phone food orders.
- Replaced instant food order stat gain with an arriving courier, door exchange, and post-exchange hunger/fun update.
- Improved fridge visual feedback so snack/cooking prep visibly opens the fridge with a larger cyberpunk-lit panel.
- Fixed cooking prep routing so cooking can start from upstairs or other floors by routing to the fridge object.
- Added first basement game room slice with basement floor, rooms, stairs, cyberpunk pool table, arcade machine, console setup, dart board, couch, and basement light.
- Added basement game actions and together variants for pool, arcade, console, and darts.
- Added first-pass invite consent for together object actions. Partners can accept with `yeah` or refuse with `not rn` based on urgent needs, current action, and hearing distance.
- Added feature backlog to the mechanics branch so future agents can see the full task list.

## Manual test targets

- Phone: Food should create a visible courier near the front door.
- Hunger should improve after the exchange, not instantly on order.
- Fridge snack/cooking prep should show an obvious open panel.
- Cooking should work even when started from upstairs.
- Basement button should show the basement game room.
- Basement objects should expose actions.
- Together activities should not blindly force a busy or distant partner.

## Known limitations

- This environment could not clone GitHub for a local npm build because github.com DNS was unavailable.
- No Render deploy was triggered in this branch.
- Garage, vehicle selection, full invite picker, persistent construction timers, theater scene, movie memory, and deep routines are still backlog items.
