# Development Matrix Append, 2026-07-14, Human Renderer Working Revert

Status: PARTIAL IMPLEMENTED, NEEDS_RENDER_BROWSER_TESTING
Branch: main
Backup branch: backup/main-before-human-renderer-working-revert-2026-07-14

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Character Visual Matrix | Human actor body renderer | BROKEN | REVERTED_STYLE, NEEDS_RENDER_BROWSER_TESTING | Static split/two-sided body renderer replaced with earlier animated human body style. |
| Animation Matrix | Walking | BROKEN | PARTIAL, NEEDS_RENDER_BROWSER_TESTING | Walking limbs are animated again. |
| Animation Matrix | Weight lifting | BROKEN | PARTIAL, NEEDS_RENDER_BROWSER_TESTING | Weight lifting now has moving barbell animation again. |
| Animation Matrix | Treadmill | BROKEN | PARTIAL, NEEDS_RENDER_BROWSER_TESTING | Treadmill activity pose restored. |
| Animation Matrix | Heavy bag | BROKEN | PARTIAL, NEEDS_RENDER_BROWSER_TESTING | Heavy bag pose restored. |
| Sleep Matrix | Bed placement | PARTIAL | PRESERVED, NEEDS_RENDER_BROWSER_TESTING | Current main bed anchoring is preserved. |
| Sleep Matrix | Head visibility under covers | BROKEN | PARTIAL, NEEDS_RENDER_BROWSER_TESTING | Sleep pose draws blanket over lower body and head after blanket so head should remain visible. |
| Dog Visual Matrix | Dog atlas renderer | DO NOT TOUCH | PRESERVED | `renderEntities.js` still skips dog drawing so current dog work remains separate. |
| Vehicle Matrix | Garage vehicle work | DO NOT TOUCH | PRESERVED | No vehicle files changed. |

## Required browser checks

```txt
Walking animation.
Lift weights animation.
Treadmill pose.
Heavy bag pose.
Sleep placement on bed.
Head visible while sleeping.
Dog still appears through dog renderer.
Garage vehicles unchanged.
```
