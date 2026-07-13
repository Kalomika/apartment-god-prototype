# Development Matrix Append, 2026-07-13, Suite Door Vanity and Office Fix

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-suite-door-vanity-office-fix-2026-07-13

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| System Matrix | Upstairs room routing | NEEDS_TESTING | NEEDS_TESTING, corrected | Wrong direct bedroom to hall gap removed; suite foyer to hall egress restored. |
| Object Interaction Matrix | Suite Foyer | NEEDS_TESTING | NEEDS_TESTING, corrected | Suite foyer now acts as private vanity connector with bedroom, hall, and bath routes. No closet pass-through. |
| Object Interaction Matrix | Primary Double Vanity | PLANNED | NEEDS_TESTING | Added counter-style double vanity fallback on wall instead of center-room standalone sink. |
| Object Interaction Matrix | Office Couch | NEEDS_TESTING | NEEDS_TESTING, corrected orientation | Couch now faces west toward the computer area. |
| Object Interaction Matrix | Book Library | NEEDS_TESTING | NEEDS_TESTING, moved | Library/bookshelf moved from downstairs to upstairs office. |
| Visual Matrix | Seated direction guide overlay | PARTIAL | REMOVED | Removed cyan facing guide triangle that looked like TV beam spam. Back-facing seated overlay remains for north-facing seats. |
| Visual Matrix | Procedural fallback objects | PARTIAL | PARTIAL, NEEDS_TESTING | Added vertical couch and vanity counter fallback support only until final PNGs exist. |
| Asset Pipeline | Upstairs assets | PLANNED | PLANNED, still blocked | Do not generate final PNGs until current room routing and fixture placement pass browser review. |

## Required browser checks

```txt
No boot error.
No blank canvas.
Bedroom to suite foyer works.
Suite foyer to hall works.
Bedroom exits through suite foyer to hall.
Wrong direct bedroom-to-hall opening beside the suite foyer is closed.
Suite foyer does not open into closet.
Closet to primary bath works.
Suite foyer to primary bath works.
Double vanity is on a wall, not in the middle.
Office couch faces the desk/computer side.
Book library is upstairs in office and not downstairs.
No cyan TV/facing debug beam remains.
```

## Do not claim complete yet

```txt
browser verified upstairs routing
final top-down double vanity PNG
final top-down office couch PNG
final top-down library PNG
larger upstairs expansion
small floor navigation arrows
```
