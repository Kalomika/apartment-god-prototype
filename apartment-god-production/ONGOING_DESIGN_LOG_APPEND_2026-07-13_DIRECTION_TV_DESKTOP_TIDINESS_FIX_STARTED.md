# Ongoing Design Log Append: Direction TV Desktop Tidiness Fix Started

Status: IN_PROGRESS
Branch: phaser-migration
Date: 2026-07-13
Runtime files changed: in progress
Render playable branch updated: no
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-direction-tv-desktop-tidiness-fix-2026-07-13

## Current bug/directive batch logged before execution

Kam reported the following current live issues and directives:

- Back-facing walking exists now, but walking south/down can still show the back silhouette, creating a moonwalk/backwards-walk problem.
- North/back walking was needed, but direction switching must be correct for north, south, east, west, and diagonal movement.
- A character appears seated or parked in the middle of the upstairs master/office floor without readable purpose.
- A TV light/beam appears on when nobody appears to be watching, so TV light must only appear when the matching TV is actually in use or intentionally left on.
- A small loose object near the right wall upstairs is unclear and looks like clutter or a bug. It must be identified or moved/removed.
- Dining activity still does not convincingly seat the actor on an actual chair/stool and must align to the chair position, not hover at the table edge.
- Character visual style still reads too side-view compared with true top-down rooms. This is a broader sprite/art issue and should be logged as planned if not fully solved here.
- Stairs still read like separate outlined objects rather than integrated architecture. Improve readability only if safe in this pass.
- Desktop layout currently leaves the utility/app icons in a horizontal scroller, causing hidden icons and a tiny slider. On wider desktop layouts, the utility icons should orient vertically so they stay visible.
- Mobile portrait should keep the horizontal bottom row, and landscape/wide layouts should adapt so controls do not disappear.
- House tidiness should become a real game mechanic: higher tidiness increases the efficiency or reward of activities in the house, while lower tidiness reduces replenishment/reward rates for sleep, food, fun, learning/reading, workouts, and other activities so messiness matters.
- Tidiness should pressure characters to auto-fix the house because bad tidiness becomes a gameplay penalty.

## Immediate implementation scope

This pass will safely patch current bugs where possible:

- Fix movement heading vector so south/down walking does not reuse north/back silhouette.
- Tighten TV-light logic so beams require a watcher near the specific TV or a deliberate on-state.
- Improve dining chair approach/alignment for eating.
- Move or remove unclear loose book/clutter upstairs.
- Add responsive desktop utility layout so utility icons are vertical on wide desktop/tablet views.
- Add a first-pass tidiness effect helper if it can be safely connected without destabilizing need math.

## Deferred/planned scope

- Final true top-down character PNG sprites for all directions.
- Full art replacement for stairs and seating with proper top-down object assets.
- Full tidiness personality/autonomy loop with partner annoyance and household mood consequences.

## Reason for this log

Kam requested that every idea and bug batch be recorded in the repository before execution so another AI can search the repo and continue the work without relying on chat memory.
