## 2026-07-09 03:35 AM CT, Route Layout Vehicle Recovery and Morning Start Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: latest implementation before this log append 002caf6e01ca7c2932259f51c771c121ec33050c
Files changed: src/world.js, src/blueprint.js, src/movement.js, src/vehicleSystem.js, src/canvasRuntime.js, src/state.js, src/config.js, src/actions.js, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-09_ROUTE_LAYOUT_VEHICLE_MORNING.md
Runtime files changed: yes
Render playable branch updated: pending main mirror
Backup branch: backup/phaser-migration-before-route-layout-vehicle-fix-2026-07-09

Summary:
Applied Kam's urgent routing and layout corrections after Render testing showed the dog still using the front route to the backyard, vehicle departure stalling near the ATV with a misleading Waiting at vehicle state, the Recovered label still surfacing, and the main floor feeling cramped around the dining table and room walls. Also added the first safe morning reset correction so the household starts the day in bed instead of the foyer.

Implementation details:
- Disabled the front and yard pet flaps as floor travel portals. They remain visible door style objects, but are no longer used as backyard travel links.
- Forced house to backyard travel through the real back door pair, `backyard_door` and `yard_back_door`, including dog routing.
- Added guard checks so only real stairs objects with valid `toFloor` can complete floor travel.
- Widened the main floor living to kitchen opening and the living/kitchen to foyer openings so the main floor behaves more like one open section instead of cramped wall choke points.
- Turned the dining table vertical and placed it into the former wall zone so it no longer sits awkwardly in the kitchen path.
- Moved the dog bowl to the lower right foyer area.
- Added an indoor dog bed beside the bowl in the lower right foyer area.
- Reset now starts at 6:45 AM with both people upstairs in bed, lower morning hygiene, lower bladder, and greeting bubbles.
- Dog now starts on the indoor dog bed instead of the middle of the foyer or kitchen.
- Renamed the visible `Freshness` need label to `Hygiene` while keeping the internal `freshness` key to avoid breaking existing systems.
- Toilet use now lowers hygiene slightly, so bathroom use has a hygiene consequence.
- Eating at the table now lowers hygiene slightly, giving brushing and grooming more design purpose.
- Dog bed now has a dog rest action and the dog is allowed to use it.
- Vehicle boarding now tries multiple fallback seat approach points instead of failing near the ATV or neighboring vehicles.
- Vehicle status now only says Waiting at vehicle if the actor is actually near the assigned seat or vehicle. Failed routing shows No route to vehicle instead of pretending boarding is ready.
- If a traveler reaches the correct vehicle area but route math is blocked by another vehicle, the system snaps them to their assigned seat point so departure can continue.
- Removed the player facing Recovered actor label from the global runtime error catch. Runtime errors now clear actor movement and show a save status message instead of leaving characters labeled Recovered.

Jobs and schedule check:
- Current repo has partial work support through offsite travel. `work` exists as a destination with a duration, money reward, and career perk counters.
- Current repo has `state.careers` counters and reward perks from work.
- I did not find a complete phone or laptop career menu, multiple job listings, self scheduled shifts, or full daily job planner in runtime files during this pass.
- Full career search, job selection, scheduled shifts, and personal day planning are still planned follow ups.

Testing performed:
GitHub file inspection and compare only. No local npm build or Render browser test was performed in this chat.

Testing requested:
After main is updated, test https://apartment-god-phaser.onrender.com. Reset first. Confirm the game starts upstairs in bed, both people say a morning greeting, dog starts by the indoor dog bed and bowl in the lower right foyer, the main floor is more open, the dining table is vertical in the former wall zone, the dog no longer uses the front pet flap to reach the backyard, backyard travel uses the real back door, car work departure reaches and boards the chosen car instead of stopping at the ATV, and Recovered no longer remains as a visible selected activity.

Known risks:
This touches core routing, travel, state reset, and action consequence code. The dog bed may need a dedicated higher quality visual rendering pass. The dining table placement may need one more visual nudge after mobile testing. The morning routine is only a safe reset start state right now, not a complete scripted morning routine.

Follow ups:
Add bathroom sinks to both bathrooms, add brush teeth and wash hands routines at bathroom sinks, build a real morning routine sequence, convert Freshness to a true Hygiene system more deeply, add dirty toilet or bathroom cleanliness state, add a phone or laptop job search menu, add selectable jobs, add scheduled shifts, and add personal day planning so actors estimate whether they have time for activities before work or errands.
