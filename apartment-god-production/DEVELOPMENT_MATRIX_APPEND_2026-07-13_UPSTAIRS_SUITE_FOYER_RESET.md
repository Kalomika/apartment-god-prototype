# Development Matrix Append, 2026-07-13, Upstairs Suite Foyer Reset

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-upstairs-suite-foyer-reset-2026-07-13

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| System Matrix | Upstairs room routing | NEEDS_TESTING | NEEDS_TESTING, corrected | Temporary lower guest bedroom removed from current upstairs screen. |
| System Matrix | Upstairs structure | NEEDS_TESTING | NEEDS_TESTING, corrected | Current upstairs now uses Primary Bedroom, Walk In Closet, Suite Foyer, Primary Suite Bath, Upper Hall, Upstairs Landing, Stairs, Office, and Guest/Hall Bath. |
| Object Interaction Matrix | Primary Suite Bath | NEEDS_TESTING | NEEDS_TESTING, relocated | Bath fixtures moved to larger lower suite bathroom area. |
| Object Interaction Matrix | Guest Bedroom | NEEDS_TESTING | REVERTED for current screen | Guest bedroom was removed from this cramped current upstairs layout. Future bedrooms belong in the expanded upstairs wing. |
| Object Interaction Matrix | Bedroom closet | NEEDS_TESTING | NEEDS_TESTING, corrected routing | Closet now routes to suite foyer and primary suite bath. |
| Asset Pipeline | Upstairs anime assets | PLANNED | PLANNED, blocked on final structure | Do not generate final upstairs room PNGs until larger east/west upstairs expansion is resolved. |

## Required browser checks

```txt
No boot error.
No blank canvas.
Upstairs lower left is Primary Suite Bath, not guest bedroom.
Suite foyer is visible between bedroom/closet/hall/bath.
Bedroom exits to hall, suite foyer, and closet.
Closet exits to suite foyer and primary bath.
Suite foyer exits to hall and primary bath.
Master bathtub, shower, sink, and toilet are clickable.
Stairs and upper hall pathing still work.
```

## Do not claim complete yet

```txt
expanded upstairs east/west wing
small Up/Down floor buttons
larger playable floor canvas
future two kids or guest bedrooms
upstairs lounge
final anime PNG room assets
browser verified routing
```
