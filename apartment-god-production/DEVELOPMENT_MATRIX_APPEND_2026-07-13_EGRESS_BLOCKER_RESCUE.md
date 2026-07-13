# Development Matrix Append, 2026-07-13, Egress and Couch Blocker Rescue

Status: NEEDS_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-egress-blocker-rescue-2026-07-13

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| System Matrix | Upstairs room routing | NEEDS_TESTING | NEEDS_TESTING, rescue patched | Primary bedroom now has a direct hall doorway and aligned upper hall geometry. |
| System Matrix | Doorway graph | NEEDS_TESTING | NEEDS_TESTING, rescue patched | Bedroom to hall, closet to master bath, master bath to hall, hall to landing/stairs, guest room to landing are aligned. |
| Object Interaction Matrix | Couch | NEEDS_TESTING | NEEDS_TESTING, collider relaxed | Couches are now enterable so actors do not get trapped by seating collision. |
| Object Interaction Matrix | Primary suite bath | NEEDS_TESTING | NEEDS_TESTING, egress patched | Master bath now has route access from closet and hall, pending browser validation. |
| Risk Matrix | Invisible blockers | High | High, rescue pending browser test | Couch trap addressed through enterable seating surfaces. Browser test required. |

## Required browser checks

```txt
Primary bedroom to hall path works.
Primary bedroom to stairs path works.
Primary bedroom to guest/hall bath path works.
Primary bedroom to closet and primary suite bath path works.
Couch/seat to fridge/dining table path works.
No invisible couch blocker remains.
No boot error or blank canvas.
```

## Do not claim complete yet

```txt
seat anchor system
explicit couch exit points
final PNG seating objects
browser verified route graph
```
