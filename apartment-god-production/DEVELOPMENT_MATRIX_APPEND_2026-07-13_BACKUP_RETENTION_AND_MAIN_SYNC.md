# Development Matrix Append, 2026-07-13, Backup Retention and Main Sync

Status: IMPLEMENTED, NEEDS_RENDER_BROWSER_TESTING
Branch: phaser-migration, main synced from phaser-migration
Backup branch: backup/main-before-render-update-2026-07-13-ten-backups-policy-and-manifest-sync

## Matrix rows affected

| Matrix area | Row | Previous state | New state | Notes |
|---|---|---|---|---|
| Backup Matrix | Routine backup retention | 5 routine backups per work stream | 10 routine backups per work stream | Kam requested deeper rollback depth because small changes can expose unrelated regressions after older backups rotate out. |
| Backup Matrix | Pruning threshold | 6th routine backup | 11th routine backup | Oldest routine backup in a work stream is only pruned/replaced after the 10-backup window unless Kam says keep it. |
| Backup Matrix | Regression-sensitive backups | Partially protected | Stronger protection | Vehicle/garage and routing regressions are now explicitly keep-until-Kam-clears cases. |
| Render Branch Matrix | main update | Awaiting explicit Kam approval | UPDATED, NEEDS_RENDER_BROWSER_TESTING | Kam explicitly asked that work be pushed to main so he can test it. Main was backed up first. |
| Render Settings Matrix | Render config | UNCHANGED | UNCHANGED | No Render settings changed and no manual Render trigger performed. |
| Vehicle Matrix | Deep car luggage/seat system | NOT COMPLETE | STILL_NEEDED | Current sync exposes latest branch to Render, but one-door-per-person and pop-out seat/retract system still require a dedicated pass. |

## Required browser checks

```txt
Open https://apartment-god-phaser.onrender.com
Hard refresh if needed.
Confirm latest main playable has the garage bike mount work.
Confirm no Render settings were changed.
Confirm whether current car luggage/door flow still shows the simplified broad boarding, because that remains a separate required fix.
```
