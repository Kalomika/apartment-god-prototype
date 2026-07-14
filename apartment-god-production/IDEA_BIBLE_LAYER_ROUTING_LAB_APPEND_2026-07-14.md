# Idea Bible Append, Layer Model and Lab Test Room Direction

Date: 2026-07-14
Branch: phaser-migration
Status: PLANNED PLUS PARTIAL RUNTIME GUARD
Canonical merge pending: yes

## Kam Direction Captured

- Nothing in Apartment God should feel like it disappears and reappears.
- Characters should move through physical entry and exit beats.
- Objects should be real blockers unless the action state specifically places the actor on, in, or under that object.
- The game should use layer based storytelling: a character can go under a blanket, into a shower foreground layer, or beneath a vehicle glass roof, but should not vanish from the world.
- Bed sleep needs blanket over body. Nap or relax can be on top of covers.
- Shower needs step in, steam and water state, sliding door foreground, then step out after the action finishes.
- Vehicle boarding needs a futuristic retracting or pivoting seat, the character sits, the seat reorients and pulls back inside, and the glass or sunroof lets the player see the character seated in the car while it moves.
- Bike, motorbike, ATV, and cars must all behave as real objects and must not be walk through space.
- The Secret Lab East test room should remain the controlled animation review room with a test man, test woman, and test dog, so movement, sit, walk, shower, bed, dog, and object interactions can be reviewed outside the full house chaos.
- The current lab man direction is closer to the desired human style, less cute and more mature. The woman and dog should be brought up to the same top down integrity standard.

## Layer Model Target

Final runtime layer order should become:

1. World background and floor texture.
2. Room wall and doorway masks.
3. Floor decor that never covers furniture.
4. Solid object base shapes.
5. Object active state layer, such as appliances, TV glow, shower steam, bed cover state.
6. Characters and carried items.
7. Object foreground layer, such as shower glass, blanket cover, car glass roof, door panels, retracting seat rails.
8. Reaction bubbles, action bars, and UI.
9. Global lighting and time of day overlays.

## Current Pass Scope

This pass adds a runtime collision correction and visual overlay safety layer. It is not the final layer architecture. It exists to stop the most obvious broken reads while the Phaser migration and proper sprite/layer model continue.

## Future Required Work

- Replace temporary collision correction patches with canonical object metadata in src/world.js.
- Replace main floor layer correction overlay with a true object layer compositor.
- Add actual shower entry, loop, exit animation states.
- Add bed sleep under cover and nap on top of cover states.
- Add vehicle boarding, seated, driving, return, and exit animation states per vehicle.
- Add lab test controls to trigger all major animation states for Test Man, Test Woman, and Test Dog.
