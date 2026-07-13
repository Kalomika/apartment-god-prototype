# Development Matrix Append, 2026-07-13, Master Bath and Office Correction

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-master-bath-office-correction-2026-07-13

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| System Matrix | Upstairs room routing | NEEDS_TESTING | NEEDS_TESTING, corrected again | Top right guest/hall bath removed from this current master-side upstairs section. |
| System Matrix | Upstairs structure | NEEDS_TESTING | NEEDS_TESTING, corrected | Office now occupies the top right area. Primary suite bath remains lower left. |
| Object Interaction Matrix | Primary Suite Bath | NEEDS_TESTING | NEEDS_TESTING, fixture layout corrected | Shower moved to lower west corner, tub moved to wall, sink moved into suite foyer, toilet remains lower right. |
| Object Interaction Matrix | Guest/Hall Bath | NEEDS_TESTING | REVERTED from current upstairs section | Removed from this master-side section. Future public/guest bath belongs in expanded upstairs wing. |
| Object Interaction Matrix | Office | NEEDS_TESTING | NEEDS_TESTING, expanded | Office footprint expanded across former bath area and gained a temporary office couch. |
| Object Interaction Matrix | Suite Foyer | NEEDS_TESTING | NEEDS_TESTING, restricted openings | Removed closet and hall pass-throughs. Foyer now acts as private vanity connector from bedroom to bath. |
| Asset Pipeline | Upstairs anime assets | PLANNED | PLANNED, blocked on final upstairs plan | Do not build final upstairs PNGs until the expanded upstairs wing and current master suite structure pass browser review. |

## Required browser checks

```txt
No boot error.
No blank canvas.
Top right bathroom is removed.
Office extends into the former top right bathroom area.
Office couch does not block office or hall pathing.
Primary shower is in lower west/bottom-left bathroom corner.
Bathtub is on the bathroom wall area.
Primary sink is in suite foyer/vanity connector.
Primary toilet remains lower right.
Suite foyer does not open into closet or hall.
Bedroom to hall works.
Bedroom to suite foyer works.
Bedroom to closet works.
Suite foyer to master bath works.
Closet to master bath works.
Stairs and upstairs landing still work.
```

## Do not claim complete yet

```txt
expanded upstairs east/west wing
small floor navigation arrows
larger usable play area
future kids/guest bedrooms
future guest bath away from primary suite
final anime top down PNG room and object assets
browser verified pathing
```
