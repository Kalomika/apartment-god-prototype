# 2026-07-13, Backup Retention Increase and Main Render Branch Sync

Status: IMPLEMENTED, NEEDS_RENDER_BROWSER_TESTING
Branch: phaser-migration, then main synced from phaser-migration
Commit:
- Backup policy update: e33f37b38ad2d2d1e13afc64db957f88aa69d6cc
- Main was moved to phaser-migration head after a main backup was created.

## Files changed

```txt
docs/APARTMENT_GOD_BACKUP_POLICY.md
apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-13_BACKUP_RETENTION_AND_MAIN_SYNC.md
apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-13_BACKUP_RETENTION_AND_MAIN_SYNC.md
```

Runtime files changed: no in this specific policy/sync pass
Render playable branch updated: yes, main was synced from phaser-migration
Backup branch:
backup/main-before-render-update-2026-07-13-ten-backups-policy-and-manifest-sync
Main backup created: yes
Main touched: yes
Deploy performed: no
Render settings changed: no
Manual Render trigger: no
Protected repo touched: no

## Summary

Kam explicitly instructed that backup retention should be safer and closer to 10 routine backups because small changes can still expose unrelated regressions after older backups rotate out. The backup policy was updated from 5 retained routine backups per major work stream to 10. After that, the Render playable branch `main` was backed up and moved to match `phaser-migration` so Kam can test through the Render playable URL.

## Implementation details

- `docs/APARTMENT_GOD_BACKUP_POLICY.md` now says to keep the latest 10 routine backups per major work stream.
- The pruning threshold is now the 11th routine backup in the same work stream.
- The reason section now explains that 10 backups gives safer rollback depth when multiple agents are touching runtime, visuals, vehicles, routing, and docs.
- Vehicle/garage and routing regressions were added to the special keep-until-Kam-clears list.
- A current main backup branch was created before updating main.
- `main` was fast-forwarded to the current `phaser-migration` head.
- Render settings were not changed.
- Render was not manually triggered.

## Testing performed

```txt
GitHub compare main..phaser-migration before sync showed phaser-migration ahead.
Created a current main backup branch.
Updated main ref to phaser-migration head without force.
GitHub compare main..phaser-migration after sync showed identical, 0 ahead, 0 behind.
```

No browser or Render runtime test was performed by the assistant.

## Testing requested

```txt
Open https://apartment-god-phaser.onrender.com
Hard refresh if needed.
Test the garage vehicle work directly:
1. Parked bicycle, motorbike, and ATV handlebars are visible.
2. Bicycle/motorbike/ATV do not use car doors.
3. Rider walks to bike, mounts, appears on top of the bike, leaves, returns mounted, dismounts, then walks inside.
4. Cars still use door based boarding.
5. Confirm whether the deeper luggage/seat-pop-out car system is still missing, because that system is not fully implemented yet.
```

## Known risks

The deep car luggage/seat mechanism requested earlier is not complete. Current car flow remains simplified with trunk open/load/close and broad boarding. A separate car boarding/luggage overhaul is still required for one-door-per-person, seat pop-out, character sitting on the seat, and seat retracting into the car.
