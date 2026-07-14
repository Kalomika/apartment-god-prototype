# 2026-07-14, Human Renderer Working Revert

Status: PARTIAL IMPLEMENTED, NEEDS_RENDER_BROWSER_TESTING
Branch: main
Backup branch:
backup/main-before-human-renderer-working-revert-2026-07-14

## Files changed

```txt
src/renderEntities.js
```

Runtime files changed: yes
Character renderer files changed: yes
Vehicle files changed: no
Dog renderer files changed: no
Action/autonomy files changed: no
Phaser architecture files changed: no
Render playable branch updated: yes, main only
Deploy performed: no
Render settings changed: no
Protected repo touched: no

## Summary

Kam requested reverting the broken human character visuals and animations to the last known working style where the actors walked, lifted weights with an animation, slept properly in bed, and did not render as a split two-sided body or hide their heads under covers.

Because `main` and `phaser-migration` had diverged and another agent had touched stabilization files, this was not done as a broad branch reset. Only `src/renderEntities.js` on `main` was surgically changed.

## Implementation details

- Preserved current main behavior that skips dog drawing in `renderEntities.js`, so the current dog atlas/overlay work remains separate.
- Preserved current main bed anchoring via `renderAnchor()` and `actor.sleepObjectId` fallback to `bed`.
- Replaced the static top-down human body renderer with the previous animated human renderer style.
- Restored animated walking limbs.
- Restored weight lifting animation with moving barbell.
- Restored treadmill and heavy bag activity poses.
- Restored seated prop poses for TV, desk, study, reading, phone, games, eating, and table use.
- Restored sleep body/head visibility by drawing the blanket over the lower body and drawing the head afterward.
- Kept the change isolated to the human renderer file to avoid overwriting another agent's action lifecycle, autonomy, bathroom routing, dog atlas, or Phaser migration work.

## Testing performed

```txt
Local node --check was run against the generated replacement file before writing.
GitHub update succeeded on main.
```

No browser or Render test was performed by the assistant.

## Testing requested

```txt
Open https://apartment-god-phaser.onrender.com
Hard refresh.
Check walking animation.
Check lifting weights animation.
Check treadmill and heavy bag poses.
Check sleep placement in bed.
Confirm heads are visible and not buried under covers.
Confirm dog rendering still works and was not reverted.
Confirm vehicle garage work was not changed.
```

## Known risks

This is a surgical renderer revert on `main` only because branch divergence showed another agent working on stabilization files. `phaser-migration` was not overwritten in this pass. If the Phaser migration branch needs this same renderer fix later, it should be applied after checking the current branch owner/workstream so it does not collide.
