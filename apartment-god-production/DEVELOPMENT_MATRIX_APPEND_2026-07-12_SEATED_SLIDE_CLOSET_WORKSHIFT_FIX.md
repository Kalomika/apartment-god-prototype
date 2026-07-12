# Development Matrix Append, 2026-07-12, Seated Slide, Closet, Shower, Table, and Work Shift Fix

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-seated-slide-table-shower-vehicle-fix-2026-07-12

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Animation Matrix | Movement priority | BROKEN REGRESSION | PARTIAL, NEEDS_TESTING | Moving actors now render as walking before object specific activity poses. |
| Animation Matrix | Test Subject routing | BROKEN REGRESSION | PARTIAL, NEEDS_TESTING | Test Subject pose resolution now lets movement override action mapping while pathing. |
| Animation Matrix | Shower privacy | BROKEN REGRESSION | PARTIAL, NEEDS_TESTING | Removed blocky mosaic censor overlay and gated shower overlays to stationary actors at showers. |
| Object Interaction Matrix | Dining table | NEEDS_CORRECTION | PARTIAL, NEEDS_TESTING | Table moved up into kitchen so it does not block the doorway path. |
| Floor Plan Matrix | Upstairs closet | NEEDS_CORRECTION | PARTIAL, NEEDS_TESTING | Closet is now a structural walk in closet room at the left end of the upstairs hall with a bedroom doorway trigger. |
| Career / Routine Matrix | Work shifts | NEEDS_CORRECTION | PARTIAL, NEEDS_TESTING | Regular careers now use four hour windows, three or four days per week, with lighter need drain. |
| Travel / Offsite Matrix | Work duration | NEEDS_CORRECTION | PARTIAL, NEEDS_TESTING | Work destination is shortened to represent a four hour shift in playable time. |
| Vehicle Matrix | Door and remote timing | UNTOUCHED | NEEDS_SEPARATE_VEHICLE_PASS | Not changed because another AI is actively updating vehicles and the user warned not to step on that work. |
| Calendar Matrix | Same day household planning | PARTIAL | STILL_NEEDED | Calendar travel exists, but autonomous chores/shared activity scheduling needs a dedicated pass. |

## Required browser checks

```txt
Move a character to multiple objects and confirm movement pose always wins while pathing.
Send a character to dining table and confirm eating appears only after arrival.
Check dining table location and kitchen/entry path clearance.
Send character to shower and confirm no blocky blur/mosaic follows them.
Check upstairs closet room location and bedroom entry.
Allow work time to occur and confirm shifts are shorter and not every weekday.
```
