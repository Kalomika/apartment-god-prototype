# Development Matrix Append, 2026-07-13, Upstairs Structure Pass

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-upstairs-structure-2026-07-13

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| System Matrix | Upstairs visual renderer / house layout | NEEDS_TESTING | NEEDS_TESTING, structural layout expanded | Upstairs now has primary suite bath, guest bedroom, landing, closet connection, and adjusted room boxes. |
| Object Interaction Matrix | Bed | NEEDS_TESTING | NEEDS_TESTING, primary and guest bed | Primary bed shrunk; guest bed added. |
| Object Interaction Matrix | Shower | NEEDS_TESTING | NEEDS_TESTING, public and primary showers | Existing upstairs bath remains public/guest bath; new primary shower added. |
| Object Interaction Matrix | Toilet | NEEDS_TESTING | NEEDS_TESTING, public and primary toilets | New primary toilet path through closet/master bath. |
| Object Interaction Matrix | Sink | NEEDS_TESTING | NEEDS_TESTING, primary bath sink added | New sink added to primary bath. |
| Object Interaction Matrix | Bathtub | PLANNED | NEEDS_TESTING | New primary bathtub object added using current shower interaction fallback. |
| Object Interaction Matrix | Bedroom closet | NEEDS_TESTING | NEEDS_TESTING, now routes to primary bath | Closet connects bedroom to primary suite bath. |
| Object Interaction Matrix | Guest bedroom | PLANNED | NEEDS_TESTING | Guest room added in lower upstairs area with bed, desk, nightstand, light, window. |
| Visual Matrix | Procedural fallback | PARTIAL | PARTIAL, structural fallback only | Bathtub and nightstand are temporary fallback drawings, not final assets. |
| Asset Pipeline | Future upstairs assets | PLANNED | PLANNED with stable target inventory | Use this committed structure as PNG target inventory after audit. |

## Required browser checks

```txt
Boot with no blank canvas.
Upstairs renders all new rooms.
Stairs/hall/landing/guest room/master bedroom/closet/master bath routing works.
Public upstairs bath remains accessible from hall.
Primary bath only routes through bedroom/closet pathway.
Guest bedroom objects do not block landing/stairs.
New bathtub/nightstands render as recognizable procedural fallback only.
No PNG assets were committed.
```

## Do not claim complete yet

```txt
dedicated bath action and animation
final anime PNG room/object assets
final door open state sprites
final bed/nightstand/tub object assets
browser verified pathing
```
