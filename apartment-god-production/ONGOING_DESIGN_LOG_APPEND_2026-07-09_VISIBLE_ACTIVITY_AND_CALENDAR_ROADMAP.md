## 2026-07-09 09:45 PM CT, Visible Activity Fixes and Calendar Roadmap

Status: NEEDS_TESTING for the fixes, PLANNED for the roadmap items
Branch: phaser-migration
Commit: latest implementation before this log append bf4ff3d45fe36eda2c68c1d157415053b976f363
Files changed: src/world.js, src/state.js, src/config.js, src/actions.js, src/renderEntities.js, src/renderHelpers.js, src/renderObjects.js, apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-09_VISIBLE_ACTIVITY_AND_CALENDAR_ROADMAP.md
Runtime files changed: yes
Render playable branch updated: pending main mirror
Backup branch: backup/phaser-migration-before-visible-activity-layout-pass-2026-07-09

Summary:
Kam tested the Render playable and found several visible issues that should be treated as real polish and gameplay readability bugs, not optional art opinions. This pass fixes the immediate visible issues and records the larger system direction for future scheduled agents.

Immediate fixes implemented in this pass:
- Fridge interaction now approaches from the south instead of the east so characters stop standing on or between the fridge and stove.
- Fridge object is slightly widened and marked as facing down.
- Fridge overlay now draws a south facing handle and open door flap rather than implying the usable side is east.
- Activity text under characters now gets a high contrast pill so it stays readable on bright floors and furniture.
- Couch or TV watching now uses a seated back view instead of making the character look like they are standing on the back of the couch.
- Phone activity now draws a small lit phone rectangle and glow on the character.
- Bedroom bed is now a wider king bed object instead of a full size bed.
- Morning reset bed positions are separated so the two people do not overlap awkwardly in bed.
- Bed overlay now has a headboard, two pillow zones, two sleep zones, and a messy cover layer when the bed is not made.
- Sleeping pose now draws a blanket layer over the person so sleep does not read as ordinary standing or stacked bodies.
- Added Make Bed as a bed action.
- Sleeping and private bed actions mark the bed messy, and Make Bed marks it made.
- Dog bed visual overlay was added so the dog bed reads as a bed rather than a gray rectangle.
- Render helper now supports stroked rounded rectangles so entity label and seated back view outlines can render safely.
- Career system work from the newer branch state was preserved. This pass did not overwrite the new career system, phone career menu, schedules, or HUD status.

Major roadmap recorded from Kam's direction:
- Build a real calendar system with days of week, weeks, months, years, and recurring dates.
- Convert trips and events from instant actions into bookable calendar items where applicable.
- Add phone calendar app as the primary place to book trips, movie tickets, work days off, flights, and planned events.
- Add time choices when booking events so the player can choose now or a future date and time.
- Make booked events respect work schedules, time off, missed shifts, late warnings, PTO, sick days, and responsibility consequences.
- Add fictional Apartment God world holidays instead of directly copying real world holidays with ugly historical baggage.
- Add placeholder adjacent holidays such as a love day, harvest or gratitude day, winter gift day, renewal day, and other holidays to be named later by Kam.
- Add character birthdays that recur each year and can trigger social or household events.
- Add holiday behavior rules such as feast cooking, table setting, house decorating, gift giving, music, movie nights, date nights, and family or guest events.
- Add a room or home personality panel near the selected info area, showing cleanliness, tidiness, comfort, light, mood, and maybe vibe or energy.
- Distinguish cleanliness from tidiness. Cleanliness is grime, dirt, muck, smell, and hygiene of the space. Tidiness is objects and clutter left around.
- Add gradual room dirt accumulation over days as characters and pets use the house.
- Add dirt tracking from outside to inside, especially after yard use, rain, pool, dog movement, and outdoor trash activity.
- Add dog hygiene or dog dirty level. Dirtier dogs should track more dirt through the house.
- Add dog bathing needs over a realistic multi day cadence instead of constant washing.
- Add an upstairs animal washing room or animal tub in unused upstairs hall space, especially for dog and possible future cat.
- Add bathroom sinks to both bathrooms so toilet use can correctly lead to wash hands and brush teeth.
- Make toilet use lower hygiene, eating lower hygiene slightly, sleeping lower morning hygiene, brushing teeth raise hygiene, hand washing raise hygiene, showering raise hygiene more.
- Add dirty toilet or bathroom cleanliness over time if hygiene systems become deeper.
- Add clean up day, likely weekly, where household members clean based on schedule, time at home, traits, and workload rather than assigning cleaning by gender.
- Actors should not idle as empty pawns. If they are idle, show thinking, planning, checking phone, deciding schedule, resting, observing, or some explicit reason.
- Actors should be able to autonomously use their own phone features. Anything the player can do for them through the phone should eventually become something they can decide to do for themselves if needs, schedule, personality, money, and phone battery allow it.
- Add actor phone battery life separate from the God or player phone.
- Actor phone use should drain phone battery.
- Add room charging sockets or small futuristic wall charging nodes in every room.
- Add visible phone charging prop when an actor leaves a phone charging, with a small phone rectangle and cord to the socket.
- Player God phone should remain always usable and override actor phone limitations.
- Add actor phone glow when they use their phone.
- Add phone based actions for booking movies, booking trips, booking flights, ordering food, checking schedule, applying for work, messaging, entertainment, and planning.
- Rename phone travel actions toward real life language such as Book Trip, Book Movie Ticket, Book Flight, or Book Date rather than generic Travel.
- Add calendar conflict checks before booking so work, chores, needs, and other planned events are not accidentally overwritten.
- Continue making every activity visibly read as an activity, not just a standing person near an object.
- Maintain and extend good existing activity direction: book in hand for reading, barbell motion for weights, steam for shower, pool waves, pool cue and rack, TV glow, console glow, and heavy bag impact.
- Add proper couch sit pose facing the TV direction, including a possible couple couch pose where one actor has an arm around the other.
- Add bed side logic so each actor uses a side of the bed, can sleep alone, sleep together, cuddle, watch phone movie, read, listen to music, lounge, or be lazy.
- Add made bed versus unmade bed states and require Make Bed if the bed is messy.
- Add bedroom entertainment options later, possibly wall screen or phone movie watching in bed.
- Add backyard chairs or sunlight lounging, with sunlight or vitamin D style restorative effects.
- Add direction specific character poses over time so actors can face north, south, east, and west instead of always looking like legs point south.
- Add full activity animations for sitting, desk work, boxing, swimming, getting in car, shower privacy, bed sleep, bed blanket, reading, phone use, eating, brushing teeth, washing hands, cleaning, and future activities.

Testing performed:
GitHub code inspection and compare only. No local npm build or Render browser test was performed in this chat.

Testing requested:
After main is updated, test https://apartment-god-phaser.onrender.com. Check kitchen fridge use, couch TV sitting, activity label readability, reset bedroom layout, two person bed spacing, visible covers while sleeping, Make Bed action, dog bed visual, and that Career / Work phone features from the newer career system still appear.

Known risks:
This pass changes renderer helper behavior, entity rendering, object overlays, bed size, fridge approach, and bed actions. The bed and couch pose are still procedural Canvas fallback art, not final sprite sheets. The larger calendar and phone autonomy systems are not implemented in this pass and are recorded as planned work.

Follow ups:
Before the next major system pass, create a new backup. Priority follow ups should be bathroom sinks and hygiene loop, calendar foundation, phone calendar booking, actor phone battery and charging props, room cleanliness and tidiness, dog dirty tracking, then the complete activity animation coverage pass.
