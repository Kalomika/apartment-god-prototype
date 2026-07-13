# Development Matrix Append, 2026-07-13, Realism Scale Furniture Correction Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Canonical matrix merge: pending next safe documentation sync

Rows that must be updated in `apartment-god-production/DEVELOPMENT_MATRIX.md`:

```txt
System Matrix
- Lived in activity object pass: NEEDS_TESTING. Add note that realism correction pass overlays L couch, dining chairs, wall coffee maker, fridge single open state, porch chair placement, shower steam, bed cover reinforcement, walk in closet rows, stairs, and arcade cue.
- Movement and pathfinding: NEEDS_TESTING. Add note that `ENTITY_RADIUS` was reduced from 18 to 16 for improved scale and maneuverability, but actor visual scale still requires renderEntities or sprite pipeline correction.
- Wardrobe, clothing, and towels: NEEDS_TESTING. Add note that folded clothes/towel overlay was improved, but final clothing assets are still not implemented.
- Vehicles and travel options: NEEDS_TESTING. Add note that car seat pop out sequence and one side door logic remain planned follow up, not implemented in this pass.

Object Interaction Matrix
- Couch: NEEDS_TESTING. Visual correction now redraws living couch as an L sectional oriented toward the wall TV. Still procedural overlay, not final PNG.
- Dining table: NEEDS_TESTING. Visual correction shows six chairs and table settings, table target moved down and wider through runtime correction layer. Test pathing.
- Coffee maker: NEEDS_TESTING. Visual correction moves appliance toward kitchen wall and redraws it with brew light/steam.
- Fridge: NEEDS_TESTING. Visual correction covers old doubled opening and draws a single internal open state.
- Shower: NEEDS_TESTING. Visual correction adds stronger steam, faster sliding door cue, folded clothes, and towel overlay.
- Sink: NEEDS_TESTING. Sink menu now says Wash Hands / Groom and Brush Teeth. Visual sink cue strengthened.
- Bed: NEEDS_TESTING. Visual correction adds stronger blankets over sleepers and more realistic bed scale. Shared sleep still needs browser test.
- Walk in closet: NEEDS_TESTING. Visual correction adds clothing aisles/side racks and center storage.
- Stairs: NEEDS_TESTING. Visual correction redraws stairs as architectural stair wells with step shading and dark ascent/descent pockets.
- Arcade machine: NEEDS_TESTING. Visual correction adds active arcade screen/glow and hand cues.

Animation Matrix
- Sit: NEEDS_CORRECTION. Object specific seating still needs true sprite/body orientation. Visual correction improves furniture and props but does not fully solve actor seated scale.
- Read: NEEDS_TESTING. Book in hands cue reinforced for reading actions.
- Shower: NEEDS_TESTING. Steam and sliding door cue reinforced. Final shower animation still needed.
- Stairs: NEEDS_CORRECTION. Architectural stair visuals added, but actual step by step character scaling transition remains planned.
- Vehicle door/open sequence: NEEDS_CORRECTION. The requested futuristic pop out seat and one side door sequence remains planned, not implemented in this pass.
```

Testing requested:
Open https://apartment-god-phaser.onrender.com after main mirror and test boot, living couch, dining set, coffee maker, fridge open state, porch, shower, sinks, bed, closet, stairs, arcade, and movement clearance.
