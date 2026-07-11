## 2026-07-11 05:45 AM CT, Vehicle Camera Route and Seating Readability Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Commit: vehicle camera route 51d5deb831f8e6a52dc5bd2120d382976da6ebd2, vehicle labels 141bc8b39dbad013b2dc848dea86fbcee1ee0136, seated screen facing e1ea436b92810778dd80ad4f0b422844625b23b7
Files changed:
src/vehicleSystem.js
src/afterEntityOverlays.js
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-11_CAMERA_VEHICLE_SEATING_FIX.md
Runtime files changed: yes
Render playable branch updated: not yet in this run
Backup branch:
backup/phaser-migration-before-vehicle-clothing-world-polish-2026-07-10

Summary:
Patched the live mobile issues reported after the vehicle clothing world polish pass. The fix targets the camera sliding glitch during vehicle scenes, No route to vehicle during departure, unreadable black vehicle text, and seated characters appearing to face the wrong way while watching or using seated activities.

Implementation details:
- Vehicle departure and return now suspend selected character follow, clear active camera transitions, and keep the camera focused on the garage cinematic sequence instead of letting selected follow fight the vehicle view.
- Vehicle departure now has a forgiving route fallback. If a traveler cannot find a route to the assigned seat after rerouting, the cinematic handoff snaps them to the vehicle seat zone instead of leaving them stuck on No route to vehicle.
- Vehicle return restores selected follow after the return sequence finishes.
- Added high contrast gold vehicle labels with dark outlines above parked and active vehicles so SUV, CONV, BIKE, MOTO, and ATV text remains readable over any vehicle body color.
- Added a seated screen facing overlay so seated activities show a screen/object facing marker and back of head cue pointed toward the relevant TV, console, desk, bookshelf, or dining table instead of reading like the character is facing the player.

Testing performed:
Code inspection through GitHub file review only. No local build or browser test performed in this chat.

Testing requested:
After main is mirrored, test https://apartment-god-phaser.onrender.com on mobile. Recreate the Girlfriend vehicle trip from the garage, confirm the camera no longer splits or slides away, confirm No route to vehicle does not persist, confirm vehicle labels are readable, and confirm seated characters read as facing the TV or seated activity object.

Known risks:
The route fallback is intentionally cinematic and forgiving. If it feels too teleporty, tune the timeout or add a better doorway waypoint. The seated facing overlay is a visual correction layer, not a final sprite animation solution.

Follow ups:
Replace the procedural seating overlay with true top down seated sprite poses, full object based facing, and real couch/chair orientation per object when the sprite pipeline is ready.
