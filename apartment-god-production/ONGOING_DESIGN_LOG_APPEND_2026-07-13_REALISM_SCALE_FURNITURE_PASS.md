## 2026-07-13 04:05 AM CT, Realism Scale Furniture Correction Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: realism visuals 85c56684f79ce17e8ca54a3bd4e6b5317ae6fa34, renderer wire 12cf5c94b83066e6dc0e6d15a275a088f2aa12b6, config scale and sink wording d354fbc8d1a8b1abbf6e7d46c156c95ec9052d74
Files changed: src/realismCorrectionPass.js, src/rendering.js, src/config.js, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_REALISM_SCALE_FURNITURE_PASS.md
Runtime files changed: yes
Render playable branch updated: pending main mirror after compare
Backup branch: backup/phaser-migration-before-realism-scale-furniture-pass-2026-07-13

Summary:
Added a focused visual correction layer for Kam's realism feedback from the live Render screenshots. The pass pushes furniture and activity visuals away from kid cartoon placeholders and toward clearer adult top down household construction without replacing the full sprite pipeline.

Implementation details:
- Added `src/realismCorrectionPass.js` and wired it into `src/rendering.js`.
- Runtime correction pass mutates existing object positions before render so current systems use corrected layout targets without rewriting all of `world.js`.
- Repositioned the living couch target and redrew it as a larger L sectional oriented toward the wall TV, with cushions, back rail, chaise, shadow, and more material layering.
- Repositioned the dining table lower and wider, then drew six chairs around it with table settings so it no longer reads as a bare table.
- Repositioned the coffee maker to the kitchen wall area and redrew it as a wall counter appliance with brew light, carafe, and steam when active.
- Redrew the fridge with a single readable open state inside the fridge footprint to avoid the doubled side and bottom opening problem.
- Added more porch land color, moved porch chair visuals away from the door and pet exit, and oriented them outward from the house.
- Added sink visual cues for hand washing, grooming, and brushing teeth by strengthening the sink overlay and changing the sink menu wording to `Wash Hands / Groom` plus `Brush Teeth`.
- Added larger shower steam cloud behavior, a faster moving shower door cue, and less blob like folded clothes plus towel treatment.
- Reinforced bed scale visually and added stronger blankets over sleepers during sleep, nap, waking, and bed together states.
- Reinforced walk in closet side clothing aisles and center storage.
- Reinforced architectural stair wells with integrated step shading and dark ascent or descent pockets.
- Reinforced arcade machine art and active arcade hand cues.
- Reduced `ENTITY_RADIUS` from 18 to 16 to make movement and collision fit better with object scale. The procedural actor sprite still needs a dedicated scale pass in `renderEntities.js` or full sprite replacement.

Testing performed:
Code inspection through GitHub file review only. No local npm build, browser boot, or Render test performed in this chat.

Testing requested:
After main is mirrored, open https://apartment-god-phaser.onrender.com on mobile and hard refresh. Test boot, living room couch orientation, dining table and chairs, coffee maker wall placement, fridge open state, porch chair placement, sink menu wording, shower steam and clothes, upstairs bed blankets, walk in closet aisles, basement arcade, and basic movement around the edited objects.

Known risks:
This pass is a visual and runtime correction layer over the current procedural Canvas renderer. It improves visible structure without being the final PNG or sprite implementation. Because it mutates object positions at render time, old saves should still load, but browser testing is required. Actor visual size is only partially addressed through collision radius, not full body drawing scale.

Follow ups:
Patch `renderEntities.js` or the future sprite pipeline to reduce actor body size visually, add object specific seated poses, add full car seat pop out animations, add true stair stepping and scale transitions, and replace procedural furniture with approved top down PNG assets when the asset pipeline is ready.
