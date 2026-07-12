# Development Matrix Append, 2026-07-12, No Broad Rule and Runtime Specificity Fixes

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch: backup/phaser-migration-before-no-broad-visual-rules-and-room-fixes-2026-07-12

## New production rule

The No Broad Implementation Rule is now an active production rule:

```txt
Apartment God must not use broad, generic, or shared placeholder logic for visuals, poses, animations, object interactions, room layouts, or activity states when a specific state is required.
```

Source document:

```txt
docs/APARTMENT_GOD_NO_BROAD_IMPLEMENTATION_RULE.md
```

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| System Matrix | Visual implementation discipline | PARTIAL | ACTIVE RULE | Broad generic implementation is now explicitly disallowed. |
| Object Interaction Matrix | Bed | NEEDS_CORRECTION | PARTIAL, NEEDS_TESTING | Bed dimensions and cover rendering corrected so sleep uses lower body blanket coverage. |
| Object Interaction Matrix | Bedroom closet | NEEDS_CORRECTION | PARTIAL, NEEDS_TESTING | Dresser/chest solution replaced with bedroom walk in closet object placement. |
| Object Interaction Matrix | Dog bath | PARTIAL | PARTIAL, NEEDS_TESTING | Backyard dog bath near kennel is the wash dog target. |
| Animation Matrix | Main character idle | PARTIAL | PARTIAL, NEEDS_TESTING | Main actors now use a cleaner Test Subject style inspired core body read. |
| Animation Matrix | Main character walk | PARTIAL | PARTIAL, NEEDS_TESTING | Main actors now use cleaner top down walk construction. |
| Animation Matrix | Main character sit | PARTIAL | PARTIAL, NEEDS_TESTING | Main actors now use specific sitting, desk, TV, phone, reading, eating poses. |
| Animation Matrix | Shower | NEEDS_CORRECTION | PARTIAL, NEEDS_TESTING | Blur removed from character render path and replaced with sliding door, privacy block, and clothes pile cue. |
| Animation Matrix | Wash dog | PLANNED/PARTIAL | PARTIAL, NEEDS_TESTING | Wash dog action now maps to dog bath and a specific wash pose instead of broad petting. |

## Required browser checks

```txt
Boot phaser-migration.
Open upstairs.
Confirm bed no longer looks too long.
Confirm sleeping actors have lower body covered by blanket.
Confirm bedroom dresser/chest is gone or replaced by closet behavior.
Confirm main character idle, walk, and sit improved without carrying over rejected workout waddles.
Assign shower and confirm no blur cloud censorship.
Confirm shower shows sliding/privacy/clothes cue.
Go to backyard kennel area.
Assign Wash Dog at the dog bath and confirm dog + actor wash pose appears.
```

## Known risks

This is still Canvas/vector runtime art, not final painted PNG sprite sheets. The No Broad rule is now documented, but the canonical handbook and main matrix should absorb this append directly in the next documentation sync if a line-safe doc edit environment is available.
