# Development Matrix Append, 2026-07-13, Bike Mounted Rider Pass

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-bike-mounted-rider-pass-2026-07-13

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Vehicle Matrix | Bicycle | NEEDS_CORRECTION | PARTIAL, NEEDS_BROWSER_TESTING | Bicycle now receives visible handlebar overlay and bike specific mount flow. |
| Vehicle Matrix | Motorbike | NEEDS_CORRECTION | PARTIAL, NEEDS_BROWSER_TESTING | Motorbike now receives visible handlebar overlay and bike specific mount/dismount flow. |
| Vehicle Matrix | ATV | NEEDS_CORRECTION | PARTIAL, NEEDS_BROWSER_TESTING | ATV now receives handlebar/seat overlay and mounted rider overlay. |
| Vehicle Matrix | Car boarding | NEEDS_TESTING | PRESERVED, NEEDS_REGRESSION_TEST | Door based car boarding was left in place for cars. |
| Animation Matrix | Bike mount | PLANNED | PARTIAL, NEEDS_BROWSER_TESTING | First pass bike mount phases exist. Final sprite frames still needed. |
| Animation Matrix | Bike dismount | PLANNED | PARTIAL, NEEDS_BROWSER_TESTING | First pass return dismount phase exists. Final sprite frames still needed. |
| Visual Matrix | Bike handlebars | NEEDS_CORRECTION | PARTIAL, NEEDS_BROWSER_TESTING | Runtime overlay adds visible handlebars to parked and animated bike type vehicles. PNG files not yet regenerated. |
| Visual Matrix | Mounted rider | NEEDS_CORRECTION | PARTIAL, NEEDS_BROWSER_TESTING | Rider appears as overlay on bike during mounted travel phases. |
| Asset Matrix | Bike PNG updates | PLANNED | STILL_NEEDED | Real PNG bike assets still need handlebar and mounted rider frame updates through the PNG upload fallback/API route. |

## Required browser checks

```txt
Parked bike handlebar readability.
Parked motorbike handlebar readability.
Parked ATV handlebar readability.
Bicycle trip mount sequence.
Motorbike trip mount sequence.
ATV trip mount sequence.
Return dismount sequence.
Cars still open doors and board normally.
No duplicate rider drawing.
No rider disappearing before mounted overlay appears.
```
