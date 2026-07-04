# Mechanics Test Run Summary

Branch: `basement-together-mechanics`

## Implemented in this run

- Added a visible courier/delivery flow for phone food orders.
- Food delivery no longer instantly raises hunger. A courier arrives at the front door, performs a short exchange, then hunger/fun update.
- Added stronger visible fridge feedback for snack/cooking prep. The fridge now displays a larger open panel with OPEN and SNACK/FOOD labels.
- Fixed cooking prep routing so cooking can start from other floors by routing to the actual fridge object instead of walking to wrong-floor coordinates.
- Added a first basement game room slice with a basement floor, rooms, stairs, pool table, arcade machine, console setup, dart board, couch, and basement light.
- Added object actions for pool, arcade, console games, and darts, including together variants.
- Added a first simple invite-consent layer for together object actions. Partners can say `yeah` or `not rn` based on distance, hearing range, current action, and urgent needs.
- Logged larger roadmap requirements separately in `GAMEPLAY_FEATURE_BACKLOG.md` on the roadmap branch.

## Not complete yet

- Full garage and vehicle system.
- Party selection UI with Done button and invite all/individual selection.
- Persistent construction timers that keep running while away.
- Full theater scene and movie memory.
- Full routine system and deep personality autonomy.
- True live browser playtest in this environment.

## Manual test targets

1. Click Phone: Food and confirm a courier appears near the front door.
2. Confirm the delivery phase appears in the HUD and hunger only improves after the exchange.
3. Click the fridge or Get food and confirm the fridge opens visibly.
4. Use the Basement button and confirm the basement floor renders.
5. Click basement objects and confirm pool, arcade, console, and darts actions start.
6. Try together actions and confirm the partner can respond instead of being blindly forced.
