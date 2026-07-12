# Development Matrix Append, 2026-07-12, Manual Tap Routing Fix

Status: IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-manual-tap-routing-fix-2026-07-12

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Movement Matrix | Direct tap movement | BROKEN REGRESSION | PARTIAL, NEEDS_BROWSER_TESTING | Manual tap commands now interrupt stale timed actions before routing. |
| Animation Matrix | Movement priority | BROKEN REGRESSION | PARTIAL, NEEDS_BROWSER_TESTING | Clearing stale action timers prevents seated/eating/shower pose from winning during manual movement. |
| Routing Matrix | Open floor taps | NEEDS_CORRECTION | PARTIAL, NEEDS_BROWSER_TESTING | Direct movement tries nearby open points if the exact clicked point is not routable. |
| UI Command Matrix | Player authority | TOO WEAK | ACTIVE | Direct player commands now override autonomous or timed activity state. |

## Required browser checks

```txt
Start any timed seated/eating/shower activity.
Tap open floor.
Confirm the actor cancels the timed activity and walks.
Tap near dining table and nearby door lanes.
Confirm movement does not show No route unless truly blocked.
Confirm object commands still start normally after reaching their target.
```
